import { setRequestLocale, getTranslations } from "next-intl/server";
import { createServerClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth/session";
import { Container } from "@/components/ui/layout";
import { Card, CardContent } from "@/components/ui/card";
import { IncidentForm } from "@/components/incidents/incident-form";
import { GoogleSignInButton, EmailMagicLinkForm } from "@/components/auth/auth-buttons";
import { Info } from "lucide-react";
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

      {!user && (
        <Card variant="default" className="border-brand-500/30 bg-brand-500/5 mb-6">
          <CardContent className="flex items-start gap-3 py-4">
            <Info className="text-brand-400 mt-0.5 h-4 w-4 shrink-0" />
            <div className="space-y-2">
              <p className="text-fg-primary text-sm font-medium">
                Fill out the form now — sign in when you&apos;re ready to submit
              </p>
              <p className="text-fg-muted text-xs">
                You can prepare your report without an account. When you click submit, you&apos;ll
                be asked to sign in. This keeps the community accountable.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <GoogleSignInButton next={`/${locale}/submit`} />
                <EmailMagicLinkForm />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card variant="elevated">
        <CardContent>
          <IncidentForm providers={providers} models={models} isLoggedIn={!!user} />
        </CardContent>
      </Card>
    </Container>
  );
}
