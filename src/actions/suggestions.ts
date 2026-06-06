"use server";

import { revalidatePath } from "next/cache";
import { createServerClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/session";
import { suggestionSubmissionSchema } from "@/lib/validation/schemas";
import { withAutopilot, submitSuggestionPolicy, attemptsOf, durationOf } from "@/lib/autopilot";
import type { AttemptContext, AttemptOutcome } from "@/lib/autopilot";

export interface SubmitSuggestionState {
  ok: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
  autopilot?: { attempts: number; durationMs: number; kind: string };
}

interface SuggestionWorkInput {
  userId: string;
  title: string;
  description: string;
  category: string;
}

const runSuggestionWork = async (
  _ctx: AttemptContext,
  data: SuggestionWorkInput
): Promise<AttemptOutcome<{ id: string }>> => {
  const supabase = await createServerClient();
  const { data: row, error } = await supabase
    .from("suggestions")
    .insert({
      user_id: data.userId,
      title: data.title,
      description: data.description,
      category: data.category,
      status: "open",
    } as never)
    .select("id")
    .single();
  if (error || !row) {
    return { kind: "retryable", error: error?.message ?? "suggestion_insert_failed" };
  }
  return { kind: "success", value: { id: (row as Record<string, unknown>).id as string } };
};

export async function submitSuggestion(
  _prev: SubmitSuggestionState,
  formData: FormData
): Promise<SubmitSuggestionState> {
  const user = await getCurrentUser();
  if (!user) {
    return { ok: false, error: "Sign in to suggest a feature" };
  }
  const raw = {
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
    category: String(formData.get("category") ?? "feature"),
  };
  const parsed = suggestionSubmissionSchema.safeParse({
    ...raw,
    category: raw.category as never,
    isAnonymous: false,
  });
  if (!parsed.success) {
    return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const result = await withAutopilot<{ id: string }>(
    submitSuggestionPolicy,
    [user.id, parsed.data.title, parsed.data.category],
    (ctx) =>
      runSuggestionWork(ctx, {
        userId: user.id,
        title: parsed.data.title,
        description: parsed.data.description,
        category: parsed.data.category,
      }),
    { context: { userId: user.id, ipHash: null, clientIdempotencyKey: null } }
  );

  if (result.kind === "ok" || result.kind === "replayed") {
    revalidatePath("/suggestions");
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
    error: "Failed to submit suggestion",
    autopilot: {
      attempts: attemptsOf(result),
      durationMs: durationOf(result),
      kind: result.kind,
    },
  };
}

interface VoteWorkInput {
  suggestionId: string;
  userId: string;
  alreadyVoted: boolean;
}

const runSuggestionVoteWork = async (
  _ctx: AttemptContext,
  data: VoteWorkInput
): Promise<AttemptOutcome<{ toggled: "added" | "removed" }>> => {
  const admin = createAdminClient();
  if (data.alreadyVoted) {
    const { error } = await admin
      .from("suggestion_votes")
      .delete()
      .eq("suggestion_id", data.suggestionId)
      .eq("user_id", data.userId);
    if (error) {
      return { kind: "retryable", error: error.message };
    }
    return { kind: "success", value: { toggled: "removed" } };
  }
  const { error } = await admin.from("suggestion_votes").insert({
    suggestion_id: data.suggestionId,
    user_id: data.userId,
  } as never);
  if (error) {
    return { kind: "retryable", error: error.message };
  }
  return { kind: "success", value: { toggled: "added" } };
};

export async function upvoteSuggestion(suggestionId: string) {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Sign in to upvote" };
  const admin = createAdminClient();
  const { data: existing } = await admin
    .from("suggestion_votes")
    .select("user_id")
    .eq("suggestion_id", suggestionId)
    .eq("user_id", user.id)
    .maybeSingle();
  const alreadyVoted = Boolean(existing);

  const result = await withAutopilot<{ toggled: "added" | "removed" }>(
    submitSuggestionPolicy,
    [user.id, suggestionId, "vote"],
    (ctx) =>
      runSuggestionVoteWork(ctx, {
        suggestionId,
        userId: user.id,
        alreadyVoted,
      }),
    { context: { userId: user.id, ipHash: null, clientIdempotencyKey: null } }
  );

  if (result.kind === "ok" || result.kind === "replayed") {
    revalidatePath("/suggestions");
    return { ok: true };
  }
  return { ok: false, error: "vote_failed" };
}
