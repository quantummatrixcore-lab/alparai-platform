import { setRequestLocale, getTranslations } from "next-intl/server";
import { requireAdmin } from "@/lib/auth/session";
import { createServerClient } from "@/lib/supabase/server";
import { Clock, ShieldWarning, CheckCircle } from "@phosphor-icons/react/dist/ssr";

export default async function DsarPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  await requireAdmin();
  const t = await getTranslations({ locale, namespace: "admin" });

  const supabase = await createServerClient();
  const { data: requests, error } = await supabase
    .from("redaction_requests")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching DSAR requests:", error);
  }

  const getSlaDaysLeft = (createdAt: string) => {
    const createdDate = new Date(createdAt);
    const deadline = new Date(createdDate.getTime() + 30 * 24 * 60 * 60 * 1000);
    const now = new Date();
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="animate-in fade-in space-y-8 duration-500">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-white drop-shadow-md">
          {t("dsar_title")}
        </h1>
        <p className="text-fg-secondary mt-2">{t("dsar_subtitle")}</p>
      </div>

      <div className="bg-bg-secondary/40 overflow-hidden rounded-xl border border-white/5 backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-white">
            <thead className="text-fg-muted bg-white/5 text-xs font-bold uppercase">
              <tr>
                <th className="px-6 py-4">ID / Target</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">SLA Countdown</th>
                <th className="px-6 py-4">Submitted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {requests?.map((req) => {
                const daysLeft = getSlaDaysLeft(req.created_at);
                const isCritical =
                  daysLeft <= 7 && req.status !== "completed" && req.status !== "rejected";
                const isOverdue =
                  daysLeft < 0 && req.status !== "completed" && req.status !== "rejected";

                return (
                  <tr key={req.id} className="transition-colors hover:bg-white/5">
                    <td className="px-6 py-4 font-mono text-xs text-white">
                      {req.id.substring(0, 8)}...
                      <br />
                      <span className="text-fg-muted">
                        {req.reason || `Incident ${req.incident_id.substring(0, 8)}`}
                      </span>
                    </td>
                    <td className="px-6 py-4 capitalize">
                      {req.status === "completed" ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 text-xs text-emerald-400">
                          <CheckCircle weight="fill" /> {t("dsar_completed")}
                        </span>
                      ) : req.status === "rejected" ? (
                        <span className="bg-fg-muted/10 text-fg-muted inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs">
                          Rejected
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-1 text-xs text-amber-400">
                          <Clock weight="fill" /> {req.status || t("dsar_pending")}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {req.status === "completed" || req.status === "rejected" ? (
                        <span className="text-fg-muted">—</span>
                      ) : (
                        <span
                          className={`inline-flex items-center gap-1 font-mono text-sm font-bold ${
                            isOverdue
                              ? "text-rose-400"
                              : isCritical
                                ? "text-amber-400"
                                : "text-emerald-400"
                          }`}
                        >
                          {isOverdue && <ShieldWarning weight="fill" className="animate-pulse" />}
                          {daysLeft} days
                        </span>
                      )}
                    </td>
                    <td className="text-fg-muted px-6 py-4 font-mono text-xs">
                      {new Date(req.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })}
              {(!requests || requests.length === 0) && (
                <tr>
                  <td colSpan={4} className="text-fg-muted px-6 py-8 text-center italic">
                    {t("dsar_empty")}
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
