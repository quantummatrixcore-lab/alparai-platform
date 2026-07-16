"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Database,
  HardDrives,
  Cpu,
  ChartLineUp,
  WarningCircle,
  CheckCircle,
  Lightning,
  Brain,
} from "@phosphor-icons/react";

export function ResourcesClient() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Mock data for resource utilization
  const overallEfficiency = 94.2; // Kaynak Verimli Kullanma Yüzdesi

  const resources = [
    {
      id: "db",
      name: "Supabase Database",
      icon: Database,
      usage: "412 MB",
      limit: "500 MB (Free Tier)",
      percentage: 82.4,
      status: "warning",
      color: "text-amber-400",
      bg: "bg-amber-400/20",
      border: "border-amber-500/30",
      trend: "+12 MB this week",
    },
    {
      id: "compute",
      name: "Vercel Edge Functions",
      icon: Lightning,
      usage: "142,000",
      limit: "500,000 requests",
      percentage: 28.4,
      status: "good",
      color: "text-emerald-400",
      bg: "bg-emerald-400/20",
      border: "border-emerald-500/30",
      trend: "Steady",
    },
    {
      id: "storage",
      name: "Object Storage",
      icon: HardDrives,
      usage: "1.2 GB",
      limit: "2 GB",
      percentage: 60.0,
      status: "good",
      color: "text-blue-400",
      bg: "bg-blue-400/20",
      border: "border-blue-500/30",
      trend: "+50 MB this week",
    },
    {
      id: "ai",
      name: "AI Tokens (Spark/Gemini)",
      icon: Brain,
      usage: "4.2M",
      limit: "10M limit",
      percentage: 42.0,
      status: "good",
      color: "text-brand-400",
      bg: "bg-brand-400/20",
      border: "border-brand-500/30",
      trend: "High efficiency (+14%)",
    },
  ];

  return (
    <div className="space-y-8 p-2 lg:p-6">
      {/* Header & Overall Efficiency */}
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div>
          <h1 className="mb-2 text-3xl font-black tracking-tight text-white">
            Resource Efficiency
          </h1>
          <p className="text-fg-secondary text-sm">
            Monitor and optimize system resource utilization
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="to-brand-500/10 relative flex items-center gap-4 rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 px-6 py-4 shadow-[0_0_30px_rgba(16,185,129,0.15)]"
        >
          <div className="rounded-full bg-emerald-500/20 p-3">
            <ChartLineUp className="h-8 w-8 text-emerald-400" />
          </div>
          <div>
            <div className="mb-1 text-xs font-bold tracking-widest text-emerald-400 uppercase">
              Overall Efficiency
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black text-white">{overallEfficiency}</span>
              <span className="text-fg-secondary text-xl">%</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {resources.map((res, i) => {
          const Icon = res.icon;
          return (
            <motion.div
              key={res.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={
                "bg-bg-secondary group hover:border-opacity-50 relative overflow-hidden rounded-2xl border p-6 transition-all duration-300 " +
                res.border
              }
            >
              {/* Background Glow */}
              <div
                className={
                  "pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full opacity-20 blur-[50px] transition-opacity duration-500 group-hover:opacity-40 " +
                  res.bg
                }
              />

              <div className="mb-6 flex items-center justify-between">
                <div className={"rounded-xl border p-3 " + res.bg + " " + res.border}>
                  <Icon className={"h-6 w-6 " + res.color} />
                </div>
                {res.percentage > 80 ? (
                  <div className="flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1">
                    <WarningCircle className="h-3.5 w-3.5 text-amber-400" />
                    <span className="text-[10px] font-bold tracking-wider text-amber-400 uppercase">
                      Warning
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1">
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-[10px] font-bold tracking-wider text-emerald-400 uppercase">
                      Healthy
                    </span>
                  </div>
                )}
              </div>

              <h3 className="mb-1 text-lg font-bold text-white">{res.name}</h3>
              <p className="text-fg-secondary mb-6 text-sm">
                {res.usage} <span className="text-fg-muted">/ {res.limit}</span>
              </p>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-fg-secondary">Usage</span>
                  <span className="text-white">{res.percentage}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: res.percentage + "%" }}
                    transition={{ duration: 1, ease: "easeOut", delay: i * 0.1 + 0.2 }}
                    className={
                      "h-full rounded-full " +
                      (res.percentage > 80 ? "bg-amber-400" : "bg-emerald-400")
                    }
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4 text-xs">
                <span className="text-fg-muted">Trend</span>
                <span className="text-fg-secondary font-medium">{res.trend}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Optimization Suggestions Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 rounded-2xl border border-white/5 bg-gradient-to-b from-white/5 to-transparent p-6 lg:p-8"
      >
        <h3 className="mb-6 flex items-center gap-3 text-xl font-bold text-white">
          <Cpu className="text-brand-400 h-6 w-6" />
          Optimization Recommendations
        </h3>

        <div className="space-y-4">
          <div className="flex items-start gap-4 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
            <WarningCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
            <div>
              <h4 className="mb-1 text-sm font-bold text-white">
                Database approaching Free Tier limits
              </h4>
              <p className="text-sm text-amber-200/70">
                Supabase DB is at 82.4% capacity. Consider setting up a cleanup cron job for stale
                marketing drafts or upgrading the plan.
              </p>
            </div>
          </div>

          <div className="border-brand-500/20 bg-brand-500/5 flex items-start gap-4 rounded-xl border p-4">
            <Brain className="text-brand-400 mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <h4 className="mb-1 text-sm font-bold text-white">AI Caching active</h4>
              <p className="text-brand-200/70 text-sm">
                Spark semantic cache is catching 42% of identical requests, saving approximately
                1.2M tokens this week. Great efficiency.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
