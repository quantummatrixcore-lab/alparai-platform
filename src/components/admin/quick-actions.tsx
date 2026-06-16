"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { FileText, Users, ShieldAlert, Settings, Activity } from "lucide-react";

export function QuickActions({ locale }: { locale: string }) {
  const t = useTranslations("admin");

  const actions = [
    {
      href: `/${locale}/incidents`,
      icon: <FileText className="h-4 w-4" />,
      label: t("view_all_incidents"),
      color: "text-brand-400 hover:text-brand-300",
    },
    {
      href: `/${locale}/admin/users`,
      icon: <Users className="h-4 w-4" />,
      label: t("manage_users"),
      color: "text-brand-400 hover:text-brand-300",
    },
    {
      href: `/${locale}/admin/takedown`,
      icon: <ShieldAlert className="h-4 w-4" />,
      label: t("review_takedowns"),
      color: "text-warning-500 hover:text-warning-400",
    },
    {
      href: `/${locale}/admin/autopilot`,
      icon: <Settings className="h-4 w-4" />,
      label: t("autopilot_settings"),
      color: "text-brand-400 hover:text-brand-300",
    },
  ];

  return (
    <Card variant="glass">
      <CardHeader>
        <CardTitle className="inline-flex items-center gap-2 text-base">
          <Activity className="text-brand-400 h-4 w-4" />
          {t("quick_actions")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        {actions.map((action) => (
          <Link
            key={action.href}
            href={action.href as never}
            className={`hover:bg-bg-tertiary flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${action.color}`}
          >
            {action.icon}
            {action.label}
          </Link>
        ))}
        <div className="border-border-subtle mt-4 border-t pt-3">
          <div className="text-success-500 flex items-center gap-2 text-xs font-semibold tracking-wider uppercase">
            <span className="relative flex h-2 w-2">
              <span className="bg-success-400 absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"></span>
              <span className="bg-success-500 relative inline-flex h-2 w-2 rounded-full"></span>
            </span>
            {t("all_operational")}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
