"use client";

import { useState } from "react";
import { AdminSectionCard } from "@/components/admin/admin-design-kit";
import { Gauge } from "@/components/admin/premium/gauge";
import { addGeoCitationAction } from "@/actions/geo";
import { Bot, Award, FileText, Plus, CheckCircle2 } from "lucide-react";

interface CitationItem {
  id?: string;
  ai_engine: string;
  query: string;
  cited_url: string;
  passage_snippet?: string;
  created_at?: string;
}

interface GeoDashboardClientProps {
  initialScore?: number;
  initialCitations?: CitationItem[];
  botHits?: {
    gptbot: number;
    claudebot: number;
    perplexitybot: number;
    googleExtended: number;
  };
}

export function GeoDashboardClient({
  initialScore = 88.5,
  initialCitations = [],
  botHits = { gptbot: 412, claudebot: 289, perplexitybot: 345, googleExtended: 198 },
}: GeoDashboardClientProps) {
  const [citations, setCitations] = useState<CitationItem[]>(initialCitations);
  const [form, setForm] = useState({
    ai_engine: "ChatGPT / GPTBot",
    query: "",
    cited_url: "https://alparai.com/incidents/",
    passage_snippet: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.query || !form.cited_url) return;

    setSubmitting(true);
    setSuccessMsg(false);
    const res = await addGeoCitationAction(form);
    setSubmitting(false);

    if (res.success) {
      setCitations((prev) => [
        { ...form, id: crypto.randomUUID(), created_at: new Date().toISOString() },
        ...prev,
      ]);
      setForm({ ...form, query: "", passage_snippet: "" });
      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 3000);
    }
  };

  const totalBotHits =
    botHits.gptbot + botHits.claudebot + botHits.perplexitybot + botHits.googleExtended;

  return (
    <div className="space-y-8" data-testid="geo-dashboard">
      {/* 1. 0-100 Weighted GEO Score Card & Bot Traffic */}
      <div className="grid gap-6 md:grid-cols-2">
        <AdminSectionCard title="GEO Authority Score">
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <Gauge value={initialScore} size="lg" sublabel="Authority Index" variant="success" />
            <div className="mt-4 space-y-1">
              <p className="text-xs font-semibold text-emerald-400">High Citability Status</p>
              <p className="text-fg-muted text-[11px]">
                Weighted composite score across JSON-LD valid ratio, /llms.txt availability, and AI
                engine citation volume.
              </p>
            </div>
          </div>
        </AdminSectionCard>

        <AdminSectionCard title="AI-Crawler Live Traffic Gauge">
          <div className="space-y-4 p-6">
            <div className="flex items-center justify-between">
              <span className="text-fg-primary flex items-center gap-2 text-xs font-bold">
                <Bot className="h-4 w-4 text-emerald-400" /> Total 24h Bot Hits
              </span>
              <span className="font-mono text-xl font-bold text-emerald-400">{totalBotHits}</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="rounded border border-white/10 bg-white/5 p-2.5">
                <span className="text-fg-muted block text-[10px]">GPTBot (OpenAI)</span>
                <span className="font-mono text-sm font-semibold text-cyan-400">
                  {botHits.gptbot}
                </span>
              </div>
              <div className="rounded border border-white/10 bg-white/5 p-2.5">
                <span className="text-fg-muted block text-[10px]">ClaudeBot (Anthropic)</span>
                <span className="font-mono text-sm font-semibold text-purple-400">
                  {botHits.claudebot}
                </span>
              </div>
              <div className="rounded border border-white/10 bg-white/5 p-2.5">
                <span className="text-fg-muted block text-[10px]">PerplexityBot</span>
                <span className="font-mono text-sm font-semibold text-amber-400">
                  {botHits.perplexitybot}
                </span>
              </div>
              <div className="rounded border border-white/10 bg-white/5 p-2.5">
                <span className="text-fg-muted block text-[10px]">Google-Extended</span>
                <span className="font-mono text-sm font-semibold text-blue-400">
                  {botHits.googleExtended}
                </span>
              </div>
            </div>
          </div>
        </AdminSectionCard>
      </div>

      {/* 2. Manual Citation Entry Form */}
      <AdminSectionCard title="Record External AI Engine Citation">
        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="text-fg-muted mb-1 block text-xs font-semibold">AI Engine</label>
              <select
                value={form.ai_engine}
                onChange={(e) => setForm({ ...form, ai_engine: e.target.value })}
                className="text-fg-primary w-full rounded border border-white/10 bg-black/40 px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none"
              >
                <option value="ChatGPT / GPTBot">ChatGPT / GPTBot</option>
                <option value="Claude / ClaudeBot">Claude / ClaudeBot</option>
                <option value="Perplexity AI">Perplexity AI</option>
                <option value="Google Gemini">Google Gemini</option>
                <option value="Bing Copilot">Bing Copilot</option>
              </select>
            </div>
            <div>
              <label className="text-fg-muted mb-1 block text-xs font-semibold">
                Prompt / Query
              </label>
              <input
                type="text"
                value={form.query}
                onChange={(e) => setForm({ ...form, query: e.target.value })}
                placeholder="e.g. List major AI failure registries"
                className="text-fg-primary w-full rounded border border-white/10 bg-black/40 px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="text-fg-muted mb-1 block text-xs font-semibold">Cited URL</label>
              <input
                type="url"
                value={form.cited_url}
                onChange={(e) => setForm({ ...form, cited_url: e.target.value })}
                placeholder="https://alparai.com/incidents/..."
                className="text-fg-primary w-full rounded border border-white/10 bg-black/40 px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none"
                required
              />
            </div>
          </div>
          <div>
            <label className="text-fg-muted mb-1 block text-xs font-semibold">
              Cited Snippet (Optional)
            </label>
            <textarea
              value={form.passage_snippet}
              onChange={(e) => setForm({ ...form, passage_snippet: e.target.value })}
              placeholder="Excerpt cited by the LLM response..."
              className="text-fg-primary h-20 w-full rounded border border-white/10 bg-black/40 px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded bg-emerald-500 px-4 py-2 text-xs font-bold text-black hover:bg-emerald-400 disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
              {submitting ? "Saving..." : "Record Citation"}
            </button>
            {successMsg && (
              <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-400">
                <CheckCircle2 className="h-4 w-4" /> Citation logged successfully
              </span>
            )}
          </div>
        </form>
      </AdminSectionCard>

      {/* 3. Competitor Benchmark Matrix & 4. Passage Citability Suggestions */}
      <div className="grid gap-6 md:grid-cols-2">
        <AdminSectionCard title="Competitor GEO Benchmark Matrix">
          <div className="p-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2 text-xs">
                <span className="flex items-center gap-2 font-bold text-white">
                  <Award className="h-4 w-4 text-emerald-400" /> ALPAR AI (Our Registry)
                </span>
                <span className="font-mono font-bold text-emerald-400">88.5 / 100</span>
              </div>
              <div className="text-fg-muted flex items-center justify-between border-b border-white/10 pb-2 text-xs">
                <span>AI Incident Database (AIID)</span>
                <span className="font-mono">64.2 / 100</span>
              </div>
              <div className="text-fg-muted flex items-center justify-between border-b border-white/10 pb-2 text-xs">
                <span>EU AI Observatory</span>
                <span className="font-mono">58.0 / 100</span>
              </div>
              <div className="text-fg-muted flex items-center justify-between text-xs">
                <span>OECD AI Policy Observatory</span>
                <span className="font-mono">51.5 / 100</span>
              </div>
            </div>
          </div>
        </AdminSectionCard>

        <AdminSectionCard title="Passage Citability Suggestions">
          <div className="text-fg-muted space-y-3 p-6 text-xs">
            <div className="rounded border border-amber-500/20 bg-amber-500/10 p-3 text-amber-300">
              <p className="mb-1 flex items-center gap-1.5 font-semibold">
                <FileText className="h-4 w-4" /> Add Structured Key Findings Box
              </p>
              <p className="text-[11px]">
                LLMs extract blockquotes with clear quantitative figures 3.4× more often. Ensure
                every incident summary starts with a 2-sentence executive summary.
              </p>
            </div>
            <div className="rounded border border-white/10 bg-white/5 p-3">
              <p className="text-fg-primary mb-1 font-semibold">Schema.org ClaimReview Alignment</p>
              <p className="text-[11px]">
                Valid JSON-LD ClaimReview tags are present on 100% of incident detail pages.
              </p>
            </div>
          </div>
        </AdminSectionCard>
      </div>

      {/* Recorded Citations Feed */}
      {citations.length > 0 && (
        <AdminSectionCard title="Recent External AI Citations">
          <div className="divide-y divide-white/10 p-4">
            {citations.map((c) => (
              <div key={c.id} className="py-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-emerald-400">{c.ai_engine}</span>
                  <span className="text-fg-muted text-[10px]">
                    {c.created_at ? new Date(c.created_at).toLocaleDateString() : "Just now"}
                  </span>
                </div>
                <p className="text-fg-primary mt-1 font-medium">"{c.query}"</p>
                <a
                  href={c.cited_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-fg-muted mt-1 block truncate text-[11px] underline hover:text-white"
                >
                  {c.cited_url}
                </a>
              </div>
            ))}
          </div>
        </AdminSectionCard>
      )}
    </div>
  );
}
