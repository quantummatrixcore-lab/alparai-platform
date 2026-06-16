import { setRequestLocale, getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui/layout";
import { Card, CardContent } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatDate } from "@/lib/utils";
import { Activity } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admin" });
  return { title: t("auditTitle") };
}

export default async function AdminAuditPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "admin" });
  const user = await getCurrentUser();
  if (!user) redirect(`/${locale}/auth/signin?next=/${locale}/admin/audit`);
  if (user.role !== "admin" && user.role !== "ceo") redirect(`/${locale}/admin`);

  const admin = createAdminClient();
  const { data } = await admin
    .from("audit_log")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <Container className="py-10">
      <header className="mb-6">
        <h1 className="text-fg-primary inline-flex items-center gap-2 text-2xl font-bold">
          <Activity className="text-brand-400 h-6 w-6" /> {t("auditTitle")}
        </h1>
        <p className="text-fg-muted mt-1 text-sm">100 {t("recent_actions")}</p>
      </header>
      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <caption className="sr-only">System Audit Logs Table</caption>
            <thead>
              <tr className="border-border-subtle text-fg-muted border-b text-left text-xs font-semibold tracking-wider uppercase">
                <th className="p-4">{t("action")}</th>
                <th className="p-4">{t("entity")}</th>
                <th className="p-4 text-right">{t("when")}</th>
              </tr>
            </thead>
            <tbody className="divide-border-subtle divide-y">
              {((data as Array<Record<string, unknown>>) ?? []).map((row) => (
                <tr key={row["id"] as string} className="hover:bg-bg-tertiary/30">
                  <td className="text-fg-primary p-4 font-mono text-xs">
                    {row["action"] as string}
                  </td>
                  <td className="text-fg-muted p-4 text-xs">
                    {row["entity_type"] as string} ·{" "}
                    <span className="font-mono">{(row["entity_id"] as string).slice(0, 8)}</span>
                  </td>
                  <td className="text-fg-muted p-4 text-right text-xs">
                    {formatDate(new Date(row["created_at"] as string), locale)}
                  </td>
                </tr>
              ))}
              {(!data || data.length === 0) && (
                <tr>
                  <td colSpan={3} className="text-fg-muted p-12 text-center text-sm">
                    {t("no_events")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </Container>
  );
}
