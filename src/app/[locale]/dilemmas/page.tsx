import { setRequestLocale, getTranslations } from "next-intl/server";
import { createServerClient } from "@/lib/supabase/server";
import { Container } from "@/components/ui/layout";
import { CommunityHub } from "@/components/dilemmas/community-hub";
import { getCurrentUser } from "@/lib/auth/session";
import type { Poll } from "@/components/dilemmas/poll-card";
import type { SuggestionListItem } from "@/types";

const seedSuggestions: Array<
  SuggestionListItem & { title_tr: string; description_tr: string; author_name_tr: string }
> = [
  {
    id: "seed-1",
    title: "AI provider response time tracking",
    title_tr: "AI sağlayıcı yanıt süresi takibi",
    description:
      "Track how quickly AI providers respond to incidents. Show average response time on brand pages and leaderboard.",
    description_tr:
      "AI sağlayıcılarının olaylara ne kadar hızlı yanıt verdiğini takip edin. Marka sayfalarında ve skor tablosunda ortalama yanıt süresini gösterin.",
    category: "feature",
    status: "open",
    upvote_count: 42,
    comment_count: 8,
    created_at: "2026-06-01T00:00:00Z",
    author_name: "ALPAR Team",
    author_name_tr: "ALPAR Ekibi",
  },
  {
    id: "seed-2",
    title: "Severity badge standardization",
    title_tr: "Ciddiyet rozeti standardizasyonu",
    description:
      "Define clear criteria for each severity level (low, medium, high, critical). Help reporters choose the right level.",
    description_tr:
      "Her ciddiyet seviyesi için net kriterler tanımlayın (düşük, orta, yüksek, kritik). Raporcuların doğru seviyeyi seçmesine yardımcı olun.",
    category: "improvement",
    status: "open",
    upvote_count: 38,
    comment_count: 5,
    created_at: "2026-06-01T00:00:00Z",
    author_name: "ALPAR Team",
    author_name_tr: "ALPAR Ekibi",
  },
  {
    id: "seed-3",
    title: "Incident comparison tool",
    title_tr: "Olay karşılaştırma aracı",
    description:
      "Compare how different AI providers handle similar incidents. Side-by-side view of response quality and resolution time.",
    description_tr:
      "Farklı AI sağlayıcılarının benzer olaylara nasıl yanıt verdiğini karşılaştırın. Yanıt kalitesi ve çözüm süresinin yan yana görünümü.",
    category: "feature",
    status: "open",
    upvote_count: 35,
    comment_count: 12,
    created_at: "2026-06-01T00:00:00Z",
    author_name: "ALPAR Team",
    author_name_tr: "ALPAR Ekibi",
  },
  {
    id: "seed-4",
    title: "Weekly digest email",
    title_tr: "Haftalık özet e-postası",
    description:
      "Subscribe to a weekly digest of new incidents, provider responses, and platform updates. Stay informed without checking daily.",
    description_tr:
      "Yeni olaylar, sağlayıcı yanıtları ve platform güncellemelerinin haftalık özetine abone olun. Her gün kontrol etmeden haberdar olun.",
    category: "feature",
    status: "open",
    upvote_count: 29,
    comment_count: 3,
    created_at: "2026-06-01T00:00:00Z",
    author_name: "ALPAR Team",
    author_name_tr: "ALPAR Ekibi",
  },
  {
    id: "seed-5",
    title: "Incident severity voting",
    title_tr: "Olay ciddiyet oylaması",
    description:
      "Let the community vote on severity levels. If enough users agree an incident is more severe, it gets escalated.",
    description_tr:
      "Topluluğun ciddiyet seviyelerini oylamasına izin verin. Yeterli kullanıcı bir olayın daha ciddi olduğunu kabul ederse, yükseltilir.",
    category: "improvement",
    status: "open",
    upvote_count: 24,
    comment_count: 7,
    created_at: "2026-06-01T00:00:00Z",
    author_name: "ALPAR Team",
    author_name_tr: "ALPAR Ekibi",
  },
];

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "dilemmas" });
  return { title: t("pageTitle") };
}

export default async function DilemmasPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const supabase = await createServerClient();
  const user = await getCurrentUser();

  // Fetch active polls and suggestions in parallel
  const [pollsResult, suggestionsResult] = await Promise.all([
    supabase
      .from("ai_polls")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .returns<Poll[]>(),
    supabase
      .from("suggestions")
      .select(
        "id, title, description, title_tr, description_tr, category, status, upvotes_count, comments_count, created_at, user_id",
      )
      .order("upvotes_count", { ascending: false })
      .limit(50),
  ]);

  const polls = pollsResult.data ?? [];
  const suggestionsData = suggestionsResult.data ?? [];

  const suggestions: SuggestionListItem[] = (
    (suggestionsData as unknown as Array<Record<string, unknown>>) ?? []
  ).map((r) => ({
    id: r["id"] as string,
    title: r["title"] as string,
    description: r["description"] as string,
    title_tr: (r["title_tr"] as string | null) ?? null,
    description_tr: (r["description_tr"] as string | null) ?? null,
    category: r["category"] as string,
    status: r["status"] as string,
    upvote_count: (r["upvotes_count"] as number) ?? 0,
    comment_count: (r["comments_count"] as number) ?? 0,
    created_at: r["created_at"] as string,
    author_name: null,
  }));

  return (
    <Container className="py-12">
      <header className="mx-auto mb-8 max-w-3xl space-y-4 text-center">
        <h1 className="bg-gradient-brand bg-clip-text pb-2 text-4xl font-extrabold tracking-tight text-transparent md:text-5xl">
          {locale === "tr" ? "Topluluk Görüşleri & Kararları" : "Community Decisions & Ideas"}
        </h1>
        <p className="text-fg-muted text-lg">
          {locale === "tr"
            ? "Yapay zeka ikilemlerini oylayın ve platform özellik önerilerimizi yönlendirin."
            : "Vote on AI dilemmas and shape our platform features with your suggestions."}
        </p>
      </header>

      <CommunityHub
        polls={polls}
        suggestions={suggestions}
        seedSuggestions={seedSuggestions}
        isLoggedIn={!!user}
        locale={locale}
      />
    </Container>
  );
}
