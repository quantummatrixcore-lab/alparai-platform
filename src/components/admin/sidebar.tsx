"use client";

import * as React from "react";
import { useState } from "react";
import { Link, usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import {
  LayoutDashboard,
  ShieldAlert,
  FileDown,
  Users,
  Cpu,
  Zap,
  BarChart3,
  Clock,
  LogOut,
  Globe,
  Menu,
  X,
  ShieldCheck,
  Key,
  Share2,
} from "lucide-react";
import { cn, getInitials } from "@/lib/utils";
import Image from "next/image";
import { Wordmark } from "../layout/wordmark";
import { LanguageSwitcher } from "../layout/language-switcher";

interface SidebarUserShape {
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  role: "user" | "moderator" | "admin" | "ceo";
}

export function AdminSidebar({ user }: { user: SidebarUserShape }) {
  const t = useTranslations("admin");
  const tAuth = useTranslations("auth");
  const tNav = useTranslations("nav");
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    {
      href: "/admin",
      label: t("dashboard"),
      icon: LayoutDashboard,
      active: pathname === "/admin",
    },
    {
      href: "/admin/moderation",
      label: t("moderation_queue"),
      icon: ShieldAlert,
      active: pathname.startsWith("/admin/moderation"),
    },
    {
      href: "/admin/takedown",
      label: t("stats_takedown_requests"),
      icon: FileDown,
      active: pathname.startsWith("/admin/takedown"),
    },
    {
      href: "/admin/users",
      label: t("users"),
      icon: Users,
      active: pathname.startsWith("/admin/users"),
    },
    {
      href: "/admin/providers",
      label: t("providers"),
      icon: Cpu,
      active: pathname.startsWith("/admin/providers"),
    },
    {
      href: "/admin/autopilot",
      label: t("autopilot"),
      icon: Zap,
      active: pathname.startsWith("/admin/autopilot"),
    },
    {
      href: "/admin/analysis",
      label: t("analytics"),
      icon: BarChart3,
      active: pathname.startsWith("/admin/analysis"),
    },
    {
      href: "/admin/social",
      label: t("social_media_hub") || "Social Media Hub",
      icon: Share2,
      active: pathname.startsWith("/admin/social"),
    },
    {
      href: "/admin/api-keys",
      label: t("api_keys"),
      icon: Key,
      active: pathname.startsWith("/admin/api-keys"),
    },
    {
      href: "/admin/audit",
      label: t("audit_log"),
      icon: Clock,
      active: pathname.startsWith("/admin/audit"),
    },
  ];

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="bg-bg-secondary/80 border-border-subtle fixed top-0 right-0 left-0 z-30 flex h-16 items-center justify-between border-b px-4 backdrop-blur-md md:hidden">
        <Link href="/" className="flex items-center">
          <Wordmark size="sm" />
        </Link>
        <div className="flex items-center gap-2">
          <LanguageSwitcher className="h-8" />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="bg-bg-tertiary border-border-strong text-fg-primary flex h-10 w-10 items-center justify-center rounded-lg border focus:outline-none"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Sidebar Container */}
      <aside
        className={cn(
          "bg-bg-secondary/95 border-border-subtle md:bg-bg-secondary/40 fixed top-0 bottom-0 left-0 z-40 flex w-64 flex-col border-r shadow-2xl transition-transform duration-300 md:sticky md:translate-x-0 md:backdrop-blur-md",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "pt-16 md:pt-0", // Add padding top only on mobile since top bar is present
        )}
      >
        {/* Brand / Logo */}
        <div className="border-border-subtle hidden h-16 items-center justify-between border-b px-6 md:flex">
          <Link href="/" className="flex items-center gap-2">
            <Wordmark size="sm" />
            <span className="bg-brand-500/10 text-brand-300 border-brand-500/20 rounded-md border px-1.5 py-0.5 text-[10px] font-bold tracking-wider uppercase">
              Admin
            </span>
          </Link>
        </div>

        {/* Scrollable Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300",
                  item.active
                    ? "bg-brand-500/15 text-brand-300 border-brand-500 border-l-2 shadow-[inset_0_0_12px_rgba(168,85,247,0.15)]"
                    : "text-fg-secondary hover:bg-bg-tertiary/40 hover:text-fg-primary",
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 transition-colors duration-300",
                    item.active ? "text-brand-400" : "text-fg-muted group-hover:text-fg-primary",
                  )}
                />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
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
                  <ShieldCheck className="h-2.5 w-2.5" />
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
                <Globe className="h-3.5 w-3.5" />
                {tNav("home")}
              </Link>
            </div>
            <form action="/api/auth/signout" method="post">
              <button
                type="submit"
                className="text-danger-400 hover:bg-danger-500/10 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition"
              >
                <LogOut className="h-3.5 w-3.5" />
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
