import { setRequestLocale, getTranslations } from "next-intl/server";
import { requireAdmin } from "@/lib/auth/session";
import { SettingsDashboardClient } from "@/components/admin/settings-dashboard-client";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admin" });
  return { title: t("settings_doc_title") };
}

export default async function SettingsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  await requireAdmin();

  return (
    <div className="space-y-8 rounded-3xl bg-zinc-900/40 p-6 shadow-2xl ring-1 ring-white/10 backdrop-blur-xl md:p-8">
      <SettingsDashboardClient />
    </div>
  );
}
