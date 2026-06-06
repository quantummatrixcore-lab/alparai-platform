"use client";

import * as React from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter, routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { Globe } from "lucide-react";

export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const otherLocale = locale === "en" ? "tr" : "en";
  return (
    <button
      onClick={() => router.replace(pathname, { locale: otherLocale })}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium",
        "text-fg-secondary hover:bg-bg-tertiary hover:text-fg-primary",
        "transition-colors duration-200",
        "border border-border-subtle",
        className
      )}
      aria-label={`Switch language to ${otherLocale === "en" ? "English" : "Türkçe"}`}
    >
      <Globe className="h-4 w-4" aria-hidden="true" />
      <span className="uppercase">{otherLocale}</span>
    </button>
  );
}
