import { setRequestLocale, getTranslations } from "next-intl/server";
import { createServerClient } from "@/lib/supabase/server";
import { Container } from "@/components/ui/layout";
import { IncidentList } from "@/components/incidents/incident-list";
import { IncidentFilters } from "@/components/marketing/incident-filters";
import { Pagination } from "@/components/ui/pagination";
import {
  SidebarEngagement,
  type SidebarNewsItem,
  type SidebarPollData,
} from "@/components/dilemmas/sidebar-engagement";
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
  searchParams: Promise<{
    q?: string;
    category?: string;
    severity?: string;
    sort?: string;
    page?: string;
  }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "incident" });
  const tCommon = await getTranslations({ locale, namespace: "common" });
  const { q, category, severity, sort, page } = await searchParams;
  const supabase = await createServerClient();

  const pageNum = Math.max(1, parseInt(page || "1", 10));
  const sortVal = sort || "newest";
  const pageSize = 12;

  let query = supabase
    .from("incidents")
    .select(
      "id, title_masked, description_masked, title_tr, description_tr, severity, status, category, is_anonymous, incident_date, views_count, upvotes_count, created_at, ai_provider_id, user_id, cross_audit_truth_score, cross_audit_confidence",
      { count: "exact" },
    )
    .eq("status", "published");

  if (category) query = query.eq("category", category as never);
  if (severity) query = query.eq("severity", severity as never);

  if (q) {
    const sanitized = q
      .trim()
      .replace(/[^\w\s-]/g, "")
      .slice(0, 100);
    if (sanitized.length >= 2) {
      query = query.or(`title_masked.ilike.%${sanitized}%,description_masked.ilike.%${sanitized}%`);
    }
  }

  // Apply sorting
  if (sortVal === "votes") {
    query = query.order("upvotes_count", { ascending: false });
  } else if (sortVal === "views") {
    query = query.order("views_count", { ascending: false });
  } else if (sortVal === "truth_score") {
    query = query.order("cross_audit_truth_score", { ascending: false, nullsFirst: false });
  } else {
    query = query.order("published_at", { ascending: false });
  }

  // Apply pagination
  const fromOffset = (pageNum - 1) * pageSize;
  const toOffset = pageNum * pageSize - 1;
  query = query.range(fromOffset, toOffset);

  const [incidentsResult, providersResult, pollResult, newsResult] = await Promise.all([
    query,
    supabase.from("ai_providers").select("id, slug, name"),
    supabase
      .from("ai_polls")
      .select("id, title, yes_count, no_count, unsure_count")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(1),
    supabase
      .from("ecosystem_news")
      .select("id, title_en, title_tr, source, severity, published_at")
      .eq("is_active", true)
      .order("published_at", { ascending: false })
      .limit(4)
      .returns<SidebarNewsItem[]>(),
  ]);

  const providerMap = new Map(
    ((providersResult.data as Array<{ id: string; slug: string; name: string }>) ?? []).map((p) => [
      p.id,
      p,
    ]),
  );

  const items: IncidentListItem[] = toIncidentListItems(incidentsResult.data).map((item) => {
    const providerId = (incidentsResult.data as Array<Record<string, unknown>> | null)?.find(
      (r) => r["id"] === item.id,
    )?.["ai_provider_id"] as string | null;
    const provider = providerId ? providerMap.get(providerId) : null;
    return {
      ...item,
      provider_name: provider?.name ?? tCommon("unknown"),
      provider_slug: provider?.slug ?? "",
    };
  });

  const totalCount = incidentsResult.count ?? 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  const topPoll = (pollResult.data?.[0] ?? null) as SidebarPollData | null;
  const sidebarNews = (newsResult.data ?? []) as SidebarNewsItem[];

  return (
    <Container className="py-10">
      <header className="mb-8">
        <h1 className="text-fg-primary text-3xl font-bold tracking-tight">{t("page_title")}</h1>
        <p className="text-fg-muted mt-2 text-sm">{t("page_subtitle", { count: totalCount })}</p>
      </header>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr_300px]">
        <aside>
          <IncidentFilters
            defaultCategory={category}
            defaultSeverity={severity}
            defaultQ={q}
            defaultSort={sortVal}
          />
        </aside>
        <section className="flex flex-col">
          <div className="flex-1">
            <IncidentList incidents={items} />
          </div>
          <Pagination
            currentPage={pageNum}
            totalPages={totalPages}
            category={category}
            severity={severity}
            q={q}
            sort={sortVal}
          />
        </section>
        <SidebarEngagement poll={topPoll} news={sidebarNews} />
      </div>
    </Container>
  );
}
