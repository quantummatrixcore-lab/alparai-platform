import { setRequestLocale, getTranslations } from "next-intl/server";
import { PitchDeckViewer } from "@/components/deck/pitch-deck";

export const dynamic = "force-static";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "deck" });
  return {
    title: t("meta_title"),
    description: t("meta_desc"),
    openGraph: {
      title: t("meta_title"),
      description: t("meta_desc"),
      images: ["/og-image.jpg"],
    },
    twitter: {
      card: "summary_large_image",
      title: t("meta_title"),
      description: t("meta_desc"),
      images: ["/og-image.jpg"],
    },
    alternates: {
      canonical: `/${locale}/deck`,
      languages: {
        "x-default": "/en/deck",
        en: "/en/deck",
        tr: "/tr/deck",
      },
    },
  };
}

export default async function DeckPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <PitchDeckViewer />;
}
