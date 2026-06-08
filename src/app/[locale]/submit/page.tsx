import { setRequestLocale, getTranslations } from "next-intl/server";
import { createServerClient } from "@/lib/supabase/server";
import { Container } from "@/components/ui/layout";
import { Card, CardContent } from "@/components/ui/card";
import { IncidentForm } from "@/components/incidents/incident-form";
import type { AIProvider, AIModel } from "@/types";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  return { title: t("report") };
}

export default async function SubmitPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "incident" });
  const supabase = await createServerClient();
  const [{ data: providersData }, { data: modelsData }] = await Promise.all([
    supabase
      .from("ai_providers")
      .select("id, slug, name, description, logo_url, website_url, is_verified")
      .eq("is_verified", true)
      .order("name"),
    supabase
      .from("ai_models")
      .select("id, provider_id, name, version, status, released_at, created_at")
      .eq("status", "active")
      .order("name"),
  ]);

  const providers = (providersData ?? []) as unknown as AIProvider[];
  const models = (modelsData ?? []) as unknown as AIModel[];

  return (
    <Container size="narrow" className="py-12">
      <header className="mb-8 space-y-2">
        <h1 className="text-fg-primary text-3xl font-bold tracking-tight">
          {t("submit_page_title")}
        </h1>
        <p className="text-fg-muted text-sm">{t("submit_page_subtitle")}</p>
      </header>

      <Card variant="elevated">
        <CardContent>
          <IncidentForm providers={providers} models={models} />
        </CardContent>
      </Card>
    </Container>
  );
}
