"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Cpu, ArrowRight, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AdminSectionCard } from "@/components/admin/admin-design-kit";
import Link from "next/link";

interface IncidentItem {
  id: string;
  title_masked: string | null;
  description_masked: string | null;
  severity: string;
  category: string;
  created_at: string;
  status: string;
}

interface OverviewDashboardClientProps {
  queue: IncidentItem[];
  locale: string;
}

const MOCK_CHART_DATA = [
  { day: "Mon", count: 12 },
  { day: "Tue", count: 19 },
  { day: "Wed", count: 15 },
  { day: "Thu", count: 28 },
  { day: "Fri", count: 22 },
  { day: "Sat", count: 14 },
  { day: "Sun", count: 20 },
];

const MOCK_SYSTEM_LOGS = [
  {
    time: "03:45:12",
    type: "PII",
    text: "Masked phone & email for incident report #INC-829",
    status: "success",
  },
  {
    time: "03:30:00",
    type: "CRON",
    text: "Executed database retention sweep, cleared 0 old entries",
    status: "success",
  },
  {
    time: "03:15:45",
    type: "TRIAGE",
    text: "Auto-classified report #INC-828 as 'low' severity",
    status: "info",
  },
  {
    time: "02:50:11",
    type: "SECURITY",
    text: "Successfully rotated Supabase API tokens on Vercel Engine",
    status: "warning",
  },
  {
    time: "02:10:05",
    type: "OUTREACH",
    text: "Dispatched 2 Slack webhook compliance warnings",
    status: "info",
  },
  {
    time: "01:30:22",
    type: "BILLING",
    text: "Stripe subscription webhooks synced successfully",
    status: "success",
  },
];

export function OverviewDashboardClient({ queue, locale }: OverviewDashboardClientProps) {
  const t = useTranslations("admin");
  const [logs, setLogs] = useState(MOCK_SYSTEM_LOGS);

  // Auto-refresh simulation for system logs feed
  useEffect(() => {
    const timer = setInterval(() => {
      const types = ["PII", "TRIAGE", "SECURITY", "CRON", "OUTREACH"];
      const messages = [
        "Analyzed news queue, found 0 duplicates",
        "Retried Turnstile verification challenge",
        "Dispatched PII masking audit report to moderator inbox",
        "Refreshed Model Benchmark scoring metadata",
        "SLA alarm check: all items within 4-hour threshold",
      ];
      const randomType = types[Math.floor(Math.random() * types.length)] || "SYSTEM";
      const randomMsg = messages[Math.floor(Math.random() * messages.length)] || "Idle";

      const newLog = {
        time: new Date().toLocaleTimeString(locale, { hour12: false }),
        type: randomType,
        text: randomMsg,
        status: Math.random() > 0.85 ? "warning" : "success",
      };

      setLogs((prev) => [newLog, ...prev.slice(0, 7)]);
    }, 12000);

    return () => clearInterval(timer);
  }, [locale]);

  const getSeverityBadgeVariant = (severity: string) => {
    switch (severity) {
      case "critical":
      case "high":
        return "danger";
      case "medium":
        return "warning";
      default:
        return "success";
    }
  };

  return (
    <div className="space-y-8">
      {/* Middle Row: Chart & Autopilot Log Feed */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Incident Area Chart */}
        <div className="lg:col-span-2">
          <AdminSectionCard title={t("incident_timeline") || "Incident Triage Timeline"}>
            <div className="p-6">
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={MOCK_CHART_DATA}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorIncident" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00FF88" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#00FF88" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.05)"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="day"
                      stroke="rgba(255,255,255,0.2)"
                      tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="rgba(255,255,255,0.2)"
                      tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0E1622",
                        borderColor: "rgba(255,255,255,0.1)",
                        borderRadius: "8px",
                      }}
                      itemStyle={{ color: "#00FF88" }}
                    />
                    <Area
                      type="monotone"
                      dataKey="count"
                      stroke="#00FF88"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorIncident)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </AdminSectionCard>
        </div>

        {/* Autopilot Status & System Logs */}
        <div className="lg:col-span-1">
          <AdminSectionCard title="Autopilot Logs & Health">
            <div className="flex h-64 flex-col justify-between p-6">
              {/* Autopilot status pill */}
              <div className="mb-4 flex items-center justify-between rounded-lg border border-white/5 bg-neutral-950/40 p-3 shadow-inner">
                <span className="text-fg-muted flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase">
                  <Cpu className="h-3.5 w-3.5 text-purple-400" />
                  Shield Guard Status
                </span>
                <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold tracking-widest text-emerald-400 uppercase">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                  </span>
                  ONLINE
                </div>
              </div>

              {/* Logs area */}
              <div className="text-fg-secondary flex-1 space-y-2.5 overflow-y-auto pr-1 font-mono text-[11px]">
                {logs.map((log, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 border-b border-white/[0.02] pb-1.5 last:border-0"
                  >
                    <span className="text-fg-muted shrink-0">{log.time}</span>
                    <span
                      className={`shrink-0 rounded px-1 text-[9px] font-semibold tracking-wider uppercase ${
                        log.status === "warning"
                          ? "border border-amber-500/20 bg-amber-500/10 text-amber-400"
                          : "border border-purple-500/20 bg-purple-500/10 text-purple-300"
                      }`}
                    >
                      {log.type}
                    </span>
                    <span className="text-fg-secondary truncate" title={log.text}>
                      {log.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </AdminSectionCard>
        </div>
      </div>

      {/* Bottom Row: Urgent Action Items List */}
      <AdminSectionCard title={`${t("moderation_queue")} (${queue.length})`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-border-subtle text-fg-muted border-b bg-neutral-950/20 text-xs font-semibold tracking-wider uppercase">
                <th className="p-4 pl-6">Reported At</th>
                <th className="p-4">Incident Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Severity</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {queue.map((row) => (
                <tr
                  key={row.id}
                  className="group transition-colors duration-150 hover:bg-white/[0.01]"
                >
                  <td className="text-fg-secondary p-4 pl-6 font-mono text-xs">
                    {new Date(row.created_at).toLocaleDateString(locale, {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="max-w-sm truncate p-4 font-medium text-white">
                    {row.title_masked || "Masked Incident Report"}
                  </td>
                  <td className="p-4">
                    <Badge variant="outline" className="text-[10px]">
                      {row.category}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <Badge variant={getSeverityBadgeVariant(row.severity)} dot>
                      {row.severity}
                    </Badge>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <Link href={`/${locale}/admin/moderation?id=${row.id}`}>
                      <Button size="sm" variant="outline" className="h-8 px-2.5 text-[11px]">
                        Triage
                        <ArrowRight className="ml-1 h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
              {queue.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-fg-muted p-12 text-center">
                    <CheckCircle className="mx-auto mb-3 h-8 w-8 text-emerald-500/30" />
                    All clear! No pending incidents in moderation queue.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </AdminSectionCard>
    </div>
  );
}
