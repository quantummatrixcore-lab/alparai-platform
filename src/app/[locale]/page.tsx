import { setRequestLocale, getTranslations } from "next-intl/server";
import { createServerClient } from "@/lib/supabase/server";
import { HeroSection } from "@/components/marketing/hero-section";
import { FounderStory } from "@/components/marketing/founder-story";
import { WhyItMatters } from "@/components/marketing/why-it-matters";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { LiveFeed } from "@/components/marketing/live-feed";
import { LeaderboardPreview } from "@/components/marketing/leaderboard-preview";
import { TrustBar } from "@/components/marketing/trust-bar";
import { GetInvolved } from "@/components/marketing/get-involved";
import { ClosingSection } from "@/components/marketing/closing-section";
import { SuggestFeatureCTA } from "@/components/marketing/cta-suggest-feature";
import { NewsTicker } from "@/components/marketing/news-ticker";
import { EcosystemPulse, type EcosystemNewsItem } from "@/components/marketing/ecosystem-pulse";
import { Container, Section } from "@/components/ui/layout";
import { PollCard, type Poll } from "@/components/dilemmas/poll-card";
import { IncidentOfTheWeek } from "@/components/marketing/incident-of-the-week";
import { AdvocateOfTheWeek, type Advocate } from "@/components/marketing/advocate-of-the-week";
import type { IncidentListItem, LeaderboardEntry } from "@/types";
import { toIncidentListItems } from "@/lib/mappers";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const supabase = await createServerClient();

  const [
    incidentsResult,
    incidentsCountResult,
    providersResult,
    pollsResult,
    topUserResult,
    newsResult,
  ] = await Promise.all([
    supabase
      .from("incidents")
      .select(
        "id, title_masked, description_masked, severity, status, category, is_anonymous, incident_date, views_count, created_at, ai_provider_id, user_id",
      )
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
      .from("ai_polls")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .returns<Poll[]>(),
    supabase
      .from("users")
      .select("id, name:full_name, avatar_url, reputation_score, badges")
      .order("reputation_score", { ascending: false })
      .limit(1)
      .returns<Advocate[]>(),
    supabase
      .from("ecosystem_news")
      .select(
        "id, title_en, title_tr, summary_en, summary_tr, url, source, category, severity, published_at",
      )
      .eq("is_active", true)
      .order("published_at", { ascending: false })
      .limit(5)
      .returns<EcosystemNewsItem[]>(),
  ]);

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
      provider_name: provider?.name ?? "Unknown",
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
  ).map((p) => ({
    provider_id: p["id"] as string,
    provider_name: (p["name"] as string) ?? "",
    provider_slug: (p["slug"] as string) ?? "",
    incident_count: incidentCountsByProvider.get(p["id"] as string) ?? 0,
    resolved_count: 0,
    avg_severity: 0,
    trend: 0,
  }));

  const topPoll = pollsResult.data?.[0];
  const topAdvocate = topUserResult.data?.[0] ?? null;
  const ecosystemNews = (newsResult.data ?? []) as EcosystemNewsItem[];
  const tickerItems = ecosystemNews.map((n) => ({
    id: n.id,
    title: n.title_tr ?? n.title_en,
    severity: n.severity,
    source: n.source,
  }));

  return (
    <>
      <HeroSection
        totalIncidents={incidentsCountResult.count ?? 0}
        totalProviders={providersResult.data?.length ?? 0}
      />

      {tickerItems.length > 0 && <NewsTicker items={tickerItems} />}

      <EcosystemPulse news={ecosystemNews} poll={topPoll ?? null} />

      <Section className="bg-bg-primary pt-12 pb-6">
        <Container>
          <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-2">
            <IncidentOfTheWeek incident={incidents[0] ?? null} />
            <AdvocateOfTheWeek advocate={topAdvocate} />
          </div>
        </Container>
      </Section>

      {topPoll && (
        <Section className="bg-bg-secondary border-brand-500/10 border-y">
          <Container>
            <div className="mx-auto mb-8 max-w-4xl text-center">
              <h2 className="bg-gradient-brand bg-clip-text text-3xl font-extrabold text-transparent">
                {(await getTranslations({ locale, namespace: "dilemmas" }))("title")}
              </h2>
              <p className="text-fg-muted mt-2">
                {(await getTranslations({ locale, namespace: "dilemmas" }))("description")}
              </p>
            </div>
            <div className="mx-auto max-w-2xl">
              <PollCard poll={topPoll} />
            </div>
          </Container>
        </Section>
      )}

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
      <TrustBar />
      <GetInvolved />
      <ClosingSection />
      <SuggestFeatureCTA />
    </>
  );
}
