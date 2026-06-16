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
import { usePathname } from "next/navigation";

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
  const pathname = usePathname();
  const isAdmin =
    pathname &&
    (/^\/(?:en|tr)\/admin(?:\/|$)/.test(pathname) ||
      pathname === "/admin" ||
      pathname.startsWith("/admin"));

  if (isAdmin) {
    return null;
  }
  return (
    <div className="pointer-events-none fixed top-0 z-50 flex w-full justify-center p-4 sm:p-6">
      <header className="bg-glass hover:border-brand-500/20 pointer-events-auto flex h-14 w-full max-w-6xl items-center justify-between gap-4 rounded-full px-4 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] transition-all duration-500 hover:shadow-[0_8px_32px_rgba(168,85,247,0.15)]">
        <div className="flex items-center gap-6 md:gap-8">
          <Link
            href="/"
            className="focus-visible:ring-brand-500 group relative flex items-center rounded-full pl-1 focus-visible:ring-2 focus-visible:outline-none"
            aria-label="ALPAR AI home"
          >
            <div className="from-brand-500/0 via-brand-500/10 to-brand-500/0 absolute -inset-2 rounded-full bg-gradient-to-r opacity-0 blur transition-opacity duration-500 group-hover:opacity-100"></div>
            <Wordmark size="md" />
          </Link>
          <div className="hidden md:block">
            <Nav />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSwitcher className="hidden sm:inline-flex" />
          <Link
            href="/suggestions"
            className="border-border-subtle/50 text-fg-secondary hover:bg-bg-tertiary hover:text-fg-primary focus-visible:ring-brand-500 focus-visible:ring-offset-bg-primary hidden h-9 items-center gap-1.5 rounded-full border px-4 text-xs font-semibold transition-all hover:shadow-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none sm:inline-flex"
          >
            <Lightbulb className="text-warning-400 h-3.5 w-3.5" aria-hidden="true" />
            {t("suggestions")}
          </Link>
          <Link
            href="/submit"
            className="from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 focus-visible:ring-brand-500 hidden h-9 items-center gap-1.5 rounded-full bg-gradient-to-r px-4 text-xs font-bold text-white shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all hover:scale-105 hover:shadow-[0_0_25px_rgba(168,85,247,0.6)] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none sm:inline-flex"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            {t("report")}
          </Link>
          <div className="pl-1">
            <UserMenu initialUser={user} />
          </div>
          <div className="md:hidden">
            <MobileNav />
          </div>
        </div>
      </header>
    </div>
  );
}
