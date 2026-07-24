"use client";

import * as React from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { SUPPORTED_LOCALES } from "@/lib/constants";

const LOCALE_LABELS: Record<string, string> = {
  en: "EN",
  tr: "TR",
  de: "DE",
  fr: "FR",
  ru: "RU",
};

export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const handleLocaleChange = (targetLocale: string) => {
    if (targetLocale === locale) return;
    router.replace(pathname, { locale: targetLocale });
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-white/[0.08] bg-white/[0.02] p-0.5 shadow-inner",
        className,
      )}
    >
      {SUPPORTED_LOCALES.map((loc, i) => (
        <React.Fragment key={loc}>
          {i > 0 && <div className="mx-0.5 h-3.5 w-[1px] bg-white/[0.08]" />}
          <button
            type="button"
            onClick={() => handleLocaleChange(loc)}
            className={cn(
              "rounded-full px-2.5 py-1 text-[10px] font-extrabold tracking-wider transition-all duration-300",
              locale === loc
                ? "bg-brand-500 text-white shadow-[0_0_12px_rgba(168,85,247,0.4)]"
                : "text-fg-muted hover:text-fg-primary",
            )}
          >
            {LOCALE_LABELS[loc] ?? loc.toUpperCase()}
          </button>
        </React.Fragment>
      ))}
    </div>
  );
}
