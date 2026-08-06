"use client";

import { Server, Activity, Clock, ShieldCheck } from "lucide-react";
import type { VendorPortalData } from "@/actions/admin/vendor-portal";
import { VendorSlaCard } from "./vendor-sla-card";
import { VendorSlaCharts } from "./vendor-sla-charts";
import { VendorIncidentHistory } from "./vendor-incident-history";
import { useTranslations } from "next-intl";

interface VendorPortalDashboardProps {
  data: VendorPortalData;
}

export function VendorPortalDashboard({ data }: VendorPortalDashboardProps) {
  const t = useTranslations("admin");

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-white/10 bg-zinc-900/40 p-6 shadow-2xl backdrop-blur-xl md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="flex items-center gap-3 text-3xl font-black tracking-tight text-white">
              <Server className="text-brand-400 h-8 w-8" />
              {t("vendor_portal_title") || "AI Vendor SLA & Trust Portal"}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-zinc-400">
              {t("vendor_portal_subtitle") ||
                "Monitor AI model provider SLA performance, response times, incident history, and automated trust score rankings."}
            </p>
          </div>
          <div className="border-brand-500/30 bg-brand-500/10 text-brand-300 inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-xs font-bold">
            <Activity className="h-4 w-4 animate-pulse" />
            Beta Release v1.0
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 border-t border-white/10 pt-6 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>{t("vendor_sla_uptime") || "Global SLA Uptime"}</span>
            </div>
            <p className="mt-2 font-mono text-3xl font-black text-emerald-400">
              {data.overallUptimeSla}%
            </p>
          </div>

          <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400">
              <Clock className="h-4 w-4 text-amber-400" />
              <span>{t("vendor_avg_latency") || "Avg Response Latency"}</span>
            </div>
            <p className="mt-2 font-mono text-3xl font-black text-white">
              {data.averageLatencyMs} <span className="text-base text-zinc-500">ms</span>
            </p>
          </div>

          <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400">
              <Server className="text-brand-400 h-4 w-4" />
              <span>Active Providers Monitored</span>
            </div>
            <p className="text-brand-300 mt-2 font-mono text-3xl font-black">
              {data.totalActiveVendors}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="px-1 text-xl font-bold text-white">Top Vendor Rankings & SLA</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data.vendors.map((vendor) => (
            <VendorSlaCard key={vendor.id} vendor={vendor} />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <VendorSlaCharts data={data.chartData} />
        <VendorIncidentHistory incidents={data.incidents} />
      </div>
    </div>
  );
}
