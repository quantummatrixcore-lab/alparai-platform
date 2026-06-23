import { setRequestLocale, getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui/layout";
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
        "id, title_masked, description_masked, severity, status, category, is_anonymous, incident_date, views_count, created_at, ai_provider_id, user_id",
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
      <header className="mb-8 flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="inline-flex items-center gap-2.5 text-2xl font-bold tracking-tight text-white">
            <ShieldCheck className="text-brand-400 h-6 w-6 drop-shadow-[0_0_8px_rgba(168,85,247,0.4)]" />
            {t("dashboardTitle")}
          </h1>
          <p className="text-fg-muted mt-1 font-mono text-sm">{user.email}</p>
        </div>
        <div className="flex items-center">
          <span className="flex animate-pulse items-center gap-1.5 rounded-full border border-cyan-500/30 bg-neutral-950/80 px-3 py-1 font-mono text-xs text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)]">
            <span className="h-2 w-2 rounded-full bg-cyan-400"></span>
            {t("system_online")}
          </span>
        </div>
      </header>

      <StatsCards stats={stats} />

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="border-t-brand-500/30 rounded-lg border border-white/10 bg-neutral-900/60 p-6 shadow-md backdrop-blur-xl">
            <div className="mb-5 flex items-center justify-between border-b border-white/5 pb-3">
              <h2 className="text-md inline-flex items-center gap-2 font-semibold text-white">
                <AlertTriangle className="text-brand-400 h-5 w-5" />
                {t("moderation_queue")} ({queue.length})
              </h2>
            </div>
            <ModerationQueue incidents={queue} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border border-white/10 border-t-cyan-500/30 bg-neutral-900/60 p-6 shadow-md backdrop-blur-xl">
            <div className="mb-4 flex items-center justify-between border-b border-white/5 pb-3">
              <h2 className="text-md inline-flex items-center gap-2 font-semibold text-white">
                <Activity className="h-4 w-4 text-cyan-400" />
                {t("platform_overview")}
              </h2>
            </div>
            <div className="space-y-4 text-sm">
              {/* System Health Pulse Status */}
              <div className="flex items-center justify-between rounded-lg border border-white/5 bg-neutral-950/40 p-3.5 shadow-[inset_0_0_10px_rgba(255,255,255,0.02)]">
                <span className="text-fg-secondary font-mono text-xs font-semibold tracking-wider uppercase">
                  {t("system_health") ?? "Sistem Durumu"}
                </span>
                <div className="flex items-center gap-2 font-mono text-xs font-bold tracking-wider text-cyan-400 uppercase drop-shadow-[0_0_8px_rgba(6,182,212,0.3)]">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-500"></span>
                  </span>
                  {t("all_operational")}
                </div>
              </div>

              {/* Stats Rows */}
              <div className="space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between rounded-lg border border-white/5 bg-neutral-950/30 p-3 transition-all duration-200 hover:bg-neutral-950/50">
                  <span className="text-fg-secondary font-sans font-medium">
                    {t("stats_takedown_requests")}
                  </span>
                  <span className="rounded-md border border-rose-500/20 bg-rose-500/10 px-2 py-0.5 font-bold text-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.15)]">
                    {stats.takedown_requests}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-white/5 bg-neutral-950/30 p-3 transition-all duration-200 hover:bg-neutral-950/50">
                  <span className="text-fg-secondary font-sans font-medium">
                    {t("stats_providers")}
                  </span>
                  <span className="bg-brand-500/10 text-brand-300 border-brand-500/20 rounded-md border px-2 py-0.5 font-bold shadow-[0_0_8px_rgba(168,85,247,0.15)]">
                    {stats.providers}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-white/5 bg-neutral-950/30 p-3 transition-all duration-200 hover:bg-neutral-950/50">
                  <span className="text-fg-secondary font-sans font-medium">{t("stats_24h")}</span>
                  <span className="rounded-md border border-cyan-500/20 bg-cyan-500/10 px-2 py-0.5 font-bold text-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.15)]">
                    {stats.recent_24h}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
