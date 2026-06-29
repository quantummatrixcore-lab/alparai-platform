"use client";

import * as React from "react";
import { Link, usePathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { FileText, BarChart3, BookOpen, Cpu, ShieldCheck, Eye, Info, Award } from "lucide-react";
import { motion } from "framer-motion";
import type { ComponentType } from "react";

interface NavItem {
  href: string;
  labelKey: string;
  icon: ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { href: "/incidents", labelKey: "incidents", icon: FileText },
  { href: "/leaderboard", labelKey: "leaderboard", icon: BarChart3 },
  { href: "/models", labelKey: "models", icon: Cpu },
  { href: "/experts", labelKey: "experts", icon: Award },
  { href: "/blog", labelKey: "blog", icon: BookOpen },
  { href: "/transparency", labelKey: "transparency", icon: Eye },
  { href: "/about", labelKey: "about", icon: Info },
];

export function Nav({
  className,
  user,
}: {
  className?: string;
  user?: {
    role: "user" | "moderator" | "admin" | "ceo";
  } | null;
}) {
  const pathname = usePathname();
  const t = useTranslations("nav");
  const isMod = user && (user.role === "moderator" || user.role === "admin" || user.role === "ceo");
  const activeItems = isMod
    ? [...navItems, { href: "/admin", labelKey: "admin", icon: ShieldCheck }]
    : navItems;

  return (
    <nav className={cn("hidden items-center gap-1 xl:flex", className)}>
      {activeItems.map((item) => {
        const Icon = item.icon;
        const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "focus-visible:ring-brand-500 relative inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold whitespace-nowrap transition-colors duration-300 outline-none focus-visible:ring-2 xl:gap-1.5 xl:px-2 xl:text-xs 2xl:gap-2 2xl:px-3 2xl:text-sm",
              isActive ? "text-brand-400" : "text-fg-secondary hover:text-fg-primary",
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
            <span className="relative z-10 flex items-center gap-1 xl:gap-1.5 2xl:gap-2">
              <Icon className="h-4 w-4" aria-hidden="true" />
              {t(item.labelKey)}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
