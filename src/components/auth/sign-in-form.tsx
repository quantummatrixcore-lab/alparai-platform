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
    <div className="space-y-6">
      {/* Google Sign In */}
      <div className={agreed ? "" : "pointer-events-none opacity-50"}>
        <GoogleSignInButton next={`/${locale}/profile`} className="w-full" disabled={!agreed} />
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="border-border-subtle w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-bg-elevated text-fg-muted px-3">or continue with email</span>
        </div>
      </div>

      {/* Email Magic Link */}
      <div className={agreed ? "" : "pointer-events-none opacity-50"}>
        <EmailMagicLinkForm />
      </div>

      {/* Consent */}
      <label className="group border-border-subtle bg-bg-secondary/50 hover:border-brand-500/50 flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="border-border-strong text-brand-500 focus:ring-brand-500 focus:ring-offset-bg-primary mt-0.5 h-4 w-4 rounded"
          aria-label={t("consent_aria")}
        />
        <span className="text-fg-muted text-xs leading-relaxed">
          I agree to the{" "}
          <Link href="/legal/terms" className="text-brand-400 font-medium hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/legal/privacy" className="text-brand-400 font-medium hover:underline">
            Privacy Policy
          </Link>
        </span>
      </label>

      {/* Benefits */}
      <div className="border-border-subtle bg-bg-secondary/30 space-y-2 rounded-lg border p-4">
        <div className="flex items-center gap-2">
          <Shield className="text-success-500 h-4 w-4" />
          <span className="text-fg-secondary text-xs">Secure authentication via Google OAuth</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="text-success-500 h-4 w-4" />
          <span className="text-fg-secondary text-xs">No password to remember</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="text-success-500 h-4 w-4" />
          <span className="text-fg-secondary text-xs">We never sell your data</span>
        </div>
      </div>
    </div>
  );
}
