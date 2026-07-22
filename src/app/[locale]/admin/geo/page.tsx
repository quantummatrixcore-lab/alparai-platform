import { setRequestLocale, getTranslations } from "next-intl/server";
import { requireAdmin } from "@/lib/auth/session";
import { GeoDashboardClient } from "@/components/admin/geo-dashboard-client";
import { getGeoStatsAction, type GeoCitationRow } from "@/actions/geo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admin" });
  return { title: `${t("nav_geo")} | ALPAR AI Admin` };
}

export default async function GEOPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  await requireAdmin();

  const stats = await getGeoStatsAction();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">GEO (Generative Engine Optimization)</h1>
        <p className="text-sm text-fg-muted">
          Monitor and optimize ALPAR AI authority, citations, and crawler traffic across LLM engines.
        </p>
      </div>

      <GeoDashboardClient
        initialScore={stats.score}
        initialCitations={stats.citations as GeoCitationRow[]}
        botHits={stats.botHits}
      />
    </div>
  );
}
