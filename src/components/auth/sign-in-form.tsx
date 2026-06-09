"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { GoogleSignInButton, EmailMagicLinkForm } from "./auth-buttons";
import { CheckCircle2, Shield } from "lucide-react";
import { Link } from "@/i18n/routing";

export function SignInForm({ locale }: { locale: string }) {
  const t = useTranslations("auth");
  const [agreed, setAgreed] = React.useState(false);

  return (
    <div className="space-y-5">
      {/* Primary: Google Sign In */}
      <div>
        <GoogleSignInButton next={`/${locale}/profile`} className="w-full" disabled={!agreed} />
        <p className="text-fg-muted mt-2 text-center text-xs">{t("signin_description")}</p>
      </div>

      {/* Divider with label */}
      <div className="relative" role="separator" aria-orientation="horizontal">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="border-border-subtle w-full border-t" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-bg-elevated text-fg-muted px-3 text-[10px] font-semibold tracking-[0.2em] uppercase">
            {t("or_continue_email")}
          </span>
        </div>
      </div>

      {/* Secondary: Email Magic Link */}
      <EmailMagicLinkForm disabled={!agreed} />

      {/* Consent — single source of truth */}
      <label
        htmlFor="auth-consent"
        className="border-border-subtle bg-bg-secondary/50 hover:border-brand-500/50 has-checked:border-brand-500/60 has-checked:bg-brand-500/5 group flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors"
      >
        <input
          id="auth-consent"
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="border-border-strong text-brand-500 focus:ring-brand-500 focus:ring-offset-bg-primary mt-0.5 h-4 w-4 shrink-0 rounded focus:ring-2 focus:ring-offset-1"
          aria-describedby="auth-consent-text"
        />
        <span id="auth-consent-text" className="text-fg-muted text-xs leading-relaxed">
          {t("consent_prefix")}{" "}
          <Link href="/legal/terms" className="text-brand-400 font-medium hover:underline">
            {t("terms_service")}
          </Link>{" "}
          {t("consent_and")}{" "}
          <Link href="/legal/privacy" className="text-brand-400 font-medium hover:underline">
            {t("terms_privacy")}
          </Link>
        </span>
      </label>

      {/* Trust signals */}
      <ul className="border-border-subtle bg-bg-secondary/30 divide-border-subtle space-y-2.5 rounded-lg border p-4 text-xs">
        <li className="flex items-center gap-2.5">
          <Shield className="text-success-500 h-4 w-4 shrink-0" aria-hidden="true" />
          <span className="text-fg-secondary">{t("benefit_secure")}</span>
        </li>
        <li className="flex items-center gap-2.5">
          <CheckCircle2 className="text-success-500 h-4 w-4 shrink-0" aria-hidden="true" />
          <span className="text-fg-secondary">{t("benefit_no_password")}</span>
        </li>
        <li className="flex items-center gap-2.5">
          <CheckCircle2 className="text-success-500 h-4 w-4 shrink-0" aria-hidden="true" />
          <span className="text-fg-secondary">{t("benefit_no_sell")}</span>
        </li>
      </ul>
    </div>
  );
}
