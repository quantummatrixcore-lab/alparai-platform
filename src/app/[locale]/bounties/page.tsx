import { setRequestLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createServerClient } from "@/lib/supabase/server";
import { Trophy, Award, Sparkles, Clock, DollarSign } from "lucide-react";
import { Link } from "@/i18n/routing";
import { formatDate } from "@/lib/utils";

interface BountyListItem {
  id: string;
  severity_score: number;
  estimated_reward_cents: number | null;
  status: string;
  created_at: string;
  notes: string | null;
  incident_id: string;
  reporter_id: string;
  provider_id: string | null;
  incidents: {
    title_masked: string;
    title_tr: string | null;
    category: string;
    severity: string;
  } | null;
  ai_providers: {
    name: string;
    slug: string;
    logo_url: string | null;
  } | null;
  reporter: {
    full_name: string | null;
    email: string;
  } | null;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "bounties" });
  return { title: t("title"), description: t("description") };
}

export default async function BountiesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "bounties" });
  const supabase = await createServerClient();

  const { data } = await supabase
    .from("bug_bounties" as never)
    .select(
      "id, severity_score, estimated_reward_cents, status, created_at, notes, incident_id, reporter_id, provider_id, incidents(title_masked, title_tr, category, severity), ai_providers(name, slug, logo_url), reporter:user_profiles!bug_bounties_reporter_id_fkey(full_name, email)" as never
    )
    .in("status", ["validated", "paid", "open"] as never)
    .order("created_at", { ascending: false })
    .limit(50);

  const items: BountyListItem[] = (data as unknown as BountyListItem[]) ?? [];

  const total = items.length;
  const paid = items.filter((b) => b.status === "paid").length;
  const validated = items.filter((b) => b.status === "validated").length;
  const totalReward = items
    .filter((b) => b.status === "paid")
    .reduce((sum, b) => sum + (b.estimated_reward_cents ?? 0), 0);

  return (
    <Container className="py-12">
      <header className="mb-10 max-w-3xl">
        <div className="border-warning-500/40 bg-warning-500/10 text-warning-400 mb-4 inline-flex items-center gap-2 rounded-sm border px-4 py-1.5 text-xs font-bold tracking-[0.2em] uppercase">
          <Sparkles className="h-4 w-4" />
          {t("eyebrow")}
        </div>
        <h1 className="from-warning-300 via-warning-500 to-warning-300 mb-3 bg-gradient-to-r bg-clip-text text-4xl font-black tracking-tight text-transparent md:text-5xl">
          {t("title")}
        </h1>
        <p className="text-fg-muted text-lg">{t("description")}</p>
      </header>

      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatBlock label={t("stats_total")} value={total} icon={<Trophy />} color="warning" />
        <StatBlock label={t("stats_validated")} value={validated} icon={<Award />} color="brand" />
        <StatBlock label={t("stats_paid")} value={paid} icon={<DollarSign />} color="success" />
        <StatBlock
          label={t("stats_reward")}
          value={`$${(totalReward / 100).toFixed(0)}`}
          icon={<Sparkles />}
          color="warning"
        />
      </div>

      <Card>
        <CardContent className="p-0">
          {items.length === 0 ? (
            <div className="text-fg-muted p-12 text-center">
              <Trophy className="text-warning-500 mx-auto mb-3 h-10 w-10" />
              <p className="text-sm">{t("empty")}</p>
            </div>
          ) : (
            <div className="divide-border-subtle divide-y">
              {items.map((b) => (
                <BountyRow
                  key={b.id}
                  bounty={b}
                  locale={locale}
                  tLabel={{
                    severity: t("severity"),
                    reward: t("reward"),
                    date: t("date"),
                  }}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}

function StatBlock({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  color: "warning" | "brand" | "success";
}) {
  const colorMap = {
    warning: "text-warning-500 bg-warning-500/10",
    brand: "text-brand-400 bg-brand-500/10",
    success: "text-success-500 bg-success-500/10",
  };
  return (
    <div className="border-border-subtle bg-bg-secondary/40 flex items-center gap-3 rounded-lg border p-4 backdrop-blur">
      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${colorMap[color]}`}>
        <div className="h-5 w-5">{icon}</div>
      </div>
      <div>
        <p className="text-fg-primary text-2xl font-bold">{value}</p>
        <p className="text-fg-muted text-xs">{label}</p>
      </div>
    </div>
  );
}

function BountyRow({
  bounty,
  locale,
  tLabel,
}: {
  bounty: BountyListItem;
  locale: string;
  tLabel: { severity: string; reward: string; date: string };
}) {
  const status = bounty.status;
  const statusVariant =
    status === "paid" ? "success" : status === "validated" ? "brand" : "warning";
  const rewardCents = bounty.estimated_reward_cents ?? 0;
  const rewardUsd = (rewardCents / 100).toFixed(0);
  const incidentTitle =
    locale === "tr" && bounty.incidents?.title_tr && bounty.incidents.title_tr.length > 0
      ? bounty.incidents.title_tr
      : (bounty.incidents?.title_masked ?? "—");

  return (
    <Link
      href={`/incidents/${bounty.incident_id}`}
      className="hover:bg-bg-tertiary/30 block transition-colors"
    >
      <div className="grid grid-cols-1 items-center gap-4 p-5 sm:grid-cols-[60px_1fr_120px_120px_100px]">
        <div className="flex items-center justify-center">
          {bounty.ai_providers?.logo_url ? (
            <img
              src={bounty.ai_providers.logo_url}
              alt={bounty.ai_providers.name}
              className="h-9 w-auto object-contain"
            />
          ) : (
            <div className="bg-bg-tertiary text-fg-muted flex h-9 w-9 items-center justify-center rounded-md text-xs font-bold">
              ?
            </div>
          )}
        </div>
        <div className="min-w-0">
          <p className="text-fg-primary line-clamp-1 text-sm font-semibold">{incidentTitle}</p>
          <p className="text-fg-muted text-xs">
            {bounty.ai_providers?.name ?? "Unknown"} ·{" "}
            {bounty.reporter?.full_name ?? bounty.reporter?.email ?? "anon"}
          </p>
        </div>
        <div className="flex flex-col">
          <span className="text-fg-muted text-[10px] tracking-wider uppercase">
            {tLabel.severity}
          </span>
          <Badge variant={statusVariant} size="sm" className="mt-1 w-fit">
            {bounty.severity_score}/100
          </Badge>
        </div>
        <div className="flex flex-col">
          <span className="text-fg-muted text-[10px] tracking-wider uppercase">
            {tLabel.reward}
          </span>
          <span className="text-warning-400 mt-1 text-sm font-bold">${rewardUsd}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-fg-muted text-[10px] tracking-wider uppercase">{tLabel.date}</span>
          <span className="text-fg-muted mt-1 flex items-center gap-1 text-xs">
            <Clock className="h-3 w-3" />
            {formatDate(new Date(bounty.created_at), locale)}
          </span>
        </div>
      </div>
    </Link>
  );
}
