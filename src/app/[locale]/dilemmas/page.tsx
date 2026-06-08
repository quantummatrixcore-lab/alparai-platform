import { setRequestLocale, getTranslations } from "next-intl/server";
import { createServerClient } from "@/lib/supabase/server";
import { Container } from "@/components/ui/layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  return { title: t("report") + " - AI Dilemmas" };
}

export default async function DilemmasPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const supabase = await createServerClient();

  type Poll = {
    id: string;
    title: string;
    description: string;
    yes_count: number;
    no_count: number;
    unsure_count: number;
  };

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
        {polls.map((poll) => {
          const totalVotes = poll.yes_count + poll.no_count + poll.unsure_count;
          const yesPercent = totalVotes > 0 ? Math.round((poll.yes_count / totalVotes) * 100) : 0;
          const noPercent = totalVotes > 0 ? Math.round((poll.no_count / totalVotes) * 100) : 0;

          return (
            <Card
              key={poll.id}
              variant="elevated"
              className="border-brand-500/20 hover:border-brand-500/40 flex flex-col transition-colors"
            >
              <CardContent className="flex flex-1 flex-col p-6">
                <div className="flex-1">
                  <h3 className="mb-3 text-xl font-bold">{poll.title}</h3>
                  <p className="text-fg-secondary mb-6 text-sm">{poll.description}</p>
                </div>

                <div className="space-y-4">
                  {/* Results bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-success-400">Yes {yesPercent}%</span>
                      <span className="text-danger-400">No {noPercent}%</span>
                    </div>
                    <div className="bg-bg-tertiary flex h-2 w-full overflow-hidden rounded-full">
                      <div className="bg-success-500 h-full" style={{ width: `${yesPercent}%` }} />
                      <div className="bg-danger-500 h-full" style={{ width: `${noPercent}%` }} />
                    </div>
                    <div className="text-fg-muted text-right text-xs">{totalVotes} votes</div>
                  </div>

                  {/* Action buttons (Client Component should ideally handle this for interactivity) */}
                  <div className="grid grid-cols-3 gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-success-400 border-success-400/30 hover:bg-success-400/10 w-full"
                    >
                      Yes
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-danger-400 border-danger-400/30 hover:bg-danger-400/10 w-full"
                    >
                      No
                    </Button>
                    <Button variant="ghost" size="sm" className="text-fg-muted w-full">
                      Unsure
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </Container>
  );
}
