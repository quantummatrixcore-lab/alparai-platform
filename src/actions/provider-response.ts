"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyProviderToken } from "@/lib/utils/hash";
import { checkRateLimit, RATE_LIMIT_KEYS } from "@/lib/utils/rate-limit";
import { headers } from "next/headers";

const responseInputSchema = z.object({
  incidentId: z.string().uuid(),
  token: z.string().length(64),
  responseText: z.string().min(10).max(10000),
  responderName: z.string().min(2).max(100),
  responderRole: z.string().max(100).nullable().optional(),
});

export interface ProviderResponseResult {
  ok: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

export async function submitProviderResponse(
  prevState: unknown,
  formData: FormData,
): Promise<ProviderResponseResult> {
  try {
    const hdrs = await headers();
    const ip = hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

    const raw = {
      incidentId: String(formData.get("incidentId") ?? ""),
      token: String(formData.get("token") ?? ""),
      responseText: String(formData.get("responseText") ?? ""),
      responderName: String(formData.get("responderName") ?? ""),
      responderRole: formData.get("responderRole") ? String(formData.get("responderRole")) : null,
    };

    const parsed = responseInputSchema.safeParse(raw);
    if (!parsed.success) {
      return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors };
    }

    const { incidentId, token, responseText, responderName, responderRole } = parsed.data;

    // Rate limit check
    const rl = await checkRateLimit(`${RATE_LIMIT_KEYS.provider_response}:${ip}`);
    if (!rl.ok) {
      return { ok: false, error: `Too many submissions. Try again in ${rl.retryAfter}s.` };
    }

    const admin = createAdminClient();

    // 1. Fetch incident
    const { data: incident, error: incidentErr } = await admin
      .from("incidents")
      .select("id, ai_provider_id, status")
      .eq("id", incidentId)
      .maybeSingle();

    if (incidentErr || !incident) {
      return { ok: false, error: "incident_not_found" };
    }

    const providerId = (incident as { ai_provider_id: string | null }).ai_provider_id;
    if (!providerId) {
      return { ok: false, error: "provider_not_associated" };
    }

    // 2. Fetch provider
    const { data: provider, error: providerErr } = await admin
      .from("ai_providers")
      .select("id, contact_email")
      .eq("id", providerId)
      .maybeSingle();

    if (providerErr || !provider) {
      return { ok: false, error: "provider_not_found" };
    }

    const contactEmail = (provider as { contact_email: string | null }).contact_email;
    if (!contactEmail) {
      return { ok: false, error: "provider_no_contact_email" };
    }

    // 3. Verify token
    if (!verifyProviderToken(incidentId, contactEmail, token)) {
      return { ok: false, error: "invalid_token" };
    }

    // 4. Save response (upsert style)
    const { data: existingResponse } = await admin
      .from("ai_provider_responses")
      .select("id")
      .eq("incident_id", incidentId)
      .maybeSingle();

    if (existingResponse) {
      const { error: updateErr } = await admin
        .from("ai_provider_responses")
        .update({
          response_text: responseText,
          responder_name: responderName,
          responder_role: responderRole || null,
          responder_email: contactEmail,
          is_official: true,
          is_published: true,
          published_at: new Date().toISOString(),
        })
        .eq("id", existingResponse.id);

      if (updateErr) {
        return { ok: false, error: updateErr.message };
      }
    } else {
      const { error: insertErr } = await admin.from("ai_provider_responses").insert({
        incident_id: incidentId,
        ai_provider_id: provider.id,
        response_text: responseText,
        responder_name: responderName,
        responder_role: responderRole || null,
        responder_email: contactEmail,
        is_official: true,
        is_published: true,
        published_at: new Date().toISOString(),
      });

      if (insertErr) {
        return { ok: false, error: insertErr.message };
      }
    }

    revalidatePath(`/incidents/${incidentId}`);
    return { ok: true };
  } catch (e) {
    console.error("[submitProviderResponse] Unhandled exception:", e);
    return { ok: false, error: "An unexpected error occurred. Please try again." };
  }
}
