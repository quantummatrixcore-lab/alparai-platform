export const revalidate = 20;

import { setRequestLocale, getTranslations } from "next-intl/server";
import { createServerClient } from "@/lib/supabase/server";
import { Container } from "@/components/ui/layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, MessageSquare, TrendingUp, TrendingDown, AlertCircle } from "lucide-react";
import { cn, formatNumber } from "@/lib/utils";
import { Link } from "@/i18n/routing";
import { ProviderLogo } from "@/components/leaderboard/provider-logo";
import { ShareButtons } from "@/components/incidents/share-buttons";
import Image from "next/image";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "leaderboard" });
  return {
    title: t("title"),
    description: t("subtitle"),
  };
}

export default async function LeaderboardPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ filter?: string }>;
}) {
  const { locale } = await params;
  const { filter } = (await searchParams) ?? {};
  const currentFilter = filter || "all";

  setRequestLocale(locale);
  const supabase = await createServerClient();
  const t = await getTranslations({ locale, namespace: "leaderboard" });

  const { data: providers } = await supabase
    .from("ai_providers")
    .select("id, slug, name, logo_url, is_verified, website_url, trust_score")
    .neq("slug", "alpar-autopilot")
    .order("name");

  // Bulk fetch published incidents and published responses to count in memory
  const { data: incidents } = await supabase
    .from("incidents")
    .select("ai_provider_id")
    .eq("status", "published");

  const { data: responses } = await supabase
    .from("ai_provider_responses")
    .select("ai_provider_id")
    .eq("is_published", true);

  const incidentCountsMap = new Map<string, number>();
  if (incidents) {
    for (const incident of incidents) {
      if (incident.ai_provider_id) {
        incidentCountsMap.set(
          incident.ai_provider_id,
          (incidentCountsMap.get(incident.ai_provider_id) ?? 0) + 1,
        );
      }
    }
  }

  const responseCountsMap = new Map<string, number>();
  if (responses) {
    for (const resp of responses) {
      if (resp.ai_provider_id) {
        responseCountsMap.set(
          resp.ai_provider_id,
          (responseCountsMap.get(resp.ai_provider_id) ?? 0) + 1,
        );
      }
    }
  }

  const stats = (
    (providers as Array<{
      id: string;
      slug: string;
      name: string;
      logo_url: string | null;
      is_verified: boolean;
      website_url: string | null;
      trust_score: number | null;
    }>) ?? []
  ).map((p) => {
    const total = incidentCountsMap.get(p.id) ?? 0;
    const responded = responseCountsMap.get(p.id) ?? 0;
    const responseRate = total > 0 ? Math.round((responded / total) * 100) : 0;

    return {
      ...p,
      incident_count: total,
      response_count: responded,
      response_rate: responseRate,
      trust_score: p.trust_score ?? 70,
    };
  });

  const filteredStats = stats.filter((p) => {
    if (currentFilter === "verified") return p.is_verified;
    if (currentFilter === "with_incidents") return p.incident_count > 0;
    return true;
  });

  const sorted = filteredStats.sort((a, b) => {
    const scoreA = a.trust_score ?? 70;
    const scoreB = b.trust_score ?? 70;
    if (scoreB !== scoreA) return scoreB - scoreA;
    // Secondary sort: incident count ascending or name
    if (a.incident_count !== b.incident_count) return a.incident_count - b.incident_count;
    return a.name.localeCompare(b.name);
  });

  return (
    <Container className="py-10">
      <header className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-fg-primary inline-flex items-center gap-2 text-3xl font-bold tracking-tight">
            <Trophy className="text-warning-500 h-7 w-7" />
            {t("title")}
          </h1>
          <p className="text-fg-muted mt-2 text-sm">{t("subtitle")}</p>
        </div>
        <div className="shrink-0">
          <ShareButtons url="/leaderboard" title={t("title")} />
        </div>
      </header>

      <div className="mb-8 flex flex-wrap gap-2">
        <Link
          href="/leaderboard?filter=all"
          className={cn(
            "rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors",
            currentFilter === "all"
              ? "bg-brand-500/20 border-brand-500 text-brand-400"
              : "border-border-subtle hover:bg-bg-tertiary/50 text-fg-muted",
          )}
        >
          {t("filter_all")}
        </Link>
        <Link
          href="/leaderboard?filter=verified"
          className={cn(
            "rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors",
            currentFilter === "verified"
              ? "bg-brand-500/20 border-brand-500 text-brand-400"
              : "border-border-subtle hover:bg-bg-tertiary/50 text-fg-muted",
          )}
        >
          {t("filter_verified")}
        </Link>
        <Link
          href="/leaderboard?filter=with_incidents"
          className={cn(
            "rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors",
            currentFilter === "with_incidents"
              ? "bg-brand-500/20 border-brand-500 text-brand-400"
              : "border-border-subtle hover:bg-bg-tertiary/50 text-fg-muted",
          )}
        >
          {t("filter_with_incidents")}
        </Link>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="bg-brand-500/10 flex h-10 w-10 items-center justify-center rounded-lg">
              <Trophy className="text-brand-400 h-5 w-5" />
            </div>
            <div>
              <p className="text-fg-primary text-2xl font-bold">{stats.length}</p>
              <p className="text-fg-muted text-xs">{t("providersTracked")}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="bg-success-500/10 flex h-10 w-10 items-center justify-center rounded-lg">
              <MessageSquare className="text-success-500 h-5 w-5" />
            </div>
            <div>
              <p className="text-fg-primary text-2xl font-bold">
                {stats.reduce((s, p) => s + p.response_count, 0)}
              </p>
              <p className="text-fg-muted text-xs">{t("totalResponses")}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="bg-accent-500/10 flex h-10 w-10 items-center justify-center rounded-lg">
              <TrendingUp className="text-accent-400 h-5 w-5" />
            </div>
            <div>
              <p className="text-fg-primary text-2xl font-bold">
                {stats.filter((p) => p.incident_count > 0).length > 0
                  ? Math.round(
                      stats
                        .filter((p) => p.incident_count > 0)
                        .reduce((s, p) => s + p.response_rate, 0) /
                        stats.filter((p) => p.incident_count > 0).length,
                    )
                  : 0}
                %
              </p>
              <p className="text-fg-muted text-xs">{t("avgResponseRate")}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trust Score Explanation & Non-Responsive Warnings */}
      <Card className="border-border-subtle bg-bg-secondary/40 mb-6">
        <CardContent className="text-fg-secondary flex items-start gap-3 p-4 text-xs font-semibold">
          <AlertCircle className="text-brand-400 mt-0.5 h-5 w-5 shrink-0" />
          <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-2">
            <span>{t("trust_score_info")}</span>
            <Link
              href="/transparency"
              className="text-brand-400 hover:text-brand-300 inline-flex items-center font-bold whitespace-nowrap underline"
            >
              {t("read_methodology_link")}
            </Link>
          </div>
        </CardContent>
      </Card>

      {(() => {
        const nonResponsive = sorted.filter((p) => p.incident_count > 0 && p.response_count === 0);
        if (nonResponsive.length === 0) return null;
        return (
          <div className="mb-6 space-y-3">
            {nonResponsive.map((p) => (
              <div
                key={p.id}
                className="bg-danger-500/5 border-danger-500/20 text-danger-300 flex flex-col justify-between gap-3 rounded-2xl border p-4 text-xs font-bold sm:flex-row sm:items-center"
              >
                <div className="flex items-center gap-2">
                  <AlertCircle className="text-danger-400 h-4.5 w-4.5 shrink-0" />
                  <span>
                    {t("non_responsive_notice", {
                      provider: p.name,
                      count: p.incident_count,
                    })}
                  </span>
                </div>
                <Link
                  href={`/brand/${p.slug}`}
                  className="text-brand-400 hover:text-brand-300 flex items-center gap-1 self-start underline sm:self-auto"
                >
                  {t("read_all_incidents")} &rarr;
                </Link>
              </div>
            ))}
          </div>
        );
      })()}

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <caption className="sr-only">{t("caption")}</caption>
              <thead>
                <tr className="border-border-subtle text-fg-muted border-b text-left text-xs font-semibold tracking-wider uppercase">
                  <th className="w-12 p-4">{t("rank")}</th>
                  <th className="p-4">{t("provider")}</th>
                  <th className="p-4 text-right">{t("incidents")}</th>
                  <th className="p-4 text-right">
                    <span className="inline-flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      {t("responses")}
                    </span>
                  </th>
                  <th className="p-4 text-right">
                    <span className="inline-flex items-center gap-1">{t("responseRate")}</span>
                  </th>
                  <th className="p-4 text-right">{t("trustScore")}</th>
                </tr>
              </thead>
              <tbody className="divide-border-subtle divide-y">
                {sorted.map((p, i) => (
                  <tr key={p.id} className="hover:bg-bg-tertiary/30">
                    <td className="p-4">
                      <span
                        className={cn(
                          "inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold",
                          i === 0
                            ? "bg-warning-500/15 text-warning-500"
                            : i === 1
                              ? "bg-fg-muted/15 text-fg-muted"
                              : i === 2
                                ? "bg-warning-700/15 text-warning-700"
                                : "bg-bg-tertiary text-fg-muted",
                        )}
                      >
                        {i + 1}
                      </span>
                    </td>
                    <td className="p-4">
                      <Link
                        href={`/brand/${p.slug}`}
                        className="text-fg-primary hover:text-brand-400 group flex items-center gap-3 font-medium transition-colors"
                      >
                        {p.logo_url ? (
                          <div className="border-border-subtle bg-bg-primary relative h-10 w-10 shrink-0 overflow-hidden rounded-md border shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_15px_rgba(231,76,60,0.3)]">
                            <Image
                              src={p.logo_url}
                              alt={`${p.name} logo`}
                              fill
                              className="object-contain p-1.5"
                              sizes="40px"
                            />
                          </div>
                        ) : (
                          <div className="border-border-subtle bg-bg-primary relative h-10 w-10 shrink-0 overflow-hidden rounded-md border shadow-sm">
                            <ProviderLogo src={null} name={p.name} />
                          </div>
                        )}
                        <span className="text-fg-primary">{p.name}</span>
                      </Link>
                    </td>
                    <td className="text-fg-secondary p-4 text-right">
                      {formatNumber(p.incident_count)}
                    </td>
                    <td className="text-fg-secondary p-4 text-right">
                      {formatNumber(p.response_count)}
                    </td>
                    <td className="p-4 text-right">
                      {p.incident_count > 0 ? (
                        <Badge
                          variant={
                            p.response_rate >= 80
                              ? "success"
                              : p.response_rate >= 50
                                ? "warning"
                                : "danger"
                          }
                          size="sm"
                        >
                          {p.response_rate >= 80 ? (
                            <TrendingUp className="mr-1 h-3 w-3" />
                          ) : p.response_rate < 50 ? (
                            <TrendingDown className="mr-1 h-3 w-3" />
                          ) : null}
                          {p.response_rate}%
                        </Badge>
                      ) : (
                        <span className="text-fg-muted text-xs">—</span>
                      )}
                    </td>
                    <td className="p-4 text-right font-mono">
                      <span
                        className={cn(
                          "inline-flex rounded border px-2 py-0.5 text-xs font-bold",
                          p.trust_score >= 90
                            ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                            : p.trust_score >= 70
                              ? "border-blue-500/20 bg-blue-500/10 text-blue-400"
                              : p.trust_score >= 50
                                ? "border-amber-500/20 bg-amber-500/10 text-amber-400"
                                : "border-red-500/20 bg-red-500/10 text-red-400",
                        )}
                      >
                        {p.trust_score}/100
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </Container>
  );
}
