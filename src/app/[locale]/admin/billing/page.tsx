import { setRequestLocale } from "next-intl/server";
import { requireAdmin } from "@/lib/auth/session";
import { createServerClient } from "@/lib/supabase/server";
import { CheckCircle, WarningCircle } from "@phosphor-icons/react/dist/ssr";

export default async function BillingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  await requireAdmin();

  const supabase = await createServerClient();
  const { data: subs, error } = await supabase
    .from("subscriptions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching subscriptions:", error);
  }

  const activeSubs = subs?.filter((s) => s.status === "active") || [];
  const planPrices: Record<string, number> = { free: 0, pro: 2500, enterprise: 10000 };
  const mrr = activeSubs.reduce((acc, s) => acc + (planPrices[s.plan] ?? 0), 0);

  return (
    <div className="animate-in fade-in space-y-8 duration-500">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-white drop-shadow-md">
          Billing & Subscriptions
        </h1>
        <p className="text-fg-secondary mt-2">Manage customer subscriptions and MRR</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="bg-bg-secondary/40 rounded-xl border border-white/5 p-6 backdrop-blur">
          <p className="text-fg-muted text-xs font-bold tracking-wide uppercase">Total MRR</p>
          <p className="mt-2 font-mono text-3xl font-black text-emerald-400">
            ${mrr.toLocaleString()}
          </p>
        </div>
        <div className="bg-bg-secondary/40 rounded-xl border border-white/5 p-6 backdrop-blur">
          <p className="text-fg-muted text-xs font-bold tracking-wide uppercase">Active Subs</p>
          <p className="mt-2 font-mono text-3xl font-black text-white">{activeSubs.length}</p>
        </div>
        <div className="bg-bg-secondary/40 rounded-xl border border-white/5 p-6 backdrop-blur">
          <p className="text-fg-muted text-xs font-bold tracking-wide uppercase">Total Records</p>
          <p className="mt-2 font-mono text-3xl font-black text-white">{subs?.length || 0}</p>
        </div>
      </div>

      <div className="bg-bg-secondary/40 overflow-hidden rounded-xl border border-white/5 backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-white">
            <thead className="text-fg-muted bg-white/5 text-xs font-bold uppercase">
              <tr>
                <th className="px-6 py-4">ID / User</th>
                <th className="px-6 py-4">Plan</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {subs?.map((sub) => (
                <tr key={sub.id} className="transition-colors hover:bg-white/5">
                  <td className="px-6 py-4 font-mono text-xs text-white">
                    {sub.id.substring(0, 8)}...
                    <br />
                    <span className="text-fg-muted">{sub.user_id?.substring(0, 8)}...</span>
                  </td>
                  <td className="px-6 py-4 capitalize">{sub.plan || "Custom"}</td>
                  <td className="px-6 py-4">
                    {sub.status === "active" ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 text-xs text-emerald-400">
                        <CheckCircle weight="fill" /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2 py-1 text-xs text-rose-400">
                        <WarningCircle weight="fill" /> {sub.status || "Unknown"}
                      </span>
                    )}
                  </td>
                  <td className="text-fg-muted px-6 py-4 font-mono text-xs">
                    {new Date(sub.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {(!subs || subs.length === 0) && (
                <tr>
                  <td colSpan={4} className="text-fg-muted px-6 py-8 text-center italic">
                    No subscriptions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
