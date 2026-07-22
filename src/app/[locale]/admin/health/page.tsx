import { setRequestLocale, getTranslations } from "next-intl/server";
import { requireAdmin } from "@/lib/auth/session";
import { checkSystemHealth } from "@/lib/health/system-health";
import { HealthDashboardClient } from "@/components/admin/health-dashboard-client";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admin" });
  return { title: `${t("nav_systemHealth")} | ALPAR AI Admin` };
}

export default async function HealthPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  await requireAdmin();

  const initialReport = await checkSystemHealth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Unified System Health & SLA Alarms</h1>
        <p className="text-sm text-fg-muted">
          Real-time status monitor across 9 core subsystems (DB, Auth, API, Redis, Storage, AI Gateway, Crons, Email, CDN).
        </p>
      </div>

      <HealthDashboardClient initialReport={initialReport} />
    </div>
  );
}
