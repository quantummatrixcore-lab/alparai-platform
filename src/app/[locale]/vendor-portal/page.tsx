import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { createServerClient } from "@/lib/supabase/server";
import {
  VendorDefensePortalClient,
  type VendorPortalIncidentItem,
} from "@/components/vendor-portal/vendor-defense-portal-client";

export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "vendorPortal" });
  return {
    title: t("meta_title"),
    description: t("meta_desc"),
  };
}

export default async function VendorPortalPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const supabase = await createServerClient();

  // Query published incidents from Supabase
  const { data: dbIncidents } = await supabase
    .from("incidents")
    .select(
      "id, title, category, severity, status, provider_custom_name, model_custom_name, description, created_at, vendor_response_text, vendor_response_at",
    )
    .order("created_at", { ascending: false })
    .limit(20);

  const incidents: VendorPortalIncidentItem[] =
    dbIncidents && dbIncidents.length > 0
      ? dbIncidents.map((inc) => ({
          id: inc.id,
          title: inc.title || "AI Model Safety & Alignment Report",
          category: inc.category || "ethics_safety",
          severity: (inc.severity as VendorPortalIncidentItem["severity"]) || "medium",
          status: inc.status || "published",
          providerName: inc.provider_custom_name || "AI Vendor",
          modelName: inc.model_custom_name || "Claude 3.5 Sonnet",
          description: inc.description || "Reported behavior regarding unexpected responses.",
          createdAt: inc.created_at || "2026-08-05T12:00:00.000Z",
          vendorResponseText: inc.vendor_response_text,
          vendorResponseAt: inc.vendor_response_at,
        }))
      : [
          {
            id: "inc-v-001",
            title: "Claude 3.5 Sonnet Rate Limit & System Prompt Leakage",
            category: "ethics_safety",
            severity: "high",
            status: "published",
            providerName: "Anthropic",
            modelName: "Claude 3.5 Sonnet",
            description:
              "User reported unexpected prompt injection revealing system prompt fragments under specific edge-case jailbreak scenarios.",
            createdAt: "2026-08-05T12:00:00.000Z",
            vendorResponseText: null,
            vendorResponseAt: null,
          },
          {
            id: "inc-v-002",
            title: "GPT-4o Factuality Divergence on Legal Statute Summaries",
            category: "hallucination_factuality",
            severity: "medium",
            status: "published",
            providerName: "OpenAI",
            modelName: "GPT-4o",
            description:
              "Reported hallucination in EU AI Act Article 73 citation numbers when requested under low-temperature settings.",
            createdAt: "2026-08-04T10:00:00.000Z",
            vendorResponseText:
              "We have audited the dataset and released a model patch addressing legal citation fidelity.",
            vendorResponseAt: "2026-08-04T18:30:00.000Z",
          },
          {
            id: "inc-v-003",
            title: "Gemini 1.5 Pro Latency Degradation in EU-West Region",
            category: "performance_sla",
            severity: "low",
            status: "published",
            providerName: "Google DeepMind",
            modelName: "Gemini 1.5 Pro",
            description:
              "API response latency spiked above 4500ms for long-context retrieval queries between 14:00 and 16:00 UTC.",
            createdAt: "2026-08-03T15:00:00.000Z",
            vendorResponseText: null,
            vendorResponseAt: null,
          },
        ];

  return <VendorDefensePortalClient initialIncidents={incidents} />;
}
