import { setRequestLocale, getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { SignInForm } from "@/components/auth/sign-in-form";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auth" });
  return { title: `${t("signin_title")} — ALPAR AI` };
}

export default async function SignInPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const user = await getCurrentUser();
  if (user) redirect(`/${locale}/profile`);

  const t = await getTranslations({ locale, namespace: "auth" });

  return (
    <div className="bg-bg-primary flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="from-brand-500 to-accent-600 shadow-brand-500/25 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br shadow-lg">
            <svg
              className="h-8 w-8 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <h1 className="text-fg-primary text-2xl font-bold tracking-tight">ALPAR AI</h1>
          <p className="text-fg-muted mt-2 text-sm">{t("tagline")}</p>
        </div>

        {/* Card */}
        <div className="border-border-subtle bg-bg-elevated rounded-2xl border p-8 shadow-2xl shadow-black/20">
          <div className="mb-6 text-center">
            <h2 className="text-fg-primary text-xl font-semibold">{t("welcome_title")}</h2>
            <p className="text-fg-muted mt-1 text-sm">{t("welcome_subtitle")}</p>
          </div>

          <SignInForm locale={locale} />
        </div>

        {/* Footer */}
        <p className="text-fg-muted mt-6 text-center text-xs">
          {t("signin_footer_prefix")}{" "}
          <a href={`/${locale}/legal/terms`} className="text-brand-400 hover:underline">
            {t("terms_service")}
          </a>{" "}
          {t("signin_footer_and")}{" "}
          <a href={`/${locale}/legal/privacy`} className="text-brand-400 hover:underline">
            {t("terms_privacy")}
          </a>
        </p>
      </div>
    </div>
  );
}
