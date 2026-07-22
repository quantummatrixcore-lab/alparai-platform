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

  const [
    { count: total },
    { count: pending },
    { data: pendingData },
    { count: totalUsers },
    { data: recentUsers },
  ] = await Promise.all([
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
    admin.from("users").select("*", { count: "exact", head: true }),
    admin
      .from("users")
      .select("id, email, full_name, role, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const queue: IncidentListItem[] = toIncidentListItems(
    pendingData as unknown as Parameters<typeof toIncidentListItems>[0],
  );

  interface SafeUserItem {
    id: string;
    email: string;
    full_name?: string | null;
    role?: string | null;
    created_at: string;
  }
  const userList = (recentUsers as unknown as SafeUserItem[]) ?? [];

  return (
    <AdminContainer>
      <AdminPageHeader
        icon={<Shield className="h-7 w-7 text-emerald-400" />}
        title={t("dashboard") || "Control Center"}
        subtitle={
          t("dashboard_subtitle") || "360-degree platform monitoring and operations cockpit."
        }
      />

      {/* Top Row: 4 Metric Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label={t("metric_incident_volume") || "Incident Volume"}
          value={total ?? 0}
          variant="default"
        />
        <MetricCard
          label={t("metric_queue_load") || "Moderation Queue Load"}
          value={pending ?? 0}
          variant={(pending ?? 0) > 5 ? "danger" : (pending ?? 0) > 0 ? "warning" : "success"}
        />
        <MetricCard
          label={t("users") || "Toplam Kayıtlı Kullanıcı"}
          value={totalUsers ?? 0}
          variant="success"
        />
        <MetricCard
          label={t("metric_autopilot_guard") || "Autopilot Guard"}
          value="ACTIVE"
          variant="success"
        />
      </div>

      {/* Son Kayıt Olan Kullanıcılar (Users Widget) */}
      <div className="space-y-4 rounded-xl border border-white/10 bg-black/40 p-6">
        <h2 className="flex items-center gap-2 text-lg font-bold text-white">
          <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
          Son Kayıt Olan Kullanıcılar ({totalUsers ?? 0})
        </h2>
        {userList.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-white">
              <thead className="text-fg-muted border-b border-white/10 bg-white/5 text-[11px] font-semibold uppercase">
                <tr>
                  <th className="px-4 py-2.5">Kullanıcı</th>
                  <th className="px-4 py-2.5">E-posta</th>
                  <th className="px-4 py-2.5">Rol</th>
                  <th className="px-4 py-2.5">Kayıt Tarihi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {userList.map((u) => (
                  <tr key={u.id} className="hover:bg-white/5">
                    <td className="px-4 py-2.5 font-medium">{u.full_name || "Kullanıcı"}</td>
                    <td className="text-fg-muted px-4 py-2.5 font-mono">{u.email}</td>
                    <td className="px-4 py-2.5">
                      <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400 uppercase">
                        {u.role || "user"}
                      </span>
                    </td>
                    <td className="text-fg-muted px-4 py-2.5">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-fg-muted text-xs">Henüz kayıtlı kullanıcı bulunmuyor.</p>
        )}
      </div>

      <OverviewDashboardClient queue={queue} locale={locale} />
    </AdminContainer>
  );
}
