import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { Inter } from "next/font/google";
import { routing } from "@/i18n/routing";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ClientProviders } from "@/components/client-providers";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo/json-ld";
import { getCurrentUser } from "@/lib/auth/session";
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
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
  const user = await getCurrentUser();
  const headerUser = user
    ? {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        avatarUrl: user.avatarUrl,
        role: user.role,
      }
    : null;

  return (
    <html lang={locale} className={inter.variable} suppressHydrationWarning>
      <body className="bg-bg-primary text-fg-primary min-h-screen font-sans antialiased">
        <a
          href="#main-content"
          className="focus:bg-brand-500 sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:outline-none"
        >
          {tCommon("skipToContent", { defaultValue: "Skip to main content" })}
        </a>
        <NextIntlClientProvider messages={messages}>
          <div className="flex min-h-screen flex-col">
            <Header user={headerUser} />
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          <ClientProviders />
          <ScrollToTop />
          <OrganizationJsonLd />
          <WebSiteJsonLd />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
