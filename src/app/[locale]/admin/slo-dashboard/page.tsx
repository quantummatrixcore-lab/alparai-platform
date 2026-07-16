import { setRequestLocale, getTranslations } from "next-intl/server";
import { Plug } from "@phosphor-icons/react/dist/ssr";

export default async function SloDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "admin" });

  return (
    <div className="animate-in fade-in space-y-8 duration-500">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-white drop-shadow-md">
          {t("slo_dashboard_title")}
        </h1>
        <p className="text-fg-secondary mt-2">{t("slo_dashboard_subtitle")}</p>
      </div>

      <div className="bg-bg-secondary/40 flex flex-col items-center justify-center rounded-2xl border border-white/5 p-12 text-center backdrop-blur-xl">
        <div className="mb-4 rounded-full bg-white/5 p-4">
          <Plug weight="duotone" className="text-fg-muted h-8 w-8" />
        </div>
        <h2 className="mb-2 text-xl font-bold text-white">No data yet — source not connected</h2>
        <p className="text-fg-muted max-w-md">
          SLO metrics integration is pending. True availability and latency data will be displayed
          once the data source is wired.
        </p>
      </div>
    </div>
  );
}
