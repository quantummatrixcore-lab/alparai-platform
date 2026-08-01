import { setRequestLocale, getTranslations } from "next-intl/server";
import { ApiMetricsClient } from "@/components/admin/api-metrics-client";

export default async function ApiMetricsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "admin" });

  // Realistic mock data
  const mockMetrics = {
    requests24h: 12450,
    avgLatency: 145,
    errorRate: 0.24,
    p99Latency: 380,
  };

  const mockTraffic = Array.from({ length: 24 }).map((_, i) => ({
    hour: `${i.toString().padStart(2, "0")}:00`,
    requests: Math.floor((Math.sin(i) * 0.5 + 0.5) * 800) + 200,
    errors: Math.floor((Math.cos(i) * 0.5 + 0.5) * 5),
  }));

  const mockEndpoints = [
    {
      name: "/api/chat",
      method: "POST",
      status: "healthy" as const,
      latency: "120ms",
      rps: "4.2",
      uptime: 99.99,
    },
    {
      name: "/api/cross-audit",
      method: "POST",
      status: "healthy" as const,
      latency: "450ms",
      rps: "1.8",
      uptime: 99.95,
    },
    {
      name: "/api/analysis",
      method: "POST",
      status: "warning" as const,
      latency: "850ms",
      rps: "0.5",
      uptime: 99.9,
    },
    {
      name: "/api/health",
      method: "GET",
      status: "healthy" as const,
      latency: "45ms",
      rps: "12.5",
      uptime: 100,
    },
  ];

  return (
    <div className="animate-in fade-in space-y-8 duration-500">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-white drop-shadow-md">
          {t("api_metrics_title")}
        </h1>
        <p className="text-fg-secondary mt-2">{t("api_metrics_subtitle")}</p>
      </div>

      <ApiMetricsClient metrics={mockMetrics} trafficData={mockTraffic} endpoints={mockEndpoints} />
    </div>
  );
}
