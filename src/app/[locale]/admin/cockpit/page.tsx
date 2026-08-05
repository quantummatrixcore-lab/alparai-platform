import { SpatialBentoCard } from "@/components/admin/spatial-bento-card";
import {
  Command,
  Activity,
  Users,
  ShieldAlert,
  DatabaseZap,
  Search,
  ChevronRight,
} from "lucide-react";

export default async function AdminCockpitPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  return (
    <div className="min-h-screen bg-[#0A0A0A] p-6 text-neutral-50 selection:bg-white/30 selection:text-white md:p-12 lg:p-16">
      <div className="mx-auto max-w-7xl">
        {/* Header & Cmd+K simulation */}
        <div className="mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <h1 className="bg-gradient-to-br from-white to-neutral-500 bg-clip-text text-4xl font-semibold tracking-[-0.02em] text-transparent sm:text-5xl">
              Cockpit
            </h1>
            <p className="text-[17px] font-medium tracking-[-0.01em] text-neutral-400/80">
              Mission control and spatial overview.
            </p>
          </div>

          <button className="group flex items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.02] px-5 py-3 text-[14px] text-neutral-400 backdrop-blur-xl transition-all duration-300 hover:border-white/[0.15] hover:bg-white/[0.06] hover:text-neutral-200">
            <Search className="h-4 w-4" />
            <span className="font-medium tracking-[-0.01em]">Quick actions</span>
            <kbd className="ml-4 hidden h-5 items-center gap-0.5 rounded-md bg-white/[0.08] px-2 font-sans text-[11px] font-medium text-neutral-300 group-hover:bg-white/[0.15] md:inline-flex">
              <span>⌘</span>
              <span>K</span>
            </kbd>
          </button>
        </div>

        {/* Bento Grid */}
        <div className="grid auto-rows-[280px] grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {/* Large Main Card */}
          <SpatialBentoCard
            className="md:col-span-2 md:row-span-2"
            title="System Integrity"
            description="Real-time monitoring of core platform health across all global regions."
            actionIcon={<Activity className="h-4 w-4" />}
          >
            <div className="flex h-full flex-col justify-end">
              <div className="mb-6 flex items-baseline gap-3">
                <div className="text-[80px] leading-none font-medium tracking-[-0.04em] text-white">
                  99.9
                </div>
                <div className="text-2xl font-medium tracking-[-0.02em] text-emerald-400/90">
                  % Uptime
                </div>
              </div>
              <div className="relative h-32 w-full overflow-hidden rounded-2xl border-t border-emerald-500/10 bg-gradient-to-t from-emerald-500/[0.15] to-transparent">
                {/* Decorative graph lines */}
                <div className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-emerald-500/0 via-emerald-500 to-emerald-500/0" />
                <div className="absolute bottom-6 left-0 h-[1px] w-full border-b border-dashed border-emerald-500/20" />
                <div className="absolute bottom-12 left-0 h-[1px] w-full border-b border-dashed border-emerald-500/10" />

                {/* Glowing orb */}
                <div className="absolute bottom-[-20px] left-1/2 h-[40px] w-[100px] -translate-x-1/2 bg-emerald-500/40 blur-3xl" />
              </div>
            </div>
          </SpatialBentoCard>

          {/* 1-Click Actions Card */}
          <SpatialBentoCard
            className="md:col-span-1 md:row-span-1"
            title="User Operations"
            description="Active sessions and moderation queues."
            actionIcon={<Users className="h-4 w-4" />}
          >
            <div className="mt-4 flex flex-col gap-2.5">
              <button className="group/btn flex w-full items-center justify-between rounded-2xl bg-white/[0.04] px-5 py-4 text-[14px] font-medium tracking-[-0.01em] transition-all duration-300 hover:bg-white/[0.08]">
                <span className="text-neutral-200">Review Reports</span>
                <div className="flex h-6 min-w-6 items-center justify-center rounded-full bg-rose-500/[0.15] px-2 text-[11px] font-semibold text-rose-400 transition-colors group-hover/btn:bg-rose-500/30 group-hover/btn:text-rose-300">
                  3
                </div>
              </button>
              <button className="group/btn flex w-full items-center justify-between rounded-2xl bg-white/[0.04] px-5 py-4 text-[14px] font-medium tracking-[-0.01em] transition-all duration-300 hover:bg-white/[0.08]">
                <span className="text-neutral-200">Access Control</span>
                <ChevronRight className="h-4 w-4 text-neutral-500 transition-transform group-hover/btn:translate-x-1 group-hover/btn:text-neutral-300" />
              </button>
            </div>
          </SpatialBentoCard>

          {/* Security Alerts Card */}
          <SpatialBentoCard
            className="md:col-span-1 md:row-span-2"
            title="Threat Radar"
            description="Automated PII & Policy sweeps detecting anomalies."
            actionIcon={<ShieldAlert className="h-4 w-4" />}
          >
            <div className="mt-2 flex h-full flex-col">
              <div className="flex-1 space-y-3">
                <div className="group/alert relative flex items-start gap-4 rounded-2xl border border-rose-500/10 bg-rose-500/[0.02] p-4 transition-all duration-300 hover:border-rose-500/20 hover:bg-rose-500/[0.05]">
                  <div className="mt-1 h-2.5 w-2.5 shrink-0 animate-pulse rounded-full bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.8)]" />
                  <div>
                    <p className="text-[14px] font-medium tracking-[-0.01em] text-rose-200">
                      PII Leak Attempt
                    </p>
                    <p className="mt-1 text-[13px] leading-relaxed text-rose-200/50">
                      Automated block by Guardian. <br /> ID:{" "}
                      <span className="font-mono">#8492</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-2xl border border-amber-500/10 bg-amber-500/[0.02] p-4 transition-all duration-300 hover:border-amber-500/20 hover:bg-amber-500/[0.05]">
                  <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-amber-500" />
                  <div>
                    <p className="text-[14px] font-medium tracking-[-0.01em] text-amber-200">
                      Rate Limit Trigger
                    </p>
                    <p className="mt-1 text-[13px] leading-relaxed text-amber-200/50">
                      API endpoint <span className="font-mono">/v1/analyze</span>. IP logged.
                    </p>
                  </div>
                </div>
              </div>

              <button className="mt-auto flex w-full items-center justify-center gap-2.5 rounded-2xl bg-white/[0.04] py-4 text-[14px] font-medium tracking-[-0.01em] text-white transition-all duration-300 hover:bg-white/[0.08] hover:shadow-[0_4px_16px_rgba(255,255,255,0.05)]">
                <Command className="h-4 w-4 opacity-50" />
                <span>Full Audit Log</span>
              </button>
            </div>
          </SpatialBentoCard>

          {/* Database Status */}
          <SpatialBentoCard
            className="md:col-span-1 md:row-span-1"
            title="Data Layer"
            description="Supabase Edge Network"
            actionIcon={<DatabaseZap className="h-4 w-4" />}
          >
            <div className="mt-auto flex h-full flex-col justify-end">
              <div className="flex items-end justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-[40px] leading-none font-medium tracking-[-0.02em] text-white">
                    12<span className="ml-1 text-xl text-neutral-500">ms</span>
                  </span>
                  <span className="text-[13px] font-medium tracking-[-0.01em] text-neutral-400">
                    Avg Global Latency
                  </span>
                </div>
                <div className="relative mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10">
                  <div className="absolute inset-0 animate-[spin_4s_linear_infinite] rounded-full border border-emerald-500/20" />
                  <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
                </div>
              </div>
            </div>
          </SpatialBentoCard>
        </div>
      </div>
    </div>
  );
}
