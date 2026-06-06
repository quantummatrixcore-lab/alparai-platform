import { setRequestLocale, getTranslations } from "next-intl/server";
import { createServerClient } from "@/lib/supabase/server";
import { Container } from "@/components/ui/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SuggestionCard } from "@/components/marketing/suggestion-card";
import { Lightbulb } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/session";
import type { SuggestionListItem } from "@/types";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "suggestions" });
  return { title: t("title") };
}

export default async function SuggestionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "suggestions" });
  const user = await getCurrentUser();
  const supabase = await createServerClient();
  const { data } = await supabase
    .from("suggestions")
    .select("id, title, description, category, status, upvotes_count, comments_count, created_at, user_id")
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

  return (
    <Container className="py-10">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="inline-flex items-center gap-2 text-3xl font-bold tracking-tight text-fg-primary">
            <Lightbulb className="h-7 w-7 text-brand-400" />
            {t("title")}
          </h1>
          <p className="mt-2 text-sm text-fg-muted">{t("subtitle")}</p>
        </div>
        {user && (
          <Link href={`/${locale}/suggestions/new` as never}>
            <Button leftIcon={<Plus className="h-4 w-4" />}>
              {t("create_title")}
            </Button>
          </Link>
        )}
      </header>
      <div className="space-y-3">
        {items.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-sm text-fg-muted">
              No suggestions yet. Be the first to share an idea.
            </CardContent>
          </Card>
        ) : (
          items.map((it) => <SuggestionCard key={it.id} item={it} />)
        )}
      </div>
    </Container>
  );
}
