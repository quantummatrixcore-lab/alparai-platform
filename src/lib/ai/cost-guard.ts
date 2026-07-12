import { Redis } from "@upstash/redis";

export async function isCostKillSwitchActive(): Promise<boolean> {
  if (process.env.COST_KILL_SWITCH === "true") {
    return true;
  }

  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    try {
      const redis = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      });
      const val = await redis.get("cost_kill_switch");
      if (val === "true" || val === true) {
        return true;
      }
    } catch {
      // Fallback silently if Redis is unreachable
    }
  }

  return false;
}
