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
    "Access-Control-Allow-Headers": "Content-Type",
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
  const rl = await checkRateLimit(`${RATE_LIMIT_KEYS.api_general}:${ip}`);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "rate_limited", retryAfter: rl.retryAfter },
      {
        status: 429,
        headers: {
          ...corsHeaders(origin),
          "Retry-After": rl.retryAfter?.toString() ?? "60",
          "X-RateLimit-Limit": rl.limit?.toString() ?? "100",
          "X-RateLimit-Remaining": rl.remaining?.toString() ?? "0",
          "X-RateLimit-Reset": rl.retryAfter?.toString() ?? "60",
        },
      },
    );
  }

  const url = new URL(request.url);
  const limit = Math.min(parseInt(url.searchParams.get("limit") ?? "20", 10), 100);
  const category = url.searchParams.get("category");
  const severity = url.searchParams.get("severity");
  const provider = url.searchParams.get("provider");
  const euRisk = url.searchParams.get("eu_risk");

  // API Key Authentication (Basic check for now, matching ENTERPRISE_API_KEY env or specific tier)
  const authHeader = request.headers.get("authorization");
  const validApiKey = process.env.ENTERPRISE_API_KEY || "sk_alpar_test_123";
  if (
    !authHeader ||
    !authHeader.startsWith("Bearer ") ||
    authHeader.split(" ")[1] !== validApiKey
  ) {
    return NextResponse.json(
      { error: "unauthorized", message: "Invalid or missing API key." },
      { status: 401, headers: corsHeaders(origin) },
    );
  }

  const supabase = await createServerClient();
  let query = supabase
    .from("incidents")
    .select(
      "id, title_masked, description_masked, severity, status, category, eu_act_risk_category, is_anonymous, incident_date, views_count, upvotes_count, created_at, ai_provider_id, user_id, cross_audit_truth_score, cross_audit_confidence, ai_models(name), is_expert, expert_fix",
    )
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (category) query = query.eq("category", category as never);
  if (severity) query = query.eq("severity", severity as never);
  if (euRisk) query = query.eq("eu_act_risk_category", euRisk as never);

  const { data, error } = await query;
  if (error) {
    logger.error("API v1 incidents error", undefined, error instanceof Error ? error : undefined);
    return NextResponse.json(
      { error: "internal_error" },
      { status: 500, headers: corsHeaders(origin) },
    );
  }

  let items = (data ?? []) as Array<Record<string, unknown>>;
  if (provider) {
    items = items.filter((i) => {
      const model = i["ai_models"] as { name: string } | null;
      return model?.name?.toLowerCase().includes(provider.toLowerCase());
    });
  }

  const out = items.map((row) => ({
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
    model: (row["ai_models"] as { name: string } | null)?.name ?? null,
    truth_score: row["cross_audit_truth_score"] ?? null,
    confidence: row["cross_audit_confidence"] ?? null,
    verification_level: row["is_expert"] ? "expert" : "community",
    expert_fix: row["expert_fix"] ?? null,
    created_at: row["created_at"],
  }));

  return NextResponse.json(
    {
      data: out,
      meta: { count: out.length, limit, generated_at: new Date().toISOString() },
    },
    {
      status: 200,
      headers: {
        ...corsHeaders(origin),
        "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=600",
        "X-RateLimit-Limit": rl.limit?.toString() ?? "100",
        "X-RateLimit-Remaining": rl.remaining?.toString() ?? "100",
        "X-RateLimit-Reset": rl.retryAfter?.toString() ?? "0",
      },
    },
  );
}
