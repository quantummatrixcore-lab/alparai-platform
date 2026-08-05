import { SpatialBentoCard } from "@/components/admin/spatial-bento-card";
import {
  Command,
  Activity,
  Users,
  ShieldAlert,
  DatabaseZap,
  Search,
  ArrowRight,
} from "lucide-react";

export default async function AdminCockpitPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  return (
    <div className="min-h-screen bg-neutral-950 p-6 text-neutral-50 selection:bg-white/30 selection:text-white md:p-12">
      {/* Header & Cmd+K simulation */}
      <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">Cockpit</h1>
          <p className="mt-2 text-lg text-neutral-400">Mission control and spatial overview.</p>
        </div>

        <button className="group flex items-center gap-3 rounded-full border border-white/10 bg-neutral-900/50 px-4 py-2.5 text-sm text-neutral-400 backdrop-blur-md transition-all hover:border-white/20 hover:bg-neutral-800/80 hover:text-neutral-200 hover:shadow-lg">
          <Search className="h-4 w-4" />
          <span>Quick actions...</span>
          <kbd className="hidden h-5 items-center gap-1 rounded bg-white/10 px-1.5 font-mono text-[10px] font-medium text-neutral-300 group-hover:bg-white/20 md:inline-flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </button>
      </div>

      {/* Bento Grid */}
      <div className="grid auto-rows-[220px] grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
        {/* Large Main Card */}
        <SpatialBentoCard
          className="md:col-span-2 md:row-span-2"
          title="System Integrity"
          description="Real-time monitoring of core platform health."
          actionIcon={<Activity className="h-4 w-4" />}
        >
          <div className="flex h-full flex-col justify-end">
            <div className="mb-4 flex items-end gap-4">
              <div className="text-6xl font-light tracking-tighter text-white">99.9</div>
              <div className="mb-1 text-xl font-medium text-emerald-400">% Uptime</div>
            </div>
            <div className="relative h-24 w-full overflow-hidden rounded-xl border-b-2 border-emerald-500 bg-gradient-to-t from-emerald-500/20 to-transparent">
              {/* Decorative graph lines */}
              <div className="absolute bottom-0 left-0 h-[1px] w-full bg-emerald-500/50" />
              <div className="absolute bottom-4 left-0 h-[1px] w-full border-b border-dashed border-emerald-500/20 bg-emerald-500/20" />
            </div>
          </div>
        </SpatialBentoCard>

        {/* 1-Click Actions Card */}
        <SpatialBentoCard
          className="md:col-span-1 md:row-span-1"
          title="User Operations"
          description="Active sessions and moderation."
          actionIcon={<Users className="h-4 w-4" />}
        >
          <div className="mt-4 flex flex-col gap-3">
            <button className="flex w-full items-center justify-between rounded-xl bg-white/5 px-4 py-3 text-sm font-medium transition-colors hover:bg-white/15">
              <span>Review Reports</span>
              <div className="flex h-5 w-5 items-center justify-center rounded bg-rose-500/20 text-[10px] text-rose-300">
                3
              </div>
            </button>
            <button className="flex w-full items-center justify-between rounded-xl bg-white/5 px-4 py-3 text-sm font-medium transition-colors hover:bg-white/15">
              <span>Access Control</span>
              <ArrowRight className="h-4 w-4 text-neutral-400" />
            </button>
          </div>
        </SpatialBentoCard>

        {/* Security Alerts Card */}
        <SpatialBentoCard
          className="md:col-span-1 md:row-span-2"
          title="Threat Radar"
          description="Automated PII & Policy sweeps."
          actionIcon={<ShieldAlert className="h-4 w-4" />}
        >
          <div className="mt-4 flex h-full flex-col">
            <div className="flex-1 space-y-4">
              <div className="group relative flex items-start gap-3 rounded-xl border border-rose-500/20 bg-rose-500/5 p-3 transition-colors hover:bg-rose-500/10">
                <div className="mt-1.5 h-2 w-2 shrink-0 animate-pulse rounded-full bg-rose-500" />
                <div>
                  <p className="text-sm font-medium text-rose-200">PII Leak Attempt</p>
                  <p className="mt-0.5 text-xs text-rose-200/60">
                    Automated block by Guardian. ID: #8492
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3">
                <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-amber-500" />
                <div>
                  <p className="text-sm font-medium text-amber-200">Rate Limit Trigger</p>
                  <p className="mt-0.5 text-xs text-amber-200/60">
                    API endpoint /v1/analyze. IP logged.
                  </p>
                </div>
              </div>
            </div>

            <button className="mt-auto flex w-full items-center justify-center gap-2 rounded-xl bg-white/10 py-3 text-sm font-medium text-white transition-colors hover:bg-white/20">
              <Command className="h-4 w-4" />
              <span>Full Audit Log</span>
            </button>
          </div>
        </SpatialBentoCard>

        {/* Database Status */}
        <SpatialBentoCard
          className="md:col-span-1 md:row-span-1"
          title="Data Layer"
          description="Supabase Node Status"
          actionIcon={<DatabaseZap className="h-4 w-4" />}
        >
          <div className="mt-auto flex items-end justify-between">
            <div className="flex flex-col">
              <span className="text-3xl font-light text-white">12ms</span>
              <span className="text-xs text-neutral-400">Avg Latency</span>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20">
              <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            </div>
          </div>
        </SpatialBentoCard>
      </div>
    </div>
  );
}
