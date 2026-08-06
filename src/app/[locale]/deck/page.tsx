import { setRequestLocale } from "next-intl/server";
import { PitchDeckViewer } from "@/components/deck/pitch-deck";

export const dynamic = "force-static";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
    title: "ALPAR AI — Interactive Seed Pitch Deck | Trust Infrastructure for AI",
    description:
      "Explore ALPAR AI's 12-slide interactive seed pitch deck: Cryptographic verification, real-time auditability, and regulatory compliance for enterprise autonomous AI deployment.",
    openGraph: {
      title: "ALPAR AI — Interactive Seed Pitch Deck",
      description:
        "Cryptographic verification, real-time auditability, and regulatory compliance for enterprise AI deployments.",
      images: ["/og-image.jpg"],
    },
    twitter: {
      card: "summary_large_image",
      title: "ALPAR AI — Interactive Seed Pitch Deck",
      description:
        "Cryptographic verification, real-time auditability, and regulatory compliance for enterprise AI deployments.",
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
