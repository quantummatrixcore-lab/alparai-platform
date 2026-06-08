import { setRequestLocale, getTranslations } from "next-intl/server";
import { createServerClient } from "@/lib/supabase/server";
import { Container } from "@/components/ui/layout";
import { Card, CardContent } from "@/components/ui/card";
import { SuggestionCard } from "@/components/marketing/suggestion-card";
import { Lightbulb, Zap } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/session";
import type { SuggestionListItem } from "@/types";

const seedSuggestions: SuggestionListItem[] = [
  {
    id: "seed-1",
    title: "AI provider response time tracking",
    description:
      "Track how quickly AI providers respond to incidents. Show average response time on brand pages and leaderboard.",
    category: "feature",
    status: "open",
    upvote_count: 42,
    comment_count: 8,
    created_at: "2026-06-01T00:00:00Z",
    author_name: "ALPAR Team",
  },
  {
    id: "seed-2",
    title: "Severity badge standardization",
    description:
      "Define clear criteria for each severity level (low, medium, high, critical). Help reporters choose the right level.",
    category: "improvement",
    status: "open",
    upvote_count: 38,
    comment_count: 5,
    created_at: "2026-06-01T00:00:00Z",
    author_name: "ALPAR Team",
  },
  {
    id: "seed-3",
    title: "Incident comparison tool",
    description:
      "Compare how different AI providers handle similar incidents. Side-by-side view of response quality and resolution time.",
    category: "feature",
    status: "open",
    upvote_count: 35,
    comment_count: 12,
    created_at: "2026-06-01T00:00:00Z",
    author_name: "ALPAR Team",
  },
  {
    id: "seed-4",
    title: "Weekly digest email",
    description:
      "Subscribe to a weekly digest of new incidents, provider responses, and platform updates. Stay informed without checking daily.",
    category: "feature",
    status: "open",
    upvote_count: 29,
    comment_count: 3,
    created_at: "2026-06-01T00:00:00Z",
    author_name: "ALPAR Team",
  },
  {
    id: "seed-5",
    title: "Incident severity voting",
    description:
      "Let the community vote on severity levels. If enough users agree an incident is more severe, it gets escalated.",
    category: "improvement",
    status: "open",
    upvote_count: 24,
    comment_count: 7,
    created_at: "2026-06-01T00:00:00Z",
    author_name: "ALPAR Team",
  },
];

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "suggestions" });
  return { title: t("title") };
}

export default async function SuggestionsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "suggestions" });
  const user = await getCurrentUser();
  const supabase = await createServerClient();
  const { data } = await supabase
    .from("suggestions")
    .select(
      "id, title, description, category, status, upvotes_count, comments_count, created_at, user_id"
    )
    .order("upvotes_count", { ascending: false })
    .limit(50);

  const items: SuggestionListItem[] = ((data as Array<Record<string, unknown>>) ?? []).map((r) => ({
    id: r["id"] as string,
    title: r["title"] as string,
    description: r["description"] as string,
    category: r["category"] as string,
    status: r["status"] as string,
    upvote_count: (r["upvotes_count"] as number) ?? 0,
    comment_count: (r["comments_count"] as number) ?? 0,
    created_at: r["created_at"] as string,
    author_name: null,
  }));

  const displayItems = items.length > 0 ? items : seedSuggestions;
  const isSeed = items.length === 0;

  return (
    <Container className="py-10">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-fg-primary inline-flex items-center gap-2 text-3xl font-bold tracking-tight">
            <Lightbulb className="text-brand-400 h-7 w-7" />
            {t("title")}
          </h1>
          <p className="text-fg-muted mt-2 text-sm">{t("subtitle")}</p>
        </div>
        {user && (
          <Link href={`/${locale}/suggestions/new` as never}>
            <Button leftIcon={<Plus className="h-4 w-4" />}>{t("create_title")}</Button>
          </Link>
        )}
      </header>

      {isSeed && (
        <Card variant="default" className="border-brand-500/30 bg-brand-500/5 mb-6">
          <CardContent className="flex items-start gap-3 py-4">
            <Zap className="text-brand-400 mt-0.5 h-4 w-4 shrink-0" />
            <div>
              <p className="text-fg-primary text-sm font-medium">{t("subtitle")}</p>
              <p className="text-fg-muted text-xs">{t("create_description")}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {displayItems.map((it) => (
          <SuggestionCard key={it.id} item={it} />
        ))}
      </div>
    </Container>
  );
}
