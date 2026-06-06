"use client";

import * as React from "react";
import { Link } from "@/i18n/routing";
import { Wordmark } from "./wordmark";
import { Nav } from "./nav";
import { MobileNav } from "./mobile-nav";
import { LanguageSwitcher } from "./language-switcher";
import { UserMenu } from "./user-menu";
import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";

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
    <header className="sticky top-0 z-40 w-full border-b border-border-subtle bg-bg-primary/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            aria-label="ALPAR AI home"
          >
            <Wordmark size="md" />
          </Link>
          <Nav />
        </div>
        <div className="flex items-center gap-2">
          <LanguageSwitcher className="hidden sm:inline-flex" />
          <Link
            href="/submit"
            className="hidden sm:inline-flex h-8 items-center gap-1.5 rounded-md bg-brand-500 px-3 text-xs font-semibold text-white hover:bg-brand-600 active:bg-brand-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
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
