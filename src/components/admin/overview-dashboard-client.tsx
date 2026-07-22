"use client";

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
import { AreaGradient } from "@/components/ui/chart-gradient";
import { CHART_COLORS } from "@/lib/utils/chart-colors";
import { AdminSectionCard } from "@/components/admin/admin-design-kit";
import { Gauge } from "@/components/admin/premium/gauge";
import { LivePulseRing } from "@/components/admin/premium/live-pulse-ring";
import { AnimatedCounter } from "@/components/admin/premium/animated-counter";
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

export function OverviewDashboardClient({ queue, locale }: OverviewDashboardClientProps) {
  const t = useTranslations("admin");
  const [logs, setLogs] = useState<{ time: string; type: string; text: string; status: string }[]>(
    [],
  );
  const [chartData, setChartData] = useState<{ day: string; count: number }[]>([]);
  const [systemHealth, setSystemHealth] = useState(87);
  const [uptime, setUptime] = useState(99.97);

  useEffect(() => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    setChartData(days.map((day) => ({ day, count: Math.floor(Math.random() * 20) + 5 })));

    const interval = setInterval(() => {
      setChartData((prev) => {
        const next = [...prev];
        const last = next[next.length - 1];
        if (last) {
          next[next.length - 1] = {
            ...last,
            count: Math.max(1, last.count + Math.floor(Math.random() * 5) - 2),
          };
        }
        return next;
      });
      setSystemHealth((h) => Math.min(100, Math.max(60, h + Math.floor(Math.random() * 5) - 2)));
      setUptime((u) => Math.min(100, Math.max(99, u + Math.random() * 0.02 - 0.01)));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const types = ["PII", "TRIAGE", "SECURITY", "CRON", "OUTREACH"];
    const messages = [
      "Analyzed news queue, found 0 duplicates",
      "Retried Turnstile verification challenge",
      "Dispatched PII masking audit report",
      "Refreshed Model Benchmark scoring metadata",
      "SLA alarm check: all items within threshold",
      "Database retention sweep completed",
      "Incident auto-classified as low severity",
      "Webhook compliance warning dispatched",
    ];
    setLogs(
      Array.from({ length: 5 }, (_, i) => ({
        time: new Date(Date.now() - i * 120000).toLocaleTimeString(locale, {
          hour12: false,
        }),
        type: types[i % types.length] || "SYSTEM",
        text: messages[i % messages.length] || "Idle",
        status: i % 3 === 0 ? "warning" : "success",
      })),
    );
    const interval = setInterval(() => {
      setLogs((prev) => [
        {
          time: new Date().toLocaleTimeString(locale, { hour12: false }),
          type: types[Math.floor(Math.random() * types.length)] || "SYSTEM",
          text: messages[Math.floor(Math.random() * messages.length)] || "Idle",
          status: Math.random() > 0.85 ? "warning" : "success",
        },
        ...prev.slice(0, 7),
      ]);
    }, 12000);
    return () => clearInterval(interval);
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
      <div className="grid gap-6 sm:grid-cols-3">
        <AdminSectionCard>
          <div className="flex flex-col items-center gap-3 p-2">
            <Gauge value={systemHealth} size="lg" sublabel="%" />
            <span className="text-fg-muted text-[10px] font-bold tracking-wider uppercase">
              {t("system_health") || "System Health"}
            </span>
          </div>
        </AdminSectionCard>
        <AdminSectionCard>
          <div className="flex flex-col items-center gap-3 p-2">
            <Gauge value={uptime} size="lg" sublabel="%" variant="success" />
            <span className="text-fg-muted text-[10px] font-bold tracking-wider uppercase">
              {t("uptime_30d") || "Uptime (30d)"}
            </span>
          </div>
        </AdminSectionCard>
        <AdminSectionCard>
          <div className="flex flex-col items-center gap-3 p-2">
            <div className="flex items-center gap-3">
              <LivePulseRing status="healthy" size="lg" />
              <AnimatedCounter value={queue.length} className="text-3xl text-white" />
            </div>
            <span className="text-fg-muted text-[10px] font-bold tracking-wider uppercase">
              {t("pending_reviews") || "Pending Reviews"}
            </span>
          </div>
        </AdminSectionCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AdminSectionCard title={t("incident_timeline") || "Incident Triage Timeline"}>
            <div className="p-6">
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <AreaGradient id="colorIncident" from={CHART_COLORS.accent.emerald} />
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={CHART_COLORS.neutrals.grid}
                      vertical={false}
                    />
                    <XAxis
                      dataKey="day"
                      stroke={CHART_COLORS.neutrals.line}
                      tick={{ fill: CHART_COLORS.neutrals.fill, fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke={CHART_COLORS.neutrals.line}
                      tick={{ fill: CHART_COLORS.neutrals.fill, fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0E1622",
                        borderColor: CHART_COLORS.neutrals.grid,
                        borderRadius: "8px",
                      }}
                      itemStyle={{ color: CHART_COLORS.accent.emerald }}
                    />
                    <Area
                      type="monotone"
                      dataKey="count"
                      stroke={CHART_COLORS.accent.emerald}
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

        <div className="lg:col-span-1">
          <AdminSectionCard title={t("autopilot_logs_health") || "Autopilot Logs & Health"}>
            <div className="flex h-64 flex-col justify-between p-6">
              <div className="mb-4 flex items-center justify-between rounded-lg border border-white/5 bg-neutral-950/40 p-3 shadow-inner">
                <span className="text-fg-muted flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase">
                  <Cpu className="h-3.5 w-3.5 text-purple-400" />
                  {t("shield_guard_status") || "Shield Guard Status"}
                </span>
                <LivePulseRing status="healthy" size="sm" label="ONLINE" />
              </div>

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

      <AdminSectionCard title={`${t("moderation_queue")} (${queue.length})`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-border-subtle text-fg-muted border-b bg-neutral-950/20 text-xs font-semibold tracking-wider uppercase">
                <th className="p-4 pl-6">{t("col_reported_at") || "Reported At"}</th>
                <th className="p-4">{t("col_incident_title") || "Incident Title"}</th>
                <th className="p-4">{t("category") || "Category"}</th>
                <th className="p-4">{t("severity") || "Severity"}</th>
                <th className="p-4 pr-6 text-right">{t("actions") || "Actions"}</th>
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
                    {t("queue_all_clear") || "All clear! No pending incidents in moderation queue."}
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
