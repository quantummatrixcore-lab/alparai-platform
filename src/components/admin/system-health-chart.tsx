"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";

import { useTranslations } from "next-intl";

const MOCK_DATA = [
  { name: "Mon", incidents: 12, resolutions: 10, apiHits: 4000 },
  { name: "Tue", incidents: 19, resolutions: 15, apiHits: 5200 },
  { name: "Wed", incidents: 15, resolutions: 18, apiHits: 4800 },
  { name: "Thu", incidents: 22, resolutions: 20, apiHits: 6100 },
  { name: "Fri", incidents: 28, resolutions: 25, apiHits: 7500 },
  { name: "Sat", incidents: 35, resolutions: 30, apiHits: 8200 },
  { name: "Sun", incidents: 20, resolutions: 35, apiHits: 5000 },
];

export function SystemHealthChart() {
  const t = useTranslations("admin");

  return (
    <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Area Chart: Incidents vs Resolutions */}
      <div className="bg-bg-secondary/40 rounded-2xl border border-white/5 p-6 shadow-lg backdrop-blur-xl">
        <div className="mb-6">
          <h3 className="font-bold tracking-tight text-white">
            {t("health_chart_title_incidents", { defaultValue: "Incidents vs Resolutions" })}
          </h3>
          <p className="text-fg-muted mt-1 font-mono text-xs">
            {t("health_chart_trajectory", { defaultValue: "7-Day Trajectory" })}
          </p>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MOCK_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorIncidents" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorResolutions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.05)"
                vertical={false}
              />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={11} tickMargin={10} />
              <YAxis stroke="rgba(255,255,255,0.2)" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(10,10,10,0.9)",
                  borderColor: "rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                }}
                itemStyle={{ fontSize: "12px", fontWeight: "bold" }}
              />
              <Legend iconType="circle" wrapperStyle={{ fontSize: "12px" }} />
              <Area
                type="monotone"
                dataKey="incidents"
                stroke="#f43f5e"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorIncidents)"
                name={t("health_chart_incidents")}
              />
              <Area
                type="monotone"
                dataKey="resolutions"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorResolutions)"
                name={t("health_chart_resolved")}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar Chart: API Traffic */}
      <div className="bg-bg-secondary/40 rounded-2xl border border-white/5 p-6 shadow-lg backdrop-blur-xl">
        <div className="mb-6">
          <h3 className="font-bold tracking-tight text-white">
            {t("health_chart_title_api", { defaultValue: "API Gateway Traffic" })}
          </h3>
          <p className="text-fg-muted mt-1 font-mono text-xs">
            {t("health_chart_volume", { defaultValue: "Daily Requests Volume" })}
          </p>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={MOCK_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorApi" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#a855f7" stopOpacity={0.8} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.05)"
                vertical={false}
              />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={11} tickMargin={10} />
              <YAxis stroke="rgba(255,255,255,0.2)" fontSize={11} />
              <Tooltip
                cursor={{ fill: "rgba(255,255,255,0.05)" }}
                contentStyle={{
                  backgroundColor: "rgba(10,10,10,0.9)",
                  borderColor: "rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                }}
              />
              <Bar
                dataKey="apiHits"
                fill="url(#colorApi)"
                radius={[4, 4, 0, 0]}
                name={t("health_chart_api_hits")}
                barSize={30}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
