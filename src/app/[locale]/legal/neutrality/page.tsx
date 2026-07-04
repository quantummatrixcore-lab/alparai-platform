import { setRequestLocale, getTranslations } from "next-intl/server";
import { LegalLayout } from "@/components/legal/legal-layout";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal" });
  return {
    title: t("neutralityTitle"),
    description: t("neutralityDesc"),
  };
}

export default async function NeutralityCharterPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "legal" });

  return (
    <LegalLayout title={t("neutralityTitle")} lastUpdated="2026-07-04">
      <p className="text-fg-secondary mb-8 text-lg leading-relaxed font-medium">
        {t("neutralitySubtitle")}
      </p>

      <h2>{t("nIntroduction")}</h2>
      <p>{t("nIntroductionText")}</p>

      <h2>{t("nIntermediary")}</h2>
      <p>{t("nIntermediaryText")}</p>

      <h2>{t("nRightOfReply")}</h2>
      <p>{t("nRightOfReplyText")}</p>

      <h2>{t("nModeration")}</h2>
      <p>{t("nModerationText")}</p>

      <h2>{t("nArbitration")}</h2>
      <p>{t("nArbitrationText")}</p>
    </LegalLayout>
  );
}
