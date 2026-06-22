/* eslint-disable */
"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LayoutDashboard,
  Database,
  FileText,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  Clock,
  ArrowUpRight,
  Lock,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ScoreSet {
  vision_mission: number;
  message_content: number;
  ux_ui_design: number;
  technical_architecture: number;
  legal_compliance: number;
  business_model: number;
  growth_viral: number;
  traction_social_proof: number;
  investor_readiness: number;
  societal_impact: number;
  total: number;
  total_max: number;
}

interface Audit {
  model_id: string;
  model_name: string;
  provider: string;
  audit_date: string;
  audit_type: string;
  scores: ScoreSet;
  unique_insight: string;
  key_recommendations: string[];
}

interface P0Blocker {
  id: string;
  title: string;
  category: "data" | "ui" | "i18n" | "legal" | "security" | "performance";
  status: "open" | "in-progress" | "resolved" | "wont-fix";
  first_reported: string;
  resolved_date?: string | null;
  model_count: number;
  effort?: string;
}

interface ConsensusFinding {
  finding: string;
  model_count: string;
  status?: string;
}

interface ScoreEvolution {
  date: string;
  round: number;
  average_score: number;
  highest: number;
  lowest: number;
  model_count: number;
  note?: string;
}

interface RegistryData {
  metadata: {
    project: string;
    created: string;
    last_updated: string;
    total_models: number;
    scoring_weights: Record<string, number>;
  };
  audits: Audit[];
  consensus_findings: {
    unanimous: ConsensusFinding[];
    strong_consensus: ConsensusFinding[];
  };
  p0_tracker: P0Blocker[];
  score_evolution: ScoreEvolution[];
}

interface Props {
  registryData: RegistryData;
  promptSection: string;
  analyses: string[];
  translations: {
    analysisHeading: string;
    masterPrompt: string;
    aiModelAnalyses: string;
    dashboard: string;
    moderation: string;
    analysis: string;
  };
}

export function AnalysisDashboardClient({
  registryData,
  promptSection,
  analyses,
  translations,
}: Props) {
  const [activeTab, setActiveTab] = React.useState<"dashboard" | "json" | "raw">("dashboard");
  const [p0Filter, setP0Filter] = React.useState<"all" | "open" | "resolved">("all");
  const [p0Search, setP0Search] = React.useState("");
  const [carouselIndex, setCarouselIndex] = React.useState(0);

  const totalModels = registryData.metadata.total_models;
  const p0Tracker = registryData.p0_tracker;
  const openP0Count = p0Tracker.filter(
    (b) => b.status === "open" || b.status === "in-progress",
  ).length;
  const resolvedP0Count = p0Tracker.filter((b) => b.status === "resolved").length;

  const evolution = registryData.score_evolution;
  const r1Avg = evolution.find((e) => e.round === 1)?.average_score ?? 400;
  const r2Avg = evolution.find((e) => e.round === 2)?.average_score ?? 430;
  const scoreDiff = r2Avg - r1Avg;

  const handleNextInsight = () => {
    setCarouselIndex((prev) => (prev + 1) % registryData.audits.length);
  };

  const handlePrevInsight = () => {
    setCarouselIndex(
      (prev) => (prev - 1 + registryData.audits.length) % registryData.audits.length,
    );
  };

  const filteredP0Blockers = p0Tracker.filter((item) => {
    const matchesFilter =
      p0Filter === "all" ||
      (p0Filter === "open" && (item.status === "open" || item.status === "in-progress")) ||
      (p0Filter === "resolved" && item.status === "resolved");

    const matchesSearch =
      item.title.toLowerCase().includes(p0Search.toLowerCase()) ||
      item.category.toLowerCase().includes(p0Search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const categories = [
    { key: "vision_mission", label: "Vision & Mission" },
    { key: "message_content", label: "Message & Content" },
    { key: "ux_ui_design", label: "UX/UI Design" },
    { key: "technical_architecture", label: "Technical Architecture" },
    { key: "legal_compliance", label: "Legal & Compliance" },
    { key: "business_model", label: "Business & Revenue" },
    { key: "growth_viral", label: "Growth & Virality" },
    { key: "traction_social_proof", label: "Social Proof" },
    { key: "investor_readiness", label: "Investor Readiness" },
    { key: "societal_impact", label: "Societal Impact" },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
    if (score >= 40) return "text-amber-400 bg-amber-500/10 border-amber-500/20";
    if (score > 0) return "text-rose-400 bg-rose-500/10 border-rose-500/20";
    return "text-fg-muted bg-bg-tertiary border-border-subtle";
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="border-border-subtle bg-bg-secondary flex rounded-lg border p-1">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={cn(
              "flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all duration-200",
              activeTab === "dashboard"
                ? "bg-bg-tertiary text-brand-400 shadow-md"
                : "text-fg-muted hover:text-fg-primary",
            )}
          >
            <LayoutDashboard className="h-4 w-4" />
            Visual Dashboard
          </button>
          <button
            onClick={() => setActiveTab("json")}
            className={cn(
              "flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all duration-200",
              activeTab === "json"
                ? "bg-bg-tertiary text-brand-400 shadow-md"
                : "text-fg-muted hover:text-fg-primary",
            )}
          >
            <Database className="h-4 w-4" />
            Consolidated JSON
          </button>
          <button
            onClick={() => setActiveTab("raw")}
            className={cn(
              "flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all duration-200",
              activeTab === "raw"
                ? "bg-bg-tertiary text-brand-400 shadow-md"
                : "text-fg-muted hover:text-fg-primary",
            )}
          >
            <FileText className="h-4 w-4" />
            Raw Markdown
          </button>
        </div>
      </div>

      {activeTab === "dashboard" && (
        <div className="grid gap-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Card variant="elevated" padding="sm" className="relative overflow-hidden">
              <div className="absolute top-3 right-3 opacity-10">
                <TrendingUp className="text-brand-400 h-12 w-12" />
              </div>
              <CardContent className="pt-4">
                <p className="text-fg-muted text-xs font-semibold tracking-wider uppercase">
                  Average Score
                </p>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-white">{r2Avg}</span>
                  <span className="text-fg-muted text-sm">/ 1000</span>
                </div>
                <div className="mt-2 flex items-center gap-1 text-xs text-emerald-400">
                  <TrendingUp className="h-3 w-3" />
                  <span>+{scoreDiff} increase from R1</span>
                </div>
              </CardContent>
            </Card>

            <Card variant="elevated" padding="sm" className="relative overflow-hidden">
              <div className="absolute top-3 right-3 opacity-10">
                <Database className="text-brand-400 h-12 w-12" />
              </div>
              <CardContent className="pt-4">
                <p className="text-fg-muted text-xs font-semibold tracking-wider uppercase">
                  Total Models
                </p>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-white">{totalModels}</span>
                  <span className="text-fg-muted text-sm">frontiers</span>
                </div>
                <div className="text-fg-muted mt-2 flex items-center gap-1 text-xs">
                  <span>Round 1: 13 | Round 2: 3</span>
                </div>
              </CardContent>
            </Card>

            <Card
              variant="elevated"
              padding="sm"
              className="relative overflow-hidden border-rose-500/20 bg-rose-500/5"
            >
              <div className="absolute top-3 right-3 opacity-10">
                <AlertTriangle className="h-12 w-12 text-rose-400" />
              </div>
              <CardContent className="pt-4">
                <p className="text-xs font-semibold tracking-wider text-rose-400/80 uppercase">
                  Open P0 Blockers
                </p>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-rose-400">{openP0Count}</span>
                  <span className="text-fg-muted text-sm">critical</span>
                </div>
                <div className="mt-2 flex items-center gap-1 text-xs text-rose-400/60">
                  <span>Requires immediate remediation</span>
                </div>
              </CardContent>
            </Card>

            <Card
              variant="elevated"
              padding="sm"
              className="relative overflow-hidden border-emerald-500/20 bg-emerald-500/5"
            >
              <div className="absolute top-3 right-3 opacity-10">
                <CheckCircle2 className="h-12 w-12 text-emerald-400" />
              </div>
              <CardContent className="pt-4">
                <p className="text-xs font-semibold tracking-wider text-emerald-400/80 uppercase">
                  Resolved P0 Blockers
                </p>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-emerald-400">
                    {resolvedP0Count}
                  </span>
                  <span className="text-fg-muted text-sm">fixed</span>
                </div>
                <div className="mt-2 flex items-center gap-1 text-xs text-emerald-400/60">
                  <span>Remediated in Round 2</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <Card variant="default" className="lg:col-span-2">
              <CardHeader className="border-border-subtle flex flex-row items-center justify-between border-b pb-4">
                <CardTitle className="text-md font-semibold text-white">
                  Model Comparison Matrix
                </CardTitle>
                <span className="text-fg-muted text-xs">Heatmap analysis of model performance</span>
              </CardHeader>
              <CardContent className="overflow-x-auto pt-6">
                <table className="text-fg-muted w-full min-w-[600px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-border-subtle text-fg-muted border-b text-xs tracking-wider uppercase">
                      <th className="py-3 pr-4 font-semibold">Category</th>
                      {registryData.audits.map((a) => (
                        <th key={a.model_id} className="px-2 py-3 text-center font-semibold">
                          <span className="block max-w-[80px] truncate" title={a.model_name}>
                            {a.model_name.replace(" (360°)", "")}
                          </span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-border-subtle divide-y">
                    {categories.map(({ key, label }) => (
                      <tr key={key} className="hover:bg-bg-tertiary/20">
                        <td className="text-fg-primary py-3 pr-4 font-medium">{label}</td>
                        {registryData.audits.map((a) => {
                          const score = (a.scores as unknown as Record<string, number>)[key];
                          const hasScore = score !== undefined && score !== 0;
                          return (
                            <td key={a.model_id} className="px-1 py-3 text-center">
                              <span
                                className={cn(
                                  "inline-block min-w-[32px] rounded-md border px-2 py-1 text-center font-mono text-xs font-bold",
                                  hasScore
                                    ? getScoreColor(score)
                                    : "text-fg-muted bg-bg-tertiary border-border-subtle opacity-30",
                                )}
                              >
                                {hasScore ? score : "—"}
                              </span>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                    <tr className="bg-bg-tertiary/30 border-border-strong border-t-2 font-bold">
                      <td className="text-fg-primary py-3 pr-4">TOTAL SCORE</td>
                      {registryData.audits.map((a) => {
                        const total = a.scores.total;
                        const isPartial = total <= 400 && a.model_id.includes("minimax-initial");
                        return (
                          <td key={a.model_id} className="px-1 py-3 text-center">
                            <span className="font-mono text-white">
                              {total}
                              {isPartial && (
                                <span className="text-fg-muted block text-[10px]">/400</span>
                              )}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  </tbody>
                </table>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card variant="default">
                <CardHeader className="border-border-subtle border-b pb-4">
                  <CardTitle className="text-md font-semibold text-white">
                    Consensus & Core Alignment
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div>
                      <h4 className="mb-3 text-xs font-semibold tracking-wider text-rose-400 uppercase">
                        Unanimous consensus (16/16 Models)
                      </h4>
                      <ul className="space-y-2">
                        {registryData.consensus_findings.unanimous.map((item, i) => (
                          <li
                            key={i}
                            className="text-fg-secondary flex items-start gap-2 rounded-lg border border-rose-500/10 bg-rose-500/5 p-2.5 text-xs"
                          >
                            <XCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-rose-400" />
                            <span>{item.finding}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="mb-3 text-xs font-semibold tracking-wider text-emerald-400 uppercase">
                        Strong consensus (10-15/16 Models)
                      </h4>
                      <ul className="space-y-2">
                        {registryData.consensus_findings.strong_consensus.map((item, i) => {
                          const isResolved = item.status === "resolved";
                          return (
                            <li
                              key={i}
                              className={cn(
                                "flex items-start gap-2 rounded-lg border p-2.5 text-xs",
                                isResolved
                                  ? "border-emerald-500/10 bg-emerald-500/5 text-emerald-200/90"
                                  : "bg-bg-tertiary border-border-subtle text-fg-secondary",
                              )}
                            >
                              {isResolved ? (
                                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />
                              ) : (
                                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-400" />
                              )}
                              <div className="flex-1">
                                <span>{item.finding}</span>
                                <span className="text-fg-muted mt-0.5 block text-[10px]">
                                  {item.model_count} models agree {isResolved && "· Resolved"}
                                </span>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card variant="gradient">
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <CardTitle className="text-md font-semibold text-white">
                    Unique Insights
                  </CardTitle>
                  <div className="flex gap-1">
                    <button
                      onClick={handlePrevInsight}
                      className="hover:bg-bg-tertiary border-border-subtle rounded border p-1 transition-colors"
                    >
                      <ChevronLeft className="h-3 w-3" />
                    </button>
                    <button
                      onClick={handleNextInsight}
                      className="hover:bg-bg-tertiary border-border-subtle rounded border p-1 transition-colors"
                    >
                      <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="relative flex min-h-[140px] flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="bg-brand-500/20 text-brand-400 border-brand-500/30 rounded-md border px-2 py-0.5 text-xs font-semibold">
                          {registryData.audits[carouselIndex]?.provider}
                        </span>
                        <span className="text-fg-muted font-mono text-[10px]">
                          {carouselIndex + 1} / {registryData.audits.length}
                        </span>
                      </div>
                      <h4 className="text-fg-primary mt-2 text-sm font-semibold">
                        {registryData.audits[carouselIndex]?.model_name}
                      </h4>
                      <p className="text-fg-secondary mt-2 line-clamp-3 text-xs italic">
                        &ldquo;{registryData.audits[carouselIndex]?.unique_insight}&rdquo;
                      </p>
                    </div>
                    <div className="border-border-subtle/50 mt-4 flex items-center justify-between border-t pt-3">
                      <span className="text-fg-muted text-[10px]">
                        Reported: {registryData.audits[carouselIndex]?.audit_date}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Card variant="default">
            <CardHeader className="border-border-subtle flex flex-col gap-4 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="text-md font-semibold text-white">
                  P0 Critical Blocker Tracker
                </CardTitle>
                <p className="text-fg-muted mt-1 text-xs">
                  Checklist of blockers identified by the 16-model audit.
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <div className="relative">
                  <Search className="text-fg-muted absolute top-2.5 left-3 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search blockers..."
                    value={p0Search}
                    onChange={(e) => setP0Search(e.target.value)}
                    className="border-border-subtle bg-bg-tertiary focus:border-brand-500 focus:ring-brand-500 text-fg-primary rounded-md border py-2 pr-4 pl-9 text-xs focus:ring-1 focus:outline-none"
                  />
                </div>
                <div className="border-border-subtle bg-bg-secondary flex rounded-lg border p-1">
                  <button
                    onClick={() => setP0Filter("all")}
                    className={cn(
                      "rounded-md px-3 py-1 text-xs font-semibold transition-colors",
                      p0Filter === "all"
                        ? "bg-bg-tertiary text-brand-400"
                        : "text-fg-muted hover:text-fg-primary",
                    )}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setP0Filter("open")}
                    className={cn(
                      "rounded-md px-3 py-1 text-xs font-semibold transition-colors",
                      p0Filter === "open"
                        ? "bg-bg-tertiary text-brand-400"
                        : "text-fg-muted hover:text-fg-primary",
                    )}
                  >
                    Open
                  </button>
                  <button
                    onClick={() => setP0Filter("resolved")}
                    className={cn(
                      "rounded-md px-3 py-1 text-xs font-semibold transition-colors",
                      p0Filter === "resolved"
                        ? "bg-bg-tertiary text-brand-400"
                        : "text-fg-muted hover:text-fg-primary",
                    )}
                  >
                    Resolved
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-border-subtle divide-y">
                {filteredP0Blockers.length > 0 ? (
                  filteredP0Blockers.map((item) => {
                    const isResolved = item.status === "resolved";
                    return (
                      <div
                        key={item.id}
                        className="hover:bg-bg-tertiary/10 flex items-start gap-4 p-4 transition-colors"
                      >
                        <div className="mt-1">
                          {isResolved ? (
                            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                          ) : (
                            <div className="flex h-5 w-5 items-center justify-center rounded-md border border-rose-500/50 bg-rose-500/5">
                              <span className="h-2 w-2 animate-pulse rounded-full bg-rose-500" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-fg-muted font-mono text-xs">{item.id}</span>
                            <h4
                              className={cn(
                                "text-sm font-semibold text-white",
                                isResolved && "text-fg-muted line-through",
                              )}
                            >
                              {item.title}
                            </h4>
                            <span className="bg-bg-tertiary text-fg-secondary border-border-subtle rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase">
                              {item.category}
                            </span>
                            {!isResolved && (
                              <span className="rounded-full border border-rose-500/20 bg-rose-500/10 px-2 py-0.5 text-[10px] font-semibold text-rose-400">
                                Open
                              </span>
                            )}
                          </div>
                          <div className="text-fg-muted flex flex-wrap items-center gap-4 text-xs">
                            <span className="flex items-center gap-1">
                              <ExternalLink className="h-3.5 w-3.5" />
                              Reported by {item.model_count} models
                            </span>
                            {item.effort && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                Est. Effort: {item.effort}
                              </span>
                            )}
                            <span>First reported: {item.first_reported}</span>
                            {item.resolved_date && (
                              <span className="font-semibold text-emerald-400">
                                Resolved: {item.resolved_date}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-fg-muted py-8 text-center text-sm">
                    No blockers match your search criteria.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "json" && (
        <Card>
          <CardHeader className="border-border-subtle flex flex-row items-center justify-between border-b pb-4">
            <CardTitle className="text-md font-semibold text-white">
              Structured Consolidated Registry
            </CardTitle>
            <span className="text-fg-muted text-xs">docs/ai-audit/audit-registry.json</span>
          </CardHeader>
          <CardContent className="pt-6">
            <pre className="bg-bg-tertiary text-fg-secondary max-h-[600px] overflow-x-auto rounded-lg p-4 font-mono text-xs">
              {JSON.stringify(registryData, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}

      {activeTab === "raw" && (
        <div className="space-y-6">
          <Card variant="gradient">
            <CardHeader className="border-border-subtle border-b pb-4">
              <CardTitle className="text-md inline-flex items-center gap-2 font-semibold text-white">
                <Lock className="text-brand-400 h-5 w-5" />
                {translations.masterPrompt}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="prose prose-invert prose-sm text-fg-secondary bg-bg-tertiary max-w-none rounded-lg p-4 font-mono text-xs whitespace-pre-wrap">
                {promptSection.trim()}
              </div>
            </CardContent>
          </Card>

          <h2 className="text-lg font-semibold text-white">{translations.aiModelAnalyses}</h2>

          <div className="space-y-6">
            {analyses.map((analysis, i) => {
              const isPending = analysis.includes("[PENDING:");
              const modelMatch = analysis.match(/^\s*(.+?)\n/);
              const modelName = modelMatch?.[1]?.replace(/\]/g, "").trim() ?? `Model ${i + 1}`;

              return (
                <Card
                  key={i}
                  variant={isPending ? "default" : "elevated"}
                  className={isPending ? "border-border-subtle opacity-60" : ""}
                >
                  <CardHeader className="border-border-subtle border-b pb-3">
                    <CardTitle className="inline-flex items-center gap-2 text-sm font-semibold text-white">
                      {isPending ? (
                        <span className="bg-bg-tertiary h-2 w-2 rounded-full" />
                      ) : (
                        <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                      )}
                      #{i + 1} — {modelName}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    {isPending ? (
                      <p className="text-fg-muted text-sm italic">Analysis pending...</p>
                    ) : (
                      <div className="prose prose-invert prose-sm text-fg-secondary bg-bg-tertiary/40 max-w-none overflow-x-auto rounded-lg p-4 font-mono text-xs whitespace-pre-wrap">
                        {analysis.trim()}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
