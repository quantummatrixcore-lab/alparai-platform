import { setRequestLocale, getTranslations } from "next-intl/server";
import { ApiMetricsClient } from "@/components/admin/api-metrics-client";

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

      <ApiMetricsClient metrics={undefined} trafficData={[]} endpoints={[]} />
    </div>
  );
}
