import { getStartupHealth } from "@/actions/admin/startup-health";
import { getFundingConversion } from "@/actions/admin/funding-conversion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { InfoIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function StartupHealthPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations("admin");
  const [healthData, fundingData] = await Promise.all([getStartupHealth(), getFundingConversion()]);

  if (!healthData) {
    return (
      <div className="p-6">
        <h1 className="mb-4 text-2xl font-bold tracking-tight">{t("startup_health_score")}</h1>
        <p className="text-muted-foreground">{t("no_data_available_or_insufficient_permis")}</p>
      </div>
    );
  }

  const { kpis, showPercentages, measuredAt } = healthData;
  const passingKpis = kpis.filter(
    (k) => k.status === "ok" && k.momGrowthPct !== null && k.momGrowthPct >= 0,
  ).length;
  const totalKpis = kpis.length;

  const scorePct = Math.round((passingKpis / totalKpis) * 100);

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("startup_health_score")}</h1>
          <p className="text-muted-foreground">{t("month_over_month_growth_metrics_and_over")}</p>
        </div>
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <InfoIcon className="h-4 w-4" />
          {t("measured")}
          {new Date(measuredAt).toLocaleString(locale)}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <Card className="border-primary/20 bg-primary/5 md:col-span-1">
          <CardHeader>
            <CardTitle>{t("health_score")}</CardTitle>
            <CardDescription>
              {t("based_on")}
              {totalKpis} {t("key_metrics")}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-6">
            {showPercentages ? (
              <>
                <span className="text-primary text-6xl font-black">{scorePct}%</span>
                <span className="text-muted-foreground mt-2 text-sm font-medium">
                  {passingKpis} of {totalKpis} {t("kpis_growing")}
                </span>
              </>
            ) : (
              <div className="space-y-2 text-center">
                <span className="text-muted-foreground text-xl font-bold">{t("pre_traction")}</span>
                <p className="text-muted-foreground text-xs">{t("insufficient_data_for_score")}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:col-span-3">
          {kpis.map((kpi) => (
            <Card key={kpi.label}>
              <CardHeader className="pb-2">
                <CardTitle className="text-muted-foreground text-sm font-medium">
                  {kpi.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-3xl font-bold">{kpi.thisMonth}</span>
                    <span className="text-muted-foreground mt-1 block text-xs">
                      {t("prev")}
                      {kpi.lastMonth}
                    </span>
                  </div>

                  {kpi.status === "ok" ? (
                    <div
                      className={`flex items-center text-sm font-bold ${
                        kpi.momGrowthPct === null
                          ? "text-muted-foreground"
                          : kpi.momGrowthPct > 0
                            ? "text-green-500"
                            : kpi.momGrowthPct < 0
                              ? "text-destructive"
                              : "text-muted-foreground"
                      }`}
                    >
                      {kpi.momGrowthPct === null ? (
                        <Minus className="mr-1 h-4 w-4" />
                      ) : kpi.momGrowthPct > 0 ? (
                        <TrendingUp className="mr-1 h-4 w-4" />
                      ) : kpi.momGrowthPct < 0 ? (
                        <TrendingDown className="mr-1 h-4 w-4" />
                      ) : (
                        <Minus className="mr-1 h-4 w-4" />
                      )}
                      {kpi.momGrowthPct !== null ? `${kpi.momGrowthPct}%` : "No Signal"}
                    </div>
                  ) : (
                    <div className="rounded bg-amber-500/10 px-2 py-1 text-xs font-medium text-amber-500">
                      {t("needs_ge_30_mo")}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Funding Conversion */}
          <Card className={!fundingData?.hasData ? "border-dashed opacity-50" : ""}>
            <CardHeader className="pb-2">
              <CardTitle className="text-muted-foreground text-sm font-medium">
                {t("funding_conversion")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                {fundingData?.hasData ? (
                  <>
                    <div className="flex items-end justify-between">
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-bold">
                            {fundingData.combinedWinRate !== null
                              ? `${fundingData.combinedWinRate}%`
                              : "—"}
                          </span>
                          <span className="text-muted-foreground text-sm font-medium">
                            {t("win_rate")}
                          </span>
                        </div>
                        <span className="text-muted-foreground mt-1 block text-xs">
                          {t("won")}
                          {fundingData.combinedWon} {t("resolved")}{" "}
                          {fundingData.combinedWon + fundingData.combinedRejected}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-end justify-between border-t pt-2">
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold">
                            {fundingData.combinedActivationRate !== null
                              ? `${fundingData.combinedActivationRate}%`
                              : "—"}
                          </span>
                          <span className="text-muted-foreground text-sm font-medium">
                            {t("activation")}
                          </span>
                        </div>
                        <span className="text-muted-foreground mt-1 block text-xs">
                          {t("applied")}
                          {fundingData.combinedApplied} {t("catalog")} {fundingData.combinedTotal}
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex items-end justify-between">
                    <span className="text-3xl font-bold">—</span>
                    <span className="text-muted-foreground text-xs">{t("no_data")}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-dashed opacity-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-muted-foreground text-sm font-medium">
                {t("revenue_mrr")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-bold">—</span>
                <span className="text-muted-foreground text-xs">{t("unmeasured")}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-dashed opacity-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-muted-foreground text-sm font-medium">
                {t("uptime")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-bold">—</span>
                <span className="text-muted-foreground text-xs">{t("unmeasured")}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
