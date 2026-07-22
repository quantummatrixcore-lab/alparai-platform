import { setRequestLocale, getTranslations } from "next-intl/server";
import { requireAdmin } from "@/lib/auth/session";
import { ToggleRight } from "lucide-react";

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

  return (
    <div className="flex flex-col items-center justify-center py-24">
      <ToggleRight className="text-fg-muted mb-6 h-16 w-16" strokeWidth={1.5} />
      <h1 className="text-fg-primary mb-2 text-2xl font-bold">{t("nav_featureFlags")}</h1>
      <p className="text-fg-muted text-sm">Coming soon</p>
    </div>
  );
}
