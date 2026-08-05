import { requireAdmin } from "@/lib/auth/session";
import { listJulesSessions } from "@/actions/admin/jules";
import { JulesDashboard } from "@/components/admin/jules/jules-dashboard";

export const dynamic = "force-dynamic";

export default async function JulesPage() {
  await requireAdmin();

  const [sessionsResult] = await Promise.all([listJulesSessions()]);

  return (
    <div className="space-y-8 rounded-3xl bg-zinc-900/40 p-6 shadow-2xl ring-1 ring-white/10 backdrop-blur-xl md:p-8">
      <JulesDashboard
        sessions={sessionsResult.sessions ?? []}
        connected={sessionsResult.success}
        defaultRepo="quantummatrixcore-lab/Alparai.com"
      />
    </div>
  );
}

export async function generateMetadata() {
  return {
    title: "Google Jules — AI Coding Agent | ALPAR AI Admin",
    description: "Manage Google Jules autonomous coding agent sessions for the ALPAR AI platform",
  };
}
