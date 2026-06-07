import { setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui/layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getCurrentUser } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatDate } from "@/lib/utils";
import { Users } from "lucide-react";

export async function generateMetadata({ params: _params }: { params: Promise<{ locale: string }> }) {
  return { title: "Users" };
}

export default async function AdminUsersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const user = await getCurrentUser();
  if (!user) redirect(`/${locale}/auth/signin?next=/${locale}/admin/users`);
  if (user.role !== "admin") redirect(`/${locale}/admin`);

  const admin = createAdminClient();
  const { data } = await admin
    .from("users")
    .select("id, email, full_name, role, is_verified, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <Container className="py-10">
      <header className="mb-6">
        <h1 className="inline-flex items-center gap-2 text-2xl font-bold text-fg-primary">
          <Users className="h-6 w-6 text-brand-400" /> Users
        </h1>
        <p className="mt-1 text-sm text-fg-muted">All registered users.</p>
      </header>
      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-subtle text-left text-xs font-semibold uppercase tracking-wider text-fg-muted">
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {((data as Array<Record<string, unknown>>) ?? []).map((u) => (
                <tr key={u["id"] as string} className="hover:bg-bg-tertiary/30">
                  <td className="p-4 text-fg-primary">
                    {(u["full_name"] as string | null) ?? "—"}
                  </td>
                  <td className="p-4 text-fg-muted text-xs">
                    {(u["email"] as string) ?? "—"}
                  </td>
                  <td className="p-4">
                    <Badge variant="muted">{(u["role"] as string) ?? "user"}</Badge>
                  </td>
                  <td className="p-4">
                    {u["is_verified"] ? (
                      <Badge variant="success" dot>Verified</Badge>
                    ) : (
                      <Badge variant="muted">Active</Badge>
                    )}
                  </td>
                  <td className="p-4 text-right text-fg-muted">
                    {formatDate(new Date(u["created_at"] as string), locale)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </Container>
  );
}
