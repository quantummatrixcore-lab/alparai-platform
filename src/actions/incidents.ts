"use server";

import { revalidatePath } from "next/cache";
import { createServerClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/session";
import { maskPII } from "@/lib/pii/guardian";
import {
  incidentSubmissionSchema,
  type IncidentSubmissionInput,
} from "@/lib/validation/schemas";
import { checkRateLimit, RATE_LIMIT_KEYS } from "@/lib/utils/rate-limit";
import { headers } from "next/headers";
import { withAutopilot, submitIncidentPolicy, voteIncidentPolicy, attemptsOf, durationOf } from "@/lib/autopilot";
import { createHash } from "node:crypto";
import type { AttemptContext, AttemptOutcome } from "@/lib/autopilot";

export interface SubmitIncidentState {
  ok: boolean;
  error?: string;
  formError?: string;
  fieldErrors?: Record<string, string[]>;
  incidentId?: string;
  autopilot?: {
    attempts: number;
    durationMs: number;
    kind: string;
  };
}

const CONSENT_LABELS: Record<string, string> = {
  consent_truth: "submission_truthfulness",
  consent_anonymous: "anonymous_publication",
  consent_age: "age_18_plus",
  consent_terms: "terms_of_service",
};

const hashIp = (ip: string, salt: string): string =>
  createHash("sha256")
    .update(`${salt}:${ip}`)
    .digest("hex");

interface SubmitWorkInput {
  user: { id: string; email: string };
  ip: string;
  raw: {
    title: string;
    description: string;
    category: string;
    severity: string;
    provider_id: string;
    model_id: string;
    incident_date: string;
    is_anonymous: boolean;
    consents: { truth: boolean; anonymous: boolean; age: boolean; terms: boolean };
  };
}

const runSubmitWork = async (
  ctx: AttemptContext,
  data: SubmitWorkInput
): Promise<AttemptOutcome<{ id: string }>> => {
  void ctx;
  const { user, ip, raw } = data;
  const maskedTitle = maskPII(raw.title);
  const maskedDescription = maskPII(raw.description);
  const containsPii = maskedTitle.masked !== raw.title || maskedDescription.masked !== raw.description;

  const incidentDateISO = raw.incident_date
    ? new Date(raw.incident_date).toISOString()
    : new Date().toISOString();

  const input: IncidentSubmissionInput = {
    title: raw.title,
    description: raw.description,
    category: raw.category as IncidentSubmissionInput["category"],
    severity: raw.severity as IncidentSubmissionInput["severity"],
    aiProviderId: raw.provider_id || null,
    aiModelId: raw.model_id || null,
    incidentDate: incidentDateISO.slice(0, 10),
    language: "en",
    isAnonymous: raw.is_anonymous,
    sourceUrl: null,
    consent: {
      truthfulness: true,
      anonymousPublication: true,
      age18Plus: true,
      termsOfService: true,
    },
  };

  const parsed = incidentSubmissionSchema.safeParse(input);
  if (!parsed.success) {
    return { kind: "fatal", error: "validation_failed" };
  }

  const supabase = await createServerClient();
  const { data: incident, error } = await supabase
    .from("incidents")
    .insert({
      user_id: user.id,
      title: raw.title,
      title_masked: maskedTitle.masked,
      description: raw.description,
      description_masked: maskedDescription.masked,
      category: parsed.data.category,
      severity: parsed.data.severity,
      ai_provider_id: parsed.data.aiProviderId,
      ai_model_id: parsed.data.aiModelId,
      incident_date: incidentDateISO,
      language: "en",
      is_anonymous: raw.is_anonymous,
      status: "pending_review",
      contains_pii: containsPii,
      pii_categories: [
        ...maskedTitle.detections.map((d) => d.type),
        ...maskedDescription.detections.map((d) => d.type),
      ].filter((v, i, a) => a.indexOf(v) === i),
    } as never)
    .select("id")
    .single();

  if (error || !incident) {
    return { kind: "retryable", error: error?.message ?? "incident_insert_failed" };
  }

  const incidentId = (incident as Record<string, unknown>).id as string;

  const consentLogEntries = Object.entries(CONSENT_LABELS).map(([, dbKey]) => ({
    user_id: user.id,
    consent_type: dbKey,
    consent_text_snapshot: `Accepted on ${new Date().toISOString()} for incident ${incidentId}`,
    incident_id: incidentId,
    ip_hash: hashIp(ip, process.env.IP_SALT ?? "alpar-default-salt"),
  }));

  const consentRes = await supabase.from("consent_log").insert(consentLogEntries as never);
  if (consentRes.error) {
    return { kind: "retryable", error: `consent_log_insert_failed: ${consentRes.error.message}` };
  }

  return { kind: "success", value: { id: incidentId } };
};

export async function submitIncident(
  _prev: SubmitIncidentState,
  formData: FormData
): Promise<SubmitIncidentState> {
  const user = await getCurrentUser();
  if (!user) {
    return { ok: false, formError: "You must be signed in to submit an incident." };
  }
  const hdrs = await headers();
  const ip = hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const clientIdempotencyKey = hdrs.get("x-idempotency-key");
  const rl = await checkRateLimit(`${RATE_LIMIT_KEYS.incident_submission}:${user.id}:${ip}`);
  if (!rl.ok) {
    return { ok: false, formError: `Too many submissions. Try again in ${rl.retryAfter}s.` };
  }

  const raw = {
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
    category: String(formData.get("category") ?? ""),
    severity: String(formData.get("severity") ?? ""),
    provider_id: String(formData.get("provider_id") ?? ""),
    model_id: String(formData.get("model_id") ?? ""),
    incident_date: String(formData.get("incident_date") ?? ""),
    is_anonymous: formData.get("is_anonymous") === "on",
    consents: {
      truth: formData.get("consent_truth") === "on",
      anonymous: formData.get("consent_anonymous") === "on",
      age: formData.get("consent_age") === "on",
      terms: formData.get("consent_terms") === "on",
    },
  };

  const requiredConsents =
    raw.consents.truth && raw.consents.anonymous && raw.consents.age && raw.consents.terms;
  if (!requiredConsents) {
    return { ok: false, formError: "You must accept all required consents." };
  }

  const result = await withAutopilot<{ id: string }>(
    submitIncidentPolicy,
    [user.id, raw.title, raw.description, raw.category, raw.severity],
    (ctx) => runSubmitWork(ctx, { user, ip, raw }),
    {
      context: {
        userId: user.id,
        ipHash: hashIp(ip, process.env.IP_SALT ?? "alpar-default-salt"),
        clientIdempotencyKey,
      },
    }
  );

  if (result.kind === "ok") {
    revalidatePath("/incidents");
    revalidatePath("/admin");
    return {
      ok: true,
      incidentId: result.value.id,
      autopilot: { attempts: attemptsOf(result), durationMs: durationOf(result), kind: result.kind },
    };
  }
  if (result.kind === "replayed") {
    const replayId = typeof result.value === "string" ? result.value : undefined;
    return {
      ok: true,
      incidentId: replayId,
      autopilot: { attempts: attemptsOf(result), durationMs: 0, kind: result.kind },
    };
  }
  if (result.kind === "circuit_open") {
    return {
      ok: false,
      formError: "Service temporarily unavailable. Please retry shortly.",
    };
  }
  if (result.kind === "budget_exceeded") {
    return {
      ok: false,
      formError: "Submission timed out. Your request was logged — please retry.",
    };
  }
  if (result.kind === "exhausted") {
    if (result.error === "validation_failed") {
      return { ok: false, formError: "Validation failed. Please check your input." };
    }
    return { ok: false, formError: "Failed to submit. Please try again." };
  }
  return { ok: false, formError: "Unexpected error." };
}

interface VoteWorkInput {
  incidentId: string;
  userId: string;
  value: -1 | 0 | 1;
  previous: -1 | 0 | 1;
}

const runVoteWork = async (
  _ctx: AttemptContext,
  data: VoteWorkInput
): Promise<AttemptOutcome<{ toggle: "removed" | "set"; newValue: -1 | 0 | 1 }>> => {
  const admin = createAdminClient();
  if (data.value === 0 || data.previous === data.value) {
    const { error } = await admin
      .from("incident_votes")
      .delete()
      .eq("incident_id", data.incidentId)
      .eq("user_id", data.userId);
    if (error) {
      return { kind: "retryable", error: error.message };
    }
    return { kind: "success", value: { toggle: "removed", newValue: 0 } };
  }
  const { error } = await admin.from("incident_votes").upsert(
    {
      incident_id: data.incidentId,
      user_id: data.userId,
      value: data.value,
    } as never,
    { onConflict: "incident_id,user_id" }
  );
  if (error) {
    return { kind: "retryable", error: error.message };
  }
  return { kind: "success", value: { toggle: "set", newValue: data.value } };
};

export async function voteOnIncident({
  incidentId,
  value,
}: {
  incidentId: string;
  value: 1 | -1 | 0;
}) {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Sign in to vote" };
  const admin = createAdminClient();
  const { data: existing } = await admin
    .from("incident_votes")
    .select("value")
    .eq("incident_id", incidentId)
    .eq("user_id", user.id)
    .maybeSingle();
  const previous = ((existing as Record<string, unknown> | null)?.value ?? 0) as -1 | 0 | 1;

  const result = await withAutopilot<{ toggle: "removed" | "set"; newValue: -1 | 0 | 1 }>(
    voteIncidentPolicy,
    [user.id, incidentId, value],
    (ctx) => runVoteWork(ctx, { incidentId, userId: user.id, value, previous }),
    { context: { userId: user.id, ipHash: null, clientIdempotencyKey: null } }
  );

  if (result.kind === "ok" || result.kind === "replayed") {
    revalidatePath(`/incidents/${incidentId}`);
    return { ok: true };
  }
  return { ok: false, error: "vote_failed" };
}
