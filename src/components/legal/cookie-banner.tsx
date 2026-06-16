"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

const COOKIE_KEY = "alpar_cookie_consent";

export function CookieBanner() {
  const t = useTranslations("legal");
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.localStorage.getItem(COOKIE_KEY)) setVisible(true);
  }, []);

  const accept = (level: "all" | "essential") => {
    localStorage.setItem(COOKIE_KEY, JSON.stringify({ level, at: Date.now() }));
    setVisible(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        accept("essential");
      }
    };
    if (visible) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [visible]);

  if (!visible) return null;
  return (
    <div
      role="dialog"
      aria-label="Cookie preferences"
      className="border-border-subtle bg-bg-elevated fixed right-4 bottom-4 left-4 z-50 mx-auto max-w-2xl rounded-xl border p-4 shadow-2xl sm:right-6 sm:bottom-6 sm:left-6"
    >
      <div className="flex items-start gap-4">
        <div className="flex-1 space-y-2 text-sm">
          <p className="text-fg-primary font-semibold">{t("cookieTitle")}</p>
          <p className="text-fg-muted">{t("cookieBody")}</p>
          <p className="text-fg-muted text-xs">
            <Link href="/legal/privacy" className="text-brand-400 hover:underline">
              {t("cookieLearnMore")}
            </Link>
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-2">
          <Button onClick={() => accept("all")} size="sm">
            {t("cookieAccept")}
          </Button>
          <Button onClick={() => accept("essential")} variant="outline" size="sm">
            {t("cookieEssential")}
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
