import { getTranslations, setRequestLocale } from "next-intl/server";
export const dynamic = "force-dynamic";

import { requireCEO } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { CostOverviewCard } from "@/components/admin/finance/cost-overview-card";
import { BudgetGauge } from "@/components/admin/finance/budget-gauge";
import { CostTrendChart } from "@/components/admin/finance/cost-trend-chart";
import { ApiUsageTable } from "@/components/admin/finance/api-usage-table";
import { AlertBanner } from "@/components/admin/finance/alert-banner";
import { CurrencyDollar } from "@phosphor-icons/react/dist/ssr";
import { logger } from "@/lib/utils/logger";

interface DBMonthlyCost {
  month: string;
  service: string;
  amount_usd: number;
  budget_usd: number;
}

interface DBApiUsage {
  id: string;
  service: string;
  metric_name: string;
  value: number;
  unit: string;
  recorded_at: string;
}

export default async function FinancePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  // 1. Auth Gate
  await requireCEO();

  // 2. Translations
  const t = await getTranslations("finance");
  const tAdmin = await getTranslations({ locale, namespace: "admin" });

  // 3. Database Fetch
  const supabase = createAdminClient();

  const { data: dbCosts } = await supabase
    .from("finance_monthly_costs" as never)
    .select("*")
    .order("month", { ascending: true });

  const { data: dbUsage } = await supabase
    .from("finance_api_usage" as never)
    .select("*")
    .order("recorded_at", { ascending: false });

  const costs = (dbCosts || []) as unknown as DBMonthlyCost[];
  const usage = (dbUsage || []) as unknown as DBApiUsage[];

  const currentMonth = "2026-07-01";
  const currentCosts = costs.filter((c) => c.month === currentMonth);

  // Vercel Live Cost Fallback
  let vercelLiveCost: number | null = null;
  const vercelToken = process.env.VERCEL_TOKEN || process.env.VERCEL_OIDC_TOKEN;
  if (vercelToken) {
    try {
      const res = await fetch("https://api.vercel.com/v1/billing/charges", {
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${vercelToken}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.charges) {
          vercelLiveCost = (data.charges as { amount?: number }[]).reduce(
            (acc: number, curr) => acc + (curr.amount || 0),
            0,
          );
        }
      }
    } catch (e) {
      logger.error(
        "Vercel Live Cost API Fetch Failed",
        undefined,
        e instanceof Error ? e : undefined,
      );
    }
  }

  // Construct Services Array
  const services = [
    {
      name: "vercel",
      currentCost:
        vercelLiveCost ??
        Number(currentCosts.find((c) => c.service === "vercel")?.amount_usd ?? 14.2),
      budgetLimit: Number(currentCosts.find((c) => c.service === "vercel")?.budget_usd ?? 20.0),
      trend: "up" as const,
      lastUpdated: new Date().toISOString(),
    },
    {
      name: "supabase",
      currentCost: Number(currentCosts.find((c) => c.service === "supabase")?.amount_usd ?? 0.0),
      budgetLimit: Number(currentCosts.find((c) => c.service === "supabase")?.budget_usd ?? 0.0),
      trend: "stable" as const,
      lastUpdated: new Date().toISOString(),
    },
    {
      name: "gemini",
      currentCost: Number(currentCosts.find((c) => c.service === "gemini")?.amount_usd ?? 10.1),
      budgetLimit: Number(currentCosts.find((c) => c.service === "gemini")?.budget_usd ?? 20.0),
      trend: "up" as const,
      lastUpdated: new Date().toISOString(),
    },
    {
      name: "anthropic",
      currentCost: Number(currentCosts.find((c) => c.service === "anthropic")?.amount_usd ?? 4.5),
      budgetLimit: Number(currentCosts.find((c) => c.service === "anthropic")?.budget_usd ?? 20.0),
      trend: "up" as const,
      lastUpdated: new Date().toISOString(),
    },
    {
      name: "resend",
      currentCost: Number(currentCosts.find((c) => c.service === "resend")?.amount_usd ?? 0.0),
      budgetLimit: Number(currentCosts.find((c) => c.service === "resend")?.budget_usd ?? 0.0),
      trend: "stable" as const,
      lastUpdated: new Date().toISOString(),
    },
    {
      name: "upstash",
      currentCost: Number(currentCosts.find((c) => c.service === "upstash")?.amount_usd ?? 1.2),
      budgetLimit: Number(currentCosts.find((c) => c.service === "upstash")?.budget_usd ?? 5.0),
      trend: "up" as const,
      lastUpdated: new Date().toISOString(),
    },
    {
      name: "buffer",
      currentCost: Number(currentCosts.find((c) => c.service === "buffer")?.amount_usd ?? 6.0),
      budgetLimit: Number(currentCosts.find((c) => c.service === "buffer")?.budget_usd ?? 6.0),
      trend: "stable" as const,
      lastUpdated: new Date().toISOString(),
    },
    {
      name: "github_copilot",
      currentCost: Number(
        currentCosts.find((c) => c.service === "github_copilot")?.amount_usd ?? 19.0,
      ),
      budgetLimit: Number(
        currentCosts.find((c) => c.service === "github_copilot")?.budget_usd ?? 20.0,
      ),
      trend: "stable" as const,
      lastUpdated: new Date().toISOString(),
    },
    {
      name: "claude_pro",
      currentCost: Number(currentCosts.find((c) => c.service === "claude_pro")?.amount_usd ?? 20.0),
      budgetLimit: Number(currentCosts.find((c) => c.service === "claude_pro")?.budget_usd ?? 20.0),
      trend: "stable" as const,
      lastUpdated: new Date().toISOString(),
    },
    {
      name: "google_one",
      currentCost: Number(
        currentCosts.find((c) => c.service === "google_one")?.amount_usd ?? 19.99,
      ),
      budgetLimit: Number(currentCosts.find((c) => c.service === "google_one")?.budget_usd ?? 20.0),
      trend: "stable" as const,
      lastUpdated: new Date().toISOString(),
    },
  ].map((s) => {
    const percentUsed = s.budgetLimit > 0 ? Math.round((s.currentCost / s.budgetLimit) * 100) : 0;
    return { ...s, percentUsed };
  });

  const totalMonthly = services.reduce((acc, curr) => acc + curr.currentCost, 0);
  const totalBudget = services.reduce((acc, curr) => acc + curr.budgetLimit, 0);

  // Recharts Trends Grouping
  const months = Array.from(new Set(costs.map((c) => c.month)));
  const trends = months.map((m) => {
    const monthLabel = new Date(m).toLocaleDateString(tAdmin("en_us"), {
      month: "long",
    });
    const monthCosts = costs.filter((c) => c.month === m);
    const dataPoint: Record<string, string | number> = { name: monthLabel };
    let sum = 0;
    monthCosts.forEach((c) => {
      const val = Number(c.amount_usd);
      dataPoint[c.service] = val;
      sum += val;
    });
    dataPoint["Toplam"] = sum;
    return dataPoint;
  });

  // Alarms
  const alerts: string[] = [];
  services.forEach((s) => {
    if (s.percentUsed >= 90 && s.budgetLimit > 0) {
      alerts.push(
        tAdmin("finance_alert_limit", {
          service: s.name.toUpperCase(),
          percent: s.percentUsed,
        }),
      );
    } else if (s.percentUsed >= 80 && s.budgetLimit > 0) {
      alerts.push(
        tAdmin("finance_alert_warning", {
          service: s.name.toUpperCase(),
          percent: s.percentUsed,
        }),
      );
    }
  });

  return (
    <div className="flex flex-col gap-8 p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
            <CurrencyDollar className="text-primary h-8 w-8" />
            {t("title")}
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{t("description")}</p>
        </div>
      </div>

      {/* Alert Banner */}
      <AlertBanner alerts={alerts} />

      {/* Overview Cards & Gauge */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:col-span-2">
          {services.map((service) => (
            <CostOverviewCard
              key={service.name}
              name={service.name}
              currentCost={service.currentCost}
              budgetLimit={service.budgetLimit}
              percentUsed={service.percentUsed}
              trend={service.trend}
              lastUpdated={service.lastUpdated}
            />
          ))}
        </div>
        <div className="lg:col-span-1">
          <BudgetGauge totalMonthly={totalMonthly} totalBudget={totalBudget} />
        </div>
      </div>

      {/* Trend Chart */}
      <div className="grid grid-cols-1 gap-6">
        <CostTrendChart data={trends} />
      </div>

      {/* API Usage Metrics Table */}
      <div className="grid grid-cols-1 gap-6">
        <ApiUsageTable data={usage} />
      </div>
    </div>
  );
}
