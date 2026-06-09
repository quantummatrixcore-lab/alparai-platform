"use client";

import * as React from "react";
import { Link, usePathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "./logo";

const links = [
  { href: "/", key: "home" },
  { href: "/incidents", key: "incidents" },
  { href: "/leaderboard", key: "leaderboard" },
  { href: "/blog", key: "blog" },
  { href: "/suggestions", key: "suggestions" },
  { href: "/about", key: "about" },
  { href: "/contact", key: "contact" },
] as const;

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");

  useEffect(() => {
    if (open) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      const handleKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") setOpen(false);
      };
      window.addEventListener("keydown", handleKey);
      return () => {
        document.body.style.overflow = original;
        window.removeEventListener("keydown", handleKey);
      };
    }
    return undefined;
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(true)}
        className="text-fg-secondary hover:bg-bg-tertiary hover:text-fg-primary focus-visible:ring-brand-500 inline-flex h-10 w-10 items-center justify-center rounded-md focus-visible:ring-2 focus-visible:outline-none"
        aria-label={tCommon("openMenu")}
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
      >
        <Menu className="h-5 w-5" />
      </button>
      {open && (
        <div
          id="mobile-nav-panel"
          className="bg-bg-primary/95 fixed inset-0 z-50 flex flex-col backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={tCommon("openMenu")}
        >
          <div className="border-border-subtle flex items-center justify-between border-b p-4">
            <Logo size="md" />
            <button
              onClick={() => setOpen(false)}
              className="text-fg-secondary hover:bg-bg-tertiary focus-visible:ring-brand-500 inline-flex h-10 w-10 items-center justify-center rounded-md focus-visible:ring-2 focus-visible:outline-none"
              aria-label={tCommon("closeMenu")}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
            {links.map((link) => {
              const isActive =
                link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "focus-visible:ring-brand-500 rounded-md px-4 py-3 text-base font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none",
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
