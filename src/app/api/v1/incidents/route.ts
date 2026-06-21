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
      { status: 429, headers: corsHeaders(origin) },
    );
  }

  const url = new URL(request.url);
  const limit = Math.min(parseInt(url.searchParams.get("limit") ?? "20", 10), 100);
  const category = url.searchParams.get("category");
  const severity = url.searchParams.get("severity");
  const provider = url.searchParams.get("provider");

  const supabase = await createServerClient();
  let query = supabase
    .from("incidents")
    .select(
      "id, title_masked, description_masked, severity, status, category, is_anonymous, incident_date, views_count, upvotes_count, created_at, ai_provider_id, user_id, ai_models(name)",
    )
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (category) query = query.eq("category", category as never);
  if (severity) query = query.eq("severity", severity as never);

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
    is_anonymous: row["is_anonymous"] ?? false,
    incident_date: row["incident_date"],
    views: row["views_count"] ?? 0,
    upvotes: row["upvotes_count"] ?? 0,
    model: (row["ai_models"] as { name: string } | null)?.name ?? null,
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
      },
    },
  );
}
