import { setRequestLocale, getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IncidentList } from "@/components/incidents/incident-list";
import { getCurrentUser } from "@/lib/auth/session";
import { createServerClient } from "@/lib/supabase/server";
import type { IncidentListItem } from "@/types";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  return { title: "My Incidents" };
}

export default async function MyIncidentsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const user = await getCurrentUser();
  if (!user) redirect(`/${locale}/auth/signin?next=/${locale}/my-incidents`);

  const supabase = await createServerClient();
  const { data } = await supabase
    .from("incidents")
    .select("id, title_masked, description_masked, severity, status, category, is_anonymous, incident_date, views_count, created_at, ai_provider_id, user_id")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const items: IncidentListItem[] = ((data as Array<Record<string, unknown>>) ?? []).map(
    (r) => ({
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
    })
  );

  return (
    <Container className="py-10">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-fg-primary">My reports</h1>
        <p className="mt-1 text-sm text-fg-muted">{items.length} submissions, all statuses.</p>
      </header>
      <IncidentList incidents={items} />
    </Container>
  );
}
