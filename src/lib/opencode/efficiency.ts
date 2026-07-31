export type EfficiencyTier = "free" | "paid";

export interface OpenCodeRunRecord {
  model: string;
  exitCode: number;
  durationMs: number;
}

export interface TierEfficiency {
  tier: EfficiencyTier;
  runs: number;
  successRate: number;
  avgDurationMs: number;
  estimated: boolean;
}

export interface OpenCodeEfficiencyReport {
  timestamp: string;
  totalRuns: number;
  freeRuns: number;
  freePct: number;
  avgDurationMs: number;
  successRate: number;
  tiers: TierEfficiency[];
}

export const MIN_RUNS_FOR_MEASURED = 5;

export function classifyTier(model: string): EfficiencyTier {
  return /free/i.test(model) ? "free" : "paid";
}

function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function buildEfficiencyReport(records: OpenCodeRunRecord[]): OpenCodeEfficiencyReport {
  const totalRuns = records.length;
  const freeRuns = records.filter((r) => classifyTier(r.model) === "free").length;
  const successCount = records.filter((r) => r.exitCode === 0).length;

  const tierStats = (tier: EfficiencyTier): TierEfficiency => {
    const tierRecords = records.filter((r) => classifyTier(r.model) === tier);
    const runs = tierRecords.length;
    const successes = tierRecords.filter((r) => r.exitCode === 0).length;
    return {
      tier,
      runs,
      successRate: runs > 0 ? successes / runs : 0,
      avgDurationMs: Math.round(mean(tierRecords.map((r) => r.durationMs))),
      estimated: runs < MIN_RUNS_FOR_MEASURED,
    };
  };

  return {
    timestamp: new Date().toISOString(),
    totalRuns,
    freeRuns,
    freePct: totalRuns > 0 ? (freeRuns / totalRuns) * 100 : 0,
    avgDurationMs: Math.round(mean(records.map((r) => r.durationMs))),
    successRate: totalRuns > 0 ? successCount / totalRuns : 0,
    tiers: [tierStats("free"), tierStats("paid")],
  };
}
