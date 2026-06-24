import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { Inter, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { routing } from "@/i18n/routing";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MainContent } from "@/components/layout/main-content";
import { ClientProviders } from "@/components/client-providers";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { OrganizationJsonLd } from "@/components/seo/json-ld";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import "../globals.css";

const sans = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const display = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();
  const tCommon = await getTranslations({ locale, namespace: "common" });
  const headerUser = null;

  return (
    <html
      lang={locale}
      className={`${sans.variable} ${display.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-bg-primary text-fg-primary min-h-screen font-sans antialiased">
        <a
          href="#main-content"
          className="focus:bg-brand-500 sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-md focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:outline-none"
        >
          {tCommon("skipToContent", { defaultValue: "Skip to main content" })}
        </a>
        <NextIntlClientProvider messages={messages}>
          <div className="flex min-h-screen flex-col pb-16 lg:pb-0">
            <Header user={headerUser} />
            <MainContent>{children}</MainContent>
            <Footer />
          </div>
          <MobileBottomNav />
          <ClientProviders />
          <ScrollToTop />
          <OrganizationJsonLd />
          <Analytics />
          <SpeedInsights />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
