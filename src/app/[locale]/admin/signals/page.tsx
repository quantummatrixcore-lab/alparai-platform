import { setRequestLocale, getTranslations } from "next-intl/server";
import { SignalsClient } from "@/components/admin/signals-client";

export default async function SignalsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "admin" });

  return (
    <div className="animate-in fade-in space-y-8 duration-500">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-white drop-shadow-md">
          {t("signals_title")}
        </h1>
        <p className="text-fg-secondary mt-2">{t("signals_subtitle")}</p>
      </div>

      <SignalsClient />
    </div>
  );
}
