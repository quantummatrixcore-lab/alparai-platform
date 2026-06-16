import { NextResponse } from "next/server";

interface HealthCheck {
  status: "healthy" | "unhealthy";
}

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(): Promise<NextResponse<HealthCheck>> {
  let dbStatus = true;
  let redisStatus = true;

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/ai_providers?select=id&limit=1`,
        {
          headers: {
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          },
          signal: AbortSignal.timeout(3000),
        },
      );
      dbStatus = res.ok;
    } catch {
      dbStatus = false;
    }
  }

  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    try {
      const res = await fetch(`${process.env.UPSTASH_REDIS_REST_URL}/ping`, {
        headers: { Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}` },
        signal: AbortSignal.timeout(3000),
      });
      redisStatus = res.ok;
    } catch {
      redisStatus = false;
    }
  }

  const overallStatus = dbStatus && redisStatus ? "healthy" : "unhealthy";

  return NextResponse.json(
    { status: overallStatus },
    {
      status: overallStatus === "unhealthy" ? 503 : 200,
      headers: { "Cache-Control": "no-store" },
    },
  );
}
