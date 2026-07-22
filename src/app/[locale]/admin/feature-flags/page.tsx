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

  const flags = await getFeatureFlagsAction();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Feature Flags</h1>
        <p className="text-sm text-fg-muted">
          Toggle system features at runtime with ~0ms Upstash Redis edge cache propagation.
        </p>
      </div>

      <FeatureFlagsClient initialFlags={flags} />
    </div>
  );
}
