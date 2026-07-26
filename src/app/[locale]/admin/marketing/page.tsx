import { setRequestLocale, getTranslations } from "next-intl/server";
import { requireAdmin } from "@/lib/auth/session";
import { TrendingUp, Globe, Users } from "lucide-react";
import { MetricCard } from "@/components/admin/metric-card";

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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">{t("nav_marketing")}</h1>
        <p className="text-fg-muted mt-1 text-sm">Growth & distribution signals — coming soon</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard
          title="Funnel Conversion"
          value="—"
          icon={<TrendingUp className="h-4 w-4" />}
          trend="neutral"
          trendLabel="Instrumentation pending"
          accentColor="#6366f1"
          sparkData={[
            { value: 10 },
            { value: 15 },
            { value: 12 },
            { value: 18 },
            { value: 20 },
            { value: 25 },
          ]}
          chartType="line"
        />
        <MetricCard
          title="Organic Reach"
          value="—"
          icon={<Globe className="h-4 w-4" />}
          trend="neutral"
          trendLabel="Not yet tracked"
          accentColor="#f59e0b"
        />
        <MetricCard
          title="Activated Users"
          value="—"
          icon={<Users className="h-4 w-4" />}
          trend="neutral"
          trendLabel="Coming soon"
          accentColor="#10b981"
        />
      </div>

      <div className="flex flex-col items-center justify-center rounded-xl border border-white/10 bg-zinc-900/50 py-20">
        <TrendingUp className="text-fg-muted mb-4 h-12 w-12" strokeWidth={1.5} />
        <p className="text-fg-muted text-sm">Full marketing dashboard coming soon</p>
      </div>
    </div>
  );
}
