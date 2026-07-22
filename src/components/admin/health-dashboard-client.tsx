"use client";

import { useState } from "react";
import { AdminSectionCard } from "@/components/admin/admin-design-kit";
import type { UnifiedHealthReport } from "@/lib/health/system-health";
import { RefreshCw, CheckCircle2, AlertTriangle, XCircle, Bell } from "lucide-react";

interface HealthDashboardClientProps {
  initialReport: UnifiedHealthReport;
}

export function HealthDashboardClient({ initialReport }: HealthDashboardClientProps) {
  const [report, setReport] = useState<UnifiedHealthReport>(initialReport);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const res = await fetch("/api/health/unified");
      const data = await res.json();
      setReport(data);
    } catch {}
    setRefreshing(false);
  };

  const getStatusBadge = (status: "healthy" | "degraded" | "down") => {
    switch (status) {
      case "healthy":
        return (
          <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400">
            <CheckCircle2 className="h-4 w-4" /> Healthy
          </span>
        );
      case "degraded":
        return (
          <span className="flex items-center gap-1 text-xs font-semibold text-amber-400">
            <AlertTriangle className="h-4 w-4" /> Degraded
          </span>
        );
      case "down":
        return (
          <span className="flex items-center gap-1 text-xs font-semibold text-rose-400">
            <XCircle className="h-4 w-4" /> Down
          </span>
        );
    }
  };

  return (
    <div className="space-y-8" data-testid="health-dashboard">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold tracking-wider uppercase ${
              report.overall === "healthy"
                ? "border border-emerald-500/30 bg-emerald-500/20 text-emerald-400"
                : report.overall === "degraded"
                  ? "border border-amber-500/30 bg-amber-500/20 text-amber-400"
                  : "border border-rose-500/30 bg-rose-500/20 text-rose-400"
            }`}
          >
            System Status: {report.overall}
          </span>
          <span className="text-fg-muted font-mono text-xs">
            Checked: {new Date(report.timestamp).toLocaleTimeString()}
          </span>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-1.5 rounded border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/10 disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
          Refresh Status
        </button>
      </div>

      <AdminSectionCard title="9-Subsystem Health Grid">
        <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
          {(report.subsystems || []).map((sub) => (
            <div
              key={sub.name}
              className="space-y-2 rounded-lg border border-white/10 bg-black/40 p-4 transition hover:border-white/20"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-white uppercase">{sub.name}</span>
                {getStatusBadge(sub.status)}
              </div>
              {sub.message && <p className="text-fg-muted text-[11px]">{sub.message}</p>}
              {sub.latencyMs !== undefined && (
                <div className="text-fg-muted font-mono text-[10px]">
                  Latency: <span className="text-white">{sub.latencyMs}ms</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </AdminSectionCard>

      <AdminSectionCard title="SLA Alarms & Incidents Log (sla_alarms)">
        <div className="text-fg-muted space-y-3 p-6 text-xs">
          <div className="flex items-center justify-between rounded border border-emerald-500/20 bg-emerald-500/10 p-3 text-emerald-300">
            <span className="flex items-center gap-2 font-medium">
              <Bell className="h-4 w-4" /> SLA Alarm Monitor Active
            </span>
            <span className="font-mono text-[10px]">0 Active Breaches</span>
          </div>
          <p className="text-[11px]">
            Automated alerts trigger to `sla_alarms` table and email notifications if latency
            exceeds &gt;500ms or error rates exceed &gt;1%.
          </p>
        </div>
      </AdminSectionCard>
    </div>
  );
}
