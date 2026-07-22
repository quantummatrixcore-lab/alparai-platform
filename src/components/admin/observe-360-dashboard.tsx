"use client";

import React from "react";
import { Activity, Globe } from "lucide-react";
import {
  SupabaseIcon,
  VercelIcon,
  UpstashIcon,
  OpenRouterIcon,
  HuggingFaceIcon,
} from "@/components/ui/brand-icons";
import { Gauge } from "@/components/admin/premium/gauge";
import { LivePulseRing } from "@/components/admin/premium/live-pulse-ring";

export function Observe360Dashboard() {
  return (
    <div className="border-brand-500/20 to-brand-950/30 mb-8 rounded-2xl border bg-gradient-to-br from-zinc-950 via-zinc-900 p-6 shadow-2xl backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center space-x-3">
          <LivePulseRing status="healthy" />
          <div>
            <h2 className="flex items-center gap-2 text-lg font-bold tracking-tight text-white">
              <span>360° Observe Center</span>
              <span className="border-brand-500/30 bg-brand-500/20 text-brand-300 rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                LIVE TELEMETRY
              </span>
            </h2>
            <p className="text-xs text-zinc-400">
              Aggregated cross-domain signals across Incidents, SLOs, Security, GEO & Infrastructure
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-zinc-300">
            <SupabaseIcon size={16} />
            <span>
              Supabase RLS: <strong className="text-emerald-400">Hardened (P0)</strong>
            </span>
          </div>
          <div className="flex items-center space-x-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-zinc-300">
            <VercelIcon size={14} />
            <span>
              Vercel Edge: <strong className="text-emerald-400">99.99%</strong>
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="hover:border-brand-500/30 rounded-xl border border-white/5 bg-white/5 p-4 transition-all">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>SLO / Health</span>
            <Activity className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-white">99.97%</span>
            <span className="text-xs font-bold text-emerald-400">NOMINAL</span>
          </div>
          <div className="mt-3">
            <Gauge value={97} label="SLO Margin" variant="success" />
          </div>
        </div>

        <div className="hover:border-brand-500/30 rounded-xl border border-white/5 bg-white/5 p-4 transition-all">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>GEO Engine Citations</span>
            <Globe className="h-4 w-4 text-sky-400" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-white">100%</span>
            <span className="text-xs font-bold text-sky-400">OPTIMIZED</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-zinc-400">
            <span>LLMs.txt & ClaimReview</span>
            <span className="font-mono text-emerald-400">Active</span>
          </div>
        </div>

        <div className="hover:border-brand-500/30 rounded-xl border border-white/5 bg-white/5 p-4 transition-all">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Rate Limiting & Auth</span>
            <UpstashIcon size={14} />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-white">60 req/m</span>
            <span className="text-xs font-bold text-amber-400">ENFORCED</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-zinc-400">
            <span>Upstash Redis Gate</span>
            <span className="font-mono text-emerald-400">Active</span>
          </div>
        </div>

        <div className="hover:border-brand-500/30 rounded-xl border border-white/5 bg-white/5 p-4 transition-all">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>AI Gateway Providers</span>
            <OpenRouterIcon size={14} />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-white">3 Active</span>
            <span className="text-xs font-bold text-emerald-400">ONLINE</span>
          </div>
          <div className="mt-3 flex items-center space-x-2">
            <HuggingFaceIcon size={14} />
            <span className="text-xs text-zinc-400">HuggingFace Fallback Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
}
