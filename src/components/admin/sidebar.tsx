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
  X,
  CaretDown,
  CaretRight,
  Brain,
  Folder,
  Gear,
  Bank,
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
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    oversight: true,
    ecosystem: true,
    operations: true,
    community: true,
    strategy: true,
    finance: true,
    settings: true,
  });

  const toggleGroup = (group: string) => {
    setExpandedGroups((prev) => ({ ...prev, [group]: !prev[group] }));
  };

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
            label: t("investors_title") || "Investor Applications",
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

  const financeItems = [
    {
      href: "/admin/finance",
      label: t("finance_dashboard") || "Finance & FinOps",
      icon: Bank,
      active: pathname.startsWith("/admin/finance"),
    },
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
      label: t("strategy_swot") || "SWOT",
      icon: GridFour,
      active: pathname === "/admin/strategy/swot",
    },
    {
      href: "/admin/strategy/risks",
      label: t("strategy_risks") || "Risks",
      icon: ShieldCheck,
      active: pathname === "/admin/strategy/risks",
    },
    {
      href: "/admin/strategy/state-support",
      label: t("strategy_state_support") || "Devlet Destekleri",
      icon: Bank,
      active: pathname.startsWith("/admin/strategy/state-support"),
    },
  ];

  const renderNavGroup = (
    id: string,
    title: string,
    GroupIcon: React.ComponentType<{
      weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone";
      className?: string;
    }>,
    groupItems: typeof oversightItems,
  ) => {
    const isExpanded = expandedGroups[id];
    return (
      <div className="mt-4 border-b border-white/5 pb-4 last:border-0 last:pb-0">
        <button
          onClick={() => toggleGroup(id)}
          className="group text-fg-secondary hover:text-fg-primary flex w-full items-center justify-between px-4 py-2 transition-colors duration-200"
        >
          <div className="flex items-center gap-2.5">
            <GroupIcon
              weight="duotone"
              className="text-brand-400 group-hover:text-brand-300 h-4.5 w-4.5 drop-shadow-[0_0_8px_rgba(168,85,247,0.3)] transition-colors duration-200"
            />
            <span className="text-fg-primary text-[10px] font-black tracking-wider uppercase">
              {title}
            </span>
          </div>
          {isExpanded ? (
            <CaretDown
              weight="bold"
              className="text-fg-muted group-hover:text-fg-primary h-3.5 w-3.5 transition-colors duration-200"
            />
          ) : (
            <CaretRight
              weight="bold"
              className="text-fg-muted group-hover:text-fg-primary h-3.5 w-3.5 transition-colors duration-200"
            />
          )}
        </button>

        {isExpanded && (
          <div className="mt-2 space-y-1.5 px-2">
            {groupItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
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
        )}
      </div>
    );
  };

  return (
    <>
      {/* Top Header Bar */}
      <header className="bg-bg-secondary/40 fixed inset-x-0 top-0 z-30 flex h-16 items-center justify-between border-b border-white/5 px-6 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsOpen(true)}
            className="text-fg-secondary hover:text-fg-primary rounded-xl p-2 transition hover:bg-white/5"
          >
            <List weight="duotone" className="h-6 w-6" />
          </button>
          <Link href="/admin" className="flex items-center gap-3">
            <Wordmark className="text-xl" />
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <LanguageSwitcher className="h-8" />
          {/* User Profile Avatar */}
          <div className="border-brand-500/20 relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border shadow-[0_0_8px_rgba(168,85,247,0.15)]">
            {user.avatarUrl ? (
              <Image
                src={user.avatarUrl}
                alt=""
                width={36}
                height={36}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-brand-300 text-xs font-bold">
                {getInitials(user.fullName ?? user.email)}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={cn(
          "bg-bg-secondary/95 fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-white/5 shadow-[4px_0_24px_rgba(0,0,0,0.5)] backdrop-blur-2xl transition-transform duration-500",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/5 px-6">
          <Link href="/admin" className="flex items-center gap-3" onClick={() => setIsOpen(false)}>
            <Wordmark className="text-xl" />
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            className="text-fg-muted rounded-xl p-1.5 transition hover:bg-white/5 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="scrollbar-hide flex-1 overflow-y-auto py-4">
          {renderNavGroup(
            "oversight",
            t("nav_group_oversight") || "360° Oversight",
            ChartBar,
            oversightItems,
          )}
          {renderNavGroup(
            "ecosystem",
            t("nav_group_ecosystem") || "AI Ecosystem",
            Brain,
            ecosystemItems,
          )}
          {renderNavGroup(
            "operations",
            t("nav_group_operations") || "Operations",
            Folder,
            operationsItems,
          )}
          {renderNavGroup(
            "community",
            t("nav_group_community") || "Community",
            Users,
            communityItems,
          )}
          {hasStrategyAccess &&
            renderNavGroup("strategy", t("strategy_header") || "Strategy", Compass, strategyItems)}
          {(user.role === "ceo" || user.role === "admin") &&
            renderNavGroup(
              "finance",
              t("nav_group_finance") || "Finance & FinOps",
              Bank,
              financeItems,
            )}
          {renderNavGroup("settings", t("nav_group_settings") || "Settings", Gear, settingsItems)}
        </nav>

        {/* User Profile Footer */}
        <div className="border-border-subtle bg-bg-secondary/60 border-t p-4 backdrop-blur-md">
          <div className="flex items-center justify-between gap-2">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="text-fg-muted hover:bg-bg-tertiary/60 hover:text-fg-primary flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition"
            >
              <Globe weight="duotone" className="h-3.5 w-3.5" />
              {tNav("home")}
            </Link>
            <form action="/api/auth/signout" method="post">
              <button
                type="submit"
                className="text-danger-400 hover:bg-danger-500/10 flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition"
              >
                <SignOut weight="duotone" className="h-3.5 w-3.5" />
                {tAuth("signOut") ?? "Çıkış Yap"}
              </button>
            </form>
          </div>
        </div>
      </aside>
    </>
  );
}
