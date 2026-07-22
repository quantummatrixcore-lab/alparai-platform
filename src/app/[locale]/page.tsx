export const revalidate = 60;

import { setRequestLocale, getTranslations } from "next-intl/server";
import { createServerClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { HeroSection } from "@/components/marketing/hero-section";
import { WebSiteJsonLd } from "@/components/seo/json-ld";
import { Container, Section } from "@/components/ui/layout";
import type { IncidentListItem, LeaderboardEntry } from "@/types";
import { toIncidentListItems } from "@/lib/mappers";
import { checkAndTriggerNewsSyncPassive } from "@/actions/autopilot-sync";
import { Link } from "@/i18n/routing";
import dynamic from "next/dynamic";
import { logger } from "@/lib/utils/logger";

const LiveStats = dynamic(() =>
  import("@/components/marketing/live-stats").then((mod) => mod.LiveStats),
);

const WhyItMatters = dynamic(() =>
  import("@/components/marketing/why-it-matters").then((mod) => mod.WhyItMatters),
);
const HowItWorks = dynamic(() =>
  import("@/components/marketing/how-it-works").then((mod) => mod.HowItWorks),
);
const LiveFeed = dynamic(() =>
  import("@/components/marketing/live-feed").then((mod) => mod.LiveFeed),
);
const LeaderboardPreview = dynamic(() =>
  import("@/components/marketing/leaderboard-preview").then((mod) => mod.LeaderboardPreview),
);
const GetInvolved = dynamic(() =>
  import("@/components/marketing/get-involved").then((mod) => mod.GetInvolved),
);
const ClosingSection = dynamic(() =>
  import("@/components/marketing/closing-section").then((mod) => mod.ClosingSection),
);

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "app" });

  const supabase = await createServerClient();
  const admin = createAdminClient();
  const [{ count: incidentCount }, { data: providers }] = await Promise.all([
    admin.from("incidents").select("id", { count: "exact", head: true }).eq("status", "published"),
    supabase.from("ai_providers").select("id"),
  ]);

  const incidents = (incidentCount ?? 371).toString();
  const providerCount = (providers?.length ?? 23).toString();
  const ogDescription = `World's first community-governed AI accountability platform. ${incidents}+ verified incidents. ${providerCount} providers tracked.`;

  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: "ALPAR AI — When an AI lies, who is accountable?",
      description: ogDescription,
      images: ["/og-image.jpg"],
    },
    twitter: {
      card: "summary_large_image",
      title: "ALPAR AI — When an AI lies, who is accountable?",
      description: ogDescription,
      images: ["/og-image.jpg"],
    },
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Passive background sync of AI news
  void checkAndTriggerNewsSyncPassive();

  const supabase = await createServerClient();
  const admin = createAdminClient();
  const tCommon = await getTranslations({ locale, namespace: "common" });

  const [incidentsResult, incidentsCountResult, providersResult, countriesResult, sourcesResult] =
    await Promise.all([
      supabase
        .from("incidents")
        .select(
          "id, title_masked, description_masked, title_tr, description_tr, severity, status, category, is_anonymous, incident_date, views_count, upvotes_count, created_at, ai_provider_id, user_id, cross_audit_truth_score, cross_audit_confidence, incident_source",
        )
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .limit(5),
      admin
        .from("incidents")
        .select("id", { count: "exact", head: true })
        .eq("status", "published"),
      supabase
        .from("provider_leaderboard")
        .select(
          "id, slug, name, logo_url, website_url, is_verified, trust_score, incident_count, response_count, is_verified_respondent",
        )
        .order("name"),
      supabase
        .from("incidents")
        .select("location_country")
        .eq("status", "published")
        .not("location_country", "is", null),
      supabase.from("incidents").select("incident_source").eq("status", "published"),
    ]);

  if (incidentsCountResult.error) {
    logger.error(
      "Supabase error for incidents count",
      undefined,
      incidentsCountResult.error instanceof Error ? incidentsCountResult.error : undefined,
    );
  }
  if (countriesResult.error) {
    logger.error(
      "Supabase error for countries count",
      undefined,
      countriesResult.error instanceof Error ? countriesResult.error : undefined,
    );
  }
  if (incidentsResult.error) {
    logger.error(
      "Supabase error for incidents list",
      undefined,
      incidentsResult.error instanceof Error ? incidentsResult.error : undefined,
    );
  }
  if (providersResult.error) {
    logger.error(
      "Supabase error for provider leaderboard",
      undefined,
      providersResult.error instanceof Error ? providersResult.error : undefined,
    );
  }
  if (sourcesResult.error) {
    logger.error(
      "Supabase error for incident sources",
      undefined,
      sourcesResult.error instanceof Error ? sourcesResult.error : undefined,
    );
  }

  const countsBySource = {
    user_submitted: 0,
    aiaaic_import: 0,
    aiid_import: 0,
    news_curated: 0,
    court_record: 0,
  };
  ((sourcesResult.data as Array<{ incident_source: string | null }>) ?? []).forEach((row) => {
    const src = row.incident_source || "user_submitted";
    if (src in countsBySource) {
      countsBySource[src as keyof typeof countsBySource]++;
    }
  });

  const providerMap = new Map(
    (
      (providersResult.data as unknown as Array<{ id: string; slug: string; name: string }>) ?? []
    ).map((p) => [p.id, p]),
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

  const leaderboard: LeaderboardEntry[] = (
    (providersResult.data as unknown as Array<Record<string, unknown>>) ?? []
  )
    .filter((p) => p["slug"] !== "alpar-autopilot")
    .map((p) => {
      const total = (p["incident_count"] as number) ?? 0;
      const responded = (p["response_count"] as number) ?? 0;
      const responseRate = total > 0 ? Math.round((responded / total) * 100) : 0;
      return {
        provider_id: p["id"] as string,
        provider_name: (p["name"] as string) ?? "",
        provider_slug: (p["slug"] as string) ?? "",
        incident_count: total,
        resolved_count: responded,
        avg_severity: 0,
        trend: 0,
        trust_score: (p["trust_score"] as number) ?? 70,
        response_rate: responseRate,
        is_verified_respondent: !!p["is_verified_respondent"],
      };
    })
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

      {/* Live Submit CTA Banner — replaces pre-launch countdown */}
      <Section className="relative overflow-hidden border-b border-white/5 bg-slate-950/40 py-10">
        <div className="bg-danger-500/8 absolute -top-[50%] left-1/2 h-[300px] w-[600px] -translate-x-1/2 rounded-full blur-[80px]" />
        <Container className="relative z-10 max-w-4xl">
          <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
            <div>
              <div className="border-danger-500/30 bg-danger-500/10 text-danger-400 mb-3 inline-flex items-center gap-1.5 rounded-sm border px-3 py-1 text-[10px] font-bold tracking-[0.15em] uppercase">
                <span className="bg-danger-500 h-1.5 w-1.5 animate-pulse rounded-full" />
                {locale === "tr" ? "CANLI YAYINDA" : "LIVE NOW"}
              </div>
              <h2 className="text-fg-primary text-2xl font-black tracking-tight sm:text-3xl">
                {locale === "tr"
                  ? "Bir Yapay Zeka Olayı mı Gördünüz?"
                  : "Witnessed an AI Incident?"}
              </h2>
              <p className="text-fg-secondary mt-2 max-w-md text-sm">
                {locale === "tr"
                  ? "ALPAR AI şu anda canlı yayında. Olayları doğrudan kamuya açık kayıt defterimize bildirin. Hiçbir hesap gerekmez — kimliğiniz korunur."
                  : "ALPAR AI is live. Report incidents directly to the public registry. No account needed — your identity is protected."}
              </p>
            </div>
            <div className="flex flex-col items-center gap-4">
              <Link
                href="/submit"
                className="bg-danger-500 hover:bg-danger-400 inline-flex h-14 items-center gap-3 rounded-md px-10 text-lg font-black text-white shadow-[0_0_30px_rgba(230,57,70,0.5)] transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-[0_0_50px_rgba(230,57,70,0.8)]"
              >
                {locale === "tr" ? "Olay Bildir" : "Report an Incident"}
              </Link>
              <p className="text-fg-muted text-xs">
                {locale === "tr"
                  ? "Zaten 400+ doğrulanmış olay kayıtlı"
                  : "400+ verified incidents already documented"}
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <HeroSection
        totalIncidents={incidentsCountResult.count ?? 0}
        totalProviders={providersResult.data?.length ?? 0}
        totalCountries={uniqueCountriesCount}
        topProviders={topProvidersForHero}
        countsBySource={countsBySource}
      />

      <LiveStats
        totalIncidents={incidentsCountResult.count ?? 0}
        totalProviders={providersResult.data?.length ?? 0}
        totalCountries={uniqueCountriesCount}
        countsBySource={countsBySource}
      />

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
