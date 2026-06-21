import { setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/layout";
import { InvestPresentation } from "@/components/invest/invest-presentation";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
    title: locale === "tr" ? "Yatırımcı Sunumu — ALPAR AI" : "Investor Pitch Deck — ALPAR AI",
    description: "ALPAR AI Investor Portal & Pitch Deck presentation.",
  };
}

export default async function InvestPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="bg-bg-primary min-h-screen py-12">
      <Container size="wide">
        <InvestPresentation locale={locale} />
      </Container>
    </div>
  );
}
