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
  data: ModerationWorkInput
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
  input: z.infer<typeof moderateSchema>
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
    { context: { userId: mod.id, ipHash: null, clientIdempotencyKey: null } }
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
  data: TakedownReviewWorkInput
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
  input: z.infer<typeof takedownSchema>
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
    { context: { userId: mod.id, ipHash: null, clientIdempotencyKey: null } }
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

export async function setUserRole(
  input: z.infer<typeof userRoleSchema>
): Promise<{ ok: boolean; error?: string }> {
  const admin = await requireAdmin();
  if (!admin) return { ok: false, error: "Forbidden" };
  const parsed = userRoleSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Invalid input" };
  const db = createAdminClient();
  const { error } = await db
    .from("users")
    .update({ role: parsed.data.role })
    .eq("id", parsed.data.userId);
  if (error) return { ok: false, error: "Failed to update" };
  revalidatePath("/admin");
  return { ok: true };
}
