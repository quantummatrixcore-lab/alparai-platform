import { getCodebaseHygieneAction } from "@/actions/admin/codebase-hygiene";
import { Sparkles, FileCode, FileText, Share2, CheckCircle2 } from "lucide-react";

export default async function CodebaseHygieneAdminPage() {
  const report = await getCodebaseHygieneAction();

  return (
    <div className="space-y-8 p-6 text-white">
      <div>
        <h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight text-white">
          <Sparkles className="h-8 w-8 text-emerald-400" />
          Codebase Hygiene & Context Pruning
        </h1>
        <p className="mt-2 text-slate-400">
          Zero-Junk Engineering Protocol: Real-time context economy and AST graph sync audit
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-900/80 p-5">
          <div className="flex items-center justify-between text-slate-400">
            <span className="font-mono text-xs tracking-wider uppercase">Context Status</span>
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400">{report.contextStatus}</p>
          <p className="text-xs text-slate-400">0 orphaned files detected</p>
        </div>

        <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-900/80 p-5">
          <div className="flex items-center justify-between text-slate-400">
            <span className="font-mono text-xs tracking-wider uppercase">Source Files</span>
            <FileCode className="h-5 w-5 text-cyan-400" />
          </div>
          <p className="text-2xl font-bold text-white">{report.totalSrcFiles}</p>
          <p className="text-xs text-slate-400">Active TypeScript / React components</p>
        </div>

        <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-900/80 p-5">
          <div className="flex items-center justify-between text-slate-400">
            <span className="font-mono text-xs tracking-wider uppercase">Docs Files</span>
            <FileText className="h-5 w-5 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-white">{report.totalDocsFiles}</p>
          <p className="text-xs text-slate-400">Governance & proposal specs</p>
        </div>

        <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-900/80 p-5">
          <div className="flex items-center justify-between text-slate-400">
            <span className="font-mono text-xs tracking-wider uppercase">Graphify Nodes</span>
            <Share2 className="h-5 w-5 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-purple-400">{report.graphifyNodeCount}</p>
          <p className="text-xs text-slate-400">Live AST Knowledge Graph</p>
        </div>
      </div>

      <div className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/80 p-6">
        <h2 className="text-xl font-semibold text-white">Hygiene & Context Protocols</h2>
        <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
          <div className="space-y-2 rounded-lg border border-slate-800 bg-slate-950/60 p-4">
            <h3 className="font-bold text-emerald-400">A. Dead Code Elimination</h3>
            <p className="text-xs text-slate-300">
              Unused components, orphaned routes, and dead exports are deleted immediately.
            </p>
          </div>
          <div className="space-y-2 rounded-lg border border-slate-800 bg-slate-950/60 p-4">
            <h3 className="font-bold text-cyan-400">B. Context Economy</h3>
            <p className="text-xs text-slate-300">
              Ajan boot dokümanları (`docs/BOOTSTRAP.md`) ~500 token seviyesinde tutulur.
            </p>
          </div>
          <div className="space-y-2 rounded-lg border border-slate-800 bg-slate-950/60 p-4">
            <h3 className="font-bold text-purple-400">C. Graphify AST Sync</h3>
            <p className="text-xs text-slate-300">
              Pre-commit hook'u ile 6,100+ düğümlü AST mimari haritası otomatik güncellenir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
