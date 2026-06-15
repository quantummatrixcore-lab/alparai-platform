import { setRequestLocale, getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui/layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getCurrentUser } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatDate } from "@/lib/utils";
import { Users } from "lucide-react";
import { PromoteUserForm } from "@/components/admin/promote-user-form";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admin" });
  return { title: t("usersTitle") };
}

export default async function AdminUsersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "admin" });
  const user = await getCurrentUser();
  if (!user) redirect(`/${locale}/auth/signin?next=/${locale}/admin/users`);
  if (user.role !== "admin" && user.role !== "ceo") redirect(`/${locale}/admin`);

  const admin = createAdminClient();
  const { data } = await admin
    .from("users")
    .select("id, email, full_name, role, is_verified, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <Container className="py-10">
      <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-fg-primary inline-flex items-center gap-2 text-2xl font-bold">
            <Users className="text-brand-400 h-6 w-6" /> {t("users")}
          </h1>
          <p className="text-fg-muted mt-1 text-sm">{t("all_registered_users")}</p>
        </div>
        <PromoteUserForm currentUserRole={user.role} />
      </header>
      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-border-subtle text-fg-muted border-b text-left text-xs font-semibold tracking-wider uppercase">
                <th className="p-4">{t("name")}</th>
                <th className="p-4">{t("email")}</th>
                <th className="p-4">{t("role")}</th>
                <th className="p-4">{t("status")}</th>
                <th className="p-4 text-right">{t("joined")}</th>
              </tr>
            </thead>
            <tbody className="divide-border-subtle divide-y">
              {((data as Array<Record<string, unknown>>) ?? []).map((u) => (
                <tr key={u["id"] as string} className="hover:bg-bg-tertiary/30">
                  <td className="text-fg-primary p-4">
                    {(u["full_name"] as string | null) ?? "—"}
                  </td>
                  <td className="text-fg-muted p-4 text-xs">{(u["email"] as string) ?? "—"}</td>
                  <td className="p-4">
                    {(() => {
                      const r = (u["role"] as string) ?? "user";
                      if (r === "ceo") return <Badge variant="danger">{r}</Badge>;
                      if (r === "admin") return <Badge variant="warning">{r}</Badge>;
                      if (r === "moderator") return <Badge variant="brand">{r}</Badge>;
                      return <Badge variant="muted">{r}</Badge>;
                    })()}
                  </td>
                  <td className="p-4">
                    {u["is_verified"] ? (
                      <Badge variant="success" dot>
                        {t("verified")}
                      </Badge>
                    ) : (
                      <Badge variant="muted">{t("active")}</Badge>
                    )}
                  </td>
                  <td className="text-fg-muted p-4 text-right">
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
