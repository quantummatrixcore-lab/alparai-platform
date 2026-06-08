import { setRequestLocale, getTranslations } from "next-intl/server";
import { createServerClient } from "@/lib/supabase/server";
import { Container } from "@/components/ui/layout";
import { IncidentList } from "@/components/incidents/incident-list";
import { IncidentFilters } from "@/components/marketing/incident-filters";
import type { IncidentListItem } from "@/types";
import { toIncidentListItems } from "@/lib/mappers";

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
  const t = await getTranslations({ locale, namespace: "incident" });
  const { q, category, severity } = await searchParams;
  const supabase = await createServerClient();

  let query = supabase
    .from("incidents")
    .select(
      "id, title_masked, description_masked, severity, status, category, is_anonymous, incident_date, views_count, created_at, ai_provider_id, user_id"
    )
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
    ((providersResult.data as Array<{ id: string; slug: string; name: string }>) ?? []).map((p) => [
      p.id,
      p,
    ])
  );

  const items: IncidentListItem[] = toIncidentListItems(incidentsResult.data)
    .map((item) => {
      const providerId = (incidentsResult.data as Array<Record<string, unknown>> | null)?.find(
        (r) => r["id"] === item.id
      )?.["ai_provider_id"] as string | null;
      const provider = providerId ? providerMap.get(providerId) : null;
      return {
        ...item,
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
        <h1 className="text-fg-primary text-3xl font-bold tracking-tight">{t("page_title")}</h1>
        <p className="text-fg-muted mt-2 text-sm">{t("page_subtitle", { count: items.length })}</p>
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
