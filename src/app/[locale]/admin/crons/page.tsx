import { setRequestLocale, getTranslations } from "next-intl/server";
import { requireAdmin } from "@/lib/auth/session";
import { CronsDashboardClient } from "@/components/admin/crons-dashboard-client";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const _t = await getTranslations({ locale, namespace: "admin" });
  return { title: "Cron Manager | ALPAR AI Admin" };
}

export default async function CronsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  await requireAdmin();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Scheduled Jobs & Cron Topology
        </h1>
        <p className="text-fg-muted text-sm">
          Monitor Supabase `pg_cron` jobs, execution status, and manually trigger scheduled tasks.
        </p>
      </div>

      <CronsDashboardClient />
    </div>
  );
}
