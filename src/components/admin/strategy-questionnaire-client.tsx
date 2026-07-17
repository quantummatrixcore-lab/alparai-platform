"use client";

import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";
import {
  getStrategicQuestions,
  getStrategicAnswers,
  runStrategicQuestionnaireForModel,
  deleteStrategicAnswersForModel,
  type StrategicQuestion,
  type StrategicAnswer
} from "@/actions/strategy-questionnaire";
import { HelpCircle, ExternalLink, Play, Trash2, Cpu, CheckCircle2, Clock, DollarSign, X } from "lucide-react";
import { toast } from "sonner";

interface ModelOption {
  name: string;
  id: string;
  provider: string;
}

const MODELS_OPTIONS: ModelOption[] = [
  { name: "Claude 3.5 Sonnet", id: "anthropic/claude-3.5-sonnet", provider: "openrouter" },
  { name: "GPT-4o", id: "openai/gpt-4o", provider: "openrouter" },
  { name: "Gemini 1.5 Pro", id: "gemini-1.5-pro", provider: "google" },
  { name: "DeepSeek Chat", id: "deepseek/deepseek-chat", provider: "openrouter" }
];

export function StrategyQuestionnaireClient({ locale }: { locale: string }) {
  const t = useTranslations("admin");
  const [questions, setQuestions] = useState<StrategicQuestion[]>([]);
  const [answers, setAnswers] = useState<StrategicAnswer[]>([]);
  const [loading, setLoading] = useState(true);
  const [runningModel, setRunningModel] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<ModelOption>(MODELS_OPTIONS[0]!);
  const [activeModalAnswer, setActiveModalAnswer] = useState<{
    question: StrategicQuestion;
    model: string;
    answer: StrategicAnswer;
  } | null>(null);

  const isTurkish = locale === "tr";

  async function loadData() {
    try {
      const qs = await getStrategicQuestions();
      const ans = await getStrategicAnswers();
      setQuestions(qs);
      setAnswers(ans);
    } catch (err: any) {
      toast.error(err.message || "Failed to load questionnaire data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleRunModel() {
    setRunningModel(selectedModel.name);
    toast.info(isTurkish 
      ? `${selectedModel.name} için anket değerlendirmesi başlatıldı. Bu işlem 1 dakikaya kadar sürebilir...`
      : `Questionnaire evaluation started for ${selectedModel.name}. This may take up to 1 minute...`
    );
    try {
      const res = await runStrategicQuestionnaireForModel(
        selectedModel.id,
        selectedModel.provider,
        selectedModel.name
      );
      if (res.success) {
        toast.success(isTurkish
          ? `${selectedModel.name} için ${res.count} soru başarıyla yanıtlandı!`
          : `Successfully answered ${res.count} questions using ${selectedModel.name}!`
        );
        await loadData();
      } else {
        toast.error(res.error || "Invocation failed");
      }
    } catch (err: any) {
      toast.error(err.message || "Execution failed");
    } finally {
      setRunningModel(null);
    }
  }

  async function handleDeleteModel() {
    if (!confirm(isTurkish 
      ? `${selectedModel.name} modeline ait tüm kayıtlı cevapları silmek istediğinize emin misiniz?` 
      : `Are you sure you want to delete all saved answers for ${selectedModel.name}?`
    )) return;

    try {
      await deleteStrategicAnswersForModel(selectedModel.name);
      toast.success(isTurkish ? "Cevaplar silindi." : "Answers deleted.");
      await loadData();
    } catch (err: any) {
      toast.error(err.message || "Delete failed");
    }
  }

  // Get distinct model names from answers
  const evaluatedModels = Array.from(new Set(answers.map((a) => a.model_name)));

  // Map answers for quick lookup: [question_id][model_name] -> Answer object
  const answersMap: Record<string, Record<string, StrategicAnswer>> = {};
  for (const ans of answers) {
    const qMap = answersMap[ans.question_id] ?? {};
    qMap[ans.model_name] = ans;
    answersMap[ans.question_id] = qMap;
  }

  // Calculate some stats
  const totalCost = answers.reduce((acc, a) => acc + (a.cost_usd || 0), 0);
  const totalAnswersCount = answers.length;

  if (loading) {
    return (
      <div className="py-20 text-center font-mono text-sm text-fg-muted animate-pulse">
        {isTurkish ? "Stratejik Değerlendirme verileri yükleniyor..." : "Loading Strategic Questionnaire..."}
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 lg:p-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black tracking-tight text-white inline-flex items-center gap-2">
          <Cpu className="h-8 w-8 text-brand-400" />
          {isTurkish ? "360° Stratejik Değerlendirme" : "360° Strategic Questionnaire"}
        </h1>
        <p className="text-fg-secondary mt-2 text-sm">
          {isTurkish
            ? "Farklı yapay zeka modellerinin ALPAR AI vizyonu, planı ve yapısı hakkındaki stratejik değerlendirmelerini karşılaştırın."
            : "Compare strategic evaluations and verdict breakdowns from different LLM models on the ALPAR AI roadmap."}
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div className="bg-bg-secondary border-border-subtle rounded-xl border p-5">
          <span className="text-xs text-fg-muted uppercase font-bold tracking-wide">
            {isTurkish ? "Toplam Soru Sayısı" : "Total Questions"}
          </span>
          <p className="text-white text-2xl font-black font-mono mt-2">{questions.length}</p>
        </div>
        <div className="bg-bg-secondary border-border-subtle rounded-xl border p-5">
          <span className="text-xs text-fg-muted uppercase font-bold tracking-wide">
            {isTurkish ? "Değerlendirilen Modeller" : "Evaluated Models"}
          </span>
          <p className="text-white text-2xl font-black font-mono mt-2">{evaluatedModels.length}</p>
        </div>
        <div className="bg-bg-secondary border-border-subtle rounded-xl border p-5">
          <span className="text-xs text-fg-muted uppercase font-bold tracking-wide">
            {isTurkish ? "Toplam Cevap Sayısı" : "Total Answers"}
          </span>
          <p className="text-white text-2xl font-black font-mono mt-2">{totalAnswersCount}</p>
        </div>
        <div className="bg-bg-secondary border-border-subtle rounded-xl border p-5">
          <span className="text-xs text-fg-muted uppercase font-bold tracking-wide">
            {isTurkish ? "Toplam API Maliyeti" : "Total API Cost"}
          </span>
          <p className="text-emerald-400 text-2xl font-black font-mono mt-2">${totalCost.toFixed(4)}</p>
        </div>
      </div>

      {/* Action Controller Panel Card */}
      <div className="bg-bg-secondary border-border-subtle rounded-xl border p-6">
        <h2 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">
          {isTurkish ? "Model Değerlendirme Paneli" : "Model Evaluation Console"}
        </h2>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-fg-muted font-bold">
              {isTurkish ? "Model Seçin" : "Select Model"}
            </label>
            <select
              value={selectedModel.id}
              onChange={(e) => {
                const opt = MODELS_OPTIONS.find((o) => o.id === e.target.value);
                if (opt) setSelectedModel(opt);
              }}
              className="bg-bg-tertiary border border-border-subtle rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-brand-400"
            >
              {MODELS_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.name} ({opt.id})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end gap-2 mt-4 sm:mt-0">
            <button
              onClick={handleRunModel}
              disabled={!!runningModel}
              className="bg-brand-500 hover:bg-brand-600 text-bg-primary inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-black transition duration-200 disabled:opacity-50"
            >
              <Play className="h-4 w-4 fill-current" />
              {runningModel === selectedModel.name 
                ? (isTurkish ? "Çalıştırılıyor..." : "Running...") 
                : (isTurkish ? "Soruları Gönder" : "Run Questionnaire")}
            </button>

            <button
              onClick={handleDeleteModel}
              disabled={!!runningModel}
              className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition duration-200"
            >
              <Trash2 className="h-4 w-4" />
              {isTurkish ? "Cevapları Temizle" : "Reset Answers"}
            </button>
          </div>
        </div>
      </div>

      {/* Comparison Matrix Table */}
      <div className="bg-bg-secondary border-border-subtle rounded-xl border overflow-hidden">
        <div className="px-6 py-4 border-b border-border-subtle">
          <h2 className="text-white text-lg font-bold tracking-tight">
            {isTurkish ? "Model Karşılaştırma Matrisi" : "Model Comparison Matrix"}
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-bg-tertiary/50 border-b border-border-subtle text-fg-muted text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4 min-w-[300px]">{isTurkish ? "Soru ve Bölüm" : "Question & Section"}</th>
                {evaluatedModels.length === 0 ? (
                  <th className="px-6 py-4 text-center">{isTurkish ? "Hiçbir Model Değerlendirilmedi" : "No Evaluated Models"}</th>
                ) : (
                  evaluatedModels.map((m) => (
                    <th key={m} className="px-6 py-4 min-w-[250px]">{m}</th>
                  ))
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {questions.map((q) => {
                const rowAnswers = answersMap[q.id] || {};

                return (
                  <tr key={q.id} className="hover:bg-bg-tertiary/20 transition-colors">
                    {/* Question details */}
                    <td className="px-6 py-4">
                      <Badge variant="outline" className="mb-2 text-[10px] uppercase font-mono tracking-wider">
                        {q.id} · {q.section}
                      </Badge>
                      <p className="text-white font-bold text-sm leading-relaxed">{q.question}</p>
                    </td>

                    {/* Model answers */}
                    {evaluatedModels.length === 0 ? (
                      <td className="px-6 py-4 text-center italic text-fg-muted">
                        {isTurkish ? "Yanıt yok" : "No responses"}
                      </td>
                    ) : (
                      evaluatedModels.map((modelName) => {
                        const ans = rowAnswers[modelName];

                        if (!ans) {
                          return (
                            <td key={modelName} className="px-6 py-4 text-center text-fg-muted italic">
                              -
                            </td>
                          );
                        }

                        // Split into sentences and get the first one (verdict)
                        const sentences = ans.answer.split(/(?<=[.!?])\s+/);
                        const verdict = sentences[0] || ans.answer;

                        return (
                          <td key={modelName} className="px-6 py-4 vertical-top max-w-sm">
                            <div className="flex flex-col justify-between h-full space-y-4">
                              <div>
                                <p className="text-white text-xs leading-relaxed line-clamp-3">
                                  {verdict}
                                </p>
                                <button
                                  onClick={() => setActiveModalAnswer({ question: q, model: modelName, answer: ans })}
                                  className="text-brand-400 hover:text-brand-300 text-[11px] font-bold mt-2 hover:underline"
                                >
                                  {isTurkish ? "Detayları Oku →" : "Read Full Verdict →"}
                                </button>
                              </div>

                              <div className="flex items-center gap-3 pt-2 border-t border-white/5 text-[10px] text-fg-muted font-mono">
                                <span className="inline-flex items-center gap-1">
                                  <Clock className="h-3 w-3" /> {ans.latency_ms ?? 0}ms
                                </span>
                                <span className="inline-flex items-center gap-1 text-emerald-400">
                                  <DollarSign className="h-3 w-3" /> ${(ans.cost_usd ?? 0).toFixed(5)}
                                </span>
                              </div>
                            </div>
                          </td>
                        );
                      })
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Answer Modal */}
      {activeModalAnswer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="bg-bg-secondary border border-border-subtle rounded-xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-border-subtle flex items-center justify-between">
              <div>
                <Badge variant="outline" className="mb-1 text-[10px] tracking-wider uppercase font-mono">
                  {activeModalAnswer.question.id} · {activeModalAnswer.question.section}
                </Badge>
                <h3 className="text-white font-bold text-sm">{activeModalAnswer.question.question}</h3>
              </div>
              <button
                onClick={() => setActiveModalAnswer(null)}
                className="text-fg-muted hover:text-white transition duration-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              <div>
                <span className="text-xs text-fg-muted font-bold block uppercase tracking-wide mb-2">
                  {activeModalAnswer.model} {isTurkish ? "Değerlendirmesi" : "Verdict"}
                </span>
                <div className="bg-bg-tertiary/35 p-4 rounded-xl border border-white/5 text-sm text-white leading-relaxed whitespace-pre-wrap font-mono">
                  {activeModalAnswer.answer.answer}
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-white/5 pt-4 text-xs text-fg-muted font-mono">
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {isTurkish ? "Gecikme: " : "Latency: "} {activeModalAnswer.answer.latency_ms ?? 0}ms
                </span>
                <span className="inline-flex items-center gap-1 text-emerald-400">
                  <DollarSign className="h-3.5 w-3.5" />
                  {isTurkish ? "Maliyet: " : "Cost: "} ${(activeModalAnswer.answer.cost_usd ?? 0).toFixed(5)}
                </span>
                <span className="inline-flex items-center gap-1 text-fg-muted">
                  {activeModalAnswer.answer.created_at ? new Date(activeModalAnswer.answer.created_at).toLocaleString() : ""}
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-border-subtle flex justify-end">
              <button
                onClick={() => setActiveModalAnswer(null)}
                className="bg-bg-tertiary hover:bg-bg-tertiary/75 border border-border-subtle rounded-xl px-4 py-2 text-sm text-white transition duration-200"
              >
                {isTurkish ? "Kapat" : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
