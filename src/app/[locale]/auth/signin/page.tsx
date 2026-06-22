import { setRequestLocale, getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { SignInForm } from "@/components/auth/sign-in-form";
import { AlertCircle, Mail } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Logo } from "@/components/layout/logo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auth" });
  return {
    title: `${t("signin_title")} — ALPAR AI`,
    description: t("signin_description"),
  };
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
  searchParams: Promise<{ error?: string; reason?: string; sent?: string; email?: string }>;
}) {
  const { locale } = await params;
  const { error, reason, sent, email } = await searchParams;
  setRequestLocale(locale);
  const user = await getCurrentUser();
  if (user) redirect(`/${locale}/profile`);

  const t = await getTranslations({ locale, namespace: "auth" });

  const errorKey = error ? ERROR_KEYS[error] : null;
  const errorMessage = errorKey
    ? (() => {
        try {
          return t(errorKey as never);
        } catch {
          return null;
        }
      })()
    : null;

  const showMagicLinkConfirmation = sent === "1" && email;

  return (
    <div className="bg-bg-primary relative flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex justify-center">
            <Logo
              size="xl"
              className="drop-shadow-[0_0_25px_rgba(168,85,247,0.35)] filter transition-all duration-500 hover:scale-105"
            />
          </div>
          <h1 className="text-fg-primary text-2xl font-bold tracking-tight">{t("signin_title")}</h1>
          <p className="text-fg-muted mt-2 text-sm">{t("tagline")}</p>
        </div>

        {/* Card */}
        <div className="border-border-subtle bg-bg-elevated rounded-2xl border p-8 shadow-2xl shadow-black/20">
          {/* Magic link confirmation from return URL */}
          {showMagicLinkConfirmation && (
            <div
              className="border-success-500/30 bg-success-500/10 text-success-500 mb-6 flex items-start gap-2 rounded-lg border p-3 text-sm"
              role="status"
              aria-live="polite"
            >
              <Mail className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <div className="min-w-0">
                <p className="font-semibold">{t("magic_link_sent_toast", { email })}</p>
              </div>
            </div>
          )}

          {/* OAuth / OTP error */}
          {errorMessage && (
            <div
              className="border-danger-500/30 bg-danger-500/10 text-danger-400 mb-6 flex items-start gap-2 rounded-lg border p-3 text-sm"
              role="alert"
              aria-live="polite"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <div className="min-w-0">
                <p className="font-semibold">{errorMessage}</p>
                {reason && (
                  <p className="text-fg-muted mt-1 font-mono text-xs break-all">[{reason}]</p>
                )}
              </div>
            </div>
          )}

          {/* Heading */}
          <div className="mb-6 text-center">
            <h2 className="text-fg-primary text-xl font-semibold">{t("welcome_title")}</h2>
            <p className="text-fg-muted mt-1 text-sm">{t("welcome_subtitle")}</p>
          </div>

          <SignInForm locale={locale} />
        </div>

        {/* Footer */}
        <p className="text-fg-muted mt-6 text-center text-xs">
          {t("signin_footer_prefix")}{" "}
          <Link href="/legal/terms" className="text-brand-400 hover:underline">
            {t("terms_service")}
          </Link>{" "}
          {t("signin_footer_and")}{" "}
          <Link href="/legal/privacy" className="text-brand-400 hover:underline">
            {t("terms_privacy")}
          </Link>
        </p>
      </div>
    </div>
  );
}
