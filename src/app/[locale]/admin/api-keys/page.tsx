import { setRequestLocale, getTranslations } from "next-intl/server";
import { requireAdmin } from "@/lib/auth/session";
import { Key } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admin" });
  return { title: `${t("api_mgmt_meta_title")} | ALPAR AI Admin` };
}

export default async function ApiKeysPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  await requireAdmin();
  const t = await getTranslations({ locale, namespace: "admin" });

  return (
    <div className="animate-in fade-in space-y-8 duration-500">
      <div>
        <h1 className="flex items-center gap-2 text-3xl font-black tracking-tight text-white drop-shadow-md">
          <Key className="text-brand-400 h-8 w-8" />
          {t("api_mgmt_h1")}
        </h1>
        <p className="mt-2 text-sm text-zinc-400">{t("api_mgmt_subtitle")}</p>
      </div>
    </div>
  );
}
