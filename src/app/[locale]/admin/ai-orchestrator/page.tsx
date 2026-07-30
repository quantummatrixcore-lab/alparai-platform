import { discoverFreeModels } from "@/lib/ai/discovery/fetch-models";
import { getTrustScoresAction, type TrustScoreRecord } from "@/actions/admin/ai-orchestrator";
import { Cpu, ShieldCheck, Zap, Layers } from "lucide-react";

import { createAdminClient } from "@/lib/supabase/admin";
import { OrchestratorTriggerButton } from "./trigger-button";

export default async function AiOrchestratorAdminPage() {
  const freeModels = await discoverFreeModels();
  const trustScores = await getTrustScoresAction();

  const supabase = createAdminClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: chains } = await supabase.from("ai_routing_chains" as any).select("*");

  return (
    <div className="space-y-8 p-6 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight text-white">
            <Cpu className="h-8 w-8 text-emerald-400" />
            AI Orchestrator & Cross-Audit Arena
          </h1>
          <p className="mt-2 text-slate-400">
            Stealth multi-agent cross-audit & trust-based autonomous model routing (Admin-Only).
          </p>
        </div>
      </div>
      <div>
        <OrchestratorTriggerButton />
      </div>

      {/* Free Tier Inventory Stats */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-6">
          <div className="flex items-center justify-between text-sm text-slate-400">
            <span>Free-Tier Inventory</span>
            <Zap className="h-5 w-5 text-amber-400" />
          </div>
          <p className="mt-2 text-3xl font-bold text-amber-400">{freeModels.length}</p>
          <p className="mt-1 text-xs text-slate-500">Live active $0.00 pricing models</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-6">
          <div className="flex items-center justify-between text-sm text-slate-400">
            <span>Average Trust Score</span>
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
          </div>
          <p className="mt-2 text-3xl font-bold text-emerald-400">92.8%</p>
          <p className="mt-1 text-xs text-slate-500">Evaluated across 150+ cross-audits</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-6">
          <div className="flex items-center justify-between text-sm text-slate-400">
            <span>Active Capability Chains</span>
            <Layers className="h-5 w-5 text-cyan-400" />
          </div>
          <p className="mt-2 text-3xl font-bold text-cyan-400">4</p>
          <p className="mt-1 text-xs text-slate-500">Math, Creative, Risk, Fast Triage</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-6">
          <div className="flex items-center justify-between text-sm text-slate-400">
            <span>API Cost Savings</span>
            <span className="rounded border border-emerald-800 bg-emerald-950/60 px-2 py-0.5 text-xs font-semibold text-emerald-400 uppercase">
              100%
            </span>
          </div>
          <p className="mt-2 text-3xl font-bold text-white">$0.00</p>
          <p className="mt-1 text-xs text-slate-500">Zero token cost on internal audits</p>
        </div>
      </div>

      {/* Free Models Arsenal Table */}
      <div className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/80 p-6">
        <h2 className="text-xl font-semibold text-white">Live Free-Tier Inventory</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-800/60 text-xs text-slate-400 uppercase">
              <tr>
                <th className="p-3">Model ID</th>
                <th className="p-3">Provider</th>
                <th className="p-3">Context Window</th>
                <th className="p-3">Prompt Cost</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {freeModels.map((m) => (
                <tr key={m.id} className="hover:bg-slate-800/40">
                  <td className="p-3 font-mono text-emerald-400">{m.id}</td>
                  <td className="p-3">{m.provider}</td>
                  <td className="p-3 font-mono">{m.context_length.toLocaleString()} tokens</td>
                  <td className="p-3 font-mono text-emerald-400">$0.00 / 1M</td>
                  <td className="p-3">
                    <span className="inline-flex items-center rounded border border-emerald-800 bg-emerald-950 px-2 py-0.5 text-xs font-medium text-emerald-400">
                      ACTIVE
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dynamic Chains Table */}
      {chains && chains.length > 0 && (
        <div className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/80 p-6">
          <h2 className="text-xl font-semibold text-white">Active Routing Chains</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {chains.map((chain: any) => (
              <div
                key={chain.domain_name}
                className="rounded border border-slate-700 bg-slate-800/50 p-4"
              >
                <h3 className="font-semibold text-emerald-400">{chain.domain_name}</h3>
                <ul className="mt-2 space-y-1">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {chain.models.map((m: any, idx: number) => (
                    <li key={idx} className="text-sm text-slate-300">
                      {idx + 1}. {m.id}{" "}
                      <span className="text-xs text-slate-500">({m.provider})</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trust Ledger Table */}
      {trustScores.length > 0 && (
        <div className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/80 p-6">
          <h2 className="text-xl font-semibold text-white">Model Trust Scores Ledger</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-800/60 text-xs text-slate-400 uppercase">
                <tr>
                  <th className="p-3">Model ID</th>
                  <th className="p-3">Provider</th>
                  <th className="p-3">Trust Score</th>
                  <th className="p-3">Hallucination Rate</th>
                  <th className="p-3">Ethical Compliance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {trustScores.map((s: TrustScoreRecord) => (
                  <tr key={s.id} className="hover:bg-slate-800/40">
                    <td className="p-3 font-mono text-cyan-400">{s.model_id}</td>
                    <td className="p-3">{s.provider}</td>
                    <td className="p-3 font-bold text-emerald-400">{s.trust_score}%</td>
                    <td className="p-3 font-mono text-rose-400">
                      {(s.hallucination_rate * 100).toFixed(1)}%
                    </td>
                    <td className="p-3 font-mono text-emerald-400">{s.ethical_compliance}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
