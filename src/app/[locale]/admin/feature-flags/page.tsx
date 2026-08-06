import { setRequestLocale, getTranslations } from "next-intl/server";
import { requireModerator } from "@/lib/auth/session";
import { getFeatureFlagsAction } from "@/actions/system-mgmt";
import { FeatureFlagsClient } from "@/components/admin/feature-flags-client";
import { AdminContainer, AdminPageHeader } from "@/components/admin/admin-design-kit";
import { Flag } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admin" });
  return { title: `${t("nav_featureFlags") || "Feature Flags"} | ALPAR AI Admin` };
}

export default async function FeatureFlagsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  await requireModerator();
  const t = await getTranslations({ locale, namespace: "admin" });

  const flags = await getFeatureFlagsAction();

  return (
    <div className="min-h-screen bg-black p-6"><div className="bg-zinc-900/40 backdrop-blur-xl ring-1 ring-white/10 rounded-3xl shadow-2xl p-8">
      <div className="space-y-8 rounded-3xl bg-zinc-900/40 p-6 shadow-2xl ring-1 ring-white/10 backdrop-blur-xl md:p-8">
      <AdminContainer>
        <AdminPageHeader
          icon={<Flag className="text-brand-400 h-6 w-6" />}
          title={t("nav_featureFlags") || "Live Feature Flags Management"}
          subtitle={
            t("sistem_zelliklerini_pii_guardian_sybil_s") ||
            "Manage system features, PII guardian rules, and edge caches in real-time."
          }
          breadcrumb={[
            { label: "Admin", href: "/admin" },
            { label: "Feature Flags", href: "/admin/feature-flags" },
          ]}
        />

        <FeatureFlagsClient initialFlags={flags} />
      </AdminContainer>
    </div>
      </div></div>
  );
}
