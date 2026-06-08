import { setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCards, type AdminStats } from "@/components/admin/stats-cards";
import { QuickActions } from "@/components/admin/quick-actions";
import { ModerationQueue } from "@/components/admin/moderation-queue";
import { getCurrentUser } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { AlertTriangle, ShieldCheck, Clock } from "lucide-react";
import { Link } from "@/i18n/routing";
import type { IncidentListItem } from "@/types";
import { toIncidentListItems } from "@/lib/mappers";

export async function generateMetadata({
  params: _params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return { title: "Admin Dashboard" };
}

export default async function AdminDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const user = await getCurrentUser();
  if (!user) redirect(`/${locale}/auth/signin?next=/${locale}/admin`);
  if (user.role !== "moderator" && user.role !== "admin") {
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
      .eq("status", "pending"),
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
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-fg-primary inline-flex items-center gap-2 text-2xl font-bold">
            <ShieldCheck className="text-brand-400 h-6 w-6" />
            Admin dashboard
          </h1>
          <p className="text-fg-muted mt-1 text-sm">{user.email}</p>
        </div>
        <nav className="hidden items-center gap-1 text-sm md:flex">
          <Link
            href={`/${locale}/admin/moderation` as never}
            className="text-fg-muted hover:bg-bg-tertiary hover:text-fg-primary rounded-md px-3 py-1.5 transition-colors"
          >
            Moderation
          </Link>
          <Link
            href={`/${locale}/admin/takedown` as never}
            className="text-fg-muted hover:bg-bg-tertiary hover:text-fg-primary rounded-md px-3 py-1.5 transition-colors"
          >
            Takedowns
          </Link>
          <Link
            href={`/${locale}/admin/users` as never}
            className="text-fg-muted hover:bg-bg-tertiary hover:text-fg-primary rounded-md px-3 py-1.5 transition-colors"
          >
            Users
          </Link>
          <Link
            href={`/${locale}/admin/providers` as never}
            className="text-fg-muted hover:bg-bg-tertiary hover:text-fg-primary rounded-md px-3 py-1.5 transition-colors"
          >
            Providers
          </Link>
          <Link
            href={`/${locale}/admin/autopilot` as never}
            className="text-fg-muted hover:bg-bg-tertiary hover:text-fg-primary rounded-md px-3 py-1.5 transition-colors"
          >
            Autopilot
          </Link>
          <Link
            href={`/${locale}/admin/audit` as never}
            className="text-fg-muted hover:bg-bg-tertiary hover:text-fg-primary rounded-md px-3 py-1.5 transition-colors"
          >
            Audit
          </Link>
        </nav>
      </header>

      <StatsCards stats={stats} />

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="inline-flex items-center gap-2">
                <AlertTriangle className="text-warning-500 h-5 w-5" />
                Moderation queue ({queue.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ModerationQueue incidents={queue} />
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <QuickActions locale={locale} />
          <Card>
            <CardHeader>
              <CardTitle className="inline-flex items-center gap-2 text-base">
                <Clock className="text-fg-muted h-4 w-4" />
                Quick overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-fg-muted">Takedowns (pending)</span>
                <span className="text-danger-500 font-semibold">{stats.takedown_requests}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-fg-muted">Providers registered</span>
                <span className="text-brand-400 font-semibold">{stats.providers}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-fg-muted">Incidents today</span>
                <span className="text-accent-400 font-semibold">{stats.recent_24h}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
}
