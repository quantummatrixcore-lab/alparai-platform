"use server";

import { requireAdmin } from "@/lib/auth/session";
import {
  listRecentRuns,
  summarizeRuns,
  breakerSnapshot,
  runAutopilotWorkerOnce,
  type PersistedAutopilotRunWithMeta,
  type AutopilotRunStats,
} from "@/lib/autopilot";
import { getPolicy, policyNames } from "@/lib/autopilot";
import type { BreakerSnapshot } from "@/lib/autopilot";

export interface AdminAutopilotSnapshot {
  runs: PersistedAutopilotRunWithMeta[];
  stats: AutopilotRunStats;
  breakers: Record<string, BreakerSnapshot | null>;
  policies: ReadonlyArray<{
    action: string;
    onExhaust: string;
    attempts: number;
    budgetMs: number;
    budgetTokens: number;
  }>;
  queue: { available: boolean; size: number };
}

export interface AdminAutopilotResult {
  ok: boolean;
  snapshot?: AdminAutopilotSnapshot;
  error?: string;
}

export async function getAdminAutopilotSnapshot(limit = 100): Promise<AdminAutopilotResult> {
  const admin = await requireAdmin();
  if (!admin) return { ok: false, error: "Forbidden" };
  const runs = await listRecentRuns(limit);
  const stats = summarizeRuns(runs);
  const breakers: Record<string, BreakerSnapshot | null> = {};
  for (const name of policyNames()) {
    breakers[name] = breakerSnapshot(name);
  }
  const policies = policyNames().map((name) => {
    const cfg = getPolicy(name).config;
    return {
      action: cfg.action,
      onExhaust: cfg.onExhaust,
      attempts: cfg.retry.attempts,
      budgetMs: cfg.budget.maxMs,
      budgetTokens: cfg.budget.maxTokens,
    };
  });
  const { getQueue } = await import("@/lib/autopilot");
  const q = getQueue();
  const size = await q.size();
  return {
    ok: true,
    snapshot: {
      runs,
      stats,
      breakers,
      policies,
      queue: { available: q.available, size },
    },
  };
}

export async function triggerAutopilotWorkerTick(): Promise<{
  ok: boolean;
  processed?: number;
  succeeded?: number;
  retried?: number;
  failed?: number;
  error?: string;
}> {
  const admin = await requireAdmin();
  if (!admin) return { ok: false, error: "Forbidden" };
  const stats = await runAutopilotWorkerOnce({ batchSize: 10 });
  return {
    ok: true,
    processed: stats.processed,
    succeeded: stats.succeeded,
    retried: stats.retried,
    failed: stats.failed,
  };
}
