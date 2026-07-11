"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

interface CostTrendProps {
  data: Record<string, unknown>[];
}

export function CostTrendChart({ data }: CostTrendProps) {
  const t = useTranslations("finance");

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h4 className="font-semibold text-zinc-950 dark:text-zinc-50">{t("costTrendTitle")}</h4>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{t("costTrendSubtitle")}</p>
        </div>
      </div>

      <div className="mt-8 h-80 w-full text-xs">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-primary, #3b82f6)" stopOpacity={0.2} />
                <stop offset="95%" stopColor="var(--color-primary, #3b82f6)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              className="stroke-zinc-100 dark:stroke-zinc-900"
            />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              className="fill-zinc-500 dark:fill-zinc-400"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              className="fill-zinc-500 dark:fill-zinc-400"
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--bg-zinc-950, #09090b)",
                borderColor: "var(--border-zinc-800, #27272a)",
                borderRadius: "8px",
                color: "#f4f4f5",
              }}
              labelStyle={{ fontWeight: "bold", marginBottom: "4px" }}
              formatter={(value) => [`$${Number(value).toFixed(2)}`]}
            />
            <Legend verticalAlign="top" height={36} />
            <Area
              type="monotone"
              name={t("totalCost")}
              dataKey="Toplam"
              stroke="var(--color-primary, #3b82f6)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorTotal)"
            />
            <Area
              type="monotone"
              name="Vercel"
              dataKey="vercel"
              stroke="#71717a"
              strokeWidth={1.5}
              fillOpacity={0}
            />
            <Area
              type="monotone"
              name="Gemini"
              dataKey="gemini"
              stroke="#60a5fa"
              strokeWidth={1.5}
              fillOpacity={0}
            />
            <Area
              type="monotone"
              name="Anthropic"
              dataKey="anthropic"
              stroke="#fb923c"
              strokeWidth={1.5}
              fillOpacity={0}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
