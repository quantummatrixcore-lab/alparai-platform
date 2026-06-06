import { setRequestLocale, getTranslations } from "next-intl/server";
import { LegalLayout } from "@/components/legal/legal-layout";
import { TakedownForm } from "@/components/legal/takedown-form";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal" });
  return { title: t("takedownTitle") };
}

export default async function TakedownPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "legal" });
  return (
    <LegalLayout
      title={t("takedownTitle")}
      lastUpdated="2026-06-01"
    >
      <p>
        {t("takedownIntro", { days: 7 })}
      </p>
      <p>
        {t("takedownGdpr")}
      </p>
      <h2>{t("takedownHowTitle")}</h2>
      <ol>
        <li>{t("takedownHow1")}</li>
        <li>{t("takedownHow2")}</li>
        <li>{t("takedownHow3")}</li>
      </ol>
      <div className="not-prose mt-8">
        <TakedownForm />
      </div>
      <h2>{t("takedownNextTitle")}</h2>
      <ul>
        <li>{t("takedownNext1")}</li>
        <li>{t("takedownNext2")}</li>
        <li>{t("takedownNext3")}</li>
        <li>{t("takedownNext4")}</li>
      </ul>
      <h2>{t("takedownAbuseTitle")}</h2>
      <p>
        {t("takedownAbuse")}
      </p>
      <h2>{t("takedownDirectTitle")}</h2>
      <p>
        {t("takedownDirect")}{" "}
        <a href="mailto:takedown@alparai.online">takedown@alparai.online</a>
      </p>
    </LegalLayout>
  );
}
