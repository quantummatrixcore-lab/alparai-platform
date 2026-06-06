import { setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ModerationQueue } from "@/components/admin/moderation-queue";
import { getCurrentUser } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import type { IncidentListItem } from "@/types";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  return { title: "Moderation Queue" };
}

export default async function ModerationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const user = await getCurrentUser();
  if (!user) redirect(`/${locale}/auth/signin?next=/${locale}/admin/moderation`);
  if (user.role !== "moderator" && user.role !== "admin") {
    redirect(`/${locale}`);
  }

  const admin = createAdminClient();
  const { data } = await admin
    .from("incidents")
    .select("id, title_masked, description_masked, severity, status, category, is_anonymous, incident_date, views_count, created_at, ai_provider_id, user_id")
    .eq("status", "pending_review")
    .order("created_at", { ascending: false })
    .limit(50);

  const items: IncidentListItem[] = ((data as Array<Record<string, unknown>>) ?? []).map((r) => ({
    id: r["id"] as string,
    title_masked: (r["title_masked"] as string) ?? "",
    description_masked: (r["description_masked"] as string) ?? "",
    severity: r["severity"] as IncidentListItem["severity"],
    status: r["status"] as IncidentListItem["status"],
    category: r["category"] as IncidentListItem["category"],
    is_anonymous: (r["is_anonymous"] as boolean) ?? false,
    incident_date: (r["incident_date"] as string) ?? (r["created_at"] as string),
    created_at: (r["created_at"] as string) ?? "",
    view_count: (r["views_count"] as number) ?? 0,
    vote_count: 0,
    evidence_count: 0,
    author_name: null,
    provider_name: "—",
    provider_slug: "",
  }));

  return (
    <Container className="py-10">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-fg-primary">Moderation queue</h1>
        <p className="mt-1 text-sm text-fg-muted">
          {items.length} incidents awaiting review.
        </p>
      </header>
      <Card>
        <CardContent className="pt-6">
          <ModerationQueue incidents={items} />
        </CardContent>
      </Card>
    </Container>
  );
}
