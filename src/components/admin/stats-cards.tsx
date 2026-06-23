"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import {
  Users,
  FileText,
  ShieldCheck,
  AlertTriangle,
  TrendingUp,
  Clock,
  ShieldAlert,
  Server,
} from "lucide-react";

export interface AdminStats {
  total: number;
  pending: number;
  published: number;
  taken_down: number;
  users: number;
  providers: number;
  takedown_requests: number;
  recent_24h: number;
}

export function StatsCards({ stats }: { stats: AdminStats }) {
  const t = useTranslations("admin");
  const cards = [
    {
      icon: <FileText className="h-4 w-4" />,
      label: t("stats_total"),
      value: stats.total,
      color: "text-brand-300",
      gradient: "from-brand-500 to-transparent",
      glow: "drop-shadow-[0_0_8px_rgba(168,85,247,0.4)]",
    },
    {
      icon: <AlertTriangle className="h-4 w-4" />,
      label: t("stats_pending"),
      value: stats.pending,
      color: "text-amber-400",
      gradient: "from-amber-500 to-transparent",
      glow: "drop-shadow-[0_0_8px_rgba(245,158,11,0.4)]",
      badge: stats.pending > 0 ? `${stats.pending}` : undefined,
    },
    {
      icon: <ShieldCheck className="h-4 w-4" />,
      label: t("stats_published"),
      value: stats.published,
      color: "text-cyan-400",
      gradient: "from-cyan-500 to-transparent",
      glow: "drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]",
    },
    {
      icon: <Users className="h-4 w-4" />,
      label: t("stats_users"),
      value: stats.users,
      color: "text-brand-300",
      gradient: "from-brand-500 to-transparent",
      glow: "drop-shadow-[0_0_8px_rgba(168,85,247,0.4)]",
    },
    {
      icon: <ShieldAlert className="h-4 w-4" />,
      label: t("stats_takedown_requests"),
      value: stats.takedown_requests,
      color: "text-rose-400",
      gradient: "from-rose-500 to-transparent",
      glow: "drop-shadow-[0_0_8px_rgba(244,63,94,0.4)]",
    },
    {
      icon: <TrendingUp className="h-4 w-4" />,
      label: t("stats_24h"),
      value: stats.recent_24h,
      color: "text-cyan-400",
      gradient: "from-cyan-500 to-transparent",
      glow: "drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]",
    },
    {
      icon: <Server className="h-4 w-4" />,
      label: t("stats_providers"),
      value: stats.providers,
      color: "text-brand-300",
      gradient: "from-brand-500 to-transparent",
      glow: "drop-shadow-[0_0_8px_rgba(168,85,247,0.4)]",
    },
    {
      icon: <Clock className="h-4 w-4" />,
      label: t("stats_takedown"),
      value: stats.taken_down,
      color: "text-fg-muted",
      gradient: "from-neutral-500 to-transparent",
      glow: "",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-4">
      {cards.map((c) => (
        <div
          key={c.label}
          className="group relative flex flex-col overflow-hidden rounded-lg border border-white/10 bg-neutral-900/60 p-4 shadow-md backdrop-blur-xl transition-all duration-300 hover:border-white/20"
        >
          <div
            className={`absolute top-0 left-0 h-0.5 w-full bg-gradient-to-r ${c.gradient} opacity-40 transition-opacity group-hover:opacity-100`}
          />
          <div className="flex items-center justify-between">
            <div
              className={`inline-flex h-8 w-8 items-center justify-center rounded-md border border-white/10 bg-white/5 ${c.color} ${c.glow}`}
            >
              {c.icon}
            </div>
            {c.badge && (
              <span className="inline-flex h-5 min-w-5 animate-pulse items-center justify-center rounded-full border border-amber-500/30 bg-amber-500/20 px-1.5 text-[10px] font-bold text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.25)]">
                {c.badge}
              </span>
            )}
          </div>
          <p className="mt-3 font-mono text-2xl font-extrabold tracking-tight text-white">
            {c.value.toLocaleString()}
          </p>
          <p className="text-fg-muted mt-1 font-sans text-xs">{c.label}</p>
        </div>
      ))}
    </div>
  );
}
