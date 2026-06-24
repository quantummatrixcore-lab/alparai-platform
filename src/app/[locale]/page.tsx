export const revalidate = 60;

import { setRequestLocale, getTranslations } from "next-intl/server";
import { createServerClient } from "@/lib/supabase/server";
import { HeroSection } from "@/components/marketing/hero-section";
import { LiveStats } from "@/components/marketing/live-stats";
import { WebSiteJsonLd } from "@/components/seo/json-ld";
import { FounderStory } from "@/components/marketing/founder-story";
import { WhyItMatters } from "@/components/marketing/why-it-matters";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { LiveFeed } from "@/components/marketing/live-feed";
import { LeaderboardPreview } from "@/components/marketing/leaderboard-preview";
import { GetInvolved } from "@/components/marketing/get-involved";
import { ClosingSection } from "@/components/marketing/closing-section";
import { Container, Section } from "@/components/ui/layout";
import type { IncidentListItem, LeaderboardEntry } from "@/types";
import { toIncidentListItems } from "@/lib/mappers";
import { checkAndTriggerNewsSyncPassive } from "@/actions/autopilot-sync";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "app" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Passive background sync of AI news
  void checkAndTriggerNewsSyncPassive();

  const supabase = await createServerClient();
  const tCommon = await getTranslations({ locale, namespace: "common" });

  const [incidentsResult, incidentsCountResult, providersResult, countriesResult] =
    await Promise.all([
      supabase
        .from("incidents")
        .select(
          "id, title_masked, description_masked, title_tr, description_tr, severity, status, category, is_anonymous, incident_date, views_count, upvotes_count, created_at, ai_provider_id, user_id, cross_audit_truth_score, cross_audit_confidence",
        )
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .limit(5),
      supabase
        .from("incidents")
        .select("id", { count: "exact", head: true })
        .eq("status", "published"),
      supabase
        .from("ai_providers")
        .select("id, slug, name, description, logo_url, website_url, is_verified, trust_score")
        .order("name"),
      supabase
        .from("incidents")
        .select("location_country")
        .eq("status", "published")
        .not("location_country", "is", null),
    ]);

  if (incidentsCountResult.error) {
    console.error("Supabase error for incidents count:", incidentsCountResult.error);
  }
  if (countriesResult.error) {
    console.error("Supabase error for countries count:", countriesResult.error);
  }
  if (incidentsResult.error) {
    console.error("Supabase error for incidents list:", incidentsResult.error);
  }

  const providerMap = new Map(
    ((providersResult.data as Array<{ id: string; slug: string; name: string }>) ?? []).map((p) => [
      p.id,
      p,
    ]),
  );

  const incidents: IncidentListItem[] = toIncidentListItems(incidentsResult.data).map((item) => {
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

  const incidentCountsByProvider = new Map<string, number>();
  if (providersResult.data) {
    const { data: countData } = await supabase
      .from("incidents")
      .select("ai_provider_id")
      .eq("status", "published")
      .not("ai_provider_id", "is", null);
    if (countData) {
      for (const row of countData as Array<{ ai_provider_id: string }>) {
        incidentCountsByProvider.set(
          row.ai_provider_id,
          (incidentCountsByProvider.get(row.ai_provider_id) ?? 0) + 1,
        );
      }
    }
  }

  const leaderboard: LeaderboardEntry[] = (
    (providersResult.data as Array<Record<string, unknown>>) ?? []
  )
    .filter((p) => p["slug"] !== "alpar-autopilot")
    .map((p) => ({
      provider_id: p["id"] as string,
      provider_name: (p["name"] as string) ?? "",
      provider_slug: (p["slug"] as string) ?? "",
      incident_count: incidentCountsByProvider.get(p["id"] as string) ?? 0,
      resolved_count: 0,
      avg_severity: 0,
      trend: 0,
      trust_score: (p["trust_score"] as number) ?? 70,
    }))
    .sort((a, b) => {
      const scoreA = a.trust_score ?? 70;
      const scoreB = b.trust_score ?? 70;
      if (scoreB !== scoreA) return scoreB - scoreA;
      if (a.incident_count !== b.incident_count) return a.incident_count - b.incident_count;
      return a.provider_name.localeCompare(b.provider_name);
    });

  const topProvidersForHero = [...leaderboard].slice(0, 5).map((p) => ({
    name: p.provider_name,
    count: p.incident_count,
    slug: p.provider_slug,
  }));

  const uniqueCountriesCount = new Set(
    ((countriesResult.data as Array<{ location_country: string | null }>) ?? [])
      .map((c) => c.location_country)
      .filter(Boolean),
  ).size;

  return (
    <>
      <WebSiteJsonLd />
      <HeroSection
        totalIncidents={incidentsCountResult.count ?? 0}
        totalProviders={providersResult.data?.length ?? 0}
        totalCountries={uniqueCountriesCount}
        topProviders={topProvidersForHero}
      />

      <LiveStats
        totalIncidents={incidentsCountResult.count ?? 0}
        totalProviders={providersResult.data?.length ?? 0}
        totalCountries={uniqueCountriesCount}
      />

      <FounderStory />

      <WhyItMatters />

      <HowItWorks />

      <Section>
        <Container>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
            <LiveFeed incidents={incidents} />
            <LeaderboardPreview entries={leaderboard} />
          </div>
        </Container>
      </Section>

      <GetInvolved />

      <ClosingSection />
    </>
  );
}
