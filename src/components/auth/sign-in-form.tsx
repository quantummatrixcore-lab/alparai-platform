"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { GoogleSignInButton, EmailMagicLinkForm } from "./auth-buttons";
import { CheckCircle2 } from "lucide-react";
import { Link } from "@/i18n/routing";

export function SignInForm({ locale }: { locale: string }) {
  const t = useTranslations("auth");
  const [agreed, setAgreed] = React.useState(false);

  return (
    <>
      <div className="space-y-3">
        <label className="group flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="border-border-strong text-brand-500 focus:ring-brand-500 focus:ring-offset-bg-primary mt-0.5 h-4 w-4 rounded"
            aria-label={t("consent_aria")}
          />
          <span className="text-fg-muted text-xs leading-relaxed">
            {t("consent_prefix")}{" "}
            <Link href="/legal/terms" className="text-brand-400 font-medium hover:underline">
              {t("terms_service")}
            </Link>{" "}
            {t("consent_and")}{" "}
            <Link href="/legal/privacy" className="text-brand-400 font-medium hover:underline">
              {t("terms_privacy")}
            </Link>
            . {t("consent_suffix")}
          </span>
        </label>
      </div>

      <div className={agreed ? "" : "pointer-events-none opacity-50"}>
        <GoogleSignInButton next={`/${locale}/profile`} className="w-full" disabled={!agreed} />
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="border-border-subtle w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs tracking-wider uppercase">
          <span className="bg-bg-elevated text-fg-muted px-2">{t("or_divider")}</span>
        </div>
      </div>

      <div className={agreed ? "" : "pointer-events-none opacity-50"}>
        <EmailMagicLinkForm />
      </div>

      <p className="text-fg-muted text-xs">
        {t("terms_prefix")}{" "}
        <a href={`/${locale}/legal/terms`} className="text-brand-400 hover:underline">
          {t("terms_service")}
        </a>{" "}
        {t("terms_and")}{" "}
        <a href={`/${locale}/legal/privacy`} className="text-brand-400 hover:underline">
          {t("terms_privacy")}
        </a>
        .
      </p>
      <ul className="text-fg-muted space-y-1.5 text-xs">
        <li className="flex items-center gap-2">
          <CheckCircle2 className="text-success-500 h-3.5 w-3.5" />
          {t("benefit_no_password")}
        </li>
        <li className="flex items-center gap-2">
          <CheckCircle2 className="text-success-500 h-3.5 w-3.5" />
          {t("benefit_no_sell")}
        </li>
        <li className="flex items-center gap-2">
          <CheckCircle2 className="text-success-500 h-3.5 w-3.5" />
          {t("benefit_delete")}
        </li>
      </ul>
    </>
  );
}
