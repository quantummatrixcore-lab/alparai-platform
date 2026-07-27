import { setRequestLocale, getTranslations } from "next-intl/server";
import { requireAdmin } from "@/lib/auth/session";
import { createServerClient } from "@/lib/supabase/server";
import { Star } from "@phosphor-icons/react/dist/ssr";
import { Award, BarChart3 } from "lucide-react";
import { MetricCard } from "@/components/admin/metric-card";
import { BenchTrRunButton } from "@/components/admin/bench-tr-run-button";

interface BenchTrRow {
  id: string;
  model_name: string;
  provider_slug: string;
  tr_grammar_score: number;
  tr_bias_score: number;
  tr_factuality_pct: number;
  eval_dataset_ver: string;
  created_at: string;
}

export default async function KBenchmarkPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  await requireAdmin();
  const t = await getTranslations({ locale, namespace: "admin" });

  const supabase = await createServerClient();
  const { data: scores, error } = await supabase
    .from("k_model_scores")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching k_model_scores:", error);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const benchTrQuery = (supabase.from("bench_tr_evaluations" as never) as any)
    .select(
      "id, model_name, provider_slug, tr_grammar_score, tr_bias_score, tr_factuality_pct, eval_dataset_ver, created_at",
    )
    .order("created_at", { ascending: false })
    .limit(20);
  const { data: benchTrRows, error: benchTrError } = (await benchTrQuery) as {
    data: BenchTrRow[] | null;
    error: { message: string } | null;
  };

  if (benchTrError) {
    console.error("Error fetching bench_tr_evaluations:", benchTrError);
  }

  return (
    <div className="animate-in fade-in space-y-8 duration-500">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-white drop-shadow-md">
          {t("kbench_title")}
        </h1>
        <p className="text-fg-secondary mt-2">{t("kbench_subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <MetricCard
          title={t("kb_total_models")}
          value={scores?.length ?? 0}
          icon={<Award className="h-4 w-4" />}
          trend="up"
          trendLabel={t("kb_trend_ratings")}
          accentColor="#f59e0b"
          sparkData={(scores ?? []).slice(0, 8).map((s, i) => ({ value: s.score ?? 70 + i * 3 }))}
          chartType="bar"
        />
        <MetricCard
          title={t("kb_avg_score")}
          value={
            scores && scores.length > 0
              ? `${(scores.reduce((a, s) => a + (s.score ?? 0), 0) / scores.length).toFixed(1)}`
              : "—"
          }
          icon={<BarChart3 className="h-4 w-4" />}
          trend="up"
          trendLabel={t("kb_trend_audit")}
          accentColor="#6366f1"
          sparkData={(scores ?? []).slice(0, 8).map((s, i) => ({ value: s.score ?? 65 + i * 4 }))}
          chartType="line"
        />
      </div>

      <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-4 text-xs text-emerald-300">
        <p className="mb-1 flex items-center gap-2 text-sm font-bold">{t("kbench_box_title")}</p>
        <p className="text-[11px] leading-relaxed">{t("kbench_box_desc")}</p>
      </div>

      <div className="bg-bg-secondary/40 overflow-hidden rounded-xl border border-white/5 backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-white">
            <thead className="text-fg-muted bg-white/5 text-xs font-bold uppercase">
              <tr>
                <th className="px-6 py-4">{t("kbench_th_model")}</th>
                <th className="px-6 py-4">{t("kbench_th_score")}</th>
                <th className="px-6 py-4">{t("kbench_th_status")}</th>
                <th className="px-6 py-4">{t("kbench_th_evaluated")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {scores?.map((score) => (
                <tr key={score.id} className="transition-colors hover:bg-white/5">
                  <td className="px-6 py-4 font-mono text-xs text-white">
                    {score.model_id || t("kbench_unknown_model")}
                    <br />
                    <span className="text-fg-muted">{score.id.substring(0, 8)}...</span>
                  </td>
                  <td className="text-brand-400 px-6 py-4 font-mono text-lg font-bold">
                    <div className="flex items-center gap-1">
                      {score.score !== null ? score.score : t("kbench_score_empty")}
                      <Star weight="fill" className="h-4 w-4 text-amber-400" />
                    </div>
                  </td>
                  <td className="px-6 py-4 capitalize">{score.status || t("kbench_evaluated")}</td>
                  <td className="text-fg-muted px-6 py-4 font-mono text-xs">
                    {new Date(score.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {(!scores || scores.length === 0) && (
                <tr>
                  <td colSpan={4} className="text-fg-muted px-6 py-8 text-center italic">
                    {t("kbench_empty")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black tracking-tight text-white">{t("benchtr_title")}</h2>
            <p className="text-fg-secondary mt-1 text-sm">{t("benchtr_subtitle")}</p>
          </div>
          <BenchTrRunButton />
        </div>

        <div className="bg-bg-secondary/40 overflow-hidden rounded-xl border border-white/5 backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-white">
              <thead className="text-fg-muted bg-white/5 text-xs font-bold uppercase">
                <tr>
                  <th className="px-6 py-4">{t("benchtr_th_model")}</th>
                  <th className="px-6 py-4">{t("benchtr_th_grammar")}</th>
                  <th className="px-6 py-4">{t("benchtr_th_bias")}</th>
                  <th className="px-6 py-4">{t("benchtr_th_factuality")}</th>
                  <th className="px-6 py-4">{t("kbench_th_evaluated")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {benchTrRows?.map((row) => (
                  <tr key={row.id} className="transition-colors hover:bg-white/5">
                    <td className="px-6 py-4 font-mono text-xs text-white">
                      {row.model_name}
                      <br />
                      <span className="text-fg-muted">{row.provider_slug}</span>
                    </td>
                    <td className="text-brand-400 px-6 py-4 font-mono text-sm font-bold">
                      {row.tr_grammar_score}
                    </td>
                    <td className="text-brand-400 px-6 py-4 font-mono text-sm font-bold">
                      {row.tr_bias_score}
                    </td>
                    <td className="text-brand-400 px-6 py-4 font-mono text-sm font-bold">
                      {row.tr_factuality_pct}
                    </td>
                    <td className="text-fg-muted px-6 py-4 font-mono text-xs">
                      {new Date(row.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {(!benchTrRows || benchTrRows.length === 0) && (
                  <tr>
                    <td colSpan={5} className="text-fg-muted px-6 py-8 text-center italic">
                      {t("benchtr_empty")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
