import { NextResponse } from "next/server";

interface HealthCheck {
  status: "healthy" | "degraded" | "unhealthy";
  timestamp: string;
  version: string;
  checks: {
    app: { status: "up" | "down" };
    database: { status: "up" | "down" | "unchecked"; latencyMs?: number };
    redis: { status: "up" | "down" | "unchecked"; latencyMs?: number };
  };
}

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(): Promise<NextResponse<HealthCheck>> {
  const timestamp = new Date().toISOString();
  const version = process.env.npm_package_version ?? "1.0.0";
  let dbStatus: "up" | "down" | "unchecked" = "unchecked";
  let dbLatency: number | undefined;
  let redisStatus: "up" | "down" | "unchecked" = "unchecked";
  let redisLatency: number | undefined;

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const start = performance.now();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/`, {
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        },
        signal: AbortSignal.timeout(3000),
      });
      dbLatency = Math.round(performance.now() - start);
      dbStatus = res.ok ? "up" : "down";
    } catch {
      dbLatency = Math.round(performance.now() - start);
      dbStatus = "down";
    }
  }

  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    const start = performance.now();
    try {
      const res = await fetch(`${process.env.UPSTASH_REDIS_REST_URL}/ping`, {
        headers: { Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}` },
        signal: AbortSignal.timeout(3000),
      });
      redisLatency = Math.round(performance.now() - start);
      redisStatus = res.ok ? "up" : "down";
    } catch {
      redisLatency = Math.round(performance.now() - start);
      redisStatus = "down";
    }
  }

  const allUp = dbStatus !== "down" && redisStatus !== "down";
  const anyDown = dbStatus === "down" || redisStatus === "down";
  const overallStatus = anyDown ? "unhealthy" : allUp ? "healthy" : "degraded";

  const health: HealthCheck = {
    status: overallStatus,
    timestamp,
    version,
    checks: {
      app: { status: "up" },
      database: { status: dbStatus, ...(dbLatency !== undefined && { latencyMs: dbLatency }) },
      redis: { status: redisStatus, ...(redisLatency !== undefined && { latencyMs: redisLatency }) },
    },
  };

  return NextResponse.json(health, {
    status: overallStatus === "unhealthy" ? 503 : 200,
    headers: { "Cache-Control": "no-store" },
  });
}
