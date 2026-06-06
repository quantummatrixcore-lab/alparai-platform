"use client";

import * as React from "react";
import { Link, usePathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "./logo";

const links = [
  { href: "/", key: "home" },
  { href: "/incidents", key: "incidents" },
  { href: "/leaderboard", key: "leaderboard" },
  { href: "/suggestions", key: "suggestions" },
  { href: "/takedown", key: "takedown" },
  { href: "/about", key: "about" },
  { href: "/contact", key: "contact" },
] as const;

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");
  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(true)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-md text-fg-secondary hover:bg-bg-tertiary hover:text-fg-primary"
        aria-label={tCommon("openMenu")}
        aria-expanded={open}
      >
        <Menu className="h-5 w-5" />
      </button>
      {open && (
        <div
          className="fixed inset-0 z-50 bg-bg-primary/95 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-center justify-between p-4 border-b border-border-subtle">
            <Logo size="md" />
            <button
              onClick={() => setOpen(false)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-md text-fg-secondary hover:bg-bg-tertiary"
              aria-label={tCommon("closeMenu")}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="flex flex-col gap-1 p-4">
            {links.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-md px-4 py-3 text-base font-medium transition-colors",
                    isActive
                      ? "bg-bg-tertiary text-brand-400"
                      : "text-fg-secondary hover:bg-bg-tertiary hover:text-fg-primary"
                  )}
                >
                  {t(link.key)}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </div>
  );
}
