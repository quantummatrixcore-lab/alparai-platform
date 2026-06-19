"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { logger } from "@/lib/utils/logger";
import { withAutopilot, type AttemptOutcome, type AttemptContext } from "@/lib/autopilot";
import { weeklyReportPolicy } from "@/lib/autopilot/policies";
import { revalidatePath } from "next/cache";

interface WeeklyReportData {
  top_incidents: Array<{ id: string; title_en: string; upvotes: number; provider_name: string }>;
  leaderboard: Array<{ name: string; trust_score: number }>;
  top_news: Array<{ title_en: string; url: string; source: string }>;
}

interface WeeklyReportResult {
  blogPostId: string | null;
  generated: boolean;
}

export async function fetchWeeklyData(
  admin: ReturnType<typeof createAdminClient>,
): Promise<WeeklyReportData> {
  const weekStart = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  let { data: incidentsRaw } = await admin
    .from("incidents")
    .select("id, title_masked, upvotes_count, ai_providers(name)")
    .eq("status", "published")
    .gte("created_at", weekStart)
    .order("upvotes_count", { ascending: false })
    .limit(5);

  if (!incidentsRaw || incidentsRaw.length === 0) {
    const { data: fallbackIncidents } = await admin
      .from("incidents")
      .select("id, title_masked, upvotes_count, ai_providers(name)")
      .eq("status", "published")
      .order("upvotes_count", { ascending: false })
      .limit(5);
    incidentsRaw = fallbackIncidents;
  }

  const top_incidents = (incidentsRaw ?? []).map((i) => ({
    id: i.id,
    title_en: i.title_masked ?? "",
    upvotes: i.upvotes_count ?? 0,
    provider_name:
      i.ai_providers && !Array.isArray(i.ai_providers)
        ? (i.ai_providers as { name: string }).name
        : "Unknown",
  }));

  const { data: providersRaw } = await admin
    .from("ai_providers")
    .select("name, trust_score")
    .order("trust_score", { ascending: false })
    .limit(5);

  const leaderboard = (providersRaw ?? []).map((p) => ({
    name: p.name ?? "",
    trust_score: p.trust_score ?? 0,
  }));

  let { data: newsRaw } = await admin
    .from("ecosystem_news")
    .select("title_en, url, source")
    .eq("is_active", true)
    .gte("published_at", weekStart)
    .order("published_at", { ascending: false })
    .limit(3);

  if (!newsRaw || newsRaw.length === 0) {
    const { data: fallbackNews } = await admin
      .from("ecosystem_news")
      .select("title_en, url, source")
      .eq("is_active", true)
      .order("published_at", { ascending: false })
      .limit(3);
    newsRaw = fallbackNews;
  }

  const top_news = (newsRaw ?? []).map((n) => ({
    title_en: n.title_en ?? "",
    url: n.url ?? "",
    source: n.source ?? "",
  }));

  return { top_incidents, leaderboard, top_news };
}

async function generateReportWithGemini(data: WeeklyReportData): Promise<{
  title_en: string;
  title_tr: string;
  content_en: string;
  content_tr: string;
} | null> {
  const apiKey = process.env.GOOGLE_API_KEY ?? process.env.GEMINI_API_KEY;
  if (!apiKey) {
    logger.error("No Google API Key found for weekly report generation");
    return null;
  }

  const prompt = `You are the editorial AI for ALPAR AI — the AI accountability and trust infrastructure platform.

Generate a professional weekly AI accountability report based on this data:

TOP INCIDENTS THIS WEEK:
${data.top_incidents.map((i, idx) => `${idx + 1}. "${i.title_en}" (Provider: ${i.provider_name}, Upvotes: ${i.upvotes})`).join("\n")}

AI PROVIDER LEADERBOARD (Trust Score):
${data.leaderboard.map((p, idx) => `${idx + 1}. ${p.name}: ${p.trust_score}/100`).join("\n")}

TOP AI ECOSYSTEM NEWS:
${data.top_news.map((n, idx) => `${idx + 1}. "${n.title_en}" (Source: ${n.source})`).join("\n")}

Generate a professional weekly report blog post in BOTH English and Turkish.

Requirements:
- Tone: Objective, professional, journalistic. No marketing fluff.
- EN title: Concise (max 80 chars), punchy, SEO-friendly
- TR title: Direct Turkish translation, natural language
- EN content: 300-400 words. Sections: "This Week's Top AI Incidents", "Provider Rankings", "Ecosystem News", "Editor's Take"
- TR content: Direct Turkish translation of EN content
- Do NOT include hardcoded markdown formatting ticks in strings

Return ONLY a valid JSON object:
{
  "title_en": "...",
  "title_tr": "...",
  "content_en": "...",
  "content_tr": "..."
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
      logger.error("Gemini API call failed for weekly report", { status: response.status });
      return null;
    }

    const result = await response.json();
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return null;

    const parsed = JSON.parse(text) as {
      title_en: string;
      title_tr: string;
      content_en: string;
      content_tr: string;
    };

    return parsed;
  } catch (err) {
    logger.error(
      "Error generating weekly report with Gemini",
      undefined,
      err instanceof Error ? err : undefined,
    );
    return null;
  }
}

async function runWeeklyReportWork(
  ctx: AttemptContext,
): Promise<AttemptOutcome<WeeklyReportResult>> {
  void ctx;
  const admin = createAdminClient();

  const data = await fetchWeeklyData(admin);

  if (data.top_incidents.length === 0 && data.top_news.length === 0) {
    logger.warn("Weekly report: no incidents or news found this week, skipping generation");
    return { kind: "success", value: { blogPostId: null, generated: false } };
  }

  const report = await generateReportWithGemini(data);
  if (!report) {
    return { kind: "retryable", error: "Gemini generation failed" };
  }

  const slug = `weekly-report-${new Date().toISOString().slice(0, 10)}`;

  const { data: inserted, error: insertError } = await admin
    .from("blog_posts")
    .insert({
      slug,
      title_en: report.title_en,
      title_tr: report.title_tr,
      content_en: report.content_en,
      content_tr: report.content_tr,
      status: "draft",
      generated_by: "autopilot-weekly",
      published_at: null,
    })
    .select("id")
    .maybeSingle();

  if (insertError) {
    if (insertError.code === "23505") {
      return { kind: "success", value: { blogPostId: null, generated: false } };
    }
    logger.error("Failed to insert weekly report blog post", { error: insertError.message });
    return { kind: "retryable", error: insertError.message };
  }

  return {
    kind: "success",
    value: { blogPostId: inserted?.id ?? null, generated: true },
  };
}

export async function generateWeeklyReportAction(): Promise<{
  ok: boolean;
  generated?: boolean;
  blogPostId?: string | null;
}> {
  const weekId = new Date().toISOString().slice(0, 10);
  const idempotencyKey = `weekly-report:${weekId}`;

  const result = await withAutopilot<WeeklyReportResult>(
    weeklyReportPolicy,
    [idempotencyKey],
    (ctx) => runWeeklyReportWork(ctx),
    { context: { userId: null, ipHash: null, clientIdempotencyKey: idempotencyKey } },
  );

  if (result.kind === "ok") {
    try {
      revalidatePath("/blog");
      revalidatePath("/admin");
    } catch {}
    return { ok: true, generated: result.value.generated, blogPostId: result.value.blogPostId };
  }

  if (result.kind === "replayed") {
    return { ok: true, generated: false };
  }

  return { ok: false };
}
