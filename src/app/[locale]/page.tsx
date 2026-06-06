import { setRequestLocale } from "next-intl/server";
import { createServerClient } from "@/lib/supabase/server";
import { HeroSection } from "@/components/marketing/hero-section";
import { LiveFeed } from "@/components/marketing/live-feed";
import { LeaderboardPreview } from "@/components/marketing/leaderboard-preview";
import { SuggestFeatureCTA } from "@/components/marketing/cta-suggest-feature";
import { Container, Section } from "@/components/ui/layout";
import type { IncidentListItem, LeaderboardEntry } from "@/types";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const supabase = await createServerClient();

  const [incidentsResult, incidentsCountResult, providersResult, countriesResult] =
    await Promise.all([
      supabase
        .from("incidents")
        .select("id, title_masked, description_masked, severity, status, category, is_anonymous, incident_date, views_count, created_at, ai_provider_id, user_id")
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .limit(5),
      supabase
        .from("incidents")
        .select("*", { count: "exact", head: true })
        .eq("status", "published"),
      supabase
        .from("ai_providers")
        .select("id, slug, name, description, logo_url, website_url, is_verified")
        .order("name"),
      supabase
        .from("incidents")
        .select("location_country")
        .not("location_country", "is", null),
    ]);

  const providerMap = new Map(
    ((providersResult.data as Array<{ id: string; slug: string; name: string }>) ?? []).map((p) => [
      p.id,
      p,
    ])
  );

  const incidents: IncidentListItem[] = ((incidentsResult.data as Array<Record<string, unknown>>) ?? []).map(
    (row) => {
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
    }
  );

  const leaderboard: LeaderboardEntry[] = (((providersResult.data as Array<Record<string, unknown>>) ?? [])).map(
    (p) => ({
      provider_id: p["id"] as string,
      provider_name: (p["name"] as string) ?? "",
      provider_slug: (p["slug"] as string) ?? "",
      incident_count: 0,
      resolved_count: 0,
      avg_severity: 0,
      trend: 0,
    })
  );

  const countries = new Set(
    ((countriesResult.data as Array<{ location_country: string | null }>) ?? [])
      .map((c) => c.location_country)
      .filter(Boolean)
  ).size;

  return (
    <>
      <HeroSection
        totalIncidents={incidentsCountResult.count ?? 0}
        totalProviders={providersResult.data?.length ?? 0}
        totalCountries={countries}
      />
      <Section>
        <Container>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
            <LiveFeed incidents={incidents} />
            <LeaderboardPreview entries={leaderboard} />
          </div>
        </Container>
      </Section>
      <SuggestFeatureCTA />
    </>
  );
}
