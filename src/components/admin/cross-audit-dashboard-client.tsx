"use client";

import React from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useTranslations } from "next-intl";
import { Shield, Activity, Cpu, AlertTriangle, FileText, Lock, Eye } from "lucide-react";
import type { CrossAuditDashboardData } from "@/actions/admin/cross-audit-metrics";

interface CrossAuditDashboardClientProps {
  data: CrossAuditDashboardData;
}

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#6366f1",
];
const RISK_COLORS: Record<string, string> = {
  Minimal: "#10b981",
  "Specific Transparency": "#3b82f6",
  "High Risk": "#f59e0b",
  "Unacceptable Risk": "#ef4444",
};

export function CrossAuditDashboardClient({ data }: CrossAuditDashboardClientProps) {
  const t = useTranslations("admin");
  const { overview, categoryDistribution, modelComparison, riskDistribution, trendData } = data;

  return (
    <div className="space-y-8">
      {/* 1. Overview Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
        <StatCard
          title={t("metrics_total_audited") || "Total Audited"}
          value={overview.totalAudited}
          icon={<FileText className="text-brand-400 h-5 w-5" />}
          description={t("metrics_total_audited_desc") || "Cross-audited incidents"}
        />
        <StatCard
          title={t("metrics_avg_truth") || "Avg Truth Score"}
          value={`${overview.averageTruthScore}/100`}
          icon={<Shield className="text-success-400 h-5 w-5" />}
          description={t("metrics_avg_truth_desc") || "Incident plausibility rating"}
          colorClass={
            overview.averageTruthScore >= 80
              ? "text-success-400"
              : overview.averageTruthScore >= 50
                ? "text-warning-400"
                : "text-danger-400"
          }
        />
        <StatCard
          title={t("metrics_avg_confidence") || "Avg Confidence"}
          value={`${Math.round(overview.averageConfidence * 100)}%`}
          icon={<Activity className="text-info-400 h-5 w-5" />}
          description={t("metrics_avg_confidence_desc") || "AI consensus strength"}
        />
        <StatCard
          title={t("metrics_avg_transparency") || "Transparency"}
          value={`${overview.averageTransparency}/100`}
          icon={<Eye className="text-brand-400 h-5 w-5" />}
          description={t("metrics_avg_transparency_desc") || "EU Act Article 52 compliance"}
          colorClass="text-brand-400"
        />
        <StatCard
          title={t("metrics_avg_ethics") || "Ethics / Non-Bias"}
          value={`${overview.averageNonDiscrimination}/100`}
          icon={<Cpu className="text-warning-400 h-5 w-5" />}
          description={t("metrics_avg_ethics_desc") || "Ethics & fairness score"}
          colorClass="text-warning-400"
        />
        <StatCard
          title={t("metrics_avg_privacy") || "Data Privacy"}
          value={`${overview.averageDataPrivacy}/100`}
          icon={<Lock className="text-danger-400 h-5 w-5" />}
          description={t("metrics_avg_privacy_desc") || "GDPR/KVKK safeguards"}
          colorClass="text-danger-400"
        />
      </div>

      {/* 2. Charts Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Trend Chart */}
        <div className="bg-bg-secondary/40 rounded-2xl border border-white/5 p-6 shadow-lg backdrop-blur-xl">
          <div className="mb-6">
            <h3 className="font-bold tracking-tight text-white">
              {t("metrics_trend_title") || "Historical Score Evolution"}
            </h3>
            <p className="text-fg-muted mt-1 text-xs">
              {t("metrics_trend_subtitle") || "Average scores grouped by month"}
            </p>
          </div>
          <div className="h-72 w-full">
            {trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.05)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="date"
                    stroke="rgba(255,255,255,0.2)"
                    fontSize={11}
                    tickMargin={10}
                  />
                  <YAxis stroke="rgba(255,255,255,0.2)" fontSize={11} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(10,10,10,0.9)",
                      borderColor: "rgba(255,255,255,0.1)",
                      borderRadius: "8px",
                    }}
                    itemStyle={{ fontSize: "12px", fontWeight: "bold" }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: "12px" }} />
                  <Line
                    type="monotone"
                    dataKey="truthScore"
                    stroke="#10b981"
                    strokeWidth={2}
                    name={t("metrics_avg_truth") || "Truth Score"}
                  />
                  <Line
                    type="monotone"
                    dataKey="nonDiscrimination"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    name={t("metrics_avg_ethics") || "Ethics Score"}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState />
            )}
          </div>
        </div>

        {/* Model Comparison Leaderboard */}
        <div className="bg-bg-secondary/40 rounded-2xl border border-white/5 p-6 shadow-lg backdrop-blur-xl">
          <div className="mb-6">
            <h3 className="font-bold tracking-tight text-white">
              {t("metrics_model_comparison_title") || "AI Provider Accountability Bench"}
            </h3>
            <p className="text-fg-muted mt-1 text-xs">
              {t("metrics_model_comparison_subtitle") ||
                "Average incident scores by provider (higher is better)"}
            </p>
          </div>
          <div className="h-72 w-full">
            {modelComparison.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={modelComparison}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.05)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="providerName"
                    stroke="rgba(255,255,255,0.2)"
                    fontSize={11}
                    tickMargin={10}
                  />
                  <YAxis stroke="rgba(255,255,255,0.2)" fontSize={11} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(10,10,10,0.9)",
                      borderColor: "rgba(255,255,255,0.1)",
                      borderRadius: "8px",
                    }}
                    itemStyle={{ fontSize: "12px", fontWeight: "bold" }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: "12px" }} />
                  <Bar
                    dataKey="averageTruthScore"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                    name={t("metrics_avg_truth") || "Truth Score"}
                  />
                  <Bar
                    dataKey="averageNonDiscrimination"
                    fill="#f59e0b"
                    radius={[4, 4, 0, 0]}
                    name={t("metrics_avg_ethics") || "Ethics Score"}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Category Distribution */}
        <div className="bg-bg-secondary/40 rounded-2xl border border-white/5 p-6 shadow-lg backdrop-blur-xl">
          <div className="mb-6">
            <h3 className="font-bold tracking-tight text-white">
              {t("metrics_category_distribution_title") || "Incident Categories Breakdown"}
            </h3>
            <p className="text-fg-muted mt-1 text-xs">
              {t("metrics_category_distribution_subtitle") ||
                "Volume of verified incidents by issue type"}
            </p>
          </div>
          <div className="flex flex-col items-center justify-center sm:flex-row sm:justify-around">
            <div className="h-64 w-64">
              {categoryDistribution.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(10,10,10,0.9)",
                        borderColor: "rgba(255,255,255,0.1)",
                        borderRadius: "8px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <EmptyState />
              )}
            </div>
            <div className="mt-4 space-y-2 sm:mt-0">
              {categoryDistribution.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2 text-sm text-white">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="font-medium capitalize">
                    {t(`category_${entry.name}`) || entry.name}
                  </span>
                  <span className="text-fg-muted">({entry.value})</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* EU AI Act Risk Distribution */}
        <div className="bg-bg-secondary/40 rounded-2xl border border-white/5 p-6 shadow-lg backdrop-blur-xl">
          <div className="mb-6">
            <h3 className="font-bold tracking-tight text-white">
              {t("metrics_risk_distribution_title") || "EU AI Act Regulatory Risk Distribution"}
            </h3>
            <p className="text-fg-muted mt-1 text-xs">
              {t("metrics_risk_distribution_subtitle") ||
                "Incidents segmented by regulatory risk categories"}
            </p>
          </div>
          <div className="flex flex-col items-center justify-center sm:flex-row sm:justify-around">
            <div className="h-64 w-64">
              {riskDistribution.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={riskDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {riskDistribution.map((entry) => (
                        <Cell key={entry.name} fill={RISK_COLORS[entry.name] || "#6b7280"} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(10,10,10,0.9)",
                        borderColor: "rgba(255,255,255,0.1)",
                        borderRadius: "8px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <EmptyState />
              )}
            </div>
            <div className="mt-4 space-y-2 sm:mt-0">
              {riskDistribution.map((entry) => (
                <div key={entry.name} className="flex items-center gap-2 text-sm text-white">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: RISK_COLORS[entry.name] || "#6b7280" }}
                  />
                  <span className="font-medium">{entry.name}</span>
                  <span className="text-fg-muted">({entry.value})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  colorClass?: string;
}

function StatCard({ title, value, icon, description, colorClass = "text-white" }: StatCardProps) {
  return (
    <div className="bg-bg-secondary/40 rounded-2xl border border-white/5 p-5 shadow-lg backdrop-blur-xl">
      <div className="text-fg-muted flex items-center justify-between">
        <span className="text-xs font-semibold tracking-wider uppercase">{title}</span>
        {icon}
      </div>
      <h3 className={`mt-3 text-2xl font-bold tracking-tight ${colorClass}`}>{value}</h3>
      {description && <p className="text-fg-muted mt-1 text-[11px] font-medium">{description}</p>}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <AlertTriangle className="text-fg-muted mb-2 h-8 w-8 opacity-50" />
      <span className="text-fg-muted text-sm">No cross-audited data available yet.</span>
    </div>
  );
}
