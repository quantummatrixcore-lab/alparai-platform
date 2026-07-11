import { notFound } from "next/navigation";
import { headers } from "next/headers";

import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MainContent } from "@/components/layout/main-content";
import { ClientProviders } from "@/components/client-providers";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { OrganizationJsonLd } from "@/components/seo/json-ld";
import Script from "next/script";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import "../globals.css";

const sans = { variable: "font-sans" };
const display = { variable: "font-display" };
const mono = { variable: "font-mono" };

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

  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";
  const isEmbed = pathname.endsWith("/embed");

  return (
    <html
      lang={locale}
      className={`${sans.variable} ${display.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-bg-primary text-fg-primary relative min-h-screen w-full overflow-x-hidden font-sans antialiased">
        <a
          href="#main-content"
          className="focus:bg-brand-500 sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-md focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:outline-none"
        >
          {tCommon("skipToContent", { defaultValue: "Skip to main content" })}
        </a>
        <NextIntlClientProvider messages={messages}>
          {isEmbed ? (
            <main className="m-0 min-h-screen bg-transparent p-0">{children}</main>
          ) : (
            <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden pb-16 lg:pb-0">
              <Header user={headerUser} />
              <MainContent>{children}</MainContent>
              <Footer />
            </div>
          )}
          {!isEmbed && <MobileBottomNav />}
          <ClientProviders />
          {!isEmbed && <ScrollToTop />}
          <OrganizationJsonLd />
          <Script
            defer
            data-domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || "alparai.com"}
            src="https://plausible.io/js/script.js"
            strategy="lazyOnload"
          />
          <Analytics />

          <SpeedInsights />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
