import { setRequestLocale, getTranslations } from "next-intl/server";
import { Pulse, HardDrives, ShieldWarning, Lightning } from "@phosphor-icons/react/dist/ssr";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Mock data until real API analytics are integrated
const MOCK_METRICS = {
  totalRequests: "1.2M",
  errorRate: "0.04%",
  avgLatency: "112ms",
  activeLimits: 12,
};

export default async function ApiMetricsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "admin" });

  return (
    <div className="animate-in fade-in space-y-8 duration-500">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-white drop-shadow-md">
          {t("api_metrics_title")}
        </h1>
        <p className="text-fg-secondary mt-2">{t("api_metrics_subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: t("metrics_total_requests"),
            value: MOCK_METRICS.totalRequests,
            icon: <Pulse weight="duotone" className="text-brand-400" />,
            glow: "shadow-[0_0_15px_rgba(168,85,247,0.15)]",
          },
          {
            label: t("metrics_error_rate"),
            value: MOCK_METRICS.errorRate,
            icon: <ShieldWarning weight="duotone" className="text-rose-400" />,
            glow: "shadow-[0_0_15px_rgba(244,63,94,0.15)]",
          },
          {
            label: t("metrics_avg_latency"),
            value: MOCK_METRICS.avgLatency,
            icon: <Lightning weight="duotone" className="text-cyan-400" />,
            glow: "shadow-[0_0_15px_rgba(6,182,212,0.15)]",
          },
          {
            label: t("metrics_active_limits"),
            value: MOCK_METRICS.activeLimits,
            icon: <HardDrives weight="duotone" className="text-amber-400" />,
            glow: "shadow-[0_0_15px_rgba(245,158,11,0.15)]",
          },
        ].map((m, i) => (
          <div
            key={i}
            className={`bg-bg-secondary/40 group relative overflow-hidden rounded-2xl border border-white/5 p-6 backdrop-blur-xl ${m.glow}`}
          >
            <div className="flex items-center justify-between">
              <div className="rounded-xl border border-white/5 bg-white/5 p-3 transition-transform group-hover:scale-110">
                {m.icon}
              </div>
            </div>
            <div className="mt-4">
              <p className="font-mono text-3xl font-black tracking-tighter text-white">{m.value}</p>
              <p className="text-fg-muted mt-1 text-xs font-bold tracking-wide uppercase">
                {m.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      <Card className="bg-bg-secondary/40 overflow-hidden border-white/5 backdrop-blur-xl">
        <CardHeader className="border-b border-white/5">
          <CardTitle className="text-fg-muted text-sm font-bold tracking-wider uppercase">
            {t("traffic_visualization")}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex h-64 items-center justify-center p-8">
          <p className="text-fg-muted/50 text-sm italic">{t("traffic_chart_placeholder")}</p>
        </CardContent>
      </Card>
    </div>
  );
}
