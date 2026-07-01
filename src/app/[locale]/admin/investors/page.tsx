import { setRequestLocale, getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui/layout";
import { getCurrentUser } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { TrendingUp } from "lucide-react";
import { InvestorApplicationsList } from "@/components/admin/investor-applications-list";
import type { InvestorApplicationItem } from "@/components/admin/investor-applications-list";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admin" });
  return { title: t("investors_title") };
}

export default async function AdminInvestorsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "admin" });

  const user = await getCurrentUser();
  if (!user) redirect(`/${locale}/auth/signin?next=/${locale}/admin/investors`);

  // Gate check: only admins and CEO can access the investor management dashboard
  if (user.role !== "admin" && user.role !== "ceo") {
    redirect(`/${locale}`);
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("investor_applications")
    .select(
      "id, full_name, title, company, linkedin_url, email, check_size, why_interested, status, created_at",
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[AdminInvestorsPage] Failed to fetch investor applications:", error);
  }

  const applications = (data as unknown as InvestorApplicationItem[]) ?? [];

  return (
    <Container className="py-10">
      <header className="mb-6">
        <h1 className="text-fg-primary inline-flex items-center gap-2 text-2xl font-bold">
          <TrendingUp className="h-6 w-6 text-emerald-400" /> {t("investors_heading")}
        </h1>
        <p className="text-fg-muted mt-1 text-sm">{t("investors_desc")}</p>
      </header>

      <InvestorApplicationsList applications={applications} />
    </Container>
  );
}
