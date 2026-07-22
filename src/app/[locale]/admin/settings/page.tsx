import { setRequestLocale, getTranslations } from "next-intl/server";
import { requireAdmin } from "@/lib/auth/session";
import { SettingsDashboardClient } from "@/components/admin/settings-dashboard-client";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admin" });
  return { title: "System Settings | ALPAR AI Admin" };
}

export default async function SettingsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  await requireAdmin();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">System Settings & Configuration</h1>
        <p className="text-sm text-fg-muted">
          Manage system parameters, PII Guardian mode, rate limits, and security enforcement policies.
        </p>
      </div>

      <SettingsDashboardClient />
    </div>
  );
}
