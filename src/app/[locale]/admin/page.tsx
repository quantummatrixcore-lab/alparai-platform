import { setRequestLocale, getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCards, type AdminStats } from "@/components/admin/stats-cards";
import { ModerationQueue } from "@/components/admin/moderation-queue";
import { getCurrentUser } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { AlertTriangle, ShieldCheck, Activity } from "lucide-react";
import type { IncidentListItem } from "@/types";
import { toIncidentListItems } from "@/lib/mappers";

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
  if (user.role !== "moderator" && user.role !== "admin" && user.role !== "ceo") {
    redirect(`/${locale}`);
  }

  const admin = createAdminClient();
  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();

  const [
    { count: total },
    { count: pending },
    { count: published },
    { count: takenDown },
    { count: users },
    { count: providers },
    { count: takedownReqs },
    { count: recent24h },
    { data: pendingData },
  ] = await Promise.all([
    admin.from("incidents").select("*", { count: "exact", head: true }),
    admin
      .from("incidents")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending_review"),
    admin.from("incidents").select("*", { count: "exact", head: true }).eq("status", "published"),
    admin.from("incidents").select("*", { count: "exact", head: true }).eq("status", "takedown"),
    admin.from("users").select("*", { count: "exact", head: true }),
    admin.from("ai_providers").select("*", { count: "exact", head: true }),
    admin
      .from("takedown_requests")
      .select("*", { count: "exact", head: true })
      .eq("status", "received"),
    admin
      .from("incidents")
      .select("*", { count: "exact", head: true })
      .gte("created_at", oneDayAgo),
    admin
      .from("incidents")
      .select(
        "id, title_masked, description_masked, severity, status, category, is_anonymous, incident_date, views_count, created_at, ai_provider_id, user_id"
      )
      .eq("status", "pending_review")
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  const stats: AdminStats = {
    total: total ?? 0,
    pending: pending ?? 0,
    published: published ?? 0,
    taken_down: takenDown ?? 0,
    users: users ?? 0,
    providers: providers ?? 0,
    takedown_requests: takedownReqs ?? 0,
    recent_24h: recent24h ?? 0,
  };

  const queue: IncidentListItem[] = toIncidentListItems(pendingData);

  return (
    <Container className="py-10">
      <header className="mb-8">
        <h1 className="text-fg-primary inline-flex items-center gap-2 text-2xl font-bold">
          <ShieldCheck className="text-brand-400 h-6 w-6" />
          {t("dashboardTitle")}
        </h1>
        <p className="text-fg-muted mt-1 text-sm">{user.email}</p>
      </header>

      <StatsCards stats={stats} />

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card variant="glass">
            <CardHeader>
              <CardTitle className="inline-flex items-center gap-2">
                <AlertTriangle className="text-warning-500 h-5 w-5" />
                {t("moderation_queue")} ({queue.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ModerationQueue incidents={queue} />
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card variant="glass">
            <CardHeader className="pb-3">
              <CardTitle className="inline-flex items-center gap-2 text-base font-bold">
                <Activity className="text-brand-400 h-4 w-4" />
                {t("platform_overview")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              {/* System Health Pulse Status */}
              <div className="bg-bg-tertiary/40 border-border-subtle/50 flex items-center justify-between rounded-xl border p-3.5 backdrop-blur-md">
                <span className="text-fg-secondary text-xs font-semibold tracking-wider uppercase">
                  {t("system_health") ?? "Sistem Durumu"}
                </span>
                <div className="text-success-500 flex items-center gap-2 text-xs font-bold tracking-wider uppercase">
                  <span className="relative flex h-2 w-2">
                    <span className="bg-success-400 absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"></span>
                    <span className="bg-success-500 relative inline-flex h-2 w-2 rounded-full"></span>
                  </span>
                  {t("all_operational")}
                </div>
              </div>

              {/* Stats Rows */}
              <div className="space-y-3">
                <div className="bg-bg-tertiary/20 hover:bg-bg-tertiary/30 border-border-subtle flex items-center justify-between rounded-xl border p-3 transition-all">
                  <span className="text-fg-secondary font-medium">
                    {t("stats_takedown_requests")}
                  </span>
                  <span className="bg-danger-500/10 text-danger-400 border-danger-500/20 rounded-md border px-2 py-0.5 text-xs font-bold">
                    {stats.takedown_requests}
                  </span>
                </div>

                <div className="bg-bg-tertiary/20 hover:bg-bg-tertiary/30 border-border-subtle flex items-center justify-between rounded-xl border p-3 transition-all">
                  <span className="text-fg-secondary font-medium">{t("stats_providers")}</span>
                  <span className="bg-brand-500/10 text-brand-300 border-brand-500/20 rounded-md border px-2 py-0.5 text-xs font-bold">
                    {stats.providers}
                  </span>
                </div>

                <div className="bg-bg-tertiary/20 hover:bg-bg-tertiary/30 border-border-subtle flex items-center justify-between rounded-xl border p-3 transition-all">
                  <span className="text-fg-secondary font-medium">{t("stats_24h")}</span>
                  <span className="bg-accent-500/10 text-accent-300 border-accent-500/20 rounded-md border px-2 py-0.5 text-xs font-bold">
                    {stats.recent_24h}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
}
