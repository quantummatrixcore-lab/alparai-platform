import { setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui/layout";
import { Card, CardContent } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatDate } from "@/lib/utils";
import { Activity } from "lucide-react";

export async function generateMetadata({ params: _params }: { params: Promise<{ locale: string }> }) {
  return { title: "Audit Log" };
}

export default async function AdminAuditPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const user = await getCurrentUser();
  if (!user) redirect(`/${locale}/auth/signin?next=/${locale}/admin/audit`);
  if (user.role !== "admin") redirect(`/${locale}/admin`);

  const admin = createAdminClient();
  const { data } = await admin
    .from("audit_log")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <Container className="py-10">
      <header className="mb-6">
        <h1 className="inline-flex items-center gap-2 text-2xl font-bold text-fg-primary">
          <Activity className="h-6 w-6 text-brand-400" /> Audit log
        </h1>
        <p className="mt-1 text-sm text-fg-muted">100 most recent admin actions.</p>
      </header>
      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-subtle text-left text-xs font-semibold uppercase tracking-wider text-fg-muted">
                <th className="p-4">Action</th>
                <th className="p-4">Entity</th>
                <th className="p-4 text-right">When</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {((data as Array<Record<string, unknown>>) ?? []).map((row) => (
                <tr key={row["id"] as string} className="hover:bg-bg-tertiary/30">
                  <td className="p-4 font-mono text-xs text-fg-primary">{row["action"] as string}</td>
                  <td className="p-4 text-xs text-fg-muted">
                    {row["entity_type"] as string} · <span className="font-mono">{(row["entity_id"] as string).slice(0, 8)}</span>
                  </td>
                  <td className="p-4 text-right text-xs text-fg-muted">
                    {formatDate(new Date(row["created_at"] as string), locale)}
                  </td>
                </tr>
              ))}
              {(!data || data.length === 0) && (
                <tr>
                  <td colSpan={3} className="p-12 text-center text-sm text-fg-muted">
                    No audit events yet.
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
