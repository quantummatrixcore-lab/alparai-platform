import { setRequestLocale, getTranslations } from "next-intl/server";
import { requireAdmin } from "@/lib/auth/session";
import { getFeatureFlagsAction } from "@/actions/system-mgmt";
import { FeatureFlagsClient } from "@/components/admin/feature-flags-client";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admin" });
  return { title: `${t("nav_featureFlags")} | ALPAR AI Admin` };
}

export default async function FeatureFlagsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  await requireAdmin();
  const t = await getTranslations({ locale, namespace: "admin" });

  const flags = await getFeatureFlagsAction();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          {t("nav_featureFlags")} — Canlı Özellik Bayrakları Yönetimi
        </h1>
        <p className="text-fg-muted mt-1 text-sm">
          Sistem özelliklerini (PII Guardian, Sybil Shield, Cross-Audit, GEO Verifier) Upstash Redis
          ~0ms edge önbellek dağıtımı ile anlık açıp kapatın.
        </p>
      </div>

      <FeatureFlagsClient initialFlags={flags} />
    </div>
  );
}
