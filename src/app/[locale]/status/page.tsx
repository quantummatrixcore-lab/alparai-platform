import { setRequestLocale, getTranslations } from "next-intl/server";
import { CheckCircle } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "status_page" });
  return {
    title: t("meta_title"),
    description: t("meta_desc"),
  };
}

export default async function StatusPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "status_page" });

  return (
    <div className="flex min-h-screen flex-col items-center bg-zinc-950 px-4 py-20 text-zinc-50">
      <div className="w-full max-w-3xl space-y-8">
        <h1 className="text-center text-4xl font-bold tracking-tight">{t("title")}</h1>

        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-8 sm:flex-row">
          <CheckCircle className="h-12 w-12 shrink-0 text-emerald-500" />
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-semibold text-emerald-500">{t("all_operational")}</h2>
            <p className="mt-1 text-emerald-500/80">{t("uptime")}</p>
          </div>
        </div>

        <div className="mt-8 grid gap-4">
          <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
            <div>
              <h3 className="text-lg font-medium">{t("api_services")}</h3>
              <p className="text-sm text-zinc-400">api.alparai.com</p>
            </div>
            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-400">
              {t("operational")}
            </span>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
            <div>
              <h3 className="text-lg font-medium">{t("web_app")}</h3>
              <p className="text-sm text-zinc-400">alparai.com</p>
            </div>
            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-400">
              {t("operational")}
            </span>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
            <div>
              <h3 className="text-lg font-medium">{t("database")}</h3>
              <p className="text-sm text-zinc-400">eu-west-1</p>
            </div>
            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-400">
              {t("operational")}
            </span>
          </div>
        </div>

        <div className="mt-12 text-center text-sm text-zinc-500">{t("footer")}</div>
      </div>
    </div>
  );
}
