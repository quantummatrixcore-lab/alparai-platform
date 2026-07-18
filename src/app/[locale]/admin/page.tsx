import { setRequestLocale, getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { Shield } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { AdminContainer, AdminPageHeader, MetricCard } from "@/components/admin/admin-design-kit";
import { OverviewDashboardClient } from "@/components/admin/overview-dashboard-client";
import { toIncidentListItems } from "@/lib/mappers";
import type { IncidentListItem } from "@/types";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admin" });
  return { title: t("dashboard") };
}

export default async function AdminDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "admin" });
  const user = await getCurrentUser();
  if (!user) redirect(`/${locale}/auth/signin?next=/${locale}/admin`);

  const userRole = user.role as string;
  if (
    userRole !== "moderator" &&
    userRole !== "admin" &&
    userRole !== "ceo" &&
    userRole !== "advisor"
  ) {
    redirect(`/${locale}`);
  }

  const admin = createAdminClient();

  const [{ count: total }, { count: pending }, { data: pendingData }] = await Promise.all([
    admin.from("incidents").select("*", { count: "exact", head: true }),
    admin
      .from("incidents")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending_review"),
    admin
      .from("incidents")
      .select(
        "id, title_masked, description_masked, severity, status, category, is_anonymous, incident_date, views_count, created_at, ai_provider_id, user_id, processing_stage",
      )
      .eq("status", "pending_review")
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  const queue: IncidentListItem[] = toIncidentListItems(pendingData);

  return (
    <AdminContainer>
      <AdminPageHeader
        icon={<Shield className="h-7 w-7 text-emerald-400" />}
        title={t("dashboard") || "Control Center"}
        subtitle="360-degree platform monitoring and operations cockpit."
      />

      {/* Top Row: 4 Metric Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Incident Volume" value={total ?? 0} variant="default" />
        <MetricCard
          label="Moderation Queue Load"
          value={pending ?? 0}
          variant={(pending ?? 0) > 5 ? "danger" : (pending ?? 0) > 0 ? "warning" : "success"}
        />
        <MetricCard label="API Monthly Costs" value="$241.50 / $500" variant="default" />
        <MetricCard label="Autopilot Guard" value="ACTIVE" variant="success" />
      </div>

      <OverviewDashboardClient queue={queue} locale={locale} />
    </AdminContainer>
  );
}
