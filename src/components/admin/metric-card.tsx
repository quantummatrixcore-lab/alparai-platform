"use client";

import React from "react";
import type { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { LineChart, Line, BarChart, Bar, ResponsiveContainer, Tooltip } from "recharts";

interface SparkPoint {
  value: number;
}

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  trendLabel?: string;
  sparkData?: SparkPoint[];
  chartType?: "line" | "bar";
  accentColor?: string;
  badge?: string;
  badgeColor?: string;
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendLabel,
  sparkData,
  chartType = "line",
  accentColor = "#6366f1",
  badge,
  badgeColor = "text-emerald-400",
}: MetricCardProps) {
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor =
    trend === "up" ? "text-emerald-400" : trend === "down" ? "text-red-400" : "text-zinc-400";

  return (
    <div className="rounded-xl border border-white/10 bg-zinc-900/80 p-4 transition-all hover:border-white/20">
      <div className="flex items-center justify-between text-xs text-zinc-400">
        <span>{title}</span>
        <Icon className="h-4 w-4" style={{ color: accentColor }} />
      </div>

      <div className="mt-2 flex items-baseline justify-between">
        <span className="text-2xl font-black text-white">{value}</span>
        {badge && <span className={`text-xs font-bold ${badgeColor}`}>{badge}</span>}
      </div>

      {subtitle && <p className="mt-1 text-[11px] text-zinc-400">{subtitle}</p>}

      {sparkData && sparkData.length > 1 && (
        <div className="mt-3 h-10">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "bar" ? (
              <BarChart data={sparkData}>
                <Bar dataKey="value" fill={accentColor} radius={[2, 2, 0, 0]} />
                <Tooltip
                  contentStyle={{ background: "#18181b", border: "none", fontSize: 10 }}
                  cursor={false}
                />
              </BarChart>
            ) : (
              <LineChart data={sparkData}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={accentColor}
                  strokeWidth={1.5}
                  dot={false}
                />
                <Tooltip
                  contentStyle={{ background: "#18181b", border: "none", fontSize: 10 }}
                  cursor={false}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      )}

      {trend && trendLabel && (
        <div className={`mt-2 flex items-center gap-1 text-[11px] ${trendColor}`}>
          <TrendIcon className="h-3 w-3" />
          <span>{trendLabel}</span>
        </div>
      )}
    </div>
  );
}
