import "server-only";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export const RATE_LIMIT_KEYS = {
  incident_submission: "ratelimit:incident_submission",
  suggestion_submission: "ratelimit:suggestion_submission",
  auth_signin: "ratelimit:auth_signin",
  api_general: "ratelimit:api_general",
} as const;

let _redis: Redis | null = null;
let _limiters: Record<string, Ratelimit> | null = null;

function getLimiters(): Record<string, Ratelimit> {
  if (_limiters) return _limiters;
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return {};
  }
  if (!_redis) {
    _redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  }
  _limiters = {
    [RATE_LIMIT_KEYS.incident_submission]: new Ratelimit({
      redis: _redis,
      limiter: Ratelimit.slidingWindow(5, "1 h"),
      analytics: true,
      prefix: "alpar",
    }),
    [RATE_LIMIT_KEYS.suggestion_submission]: new Ratelimit({
      redis: _redis,
      limiter: Ratelimit.slidingWindow(10, "1 d"),
      analytics: true,
      prefix: "alpar",
    }),
    [RATE_LIMIT_KEYS.auth_signin]: new Ratelimit({
      redis: _redis,
      limiter: Ratelimit.slidingWindow(10, "15 m"),
      analytics: true,
      prefix: "alpar",
    }),
    [RATE_LIMIT_KEYS.api_general]: new Ratelimit({
      redis: _redis,
      limiter: Ratelimit.slidingWindow(100, "1 m"),
      analytics: true,
      prefix: "alpar",
    }),
  };
  return _limiters;
}

export async function checkRateLimit(
  key: string
): Promise<{ ok: boolean; retryAfter?: number; remaining?: number }> {
  const limiters = getLimiters();
  const baseKey = key.split(":")[0] ?? key;
  const limiter = limiters[baseKey];
  if (!limiter) {
    return { ok: true };
  }
  try {
    const { success, remaining, reset } = await limiter.limit(key);
    return {
      ok: success,
      remaining,
      retryAfter: Math.max(0, Math.ceil((reset - Date.now()) / 1000)),
    };
  } catch (e) {
    console.error("rate limit check failed", e);
    if (process.env.NODE_ENV === "production") {
      return { ok: false, retryAfter: 60 };
    }
    return { ok: true };
  }
}
