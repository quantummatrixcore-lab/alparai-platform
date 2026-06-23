import "server-only";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { logger } from "./logger";

export const RATE_LIMIT_KEYS = {
  incident_submission: "ratelimit:incident_submission",
  suggestion_submission: "ratelimit:suggestion_submission",
  contact_submission: "ratelimit:contact_submission",
  takedown_submission: "ratelimit:takedown_submission",
  auth_signin: "ratelimit:auth_signin",
  auth_magiclink: "ratelimit:auth_magiclink",
  search_query: "ratelimit:search_query",
  export_request: "ratelimit:export_request",
  api_general: "ratelimit:api_general",
  model_review: "ratelimit:model_review",
  model_feature_request: "ratelimit:model_feature",
  dilemma_vote: "ratelimit:dilemma_vote",
  incident_vote: "ratelimit:incident_vote",
  whistleblower_submission: "ratelimit:whistleblower_submission",
} as const;

let _redis: Redis | null = null;
let _limiters: Record<string, Ratelimit> | null = null;

function getLimiters(): Record<string, Ratelimit> {
  if (_limiters) return _limiters;
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("CRITICAL: Upstash Redis environment variables are missing in production.");
    }
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
    [RATE_LIMIT_KEYS.contact_submission]: new Ratelimit({
      redis: _redis,
      limiter: Ratelimit.slidingWindow(5, "1 h"),
      analytics: true,
      prefix: "alpar",
    }),
    [RATE_LIMIT_KEYS.takedown_submission]: new Ratelimit({
      redis: _redis,
      limiter: Ratelimit.slidingWindow(3, "1 d"),
      analytics: true,
      prefix: "alpar",
    }),
    [RATE_LIMIT_KEYS.auth_signin]: new Ratelimit({
      redis: _redis,
      limiter: Ratelimit.slidingWindow(10, "15 m"),
      analytics: true,
      prefix: "alpar",
    }),
    [RATE_LIMIT_KEYS.auth_magiclink]: new Ratelimit({
      redis: _redis,
      limiter: Ratelimit.slidingWindow(5, "15 m"),
      analytics: true,
      prefix: "alpar",
    }),
    [RATE_LIMIT_KEYS.search_query]: new Ratelimit({
      redis: _redis,
      limiter: Ratelimit.slidingWindow(30, "1 m"),
      analytics: true,
      prefix: "alpar",
    }),
    [RATE_LIMIT_KEYS.export_request]: new Ratelimit({
      redis: _redis,
      limiter: Ratelimit.slidingWindow(5, "1 h"),
      analytics: true,
      prefix: "alpar",
    }),
    [RATE_LIMIT_KEYS.api_general]: new Ratelimit({
      redis: _redis,
      limiter: Ratelimit.slidingWindow(100, "1 m"),
      analytics: true,
      prefix: "alpar",
    }),
    [RATE_LIMIT_KEYS.model_review]: new Ratelimit({
      redis: _redis,
      limiter: Ratelimit.slidingWindow(3, "1 d"),
      analytics: true,
      prefix: "alpar",
    }),
    [RATE_LIMIT_KEYS.model_feature_request]: new Ratelimit({
      redis: _redis,
      limiter: Ratelimit.slidingWindow(5, "1 d"),
      analytics: true,
      prefix: "alpar",
    }),
    [RATE_LIMIT_KEYS.dilemma_vote]: new Ratelimit({
      redis: _redis,
      limiter: Ratelimit.slidingWindow(3, "1 d"),
      analytics: true,
      prefix: "alpar",
    }),
    [RATE_LIMIT_KEYS.incident_vote]: new Ratelimit({
      redis: _redis,
      limiter: Ratelimit.slidingWindow(20, "1 m"),
      analytics: true,
      prefix: "alpar",
    }),
    [RATE_LIMIT_KEYS.whistleblower_submission]: new Ratelimit({
      redis: _redis,
      limiter: Ratelimit.slidingWindow(3, "1 d"),
      analytics: true,
      prefix: "alpar",
    }),
  };
  return _limiters;
}

export async function checkRateLimit(
  key: string,
): Promise<{ ok: boolean; retryAfter?: number; remaining?: number }> {
  const limiters = getLimiters();
  const parts = key.split(":");
  const baseKey = parts.length >= 2 ? `${parts[0]}:${parts[1]}` : key;
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
    logger.error("rate limit check failed", { key }, e instanceof Error ? e : undefined);
    if (process.env.NODE_ENV === "production") {
      return { ok: false, retryAfter: 60 };
    }
    return { ok: true };
  }
}
