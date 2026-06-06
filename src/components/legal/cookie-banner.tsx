"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

const COOKIE_KEY = "alpar_cookie_consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const t = useTranslations("legal.cookie");
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.localStorage.getItem(COOKIE_KEY)) setVisible(true);
  }, []);

  const accept = (level: "all" | "essential") => {
    localStorage.setItem(COOKIE_KEY, JSON.stringify({ level, at: Date.now() }));
    setVisible(false);
  };

  if (!visible) return null;
  return (
    <div
      role="dialog"
      aria-label="Cookie preferences"
      className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-2xl rounded-xl border border-border-subtle bg-bg-elevated p-4 shadow-2xl sm:bottom-6 sm:left-6 sm:right-6"
    >
      <div className="flex items-start gap-4">
        <div className="flex-1 space-y-2 text-sm">
          <p className="font-semibold text-fg-primary">
            {t("title", { defaultValue: "We value your privacy" })}
          </p>
          <p className="text-fg-muted">
            {t("body", {
              defaultValue:
                "We use essential cookies to run this site. With your consent we also use privacy-friendly analytics (Plausible) to improve the product. No tracking, no third-party ads.",
            })}
          </p>
          <p className="text-xs text-fg-muted">
            <Link href="/legal/privacy" className="text-brand-400 hover:underline">
              {t("learnMore", { defaultValue: "Privacy policy" })}
            </Link>
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-2">
          <Button onClick={() => accept("all")} size="sm">
            {t("accept", { defaultValue: "Accept all" })}
          </Button>
          <Button onClick={() => accept("essential")} variant="outline" size="sm">
            {t("essential", { defaultValue: "Essential only" })}
          </Button>
        </div>
        <button
          onClick={() => accept("essential")}
          className="text-fg-muted hover:text-fg-primary"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
