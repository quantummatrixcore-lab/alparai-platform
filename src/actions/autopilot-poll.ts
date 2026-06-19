"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { logger } from "@/lib/utils/logger";
import { withAutopilot, type AttemptOutcome, type AttemptContext } from "@/lib/autopilot";
import { weeklyPollPolicy } from "@/lib/autopilot/policies";
import { revalidatePath } from "next/cache";

interface PollGenerationResult {
  pollId: string | null;
  generated: boolean;
}

async function fetchRecentNews(
  admin: ReturnType<typeof createAdminClient>,
): Promise<Array<{ title_en: string; category: string; severity: string }>> {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const { data } = await admin
    .from("ecosystem_news")
    .select("title_en, category, severity")
    .eq("is_active", true)
    .gte("published_at", sevenDaysAgo)
    .order("published_at", { ascending: false })
    .limit(10);

  return (data ?? []).map((n) => ({
    title_en: n.title_en ?? "",
    category: n.category ?? "news",
    severity: n.severity ?? "medium",
  }));
}

async function generatePollWithGemini(
  recentNews: Array<{ title_en: string; category: string; severity: string }>,
): Promise<{
  title: string;
  description: string;
  category: string;
} | null> {
  const apiKey = process.env.GOOGLE_API_KEY ?? process.env.GEMINI_API_KEY;
  if (!apiKey) {
    logger.error("No Google API Key found for weekly poll generation");
    return null;
  }

  const newsContext =
    recentNews.length > 0
      ? recentNews
          .map((n, i) => `${i + 1}. [${n.category.toUpperCase()}] "${n.title_en}"`)
          .join("\n")
      : "No specific news available this week.";

  const prompt = `You are the community engagement AI for ALPAR AI — an AI accountability platform.

Based on these recent AI ecosystem news items, generate ONE thought-provoking AI ethics dilemma question (Yes/No/Unsure format):

RECENT NEWS:
${newsContext}

Requirements:
- The title must be a clear, direct, and polarizing question (max 100 chars).
- The description must present a brief context or scenario presenting both sides of the dilemma.
- The output should provide the question and description in both Turkish and English so it is accessible to all users.
- In the description, write the English version first followed by the Turkish translation, separated by two newlines.
- Do NOT include markdown ticks or extra text.

Return ONLY valid JSON:
{
  "title": "EN Question? / TR Soru?",
  "description": "EN Context description...\n\nTR Bağlam açıklaması...",
  "category": "ethics"
}`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json" },
        }),
      },
    );

    if (!response.ok) {
      logger.error("Gemini API call failed for weekly poll", { status: response.status });
      return null;
    }

    const result = await response.json();
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return null;

    const parsed = JSON.parse(text) as {
      title: string;
      description: string;
      category: string;
    };

    if (!parsed.title || !parsed.description) {
      logger.error("Gemini returned invalid poll structure");
      return null;
    }

    return parsed;
  } catch (err) {
    logger.error(
      "Error generating poll with Gemini",
      undefined,
      err instanceof Error ? err : undefined,
    );
    return null;
  }
}

async function runWeeklyPollWork(
  ctx: AttemptContext,
): Promise<AttemptOutcome<PollGenerationResult>> {
  void ctx;
  const admin = createAdminClient();

  const { error: closeError } = await admin
    .from("ai_polls")
    .update({ is_active: false })
    .eq("is_active", true);

  if (closeError) {
    logger.warn("Failed to close active polls before creating new one", {
      error: closeError.message,
    });
  }

  const recentNews = await fetchRecentNews(admin);

  const pollData = await generatePollWithGemini(recentNews);
  if (!pollData) {
    return { kind: "retryable", error: "Gemini poll generation failed" };
  }

  const { data: inserted, error: insertError } = await admin
    .from("ai_polls")
    .insert({
      title: pollData.title,
      description: pollData.description,
      category: pollData.category || "ethics",
      is_active: true,
      yes_count: 0,
      no_count: 0,
      unsure_count: 0,
    })
    .select("id")
    .maybeSingle();

  if (insertError) {
    logger.error("Failed to insert weekly poll", { error: insertError.message });
    return { kind: "retryable", error: insertError.message };
  }

  return {
    kind: "success",
    value: { pollId: inserted?.id ?? null, generated: true },
  };
}

export async function generateWeeklyPollAction(): Promise<{
  ok: boolean;
  generated?: boolean;
  pollId?: string | null;
}> {
  const weekId = new Date().toISOString().slice(0, 10);
  const idempotencyKey = `weekly-poll:${weekId}`;

  const result = await withAutopilot<PollGenerationResult>(
    weeklyPollPolicy,
    [idempotencyKey],
    (ctx) => runWeeklyPollWork(ctx),
    { context: { userId: null, ipHash: null, clientIdempotencyKey: idempotencyKey } },
  );

  if (result.kind === "ok") {
    revalidatePath("/");
    revalidatePath("/admin");
    return { ok: true, generated: result.value.generated, pollId: result.value.pollId };
  }

  if (result.kind === "replayed") {
    return { ok: true, generated: false };
  }

  return { ok: false };
}
