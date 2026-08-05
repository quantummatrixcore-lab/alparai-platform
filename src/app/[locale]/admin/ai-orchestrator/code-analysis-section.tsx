"use client";

import { useState } from "react";
import { Code2, Play, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import {
  analyzeCodeWithBlackbox,
  type CodeAnalysisResult,
} from "@/actions/admin/blackbox-analysis";

export function BlackboxCodeAnalysisSection() {
  const [filePath, setFilePath] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CodeAnalysisResult | null>(null);

  const handleAnalyze = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await analyzeCodeWithBlackbox(filePath, code);
      setResult(res);
    } catch {
      setResult({
        analysis: "Failed to analyze code snippet.",
        suggestions: ["Please try again."],
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/80 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Code2 className="h-6 w-6 text-emerald-400" />
          <h2 className="text-xl font-semibold text-white">Blackbox AI Code Quality Analysis</h2>
        </div>
        <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400">
          Blackbox Engine Active
        </span>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-400 uppercase">
            File Path (optional)
          </label>
          <input
            type="text"
            value={filePath}
            onChange={(e) => setFilePath(e.target.value)}
            placeholder="e.g. src/actions/incidents.ts"
            className="w-full rounded-lg border border-slate-700 bg-slate-800/60 px-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-400 uppercase">
            Code Content / Snippet
          </label>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows={6}
            placeholder="Paste code snippet for automated quality & security analysis..."
            className="w-full rounded-lg border border-slate-700 bg-slate-800/60 p-4 font-mono text-sm text-slate-200 placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <button
          onClick={handleAnalyze}
          disabled={loading || !code.trim()}
          className="flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Analyzing with Blackbox AI...
            </>
          ) : (
            <>
              <Play className="h-4 w-4" /> Run Quality Analysis
            </>
          )}
        </button>
      </div>

      {result && (
        <div className="mt-6 space-y-4 rounded-lg border border-slate-700 bg-slate-800/50 p-4">
          <div className="space-y-2">
            <h3 className="flex items-center gap-2 text-sm font-bold text-slate-300 uppercase">
              <AlertCircle className="h-4 w-4 text-emerald-400" /> Executive Analysis
            </h3>
            <p className="text-sm whitespace-pre-wrap text-slate-300">{result.analysis}</p>
          </div>

          {result.suggestions && result.suggestions.length > 0 && (
            <div className="space-y-2 border-t border-slate-700/60 pt-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase">
                Actionable Recommendations
              </h3>
              <ul className="space-y-2">
                {result.suggestions.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
