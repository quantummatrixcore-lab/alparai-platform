"use client";

import { useState, useEffect } from "react";
import { TrendUp, TrendDown, Minus } from "@phosphor-icons/react";
import { Gauge } from "@/components/admin/premium/gauge";
import { LivePulseRing } from "@/components/admin/premium/live-pulse-ring";
import { AnimatedCounter } from "@/components/admin/premium/animated-counter";
import { DataFlowDiagram } from "@/components/admin/premium/data-flow-diagram";
import { AdminSectionCard } from "@/components/admin/admin-design-kit";

interface Signal {
  name: string;
  category: "performance" | "security" | "reliability" | "ux";
  value: number;
  threshold: number;
  trend: "up" | "down" | "stable";
  status: "healthy" | "warning" | "danger";
  description: string;
}

export function SignalsClient() {
  const [signals, setSignals] = useState<Signal[]>([
    {
      name: "Core Web Vitals",
      category: "performance",
      value: 92,
      threshold: 85,
      trend: "up",
      status: "healthy",
      description: "LCP, FID, CLS combined score",
    },
    {
      name: "Security Headers",
      category: "security",
      value: 100,
      threshold: 90,
      trend: "stable",
      status: "healthy",
      description: "CSP, HSTS, X-Frame compliance",
    },
    {
      name: "API Error Budget",
      category: "reliability",
      value: 88,
      threshold: 80,
      trend: "down",
      status: "healthy",
      description: "Remaining error budget %",
    },
    {
      name: "User Session Health",
      category: "ux",
      value: 76,
      threshold: 70,
      trend: "up",
      status: "healthy",
      description: "Active session success rate",
    },
    {
      name: "Rate Limit Usage",
      category: "security",
      value: 34,
      threshold: 80,
      trend: "stable",
      status: "healthy",
      description: "Global rate limit utilization",
    },
    {
      name: "DB Connection Pool",
      category: "reliability",
      value: 62,
      threshold: 75,
      trend: "up",
      status: "healthy",
      description: "Supabase connection pool usage",
    },
    {
      name: "CDN Cache Hit",
      category: "performance",
      value: 94,
      threshold: 85,
      trend: "up",
      status: "healthy",
      description: "Vercel edge cache efficiency",
    },
    {
      name: "Auth Success Rate",
      category: "ux",
      value: 98.5,
      threshold: 95,
      trend: "stable",
      status: "healthy",
      description: "Login/signup completion rate",
    },
    {
      name: "PII Scan Coverage",
      category: "security",
      value: 100,
      threshold: 100,
      trend: "stable",
      status: "healthy",
      description: "All submissions PII-masked",
    },
    {
      name: "Incident Response",
      category: "reliability",
      value: 67,
      threshold: 80,
      trend: "down",
      status: "warning",
      description: "Avg response time score",
    },
    {
      name: "Mobile Performance",
      category: "ux",
      value: 81,
      threshold: 75,
      trend: "up",
      status: "healthy",
      description: "Mobile Lighthouse aggregate",
    },
    {
      name: "Bundle Size",
      category: "performance",
      value: 73,
      threshold: 70,
      trend: "down",
      status: "warning",
      description: "JS bundle efficiency score",
    },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSignals((prev) =>
        prev.map((sig) => {
          const jitter = (Math.random() - 0.5) * 4;
          const newValue = Math.max(0, Math.min(100, sig.value + jitter));
          const status =
            newValue >= sig.threshold
              ? "healthy"
              : newValue >= sig.threshold * 0.85
                ? "warning"
                : "danger";
          return { ...sig, value: Number(newValue.toFixed(1)), status };
        }),
      );
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const categories = [
    { key: "performance" as const, label: "Performance", color: "text-cyan-400" },
    { key: "security" as const, label: "Security", color: "text-emerald-400" },
    { key: "reliability" as const, label: "Reliability", color: "text-purple-400" },
    { key: "ux" as const, label: "User Experience", color: "text-amber-400" },
  ];

  const healthyCount = signals.filter((s) => s.status === "healthy").length;
  const warningCount = signals.filter((s) => s.status === "warning").length;
  const dangerCount = signals.filter((s) => s.status === "danger").length;

  const flowNodes = [
    { id: "user", label: "User", x: 15, y: 50, status: "active" as const },
    { id: "cdn", label: "CDN", x: 30, y: 30, status: "active" as const },
    { id: "api", label: "API", x: 50, y: 50, status: "active" as const },
    { id: "db", label: "DB", x: 70, y: 30, status: "active" as const },
    { id: "auth", label: "Auth", x: 70, y: 70, status: "active" as const },
    { id: "ai", label: "AI Engine", x: 88, y: 50, status: "active" as const },
  ];
  const flowEdges = [
    { from: "user", to: "cdn", active: true },
    { from: "cdn", to: "api", active: true },
    { from: "api", to: "db", active: true },
    { from: "api", to: "auth", active: true },
    { from: "api", to: "ai", active: true },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-2 text-xs font-medium text-amber-400">
        <span>Signal Telemetry Stream</span>
        <span className="rounded bg-amber-500/20 px-2 py-0.5 font-mono text-[10px] uppercase">SIMULATION MODE — Realtime Jitter</span>
      </div>
      {/* Overall Signal Status */}
      <AdminSectionCard title="Signal Overview">
        <div className="flex flex-wrap items-center justify-around gap-6 p-6">
          <div className="flex flex-col items-center gap-2">
            <Gauge
              value={(healthyCount / signals.length) * 100}
              size="lg"
              sublabel="%"
              variant="success"
            />
            <span className="text-fg-muted text-[10px] font-bold tracking-wider uppercase">
              Overall Health
            </span>
          </div>
          <div className="flex gap-8">
            <div className="text-center">
              <AnimatedCounter value={healthyCount} className="text-3xl text-emerald-400" />
              <p className="text-fg-muted text-[10px] font-bold">Healthy</p>
            </div>
            <div className="text-center">
              <AnimatedCounter value={warningCount} className="text-3xl text-amber-400" />
              <p className="text-fg-muted text-[10px] font-bold">Warning</p>
            </div>
            <div className="text-center">
              <AnimatedCounter value={dangerCount} className="text-3xl text-rose-400" />
              <p className="text-fg-muted text-[10px] font-bold">Critical</p>
            </div>
          </div>
        </div>
      </AdminSectionCard>

      {/* Data Flow Diagram */}
      <DataFlowDiagram nodes={flowNodes} edges={flowEdges} title="System Data Flow" />

      {/* Signal Categories */}
      {categories.map((cat) => {
        const catSignals = signals.filter((s) => s.category === cat.key);
        if (catSignals.length === 0) return null;
        return (
          <AdminSectionCard key={cat.key} title={cat.label}>
            <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
              {catSignals.map((sig) => (
                <div
                  key={sig.name}
                  className="bg-bg-secondary/60 border-border-subtle hover:bg-bg-secondary/80 flex flex-col gap-3 rounded-xl border p-4 transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-fg-primary text-sm font-bold">{sig.name}</span>
                    <LivePulseRing status={sig.status} size="sm" />
                  </div>
                  <div className="flex items-end gap-3">
                    <Gauge
                      value={sig.value}
                      size="sm"
                      variant={sig.status === "healthy" ? "success" : sig.status}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-1">
                        {sig.trend === "up" && <TrendUp className="h-3 w-3 text-emerald-400" />}
                        {sig.trend === "down" && <TrendDown className="h-3 w-3 text-rose-400" />}
                        {sig.trend === "stable" && <Minus className="text-fg-muted h-3 w-3" />}
                        <span className="font-mono text-lg font-black text-white">{sig.value}</span>
                        <span className="text-fg-muted text-[10px]">/ {sig.threshold}</span>
                      </div>
                      <p className="text-fg-muted text-[10px]">{sig.description}</p>
                    </div>
                  </div>
                  <div className="h-1 w-full overflow-hidden rounded-full bg-white/5">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        sig.status === "healthy"
                          ? "bg-emerald-500"
                          : sig.status === "warning"
                            ? "bg-amber-500"
                            : "bg-rose-500"
                      }`}
                      style={{ width: `${Math.min(sig.value, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </AdminSectionCard>
        );
      })}
    </div>
  );
}
