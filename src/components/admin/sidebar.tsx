"use client";

import * as React from "react";
import { useState } from "react";
import { Link, usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  SquaresFour,
  ShieldWarning,
  FileArrowDown,
  Users,
  Cpu,
  Lightning,
  ChartBar,
  Clock,
  SignOut,
  Globe,
  List,
  ShieldCheck,
  Key,
  ShareNetwork,
  GridFour,
  TrendUp,
  Compass,
  DownloadSimple,
  Medal,
  Lightbulb,
  Megaphone,
  Pulse,
} from "@phosphor-icons/react";
import { cn, getInitials } from "@/lib/utils";
import Image from "next/image";
import { Wordmark } from "../layout/wordmark";
import { LanguageSwitcher } from "../layout/language-switcher";

interface SidebarUserShape {
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  role: "user" | "moderator" | "admin" | "ceo" | "advisor";
}

export function AdminSidebar({ user }: { user: SidebarUserShape }) {
  const t = useTranslations("admin");
  const tAuth = useTranslations("auth");
  const tNav = useTranslations("nav");
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const oversightItems = [
    { href: "/admin", label: t("dashboard"), icon: SquaresFour, active: pathname === "/admin" },
    {
      href: "/admin/analysis",
      label: t("analytics"),
      icon: ChartBar,
      active: pathname.startsWith("/admin/analysis"),
    },
    {
      href: "/admin/api-metrics",
      label: t("api_metrics") || "API Hub",
      icon: Pulse,
      active: pathname.startsWith("/admin/api-metrics"),
    },
  ];

  const ecosystemItems = [
    {
      label: t("nav_aiPulse"),
      href: "/admin/ai-pulse",
      icon: Pulse,
      active: pathname.startsWith("/admin/ai-pulse"),
    },
    {
      href: "/admin/autopilot",
      label: t("autopilot"),
      icon: Lightning,
      active: pathname.startsWith("/admin/autopilot"),
    },
    ...(user.role === "admin" || user.role === "ceo"
      ? [
          {
            href: "/admin/innovations",
            label: t("innovations", { defaultValue: "Innovations" }),
            icon: Lightbulb,
            active: pathname.startsWith("/admin/innovations"),
          },
        ]
      : []),
  ];

  const operationsItems = [
    {
      href: "/admin/moderation",
      label: t("moderation_queue"),
      icon: ShieldWarning,
      active: pathname.startsWith("/admin/moderation"),
    },
    {
      href: "/admin/takedown",
      label: t("stats_takedown_requests"),
      icon: FileArrowDown,
      active: pathname.startsWith("/admin/takedown"),
    },
    ...(user.role === "admin" || user.role === "ceo"
      ? [
          {
            href: "/admin/import",
            label: t("import_queue") || "Import Queue",
            icon: DownloadSimple,
            active: pathname.startsWith("/admin/import"),
          },
        ]
      : []),
  ];

  const communityItems = [
    {
      href: "/admin/users",
      label: t("users"),
      icon: Users,
      active: pathname.startsWith("/admin/users"),
    },
    {
      href: "/admin/experts",
      label: t("expertApplications", { defaultValue: "Experts" }),
      icon: Medal,
      active: pathname.startsWith("/admin/experts"),
    },
    {
      href: "/admin/providers",
      label: t("providers"),
      icon: Cpu,
      active: pathname.startsWith("/admin/providers"),
    },
    ...(user.role === "admin" || user.role === "ceo"
      ? [
          {
            href: "/admin/investors",
            label: "Investor Applications",
            icon: TrendUp,
            active: pathname.startsWith("/admin/investors"),
          },
        ]
      : []),
    {
      href: "/admin/social",
      label: t("social_media_hub") || "Social Media Hub",
      icon: ShareNetwork,
      active: pathname.startsWith("/admin/social"),
    },
    ...(user.role === "admin" || user.role === "ceo"
      ? [
          {
            href: "/admin/outreach",
            label: t("outreach_hub") || "Outreach Hub",
            icon: Megaphone,
            active: pathname.startsWith("/admin/outreach"),
          },
        ]
      : []),
  ];

  const settingsItems = [
    {
      href: "/admin/audit",
      label: t("audit_log"),
      icon: Clock,
      active: pathname.startsWith("/admin/audit"),
    },
    {
      href: "/admin/api-keys",
      label: t("api_keys"),
      icon: Key,
      active: pathname.startsWith("/admin/api-keys"),
    },
  ];

  const hasStrategyAccess = user.role === "ceo" || user.role === "admin" || user.role === "advisor";

  const strategyItems = [
    {
      href: "/admin/strategy",
      label: t("strategy_overview") || "Overview",
      icon: Compass,
      active: pathname === "/admin/strategy",
    },
    {
      href: "/admin/strategy/swot",
      label: "SWOT",
      icon: GridFour,
      active: pathname === "/admin/strategy/swot",
    },
    {
      href: "/admin/strategy/risks",
      label: "Risks",
      icon: ShieldCheck,
      active: pathname === "/admin/strategy/risks",
    },
  ];

  const renderNavGroup = (title: string, items: typeof oversightItems) => (
    <div className="mt-8 first:mt-2">
      <h3 className="text-fg-muted mb-2 px-4 text-[10px] font-bold tracking-widest uppercase">
        {title}
      </h3>
      <div className="space-y-1.5 px-4">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href as never}
              onClick={() => setIsOpen(false)}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-300",
                item.active ? "text-brand-300" : "text-fg-secondary hover:text-fg-primary",
              )}
            >
              {item.active && (
                <motion.div
                  layoutId="sidebar-active-pill"
                  className="bg-brand-500/15 border-brand-500 pointer-events-none absolute inset-0 rounded-xl border-l-2 shadow-[inset_0_0_12px_rgba(168,85,247,0.15)]"
                  transition={{ type: "spring" as const, stiffness: 350, damping: 30 }}
                />
              )}
              <Icon
                weight="duotone"
                className={cn(
                  "relative z-10 h-4 w-4 transition-colors duration-300",
                  item.active
                    ? "text-brand-400 drop-shadow-[0_0_5px_rgba(168,85,247,0.5)]"
                    : "text-fg-muted group-hover:text-fg-primary drop-shadow-[0_0_3px_rgba(255,255,255,0.1)]",
                )}
              />
              <span className="relative z-10 truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-fg-secondary bg-bg-primary/80 fixed top-4 left-4 z-40 rounded-xl border border-white/5 p-2.5 shadow-lg backdrop-blur-xl lg:hidden"
      >
        <List weight="duotone" className="h-5 w-5" />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={cn(
          "bg-bg-secondary/40 fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-white/5 shadow-[4px_0_24px_rgba(0,0,0,0.5)] backdrop-blur-2xl transition-transform duration-500 lg:static lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/5 px-6">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="relative h-8 w-8">
              <Image src="/logo.png" alt="ALPAR" fill className="object-contain" />
            </div>
            <Wordmark className="text-xl" />
          </Link>
        </div>

        <nav className="scrollbar-hide flex-1 overflow-y-auto py-4">
          {renderNavGroup(t("nav_group_oversight") || "360° Oversight", oversightItems)}
          {renderNavGroup(t("nav_group_ecosystem") || "AI Ecosystem", ecosystemItems)}
          {renderNavGroup(t("nav_group_operations") || "Operations", operationsItems)}
          {renderNavGroup(t("nav_group_community") || "Community", communityItems)}
          {hasStrategyAccess && renderNavGroup(t("strategy_header") || "Strategy", strategyItems)}
          {renderNavGroup(t("nav_group_settings") || "Settings", settingsItems)}
        </nav>

        {/* User Profile Footer */}
        <div className="border-border-subtle bg-bg-secondary/60 border-t p-4 backdrop-blur-md">
          <div className="mb-4 flex items-center gap-3">
            <div className="border-brand-500/30 relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border shadow-[0_0_10px_rgba(168,85,247,0.2)]">
              {user.avatarUrl ? (
                <Image
                  src={user.avatarUrl}
                  alt=""
                  width={40}
                  height={40}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-brand-300 text-sm font-bold">
                  {getInitials(user.fullName ?? user.email)}
                </span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-fg-primary truncate text-sm font-bold">
                {user.fullName ?? user.email.split("@")[0]}
              </p>
              <div className="mt-0.5 flex items-center gap-1.5">
                <span
                  className={cn(
                    "inline-flex items-center gap-0.5 rounded-full border px-1.5 py-0.5 text-[9px] font-bold tracking-wider uppercase",
                    user.role === "ceo"
                      ? "bg-danger-500/10 text-danger-300 border-danger-500/20"
                      : user.role === "admin"
                        ? "bg-warning-500/10 text-warning-300 border-warning-500/20"
                        : "bg-brand-500/10 text-brand-300 border-brand-500/20",
                  )}
                >
                  <ShieldCheck weight="duotone" className="h-2.5 w-2.5" />
                  {user.role}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="mb-2 flex items-center justify-between gap-2 border-b border-white/5 pb-2">
              <span className="text-fg-muted font-mono text-[9px] font-bold tracking-wider uppercase">
                {tNav("language_switcher")}
              </span>
              <LanguageSwitcher className="h-8" />
            </div>
            <div className="flex items-center justify-between gap-2">
              <Link
                href="/"
                className="text-fg-muted hover:bg-bg-tertiary/60 hover:text-fg-primary flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition"
              >
                <Globe weight="duotone" className="h-3.5 w-3.5" />
                {tNav("home")}
              </Link>
            </div>
            <form action="/api/auth/signout" method="post">
              <button
                type="submit"
                className="text-danger-400 hover:bg-danger-500/10 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition"
              >
                <SignOut weight="duotone" className="h-3.5 w-3.5" />
                {tAuth("signOut") ?? "Çıkış Yap"}
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Overlay background on mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
        />
      )}
    </>
  );
}
