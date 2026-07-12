import { setRequestLocale, getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui/layout";
import { StatsCards, type AdminStats } from "@/components/admin/stats-cards";
import { ActivityFeed } from "@/components/admin/activity-feed";
import { ModerationQueue } from "@/components/admin/moderation-queue";
import { StrategicWarRoom } from "@/components/admin/strategic-war-room";
import { AIPulseVisualizer } from "@/components/admin/ai-pulse-visualizer";
import { System360Overview } from "@/components/admin/system-360-overview";
import { LiveStatusBar } from "@/components/admin/live-status-bar";
import { AuditFlowDiagram } from "@/components/admin/audit-flow-diagram";
import { IncidentHeatmap } from "@/components/admin/incident-heatmap";
import { getCurrentUser } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { Warning, Pulse } from "@phosphor-icons/react/dist/ssr";
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
    { data: auditData },
    { data: activeProviders },
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
    admin
      .from("audit_log")
      .select("id, action, entity_type, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
    admin.from("ai_providers").select("id, name, trust_score").limit(10),
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

  // Build activity feed
  const rawActivities = [
    ...(auditData || []).map(
      (audit: { id: string; action: string; entity_type: string; created_at: string }) => ({
        id: audit.id,
        type: "audit" as const,
        title: audit.action,
        description: t("activity_target_entity", { entity: audit.entity_type }),
        timestamp: new Date(audit.created_at).getTime(),
        time: new Date(audit.created_at).toLocaleTimeString(),
      }),
    ),
    ...(pendingData || []).map(
      (inc: {
        id: string;
        title_masked?: string | null;
        category: string;
        severity: string;
        created_at: string;
      }) => ({
        id: inc.id,
        type: "incident" as const,
        title: inc.title_masked || t("activity_new_incident"),
        description: t("activity_incident_desc", {
          category: inc.category,
          severity: inc.severity,
        }),
        timestamp: new Date(inc.created_at).getTime(),
        time: new Date(inc.created_at).toLocaleTimeString(),
      }),
    ),
  ];

  const activities = rawActivities.sort((a, b) => b.timestamp - a.timestamp).slice(0, 10);

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <LiveStatusBar />

      <Container className="flex-1 space-y-8 py-10">
        {/* 360 Degree Command Center */}
        <System360Overview />

        {/* Real-time SVGs / Heatmaps */}
        <div className="grid gap-6 lg:grid-cols-2">
          <AuditFlowDiagram />
          <IncidentHeatmap />
        </div>

        {/* Strategic monitoring section */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <StrategicWarRoom liveProviders={activeProviders || []} />
          </div>
          <div>
            <AIPulseVisualizer />
          </div>
        </div>

        {/* Classic 8-stats Grid */}
        <StatsCards stats={stats} />

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Incident Queue */}
          <div className="lg:col-span-2">
            <div className="border-t-brand-500/30 rounded-lg border border-white/10 bg-neutral-900/60 p-6 shadow-md backdrop-blur-xl">
              <div className="mb-5 flex items-center justify-between border-b border-white/5 pb-3">
                <h2 className="text-md inline-flex items-center gap-2 font-semibold text-white">
                  <Warning weight="duotone" className="h-4 w-4 shrink-0 text-amber-500" />
                  {t("moderation_queue")} ({queue.length})
                </h2>
              </div>
              <ModerationQueue incidents={queue} />
            </div>
          </div>

          {/* Live Feed & Platform Overview */}
          <div className="space-y-6">
            {/* Live Activity Feed */}
            <div className="border-t-brand-500/30 rounded-lg border border-white/10 bg-neutral-900/60 p-6 shadow-md backdrop-blur-xl">
              <div className="mb-4 border-b border-white/5 pb-3">
                <h2 className="text-md inline-flex items-center gap-2 font-semibold text-white">
                  <Pulse weight="duotone" className="text-brand-400 h-4 w-4" />
                  {t("recent_activities") || "Recent Activities"}
                </h2>
              </div>
              <ActivityFeed activities={activities} />
            </div>

            {/* Platform Overview */}
            <div className="rounded-lg border border-white/10 border-t-cyan-500/30 bg-neutral-900/60 p-6 shadow-md backdrop-blur-xl">
              <div className="mb-4 flex items-center justify-between border-b border-white/5 pb-3">
                <h2 className="text-md inline-flex items-center gap-2 font-semibold text-white">
                  <Pulse weight="duotone" className="h-4 w-4 text-cyan-400" />
                  {t("platform_overview")}
                </h2>
              </div>
              <div className="space-y-4 text-sm">
                {/* System Health */}
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
                    <span className="text-fg-secondary font-sans font-medium">
                      {t("stats_24h")}
                    </span>
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
    </div>
  );
}
