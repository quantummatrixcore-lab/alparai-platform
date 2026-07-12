"use client";

import React from "react";
import { SystemHealthChart } from "./system-health-chart";
import { Wallet, ShieldCheck, Cpu, ChartLineUp } from "@phosphor-icons/react/dist/ssr";

export function System360Overview() {
  return (
    <div className="space-y-6">
      <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight text-white">
            <ShieldCheck weight="duotone" className="text-brand-400 h-6 w-6" />
            360° Command Center
          </h2>
          <p className="text-fg-muted mt-1 text-sm">
            Holistic view of system health, finance, and security.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Financial & Revenue Model Widget */}
        <div className="bg-bg-secondary/40 hover:border-brand-500/30 relative overflow-hidden rounded-2xl border border-white/5 p-6 shadow-lg backdrop-blur-xl transition-all duration-300">
          <div className="absolute -top-4 -right-4 rounded-full bg-emerald-500/10 p-6 blur-2xl"></div>
          <div className="relative z-10 flex items-center justify-between">
            <h3 className="text-fg-secondary font-semibold">B2B Revenue (MRR)</h3>
            <Wallet weight="duotone" className="h-5 w-5 text-emerald-400" />
          </div>
          <div className="relative z-10 mt-4 flex items-end gap-2">
            <span className="text-3xl font-bold tracking-tight text-white">$12,450</span>
            <span className="mb-1 font-mono text-xs font-semibold text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]">
              +14.2%
            </span>
          </div>
          <div className="text-fg-muted relative z-10 mt-2 text-xs">
            <span className="text-white/60">Active Subscriptions:</span> 48
          </div>
        </div>

        {/* API Cost & Budget Usage */}
        <div className="bg-bg-secondary/40 relative overflow-hidden rounded-2xl border border-white/5 p-6 shadow-lg backdrop-blur-xl transition-all duration-300 hover:border-amber-500/30">
          <div className="absolute -top-4 -right-4 rounded-full bg-amber-500/10 p-6 blur-2xl"></div>
          <div className="relative z-10 flex items-center justify-between">
            <h3 className="text-fg-secondary font-semibold">API Operations Cost</h3>
            <ChartLineUp weight="duotone" className="h-5 w-5 text-amber-400" />
          </div>
          <div className="relative z-10 mt-4 flex items-end gap-2">
            <span className="text-3xl font-bold tracking-tight text-white">$342.50</span>
            <span className="mb-1 font-mono text-xs font-semibold text-amber-400">/ mo</span>
          </div>
          <div className="relative z-10 mt-2 flex items-center gap-2">
            <div className="bg-bg-tertiary h-1.5 w-full overflow-hidden rounded-full">
              <div className="h-full w-[45%] rounded-full bg-amber-500"></div>
            </div>
            <span className="text-fg-muted text-xs">45%</span>
          </div>
        </div>

        {/* Cross-Audit Engine Status */}
        <div className="bg-bg-secondary/40 hover:border-brand-500/30 relative overflow-hidden rounded-2xl border border-white/5 p-6 shadow-lg backdrop-blur-xl transition-all duration-300">
          <div className="bg-brand-500/10 absolute -top-4 -right-4 rounded-full p-6 blur-2xl"></div>
          <div className="relative z-10 flex items-center justify-between">
            <h3 className="text-fg-secondary font-semibold">Cross-Audit Engine</h3>
            <ShieldCheck weight="duotone" className="text-brand-400 h-5 w-5" />
          </div>
          <div className="relative z-10 mt-4 flex items-end gap-2">
            <span className="text-3xl font-bold tracking-tight text-white">Active</span>
            <span className="mb-1 flex h-2 w-2 animate-pulse rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,1)]"></span>
          </div>
          <div className="text-fg-muted relative z-10 mt-2 text-xs">
            <span className="text-white/60">Race Conditions:</span> 0 detected
          </div>
        </div>

        {/* Compute & Inference Load */}
        <div className="bg-bg-secondary/40 relative overflow-hidden rounded-2xl border border-white/5 p-6 shadow-lg backdrop-blur-xl transition-all duration-300 hover:border-cyan-500/30">
          <div className="absolute -top-4 -right-4 rounded-full bg-cyan-500/10 p-6 blur-2xl"></div>
          <div className="relative z-10 flex items-center justify-between">
            <h3 className="text-fg-secondary font-semibold">Inference Load</h3>
            <Cpu weight="duotone" className="h-5 w-5 text-cyan-400" />
          </div>
          <div className="relative z-10 mt-4 flex items-end gap-2">
            <span className="text-3xl font-bold tracking-tight text-white">4.2</span>
            <span className="text-fg-muted mb-1 font-mono text-xs font-semibold">req / sec</span>
          </div>
          <div className="text-fg-muted relative z-10 mt-2 flex items-center gap-2 text-xs">
            <span className="font-medium text-cyan-400">99.98%</span> uptime
          </div>
        </div>
      </div>

      <SystemHealthChart />
    </div>
  );
}
