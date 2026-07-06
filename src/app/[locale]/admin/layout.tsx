import * as React from "react";
import { setRequestLocale } from "next-intl/server";
import { AdminSidebar } from "@/components/admin/sidebar";
import { getCurrentUser } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const user = await getCurrentUser();
  if (!user) {
    redirect(`/${locale}/auth/signin?next=/${locale}/admin`);
  }
  const userRole = user.role as string;
  if (
    userRole !== "moderator" &&
    userRole !== "admin" &&
    userRole !== "ceo" &&
    userRole !== "advisor"
  ) {
    redirect(`/${locale}`);
  }

  const sidebarUser = {
    email: user.email,
    fullName: user.fullName,
    avatarUrl: user.avatarUrl,
    role: user.role,
  };

  return (
    <div className="bg-bg-primary text-fg-primary flex min-h-screen flex-col md:flex-row">
      <AdminSidebar user={sidebarUser} />
      <div className="min-w-0 flex-1 pt-16 md:pt-0">
        <main className="w-full">{children}</main>
      </div>
    </div>
  );
}
