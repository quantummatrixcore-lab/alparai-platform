import { setRequestLocale, getTranslations } from "next-intl/server";
import { ApiMetricsClient } from "@/components/admin/api-metrics-client";
import { createServerClient } from "@/lib/supabase/server";

export default async function ApiMetricsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "admin" });

  const supabase = await createServerClient();
  const { data: quotas, error } = await supabase.from("vendor_quotas").select("metric, used_value");

  let requests24h = 0;
  let totalTokens = 0;
  let avgLatency = 0;
  let errorRate = 0;
  let p99Latency = 0;

  if (quotas && !error) {
    quotas.forEach((q) => {
      const val = Number(q.used_value || 0);
      if (q.metric === "requests") requests24h += val;
      else if (q.metric === "messages" || q.metric === "tokens") totalTokens += val;
      else if (q.metric === "latency_avg") avgLatency += val;
      else if (q.metric === "error_rate") errorRate += val;
      else if (q.metric === "latency_p99") p99Latency += val;
    });
  }

  const dbMetrics = {
    requests24h,
    totalTokens,
    avgLatency: avgLatency || 0, // Fallback if 0
    errorRate: errorRate || 0, // Fallback if 0
    p99Latency: p99Latency || 0, // Fallback if 0
  };

  const trafficData: { hour: string; requests: number; errors: number }[] = []; // ÖLÇÜLMEDİ

  const endpointsData: { name: string; method: string; status: "healthy" | "warning" | "critical"; latency: string; rps: string; uptime: number }[] = []; // ÖLÇÜLMEDİ

  return (
    <div className="animate-in fade-in space-y-8 duration-500">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-white drop-shadow-md">
          {t("api_metrics_title")}
        </h1>
        <p className="text-fg-secondary mt-2">{t("api_metrics_subtitle")}</p>
      </div>

      <ApiMetricsClient metrics={dbMetrics} trafficData={trafficData} endpoints={endpointsData} />
    </div>
  );
}
