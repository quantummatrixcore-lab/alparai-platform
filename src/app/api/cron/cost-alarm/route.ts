import { type NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { Redis } from "@upstash/redis";
import { logger } from "@/lib/utils/logger";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const isVercelCron = request.headers.get("x-vercel-cron") === "1";
  const cronSecret = process.env.CRON_SECRET;

  const isAuthorized =
    isVercelCron ||
    (cronSecret && authHeader === `Bearer ${cronSecret}`) ||
    process.env.NODE_ENV !== "production";

  if (!isAuthorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const admin = createAdminClient();
    const currentMonth = new Date().toISOString().slice(0, 7) + "-01";

    // 1. Fetch current monthly costs
    const { data: monthlyCosts, error: monthlyError } = await admin
      .from("finance_monthly_costs" as never)
      .select("amount_usd, service")
      .eq("month", currentMonth);

    if (monthlyError) {
      throw new Error(`Failed to fetch monthly costs: ${monthlyError.message}`);
    }

    const typedMonthlyCosts = (monthlyCosts || []) as {
      amount_usd?: number | string;
      service?: string;
    }[];
    const totalMonthly = typedMonthlyCosts.reduce(
      (acc: number, curr) => acc + Number(curr.amount_usd || 0),
      0,
    );

    // 2. Fetch API usage in the last 24 hours to estimate daily cost
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { data: dailyUsage, error: usageError } = await admin
      .from("finance_api_usage" as never)
      .select("*")
      .gte("recorded_at", oneDayAgo);

    if (usageError) {
      throw new Error(`Failed to fetch daily API usage: ${usageError.message}`);
    }

    // Estimate daily cost based on token usage
    // Gemini 1.5 Pro: $1.25/M input, $5.00/M output
    // Claude 3.5 Sonnet: $3.00/M input, $15.00/M output
    let estimatedDailyCost = 0;
    const typedDailyUsage = (dailyUsage || []) as {
      value?: number | string;
      service?: string;
      metric_name?: string;
    }[];
    for (const item of typedDailyUsage) {
      const val = Number(item.value || 0);
      if (item.service === "gemini") {
        if (item.metric_name === "tokens_in") estimatedDailyCost += (val / 1000000) * 1.25;
        if (item.metric_name === "tokens_out") estimatedDailyCost += (val / 1000000) * 5.0;
      } else if (item.service === "anthropic") {
        if (item.metric_name === "tokens_in") estimatedDailyCost += (val / 1000000) * 3.0;
        if (item.metric_name === "tokens_out") estimatedDailyCost += (val / 1000000) * 15.0;
      }
    }

    // Default defaults for cost thresholds
    const dailyWarningThreshold = 50; // >$50 warning
    const dailyLimitThreshold = 100; // >$100 auto-throttle / kill-switch
    const monthlyLimitThreshold = 500; // >$500 monthly limit / kill-switch

    let killSwitchActive = false;
    let alarmReason = "";

    if (totalMonthly >= monthlyLimitThreshold) {
      killSwitchActive = true;
      alarmReason = `Monthly cost ($${totalMonthly.toFixed(2)}) exceeded limit ($${monthlyLimitThreshold})`;
    } else if (estimatedDailyCost >= dailyLimitThreshold) {
      killSwitchActive = true;
      alarmReason = `Daily cost ($${estimatedDailyCost.toFixed(2)}) exceeded limit ($${dailyLimitThreshold})`;
    }

    // Persist kill switch status to Redis if Redis credentials exist
    if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
      try {
        const redis = new Redis({
          url: process.env.UPSTASH_REDIS_REST_URL,
          token: process.env.UPSTASH_REDIS_REST_TOKEN,
        });

        if (killSwitchActive) {
          await redis.set("cost_kill_switch", "true");
          logger.error(`[CostAlarm] COST_KILL_SWITCH ACTIVATED: ${alarmReason}`);
        } else {
          // If under limit, ensure it's not locked (or let admin unlock manually)
          // We won't auto-unlock if previously locked to prevent oscillating, but let's keep it safe
          const currentSwitch = await redis.get("cost_kill_switch");
          if (
            currentSwitch === "true" &&
            totalMonthly < monthlyLimitThreshold &&
            estimatedDailyCost < dailyLimitThreshold
          ) {
            // Auto unlock if under budget
            await redis.del("cost_kill_switch");
            logger.info("[CostAlarm] COST_KILL_SWITCH automatically cleared (under budget)");
          }
        }
      } catch (redisErr) {
        logger.error(
          "Failed to update cost_kill_switch in Redis",
          {},
          redisErr instanceof Error ? redisErr : undefined,
        );
      }
    }

    // Warn if daily cost is high
    if (estimatedDailyCost >= dailyWarningThreshold && !killSwitchActive) {
      logger.warn(
        `[CostAlarm] High daily cost warning: $${estimatedDailyCost.toFixed(2)} spent in the last 24h.`,
      );
    }

    return NextResponse.json({
      success: true,
      totalMonthly: Number(totalMonthly.toFixed(2)),
      estimatedDailyCost: Number(estimatedDailyCost.toFixed(2)),
      killSwitchActive,
      reason: alarmReason || "Under limits",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error during cost alarm cron";
    logger.error("Cost alarm cron failed", {}, error instanceof Error ? error : undefined);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
