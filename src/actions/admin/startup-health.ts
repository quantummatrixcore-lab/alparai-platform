"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { requireModerator } from "@/lib/auth/session";
const MIN_MONTHLY_THRESHOLD = 30;

export interface KpiMetric {
  label: string;
  thisMonth: number;
  lastMonth: number;
  momGrowthPct: number | null;
  status: "ok" | "insufficient_data";
}

export interface StartupHealthResult {
  kpis: KpiMetric[];
  showPercentages: boolean;
  measuredAt: string;
}

function momGrowth(current: number, previous: number): number | null {
  if (previous === 0) return current > 0 ? 100 : null;
  if (previous === 0 && current === 0) return null; // no signal
  return Math.round(((current - previous) / previous) * 100);
}

export async function getStartupHealth(): Promise<StartupHealthResult | null> {
  const user = await requireModerator();
  if (!user) return null;

  const db = createAdminClient();

  const now = new Date();
  const startOfThisMonth = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1),
  ).toISOString();
  const startOfLastMonth = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1),
  ).toISOString();

  const getCount = async (
    table: "users" | "incidents" | "newsletter_subscribers",
    start: string,
    end?: string,
  ) => {
    let q = db.from(table).select("*", { count: "exact", head: true }).gte("created_at", start);
    if (end) q = q.lt("created_at", end);
    const { count, error } = await q;
    // Silently handle missing tables/permissions and return 0
    if (error || count === null) return 0;
    return count;
  };

  const [usersThis, usersLast, incidentsThis, incidentsLast, newsletterThis, newsletterLast] =
    await Promise.all([
      getCount("users", startOfThisMonth),
      getCount("users", startOfLastMonth, startOfThisMonth),
      getCount("incidents", startOfThisMonth),
      getCount("incidents", startOfLastMonth, startOfThisMonth),
      getCount("newsletter_subscribers", startOfThisMonth),
      getCount("newsletter_subscribers", startOfLastMonth, startOfThisMonth),
    ]);

  const rawKpis: KpiMetric[] = [
    {
      label: "New Users",
      thisMonth: usersThis,
      lastMonth: usersLast,
      momGrowthPct: usersThis >= MIN_MONTHLY_THRESHOLD ? momGrowth(usersThis, usersLast) : null,
      status: usersThis >= MIN_MONTHLY_THRESHOLD ? "ok" : "insufficient_data",
    },
    {
      label: "Incidents Filed",
      thisMonth: incidentsThis,
      lastMonth: incidentsLast,
      momGrowthPct:
        incidentsThis >= MIN_MONTHLY_THRESHOLD ? momGrowth(incidentsThis, incidentsLast) : null,
      status: incidentsThis >= MIN_MONTHLY_THRESHOLD ? "ok" : "insufficient_data",
    },
    {
      label: "Newsletter Subscribers",
      thisMonth: newsletterThis,
      lastMonth: newsletterLast,
      momGrowthPct:
        newsletterThis >= MIN_MONTHLY_THRESHOLD ? momGrowth(newsletterThis, newsletterLast) : null,
      status: newsletterThis >= MIN_MONTHLY_THRESHOLD ? "ok" : "insufficient_data",
    },
  ];

  const passing = rawKpis.filter((k) => k.status === "ok").length;

  return {
    kpis: rawKpis,
    showPercentages: passing >= 2,
    measuredAt: new Date().toISOString(),
  };
}
