import { setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCards, type AdminStats } from "@/components/admin/stats-cards";
import { ModerationQueue } from "@/components/admin/moderation-queue";
import { getCurrentUser } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { FileText, Clock, AlertTriangle, Users, ShieldCheck } from "lucide-react";
import { Link } from "@/i18n/routing";
import type { IncidentListItem } from "@/types";
import { toIncidentListItems } from "@/lib/mappers";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
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
    admin.from("incidents").select("*", { count: "exact", head: true }).eq("status", "pending_review"),
    admin.from("incidents").select("*", { count: "exact", head: true }).eq("status", "published"),
    admin.from("incidents").select("*", { count: "exact", head: true }).eq("status", "takedown"),
    admin.from("users").select("*", { count: "exact", head: true }),
    admin.from("ai_providers").select("*", { count: "exact", head: true }),
    admin.from("takedown_requests").select("*", { count: "exact", head: true }).eq("status", "pending"),
    admin.from("incidents").select("*", { count: "exact", head: true })
      .gte("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()),
    admin.from("incidents")
      .select("id, title_masked, description_masked, severity, status, category, is_anonymous, incident_date, views_count, created_at, ai_provider_id, user_id")
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
      <header className="mb-6 flex items-center justify-between">
        <h1 className="inline-flex items-center gap-2 text-2xl font-bold text-fg-primary">
          <ShieldCheck className="h-6 w-6 text-brand-400" />
          Admin dashboard
        </h1>
        <nav className="flex flex-wrap items-center gap-2 text-sm">
          <Link href={`/${locale}/admin/moderation` as never} className="text-fg-muted hover:text-brand-400">Moderation</Link>
          <span className="text-fg-muted">·</span>
          <Link href={`/${locale}/admin/takedown` as never} className="text-fg-muted hover:text-brand-400">Takedowns</Link>
          <span className="text-fg-muted">·</span>
          <Link href={`/${locale}/admin/users` as never} className="text-fg-muted hover:text-brand-400">Users</Link>
          <span className="text-fg-muted">·</span>
          <Link href={`/${locale}/admin/providers` as never} className="text-fg-muted hover:text-brand-400">Providers</Link>
          <span className="text-fg-muted">·</span>
          <Link href={`/${locale}/admin/autopilot` as never} className="text-fg-muted hover:text-brand-400">Autopilot</Link>
        </nav>
      </header>
      <StatsCards stats={stats} />
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="inline-flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning-500" />
            Moderation queue ({queue.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ModerationQueue incidents={queue} />
        </CardContent>
      </Card>
    </Container>
  );
}
