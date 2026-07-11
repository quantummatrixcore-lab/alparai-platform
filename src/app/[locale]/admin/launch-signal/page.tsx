import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import {
  Activity,
  Rocket,
  Globe,
  Database,
  Search,
  Eye,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

export const metadata = {
  title: "Launch Signal | ALPAR AI Admin",
};

export default async function LaunchSignalPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const supabase = await createClient();

  // Admin check
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/auth/signin?next=/${locale}/admin/launch-signal`);
  }

  const { data: roleData } = await supabase.from("users").select("role").eq("id", user.id).single();

  if (!roleData || roleData.role !== "admin") {
    redirect(`/${locale}`);
  }

  // Fetch real data
  const { count: totalIncidents } = await supabase
    .from("incidents")
    .select("*", { count: "exact", head: true });

  const { count: userSubmitted } = await supabase
    .from("incidents")
    .select("*", { count: "exact", head: true })
    .eq("incident_source", "user_submitted");

  const { count: pendingIncidents } = await supabase
    .from("incidents")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending_review");

  const { count: totalUsers } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-white">
            <Rocket className="text-brand-400 h-6 w-6" />
            T-0 Launch Signal
          </h1>
          <p className="text-fg-muted mt-1">
            Live mission control for ALPAR AI launch day metrics.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500"></span>
          </span>
          <span className="text-sm font-medium text-emerald-400">Live</span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-bg-secondary border-border-subtle rounded-xl border p-6">
          <div className="flex items-center gap-4">
            <div className="bg-brand-500/10 text-brand-400 flex h-12 w-12 items-center justify-center rounded-lg">
              <Database className="h-6 w-6" />
            </div>
            <div>
              <p className="text-fg-muted text-sm font-medium">Total Incidents</p>
              <h3 className="text-2xl font-bold text-white">{totalIncidents || 0}</h3>
            </div>
          </div>
        </div>

        <div className="bg-bg-secondary border-border-subtle rounded-xl border p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
              <Search className="h-6 w-6" />
            </div>
            <div>
              <p className="text-fg-muted text-sm font-medium">User Submitted</p>
              <h3 className="text-2xl font-bold text-white">{userSubmitted || 0}</h3>
            </div>
          </div>
        </div>

        <div className="bg-bg-secondary border-border-subtle rounded-xl border p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <p className="text-fg-muted text-sm font-medium">Pending Review</p>
              <h3 className="text-2xl font-bold text-white">{pendingIncidents || 0}</h3>
            </div>
          </div>
        </div>

        <div className="bg-bg-secondary border-border-subtle rounded-xl border p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <Eye className="h-6 w-6" />
            </div>
            <div>
              <p className="text-fg-muted text-sm font-medium">Registered Users</p>
              <h3 className="text-2xl font-bold text-white">{totalUsers || 0}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-bg-secondary border-border-subtle rounded-xl border p-6">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-white">
            <Globe className="text-fg-muted h-5 w-5" />
            Launch Platforms
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div>
                <p className="font-medium text-white">Hacker News</p>
                <p className="text-fg-muted text-xs">Show HN Rank</p>
              </div>
              <div className="text-right">
                <p className="text-brand-400 text-lg font-bold">TBA</p>
                <a href="#" className="text-brand-400/80 text-xs hover:underline">
                  View Post ↗
                </a>
              </div>
            </div>

            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div>
                <p className="font-medium text-white">Product Hunt</p>
                <p className="text-fg-muted text-xs">Daily Rank</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-rose-400">TBA</p>
                <a href="#" className="text-xs text-rose-400/80 hover:underline">
                  View Launch ↗
                </a>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-white">Twitter / X</p>
                <p className="text-fg-muted text-xs">Launch Thread Views</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-blue-400">TBA</p>
                <a href="#" className="text-xs text-blue-400/80 hover:underline">
                  View Thread ↗
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-bg-secondary border-border-subtle rounded-xl border p-6">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-white">
            <AlertTriangle className="text-fg-muted h-5 w-5" />
            System Status
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-emerald-500/10 bg-emerald-500/5 p-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                <span className="font-medium text-emerald-400">Web Platform</span>
              </div>
              <span className="text-sm text-emerald-400/80">Operational</span>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-emerald-500/10 bg-emerald-500/5 p-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                <span className="font-medium text-emerald-400">Supabase DB</span>
              </div>
              <span className="text-sm text-emerald-400/80">Operational</span>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-emerald-500/10 bg-emerald-500/5 p-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                <span className="font-medium text-emerald-400">Vercel Edge</span>
              </div>
              <span className="text-sm text-emerald-400/80">Operational</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
