"use client";

import * as React from "react";
import { Link, usePathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { Home, FileText, BarChart3, BookOpen } from "lucide-react";
import type { ComponentType } from "react";

interface NavItem {
  href: string;
  labelKey: string;
  icon: ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { href: "/", labelKey: "home", icon: Home },
  { href: "/incidents", labelKey: "incidents", icon: FileText },
  { href: "/leaderboard", labelKey: "leaderboard", icon: BarChart3 },
  { href: "/blog", labelKey: "blog", icon: BookOpen },
];

export function Nav({ className }: { className?: string }) {
  const pathname = usePathname();
  const t = useTranslations("nav");
  return (
    <nav className={cn("hidden items-center gap-1 md:flex", className)}>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium",
              "transition-colors duration-200",
              isActive
                ? "bg-bg-tertiary text-brand-400"
                : "text-fg-secondary hover:bg-bg-tertiary hover:text-fg-primary"
            )}
            aria-current={isActive ? "page" : undefined}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {t(item.labelKey)}
          </Link>
        );
      })}
    </nav>
  );
}
