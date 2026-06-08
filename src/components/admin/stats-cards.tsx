"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
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
      color: "text-brand-400",
      bg: "bg-brand-500/10",
    },
    {
      icon: <AlertTriangle className="h-4 w-4" />,
      label: t("stats_pending"),
      value: stats.pending,
      color: "text-warning-500",
      bg: "bg-warning-500/10",
      badge: stats.pending > 0 ? `${stats.pending}` : undefined,
    },
    {
      icon: <ShieldCheck className="h-4 w-4" />,
      label: t("stats_published"),
      value: stats.published,
      color: "text-success-500",
      bg: "bg-success-500/10",
    },
    {
      icon: <Users className="h-4 w-4" />,
      label: t("stats_users"),
      value: stats.users,
      color: "text-brand-400",
      bg: "bg-brand-500/10",
    },
    {
      icon: <ShieldAlert className="h-4 w-4" />,
      label: t("stats_takedown_requests"),
      value: stats.takedown_requests,
      color: "text-danger-500",
      bg: "bg-danger-500/10",
    },
    {
      icon: <TrendingUp className="h-4 w-4" />,
      label: t("stats_24h"),
      value: stats.recent_24h,
      color: "text-accent-400",
      bg: "bg-accent-500/10",
    },
    {
      icon: <Server className="h-4 w-4" />,
      label: t("stats_providers"),
      value: stats.providers,
      color: "text-brand-400",
      bg: "bg-brand-500/10",
    },
    {
      icon: <Clock className="h-4 w-4" />,
      label: t("stats_takedown"),
      value: stats.taken_down,
      color: "text-fg-muted",
      bg: "bg-bg-tertiary",
    },
  ];
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-4">
      {cards.map((c) => (
        <Card key={c.label} className="relative overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div
                className={`inline-flex h-8 w-8 items-center justify-center rounded-md ${c.bg} ${c.color}`}
              >
                {c.icon}
              </div>
              {c.badge && (
                <span className="bg-warning-500/20 text-warning-500 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold">
                  {c.badge}
                </span>
              )}
            </div>
            <p className="text-fg-primary mt-2 text-2xl font-bold">{c.value.toLocaleString()}</p>
            <p className="text-fg-muted text-xs">{c.label}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
