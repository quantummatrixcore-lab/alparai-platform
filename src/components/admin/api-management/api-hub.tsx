"use client";

import React, { useState } from "react";
import { ProviderMatrix } from "./provider-matrix";
import { ModelHealthChart } from "./model-health-chart";
import { ApiKeyManager } from "./api-key-manager";
import { QuotaGauges } from "./quota-gauges";
import { UsageHeatmap } from "./usage-heatmap";
import { RefreshCw } from "lucide-react";

export interface Provider {
  id: string;
  name: string;
  status: "connected" | "degraded" | "offline";
  models: string[];
  health: number;
  latencyMs: number;
  dailyRequests: number;
  quotaUsed: number;
  quotaLimit: number;
  dailyCostUsd: number;
  monthlyLimitUsd: number;
  respondentActive: boolean;
}

const MOCK_PROVIDERS: Provider[] = [
  {
    id: "openai",
    name: "OpenAI",
    status: "connected",
    models: ["GPT-4o", "GPT-4o-mini"],
    health: 99,
    latencyMs: 245,
    dailyRequests: 12400,
    quotaUsed: 4250000,
    quotaLimit: 100000000,
    dailyCostUsd: 0.38,
    monthlyLimitUsd: 500,
    respondentActive: true,
  },
  {
    id: "anthropic",
    name: "Anthropic Claude",
    status: "connected",
    models: ["Claude 3.5 Sonnet", "Claude 3 Opus"],
    health: 98,
    latencyMs: 189,
    dailyRequests: 18920,
    quotaUsed: 8920000,
    quotaLimit: 50000000,
    dailyCostUsd: 0.42,
    monthlyLimitUsd: 800,
    respondentActive: true,
  },
  {
    id: "google",
    name: "Google Gemini",
    status: "connected",
    models: ["Gemini 1.5 Pro", "Gemini 1.5 Flash"],
    health: 100,
    latencyMs: 156,
    dailyRequests: 24600,
    quotaUsed: 2400,
    quotaLimit: 15000,
    dailyCostUsd: 0.0,
    monthlyLimitUsd: 0,
    respondentActive: false,
  },
  {
    id: "supabase",
    name: "Supabase",
    status: "connected",
    models: ["PostgreSQL", "RLS", "Storage"],
    health: 100,
    latencyMs: 42,
    dailyRequests: 58000,
    quotaUsed: 450000,
    quotaLimit: 500000000,
    dailyCostUsd: 0.0,
    monthlyLimitUsd: 0,
    respondentActive: false,
  },
  {
    id: "upstash",
    name: "Upstash Redis",
    status: "connected",
    models: ["Redis Cache", "Rate Limiter"],
    health: 99,
    latencyMs: 12,
    dailyRequests: 1240000,
    quotaUsed: 1240,
    quotaLimit: 10000,
    dailyCostUsd: 0.0,
    monthlyLimitUsd: 0,
    respondentActive: false,
  },
  {
    id: "resend",
    name: "Resend Email",
    status: "connected",
    models: ["Transactional Email"],
    health: 99,
    latencyMs: 234,
    dailyRequests: 14,
    quotaUsed: 14,
    quotaLimit: 3000,
    dailyCostUsd: 0.0,
    monthlyLimitUsd: 0,
    respondentActive: false,
  },
];

const MOCK_LATENCY_TRENDS = [
  { date: "Mon", openai: 250, anthropic: 195, google: 160, supabase: 45 },
  { date: "Tue", openai: 245, anthropic: 188, google: 158, supabase: 48 },
  { date: "Wed", openai: 260, anthropic: 192, google: 162, supabase: 50 },
  { date: "Thu", openai: 240, anthropic: 185, google: 155, supabase: 44 },
  { date: "Fri", openai: 235, anthropic: 189, google: 159, supabase: 46 },
  { date: "Sat", openai: 248, anthropic: 191, google: 161, supabase: 49 },
  { date: "Sun", openai: 245, anthropic: 189, google: 156, supabase: 42 },
];

export function ApiManagementHub() {
  const [providers] = useState<Provider[]>(MOCK_PROVIDERS);
  const [loading, setLoading] = useState(false);

  const handleRefresh = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
  };

  const totalDailyCost = providers.reduce((a, p) => a + p.dailyCostUsd, 0);

  return (
    <div className="space-y-8">
      {/* Header Actions */}
      <div className="flex items-center justify-between rounded-lg border border-white/10 bg-zinc-900/50 px-4 py-3">
        <div>
          <p className="text-xs text-zinc-400">Daily API Spend</p>
          <p className="text-2xl font-bold text-white">${totalDailyCost.toFixed(2)}</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-zinc-300 transition-colors hover:bg-white/10 disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh Telemetry
        </button>
      </div>

      {/* Provider Matrix */}
      <section>
        <h2 className="mb-4 text-lg font-bold tracking-tight text-white">Provider Status Matrix</h2>
        <ProviderMatrix providers={providers} />
      </section>

      {/* Model Health Chart */}
      <section>
        <h2 className="mb-4 text-lg font-bold tracking-tight text-white">
          Model Latency Trends (P95)
        </h2>
        <ModelHealthChart data={MOCK_LATENCY_TRENDS} />
      </section>

      {/* Quota Gauges */}
      <section>
        <h2 className="mb-4 text-lg font-bold tracking-tight text-white">
          Quota Usage by Provider
        </h2>
        <QuotaGauges providers={providers} />
      </section>

      {/* Usage Heatmap */}
      <section>
        <h2 className="mb-4 text-lg font-bold tracking-tight text-white">
          Daily Request Volume (24h Heatmap)
        </h2>
        <UsageHeatmap providers={providers} />
      </section>

      {/* API Key Manager */}
      <section>
        <h2 className="mb-4 text-lg font-bold tracking-tight text-white">API Keys & Credentials</h2>
        <ApiKeyManager providers={providers} />
      </section>
    </div>
  );
}
