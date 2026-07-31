"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { requireModerator } from "@/lib/auth/session";
import type { SupabaseClient } from "@supabase/supabase-js";

export interface FundingConversionResult {
  grantWon: number;
  grantRejected: number;
  grantWinRate: number | null;
  stateWon: number;
  stateRejected: number;
  stateWinRate: number | null;
  combinedWon: number;
  combinedRejected: number;
  combinedWinRate: number | null;
  hasData: boolean;
}

async function countByStatus(
  db: SupabaseClient,
  table: string,
  statuses: string[],
): Promise<number> {
  const { count, error } = await (db as SupabaseClient)
    .from(table)
    .select("id", { count: "exact", head: true })
    .in("status", statuses);
  if (error || count === null) return 0;
  return count;
}

function winRate(won: number, rejected: number): number | null {
  const total = won + rejected;
  if (total === 0) return null;
  return Math.round((won / total) * 100);
}

export async function getFundingConversion(): Promise<FundingConversionResult | null> {
  const user = await requireModerator();
  if (!user) return null;

  const db = createAdminClient();

  const wonStatuses = ["approved", "accepted_by_program", "awarded"];
  const rejectedStatuses = ["rejected"];

  const [grantWon, grantRejected, stateWon, stateRejected] = await Promise.all([
    countByStatus(db, "grant_applications", wonStatuses),
    countByStatus(db, "grant_applications", rejectedStatuses),
    countByStatus(db, "strategy_state_support", ["awarded"]),
    countByStatus(db, "strategy_state_support", ["rejected"]),
  ]);

  const combinedWon = grantWon + stateWon;
  const combinedRejected = grantRejected + stateRejected;

  return {
    grantWon,
    grantRejected,
    grantWinRate: winRate(grantWon, grantRejected),
    stateWon,
    stateRejected,
    stateWinRate: winRate(stateWon, stateRejected),
    combinedWon,
    combinedRejected,
    combinedWinRate: winRate(combinedWon, combinedRejected),
    hasData: combinedWon + combinedRejected > 0,
  };
}
