"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
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
  const newStatus = data.decision === "approve" ? "published" : "rejected";
  const { error } = await admin
    .from("incidents")
    .update({
      status: newStatus,
      moderator_id: data.moderatorId,
      moderated_at: new Date().toISOString(),
      moderation_note: data.moderationNote,
      published_at: newStatus === "published" ? new Date().toISOString() : null,
    })
    .eq("id", data.incidentId);
  if (error) {
    return { kind: "retryable", error: error.message };
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
  role: z.enum(["user", "moderator"]),
});

const ROLE_RANK: Record<"user" | "moderator" | "admin" | "ceo", number> = {
  user: 0,
  moderator: 1,
  admin: 2,
  ceo: 3,
};

function canAssignRole(
  actorRole: "user" | "moderator" | "admin" | "ceo",
  targetRole: "user" | "moderator" | "admin" | "ceo",
): boolean {
  if (actorRole === "ceo") return true;
  if (actorRole === "admin") return targetRole !== "ceo";
  return targetRole === "user";
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
  role: "user" | "moderator" | "admin" | "ceo",
): Promise<{ ok: boolean; error?: string; userId?: string }> {
  const admin = await requireAdmin();
  if (!admin) return { ok: false, error: "Forbidden" };

  const emailSchema = z.string().email();
  const parsedEmail = emailSchema.safeParse(email);
  if (!parsedEmail.success) return { ok: false, error: "Invalid email" };

  const parsedRole = z.enum(["user", "moderator", "admin", "ceo"]).safeParse(role);
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
    .update({ role: parsedRole.data })
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
