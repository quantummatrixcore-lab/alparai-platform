import { setRequestLocale, getTranslations } from "next-intl/server";
import { createServerClient } from "@/lib/supabase/server";
import { Container } from "@/components/ui/layout";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import { cn, formatNumber } from "@/lib/utils";

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
    .select("id, slug, name, logo_url, is_verified")
    .order("name");

  const counts = await Promise.all(
    (
      (providers as Array<{
        id: string;
        slug: string;
        name: string;
        logo_url: string | null;
        is_verified: boolean;
      }>) ?? []
    ).map(async (p) => {
      const { count } = await supabase
        .from("incidents")
        .select("*", { count: "exact", head: true })
        .eq("ai_provider_id", p.id);
      const { count: resolved } = await supabase
        .from("incidents")
        .select("*", { count: "exact", head: true })
        .eq("ai_provider_id", p.id)
        .eq("status", "rejected");
      return { ...p, incident_count: count ?? 0, resolved_count: resolved ?? 0 };
    })
  );

  const sorted = counts.sort((a, b) => a.incident_count - b.incident_count);

  return (
    <Container className="py-10">
      <header className="mb-8">
        <h1 className="text-fg-primary inline-flex items-center gap-2 text-3xl font-bold tracking-tight">
          <Trophy className="text-warning-500 h-7 w-7" />
          {t("title")}
        </h1>
        <p className="text-fg-muted mt-2 text-sm">{t("subtitle")}</p>
      </header>
      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-border-subtle text-fg-muted border-b text-left text-xs font-semibold tracking-wider uppercase">
                <th className="w-12 p-4">{t("rank")}</th>
                <th className="p-4">{t("provider")}</th>
                <th className="p-4 text-right">{t("incidents")}</th>
                <th className="p-4 text-right">{t("resolved")}</th>
                <th className="p-4 text-right">Trend</th>
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
                  <td className="text-fg-primary p-4 font-medium">{p.name}</td>
                  <td className="text-fg-secondary p-4 text-right">
                    {formatNumber(p.incident_count)}
                  </td>
                  <td className="text-fg-secondary p-4 text-right">
                    {formatNumber(p.resolved_count)}
                  </td>
                  <td className="text-fg-muted p-4 text-right">—</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </Container>
  );
}
