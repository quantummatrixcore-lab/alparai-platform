import { setRequestLocale, getTranslations } from "next-intl/server";
import { createServerClient } from "@/lib/supabase/server";
import { Container } from "@/components/ui/layout";
import { PollCard, type Poll } from "@/components/dilemmas/poll-card";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  return { title: t("report") + " - AI Dilemmas" };
}

export default async function DilemmasPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const supabase = await createServerClient();

  // Fetch active polls
  const { data: pollsData } = await supabase
    .from("ai_polls")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .returns<Poll[]>();

  const polls = pollsData ?? [];

  return (
    <Container className="py-12">
      <header className="mx-auto mb-12 max-w-3xl space-y-4 text-center">
        <h1 className="bg-gradient-brand bg-clip-text pb-2 text-4xl font-extrabold tracking-tight text-transparent md:text-5xl">
          AI Dilemmas
        </h1>
        <p className="text-fg-muted text-lg">
          As AI becomes more integrated into our lives, we face unprecedented moral and ethical
          challenges. Vote on these critical dilemmas to help shape the public consensus.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {polls.map((poll) => (
          <PollCard key={poll.id} poll={poll} />
        ))}
      </div>
    </Container>
  );
}
