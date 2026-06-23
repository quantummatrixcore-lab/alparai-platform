"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { GoogleSignInButton, EmailMagicLinkForm } from "./auth-buttons";
import { CheckCircle2, Shield } from "lucide-react";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export function SignInForm({ locale }: { locale: string }) {
  const t = useTranslations("auth");
  const [agreed, setAgreed] = React.useState(false);

  return (
    <div className="space-y-6">
      {/* Primary: Google Sign In */}
      <div className="space-y-2">
        <GoogleSignInButton next={`/${locale}/profile`} className="w-full" disabled={!agreed} />
      </div>

      {/* Divider with label */}
      <div className="relative py-2" role="separator" aria-orientation="horizontal">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-white/[0.06]" />
        </div>
        <div className="relative flex justify-center">
          <span className="text-fg-muted bg-[#0F1424] px-4 text-[10px] font-bold tracking-[0.2em] uppercase">
            {t("or_continue_email")}
          </span>
        </div>
      </div>

      {/* Secondary: Email Magic Link */}
      <EmailMagicLinkForm disabled={!agreed} />

      {/* Consent Checkbox */}
      <label
        htmlFor="auth-consent"
        className={cn(
          "group flex cursor-pointer items-start gap-3 rounded-xl border border-white/[0.08] bg-white/[0.01] p-4 transition-all hover:bg-white/[0.03]",
          agreed && "border-brand-500/40 bg-brand-500/[0.02]",
        )}
      >
        <input
          id="auth-consent"
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="text-brand-500 focus:ring-brand-500 focus:ring-offset-bg-primary mt-0.5 h-4 w-4 shrink-0 rounded border-white/20 bg-transparent transition-colors focus:ring-2 focus:ring-offset-1"
          aria-describedby="auth-consent-text"
        />
        <span id="auth-consent-text" className="text-fg-muted text-xs leading-relaxed select-none">
          {t("consent_prefix")}{" "}
          <Link href="/legal/terms" className="text-brand-400 font-semibold hover:underline">
            {t("terms_service")}
          </Link>{" "}
          {t("consent_and")}{" "}
          <Link href="/legal/privacy" className="text-brand-400 font-semibold hover:underline">
            {t("terms_privacy")}
          </Link>
        </span>
      </label>

      {/* Trust signals */}
      <ul className="divide-y divide-white/[0.06] rounded-xl border border-white/[0.06] bg-white/[0.01] p-4 text-xs">
        <li className="flex items-center gap-3 pb-3">
          <div className="bg-success-500/10 border-success-500/20 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border">
            <Shield className="text-success-400 h-3.5 w-3.5" aria-hidden="true" />
          </div>
          <span className="text-fg-secondary font-medium">{t("benefit_secure")}</span>
        </li>
        <li className="flex items-center gap-3 py-3">
          <div className="bg-success-500/10 border-success-500/20 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border">
            <CheckCircle2 className="text-success-400 h-3.5 w-3.5" aria-hidden="true" />
          </div>
          <span className="text-fg-secondary font-medium">{t("benefit_no_password")}</span>
        </li>
        <li className="flex items-center gap-3 pt-3">
          <div className="bg-success-500/10 border-success-500/20 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border">
            <CheckCircle2 className="text-success-400 h-3.5 w-3.5" aria-hidden="true" />
          </div>
          <span className="text-fg-secondary font-medium">{t("benefit_no_sell")}</span>
        </li>
      </ul>
    </div>
  );
}
