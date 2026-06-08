"use client";

import * as React from "react";
import { Link } from "@/i18n/routing";
import { Wordmark } from "./wordmark";
import { Nav } from "./nav";
import { MobileNav } from "./mobile-nav";
import { LanguageSwitcher } from "./language-switcher";
import { UserMenu } from "./user-menu";
import { useTranslations } from "next-intl";
import { Plus, Lightbulb } from "lucide-react";

export function Header({
  user,
}: {
  user: {
    id: string;
    email: string;
    fullName: string | null;
    avatarUrl: string | null;
    role: "user" | "moderator" | "admin" | "ceo";
  } | null;
}) {
  const t = useTranslations("nav");
  return (
    <header className="border-border-subtle bg-bg-primary/80 sticky top-0 z-40 w-full border-b backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="focus-visible:ring-brand-500 rounded-md focus-visible:ring-2 focus-visible:outline-none"
            aria-label="ALPAR AI home"
          >
            <Wordmark size="md" />
          </Link>
          <Nav />
        </div>
        <div className="flex items-center gap-2">
          <LanguageSwitcher className="hidden sm:inline-flex" />
          <Link
            href="/suggestions"
            className="border-border-subtle text-fg-secondary hover:bg-bg-tertiary hover:text-fg-primary focus-visible:ring-brand-500 focus-visible:ring-offset-bg-primary hidden h-8 items-center gap-1.5 rounded-md border px-3 text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none sm:inline-flex"
          >
            <Lightbulb className="h-3.5 w-3.5" aria-hidden="true" />
            {t("suggestions")}
          </Link>
          <Link
            href="/submit"
            className="bg-brand-500 hover:bg-brand-600 active:bg-brand-700 focus-visible:ring-brand-500 focus-visible:ring-offset-bg-primary hidden h-8 items-center gap-1.5 rounded-md px-3 text-xs font-semibold text-white transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none sm:inline-flex"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            {t("report")}
          </Link>
          <UserMenu initialUser={user} />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
