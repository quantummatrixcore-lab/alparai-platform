"use client";

import * as React from "react";
import { useLocale } from "next-intl";
import { usePathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const pathname = usePathname();

  const handleLocaleChange = (targetLocale: string) => {
    if (targetLocale === locale) return;
    const targetHref = "/" + targetLocale + (pathname === "/" ? "" : pathname);
    window.location.href = targetHref;
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-white/[0.08] bg-white/[0.02] p-0.5 shadow-inner",
        className,
      )}
    >
      <button
        type="button"
        onClick={() => handleLocaleChange("tr")}
        className={cn(
          "rounded-full px-2.5 py-1 text-[10px] font-extrabold tracking-wider transition-all duration-300",
          locale === "tr"
            ? "bg-brand-500 text-white shadow-[0_0_12px_rgba(168,85,247,0.4)]"
            : "text-fg-muted hover:text-fg-primary",
        )}
      >
        TR
      </button>
      <div className="mx-0.5 h-3.5 w-[1px] bg-white/[0.08]" />
      <button
        type="button"
        onClick={() => handleLocaleChange("en")}
        className={cn(
          "rounded-full px-2.5 py-1 text-[10px] font-extrabold tracking-wider transition-all duration-300",
          locale === "en"
            ? "bg-brand-500 text-white shadow-[0_0_12px_rgba(168,85,247,0.4)]"
            : "text-fg-muted hover:text-fg-primary",
        )}
      >
        EN
      </button>
    </div>
  );
}
