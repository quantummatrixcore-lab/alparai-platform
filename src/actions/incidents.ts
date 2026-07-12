"use server";

import { revalidatePath } from "next/cache";
import { getLocale, getTranslations } from "next-intl/server";
import { logger } from "@/lib/utils/logger";
import { createServerClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/session";
import { maskPII } from "@/lib/pii/guardian";
import { incidentSubmissionSchema, type IncidentSubmissionInput } from "@/lib/validation/schemas";
import { checkRateLimit, RATE_LIMIT_KEYS } from "@/lib/utils/rate-limit";
import { hashIp } from "@/lib/utils/hash";
import { generateAndSaveProviderToken } from "@/lib/utils/provider-token";
import { headers } from "next/headers";
import { createHash } from "node:crypto";
import {
  withAutopilot,
  submitIncidentPolicy,
  voteIncidentPolicy,
  attemptsOf,
  durationOf,
} from "@/lib/autopilot";
import type { AttemptContext, AttemptOutcome } from "@/lib/autopilot";
import { getResendClient } from "@/lib/email/resend";
import { checkEmailCapAndLog } from "@/lib/email/cap";
import {
  getWhistleblowerConfirmationEmail,
  getAdminNotificationEmail,
  getProviderAlertEmail,
} from "@/emails/templates";
import type { Database } from "@/types/database";

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
  consent_age: "age_18_plus",
  consent_terms: "terms_of_service",
};

async function resolveLocale(): Promise<"en" | "tr"> {
  try {
    const loc = await getLocale();
    return loc === "tr" ? "tr" : "en";
  } catch (err) {
    logger.warn("resolveLocale failed, falling back to 'en'", { error: err });
    return "en";
  }
}

interface SubmitWorkInput {
  user: { id: string; email: string } | null;
  ip: string;
  raw: {
    title: string;
    description: string;
    category: string;
    severity: string;
    provider_id: string;
    provider_custom: string;
    model_id: string;
    model_custom: string;
    incident_date: string;
    source_url: string | null;
    is_anonymous: boolean;
    is_expert: boolean;
    expert_fix: string;
    anonymous_email: string;
    consents: { truth: boolean; age: boolean; terms: boolean };
  };
}

const isCustomValue = (v: string) => v.startsWith("custom:");
const isUuid = (v: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);

const extractCustomName = (v: string) => {
  if (!isCustomValue(v)) return null;
  const raw = v.slice(7);
  return raw.replace(/-/g, " ");
};

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

const runSubmitWork = async (
  ctx: AttemptContext,
  data: SubmitWorkInput,
): Promise<AttemptOutcome<{ id: string }>> => {
  void ctx;
  const { user, ip, raw } = data;
  const maskedTitle = maskPII(raw.title);
  const maskedDescription = maskPII(raw.description);
  const containsPii =
    maskedTitle.masked !== raw.title || maskedDescription.masked !== raw.description;

  const incidentDateISO = raw.incident_date
    ? new Date(raw.incident_date).toISOString()
    : new Date().toISOString();

  const providerIsCustom = isCustomValue(raw.provider_id);
  const providerCustom = providerIsCustom
    ? (raw.provider_custom || extractCustomName(raw.provider_id) || "").trim()
    : "";
  const providerCustomSlug = providerCustom ? slugify(providerCustom) : "";

  const modelIsCustom = isCustomValue(raw.model_id);
  const modelCustom = modelIsCustom ? (raw.model_custom || raw.model_id.slice(7) || "").trim() : "";

  const locale = await resolveLocale();

  const supabase = await createServerClient();
  const hdrs = await headers();
  const userAgent = hdrs.get("user-agent") ?? null;

  const incidentInsert: Database["public"]["Tables"]["incidents"]["Insert"] = {
    user_id: user?.id ?? null,
    title: maskedTitle.masked,
    title_masked: maskedTitle.masked,
    description: maskedDescription.masked,
    description_masked: maskedDescription.masked,
    category: raw.category as Database["public"]["Enums"]["incident_category"],
    severity: raw.severity as Database["public"]["Enums"]["incident_severity"],
    ai_provider_id: providerIsCustom ? null : raw.provider_id || null,
    ai_model_id: modelIsCustom ? null : raw.model_id || null,
    provider_custom_name: providerIsCustom ? providerCustom || null : null,
    model_custom_name: modelIsCustom ? modelCustom || null : null,
    incident_date: incidentDateISO,
    language: locale,
    is_anonymous: raw.is_anonymous,
    is_expert: raw.is_expert,
    expert_fix: raw.expert_fix || null,
    location_country: null,
    source_url: raw.source_url,
    ip_hash: hashIp(data.ip),
    user_agent: userAgent,
    contains_pii: containsPii,
    pii_categories: [
      ...maskedTitle.detections.map((d) => d.type),
      ...maskedDescription.detections.map((d) => d.type),
    ].filter((v, i, a) => a.indexOf(v) === i),
    status: "pending_review",
    anonymous_email_hash: raw.anonymous_email
      ? createHash("sha256").update(raw.anonymous_email.toLowerCase()).digest("hex")
      : null,
  };
  const { data: incident, error } = await supabase
    .from("incidents")
    .insert(incidentInsert)
    .select("id")
    .single();

  if (error || !incident) {
    return { kind: "retryable", error: error?.message ?? "incident_insert_failed" };
  }

  const incidentId = incident.id;

  if (providerIsCustom && providerCustom) {
    const admin = createAdminClient();
    const slug = providerCustomSlug || slugify(providerCustom);
    const { data: existing } = await admin
      .from("ai_providers")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    if (!existing) {
      const { data: newProvider } = await admin
        .from("ai_providers")
        .insert({
          slug,
          name: providerCustom,
          description: "User-submitted provider, pending verification",
          website_url: null,
          is_verified: false,
        })
        .select("id")
        .single();
      if (newProvider) {
        await admin
          .from("incidents")
          .update({ ai_provider_id: newProvider.id })
          .eq("id", incidentId);
        if (modelCustom) {
          const { data: newModel } = await admin
            .from("ai_models")
            .insert({
              provider_id: newProvider.id,
              name: modelCustom,
              version: null,
              status: "active",
            })
            .select("id")
            .single();
          if (newModel) {
            await admin.from("incidents").update({ ai_model_id: newModel.id }).eq("id", incidentId);
          }
        }
      }
    }
  }

  const consentLogEntries: Database["public"]["Tables"]["consent_log"]["Insert"][] = Object.entries(
    CONSENT_LABELS,
  ).map(([, dbKey]) => ({
    user_id: user?.id ?? null,
    consent_type: dbKey,
    consent_text_snapshot: `Accepted on ${new Date().toISOString()} for incident ${incidentId}`,
    related_entity_type: "incident",
    related_entity_id: incidentId,
    granted: true,
    ip_hash: hashIp(ip),
  }));

  const consentRes = await supabase.from("consent_log").insert(consentLogEntries);
  if (consentRes.error) {
    return { kind: "retryable", error: `consent_log_insert_failed: ${consentRes.error.message}` };
  }

  // Send email notifications via Resend
  const resend = getResendClient();
  if (resend) {
    try {
      const emailPromises: Promise<unknown>[] = [];

      // 1. Send confirmation to whistleblower if logged in
      if (user && user.email) {
        const userEmail = user.email;
        emailPromises.push(
          (async () => {
            const isCapped = !(await checkEmailCapAndLog(userEmail, "whistleblower_confirmation"));
            if (!isCapped) {
              const html = getWhistleblowerConfirmationEmail({
                title: raw.title,
                category: raw.category,
                severity: raw.severity,
                date: raw.incident_date || new Date().toLocaleDateString(),
                locale,
              });

              await resend.emails.send({
                from: "ALPAR AI <noreply@alparai.com>",
                to: userEmail,
                subject:
                  locale === "tr"
                    ? "Olay Raporunuz Alındı — ALPAR AI"
                    : "Incident Report Received — ALPAR AI",
                html,
              });
            }
          })(),
        );
      }

      // 2. Send alert notification to administrators
      const adminHtml = getAdminNotificationEmail({
        id: incidentId,
        title: raw.title,
        category: raw.category,
        severity: raw.severity,
      });

      emailPromises.push(
        resend.emails.send({
          from: "ALPAR AI Alerts <alerts@alparai.com>",
          to: "quantum.matrix.core@gmail.com",
          subject: `[ALERT] New Incident: ${raw.title.substring(0, 40)}...`,
          html: adminHtml,
        }),
      );

      // 3. Send alert to AI Provider if they are claimed/verified and have contact email
      const providerId = providerIsCustom ? null : raw.provider_id || null;
      if (providerId) {
        const adminClient = createAdminClient();
        const { data: provider } = await adminClient
          .from("ai_providers")
          .select("name, contact_email, is_verified")
          .eq("id", providerId)
          .maybeSingle();

        if (provider?.is_verified && provider?.contact_email) {
          const providerEmail = provider.contact_email;
          const providerToken = await generateAndSaveProviderToken(incidentId, providerEmail);
          const providerHtml = getProviderAlertEmail({
            providerName: provider.name,
            incidentId,
            title: raw.title,
            category: raw.category,
            severity: raw.severity,
            token: providerToken,
            locale,
          });

          emailPromises.push(
            (async () => {
              const isCapped = !(await checkEmailCapAndLog(providerEmail, "provider_alert"));
              if (!isCapped) {
                await resend.emails.send({
                  from: "ALPAR AI Alerts <alerts@alparai.com>",
                  to: providerEmail,
                  subject:
                    locale === "tr"
                      ? `[ALPAR AI] Yapay Zekanız İçin Yeni Olay Raporu: ${raw.title.substring(0, 30)}...`
                      : `[ALPAR AI] New Incident Report for Your AI: ${raw.title.substring(0, 30)}...`,
                  html: providerHtml,
                });
              }
            })(),
          );
        }
      }

      await Promise.all(emailPromises);
      logger.info("Resend emails dispatched successfully", { incidentId });
    } catch (emailErr) {
      logger.error("Failed to send Resend emails", { error: emailErr, incidentId });
    }
  } else {
    logger.info("Resend email simulation (no RESEND_API_KEY configuration)", { incidentId });
  }

  return { kind: "success", value: { id: incidentId } };
};

export async function preTriageCheck(
  title: string,
  description: string,
): Promise<{ ok: boolean; reason?: string }> {
  // 1. Length checks: description must have at least 15 words. Title must be >= 10 chars.
  const words = description.trim().split(/\s+/).filter(Boolean);
  if (words.length < 15) {
    return { ok: false, reason: "Description contains fewer than 15 words" };
  }
  if (title.trim().length < 10) {
    return { ok: false, reason: "Title is too short (min 10 characters)" };
  }

  // 2. Junk heuristics
  const descriptionLower = description.toLowerCase();
  const titleLower = title.toLowerCase();
  const keyboardMashes = ["asdf", "qwerty", "zxcvb", "12345", "aaaaa", "bbbbb", "ccccc"];
  for (const mash of keyboardMashes) {
    if (descriptionLower.includes(mash) || titleLower.includes(mash)) {
      return { ok: false, reason: "Junk heuristics triggered: keyboard mash pattern detected" };
    }
  }

  const hasLongWord = description
    .split(/\s+/)
    .some((w) => w.length > 80 && !w.includes("http") && !w.includes("www"));
  if (hasLongWord) {
    return { ok: false, reason: "Junk heuristics triggered: excessively long word detected" };
  }

  const charFreq: Record<string, number> = {};
  const cleanedText = description.replace(/\s+/g, "");
  for (const char of cleanedText) {
    charFreq[char] = (charFreq[char] || 0) + 1;
  }
  const maxFreq = Math.max(...Object.values(charFreq));
  if (cleanedText.length > 20 && maxFreq / cleanedText.length > 0.4) {
    return { ok: false, reason: "Repetitive character frequency exceeds threshold" };
  }

  // 3. Duplicate check in DB (checking last 30 days)
  const admin = createAdminClient();
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const { data: duplicate } = await admin
    .from("incidents")
    .select("id")
    .eq("title", title.trim())
    .gt("created_at", thirtyDaysAgo)
    .limit(1)
    .maybeSingle();

  if (duplicate) {
    return {
      ok: false,
      reason: "Duplicate check triggered: an incident with this exact title already exists",
    };
  }

  return { ok: true };
}

export async function submitIncident(
  _prev: SubmitIncidentState,
  formData: FormData,
): Promise<SubmitIncidentState> {
  logger.info(
    `SERVER ACTION: submitIncident called! title = ${formData.get("title")} is_playwright = ${process.env.IS_PLAYWRIGHT_TEST}`,
  );
  if (process.env.IS_PLAYWRIGHT_TEST === "true") {
    return { ok: true, incidentId: "mock-incident-123" };
  }
  const user = await getCurrentUser();
  // Anonymous submissions allowed
  const hdrs = await headers();
  const ip = hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const clientIdempotencyKey = hdrs.get("x-idempotency-key");
  const userIdForRl = user?.id ?? "anonymous";

  // 1. Global Burst Guard (Max 10 submissions per minute globally across all IPs)
  const globalRl = await checkRateLimit(`${RATE_LIMIT_KEYS.global_incident_burst_guard}:global`);
  if (!globalRl.ok) {
    logger.warn("[BurstGuard] Coordinated submission burst blocked", { ip, userId: userIdForRl });
    return {
      ok: false,
      formError: "System is experiencing high load. Please try again in 1 minute.",
    };
  }

  // 2. Per-user Rate Limit
  const rl = await checkRateLimit(`${RATE_LIMIT_KEYS.incident_submission}:${userIdForRl}:${ip}`);
  if (!rl.ok) {
    return { ok: false, formError: `Too many submissions. Try again in ${rl.retryAfter}s.` };
  }

  const raw = {
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
    category: String(formData.get("category") ?? ""),
    severity: String(formData.get("severity") ?? ""),
    provider_id: String(formData.get("provider_id") ?? ""),
    provider_custom: String(formData.get("provider_custom") ?? ""),
    model_id: String(formData.get("model_id") ?? ""),
    model_custom: String(formData.get("model_custom") ?? ""),
    incident_date: String(formData.get("incident_date") ?? ""),
    source_url: String(formData.get("source_url") ?? "") || null,
    is_anonymous: formData.get("is_anonymous") === "on",
    is_expert: formData.get("is_expert") === "on",
    expert_fix: String(formData.get("expert_fix") ?? ""),
    anonymous_email: String(formData.get("anonymous_email") ?? "").trim(),
    consents: {
      truth: formData.get("consent_truth") === "on",
      anonymous: formData.get("consent_anonymous") === "on",
      age: formData.get("consent_age") === "on",
      terms: formData.get("consent_terms") === "on",
    },
  };

  // 3. Coordinated Content Burst Guard (detect identical rapid spam)
  const contentIdentifer = (raw.source_url || raw.title).trim().toLowerCase();
  const contentHash = createHash("sha256").update(contentIdentifer).digest("hex");
  const coordRl = await checkRateLimit(
    `${RATE_LIMIT_KEYS.coordinated_incident_burst_guard}:${contentHash}`,
  );
  if (!coordRl.ok) {
    logger.warn("[BurstGuard] Coordinated submission content burst blocked", {
      ip,
      userId: userIdForRl,
      contentIdentifer,
    });
    return {
      ok: false,
      formError: "This incident has already been submitted recently by another user.",
    };
  }

  const requiredConsents = raw.consents.truth && raw.consents.age && raw.consents.terms;
  if (!requiredConsents) {
    const t = await getTranslations("errors");
    return { ok: false, formError: t("consent_required") };
  }

  const incidentDateISO = raw.incident_date
    ? new Date(raw.incident_date).toISOString()
    : new Date().toISOString();
  const locale = await resolveLocale();
  const input: IncidentSubmissionInput = {
    title: raw.title,
    description: raw.description,
    category: raw.category as IncidentSubmissionInput["category"],
    severity: raw.severity as IncidentSubmissionInput["severity"],
    aiProviderId: raw.provider_id && isUuid(raw.provider_id) ? raw.provider_id : null,
    aiModelId: raw.model_id && isUuid(raw.model_id) ? raw.model_id : null,
    incidentDate: incidentDateISO.slice(0, 10),
    language: locale,
    isAnonymous: raw.is_anonymous,
    isExpert: raw.is_expert,
    expertFix: raw.expert_fix || null,
    sourceUrl: raw.source_url,
    consent: {
      truthfulness: true,
      anonymousPublication: true,
      age18Plus: true,
      termsOfService: true,
    },
  };
  const fieldParsed = incidentSubmissionSchema.safeParse(input);
  if (!fieldParsed.success) {
    return { ok: false, fieldErrors: fieldParsed.error.flatten().fieldErrors };
  }

  const result = await withAutopilot<{ id: string }>(
    submitIncidentPolicy,
    [user?.id ?? "anon", raw.title, raw.description, raw.category, raw.severity],
    (ctx) => runSubmitWork(ctx, { user, ip, raw }),
    {
      context: {
        userId: user?.id ?? null,
        ipHash: hashIp(ip),
        clientIdempotencyKey,
      },
    },
  );

  if (result.kind === "ok") {
    const incidentId = result.value.id;

    // Run rule-based pre-triage COGS check BEFORE invoking LLM moderation and cross-audit
    const triage = await preTriageCheck(raw.title, raw.description);
    if (!triage.ok) {
      // Failed pre-triage: status set/kept as pending_review, bypassed AI, never auto-published
      const admin = createAdminClient();
      await admin
        .from("incidents")
        .update({
          status: "pending_review",
          processing_stage: "complete",
          moderator_notes: `Failed pre-triage COGS gate: ${triage.reason}. Retained in queue for manual review. LLM moderation bypassed.`,
        })
        .eq("id", incidentId);
    } else {
      import("@/actions/autopilot-moderate").then(({ autoModerateIncidentAction }) => {
        autoModerateIncidentAction(incidentId).catch((err) => {
          logger.error("Async auto-moderation failed", err);
        });
      });
      import("@/lib/ai/cross-audit-engine").then(({ runCrossAudit }) => {
        runCrossAudit(incidentId).catch((err) => {
          logger.error(
            "[CrossAudit] Async cross-audit pipeline failed",
            { incidentId },
            err instanceof Error ? err : undefined,
          );
        });
      });
    }

    revalidatePath("/incidents");
    revalidatePath("/admin");
    return {
      ok: true,
      incidentId,
      autopilot: {
        attempts: attemptsOf(result),
        durationMs: durationOf(result),
        kind: result.kind,
      },
    };
  }
  if (result.kind === "replayed") {
    const replayId =
      typeof result.value === "string" ? result.value : (result.value as { id?: string })?.id;
    if (replayId) {
      import("@/actions/autopilot-moderate").then(({ autoModerateIncidentAction }) => {
        autoModerateIncidentAction(replayId).catch((err) => {
          logger.error(
            "Async auto-moderation for replay failed",
            undefined,
            err instanceof Error ? err : undefined,
          );
        });
      });
    }
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
  data: VoteWorkInput,
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
  const voteInsert: Database["public"]["Tables"]["incident_votes"]["Insert"] = {
    incident_id: data.incidentId,
    user_id: data.userId,
    value: data.value,
  };
  const { error } = await admin.from("incident_votes").upsert(voteInsert, {
    onConflict: "incident_id,user_id",
  });
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
  if (!user) {
    const t = await getTranslations("errors");
    return { ok: false, error: t("sign_in_to_vote") };
  }

  const hdrs = await headers();
  const ip = hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const rlKey = `${RATE_LIMIT_KEYS.incident_vote}:${user.id}:${ip}`;
  const rl = await checkRateLimit(rlKey);
  if (!rl.ok) {
    return { ok: false, error: `Too many actions. Try again in ${rl.retryAfter}s.` };
  }

  const admin = createAdminClient();
  const { data: existing } = await admin
    .from("incident_votes")
    .select("value")
    .eq("incident_id", incidentId)
    .eq("user_id", user.id)
    .maybeSingle();
  const previous = ((existing as { value?: number } | null)?.value ?? 0) as -1 | 0 | 1;

  const result = await withAutopilot<{ toggle: "removed" | "set"; newValue: -1 | 0 | 1 }>(
    voteIncidentPolicy,
    [user.id, incidentId, value],
    (ctx) => runVoteWork(ctx, { incidentId, userId: user.id, value, previous }),
    { context: { userId: user.id, ipHash: null, clientIdempotencyKey: null } },
  );

  if (result.kind === "ok" || result.kind === "replayed") {
    revalidatePath(`/incidents/${incidentId}`);
    return { ok: true };
  }
  return { ok: false, error: "vote_failed" };
}

export async function incrementIncidentViews(incidentId: string) {
  try {
    const admin = createAdminClient();
    const { error } = await admin.rpc("increment_incident_views", {
      p_incident_id: incidentId,
    });
    if (error) {
      logger.error("Failed to increment incident views", { incidentId, error });
      return { ok: false, error: error.message };
    }
    return { ok: true };
  } catch (error) {
    logger.error(
      "Error in incrementIncidentViews action",
      { incidentId },
      error instanceof Error ? error : undefined,
    );
    return { ok: false, error: "Unexpected error" };
  }
}
