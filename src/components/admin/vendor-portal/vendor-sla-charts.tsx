"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Activity } from "lucide-react";
import type { SlaChartPoint } from "@/actions/admin/vendor-portal";

interface VendorSlaChartsProps {
  data: SlaChartPoint[];
}

export function VendorSlaCharts({ data }: VendorSlaChartsProps) {
  return (
    <div className="space-y-4 rounded-3xl border border-white/10 bg-zinc-900/40 p-6 shadow-2xl backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="text-brand-400 h-5 w-5" />
          <h2 className="text-lg font-bold text-white">SLA Uptime Trends (%)</h2>
        </div>
        <span className="font-mono text-xs text-zinc-400">Last 7 Days Telemetry</span>
      </div>

      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorAnthropic" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorGoogle" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorOpenai" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="date" stroke="rgba(255,255,255,0.4)" style={{ fontSize: 12 }} />
            <YAxis
              domain={[99.5, 100]}
              stroke="rgba(255,255,255,0.4)"
              style={{ fontSize: 11 }}
              tickFormatter={(val) => `${val}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#18181b",
                borderColor: "rgba(255,255,255,0.1)",
                borderRadius: "12px",
                color: "#ffffff",
                fontSize: "12px",
              }}
            />
            <Legend wrapperStyle={{ paddingTop: "10px" }} />
            <Area
              type="monotone"
              dataKey="anthropic"
              name="Anthropic"
              stroke="#a855f7"
              fillOpacity={1}
              fill="url(#colorAnthropic)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="google"
              name="Google"
              stroke="#10b981"
              fillOpacity={1}
              fill="url(#colorGoogle)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="openai"
              name="OpenAI"
              stroke="#3b82f6"
              fillOpacity={1}
              fill="url(#colorOpenai)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
