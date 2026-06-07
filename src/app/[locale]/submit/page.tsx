import { setRequestLocale, getTranslations } from "next-intl/server";
import { createServerClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth/session";
import { Container } from "@/components/ui/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IncidentForm } from "@/components/incidents/incident-form";
import { GoogleSignInButton, EmailMagicLinkForm } from "@/components/auth/auth-buttons";
import { Shield } from "lucide-react";
import type { AIProvider, AIModel } from "@/types";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  return { title: t("report") };
}

export default async function SubmitPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const user = await getCurrentUser();
  if (!user) {
    return (
      <Container size="narrow" className="py-12">
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="inline-flex items-center gap-2">
              <Shield className="text-brand-400 h-5 w-5" />
              Sign in to report
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-fg-muted text-sm">
              You need an account to submit an incident. This helps us keep the community
              accountable and lets AI providers respond.
            </p>
            <GoogleSignInButton next={`/${locale}/submit`} className="w-full" />
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="border-border-subtle w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-bg-elevated text-fg-muted px-2">or</span>
              </div>
            </div>
            <EmailMagicLinkForm />
          </CardContent>
        </Card>
      </Container>
    );
  }

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
        <h1 className="text-fg-primary text-3xl font-bold tracking-tight">Report an incident</h1>
        <p className="text-fg-muted text-sm">
          Share what happened. PII is masked automatically. A moderator reviews every submission
          before publication.
        </p>
      </header>
      <Card variant="elevated">
        <CardContent>
          <IncidentForm providers={providers} models={models} />
        </CardContent>
      </Card>
    </Container>
  );
}
