import { setRequestLocale, getTranslations } from "next-intl/server";
import { requireAdmin } from "@/lib/auth/session";
import { createServerClient } from "@/lib/supabase/server";
import { WarningCircle, CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { Users, Shield } from "lucide-react";
import { MetricCard } from "@/components/admin/metric-card";

export default async function AdvisoryBoardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  await requireAdmin();
  const t = await getTranslations({ locale, namespace: "admin" });

  const supabase = await createServerClient();
  const { data: members, error } = await supabase
    .from("advisory_board_members")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Error fetching advisory board:", error);
  }

  return (
    <div className="animate-in fade-in space-y-8 duration-500">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-white drop-shadow-md">
          {t("advisory_title")}
        </h1>
        <p className="text-fg-secondary mt-2">{t("advisory_subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <MetricCard
          title="Advisory Board Members"
          value={members?.length ?? 0}
          icon={<Users className="h-4 w-4" />}
          trend="neutral"
          trendLabel="Rule §21 bound"
          accentColor="#6366f1"
          sparkData={(members ?? []).map((_, i) => ({ value: i + 1 }))}
          chartType="bar"
        />
        <MetricCard
          title="Governance Status"
          value="ACTIVE"
          icon={<Shield className="h-4 w-4" />}
          trend="up"
          trendLabel="Compliant"
          accentColor="#10b981"
          badge="§21 OK"
          badgeColor="text-emerald-400"
        />
      </div>

      <div className="bg-bg-secondary/40 overflow-hidden rounded-xl border border-white/5 backdrop-blur-xl">
        <div className="border-b border-white/5 bg-white/5 p-4">
          <p className="text-fg-muted flex items-center gap-2 text-sm">
            <WarningCircle weight="fill" className="text-amber-400" />
            <strong>{t("advisory_rule_21")}</strong>
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-white">
            <thead className="text-fg-muted bg-white/5 text-xs font-bold uppercase">
              <tr>
                <th className="px-6 py-4">{t("advisory_th_name")}</th>
                <th className="px-6 py-4">{t("advisory_th_status")}</th>
                <th className="px-6 py-4">{t("advisory_th_term")}</th>
                <th className="px-6 py-4">{t("advisory_th_order")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {members?.map((member) => (
                <tr key={member.id} className="transition-colors hover:bg-white/5">
                  <td className="px-6 py-4 font-mono text-xs text-white">
                    {member.name}
                    <br />
                    <span className="text-fg-muted">{member.id.substring(0, 8)}...</span>
                  </td>
                  <td className="px-6 py-4 capitalize">
                    {member.is_active ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 text-xs text-emerald-400">
                        <CheckCircle weight="fill" /> {t("advisory_active")}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-1 text-xs text-amber-400">
                        {t("advisory_inactive")}
                      </span>
                    )}
                  </td>
                  <td className="text-fg-muted px-6 py-4 text-xs">
                    {member.term_start?.substring(0, 10) ?? "—"} →{" "}
                    {member.term_end?.substring(0, 10) ?? "∞"}
                  </td>
                  <td className="text-fg-muted px-6 py-4 text-xs">{member.display_order}</td>
                </tr>
              ))}
              {(!members || members.length === 0) && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="mx-auto flex max-w-md flex-col items-center justify-center text-center">
                      <div className="mb-3 rounded-full border border-amber-500/20 bg-amber-500/10 p-3 text-amber-400">
                        <WarningCircle size={32} weight="duotone" />
                      </div>
                      <h3 className="text-base font-bold text-white">
                        Henüz Kayıtlı Danışma Kurulu Üyesi Bulunmuyor
                      </h3>
                      <p className="text-fg-muted mt-1 text-xs">
                        ALPAR AI bağımsız danışma kurulu ve etik denetim heyeti üyeleri veritabanına
                        eklendiğinde burada listelenecektir.
                      </p>
                    </div>
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
