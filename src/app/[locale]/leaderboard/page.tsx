import { setRequestLocale, getTranslations } from "next-intl/server";
import { createServerClient } from "@/lib/supabase/server";
import { Container } from "@/components/ui/layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, MessageSquare, TrendingUp, TrendingDown } from "lucide-react";
import { cn, formatNumber } from "@/lib/utils";
import { Link } from "@/i18n/routing";
import { ProviderLogo } from "@/components/leaderboard/provider-logo";
import Image from "next/image";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "leaderboard" });
  return { title: t("title") };
}

export default async function LeaderboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const supabase = await createServerClient();
  const t = await getTranslations({ locale, namespace: "leaderboard" });

  const { data: providers } = await supabase
    .from("ai_providers")
    .select("id, slug, name, logo_url, is_verified, website_url")
    .order("name");

  const stats = await Promise.all(
    (
      (providers as Array<{
        id: string;
        slug: string;
        name: string;
        logo_url: string | null;
        is_verified: boolean;
        website_url: string | null;
      }>) ?? []
    ).map(async (p) => {
      const [{ count: incidentCount }, { count: responseCount }] = await Promise.all([
        supabase
          .from("incidents")
          .select("*", { count: "exact", head: true })
          .eq("ai_provider_id", p.id)
          .eq("status", "published"),
        supabase
          .from("ai_provider_responses")
          .select("*", { count: "exact", head: true })
          .eq("ai_provider_id", p.id)
          .eq("is_published", true),
      ]);

      const total = incidentCount ?? 0;
      const responded = responseCount ?? 0;
      const responseRate = total > 0 ? Math.round((responded / total) * 100) : 0;

      return {
        ...p,
        incident_count: total,
        response_count: responded,
        response_rate: responseRate,
      };
    })
  );

  const sorted = stats.sort((a, b) => {
    if (a.incident_count === 0 && b.incident_count === 0) return 0;
    if (a.incident_count === 0) return 1;
    if (b.incident_count === 0) return -1;
    return b.response_rate - a.response_rate;
  });

  return (
    <Container className="py-10">
      <header className="mb-8">
        <h1 className="text-fg-primary inline-flex items-center gap-2 text-3xl font-bold tracking-tight">
          <Trophy className="text-warning-500 h-7 w-7" />
          {t("title")}
        </h1>
        <p className="text-fg-muted mt-2 text-sm">{t("subtitle")}</p>
      </header>

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
                        stats.filter((p) => p.incident_count > 0).length
                    )
                  : 0}
                %
              </p>
              <p className="text-fg-muted text-xs">{t("avgResponseRate")}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
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
                              : "bg-bg-tertiary text-fg-muted"
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
                        <div className="border-border-subtle bg-bg-primary relative h-10 w-24 shrink-0 overflow-hidden rounded-md border shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_15px_rgba(231,76,60,0.3)]">
                          <Image
                            src={p.logo_url}
                            alt={`${p.name} logo`}
                            fill
                            className="object-contain p-1"
                            sizes="96px"
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
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </Container>
  );
}
