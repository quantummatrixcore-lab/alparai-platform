export const revalidate = 30;

import { setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth/session";
import { Container } from "@/components/ui/layout";
import { IncidentDetailView } from "@/components/incidents/incident-detail";
import type { IncidentComment } from "@/components/incidents/comment-section";
import { IncidentJsonLd } from "@/components/seo/json-ld";
import { APP_URL } from "@/lib/constants";
import type { IncidentDetail, ProviderResponse, EvidenceItem } from "@/types";
import { RelatedIncidents } from "@/components/incidents/related-incidents";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { id, locale } = await params;
  const supabase = await createServerClient();
  const { data } = await supabase
    .from("incidents")
    .select("title_masked, title_tr")
    .eq("id", id)
    .maybeSingle();
  const row = data as Record<string, unknown> | null;
  const title =
    locale === "tr" && row?.title_tr ? (row.title_tr as string) : (row?.title_masked as string);
  return {
    title: title ?? "Incident",
  };
}

export default async function IncidentDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const tCommon = await getTranslations({ locale, namespace: "common" });
  const supabase = await createServerClient();

  const { data: incidentRow } = await supabase
    .from("incidents")
    .select("*")
    .eq("id", id)
    .eq("status", "published")
    .maybeSingle();
  if (!incidentRow) notFound();

  const [providerRes, modelRes, evidenceRes, responseRes, user, commentsRes] = await Promise.all([
    supabase
      .from("ai_providers")
      .select("name, slug")
      .eq("id", (incidentRow as Record<string, unknown>)["ai_provider_id"] as string)
      .maybeSingle(),
    supabase
      .from("ai_models")
      .select("name, version")
      .eq("id", (incidentRow as Record<string, unknown>)["ai_model_id"] as string)
      .maybeSingle(),
    supabase.from("evidence").select("id, file_name, file_path, mime_type").eq("incident_id", id),
    supabase
      .from("ai_provider_responses")
      .select("id, response_text, is_official, is_published, created_at, ai_provider_id")
      .eq("incident_id", id)
      .eq("is_published", true)
      .maybeSingle(),
    getCurrentUser(),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase as any)
      .from("incident_comments")
      .select(
        "id, comment_text, created_at, user_id, users(id, full_name, username, avatar_url, role)",
      )
      .eq("incident_id", id)
      .order("created_at", { ascending: true }),
  ]);

  const providerData = providerRes.data as { name: string; slug: string } | null;
  const modelData = modelRes.data as { name: string; version: string | null } | null;
  const responseRow = responseRes.data as {
    id: string;
    response_text: string;
    is_official: boolean;
    created_at: string;
    ai_provider_id: string;
  } | null;
  let providerResponse: ProviderResponse | null = null;
  if (responseRow && providerData) {
    providerResponse = {
      id: responseRow.id,
      response: responseRow.response_text,
      verified: responseRow.is_official,
      created_at: responseRow.created_at,
      provider_name: providerData.name,
    };
  }

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://azszpzyvxjduhemkjsdh.supabase.co";
  const evidence: EvidenceItem[] = ((evidenceRes.data as Array<Record<string, unknown>>) ?? []).map(
    (e) => {
      const pathStr = e["file_path"] as string;
      const fileUrl = pathStr.startsWith("http")
        ? pathStr
        : `${supabaseUrl}/storage/v1/object/public/evidence/${pathStr}`;
      return {
        id: e["id"] as string,
        file_name: e["file_name"] as string,
        file_url: fileUrl,
        file_type: (e["mime_type"] as string) ?? "application/octet-stream",
      };
    },
  );

  const r = incidentRow as Record<string, unknown>;
  const incident: IncidentDetail = {
    id: r["id"] as string,
    title_masked: (r["title_masked"] as string) ?? (r["title"] as string) ?? "",
    description_masked: (r["description_masked"] as string) ?? (r["description"] as string) ?? "",
    title_tr: (r["title_tr"] as string | null) ?? null,
    description_tr: (r["description_tr"] as string | null) ?? null,
    severity: r["severity"] as IncidentDetail["severity"],
    status: r["status"] as IncidentDetail["status"],
    category: r["category"] as IncidentDetail["category"],
    is_anonymous: (r["is_anonymous"] as boolean) ?? false,
    incident_date: (r["incident_date"] as string) ?? (r["created_at"] as string),
    created_at: (r["created_at"] as string) ?? "",
    view_count: (r["views_count"] as number) ?? 0,
    upvotes: (r["upvotes_count"] as number) ?? 0,
    downvotes: 0,
    affected_count: (r["affected_users_count"] as number) ?? 0,
    author_name: null,
    provider_name: providerData?.name ?? tCommon("unknown"),
    provider_slug: providerData?.slug ?? "",
    model_name: modelData?.name ?? null,
    language: (r["language"] as string) ?? "en",
    cross_audit_truth_score: (r["cross_audit_truth_score"] as number | null) ?? null,
    cross_audit_confidence: (r["cross_audit_confidence"] as number | null) ?? null,
    cross_audit_reasoning: (r["cross_audit_reasoning"] as string | null) ?? null,
    cross_audit_model: (r["cross_audit_model"] as string | null) ?? null,
    incident_source: (r["incident_source"] as string | null) ?? undefined,
    import_external_id: (r["import_external_id"] as string | null) ?? null,
    import_attribution: (r["import_attribution"] as string | null) ?? null,
  };

  let userVote: -1 | 0 | 1 = 0;
  if (user) {
    const { data: vote } = await supabase
      .from("incident_votes")
      .select("value")
      .eq("incident_id", id)
      .eq("user_id", user.id)
      .maybeSingle();
    if (vote) userVote = (vote as { value: -1 | 0 | 1 }).value;
  }

  let userAffected = false;
  if (user) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: affected } = await (supabase as any)
      .from("incident_affected_users")
      .select("incident_id")
      .eq("incident_id", id)
      .eq("user_id", user.id)
      .maybeSingle();
    if (affected) userAffected = true;
  }

  const comments = (commentsRes.data ?? []) as unknown as IncidentComment[];

  return (
    <Container className="py-10">
      <IncidentJsonLd
        title={incident.title_masked}
        description={incident.description_masked}
        dateOccurred={incident.incident_date}
        url={`${APP_URL}/${locale}/incidents/${id}`}
        severity={incident.severity}
        provider={incident.provider_name}
      />
      <IncidentDetailView
        incident={incident}
        evidence={evidence}
        providerResponse={providerResponse}
        userVote={userVote}
        isAuthenticated={!!user}
        comments={comments}
        userAffected={userAffected}
        currentUserId={user?.id ?? null}
      />
      <RelatedIncidents
        providerId={(incidentRow as Record<string, unknown>)["ai_provider_id"] as string}
        currentIncidentId={id}
        locale={locale}
      />
    </Container>
  );
}
