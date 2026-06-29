import { setRequestLocale, getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui/layout";
import { getCurrentUser } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { Award } from "lucide-react";
import { ExpertApplicationsList } from "@/components/admin/expert-applications-list";
import type { ExpertApplicationItem } from "@/components/admin/expert-applications-list";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admin" });
  return { title: t("expertApplicationsTitle", { defaultValue: "Expert Applications" }) };
}

export default async function AdminExpertsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "admin" });
  const user = await getCurrentUser();
  if (!user) redirect(`/${locale}/auth/signin?next=/${locale}/admin/experts`);
  if (user.role !== "moderator" && user.role !== "admin" && user.role !== "ceo") {
    redirect(`/${locale}`);
  }

  const admin = createAdminClient();
  const { data } = await admin
    .from("expert_applications" as never)
    .select("id, name, title_institution, expertise, linkedin_url, status, created_at" as never)
    .order("created_at" as never, { ascending: false } as never);

  const applications = (data as unknown as ExpertApplicationItem[]) ?? [];

  return (
    <Container className="py-10">
      <header className="mb-6">
        <h1 className="text-fg-primary inline-flex items-center gap-2 text-2xl font-bold">
          <Award className="text-brand-400 h-6 w-6" />{" "}
          {t("expertApplications", { defaultValue: "Expert Applications" })}
        </h1>
        <p className="text-fg-muted mt-1 text-sm">
          {t("manageExpertApplications", {
            defaultValue: "Review and manage expert panel applications.",
          })}
        </p>
      </header>

      <ExpertApplicationsList applications={applications} />
    </Container>
  );
}
