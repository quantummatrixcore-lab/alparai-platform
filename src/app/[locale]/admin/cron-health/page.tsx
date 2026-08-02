import { setRequestLocale, getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { Clock, ShieldCheck, AlertCircle } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/session";
import { AdminContainer, AdminPageHeader } from "@/components/admin/admin-design-kit";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admin" });
  return { title: t("cron_health") || "Cron Health" };
}

export default async function CronHealthPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "admin" });
  const user = await getCurrentUser();
  if (!user) redirect(`/${locale}/auth/signin?next=/${locale}/admin/cron-health`);

  const userRole = user.role as string;
  if (
    userRole !== "moderator" &&
    userRole !== "admin" &&
    userRole !== "ceo" &&
    userRole !== "advisor"
  ) {
    redirect(`/${locale}`);
  }

  // Mock data for cron jobs
  const cronJobs = [
    { name: "ai-heartbeat", lastRun: "2 mins ago", status: "Active" },
    { name: "keep-alive", lastRun: "5 mins ago", status: "Active" },
    { name: "retro-audit", lastRun: "1 hour ago", status: "Active" },
    { name: "k-weekly-refresh", lastRun: "2 days ago", status: "Active" },
    { name: "k-model-retirement", lastRun: "5 days ago", status: "Degraded" },
  ];

  return (
    <AdminContainer>
      <AdminPageHeader
        icon={<Clock className="h-7 w-7 text-sky-400" />}
        title={t("cron_health") || "Cron Job Health"}
        subtitle={"Monitor background tasks and periodic system jobs"}
      />

      <div className="mt-8 rounded-xl border border-white/10 bg-black/40 p-6 backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/10 text-xs font-semibold text-white/40 uppercase">
              <tr>
                <th className="pr-4 pb-3">{t("job_name")}</th>
                <th className="pr-4 pb-3">{t("last_run")}</th>
                <th className="pb-3">{t("status")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {cronJobs.map((job) => (
                <tr key={job.name} className="text-white/80 hover:bg-white/5">
                  <td className="py-3 pr-4 font-mono text-sky-400">{job.name}</td>
                  <td className="py-3 pr-4 text-white/60">{job.lastRun}</td>
                  <td className="py-3">
                    {job.status === "Active" ? (
                      <span className="inline-flex items-center gap-1.5 rounded bg-emerald-500/10 px-2 py-1 text-xs font-bold text-emerald-400">
                        <ShieldCheck className="h-3.5 w-3.5" /> {t("active")}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded bg-red-500/10 px-2 py-1 text-xs font-bold text-red-400">
                        <AlertCircle className="h-3.5 w-3.5" /> {t("degraded")}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminContainer>
  );
}
