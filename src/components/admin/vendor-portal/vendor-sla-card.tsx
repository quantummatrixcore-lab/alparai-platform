"use client";

import { ShieldCheck, Activity, AlertTriangle, Zap, CheckCircle2 } from "lucide-react";
import type { VendorSlaMetric } from "@/actions/admin/vendor-portal";

interface VendorSlaCardProps {
  vendor: VendorSlaMetric;
}

export function VendorSlaCard({ vendor }: VendorSlaCardProps) {
  const getTierColor = (tier: string) => {
    switch (tier) {
      case "AAA":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
      case "AA":
        return "bg-cyan-500/10 text-cyan-400 border-cyan-500/30";
      case "A":
        return "bg-blue-500/10 text-blue-400 border-blue-500/30";
      default:
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/40 p-6 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:bg-zinc-900/60">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="group-hover:text-brand-300 text-xl font-bold text-white transition-colors">
              {vendor.providerName}
            </h3>
            <span
              className={`rounded-xl border px-2.5 py-1 text-xs font-black tracking-wide ${getTierColor(
                vendor.rankingTier,
              )}`}
            >
              {vendor.rankingTier}
            </span>
          </div>
          <p className="mt-1 font-mono text-xs text-zinc-400">slug: {vendor.providerSlug}</p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1 text-2xl font-black text-white">
            <ShieldCheck className="text-brand-400 inline-block h-5 w-5" />
            <span>{vendor.compositeScore.toFixed(1)}</span>
            <span className="text-xs font-normal text-zinc-500">/100</span>
          </div>
          <span className="text-[10px] font-semibold tracking-wider text-zinc-400 uppercase">
            Trust Score
          </span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 border-t border-white/5 pt-4 sm:grid-cols-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-zinc-400">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            <span>SLA Uptime</span>
          </div>
          <p className="mt-1 font-mono text-lg font-bold text-emerald-400">
            {vendor.slaUptimePercent}%
          </p>
        </div>

        <div>
          <div className="flex items-center gap-1.5 text-xs text-zinc-400">
            <Zap className="h-3.5 w-3.5 text-amber-400" />
            <span>Avg Latency</span>
          </div>
          <p className="mt-1 font-mono text-lg font-bold text-white">
            {vendor.avgResponseLatencyMs}ms
          </p>
        </div>

        <div>
          <div className="flex items-center gap-1.5 text-xs text-zinc-400">
            <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />
            <span>Penalty</span>
          </div>
          <p className="mt-1 font-mono text-lg font-bold text-rose-400">
            -{vendor.incidentPenalty.toFixed(1)}
          </p>
        </div>

        <div>
          <div className="flex items-center gap-1.5 text-xs text-zinc-400">
            <Activity className="h-3.5 w-3.5 text-cyan-400" />
            <span>Resp. Bonus</span>
          </div>
          <p className="mt-1 font-mono text-lg font-bold text-cyan-400">
            +{vendor.responseRateBonus.toFixed(1)}
          </p>
        </div>
      </div>
    </div>
  );
}
