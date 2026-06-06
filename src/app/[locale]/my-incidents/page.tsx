import { setRequestLocale, getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IncidentList } from "@/components/incidents/incident-list";
import { getCurrentUser } from "@/lib/auth/session";
import { createServerClient } from "@/lib/supabase/server";
import type { IncidentListItem } from "@/types";
import { toIncidentListItems } from "@/lib/mappers";

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

  const items: IncidentListItem[] = toIncidentListItems(data);

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
