import { setRequestLocale } from "next-intl/server";
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

  return (
    <div className="animate-in fade-in space-y-8 duration-500">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-white drop-shadow-md">
          API Gateway Hub
        </h1>
        <p className="text-fg-secondary mt-2">
          360° observability for API traffic, rate limits, and health.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Total Requests (24h)",
            value: MOCK_METRICS.totalRequests,
            icon: <Pulse weight="duotone" className="text-brand-400" />,
            glow: "shadow-[0_0_15px_rgba(168,85,247,0.15)]",
          },
          {
            label: "Global Error Rate",
            value: MOCK_METRICS.errorRate,
            icon: <ShieldWarning weight="duotone" className="text-rose-400" />,
            glow: "shadow-[0_0_15px_rgba(244,63,94,0.15)]",
          },
          {
            label: "Average Latency",
            value: MOCK_METRICS.avgLatency,
            icon: <Lightning weight="duotone" className="text-cyan-400" />,
            glow: "shadow-[0_0_15px_rgba(6,182,212,0.15)]",
          },
          {
            label: "Active Rate Limits",
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
            Traffic Visualization
          </CardTitle>
        </CardHeader>
        <CardContent className="flex h-64 items-center justify-center p-8">
          <p className="text-fg-muted/50 text-sm italic">
            Interactive Recharts visualization will load here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
