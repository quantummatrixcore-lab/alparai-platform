"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/types/database";
import { requireModerator } from "@/lib/auth/session";
import {
  withAutopilot,
  moderateIncidentPolicy,
  reviewTakedownPolicy,
  attemptsOf,
  durationOf,
} from "@/lib/autopilot";
import type { AttemptContext, AttemptOutcome } from "@/lib/autopilot";
import { requireAdmin } from "@/lib/auth/session";
import { getResendClient } from "@/lib/email/resend";
import { generateProviderToken } from "@/lib/utils/hash";
import { logger } from "@/lib/utils/logger";
import { getExpertVerificationEmail } from "@/emails/templates";
import { generateEmailUnsubscribeToken } from "@/lib/utils/unsubscribe";
import { checkRateLimit } from "@/lib/utils/rate-limit";
import { parseIncidentCSV } from "@/lib/import/csv-parser";
import { importIncidents } from "@/lib/import/incident-importer";
import type { IncidentSource } from "@/lib/import/csv-parser";

export interface ModerationResult {
  ok: boolean;
  error?: string;
  autopilot?: { attempts: number; durationMs: number; kind: string };
}

const moderateSchema = z.object({
  incidentId: z.string().min(1),
  decision: z.enum(["approve", "reject"]),
  moderationNote: z.string().max(2000).optional(),
});

interface ModerationWorkInput {
  moderatorId: string;
  incidentId: string;
  decision: "approve" | "reject";
  moderationNote: string | null;
}

const runModerationWork = async (
  _ctx: AttemptContext,
  data: ModerationWorkInput,
): Promise<AttemptOutcome<{ id: string; newStatus: string }>> => {
  const admin = createAdminClient();
  const newStatus: "published" | "rejected" =
    data.decision === "approve" ? "published" : "rejected";
  const { error } = await admin
    .from("incidents")
    .update({
      status: newStatus,
      moderator_id: data.moderatorId,
      moderated_at: new Date().toISOString(),
      moderation_note: data.moderationNote,
      published_at: newStatus === "published" ? new Date().toISOString() : null,
    } as Database["public"]["Tables"]["incidents"]["Update"])
    .eq("id", data.incidentId);
  if (error) {
    return { kind: "retryable", error: error.message };
  }

  if (newStatus === "published") {
    try {
      const { data: incident } = await admin
        .from("incidents")
        .select("id, title, title_masked, ai_provider_id, is_expert, user_id")
        .eq("id", data.incidentId)
        .maybeSingle();

      if (incident && incident.user_id) {
        const userId = incident.user_id;
        const { data: existingBadges } = await admin
          .from("user_badges")
          .select("id")
          .eq("user_id", userId)
          .eq("badge_name", "Founding Reporter")
          .maybeSingle();

        if (!existingBadges) {
          await admin.from("user_badges").insert({
            user_id: userId,
            badge_name: "Founding Reporter",
            badge_icon: "🏅",
            description: "Awarded for submitting an early verified incident.",
          });

          const { data: userRecord } = await admin
            .from("users")
            .select("badges")
            .eq("id", userId)
            .maybeSingle();

          if (userRecord) {
            const currentBadges: string[] = userRecord.badges ?? [];
            if (!currentBadges.includes("Founding Reporter")) {
              currentBadges.push("Founding Reporter");
              await admin.from("users").update({ badges: currentBadges }).eq("id", userId);
            }
          }
        }
      }

      if (incident && incident.ai_provider_id) {
        const { data: provider } = await admin
          .from("ai_providers")
          .select("name, contact_email")
          .eq("id", incident.ai_provider_id)
          .maybeSingle();

        if (provider && provider.contact_email) {
          const token = generateProviderToken(incident.id, provider.contact_email);
          const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://alparai.com";
          const respondLink = `${appUrl}/en/incidents/${incident.id}/respond?token=${token}`;

          const resend = getResendClient();
          if (resend) {
            await resend.emails.send({
              from: "ALPAR AI <noreply@alparai.com>",
              to: provider.contact_email,
              subject: `[ALPAR AI] Verification Request: Incident involving ${provider.name}`,
              text: `Hello ${provider.name} Team,

A new incident involving your AI system has been documented and verified by the ALPAR AI community:

"${incident.title_masked || incident.title}"

Under the "Providers must respond" policy, you are invited to submit an official statement or counter-statement. Your response will be pinned to the top of the incident page and visible to all users.

To submit your official response, please use the secure link below:
${respondLink}

Note: This link is unique and secure. Do not share it.

Thank you,
ALPAR AI Accountability Team
https://alparai.com`,
            });
            logger.info("Sent provider notification email via Resend", {
              incidentId: incident.id,
              providerEmail: provider.contact_email,
            });
          } else {
            logger.info("Provider email notification simulated (no RESEND_API_KEY)", {
              incidentId: incident.id,
              providerName: provider.name,
              providerEmail: provider.contact_email,
              respondLink,
            });
          }
        }
      }

      // 2. If it's an expert incident, send confirmation to original reporter
      if (incident && incident.is_expert && incident.user_id) {
        try {
          const { data: reporterUser } = await admin
            .from("users")
            .select("email, locale, full_name")
            .eq("id", incident.user_id)
            .maybeSingle();

          if (reporterUser && reporterUser.email) {
            const { data: prefs } = await admin
              .from("email_preferences")
              .select("reporter_notifications")
              .eq("user_id", incident.user_id)
              .maybeSingle();

            const notificationsEnabled = prefs ? prefs.reporter_notifications : true;

            if (notificationsEnabled) {
              const rlCheck = await checkRateLimit(
                `ratelimit:email_notification:${incident.user_id}`,
              );
              if (rlCheck.ok) {
                const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://alparai.com";
                const unsubToken = generateEmailUnsubscribeToken(reporterUser.email);
                const unsubscribeUrl = `${appUrl}/api/unsubscribe?email=${encodeURIComponent(reporterUser.email)}&token=${unsubToken}`;
                const emailHtml = getExpertVerificationEmail({
                  title: incident.title_masked || incident.title || "Incident",
                  expertName: reporterUser.full_name || "ALPAR AI Expert",
                  actionUrl: `${appUrl}/${reporterUser.locale || "en"}/incidents/${incident.id}`,
                  locale: reporterUser.locale || "en",
                  unsubscribeUrl,
                });

                const resend = getResendClient();
                if (resend) {
                  await resend.emails.send({
                    from: "ALPAR AI <noreply@alparai.com>",
                    to: reporterUser.email,
                    subject:
                      reporterUser.locale === "tr"
                        ? "[ALPAR AI] Uzman Doğrulaması Başarılı"
                        : "[ALPAR AI] Expert Verification Successful",
                    html: emailHtml,
                  });
                  logger.info("Sent expert verification email to reporter via Resend", {
                    incidentId: incident.id,
                    reporterEmail: reporterUser.email,
                  });
                }
              }
            }
          }
        } catch (emailErr) {
          logger.error(
            "Failed to send expert verification email to reporter",
            { incidentId: data.incidentId },
            emailErr instanceof Error ? emailErr : undefined,
          );
        }
      }
    } catch (emailErr) {
      logger.error(
        "Failed to send provider notification email",
        { incidentId: data.incidentId },
        emailErr instanceof Error ? emailErr : undefined,
      );
    }
  }

  return { kind: "success", value: { id: data.incidentId, newStatus } };
};

export async function moderateIncident(
  input: z.infer<typeof moderateSchema>,
): Promise<ModerationResult> {
  const mod = await requireModerator();
  if (!mod) return { ok: false, error: "Forbidden" };
  const parsed = moderateSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Invalid input" };

  const result = await withAutopilot<{ id: string; newStatus: string }>(
    moderateIncidentPolicy,
    [parsed.data.incidentId, mod.id, parsed.data.decision],
    (ctx) =>
      runModerationWork(ctx, {
        moderatorId: mod.id,
        incidentId: parsed.data.incidentId,
        decision: parsed.data.decision,
        moderationNote: parsed.data.moderationNote ?? null,
      }),
    { context: { userId: mod.id, ipHash: null, clientIdempotencyKey: null } },
  );

  if (result.kind === "ok" || result.kind === "replayed") {
    revalidatePath("/admin");
    revalidatePath(`/incidents/${parsed.data.incidentId}`);
    return {
      ok: true,
      autopilot: {
        attempts: attemptsOf(result),
        durationMs: durationOf(result),
        kind: result.kind,
      },
    };
  }
  return {
    ok: false,
    error: "Failed to update",
    autopilot: {
      attempts: attemptsOf(result),
      durationMs: durationOf(result),
      kind: result.kind,
    },
  };
}

const takedownSchema = z.object({
  id: z.string().min(1),
  decision: z.enum(["approve", "reject"]),
});

interface TakedownReviewWorkInput {
  id: string;
  reviewerId: string;
  newStatus: "approved" | "rejected";
}

const runTakedownReviewWork = async (
  _ctx: AttemptContext,
  data: TakedownReviewWorkInput,
): Promise<AttemptOutcome<{ id: string; newStatus: string }>> => {
  const admin = createAdminClient();
  const { error } = await admin
    .from("takedown_requests")
    .update({
      status: data.newStatus,
      reviewed_by: data.reviewerId,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", data.id);
  if (error) {
    return { kind: "retryable", error: error.message };
  }
  return { kind: "success", value: { id: data.id, newStatus: data.newStatus } };
};

export async function reviewTakedown(
  input: z.infer<typeof takedownSchema>,
): Promise<ModerationResult> {
  const mod = await requireModerator();
  if (!mod) return { ok: false, error: "Forbidden" };
  const parsed = takedownSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Invalid input" };
  const newStatus = parsed.data.decision === "approve" ? "approved" : "rejected";

  const result = await withAutopilot<{ id: string; newStatus: string }>(
    reviewTakedownPolicy,
    [parsed.data.id, mod.id, parsed.data.decision],
    (ctx) =>
      runTakedownReviewWork(ctx, {
        id: parsed.data.id,
        reviewerId: mod.id,
        newStatus,
      }),
    { context: { userId: mod.id, ipHash: null, clientIdempotencyKey: null } },
  );

  if (result.kind === "ok" || result.kind === "replayed") {
    revalidatePath("/admin");
    return {
      ok: true,
      autopilot: {
        attempts: attemptsOf(result),
        durationMs: durationOf(result),
        kind: result.kind,
      },
    };
  }
  return {
    ok: false,
    error: "Failed to update",
    autopilot: {
      attempts: attemptsOf(result),
      durationMs: durationOf(result),
      kind: result.kind,
    },
  };
}

const userRoleSchema = z.object({
  userId: z.string().min(1),
  role: z.enum(["user", "moderator", "admin", "ceo"]),
});

const ROLE_RANK: Record<"user" | "advisor" | "moderator" | "admin" | "ceo", number> = {
  user: 0,
  advisor: 1,
  moderator: 2,
  admin: 3,
  ceo: 4,
};

function canAssignRole(
  actorRole: "user" | "advisor" | "moderator" | "admin" | "ceo",
  targetRole: "user" | "advisor" | "moderator" | "admin" | "ceo",
): boolean {
  if (actorRole === "ceo") return true;
  if (actorRole === "admin") return targetRole !== "ceo" && targetRole !== "admin";
  return false;
}

export async function setUserRole(
  input: z.infer<typeof userRoleSchema>,
): Promise<{ ok: boolean; error?: string }> {
  const admin = await requireAdmin();
  if (!admin) return { ok: false, error: "Forbidden" };

  const parsed = userRoleSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Invalid input" };

  if (!canAssignRole(admin.role, parsed.data.role)) {
    return { ok: false, error: "Insufficient privileges to assign this role" };
  }

  const db = createAdminClient();

  const { data: before } = await db
    .from("users")
    .select("id, role, email")
    .eq("id", parsed.data.userId)
    .maybeSingle();

  if (!before) return { ok: false, error: "User not found" };

  if (before.role === parsed.data.role) {
    return { ok: true };
  }

  if (before.role === "ceo" && admin.role !== "ceo" && ROLE_RANK[admin.role] < ROLE_RANK.ceo) {
    return { ok: false, error: "Cannot modify a CEO" };
  }

  const { error } = await db
    .from("users")
    .update({ role: parsed.data.role })
    .eq("id", parsed.data.userId);

  if (error) return { ok: false, error: "Failed to update" };

  await db.from("audit_log").insert({
    actor_id: admin.id,
    action: "user.role.change",
    entity_type: "user",
    entity_id: parsed.data.userId,
    before_data: { role: before.role },
    after_data: { role: parsed.data.role, target_email: before.email },
  });

  revalidatePath("/admin/users");
  return { ok: true };
}

export async function promoteUser(
  email: string,
  role: "user" | "advisor" | "moderator" | "admin" | "ceo",
): Promise<{ ok: boolean; error?: string; userId?: string }> {
  const admin = await requireAdmin();
  if (!admin) return { ok: false, error: "Forbidden" };

  const emailSchema = z.string().email();
  const parsedEmail = emailSchema.safeParse(email);
  if (!parsedEmail.success) return { ok: false, error: "Invalid email" };

  const parsedRole = z.enum(["user", "advisor", "moderator", "admin", "ceo"]).safeParse(role);
  if (!parsedRole.success) return { ok: false, error: "Invalid role" };

  if (!canAssignRole(admin.role, parsedRole.data)) {
    return { ok: false, error: "Insufficient privileges to assign this role" };
  }

  const db = createAdminClient();

  const { data: target, error: lookupError } = await db
    .from("users")
    .select("id, role, email")
    .eq("email", parsedEmail.data)
    .maybeSingle();

  if (lookupError) return { ok: false, error: "Lookup failed" };
  if (!target) return { ok: false, error: "User not found" };

  if (target.role === "ceo" && admin.role !== "ceo" && ROLE_RANK[admin.role] < ROLE_RANK.ceo) {
    return { ok: false, error: "Cannot modify a CEO" };
  }

  if (target.role === parsedRole.data) {
    return { ok: true, userId: target.id };
  }

  const { error: updateError } = await db
    .from("users")
    .update({ role: parsedRole.data as "user" | "moderator" | "admin" | "ceo" })
    .eq("id", target.id);

  if (updateError) return { ok: false, error: "Failed to update" };

  await db.from("audit_log").insert({
    actor_id: admin.id,
    action: "user.promote",
    entity_type: "user",
    entity_id: target.id,
    before_data: { role: target.role },
    after_data: { role: parsedRole.data, target_email: target.email, method: "promote_by_email" },
  });

  revalidatePath("/admin/users");
  return { ok: true, userId: target.id };
}

export async function bulkApproveIncidents(
  ids: string[],
): Promise<{ ok: boolean; error?: string }> {
  const admin = await requireAdmin();
  if (!admin) return { ok: false, error: "Forbidden" };

  const db = createAdminClient();

  const { error } = await db
    .from("incidents")
    .update({
      status: "published",
      moderator_id: admin.id,
      moderated_at: new Date().toISOString(),
      published_at: new Date().toISOString(),
    })
    .in("id", ids);

  if (error) return { ok: false, error: error.message };

  await db.from("audit_log").insert({
    actor_id: admin.id,
    action: "incident.bulk_approve",
    entity_type: "incident",
    entity_id: ids.join(","),
    after_data: { count: ids.length },
  });

  revalidatePath("/[locale]/admin/import", "layout");
  revalidatePath("/[locale]/incidents", "layout");
  return { ok: true };
}

export async function bulkRejectIncidents(ids: string[]): Promise<{ ok: boolean; error?: string }> {
  const admin = await requireAdmin();
  if (!admin) return { ok: false, error: "Forbidden" };

  const db = createAdminClient();

  const { error } = await db
    .from("incidents")
    .update({
      status: "rejected",
      moderator_id: admin.id,
      moderated_at: new Date().toISOString(),
    })
    .in("id", ids);

  if (error) return { ok: false, error: error.message };

  await db.from("audit_log").insert({
    actor_id: admin.id,
    action: "incident.bulk_reject",
    entity_type: "incident",
    entity_id: ids.join(","),
    after_data: { count: ids.length },
  });

  revalidatePath("/[locale]/admin/import", "layout");
  return { ok: true };
}

const reviewExpertSchema = z.object({
  id: z.string().uuid(),
  decision: z.enum(["approve", "reject"]),
});

export async function reviewExpertApplication(
  input: z.infer<typeof reviewExpertSchema>,
): Promise<{ ok: boolean; error?: string }> {
  const mod = await requireModerator();
  if (!mod) return { ok: false, error: "Forbidden" };

  const parsed = reviewExpertSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Invalid input" };

  const newStatus = parsed.data.decision === "approve" ? "approved" : "rejected";
  const db = createAdminClient();

  const { error } = await db
    .from("expert_applications")
    .update({
      status: newStatus,
      reviewed_by: mod.id,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", parsed.data.id);

  if (error) return { ok: false, error: error.message };

  await db.from("audit_log").insert({
    actor_id: mod.id,
    action: "expert.review",
    entity_type: "expert_application",
    entity_id: parsed.data.id,
    after_data: { decision: parsed.data.decision },
  });

  revalidatePath("/[locale]/admin/experts", "layout");
  revalidatePath("/[locale]/experts", "layout");
  return { ok: true };
}

// =============================================================================
// Bulk Incident Import
// =============================================================================

const importSourceSchema = z.enum(["aiaaic_import", "aiid_import", "news_curated"]);

export interface ImportIncidentsResult {
  ok: boolean;
  inserted?: number;
  updated?: number;
  skipped?: number;
  errors?: string[];
  parseErrors?: { row: number; message: string }[];
  error?: string;
}

export async function importIncidentsAction(formData: FormData): Promise<ImportIncidentsResult> {
  await requireAdmin();

  const file = formData.get("file") as File | null;
  const rawSource = formData.get("source") as string | null;

  if (!file || file.size === 0) {
    return { ok: false, error: "No file provided." };
  }
  if (file.size > 5 * 1024 * 1024) {
    return { ok: false, error: "File too large. Maximum 5 MB." };
  }

  const sourceResult = importSourceSchema.safeParse(rawSource);
  if (!sourceResult.success) {
    return {
      ok: false,
      error: "Invalid source. Must be aiaaic_import, aiid_import, or news_curated.",
    };
  }

  const source = sourceResult.data as IncidentSource;
  const csvText = await file.text();

  const { rows, errors: parseErrors, total } = parseIncidentCSV(csvText, source);

  logger.info("Import CSV parsed", {
    total,
    validRows: rows.length,
    parseErrors: parseErrors.length,
    source,
  });

  if (rows.length === 0) {
    return {
      ok: false,
      error: `No valid rows found (${total} rows parsed, ${parseErrors.length} errors).`,
      parseErrors,
    };
  }

  const importResult = await importIncidents(rows, source);

  revalidatePath("/[locale]/admin/import", "layout");

  return {
    ok: importResult.errors.length === 0,
    inserted: importResult.inserted,
    updated: importResult.updated,
    skipped: importResult.skipped,
    errors: importResult.errors,
    parseErrors,
  };
}

export async function toggleVerifiedRespondent(
  providerId: string,
  isVerified: boolean,
  contactEmail?: string | null,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const adminUser = await requireAdmin();
    const admin = createAdminClient();

    const { error } = await admin
      .from("ai_providers")
      .update({
        is_verified_respondent: isVerified,
        verified_respondent_at: isVerified ? new Date().toISOString() : null,
        respondent_contact_email: isVerified ? contactEmail || null : null,
        respondent_verified_by: isVerified ? adminUser.id : null,
      })
      .eq("id", providerId);

    if (error) {
      return { ok: false, error: error.message };
    }

    revalidatePath("/[locale]/admin", "layout");
    revalidatePath("/[locale]/leaderboard", "page");
    revalidatePath("/", "page");
    return { ok: true };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    return { ok: false, error: msg };
  }
}
