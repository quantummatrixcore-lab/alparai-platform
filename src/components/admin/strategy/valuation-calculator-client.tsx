"use client";

import React, { useState } from "react";
import { Plus, BarChart2, Calendar, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { saveValuationAction } from "@/actions/strategy";
import { toast } from "sonner";
import type { StrategyValuation } from "@/types";

interface ValuationCalculatorClientProps {
  initialValuations: StrategyValuation[];
  isReadOnly: boolean;
  locale: string;
}

export function ValuationCalculatorClient({
  initialValuations,
  isReadOnly,
  locale,
}: ValuationCalculatorClientProps) {
  const [valuations, setValuations] = useState<StrategyValuation[]>(initialValuations);
  const [activeTab, setActiveTab] = useState<"berkus" | "scorecard" | "vc" | "history">("berkus");
  const [isSaving, setIsSaving] = useState(false);
  const [notes, setNotes] = useState("");

  // 1. Berkus Method State
  const [berkusInputs, setBerkusInputs] = useState({
    idea: 500000,
    prototype: 450000,
    team: 400000,
    relations: 200000,
    rollout: 300000,
  });

  const berkusValuation = Object.values(berkusInputs).reduce((acc, curr) => acc + curr, 0);

  // 2. Scorecard Method State
  const [scorecardBaseline, setScorecardBaseline] = useState(2500000);
  const [scorecardInputs, setScorecardInputs] = useState({
    team: 80, // 25% weight
    opportunity: 130, // 25% weight
    technology: 120, // 15% weight
    competition: 130, // 10% weight
    marketing: 70, // 10% weight
    capital: 100, // 5% weight
    other: 100, // 10% weight
  });

  const scorecardMultiplier =
    (0.25 * scorecardInputs.team +
      0.25 * scorecardInputs.opportunity +
      0.15 * scorecardInputs.technology +
      0.1 * scorecardInputs.competition +
      0.1 * scorecardInputs.marketing +
      0.05 * scorecardInputs.capital +
      0.1 * scorecardInputs.other) /
    100;

  const scorecardValuation = Math.round(scorecardBaseline * scorecardMultiplier);

  // 3. VC Method State
  const [vcExitValue, setVcExitValue] = useState(40000000);
  const [vcTargetRoi, setVcTargetRoi] = useState(25);
  const [vcInvestment, setVcInvestment] = useState(250000);

  const vcPostMoney = Math.round(vcExitValue / vcTargetRoi);
  const vcValuation = vcPostMoney - vcInvestment;

  // 4. Consolidated Average
  const averageValuation = Math.round((berkusValuation + scorecardValuation + vcValuation) / 3);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat(locale === "tr" ? "tr-TR" : "en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleSaveSnapshot = async (method: "berkus" | "scorecard" | "vc" | "average") => {
    if (isReadOnly) return;
    setIsSaving(true);

    let val = 0;
    let inputsObj: Record<string, unknown> = {};

    if (method === "berkus") {
      val = berkusValuation;
      inputsObj = berkusInputs;
    } else if (method === "scorecard") {
      val = scorecardValuation;
      inputsObj = { ...scorecardInputs, baseline: scorecardBaseline };
    } else if (method === "vc") {
      val = vcValuation;
      inputsObj = { exitValue: vcExitValue, targetRoi: vcTargetRoi, investment: vcInvestment };
    } else {
      val = averageValuation;
      inputsObj = {
        berkus: berkusValuation,
        scorecard: scorecardValuation,
        vc: vcValuation,
      };
    }

    try {
      const res = await saveValuationAction({
        method,
        inputs: inputsObj,
        result_pre_money: val,
        notes: notes || null,
      });

      if (res.success) {
        toast.success(
          locale === "tr"
            ? "Değerleme snapshot kaydı kaydedildi."
            : "Valuation snapshot history logged.",
        );
        // Add to local state list
        const logged: StrategyValuation = {
          id: res.id,
          method,
          inputs: inputsObj,
          result_pre_money: val,
          notes: notes || null,
          snapshot_date: new Date().toISOString().split("T")[0]!,
          created_by: null,
          created_at: new Date().toISOString(),
        };
        setValuations((prev) => [logged, ...prev]);
        setNotes("");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to log valuation snapshot.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
      {/* CALCULATOR COLUMN */}
      <div className="space-y-6 lg:col-span-8">
        {/* Method Select Tabs */}
        <div className="bg-bg-secondary/40 border-border-subtle flex scrollbar-none gap-2 overflow-x-auto rounded-2xl border p-1.5 backdrop-blur-md">
          <button
            onClick={() => setActiveTab("berkus")}
            className={cn(
              "flex-1 rounded-xl px-4 py-2 text-xs font-bold tracking-wider uppercase transition duration-300",
              activeTab === "berkus"
                ? "bg-brand-500/15 text-brand-300 border-brand-500/20 border shadow-[inset_0_0_12px_rgba(168,85,247,0.1)]"
                : "text-fg-muted hover:bg-white/5 hover:text-white",
            )}
          >
            Berkus Method
          </button>
          <button
            onClick={() => setActiveTab("scorecard")}
            className={cn(
              "flex-1 rounded-xl px-4 py-2 text-xs font-bold tracking-wider uppercase transition duration-300",
              activeTab === "scorecard"
                ? "bg-brand-500/15 text-brand-300 border-brand-500/20 border shadow-[inset_0_0_12px_rgba(168,85,247,0.1)]"
                : "text-fg-muted hover:bg-white/5 hover:text-white",
            )}
          >
            Scorecard Method
          </button>
          <button
            onClick={() => setActiveTab("vc")}
            className={cn(
              "flex-1 rounded-xl px-4 py-2 text-xs font-bold tracking-wider uppercase transition duration-300",
              activeTab === "vc"
                ? "bg-brand-500/15 text-brand-300 border-brand-500/20 border shadow-[inset_0_0_12px_rgba(168,85,247,0.1)]"
                : "text-fg-muted hover:bg-white/5 hover:text-white",
            )}
          >
            VC Exit Method
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={cn(
              "flex-1 rounded-xl px-4 py-2 text-xs font-bold tracking-wider uppercase transition duration-300",
              activeTab === "history"
                ? "bg-brand-500/15 text-brand-300 border-brand-500/20 border shadow-[inset_0_0_12px_rgba(168,85,247,0.1)]"
                : "text-fg-muted hover:bg-white/5 hover:text-white",
            )}
          >
            {locale === "tr" ? "Geçmiş" : "Log History"}
          </button>
        </div>

        {/* TAB 1: BERKUS METHOD FORM */}
        {activeTab === "berkus" && (
          <div className="border-border-subtle bg-bg-secondary/40 space-y-4 rounded-2xl border p-6 backdrop-blur-md">
            <h3 className="border-b border-white/5 pb-2 text-sm font-bold tracking-wider text-white uppercase">
              Berkus pre-money valuation calculator
            </h3>
            <p className="text-fg-muted text-xs leading-relaxed">
              {locale === "tr"
                ? "Fikir aşamasındaki startup'lar için geliştirilen, risk azaltıcı 5 kriteri $500.000 limitleriyle puanlayan model."
                : "A pre-revenue valuation model assigning up to $500,000 for each risk-reducing milestone."}
            </p>

            <div className="space-y-4 pt-2">
              {Object.keys(berkusInputs).map((key) => {
                const label =
                  key === "idea"
                    ? locale === "tr"
                      ? "Sağlam Fikir (Sound Idea)"
                      : "Sound Idea / Concept"
                    : key === "prototype"
                      ? locale === "tr"
                        ? "Çalışan Prototip (Prototype)"
                        : "Working Prototype"
                      : key === "team"
                        ? locale === "tr"
                          ? "Kaliteli Yönetim Kadrosu (Quality Management Team)"
                          : "Management Team Quality"
                        : key === "relations"
                          ? locale === "tr"
                            ? "Stratejik İlişkiler / Ortaklıklar (Strategic Relations)"
                            : "Strategic Partnerships"
                          : locale === "tr"
                            ? "Ürün Dağıtımı veya Satış Gücü (Product Rollout / Sales)"
                            : "Product Rollout Moats";

                return (
                  <div
                    key={key}
                    className="flex flex-col justify-between gap-2 border-b border-white/5 pb-3 sm:flex-row sm:items-center"
                  >
                    <span className="text-xs font-semibold text-white/90">{label}</span>
                    <input
                      type="number"
                      max={500000}
                      min={0}
                      value={berkusInputs[key as keyof typeof berkusInputs]}
                      onChange={(e) =>
                        setBerkusInputs({
                          ...berkusInputs,
                          [key]: Math.min(500000, Math.max(0, Number(e.target.value))),
                        })
                      }
                      className="bg-bg-tertiary border-border-subtle focus:border-brand-500 focus:ring-brand-500 w-full rounded-xl border px-3 py-1.5 text-right font-mono text-sm text-white focus:ring-1 focus:outline-none sm:w-36"
                    />
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4">
              <span className="text-sm font-extrabold text-white">
                {locale === "tr"
                  ? "Hesaplanan Berkus Değerlemesi:"
                  : "Calculated Berkus Valuation:"}
              </span>
              <span className="font-mono text-2xl font-black text-emerald-400">
                {formatCurrency(berkusValuation)}
              </span>
            </div>
          </div>
        )}

        {/* TAB 2: SCORECARD METHOD FORM */}
        {activeTab === "scorecard" && (
          <div className="border-border-subtle bg-bg-secondary/40 space-y-4 rounded-2xl border p-6 backdrop-blur-md">
            <h3 className="border-b border-white/5 pb-2 text-sm font-bold tracking-wider text-white uppercase">
              Scorecard pre-money valuation calculator
            </h3>
            <p className="text-fg-muted text-xs leading-relaxed">
              {locale === "tr"
                ? "Bulunulan pazardaki benzer ortalama startup değerlemesini referans alan, ağırlıklı çarpan modeli."
                : "Weights and rates your startup against an average benchmark startup in the same sector."}
            </p>

            <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-2">
              <div>
                <label className="text-fg-secondary mb-1 block text-xs font-bold tracking-wider uppercase">
                  {locale === "tr"
                    ? "Pazar Ortalama Değerlemesi ($)"
                    : "Baseline Average Valuation ($)"}
                </label>
                <input
                  type="number"
                  value={scorecardBaseline}
                  onChange={(e) => setScorecardBaseline(Math.max(0, Number(e.target.value)))}
                  className="bg-bg-tertiary border-border-subtle focus:border-brand-500 focus:ring-brand-500 w-full rounded-xl border px-4 py-2 font-mono text-sm text-white focus:ring-1 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-4 border-t border-white/5 pt-4">
              {Object.keys(scorecardInputs).map((key) => {
                const label =
                  key === "team"
                    ? locale === "tr"
                      ? "Yönetim Kadrosunun Gücü (%25 Ağırlık)"
                      : "Management Team (25% Weight)"
                    : key === "opportunity"
                      ? locale === "tr"
                        ? "Fırsatın / Pazarın Büyüklüğü (%25 Ağırlık)"
                        : "Opportunity Size (25% Weight)"
                      : key === "technology"
                        ? locale === "tr"
                          ? "Ürün / Teknoloji Gücü (%15 Ağırlık)"
                          : "Product / Technology (15% Weight)"
                        : key === "competition"
                          ? locale === "tr"
                            ? "Rekabet Ortamı Analizi (%10 Ağırlık)"
                            : "Competitive Environment (10% Weight)"
                          : key === "marketing"
                            ? locale === "tr"
                              ? "Pazarlama / Satış Kanalları (%10 Ağırlık)"
                              : "Marketing & Sales (10% Weight)"
                            : key === "capital"
                              ? locale === "tr"
                                ? "Ek Yatırım İhtiyacı Derecesi (%5 Ağırlık)"
                                : "Need for Add. Investment (5% Weight)"
                              : locale === "tr"
                                ? "Diğer Faktörler (%10 Ağırlık)"
                                : "Other Factors (10% Weight)";

                return (
                  <div
                    key={key}
                    className="flex flex-col justify-between gap-2 border-b border-white/5 pb-3 sm:flex-row sm:items-center"
                  >
                    <span className="text-xs font-semibold text-white/90">{label}</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        max={150}
                        min={0}
                        value={scorecardInputs[key as keyof typeof scorecardInputs]}
                        onChange={(e) =>
                          setScorecardInputs({
                            ...scorecardInputs,
                            [key]: Number(e.target.value),
                          })
                        }
                        className="accent-brand-500 w-32"
                      />
                      <input
                        type="number"
                        max={150}
                        min={0}
                        value={scorecardInputs[key as keyof typeof scorecardInputs]}
                        onChange={(e) =>
                          setScorecardInputs({
                            ...scorecardInputs,
                            [key]: Math.min(150, Math.max(0, Number(e.target.value))),
                          })
                        }
                        className="bg-bg-tertiary border-border-subtle focus:border-brand-500 focus:ring-brand-500 w-16 rounded-xl border px-2 py-1 text-right font-mono text-xs text-white focus:ring-1 focus:outline-none"
                      />
                      <span className="text-fg-muted font-mono text-xs">%</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="text-fg-muted flex justify-between font-mono text-xs font-bold">
              <span>
                {locale === "tr"
                  ? "Kümülatif Çarpan Katsayısı:"
                  : "Consolidated Multiplier Factor:"}
              </span>
              <span className="text-white">{scorecardMultiplier.toFixed(3)}x</span>
            </div>

            <div className="mt-4 flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4">
              <span className="text-sm font-extrabold text-white">
                {locale === "tr"
                  ? "Hesaplanan Scorecard Değerlemesi:"
                  : "Calculated Scorecard Valuation:"}
              </span>
              <span className="font-mono text-2xl font-black text-emerald-400">
                {formatCurrency(scorecardValuation)}
              </span>
            </div>
          </div>
        )}

        {/* TAB 3: VC METHOD FORM */}
        {activeTab === "vc" && (
          <div className="border-border-subtle bg-bg-secondary/40 space-y-4 rounded-2xl border p-6 backdrop-blur-md">
            <h3 className="border-b border-white/5 pb-2 text-sm font-bold tracking-wider text-white uppercase">
              VC method valuation calculator
            </h3>
            <p className="text-fg-muted text-xs leading-relaxed">
              {locale === "tr"
                ? "Gelecekteki olası exit değerini baz alan, yatırımcının beklediği getiri (ROI) oranına göre geriye dönük hesaplayan VC modeli."
                : "Exit-based post/pre money valuation calculation according to targeted return multipliers."}
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex flex-col justify-between gap-2 border-b border-white/5 pb-3 sm:flex-row sm:items-center">
                <span className="text-xs font-semibold text-white/90">
                  {locale === "tr" ? "Beklenen Exit Değeri ($)" : "Estimated Exit Value ($)"}
                </span>
                <input
                  type="number"
                  value={vcExitValue}
                  onChange={(e) => setVcExitValue(Math.max(0, Number(e.target.value)))}
                  className="bg-bg-tertiary border-border-subtle focus:border-brand-500 focus:ring-brand-500 w-full rounded-xl border px-3 py-1.5 text-right font-mono text-sm text-white focus:ring-1 focus:outline-none sm:w-36"
                />
              </div>

              <div className="flex flex-col justify-between gap-2 border-b border-white/5 pb-3 sm:flex-row sm:items-center">
                <span className="text-xs font-semibold text-white/90">
                  {locale === "tr"
                    ? "Yatırımcı Hedef ROI Çarpanı (x)"
                    : "Expected ROI Target (x Multiplier)"}
                </span>
                <input
                  type="number"
                  value={vcTargetRoi}
                  onChange={(e) => setVcTargetRoi(Math.max(1, Number(e.target.value)))}
                  className="bg-bg-tertiary border-border-subtle focus:border-brand-500 focus:ring-brand-500 w-full rounded-xl border px-3 py-1.5 text-right font-mono text-sm text-white focus:ring-1 focus:outline-none sm:w-36"
                />
              </div>

              <div className="flex flex-col justify-between gap-2 border-b border-white/5 pb-3 sm:flex-row sm:items-center">
                <span className="text-xs font-semibold text-white/90">
                  {locale === "tr"
                    ? "Talep Edilen Yatırım Miktarı ($)"
                    : "Investment Capital Target ($)"}
                </span>
                <input
                  type="number"
                  value={vcInvestment}
                  onChange={(e) => setVcInvestment(Math.max(0, Number(e.target.value)))}
                  className="bg-bg-tertiary border-border-subtle focus:border-brand-500 focus:ring-brand-500 w-full rounded-xl border px-3 py-1.5 text-right font-mono text-sm text-white focus:ring-1 focus:outline-none sm:w-36"
                />
              </div>
            </div>

            <div className="text-fg-muted flex justify-between font-mono text-xs font-bold">
              <span>Post-Money Valuation:</span>
              <span className="text-white">{formatCurrency(vcPostMoney)}</span>
            </div>

            <div className="mt-4 flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4">
              <span className="text-sm font-extrabold text-white">
                {locale === "tr"
                  ? "Hesaplanan VC Değerlemesi (Pre-Money):"
                  : "Calculated VC Valuation (Pre-Money):"}
              </span>
              <span className="font-mono text-2xl font-black text-emerald-400">
                {formatCurrency(vcValuation)}
              </span>
            </div>
          </div>
        )}

        {/* TAB 4: VALUATION HISTORY LOG */}
        {activeTab === "history" && (
          <div className="border-border-subtle bg-bg-secondary/40 space-y-4 rounded-2xl border p-6 backdrop-blur-md">
            <h3 className="border-b border-white/5 pb-2 text-sm font-bold tracking-wider text-white uppercase">
              {locale === "tr" ? "Geçmiş Değerleme Kayıtları" : "Valuation Snapshot Logs"}
            </h3>

            <div className="overflow-x-auto">
              <table className="text-fg-secondary w-full text-left text-sm">
                <thead className="text-fg-muted border-b border-white/5 text-[10px] font-bold tracking-wider uppercase">
                  <tr>
                    <th className="pb-3">{locale === "tr" ? "Tarih" : "Date"}</th>
                    <th className="pb-3">{locale === "tr" ? "Metot" : "Method"}</th>
                    <th className="pb-3 text-right">
                      {locale === "tr" ? "Değerleme" : "Valuation"}
                    </th>
                    <th className="pb-3 pl-4">{locale === "tr" ? "Not" : "Notes"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono text-xs">
                  {valuations.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-fg-muted py-8 text-center italic">
                        {locale === "tr"
                          ? "Kayıtlı değerleme bulunmamaktadır."
                          : "No valuation logs recorded yet."}
                      </td>
                    </tr>
                  ) : (
                    valuations.map((val) => (
                      <tr key={val.id} className="transition hover:bg-white/5">
                        <td className="flex items-center gap-1 py-3">
                          <Calendar className="text-fg-muted h-3.5 w-3.5" />
                          {val.snapshot_date}
                        </td>
                        <td className="text-brand-300 py-3 font-semibold uppercase">
                          {val.method}
                        </td>
                        <td className="py-3 text-right font-extrabold text-white">
                          {formatCurrency(val.result_pre_money)}
                        </td>
                        <td
                          className="text-fg-muted max-w-[200px] truncate py-3 pl-4 font-sans"
                          title={val.notes || ""}
                        >
                          {val.notes || "—"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* SUMMARY SIDEBAR COLUMN */}
      <div className="space-y-6 lg:col-span-4">
        {/* Consolidated Summary */}
        <div className="border-border-subtle bg-bg-secondary/40 flex flex-col justify-between rounded-2xl border p-5 backdrop-blur-md">
          <div>
            <h3 className="mb-4 flex items-center gap-1.5 text-xs font-bold tracking-wider text-white uppercase">
              <BarChart2 className="text-brand-400 h-4 w-4" />
              Consolidated Model
            </h3>

            <div className="space-y-4">
              <div className="flex justify-between border-b border-white/5 pb-2 text-xs">
                <span className="text-fg-muted">Berkus Method:</span>
                <span className="font-mono font-bold text-white">
                  {formatCurrency(berkusValuation)}
                </span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2 text-xs">
                <span className="text-fg-muted">Scorecard Method:</span>
                <span className="font-mono font-bold text-white">
                  {formatCurrency(scorecardValuation)}
                </span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2 text-xs">
                <span className="text-fg-muted">VC Exit Method:</span>
                <span className="font-mono font-bold text-white">
                  {formatCurrency(vcValuation)}
                </span>
              </div>

              <div className="mt-6 rounded-xl border border-emerald-500/10 bg-emerald-500/5 p-4 text-center">
                <span className="text-fg-muted block text-[10px] font-bold tracking-wider uppercase">
                  {locale === "tr" ? "KONSOLİDE ORTALAMA DEĞERLEME" : "CONSOLIDATED AVG VALUATION"}
                </span>
                <span className="mt-1 block font-mono text-2xl font-black text-emerald-400">
                  {formatCurrency(averageValuation)}
                </span>
              </div>
            </div>
          </div>

          {!isReadOnly && activeTab !== "history" && (
            <div className="mt-6 space-y-3 border-t border-white/5 pt-4">
              <label className="text-fg-secondary mb-1 block text-xs font-bold tracking-wider uppercase">
                {locale === "tr" ? "Snapshot Notu" : "Snapshot Notes"}
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={
                  locale === "tr"
                    ? "örn. Lansman öncesi kurul değerlemesi"
                    : "e.g. Pre-launch consensus"
                }
                rows={2}
                className="bg-bg-tertiary border-border-subtle focus:border-brand-500 w-full rounded-xl border px-3 py-2 text-xs text-white focus:outline-none"
              />

              <button
                onClick={() => handleSaveSnapshot(activeTab)}
                disabled={isSaving}
                className="bg-brand-600 hover:bg-brand-500 hover:shadow-brand-500/10 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold text-white shadow-lg transition"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    {locale === "tr" ? "Kaydediliyor..." : "Saving..."}
                  </>
                ) : (
                  <>
                    <Plus className="h-3.5 w-3.5" />
                    {locale === "tr" ? "Snapshot Olarak Kaydet" : "Log Valuation Snapshot"}
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
