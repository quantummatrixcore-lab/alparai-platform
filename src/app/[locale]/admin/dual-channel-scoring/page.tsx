import { getScoringConfigAction } from "@/actions/admin/dual-channel-scoring";
import { ShieldCheck, Scale, Lock, Sliders, Database } from "lucide-react";

export default async function DualChannelScoringAdminPage() {
  const config = await getScoringConfigAction();

  return (
    <div className="space-y-8 p-6 text-white">
      <div>
        <h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight text-white">
          <Scale className="h-8 w-8 text-amber-400" />
          Dual-Channel Model Trust Scoring Architecture
        </h1>
        <p className="mt-2 text-slate-400">
          Isolated dual-channel data pipeline with SHA-256 cryptographic audit ledger (Admin-Only).
        </p>
      </div>

      {/* Architecture Status Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-6">
          <div className="flex items-center justify-between text-sm text-slate-400">
            <span>Channel A (Cross-Audit)</span>
            <ShieldCheck className="h-5 w-5 text-cyan-400" />
          </div>
          <p className="mt-2 text-2xl font-bold text-cyan-400">Internal Audit Pipeline</p>
          <p className="mt-1 text-xs text-slate-500">
            Weight: {(config.wAudit * 100).toFixed(0)}% (Active)
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-6">
          <div className="flex items-center justify-between text-sm text-slate-400">
            <span>Channel B (Public Incidents)</span>
            <Database className="h-5 w-5 text-rose-400" />
          </div>
          <p className="mt-2 text-2xl font-bold text-rose-400">User Complaint Pipeline</p>
          <p className="mt-1 text-xs text-slate-500">
            Weight: {(config.wIncident * 100).toFixed(0)}% (Isolated)
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-6">
          <div className="flex items-center justify-between text-sm text-slate-400">
            <span>Weighted Formula Engine</span>
            <Sliders className="h-5 w-5 text-emerald-400" />
          </div>
          <p className="mt-2 text-2xl font-bold text-emerald-400">
            {config.isCombinedActive ? "COMBINED MODE" : "ISOLATED DATA COLLECTION"}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {config.isCombinedActive
              ? "Dual-channel weight active"
              : "Awaiting data accumulation threshold"}
          </p>
        </div>
      </div>

      {/* Cryptographic Ledger & Security Rules */}
      <div className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/80 p-6">
        <h2 className="flex items-center gap-2 text-xl font-semibold text-white">
          <Lock className="h-5 w-5 text-amber-400" />
          Zero-Contamination & Hash Signatures
        </h2>
        <p className="text-sm text-slate-300">
          Channels A and B are strictly isolated to eliminate prompt injection and
          cross-contamination risks. Every scoring evaluation generates a SHA-256 cryptographic
          signature stored in <code className="text-amber-400">ai_trust_ledger</code>.
        </p>
        <div className="rounded-lg border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-slate-400">
          SHA-256 Ledger Format:
          SHA256(model_id:audit_score:incident_score:combined_score:w_audit:w_incident:timestamp)
        </div>
      </div>
    </div>
  );
}
