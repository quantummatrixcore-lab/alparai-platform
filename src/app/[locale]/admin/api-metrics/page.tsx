import { setRequestLocale, getTranslations } from "next-intl/server";
import { Plug } from "@phosphor-icons/react/dist/ssr";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

      <div className="bg-bg-secondary/40 flex flex-col items-center justify-center rounded-2xl border border-white/5 p-12 text-center backdrop-blur-xl">
        <div className="mb-4 rounded-full bg-white/5 p-4">
          <Plug weight="duotone" className="text-fg-muted h-8 w-8" />
        </div>
        <h2 className="mb-2 text-xl font-bold text-white">No data yet — source not connected</h2>
        <p className="text-fg-muted max-w-md">
          API metrics integration (e.g. Vercel Analytics / Sentry) is pending. Real traffic and
          latency metrics will appear here once connected.
        </p>
      </div>

      <Card className="bg-bg-secondary/40 overflow-hidden border-white/5 opacity-50 grayscale backdrop-blur-xl">
        <CardHeader className="border-b border-white/5">
          <CardTitle className="text-fg-muted text-sm font-bold tracking-wider uppercase">
            {t("traffic_visualization")}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex h-64 items-center justify-center p-8">
          <p className="text-fg-muted/50 text-sm italic">Data source disconnected</p>
        </CardContent>
      </Card>
    </div>
  );
}
