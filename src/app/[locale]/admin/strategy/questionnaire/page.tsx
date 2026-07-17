import { setRequestLocale, getTranslations } from "next-intl/server";
import { requireAdmin } from "@/lib/auth/session";
import { StrategyQuestionnaireClient } from "@/components/admin/strategy-questionnaire-client";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admin" });
  return {
    title: `${t("strategy_questionnaire_title") || "Strategic Questionnaire"} | ALPAR AI`,
  };
}

export default async function StrategicQuestionnairePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  await requireAdmin();

  return <StrategyQuestionnaireClient locale={locale} />;
}
