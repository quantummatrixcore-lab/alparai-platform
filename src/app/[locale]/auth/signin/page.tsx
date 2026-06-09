import { setRequestLocale, getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { SignInForm } from "@/components/auth/sign-in-form";
import { AlertCircle } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auth" });
  return { title: `${t("signin_title")} — ALPAR AI` };
}

const ERROR_KEYS: Record<string, string> = {
  oauth: "oauth_failed",
  otp: "otp_failed",
  server_error: "server_error",
  missing_params: "missing_params",
};

export default async function SignInPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string; reason?: string }>;
}) {
  const { locale } = await params;
  const { error, reason } = await searchParams;
  setRequestLocale(locale);
  const user = await getCurrentUser();
  if (user) redirect(`/${locale}/profile`);

  const t = await getTranslations({ locale, namespace: "auth" });
  const tErrors = await getTranslations({ locale, namespace: "auth" }).catch(() => null);

  const errorKey = error ? ERROR_KEYS[error] : null;
  const errorMessage = errorKey
    ? (() => {
        try {
          return tErrors?.(errorKey) ?? t(errorKey as never);
        } catch {
          return null;
        }
      })()
    : null;

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
          {errorMessage && (
            <div
              className="border-danger-500/30 bg-danger-500/10 text-danger-400 mb-6 flex items-start gap-2 rounded-lg border p-3 text-sm"
              role="alert"
              aria-live="polite"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <div>
                <p className="font-semibold">{errorMessage}</p>
                {reason && <p className="text-fg-muted mt-1 font-mono text-xs">[{reason}]</p>}
              </div>
            </div>
          )}
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
