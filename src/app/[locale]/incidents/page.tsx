import { setRequestLocale, getTranslations } from "next-intl/server";
import { createServerClient } from "@/lib/supabase/server";
import { Container } from "@/components/ui/layout";
import { IncidentList } from "@/components/incidents/incident-list";
import { IncidentFilters } from "@/components/marketing/incident-filters";
import type { IncidentListItem } from "@/types";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  return { title: t("incidents") };
}

export default async function IncidentsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string; category?: string; severity?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { q, category, severity } = await searchParams;
  const supabase = await createServerClient();

  let query = supabase
    .from("incidents")
    .select("id, title_masked, description_masked, severity, status, category, is_anonymous, incident_date, views_count, created_at, ai_provider_id, user_id")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(50);

  if (category) query = query.eq("category", category as never);
  if (severity) query = query.eq("severity", severity as never);

  const [incidentsResult, providersResult] = await Promise.all([
    query,
    supabase.from("ai_providers").select("id, slug, name"),
  ]);
  const providerMap = new Map(
    ((providersResult.data as Array<{ id: string; slug: string; name: string }>) ?? []).map((p) => [p.id, p])
  );

  const items: IncidentListItem[] = ((incidentsResult.data as Array<Record<string, unknown>>) ?? [])
    .map((row) => {
      const providerId = row["ai_provider_id"] as string | null;
      const provider = providerId ? providerMap.get(providerId) : null;
      return {
        id: row["id"] as string,
        title_masked: (row["title_masked"] as string) ?? "",
        description_masked: (row["description_masked"] as string) ?? "",
        severity: row["severity"] as IncidentListItem["severity"],
        status: row["status"] as IncidentListItem["status"],
        category: row["category"] as IncidentListItem["category"],
        is_anonymous: (row["is_anonymous"] as boolean) ?? false,
        incident_date: (row["incident_date"] as string) ?? (row["created_at"] as string),
        created_at: (row["created_at"] as string) ?? "",
        view_count: (row["views_count"] as number) ?? 0,
        vote_count: 0,
        evidence_count: 0,
        author_name: null,
        provider_name: provider?.name ?? "Unknown",
        provider_slug: provider?.slug ?? "",
      };
    })
    .filter((i) => {
      if (!q) return true;
      const qLower = q.toLowerCase();
      return (
        i.title_masked.toLowerCase().includes(qLower) ||
        i.description_masked.toLowerCase().includes(qLower)
      );
    });

  return (
    <Container className="py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-fg-primary">All Incidents</h1>
        <p className="mt-2 text-sm text-fg-muted">
          Browse {items.length} published reports from the community.
        </p>
      </header>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
        <aside>
          <IncidentFilters defaultCategory={category} defaultSeverity={severity} />
        </aside>
        <section>
          <IncidentList incidents={items} />
        </section>
      </div>
    </Container>
  );
}
