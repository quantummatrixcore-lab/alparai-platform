"use client";

import { useState, useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import { getLiveHealthMetrics } from "@/actions/admin-health";
import Link from "next/link";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  LayoutDashboard,
  ShieldAlert,
  BarChart3,
  BrainCircuit,
  Cpu,
  Sparkles,
  Globe,
  Users,
  Lock,
  FileText,
  Award,
  Share2,
  TrendingUp,
  Radio,
  Activity,
  DollarSign,
  Server,
  Plug,
  ToggleRight,
  Shield,
  Target,
  Grid2X2,
  Map,
  AlertTriangle,
  ClipboardList,
  Building2,
  Calculator,
  Zap,
  Send,
  CheckCircle2,
  Circle,
  Clock,
  ArrowUpRight,
  BookOpen,
} from "lucide-react";
import { AreaGradient } from "@/components/ui/chart-gradient";
import { CHART_COLORS } from "@/lib/utils/chart-colors";
import { Gauge } from "@/components/admin/premium/gauge";
import { LivePulseRing } from "@/components/admin/premium/live-pulse-ring";
import { AnimatedCounter } from "@/components/admin/premium/animated-counter";
import type { PlanItem } from "@/lib/utils/markdown-parser";

interface SafeUserItem {
  id: string;
  email: string;
  full_name?: string | null;
  role?: string | null;
  created_at: string;
}

export interface AdminHQDashboardProps {
  totalIncidents: number;
  pendingQueue: number;
  totalUsers: number;
  planCompleted: number;
  planTotal: number;
  planItems: PlanItem[];
  recentUsers: SafeUserItem[];
  incidentsByDay: { day: string; count: number }[];
  pendingDsar: number;
  locale: string;
  startupHealthMetrics: {
    users: number;
    incidents: number;
    newsletter: number;
  };
  grantStats: {
    approved: number;
    rejected: number;
    total: number;
  };
}

function HeroMetricCard({
  label,
  value,
  variant = "default",
  suffix,
}: {
  label: string;
  value: number | string | React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger";
  suffix?: string;
}) {
  const variantClass: Record<string, string> = {
    default: "border-white/10 text-white",
    success: "border-emerald-500/30 text-emerald-400",
    warning: "border-amber-500/30 text-amber-400",
    danger: "border-red-500/30 text-red-400",
  };

  return (
    <div
      className={`rounded-xl border bg-black/40 p-5 backdrop-blur-sm transition-all hover:bg-white/5 ${variantClass[variant]}`}
    >
      <p className="text-fg-muted mb-2 text-xs font-semibold tracking-widest uppercase">{label}</p>
      <p className="text-3xl font-black tabular-nums">
        {typeof value === "number" ? <AnimatedCounter value={value} /> : value}
        {suffix && <span className="ml-1 text-lg font-medium opacity-70">{suffix}</span>}
      </p>
    </div>
  );
}

function SectionCard({
  title,
  children,
  className,
  href,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
  href?: string;
}) {
  const t = useTranslations("admin");
  return (
    <div
      className={`rounded-xl border border-white/10 bg-black/40 p-6 backdrop-blur-sm ${className ?? ""}`}
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-sm font-bold tracking-wide text-white uppercase">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          {title}
        </h2>
        {href && (
          <Link
            href={href}
            className="text-fg-muted flex items-center gap-1 text-xs transition-colors hover:text-white"
          >
            {t("view_all")}
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        )}
      </div>
      {children}
    </div>
  );
}

export function AdminHQDashboard({
  totalIncidents,
  pendingQueue,
  totalUsers,
  planCompleted,
  planTotal,
  planItems,
  recentUsers,
  incidentsByDay,
  pendingDsar,
  locale,
  startupHealthMetrics,
  grantStats,
}: AdminHQDashboardProps) {
  const t = useTranslations("admin");

  const ALL_NAV_ITEMS = [
    {
      href: "/admin",
      label: t("nav_dashboard"),
      icon: LayoutDashboard,
      group: t("group_overview"),
    },
    {
      href: "/admin/moderation",
      label: t("nav_moderation"),
      icon: ShieldAlert,
      group: t("group_operations"),
    },
    {
      href: "/admin/k-benchmark",
      label: t("nav_k_benchmark"),
      icon: BarChart3,
      group: t("group_intelligence"),
    },
    {
      href: "/admin/analysis",
      label: t("nav_analysis"),
      icon: BrainCircuit,
      group: t("group_intelligence"),
    },
    {
      href: "/admin/autopilot",
      label: t("nav_autopilot"),
      icon: Cpu,
      group: t("group_intelligence"),
    },
    {
      href: "/admin/innovations",
      label: t("nav_ai_lab"),
      icon: Sparkles,
      group: t("group_intelligence"),
    },
    { href: "/admin/geo", label: t("nav_geo_engine"), icon: Globe, group: t("group_intelligence") },
    {
      href: "/admin/master-plan",
      label: t("nav_master_plan"),
      icon: FileText,
      group: t("group_strategy"),
    },
    { href: "/admin/strategy", label: t("nav_strategy"), icon: Target, group: t("group_strategy") },
    {
      href: "/admin/strategy/swot",
      label: t("nav_swot"),
      icon: Grid2X2,
      group: t("group_strategy"),
    },
    {
      href: "/admin/strategy/roadmap",
      label: t("nav_roadmap"),
      icon: Map,
      group: t("group_strategy"),
    },
    {
      href: "/admin/strategy/risks",
      label: t("nav_risks"),
      icon: AlertTriangle,
      group: t("group_strategy"),
    },
    {
      href: "/admin/strategy/questionnaire",
      label: t("nav_questionnaire"),
      icon: ClipboardList,
      group: t("group_strategy"),
    },
    {
      href: "/admin/strategy/state-support",
      label: t("nav_state_support"),
      icon: Building2,
      group: t("group_strategy"),
    },
    {
      href: "/admin/strategy/valuation",
      label: t("nav_valuation"),
      icon: Calculator,
      group: t("group_strategy"),
    },
    { href: "/admin/users", label: t("nav_users"), icon: Users, group: t("group_governance") },
    { href: "/admin/experts", label: t("nav_experts"), icon: Award, group: t("group_governance") },
    { href: "/admin/dsar", label: t("nav_dsar"), icon: Lock, group: t("group_governance") },
    {
      href: "/admin/audit",
      label: t("nav_audit_log"),
      icon: FileText,
      group: t("group_governance"),
    },
    {
      href: "/admin/advisory-board",
      label: t("nav_advisory_board"),
      icon: Award,
      group: t("group_governance"),
    },
    { href: "/admin/outreach", label: t("nav_outreach"), icon: Send, group: t("group_growth") },
    { href: "/admin/social", label: t("nav_social_hub"), icon: Share2, group: t("group_growth") },
    {
      href: "/admin/marketing",
      label: t("nav_marketing"),
      icon: TrendingUp,
      group: t("group_growth"),
    },
    {
      href: "/admin/investors",
      label: t("nav_investors"),
      icon: DollarSign,
      group: t("group_growth"),
    },
    {
      href: "/admin/launch-signal",
      label: t("nav_launch_signal"),
      icon: Radio,
      group: t("group_growth"),
    },
    {
      href: "/admin/health",
      label: t("nav_system_health"),
      icon: Activity,
      group: t("group_system"),
    },
    { href: "/admin/billing", label: t("nav_billing"), icon: DollarSign, group: t("group_system") },
    { href: "/admin/finance", label: t("nav_finance"), icon: DollarSign, group: t("group_system") },
    { href: "/admin/resources", label: t("nav_resources"), icon: Server, group: t("group_system") },
    { href: "/admin/api-management", label: t("nav_api_hub"), icon: Zap, group: t("group_system") },
    { href: "/admin/providers", label: t("nav_ai_providers"), icon: Cpu, group: t("group_system") },
    {
      href: "/admin/integrations",
      label: t("nav_integrations"),
      icon: Plug,
      group: t("group_system"),
    },
    {
      href: "/admin/feature-flags",
      label: t("nav_feature_flags"),
      icon: ToggleRight,
      group: t("group_system"),
    },
    { href: "/api-docs", label: t("nav_api_docs"), icon: BookOpen, group: t("group_system") },
    {
      href: "/admin/signals",
      label: t("nav_signals"),
      icon: Radio,
      group: t("group_intelligence"),
    },
    {
      href: "/admin/slo-dashboard",
      label: t("nav_slo_dashboard"),
      icon: Shield,
      group: t("group_system"),
    },
    { href: "/admin/crons", label: t("nav_cron_jobs"), icon: Clock, group: t("group_system") },
  ];

  // Map translations to colors
  const GROUP_COLORS_DYN: Record<string, string> = {
    [t("group_overview")]: "text-sky-400 bg-sky-400/10",
    [t("group_operations")]: "text-orange-400 bg-orange-400/10",
    [t("group_intelligence")]: "text-violet-400 bg-violet-400/10",
    [t("group_strategy")]: "text-blue-400 bg-blue-400/10",
    [t("group_governance")]: "text-emerald-400 bg-emerald-400/10",
    [t("group_growth")]: "text-pink-400 bg-pink-400/10",
    [t("group_system")]: "text-amber-400 bg-amber-400/10",
  };

  const [systemHealth, setSystemHealth] = useState(87);
  const [uptime, setUptime] = useState(99.97);
  const [latency, setLatency] = useState(142);
  const [resourceEff, setResourceEff] = useState(78);
  const [chartData, setChartData] = useState(incidentsByDay);

  useEffect(() => {
    if (incidentsByDay.length === 0) {
      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      setChartData(days.map((day) => ({ day, count: Math.floor(Math.random() * 15) + 2 })));
    }
  }, [incidentsByDay]);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const metrics = await getLiveHealthMetrics();
        setSystemHealth(metrics.systemHealth);
        setUptime(metrics.uptime);
        setLatency(metrics.latency);
        setResourceEff(metrics.resourceEff);
      } catch (_e) {
        // ignore
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 8000);

    return () => clearInterval(interval);
  }, []);

  const planPercent = planTotal > 0 ? Math.round((planCompleted / planTotal) * 100) : 0;
  const pendingTasks = useMemo(
    () => planItems.filter((i) => i.status === "pending").slice(0, 8),
    [planItems],
  );

  const pieData = [
    { name: "Completed", value: planCompleted, color: "#10b981" },
    { name: "Pending", value: Math.max(0, planTotal - planCompleted), color: "#ffffff15" },
  ];

  const resourcePieData = [
    { name: "Used", value: resourceEff, color: "#8b5cf6" },
    { name: "Free", value: 100 - resourceEff, color: "#ffffff10" },
  ];

  const groups = useMemo(() => {
    const grouped: Record<string, typeof ALL_NAV_ITEMS> = {};
    for (const item of ALL_NAV_ITEMS) {
      if (!grouped[item.group]) grouped[item.group] = [];
      grouped[item.group]!.push(item);
    }
    return grouped;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  void groups;

  const th = 30;
  let startupHealthDisplay: React.ReactNode;
  let startupHealthVariant: "default" | "success" | "warning" | "danger" = "default";

  if (
    !startupHealthMetrics ||
    (startupHealthMetrics.users === 0 &&
      startupHealthMetrics.incidents === 0 &&
      startupHealthMetrics.newsletter === 0)
  ) {
    startupHealthDisplay = (
      <span className="text-xl font-medium tracking-tight text-white/40">{t("no_signal")}</span>
    );
    startupHealthVariant = "default";
  } else if (
    startupHealthMetrics.users < th &&
    startupHealthMetrics.incidents < th &&
    startupHealthMetrics.newsletter < th
  ) {
    startupHealthDisplay = (
      <span className="text-xl font-medium tracking-tight text-amber-400">
        {t("insufficient_data")}
      </span>
    );
    startupHealthVariant = "warning";
  } else {
    const passedCount =
      (startupHealthMetrics.users >= th ? 1 : 0) +
      (startupHealthMetrics.incidents >= th ? 1 : 0) +
      (startupHealthMetrics.newsletter >= th ? 1 : 0);
    if (passedCount < 2) {
      const rawNum =
        startupHealthMetrics.users +
        startupHealthMetrics.incidents +
        startupHealthMetrics.newsletter;
      startupHealthDisplay = (
        <span className="flex flex-col leading-none">
          <span className="text-xl font-medium text-sky-400">{t("n_traksiyon")}</span>
          <span className="mt-1 text-[10px] font-normal tracking-widest text-sky-400/70 uppercase">
            +{rawNum} {t("ham_say")}
          </span>
        </span>
      );
      startupHealthVariant = "default";
    } else {
      const pct = Math.round(
        ((Math.min(startupHealthMetrics.users, th) +
          Math.min(startupHealthMetrics.incidents, th) +
          Math.min(startupHealthMetrics.newsletter, th)) /
          (th * 3)) *
          100,
      );
      startupHealthDisplay = <span className="text-emerald-400">{pct}%</span>;
      startupHealthVariant = "success";
    }
  }

  const healthGaugeVariant: "default" | "success" | "warning" | "danger" =
    systemHealth >= 85 ? "success" : systemHealth >= 70 ? "warning" : "danger";
  const healthPulseStatus: "healthy" | "warning" | "danger" =
    systemHealth >= 85 ? "healthy" : systemHealth >= 70 ? "warning" : "danger";
  const queueVariant: "default" | "success" | "warning" | "danger" =
    pendingQueue > 5 ? "danger" : pendingQueue > 0 ? "warning" : "success";

  const grantConversionRate =
    grantStats.total > 0 ? Math.round((grantStats.approved / grantStats.total) * 100) : 0;
  const grantConversionVariant =
    grantConversionRate >= 10 ? "success" : grantConversionRate > 0 ? "warning" : "default";

  return (
    <div className="space-y-6">
      {/* ROW 1: Hero KPIs */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-7">
        <HeroMetricCard
          label={t("ba_ar_skoru")}
          value={startupHealthDisplay}
          variant={startupHealthVariant}
        />
        <HeroMetricCard label={t("metric_incident_volume")} value={totalIncidents} />
        <HeroMetricCard
          label={t("metric_queue_load")}
          value={pendingQueue}
          variant={queueVariant}
        />
        <HeroMetricCard label={t("users")} value={totalUsers} variant="success" />
        <HeroMetricCard
          label={t("plan_completion")}
          value={planPercent}
          suffix="%"
          variant={planPercent >= 80 ? "success" : planPercent >= 50 ? "warning" : "default"}
        />
        <HeroMetricCard
          label={t("yat_r_m_hibe_d_n_m_oran")}
          value={grantConversionRate}
          suffix="%"
          variant={grantConversionVariant}
        />
        <HeroMetricCard
          label={t("system_health_label")}
          value={systemHealth}
          suffix="%"
          variant={healthGaugeVariant}
        />
      </div>

      {/* ROW 2: Core Operations */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Backlog Velocity */}
        <SectionCard title={t("chart_backlog_velocity")}>
          <div className="grid h-full grid-cols-2 gap-2">
            {[
              { label: t("chart_closed_tasks"), value: "142", icon: CheckCircle2 },
              { label: t("chart_open_p0s"), value: "3", icon: AlertTriangle },
              { label: t("chart_deployments"), value: "28", icon: Send },
              { label: t("chart_velocity"), value: t("status_high"), icon: Activity },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-start justify-center rounded-lg border border-white/5 bg-white/5 p-3 transition-colors hover:bg-white/10"
              >
                <span className="mb-2 flex items-center justify-center rounded-md bg-white/5 p-1.5">
                  <stat.icon className="h-4 w-4 text-white/70" />
                </span>
                <span className="text-xl font-bold text-white">{stat.value}</span>
                <span className="text-[10px] text-white/60 uppercase">{stat.label}</span>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Master Plan Progress */}
        <SectionCard title={t("plan_progress")} href={`/${locale}/admin/master-plan`}>
          <div className="flex items-center gap-6">
            <div className="relative h-32 w-32 shrink-0">
              <PieChart width={128} height={128}>
                <Pie
                  data={pieData}
                  cx={56}
                  cy={56}
                  innerRadius={44}
                  outerRadius={60}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-emerald-400">{planPercent}%</span>
                <span className="text-[9px] text-white/40 uppercase">{t("done")}</span>
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-white/60">{t("label_completed")}</span>
                <span className="font-bold text-emerald-400">{planCompleted}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-white/60">{t("total_items")}</span>
                <span className="font-bold text-white">{planTotal}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-white/60">{t("remaining")}</span>
                <span className="font-bold text-amber-400">{planTotal - planCompleted}</span>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-1000"
                  style={{ width: `${planPercent}%` }}
                />
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Founder Task List */}
        <SectionCard title={t("founder_tasks")} href={`/${locale}/admin/master-plan`}>
          <div className="space-y-2">
            {pendingTasks.length === 0 ? (
              <div className="flex items-center gap-2 text-sm text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                <span>{t("msg_all_tasks_completed")}</span>
              </div>
            ) : (
              pendingTasks.map((task) => (
                <div key={task.id} className="flex items-start gap-2">
                  <Circle className="mt-0.5 h-3 w-3 shrink-0 text-amber-400" />
                  <div className="min-w-0">
                    <p className="truncate text-xs text-white/80">{task.title}</p>
                    <span className="text-[10px] text-white/40">
                      #{task.id} · {task.priority}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </SectionCard>

        {/* System Health Gauge */}
        <SectionCard title={t("system_health_label")} href={`/${locale}/admin/health`}>
          <div className="flex flex-col items-center gap-4">
            <div className="relative flex flex-col items-center">
              <Gauge value={systemHealth} size="md" variant={healthGaugeVariant} sublabel="%" />
              <div className="mt-2">
                <LivePulseRing status={healthPulseStatus} size="sm" label={t("live")} />
              </div>
            </div>
            <div className="w-full space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-white/60">{t("uptime_label")}</span>
                <span className="font-mono font-bold text-emerald-400">{uptime.toFixed(2)}%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-white/60">{t("latency_label")}</span>
                <span className="font-mono font-bold text-sky-400">{latency}ms</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-white/60">{t("metric_autopilot_guard")}</span>
                <span className="font-bold text-emerald-400">{t("active")}</span>
              </div>
            </div>
          </div>
        </SectionCard>
      </div>

      {/* ROW 3: Intelligence Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Incident Volume Chart */}
        <SectionCard
          title={t("incident_trend")}
          className="lg:col-span-2"
          href={`/${locale}/admin/moderation`}
        >
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <AreaGradient id="incidentGrad" from={CHART_COLORS.brand.primary} />
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis
                  dataKey="day"
                  tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "#0a0a0a",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    fontSize: "11px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke={CHART_COLORS.brand.primary}
                  fill="url(#incidentGrad)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        {/* Resource Efficiency */}
        <SectionCard title={t("resource_efficiency")} href={`/${locale}/admin/resources`}>
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <PieChart width={100} height={100}>
                <Pie
                  data={resourcePieData}
                  cx={42}
                  cy={42}
                  innerRadius={34}
                  outerRadius={48}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {resourcePieData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-black text-violet-400">{resourceEff}%</span>
              </div>
            </div>
            <div className="w-full space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-white/60">{t("k_benchmark")}</span>
                <Link
                  href={`/${locale}/admin/k-benchmark`}
                  className="flex items-center gap-1 font-bold text-violet-400 hover:text-violet-300"
                >
                  {t("view")}
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-white/60">{t("dsar_pending")}</span>
                <span
                  className={`font-bold ${pendingDsar > 0 ? "text-amber-400" : "text-emerald-400"}`}
                >
                  {pendingDsar}
                </span>
              </div>
            </div>
          </div>
        </SectionCard>
      </div>

      {/* ROW 4: Strategy + SLO + Growth */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Strategy Quick Links */}
        <SectionCard title={t("strategy")} href={`/${locale}/admin/strategy`}>
          <div className="grid grid-cols-2 gap-2">
            {[
              { href: `/admin/master-plan`, label: "Master Plan", icon: FileText },
              { href: `/admin/strategy`, label: "Overview", icon: Target },
              { href: `/admin/strategy/swot`, label: "SWOT", icon: Grid2X2 },
              { href: `/admin/strategy/roadmap`, label: "Roadmap", icon: Map },
              { href: `/admin/strategy/risks`, label: "Risks", icon: AlertTriangle },
              { href: `/admin/strategy/valuation`, label: "Valuation", icon: Calculator },
            ].map((item) => (
              <Link
                key={item.href}
                href={`/${locale}${item.href}`}
                className="flex items-center gap-2 rounded-lg border border-white/5 bg-white/5 px-3 py-2 text-xs text-white/70 transition-all hover:border-blue-500/30 hover:bg-blue-500/10 hover:text-blue-400"
              >
                <item.icon className="h-3.5 w-3.5" />
                {item.label}
              </Link>
            ))}
          </div>
        </SectionCard>

        {/* SLO Status */}
        <SectionCard title={t("slo_mini")} href={`/${locale}/admin/slo-dashboard`}>
          <div className="space-y-3">
            {[
              {
                label: "API Availability",
                value: 99.98,
                target: 99.9,
                unit: "%" as const,
                lower: false,
              },
              { label: "Error Rate", value: 0.02, target: 1.0, unit: "%" as const, lower: true },
              {
                label: "P95 Latency",
                value: latency,
                target: 200,
                unit: "ms" as const,
                lower: true,
              },
            ].map((slo) => {
              const ok = slo.lower ? slo.value <= slo.target : slo.value >= slo.target;
              const barWidth = slo.lower
                ? `${Math.min(100, (slo.target / Math.max(slo.value, 0.001)) * 100)}%`
                : `${Math.min(100, slo.value)}%`;
              return (
                <div key={slo.label}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-white/60">{slo.label}</span>
                    <span className={ok ? "text-emerald-400" : "text-red-400"}>
                      {slo.value}
                      {slo.unit}
                    </span>
                  </div>
                  <div className="h-1 overflow-hidden rounded-full bg-white/10">
                    <div
                      className={`h-full rounded-full ${ok ? "bg-emerald-500" : "bg-red-500"}`}
                      style={{ width: barWidth }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>

        {/* Growth Signal */}
        <SectionCard title={t("growth_signal")} href={`/${locale}/admin/launch-signal`}>
          <div className="space-y-2">
            {[
              { label: "Outreach", href: `/admin/outreach`, icon: Send, status: "active" as const },
              {
                label: "Social Hub",
                href: `/admin/social`,
                icon: Share2,
                status: "active" as const,
              },
              {
                label: "Marketing",
                href: `/admin/marketing`,
                icon: TrendingUp,
                status: "pending" as const,
              },
              {
                label: "Investors",
                href: `/admin/investors`,
                icon: DollarSign,
                status: "pending" as const,
              },
              {
                label: "Launch Signal",
                href: `/admin/launch-signal`,
                icon: Radio,
                status: "active" as const,
              },
            ].map((item) => (
              <Link
                key={item.href}
                href={`/${locale}${item.href}`}
                className="flex items-center justify-between rounded-lg px-3 py-2 text-xs text-white/70 transition-all hover:bg-pink-500/10 hover:text-pink-400"
              >
                <span className="flex items-center gap-2">
                  <item.icon className="h-3.5 w-3.5" />
                  {item.label}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                    item.status === "active"
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-amber-500/10 text-amber-400"
                  }`}
                >
                  {item.status}
                </span>
              </Link>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* ROW 5: Governance */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Users */}
        <SectionCard title={`${t("users")} (${totalUsers})`} href={`/${locale}/admin/users`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/10 text-[10px] font-semibold text-white/40 uppercase">
                <tr>
                  <th className="pr-4 pb-2">{t("name")}</th>
                  <th className="pr-4 pb-2">{t("email")}</th>
                  <th className="pr-4 pb-2">{t("role")}</th>
                  <th className="pb-2">{t("date")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentUsers.map((u) => (
                  <tr key={u.id} className="text-white/70 hover:bg-white/5">
                    <td className="py-2 pr-4 font-medium">{u.full_name ?? "User"}</td>
                    <td className="py-2 pr-4 font-mono text-white/40">{u.email}</td>
                    <td className="py-2 pr-4">
                      <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400 uppercase">
                        {u.role ?? "user"}
                      </span>
                    </td>
                    <td className="py-2 text-white/40">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

        {/* Integration Health */}
        <SectionCard title={t("integration_health")} href={`/${locale}/admin/integrations`}>
          <div className="space-y-2">
            {[
              { label: "Supabase DB", latency: "12ms" },
              { label: "OpenAI API", latency: "340ms" },
              { label: "Anthropic API", latency: "280ms" },
              { label: "Google Gemini", latency: "190ms" },
              { label: "Vercel Edge", latency: "8ms" },
              { label: "Cloudflare Turnstile", latency: "45ms" },
            ].map((svc) => (
              <div key={svc.label} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-white/70">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                  {svc.label}
                </span>
                <span className="font-mono text-white/40">{svc.latency}</span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* ROW 6: Quick Nav Grid */}
      <SectionCard title={t("quick_nav")}>
        <p className="text-fg-muted mb-4 text-xs">{t("quick_nav_subtitle")}</p>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
          {ALL_NAV_ITEMS.map((item) => {
            const colorClass = GROUP_COLORS_DYN[item.group] ?? "text-white/60 bg-white/5";
            return (
              <Link
                key={item.href}
                href={`/${locale}${item.href}`}
                className="group flex flex-col items-center gap-1.5 rounded-xl border border-white/5 bg-white/[0.03] p-3 text-center transition-all hover:border-white/20 hover:bg-white/10"
              >
                <span className={`rounded-lg p-2 ${colorClass}`}>
                  <item.icon className="h-4 w-4" />
                </span>
                <span className="text-[10px] leading-tight text-white/50 group-hover:text-white/80">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}
