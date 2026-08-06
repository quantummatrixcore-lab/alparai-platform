"use client";

import { motion } from "framer-motion";
import { Zap, TrendingUp, Cpu, Rocket, ShieldCheck, Activity } from "lucide-react";
import { useTranslations } from "next-intl";

interface VelocityMetricsCardProps {
  velocityFactor: number;
  baseARR: number;
  clientCount: number;
  avgJumpPct?: number;
  totalModelsTracked?: number;
}

export function VelocityMetricsCard({
  velocityFactor,
  baseARR,
  clientCount,
  avgJumpPct = 27.2,
  totalModelsTracked = 5,
}: VelocityMetricsCardProps) {
  const t = useTranslations("velocity");

  const getVelocityBadge = (v: number) => {
    if (v >= 3.0)
      return {
        label: t("status_agi"),
        color: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      };
    if (v >= 1.5)
      return {
        label: t("status_exponential"),
        color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      };
    return { label: t("status_linear"), color: "bg-blue-500/20 text-blue-400 border-blue-500/30" };
  };

  const badge = getVelocityBadge(velocityFactor);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Primary Delta V AI Index Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-neutral-900/70 p-6 shadow-[0_0_30px_rgba(6,182,212,0.15)] backdrop-blur-xl transition-all duration-300 hover:border-cyan-500/50 lg:col-span-2"
      >
        <div className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-400">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-fg-primary text-sm font-semibold">{t("delta_v_index_title")}</h3>
              <p className="text-fg-muted text-xs">{t("delta_v_index_subtitle")}</p>
            </div>
          </div>
          <span
            className={`rounded-full border px-3 py-1 text-xs font-semibold backdrop-blur-md ${badge.color}`}
          >
            {badge.label}
          </span>
        </div>

        <div className="mt-6 flex items-baseline gap-3">
          <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-4xl font-extrabold text-transparent sm:text-5xl">
            {velocityFactor.toFixed(2)}x
          </span>
          <span className="flex items-center gap-1 text-xs font-medium text-emerald-400">
            <TrendingUp className="h-3.5 w-3.5" />+{((velocityFactor - 1.0) * 100).toFixed(0)}%{" "}
            {t("vs_baseline")}
          </span>
        </div>

        <p className="text-fg-muted mt-3 text-xs leading-relaxed">{t("delta_v_description")}</p>
      </motion.div>

      {/* Avg Capability Jump Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative overflow-hidden rounded-2xl border border-white/10 bg-neutral-900/60 p-6 shadow-xl backdrop-blur-xl transition-all duration-300 hover:border-white/20"
      >
        <div className="flex items-center justify-between">
          <span className="text-fg-muted text-xs font-medium">{t("avg_jump_title")}</span>
          <Cpu className="h-4 w-4 text-purple-400" />
        </div>
        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-fg-primary text-3xl font-bold">+{avgJumpPct}%</span>
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-xs text-purple-400">
          <Activity className="h-3.5 w-3.5" />
          <span>
            {totalModelsTracked} {t("models_audited")}
          </span>
        </div>
      </motion.div>

      {/* Base ARR & Active Clients Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative overflow-hidden rounded-2xl border border-white/10 bg-neutral-900/60 p-6 shadow-xl backdrop-blur-xl transition-all duration-300 hover:border-white/20"
      >
        <div className="flex items-center justify-between">
          <span className="text-fg-muted text-xs font-medium">{t("base_arr_title")}</span>
          <Rocket className="h-4 w-4 text-amber-400" />
        </div>
        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-fg-primary text-3xl font-bold">
            ${(baseARR / 1000).toFixed(0)}k
          </span>
          <span className="text-fg-muted text-xs">ARR</span>
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-400">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>
            {clientCount} {t("enterprise_clients")}
          </span>
        </div>
      </motion.div>
    </div>
  );
}
