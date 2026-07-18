"use client";

import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Gauge } from "@/components/admin/premium/gauge";
import { AnimatedCounter } from "@/components/admin/premium/animated-counter";
import { StatusPill } from "@/components/admin/premium/status-pill";
import { AdminSectionCard } from "@/components/admin/admin-design-kit";

export function ApiMetricsClient() {
  const [metrics, setMetrics] = useState({
    requests24h: 12847,
    avgLatency: 142,
    errorRate: 0.12,
    p99Latency: 389,
  });

  const [trafficData, setTrafficData] = useState<
    { hour: string; requests: number; errors: number }[]
  >([]);

  useEffect(() => {
    const hours = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, "0")}:00`);
    const initial = hours.map((hour) => ({
      hour,
      requests: Math.floor(Math.random() * 800) + 200,
      errors: Math.floor(Math.random() * 5),
    }));
    setTrafficData(initial);

    const interval = setInterval(() => {
      setTrafficData((prev) => {
        const next = [...prev];
        const lastIdx = next.length - 1;
        const last = next[lastIdx];
        if (last) {
          next[lastIdx] = {
            ...last,
            requests: Math.max(50, last.requests + Math.floor(Math.random() * 100) - 50),
            errors: Math.max(0, last.errors + Math.floor(Math.random() * 3) - 1),
          };
        }
        return next;
      });
      setMetrics((m) => ({
        ...m,
        requests24h: m.requests24h + Math.floor(Math.random() * 50),
        avgLatency: Math.max(80, Math.min(300, m.avgLatency + Math.floor(Math.random() * 20) - 10)),
        errorRate: Math.max(0, Math.min(2, m.errorRate + Math.random() * 0.05 - 0.025)),
      }));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const endpoints = [
    {
      name: "POST /api/incidents",
      method: "POST",
      status: "healthy" as const,
      latency: "89ms",
      rps: "42/s",
      uptime: 99.99,
    },
    {
      name: "GET /api/providers",
      method: "GET",
      status: "healthy" as const,
      latency: "34ms",
      rps: "128/s",
      uptime: 100,
    },
    {
      name: "POST /api/auth/callback",
      method: "POST",
      status: "healthy" as const,
      latency: "210ms",
      rps: "8/s",
      uptime: 99.95,
    },
    {
      name: "GET /api/moderation/queue",
      method: "GET",
      status: "warning" as const,
      latency: "456ms",
      rps: "3/s",
      uptime: 99.8,
    },
    {
      name: "POST /api/webhooks/stripe",
      method: "POST",
      status: "healthy" as const,
      latency: "178ms",
      rps: "1/s",
      uptime: 99.99,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Metric Gauges */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <AdminSectionCard>
          <div className="flex flex-col items-center gap-2 p-4">
            <Gauge
              value={Math.min((metrics.requests24h / 20000) * 100, 100)}
              size="md"
              sublabel="/ 20K"
            />
            <span className="text-fg-muted text-[10px] font-bold tracking-wider uppercase">
              Requests (24h)
            </span>
            <AnimatedCounter value={metrics.requests24h} className="text-xl text-white" />
          </div>
        </AdminSectionCard>
        <AdminSectionCard>
          <div className="flex flex-col items-center gap-2 p-4">
            <Gauge
              value={Math.max(0, 100 - metrics.avgLatency / 5)}
              size="md"
              sublabel="ms"
              variant={metrics.avgLatency < 200 ? "success" : "warning"}
            />
            <span className="text-fg-muted text-[10px] font-bold tracking-wider uppercase">
              Avg Latency
            </span>
            <AnimatedCounter
              value={metrics.avgLatency}
              suffix="ms"
              className="text-xl text-white"
            />
          </div>
        </AdminSectionCard>
        <AdminSectionCard>
          <div className="flex flex-col items-center gap-2 p-4">
            <Gauge
              value={Math.max(0, 100 - metrics.errorRate * 50)}
              size="md"
              sublabel="%"
              variant={metrics.errorRate < 0.5 ? "success" : "danger"}
            />
            <span className="text-fg-muted text-[10px] font-bold tracking-wider uppercase">
              Error Rate
            </span>
            <AnimatedCounter
              value={metrics.errorRate}
              decimals={2}
              suffix="%"
              className="text-xl text-white"
            />
          </div>
        </AdminSectionCard>
        <AdminSectionCard>
          <div className="flex flex-col items-center gap-2 p-4">
            <Gauge
              value={Math.max(0, 100 - metrics.p99Latency / 10)}
              size="md"
              sublabel="ms"
              variant={metrics.p99Latency < 500 ? "success" : "warning"}
            />
            <span className="text-fg-muted text-[10px] font-bold tracking-wider uppercase">
              P99 Latency
            </span>
            <AnimatedCounter
              value={metrics.p99Latency}
              suffix="ms"
              className="text-xl text-white"
            />
          </div>
        </AdminSectionCard>
      </div>

      {/* Traffic Chart */}
      <AdminSectionCard title="Traffic Overview (24h)">
        <div className="p-6">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorReqs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorErrors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e63946" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#e63946" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.05)"
                  vertical={false}
                />
                <XAxis
                  dataKey="hour"
                  stroke="rgba(255,255,255,0.2)"
                  tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  interval={3}
                />
                <YAxis
                  stroke="rgba(255,255,255,0.2)"
                  tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0E1622",
                    borderColor: "rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="requests"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorReqs)"
                />
                <Area
                  type="monotone"
                  dataKey="errors"
                  stroke="#e63946"
                  strokeWidth={1.5}
                  fillOpacity={1}
                  fill="url(#colorErrors)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex items-center gap-6 text-xs">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-cyan-500" /> Requests
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-rose-500" /> Errors
            </span>
          </div>
        </div>
      </AdminSectionCard>

      {/* Endpoints Status */}
      <AdminSectionCard title="Endpoint Health">
        <div className="space-y-2 p-4">
          {endpoints.map((ep) => (
            <StatusPill
              key={ep.name}
              name={ep.name}
              status={ep.status}
              uptime={ep.uptime}
              latency={ep.latency}
            />
          ))}
        </div>
      </AdminSectionCard>
    </div>
  );
}
