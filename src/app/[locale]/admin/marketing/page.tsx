import { setRequestLocale, getTranslations } from "next-intl/server";
import { requireAdmin } from "@/lib/auth/session";
import { TrendingUp, Globe, Users } from "lucide-react";
import { MetricCard } from "@/components/admin/metric-card";
import { createAdminClient } from "@/lib/supabase/admin";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admin" });
  return { title: `${t("nav_marketing")} | ALPAR AI Admin` };
}

export default async function MarketingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  await requireAdmin();
  const t = await getTranslations({ locale, namespace: "admin" });

  const supabase = createAdminClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { count: incidentsCount } = await (supabase as any)
    .from("incidents")
    .select("*", { count: "exact", head: true });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { count: outreachCount } = await (supabase as any)
    .from("outreach_queue")
    .select("*", { count: "exact", head: true });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { count: profilesCount } = await (supabase as any)
    .from("profiles")
    .select("*", { count: "exact", head: true });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">{t("nav_marketing")}</h1>
        <p className="text-fg-muted mt-1 text-sm">{t("marketing_subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard
          title={t("marketing_funnel")}
          value={(incidentsCount ?? 0).toLocaleString()}
          icon={<TrendingUp className="h-4 w-4" />}
          trend="up"
          trendLabel="Total Incidents Cataloged"
          accentColor="#6366f1"
          sparkData={[
            { value: 10 },
            { value: 15 },
            { value: 12 },
            { value: 18 },
            { value: 20 },
            { value: incidentsCount ?? 0 },
          ]}
          chartType="line"
        />
        <MetricCard
          title={t("marketing_organic")}
          value={(outreachCount ?? 0).toLocaleString()}
          icon={<Globe className="h-4 w-4" />}
          trend="neutral"
          trendLabel="Outreach Campaigns Queued"
          accentColor="#f59e0b"
        />
        <MetricCard
          title={t("marketing_activated")}
          value={(profilesCount ?? 0).toLocaleString()}
          icon={<Users className="h-4 w-4" />}
          trend="up"
          trendLabel="Registered Accounts"
          accentColor="#10b981"
        />
      </div>

      <div className="flex flex-col items-center justify-center rounded-xl border border-white/10 bg-zinc-900/50 px-4 py-16 text-center">
        <TrendingUp className="text-brand-400 mb-3 h-10 w-10" strokeWidth={1.5} />
        <h3 className="text-base font-semibold text-white">Real-Time Marketing Analytics Active</h3>
        <p className="text-fg-muted mt-1 max-w-md text-xs">
          Cataloged incident reports, outreach queue dispatches, and user registration conversion
          are live-tracked.
        </p>
      </div>
    </div>
  );
}
