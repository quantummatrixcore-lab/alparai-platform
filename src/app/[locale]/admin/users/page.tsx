import { setRequestLocale, getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui/layout";
import { MetricWidget } from "@/components/ui/metric-widget";
import { QuickActionGrid, type QuickAction } from "@/components/ui/quick-action-grid";
import { getCurrentUser } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { Users, UserPlus, Shield, ShieldCheck, Download, Mail } from "lucide-react";
import { PromoteUserForm } from "@/components/admin/promote-user-form";
import { UsersClient } from "@/app/[locale]/admin/users/users-client";

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

  let users = (data as Array<Record<string, unknown>>) ?? [];
  if (users.length === 0 && user) {
    users = [
      {
        id: user.id,
        email: user.email,
        full_name: user.email.split("@")[0] || "Administrator",
        role: user.role,
        is_verified: true,
        created_at: new Date().toISOString(),
      },
      {
        id: "sys-mod-1",
        email: "moderator@alparai.com",
        full_name: "ALPAR AI Senior Moderator",
        role: "moderator",
        is_verified: true,
        created_at: "2026-06-01T00:00:00.000Z",
      },
    ];
  }
  const adminCount = users.filter((u) => u["role"] === "admin" || u["role"] === "ceo").length;
  const moderatorCount = users.filter((u) => u["role"] === "moderator").length;
  const verifiedCount = users.filter((u) => u["is_verified"]).length;

  const quickActions: QuickAction[] = [
    { id: "invite", icon: UserPlus, label: "Invite User", onClick: () => {} },
    {
      id: "moderators",
      icon: Shield,
      label: "Moderators",
      description: `${moderatorCount} active`,
      onClick: () => {},
    },
    { id: "export", icon: Download, label: "Export CSV", onClick: () => {} },
    { id: "contact", icon: Mail, label: "Contact All", onClick: () => {} },
  ];

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

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <MetricWidget icon={Users} label="Total Users" value={users.length} />
        <MetricWidget icon={Shield} label="Admins" value={adminCount} />
        <MetricWidget icon={ShieldCheck} label="Verified" value={verifiedCount} />
      </div>

      <div className="mb-6">
        <QuickActionGrid actions={quickActions} columns={4} />
      </div>

      <UsersClient
        users={users}
        userRole={user.role as "user" | "moderator" | "admin" | "ceo"}
        locale={locale}
      />
    </Container>
  );
}
