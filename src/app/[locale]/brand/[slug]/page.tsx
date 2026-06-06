import { setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { Container } from "@/components/ui/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IncidentList } from "@/components/incidents/incident-list";
import { Building2, Globe, Mail, ExternalLink } from "lucide-react";
import type { IncidentListItem } from "@/types";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { slug } = await params;
  return { title: `Brand: ${slug}` };
}

export default async function BrandPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const supabase = await createServerClient();

  const { data: provider } = await supabase
    .from("ai_providers")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (!provider) notFound();

  const [incidentsRes, modelsRes] = await Promise.all([
    supabase
      .from("incidents")
      .select("id, title_masked, description_masked, severity, status, category, is_anonymous, incident_date, views_count, created_at, ai_provider_id, user_id")
      .eq("status", "published")
      .eq("ai_provider_id", (provider as { id: string }).id)
      .order("published_at", { ascending: false })
      .limit(50),
    supabase
      .from("ai_models")
      .select("id, name, version, status, released_at")
      .eq("provider_id", (provider as { id: string }).id)
      .order("name"),
  ]);

  const providerRow = provider as Record<string, unknown>;
  const providerName = providerRow["name"] as string;
  const providerSlug = providerRow["slug"] as string;
  const providerDescription = providerRow["description"] as string | null;
  const providerWebsite = providerRow["website_url"] as string | null;
  const providerContact = providerRow["contact_email"] as string | null;
  const providerLogo = providerRow["logo_url"] as string | null;
  const isVerified = (providerRow["is_verified"] as boolean) ?? false;

  const incidents: IncidentListItem[] = ((incidentsRes.data as Array<Record<string, unknown>>) ?? []).map(
    (r) => ({
      id: r["id"] as string,
      title_masked: (r["title_masked"] as string) ?? "",
      description_masked: (r["description_masked"] as string) ?? "",
      severity: r["severity"] as IncidentListItem["severity"],
      status: r["status"] as IncidentListItem["status"],
      category: r["category"] as IncidentListItem["category"],
      is_anonymous: (r["is_anonymous"] as boolean) ?? false,
      incident_date: (r["incident_date"] as string) ?? (r["created_at"] as string),
      created_at: (r["created_at"] as string) ?? "",
      view_count: (r["views_count"] as number) ?? 0,
      vote_count: 0,
      evidence_count: 0,
      author_name: null,
      provider_name: providerName,
      provider_slug: providerSlug,
    })
  );

  return (
    <Container className="py-10">
      <Card variant="gradient" className="mb-8">
        <CardHeader>
          <div className="flex items-start gap-4">
            {providerLogo ? (
              <img
                src={providerLogo}
                alt={`${providerName} logo`}
                className="h-16 w-16 rounded-md border border-border-subtle bg-bg-tertiary object-contain"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-md border border-border-subtle bg-bg-tertiary">
                <Building2 className="h-8 w-8 text-fg-muted" />
              </div>
            )}
            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold text-fg-primary">{providerName}</h1>
                {isVerified && <Badge variant="success" dot>Verified</Badge>}
              </div>
              {providerDescription && (
                <p className="text-sm text-fg-secondary">{providerDescription}</p>
              )}
              <div className="flex flex-wrap items-center gap-3 text-xs text-fg-muted">
                {providerWebsite && (
                  <a
                    href={providerWebsite}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-1 hover:text-brand-400"
                  >
                    <Globe className="h-3 w-3" />
                    Website
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
                {providerContact && (
                  <a
                    href={`mailto:${providerContact}`}
                    className="inline-flex items-center gap-1 hover:text-brand-400"
                  >
                    <Mail className="h-3 w-3" />
                    {providerContact}
                  </a>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        {modelsRes.data && modelsRes.data.length > 0 && (
          <CardContent>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-fg-muted">
              Models
            </p>
            <div className="flex flex-wrap gap-2">
              {(modelsRes.data as Array<{ id: string; name: string; version: string | null }>).map(
                (m) => (
                  <Badge key={m.id} variant="outline">
                    {m.name} {m.version && `· ${m.version}`}
                  </Badge>
                )
              )}
            </div>
          </CardContent>
        )}
      </Card>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-fg-primary">
          Incidents reported ({incidents.length})
        </h2>
        <IncidentList incidents={incidents} />
      </div>
    </Container>
  );
}
