"use client";

import { useState, useEffect } from "react";
import { Gauge } from "@/components/admin/premium/gauge";
import { LivePulseRing } from "@/components/admin/premium/live-pulse-ring";
import { AnimatedCounter } from "@/components/admin/premium/animated-counter";
import { AdminSectionCard } from "@/components/admin/admin-design-kit";

interface SloTarget {
  name: string;
  target: number;
  current: number;
  unit: string;
  status: "healthy" | "warning" | "danger";
  window: string;
  errorBudget: { total: number; remaining: number };
}

export function SloDashboardClient() {
  const [slos, setSlos] = useState<SloTarget[]>([
    {
      name: "Availability",
      target: 99.9,
      current: 99.97,
      unit: "%",
      status: "healthy",
      window: "30d rolling",
      errorBudget: { total: 43.2, remaining: 41.8 },
    },
    {
      name: "Latency P50",
      target: 200,
      current: 142,
      unit: "ms",
      status: "healthy",
      window: "7d rolling",
      errorBudget: { total: 100, remaining: 82 },
    },
    {
      name: "Latency P99",
      target: 500,
      current: 389,
      unit: "ms",
      status: "healthy",
      window: "7d rolling",
      errorBudget: { total: 100, remaining: 71 },
    },
    {
      name: "Error Rate",
      target: 1.0,
      current: 0.12,
      unit: "%",
      status: "healthy",
      window: "24h rolling",
      errorBudget: { total: 100, remaining: 88 },
    },
    {
      name: "Incident Response",
      target: 240,
      current: 180,
      unit: "min",
      status: "warning",
      window: "30d rolling",
      errorBudget: { total: 240, remaining: 60 },
    },
    {
      name: "Data Freshness",
      target: 3600,
      current: 45,
      unit: "sec",
      status: "healthy",
      window: "realtime",
      errorBudget: { total: 3600, remaining: 3555 },
    },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSlos((prev) =>
        prev.map((slo) => {
          const jitter = (Math.random() - 0.5) * (slo.current * 0.02);
          const newCurrent = Math.max(0, slo.current + jitter);
          const status =
            slo.unit === "%"
              ? newCurrent >= slo.target * 0.999
                ? "healthy"
                : newCurrent >= slo.target * 0.99
                  ? "warning"
                  : "danger"
              : newCurrent <= slo.target * 1.1
                ? "healthy"
                : newCurrent <= slo.target * 1.3
                  ? "warning"
                  : "danger";
          return { ...slo, current: Number(newCurrent.toFixed(slo.unit === "%" ? 2 : 0)), status };
        }),
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const [dora, setDora] = useState<{
    summary?: {
      deployment_frequency_rating: string;
      lead_time_rating: string;
      change_failure_rate_rating: string;
      mttr_rating: string;
    };
    current?: {
      deployment_frequency: number;
      lead_time_minutes: number;
      change_failure_rate: number;
      mttr_minutes: number;
    };
  }>({});

  useEffect(() => {
    fetch("/api/dora/metrics")
      .then((res) => res.json())
      .then((data) => setDora(data))
      .catch(() => {});
  }, []);

  const totalBudget = slos.reduce((a, s) => a + s.errorBudget.total, 0);
  const usedBudget = slos.reduce((a, s) => a + (s.errorBudget.total - s.errorBudget.remaining), 0);
  const budgetPercent = totalBudget > 0 ? ((totalBudget - usedBudget) / totalBudget) * 100 : 100;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-2 text-xs font-medium text-amber-400">
        <span>SLO & DORA Performance Dashboard</span>
        <span className="rounded bg-amber-500/20 px-2 py-0.5 font-mono text-[10px] uppercase">SIMULATION MODE — Synthetic Jitter</span>
      </div>

      {/* DORA Metrics Visualization (Item 132-UI) */}
      <AdminSectionCard title="DORA Metrics (4 Core Accelerate Indicators)">
        <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-fg-muted">Deployment Frequency</span>
              <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                {dora.summary?.deployment_frequency_rating || "High"}
              </span>
            </div>
            <p className="mt-2 text-2xl font-black text-white">
              {dora.current?.deployment_frequency ?? 2.4} <span className="text-xs font-normal text-fg-muted">/ day</span>
            </p>
            <p className="mt-1 text-[10px] text-fg-muted">Target: Daily continuous deploys</p>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-fg-muted">Lead Time for Changes</span>
              <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                {dora.summary?.lead_time_rating || "Elite"}
              </span>
            </div>
            <p className="mt-2 text-2xl font-black text-white">
              {dora.current?.lead_time_minutes ?? 14} <span className="text-xs font-normal text-fg-muted">min</span>
            </p>
            <p className="mt-1 text-[10px] text-fg-muted">Commit to production deploy</p>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-fg-muted">Change Failure Rate</span>
              <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                {dora.summary?.change_failure_rate_rating || "Elite"}
              </span>
            </div>
            <p className="mt-2 text-2xl font-black text-white">
              {dora.current?.change_failure_rate ?? 0}%
            </p>
            <p className="mt-1 text-[10px] text-fg-muted">Failed builds / deploys</p>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-fg-muted">Time to Restore (MTTR)</span>
              <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                {dora.summary?.mttr_rating || "Elite"}
              </span>
            </div>
            <p className="mt-2 text-2xl font-black text-white">
              {dora.current?.mttr_minutes ?? 8} <span className="text-xs font-normal text-fg-muted">min</span>
            </p>
            <p className="mt-1 text-[10px] text-fg-muted">Mean time to recovery</p>
          </div>
        </div>
      </AdminSectionCard>
      {/* Overall SLO Score */}
      <AdminSectionCard title="Overall SLO Health">
        <div className="flex flex-wrap items-center justify-around gap-8 p-8">
          <div className="flex flex-col items-center gap-3">
            <Gauge
              value={budgetPercent}
              size="lg"
              sublabel="%"
              variant={budgetPercent > 80 ? "success" : budgetPercent > 50 ? "warning" : "danger"}
            />
            <span className="text-fg-muted text-[10px] font-bold tracking-wider uppercase">
              Error Budget Remaining
            </span>
          </div>
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-3">
              <LivePulseRing
                status={
                  slos.every((s) => s.status === "healthy")
                    ? "healthy"
                    : slos.some((s) => s.status === "danger")
                      ? "danger"
                      : "warning"
                }
                size="lg"
              />
              <div className="text-center">
                <AnimatedCounter
                  value={slos.filter((s) => s.status === "healthy").length}
                  className="text-4xl text-white"
                />
                <span className="text-fg-muted text-xl text-white"> / {slos.length}</span>
                <p className="text-fg-muted text-[10px] font-bold tracking-wider uppercase">
                  SLOs Meeting Target
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="flex gap-4">
              <div className="text-center">
                <p className="font-mono text-2xl font-black text-emerald-400">
                  {slos.filter((s) => s.status === "healthy").length}
                </p>
                <p className="text-fg-muted text-[10px] font-bold">Healthy</p>
              </div>
              <div className="text-center">
                <p className="font-mono text-2xl font-black text-amber-400">
                  {slos.filter((s) => s.status === "warning").length}
                </p>
                <p className="text-fg-muted text-[10px] font-bold">Warning</p>
              </div>
              <div className="text-center">
                <p className="font-mono text-2xl font-black text-rose-400">
                  {slos.filter((s) => s.status === "danger").length}
                </p>
                <p className="text-fg-muted text-[10px] font-bold">Breach</p>
              </div>
            </div>
          </div>
        </div>
      </AdminSectionCard>

      {/* Individual SLO Gauges */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {slos.map((slo) => (
          <AdminSectionCard key={slo.name}>
            <div className="flex flex-col items-center gap-4 p-6">
              <div className="flex w-full items-center justify-between">
                <span className="text-fg-primary text-sm font-bold">{slo.name}</span>
                <LivePulseRing status={slo.status} size="sm" />
              </div>
              <Gauge
                value={
                  slo.unit === "%"
                    ? slo.current
                    : Math.max(0, 100 - (slo.current / slo.target) * 100)
                }
                size="md"
                sublabel={slo.unit}
                variant={slo.status === "healthy" ? "success" : slo.status}
              />
              <div className="w-full">
                <div className="flex justify-between text-[10px]">
                  <span className="text-fg-muted">
                    Target: {slo.target}
                    {slo.unit}
                  </span>
                  <span className="text-fg-muted">{slo.window}</span>
                </div>
                <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      slo.status === "healthy"
                        ? "bg-emerald-500"
                        : slo.status === "warning"
                          ? "bg-amber-500"
                          : "bg-rose-500"
                    }`}
                    style={{
                      width: `${(slo.errorBudget.remaining / slo.errorBudget.total) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-fg-muted mt-1 block text-right text-[9px]">
                  Budget: {slo.errorBudget.remaining.toFixed(1)}/{slo.errorBudget.total}
                  {slo.unit === "%" ? "min" : ""}
                </span>
              </div>
            </div>
          </AdminSectionCard>
        ))}
      </div>
    </div>
  );
}
