"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/session";
import { headers } from "next/headers";
import { APP_TAKEDOWN_EMAIL } from "@/lib/constants";
import { withAutopilot, submitTakedownPolicy, attemptsOf, durationOf } from "@/lib/autopilot";
import type { AttemptContext, AttemptOutcome } from "@/lib/autopilot";
import { createHash } from "node:crypto";

export interface TakedownResult {
  ok: boolean;
  error?: string;
  message?: string;
  autopilot?: { attempts: number; durationMs: number; kind: string };
}

const hashIp = (ip: string | null, salt: string): string | null =>
  ip
    ? createHash("sha256")
        .update(`${salt}:${ip}`)
        .digest("hex")
    : null;

const requestSchema = z.object({
  target_url: z.string().url(),
  reason: z.string().min(2).max(100),
  details: z.string().min(20).max(4000),
  requester_name: z.string().min(2).max(100),
  requester_email: z.string().email(),
  organization: z.string().max(200).optional(),
  country: z.string().max(100).optional(),
  identity_proof_url: z.string().url(),
});

interface TakedownRequestWorkInput {
  parsed: z.infer<typeof requestSchema>;
  ipHash: string | null;
}

const runTakedownRequestWork = async (
  _ctx: AttemptContext,
  data: TakedownRequestWorkInput
): Promise<AttemptOutcome<{ id: string }>> => {
  const admin = createAdminClient();
  const { data: row, error } = await admin
    .from("takedown_requests")
    .insert({
      target_url: data.parsed.target_url,
      reason: data.parsed.reason,
      details: data.parsed.details,
      requester_name: data.parsed.requester_name,
      requester_email: data.parsed.requester_email,
      organization: data.parsed.organization ?? null,
      country: data.parsed.country ?? null,
      identity_proof_url: data.parsed.identity_proof_url,
      status: "pending",
      ip_hash: data.ipHash,
    } as never)
    .select("id")
    .single();
  if (error || !row) {
    return { kind: "retryable", error: error?.message ?? "takedown_request_insert_failed" };
  }
  return { kind: "success", value: { id: (row as Record<string, unknown>).id as string } };
};

export async function submitTakedownRequest(input: z.infer<typeof requestSchema>): Promise<TakedownResult> {
  const parsed = requestSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Invalid form data" };
  }
  const hdrs = await headers();
  const ip = hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  const clientIdempotencyKey = hdrs.get("x-idempotency-key");
  const ipHash = hashIp(ip, process.env.IP_SALT ?? "alpar-default-salt");

  const result = await withAutopilot<{ id: string }>(
    submitTakedownPolicy,
    [
      parsed.data.target_url,
      parsed.data.requester_email,
      parsed.data.reason,
      parsed.data.identity_proof_url,
    ],
    (ctx) => runTakedownRequestWork(ctx, { parsed: parsed.data, ipHash }),
    {
      context: { userId: null, ipHash, clientIdempotencyKey },
    }
  );

  if (result.kind === "ok" || result.kind === "replayed") {
    return {
      ok: true,
      message: "Request received",
      autopilot: {
        attempts: attemptsOf(result),
        durationMs: durationOf(result),
        kind: result.kind,
      },
    };
  }
  if (result.kind === "circuit_open" || result.kind === "budget_exceeded" || result.kind === "exhausted") {
    return {
      ok: false,
      error: `Failed to submit. Please email ${APP_TAKEDOWN_EMAIL}`,
      autopilot: {
        attempts: attemptsOf(result),
        durationMs: durationOf(result),
        kind: result.kind,
      },
    };
  }
  return { ok: false, error: "Unexpected error" };
}

const inlineSchema = z.object({
  incidentId: z.string().min(1),
  reason: z.string().min(2).max(100),
  details: z.string().min(20).max(2000),
  contactEmail: z.string().email(),
});

interface InlineTakedownWorkInput {
  parsed: z.infer<typeof inlineSchema>;
  userId: string | null;
  requesterName: string;
  ipHash: string | null;
}

const runInlineTakedownWork = async (
  _ctx: AttemptContext,
  data: InlineTakedownWorkInput
): Promise<AttemptOutcome<{ id: string }>> => {
  const admin = createAdminClient();
  const { data: row, error } = await admin
    .from("takedown_requests")
    .insert({
      target_url: `${process.env.NEXT_PUBLIC_APP_URL}/incidents/${data.parsed.incidentId}`,
      reason: data.parsed.reason,
      details: data.parsed.details,
      requester_email: data.parsed.contactEmail,
      requester_name: data.requesterName,
      user_id: data.userId,
      incident_id: data.parsed.incidentId,
      status: "pending",
      ip_hash: data.ipHash,
    } as never)
    .select("id")
    .single();
  if (error || !row) {
    return { kind: "retryable", error: error?.message ?? "takedown_insert_failed" };
  }
  return { kind: "success", value: { id: (row as Record<string, unknown>).id as string } };
};

export async function submitTakedown(input: z.infer<typeof inlineSchema>): Promise<TakedownResult> {
  const user = await getCurrentUser();
  const parsed = inlineSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Invalid data" };
  const hdrs = await headers();
  const ip = hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  const clientIdempotencyKey = hdrs.get("x-idempotency-key");
  const ipHash = hashIp(ip, process.env.IP_SALT ?? "alpar-default-salt");

  const result = await withAutopilot<{ id: string }>(
    submitTakedownPolicy,
    [
      parsed.data.incidentId,
      parsed.data.contactEmail,
      parsed.data.reason,
      user?.id ?? "anon",
    ],
    (ctx) =>
      runInlineTakedownWork(ctx, {
        parsed: parsed.data,
        userId: user?.id ?? null,
        requesterName: user?.fullName ?? "Anonymous",
        ipHash,
      }),
    { context: { userId: user?.id ?? null, ipHash, clientIdempotencyKey } }
  );

  if (result.kind === "ok" || result.kind === "replayed") {
    revalidatePath(`/incidents/${parsed.data.incidentId}`);
    return {
      ok: true,
      message: "Submitted",
      autopilot: {
        attempts: attemptsOf(result),
        durationMs: durationOf(result),
        kind: result.kind,
      },
    };
  }
  return {
    ok: false,
    error: "Failed to submit",
    autopilot: {
      attempts: attemptsOf(result),
      durationMs: durationOf(result),
      kind: result.kind,
    },
  };
}
