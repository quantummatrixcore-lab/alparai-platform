import "server-only";
import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { checkRateLimit, RATE_LIMIT_KEYS } from "@/lib/utils/rate-limit";
import { headers } from "next/headers";
import { logger } from "@/lib/utils/logger";

const ALLOWED_ORIGINS = [
  "https://alparai.com",
  "https://www.alparai.com",
  ...(process.env.NODE_ENV === "development" ? ["http://localhost:3000"] : []),
];

function corsHeaders(origin: string | null) {
  const allowedOrigin =
    origin && ALLOWED_ORIGINS.includes(origin) ? origin : (ALLOWED_ORIGINS[0] ?? "*");
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
  };
}

export async function OPTIONS(request: Request) {
  const origin = request.headers.get("origin");
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(origin),
  });
}

export async function GET(request: Request) {
  const origin = request.headers.get("origin");
  const hdrs = await headers();
  const ip = hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  // 1. API Key Authentication & Tier Identification
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { error: "unauthorized", message: "Missing or invalid Authorization header." },
      { status: 401, headers: corsHeaders(origin) },
    );
  }

  const apiKey = authHeader.split(" ")[1];
  if (!apiKey) {
    return NextResponse.json(
      { error: "unauthorized", message: "API key is empty." },
      { status: 401, headers: corsHeaders(origin) },
    );
  }

  let tier: "free" | "developer" | "enterprise" = "free";
  let rlKey: string = RATE_LIMIT_KEYS.api_free;

  const validEnterpriseKey = process.env.ENTERPRISE_API_KEY || "sk_alpar_test_123";

  if (apiKey === validEnterpriseKey || apiKey.startsWith("sk_alpar_ent_")) {
    tier = "enterprise";
    rlKey = RATE_LIMIT_KEYS.api_enterprise;
  } else if (apiKey.startsWith("sk_alpar_dev_")) {
    tier = "developer";
    rlKey = RATE_LIMIT_KEYS.api_developer;
  } else if (apiKey.startsWith("sk_alpar_free_")) {
    tier = "free";
    rlKey = RATE_LIMIT_KEYS.api_free;
  } else {
    return NextResponse.json(
      { error: "unauthorized", message: "Invalid API key." },
      { status: 401, headers: corsHeaders(origin) },
    );
  }

  // 2. Rate Limit Enforcement
  const rl = await checkRateLimit(`${rlKey}:${ip}`);
  const rateHeaders = {
    ...corsHeaders(origin),
    "X-API-Tier": tier,
    "X-RateLimit-Limit": rl.limit?.toString() ?? "5",
    "X-RateLimit-Remaining": rl.remaining?.toString() ?? "0",
    "X-RateLimit-Reset": rl.retryAfter?.toString() ?? "60",
  };

  if (!rl.ok) {
    return NextResponse.json(
      { error: "rate_limited", retryAfter: rl.retryAfter, tier },
      {
        status: 429,
        headers: {
          ...rateHeaders,
          "Retry-After": rl.retryAfter?.toString() ?? "60",
        },
      },
    );
  }

  // 3. Query Parsing
  const url = new URL(request.url);
  const limit = Math.min(parseInt(url.searchParams.get("limit") ?? "20", 10), 100);
  const category = url.searchParams.get("category");
  const severity = url.searchParams.get("severity");
  const euRisk = url.searchParams.get("eu_risk");
  const provider = url.searchParams.get("provider");
  const model = url.searchParams.get("model");

  const supabase = await createServerClient();

  let selectString = `
    id,
    title_masked,
    description_masked,
    severity,
    status,
    category,
    eu_act_risk_category,
    is_anonymous,
    incident_date,
    views_count,
    upvotes_count,
    created_at,
    cross_audit_truth_score,
    cross_audit_confidence,
    is_expert,
    expert_fix
  `;

  if (provider) {
    selectString += `, ai_providers!inner(name, slug)`;
  } else {
    selectString += `, ai_providers(name, slug)`;
  }

  if (model) {
    selectString += `, ai_models!inner(name)`;
  } else {
    selectString += `, ai_models(name)`;
  }

  let query = supabase
    .from("incidents")
    .select(selectString)
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (category) query = query.eq("category", category as never);
  if (severity) query = query.eq("severity", severity as never);
  if (euRisk) query = query.eq("eu_act_risk_category", euRisk as never);
  if (provider) query = query.eq("ai_providers.slug", provider);
  if (model) query = query.ilike("ai_models.name", `%${model}%`);

  const { data, error } = await query;
  if (error) {
    logger.error("API v1.1 incidents error", undefined, error instanceof Error ? error : undefined);
    return NextResponse.json(
      { error: "internal_error" },
      { status: 500, headers: corsHeaders(origin) },
    );
  }

  const items = (data ?? []) as unknown as Array<Record<string, unknown>>;
  const out = items.map((row) => {
    const providerObj = row["ai_providers"] as { name: string; slug: string } | null;
    const modelObj = row["ai_models"] as { name: string } | null;

    return {
      id: row["id"],
      title: row["title_masked"],
      description: row["description_masked"],
      severity: row["severity"],
      category: row["category"],
      eu_act_risk_category: row["eu_act_risk_category"] ?? null,
      is_anonymous: row["is_anonymous"] ?? false,
      incident_date: row["incident_date"],
      views: row["views_count"] ?? 0,
      upvotes: row["upvotes_count"] ?? 0,
      provider: providerObj ? { name: providerObj.name, slug: providerObj.slug } : null,
      model: modelObj?.name ?? null,
      truth_score: row["cross_audit_truth_score"] ?? null,
      confidence: row["cross_audit_confidence"] ?? null,
      verification_level: row["is_expert"] ? "expert" : "community",
      expert_fix: row["expert_fix"] ?? null,
      created_at: row["created_at"],
    };
  });

  return NextResponse.json(
    {
      data: out,
      meta: {
        count: out.length,
        limit,
        tier,
        generated_at: new Date().toISOString(),
      },
    },
    {
      status: 200,
      headers: {
        ...rateHeaders,
        "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=600",
      },
    },
  );
}
