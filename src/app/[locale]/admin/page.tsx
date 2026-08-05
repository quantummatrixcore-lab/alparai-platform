import { setRequestLocale, getTranslations } from "next-intl/server";
import Link from "next/link";
import { SpatialBentoCard } from "@/components/admin/spatial-bento-card";
import {
  Command,
  Activity,
  Users,
  ShieldAlert,
  DatabaseZap,
  Search,
  ChevronRight,
  Cpu,
  CheckCircle2,
  Lock,
  Zap,
  TrendingUp,
  FileText,
} from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admin" });
  return { title: t("dashboard") || "360° Cockpit — ALPAR AI" };
}

export default async function AdminDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen bg-[#0A0A0A] p-6 text-neutral-50 selection:bg-white/30 selection:text-white md:p-12 lg:p-16">
      <div className="mx-auto max-w-7xl">
        {/* Top Bar: Title + Cmd+K trigger */}
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/[0.08] px-3.5 py-1 text-xs font-semibold tracking-wide text-emerald-400">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              SYSTEM OPERATIONAL — PROD
            </div>
            <h1 className="bg-gradient-to-br from-white via-neutral-200 to-neutral-500 bg-clip-text text-4xl font-semibold tracking-[-0.02em] text-transparent sm:text-5xl">
              360° Cockpit
            </h1>
            <p className="text-[16px] font-medium tracking-[-0.01em] text-neutral-400">
              Mission control center for trust infrastructure & platform governance.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/${locale}/admin/master-plan`}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-medium text-neutral-300 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
            >
              <FileText className="h-4 w-4 text-cyan-400" />
              <span>Master Plan</span>
            </Link>

            <button className="group flex items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.02] px-5 py-3 text-[14px] text-neutral-400 backdrop-blur-xl transition-all duration-300 hover:border-white/[0.15] hover:bg-white/[0.06] hover:text-neutral-200">
              <Search className="h-4 w-4" />
              <span className="font-medium tracking-[-0.01em]">Quick Command</span>
              <kbd className="ml-4 hidden h-5 items-center gap-0.5 rounded-md bg-white/[0.08] px-2 font-sans text-[11px] font-medium text-neutral-300 group-hover:bg-white/[0.15] md:inline-flex">
                <span>⌘</span>
                <span>K</span>
              </kbd>
            </button>
          </div>
        </div>

        {/* Apple/Linear Spatial Bento Grid */}
        <div className="grid auto-rows-[280px] grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {/* Main Card: System Integrity */}
          <SpatialBentoCard
            className="md:col-span-2 md:row-span-2"
            title="System Integrity & Health"
            description="Real-time uptime, regional node response metrics, and DB replication stability."
            actionIcon={<Activity className="h-4 w-4" />}
          >
            <div className="flex h-full flex-col justify-end">
              <div className="mb-6 flex items-baseline gap-3">
                <div className="text-[80px] leading-none font-medium tracking-[-0.04em] text-white">
                  99.99
                </div>
                <div className="text-2xl font-medium tracking-[-0.02em] text-emerald-400">
                  % Uptime
                </div>
              </div>

              {/* Stats Bar */}
              <div className="mb-6 grid grid-cols-3 gap-4 border-t border-white/[0.08] pt-4">
                <div>
                  <p className="text-xs text-neutral-500">Avg Latency</p>
                  <p className="text-lg font-semibold text-neutral-200">12ms</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500">Vercel Edge</p>
                  <p className="text-lg font-semibold text-emerald-400">fra1 (Frankfurt)</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500">Supabase DB</p>
                  <p className="text-lg font-semibold text-neutral-200">eu-west-1</p>
                </div>
              </div>

              <div className="relative h-28 w-full overflow-hidden rounded-2xl border-t border-emerald-500/10 bg-gradient-to-t from-emerald-500/[0.15] to-transparent">
                <div className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-emerald-500/0 via-emerald-500 to-emerald-500/0" />
                <div className="absolute bottom-6 left-0 h-[1px] w-full border-b border-dashed border-emerald-500/20" />
                <div className="absolute bottom-12 left-0 h-[1px] w-full border-b border-dashed border-emerald-500/10" />
                <div className="absolute -bottom-5 left-1/2 h-[40px] w-[120px] -translate-x-1/2 bg-emerald-500/40 blur-3xl" />
              </div>
            </div>
          </SpatialBentoCard>

          {/* AI Orchestrator & TOM Engine */}
          <SpatialBentoCard
            className="md:col-span-1 md:row-span-1"
            title="AI Engine Orchestrator"
            description="TOM token economy & agent pipeline status."
            actionIcon={<Cpu className="h-4 w-4 text-cyan-400" />}
          >
            <div className="mt-4 flex flex-col justify-between gap-3">
              <div className="flex items-center justify-between rounded-xl bg-white/[0.03] p-3 text-xs">
                <span className="text-neutral-400">Discovery Engine</span>
                <span className="font-mono font-medium text-cyan-300">Haiku / Flash</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-white/[0.03] p-3 text-xs">
                <span className="text-neutral-400">Context Savings</span>
                <span className="font-mono font-medium text-emerald-400">92.4%</span>
              </div>
              <Link
                href={`/${locale}/admin/ai-orchestrator`}
                className="group/btn flex items-center justify-between text-xs font-medium text-cyan-400 hover:text-cyan-300"
              >
                <span>Manage Orchestrator</span>
                <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
              </Link>
            </div>
          </SpatialBentoCard>

          {/* Security Radar & PII Guardian */}
          <SpatialBentoCard
            className="md:col-span-1 md:row-span-2"
            title="Threat & PII Radar"
            description="Automated zero-knowledge sanitization."
            actionIcon={<ShieldAlert className="h-4 w-4 text-rose-400" />}
          >
            <div className="mt-2 flex h-full flex-col">
              <div className="flex-1 space-y-3">
                <div className="group/alert relative flex items-start gap-3 rounded-2xl border border-emerald-500/10 bg-emerald-500/[0.02] p-4 transition-all duration-300 hover:border-emerald-500/20">
                  <Lock className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                  <div>
                    <p className="text-[13px] font-medium text-emerald-200">PII Guardian Active</p>
                    <p className="mt-0.5 text-[12px] text-emerald-200/60">
                      100% free-text masked before DB insert.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl border border-amber-500/10 bg-amber-500/[0.02] p-4 transition-all duration-300 hover:border-amber-500/20">
                  <Zap className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                  <div>
                    <p className="text-[13px] font-medium text-amber-200">Rate Limiter Guard</p>
                    <p className="mt-0.5 text-[12px] text-amber-200/60">
                      Strict IP + token bucket active.
                    </p>
                  </div>
                </div>
              </div>

              <Link
                href={`/${locale}/admin/audit`}
                className="mt-auto flex w-full items-center justify-center gap-2 rounded-2xl bg-white/[0.04] py-3.5 text-xs font-medium text-white transition-all duration-300 hover:bg-white/[0.08]"
              >
                <Command className="h-3.5 w-3.5 opacity-50" />
                <span>Full Audit Stream</span>
              </Link>
            </div>
          </SpatialBentoCard>

          {/* User Operations */}
          <SpatialBentoCard
            className="md:col-span-1 md:row-span-1"
            title="Moderation & Users"
            description="Active queues and member oversight."
            actionIcon={<Users className="h-4 w-4" />}
          >
            <div className="mt-4 flex flex-col gap-2.5">
              <Link
                href={`/${locale}/admin/moderation`}
                className="group/btn flex items-center justify-between rounded-xl bg-white/[0.04] px-4 py-3 text-xs font-medium text-neutral-200 hover:bg-white/[0.08]"
              >
                <span>Incidents Queue</span>
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                  Clean
                </span>
              </Link>
              <Link
                href={`/${locale}/admin/users`}
                className="group/btn flex items-center justify-between rounded-xl bg-white/[0.04] px-4 py-3 text-xs font-medium text-neutral-200 hover:bg-white/[0.08]"
              >
                <span>User Directory</span>
                <ChevronRight className="h-3.5 w-3.5 text-neutral-500 transition-transform group-hover/btn:translate-x-0.5" />
              </Link>
            </div>
          </SpatialBentoCard>

          {/* Database Layer */}
          <SpatialBentoCard
            className="md:col-span-1 md:row-span-1"
            title="Supabase Edge Data"
            description="PostgreSQL & RLS status"
            actionIcon={<DatabaseZap className="h-4 w-4 text-emerald-400" />}
          >
            <div className="mt-auto flex flex-col justify-end">
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-[36px] leading-none font-medium text-white">
                    100<span className="ml-1 text-lg text-emerald-400">%</span>
                  </span>
                  <p className="mt-1 text-xs text-neutral-400">RLS Policy Enforced</p>
                </div>
                <CheckCircle2 className="h-6 w-6 text-emerald-400" />
              </div>
            </div>
          </SpatialBentoCard>

          {/* Quick Hub Navigation Bar */}
          <SpatialBentoCard
            className="md:col-span-3 md:row-span-1"
            title="Platform Command Modules"
            description="Direct spatial access to key administrative systems."
            actionIcon={<TrendingUp className="h-4 w-4 text-purple-400" />}
          >
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Link
                href={`/${locale}/admin/health`}
                className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-center transition-colors hover:bg-white/[0.06]"
              >
                <p className="text-xs font-semibold text-neutral-200">System Health</p>
                <p className="mt-0.5 text-[11px] text-neutral-500">Live Status</p>
              </Link>

              <Link
                href={`/${locale}/admin/master-plan`}
                className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-center transition-colors hover:bg-white/[0.06]"
              >
                <p className="text-xs font-semibold text-neutral-200">Master Plan</p>
                <p className="mt-0.5 text-[11px] text-neutral-500">Roadmap & Status</p>
              </Link>

              <Link
                href={`/${locale}/admin/cross-audit-dashboard`}
                className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-center transition-colors hover:bg-white/[0.06]"
              >
                <p className="text-xs font-semibold text-neutral-200">Cross Audit</p>
                <p className="mt-0.5 text-[11px] text-neutral-500">360 Verification</p>
              </Link>

              <Link
                href={`/${locale}/admin/settings`}
                className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-center transition-colors hover:bg-white/[0.06]"
              >
                <p className="text-xs font-semibold text-neutral-200">Settings</p>
                <p className="mt-0.5 text-[11px] text-neutral-500">Global Config</p>
              </Link>
            </div>
          </SpatialBentoCard>
        </div>
      </div>
    </div>
  );
}
