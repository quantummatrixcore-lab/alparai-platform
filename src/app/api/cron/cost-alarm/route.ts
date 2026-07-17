import { withCronLogger } from "@/lib/utils/cron-logger";
import { type NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { Redis } from "@upstash/redis";
import { logger } from "@/lib/utils/logger";

export const dynamic = "force-dynamic";

async function getHandler(request: NextRequest) {
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
    const totalInfrastructureMonthly = typedMonthlyCosts.reduce(
      (acc: number, curr) => acc + Number(curr.amount_usd || 0),
      0,
    );

    // Fetch total monthly LLM cost from cross_audit_runs (O3)
    let totalLlmMonthly = 0;
    try {
      const monthStart = new Date().toISOString().slice(0, 7) + "-01T00:00:00.000Z";
      const { data: llmRuns } = await admin
        .from("cross_audit_runs")
        .select("cost_usd")
        .gte("created_at", monthStart);

      if (llmRuns) {
        totalLlmMonthly = llmRuns.reduce((acc, curr) => acc + Number(curr.cost_usd || 0), 0);
      }
    } catch (e) {
      logger.error("Failed to query monthly LLM costs", {}, e instanceof Error ? e : undefined);
    }

    const totalMonthly = totalInfrastructureMonthly + totalLlmMonthly;

    // Fetch daily LLM cost from cross_audit_runs (O3)
    let estimatedDailyCost = 0;
    try {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const { data: llmDaily } = await admin
        .from("cross_audit_runs")
        .select("cost_usd")
        .gte("created_at", oneDayAgo);

      if (llmDaily) {
        estimatedDailyCost = llmDaily.reduce((acc, curr) => acc + Number(curr.cost_usd || 0), 0);
      }
    } catch (e) {
      logger.error("Failed to query daily LLM costs", {}, e instanceof Error ? e : undefined);
    }

    // Default defaults for cost thresholds (configurable via env)
    const dailyWarningThreshold = Number(process.env.COST_WARNING_DAILY ?? 50); // >$50 warning
    const dailyLimitThreshold = Number(process.env.COST_LIMIT_DAILY ?? 100); // >$100 auto-throttle / kill-switch
    const monthlyLimitThreshold = Number(process.env.COST_LIMIT_MONTHLY ?? 500); // >$500 monthly limit / kill-switch

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

export const GET = withCronLogger("cost-alarm", getHandler);
