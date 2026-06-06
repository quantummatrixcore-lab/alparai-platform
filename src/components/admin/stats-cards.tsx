"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { Users, FileText, ShieldCheck, AlertTriangle } from "lucide-react";

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
    { icon: <FileText className="h-4 w-4" />, label: t("stats_total"), value: stats.total, color: "text-brand-400" },
    { icon: <AlertTriangle className="h-4 w-4" />, label: t("stats_pending"), value: stats.pending, color: "text-warning-500" },
    { icon: <ShieldCheck className="h-4 w-4" />, label: t("stats_published"), value: stats.published, color: "text-success-500" },
    { icon: <Users className="h-4 w-4" />, label: t("stats_users"), value: stats.users, color: "text-brand-400" },
  ];
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {cards.map((c) => (
        <Card key={c.label}>
          <CardContent className="p-4">
            <div className={`mb-2 inline-flex h-8 w-8 items-center justify-center rounded-md bg-bg-tertiary ${c.color}`}>
              {c.icon}
            </div>
            <p className="text-2xl font-bold text-fg-primary">{c.value.toLocaleString()}</p>
            <p className="text-xs text-fg-muted">{c.label}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
