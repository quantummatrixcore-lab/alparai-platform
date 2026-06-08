import { setRequestLocale, getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui/layout";
import { Card, CardContent } from "@/components/ui/card";
import { ModerationQueue } from "@/components/admin/moderation-queue";
import { getCurrentUser } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import type { IncidentListItem } from "@/types";
import { toIncidentListItems } from "@/lib/mappers";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admin" });
  return { title: t("moderation_queue") };
}

export default async function ModerationPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "admin" });
  const user = await getCurrentUser();
  if (!user) redirect(`/${locale}/auth/signin?next=/${locale}/admin/moderation`);
  if (user.role !== "moderator" && user.role !== "admin") {
    redirect(`/${locale}`);
  }

  const admin = createAdminClient();
  const { data } = await admin
    .from("incidents")
    .select(
      "id, title_masked, description_masked, severity, status, category, is_anonymous, incident_date, views_count, created_at, ai_provider_id, user_id"
    )
    .eq("status", "pending_review")
    .order("created_at", { ascending: false })
    .limit(50);

  const items: IncidentListItem[] = toIncidentListItems(data);

  return (
    <Container className="py-10">
      <header className="mb-6">
        <h1 className="text-fg-primary text-2xl font-bold">{t("moderation_queue")}</h1>
        <p className="text-fg-muted mt-1 text-sm">
          {items.length} {t("pending_review")}.
        </p>
      </header>
      <Card>
        <CardContent className="pt-6">
          <ModerationQueue incidents={items} />
        </CardContent>
      </Card>
    </Container>
  );
}
