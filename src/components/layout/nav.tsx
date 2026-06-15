"use client";

import * as React from "react";
import { Link, usePathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { Home, FileText, BarChart3, BookOpen, Cpu } from "lucide-react";
import { motion } from "framer-motion";
import type { ComponentType } from "react";

interface NavItem {
  href: string;
  labelKey: string;
  icon: ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { href: "/", labelKey: "home", icon: Home },
  { href: "/incidents", labelKey: "incidents", icon: FileText },
  { href: "/models", labelKey: "models", icon: Cpu },
  { href: "/leaderboard", labelKey: "leaderboard", icon: BarChart3 },
  { href: "/blog", labelKey: "blog", icon: BookOpen },
];

export function Nav({ className }: { className?: string }) {
  const pathname = usePathname();
  const t = useTranslations("nav");
  return (
    <nav className={cn("hidden items-center gap-1.5 md:flex", className)}>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "focus-visible:ring-brand-500 relative inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors duration-300 outline-none focus-visible:ring-2",
              isActive ? "text-brand-400" : "text-fg-secondary hover:text-fg-primary"
            )}
            aria-current={isActive ? "page" : undefined}
          >
            {isActive && (
              <motion.span
                layoutId="nav-active"
                className="absolute inset-0 rounded-full border border-white/5 bg-white/5 shadow-inner"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <Icon className="h-4 w-4" aria-hidden="true" />
              {t(item.labelKey)}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
