import { setRequestLocale, getTranslations } from "next-intl/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, WarningCircle } from "@phosphor-icons/react/dist/ssr";

interface SliRowProps {
  label: string;
  slo: string;
  actual: string;
  status: "ok" | "warning" | "breach";
}

const MOCK_SLI = [
  { label: "sli_availability", slo: "99.9%", actual: "99.95%", status: "ok" as const },
  { label: "sli_latency_p50", slo: "< 200ms", actual: "87ms", status: "ok" as const },
  { label: "sli_latency_p95", slo: "< 500ms", actual: "312ms", status: "ok" as const },
  { label: "sli_latency_p99", slo: "< 2000ms", actual: "1450ms", status: "ok" as const },
  { label: "sli_error_rate", slo: "< 0.1%", actual: "0.04%", status: "ok" as const },
  { label: "sli_cross_audit", slo: "≥ 95%", actual: "97.2%", status: "ok" as const },
];

export default async function SloDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "admin" });

  const statusIcon = (status: string) => {
    if (status === "ok") return <CheckCircle className="h-5 w-5 text-emerald-400" />;
    if (status === "warning") return <Clock className="h-5 w-5 text-amber-400" />;
    return <WarningCircle className="h-5 w-5 text-rose-400" />;
  };

  return (
    <div className="animate-in fade-in space-y-8 duration-500">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-white drop-shadow-md">
          {t("slo_dashboard_title")}
        </h1>
        <p className="text-fg-secondary mt-2">{t("slo_dashboard_subtitle")}</p>
      </div>

      <Card className="bg-bg-secondary/40 overflow-hidden border-white/5 backdrop-blur-xl">
        <CardHeader className="border-b border-white/5">
          <CardTitle className="text-fg-muted text-sm font-bold tracking-wider uppercase">
            {t("slo_current_status")}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-fg-muted/10 divide-y">
            {MOCK_SLI.map((sli) => (
              <div key={sli.label} className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-3">
                  {statusIcon(sli.status)}
                  <span className="text-fg-primary text-sm">{t(sli.label)}</span>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-fg-muted font-mono text-xs">SLO: {sli.slo}</span>
                  <span className="font-mono text-sm font-bold text-white">{sli.actual}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="bg-bg-secondary/40 rounded-xl border border-white/5 p-4 backdrop-blur">
          <p className="text-fg-muted text-xs font-bold tracking-wide uppercase">
            {t("slo_error_budget")}
          </p>
          <p className="mt-1 font-mono text-2xl font-black text-emerald-400">64%</p>
          <p className="text-fg-muted mt-1 text-xs">{t("slo_error_budget_desc")}</p>
        </div>
        <div className="bg-bg-secondary/40 rounded-xl border border-white/5 p-4 backdrop-blur">
          <p className="text-fg-muted text-xs font-bold tracking-wide uppercase">
            {t("slo_burn_rate")}
          </p>
          <p className="mt-1 font-mono text-2xl font-black text-cyan-400">0.6×</p>
          <p className="text-fg-muted mt-1 text-xs">{t("slo_burn_rate_desc")}</p>
        </div>
        <div className="bg-bg-secondary/40 rounded-xl border border-white/5 p-4 backdrop-blur">
          <p className="text-fg-muted text-xs font-bold tracking-wide uppercase">
            {t("slo_window")}
          </p>
          <p className="mt-1 font-mono text-2xl font-black text-amber-400">30d</p>
          <p className="text-fg-muted mt-1 text-xs">{t("slo_window_desc")}</p>
        </div>
      </div>
    </div>
  );
}
