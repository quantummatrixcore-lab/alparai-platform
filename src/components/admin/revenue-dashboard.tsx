"use client";

import { useTranslations } from "next-intl";
import { CurrencyDollar, TrendUp, Users } from "@phosphor-icons/react/dist/ssr";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Jan", mrr: 12000 },
  { name: "Feb", mrr: 15000 },
  { name: "Mar", mrr: 18000 },
  { name: "Apr", mrr: 22000 },
  { name: "May", mrr: 26000 },
  { name: "Jun", mrr: 34000 },
];

export function RevenueDashboard() {
  const t = useTranslations("admin");

  return (
    <div className="border-t-brand-500/30 mb-8 rounded-lg border border-white/10 bg-neutral-900/60 p-6 shadow-md backdrop-blur-xl">
      <div className="mb-5 flex items-center justify-between border-b border-white/5 pb-3">
        <h2 className="text-md inline-flex items-center gap-2 font-semibold text-white">
          <CurrencyDollar weight="duotone" className="h-5 w-5 text-emerald-400" />
          {t("finance")} (MRR / ARR)
        </h2>
        <span className="text-brand-400 bg-brand-500/10 rounded-full px-2 py-1 text-xs font-medium">
          Live (Stripe Sync)
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <div className="space-y-4 lg:col-span-1">
          <div className="rounded-lg border border-white/5 bg-neutral-800/40 p-4">
            <p className="mb-1 text-sm font-medium text-neutral-400">Monthly Recurring Revenue</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white">$34,000</span>
              <span className="flex items-center text-xs text-emerald-400">
                <TrendUp weight="bold" className="mr-1" />
                +18%
              </span>
            </div>
          </div>

          <div className="rounded-lg border border-white/5 bg-neutral-800/40 p-4">
            <p className="mb-1 text-sm font-medium text-neutral-400">Annual Run Rate (ARR)</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white">$408,000</span>
              <span className="flex items-center text-xs text-emerald-400">
                <TrendUp weight="bold" className="mr-1" />
                +18%
              </span>
            </div>
          </div>

          <div className="rounded-lg border border-white/5 bg-neutral-800/40 p-4">
            <p className="mb-1 text-sm font-medium text-neutral-400">Active Pro/Enterprise Subs</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white">142</span>
              <span className="ml-1 text-xs text-neutral-500">
                <Users weight="duotone" className="inline" />
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-white/5 bg-neutral-800/20 p-4 lg:col-span-3">
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMrr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis
                  dataKey="name"
                  stroke="#ffffff40"
                  tick={{ fill: "#ffffff60", fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#ffffff40"
                  tick={{ fill: "#ffffff60", fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#171717",
                    borderColor: "#ffffff20",
                    borderRadius: "8px",
                  }}
                  itemStyle={{ color: "#10b981" }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, "MRR"]}
                />
                <Area
                  type="monotone"
                  dataKey="mrr"
                  stroke="#10b981"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorMrr)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
