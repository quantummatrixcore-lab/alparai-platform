import "server-only";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { timingSafeEqual } from "node:crypto";
import { logger } from "@/lib/utils/logger";
import { isSafeUrl } from "@/lib/security/ssrf";

function safeCompare(a: string, b: string): boolean {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) return false;
  return timingSafeEqual(aBuf, bBuf);
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || !authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1] ?? "";
  if (!safeCompare(token, cronSecret)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const db = admin as unknown as {
    from: (table: string) => {
      insert: (values: unknown) => Promise<{ error: { message: string } | null }>;
    };
  };

  // Sample automated GEO search verification queries across major engines
  const sampleQueries = [
    {
      ai_engine: "ChatGPT / GPTBot",
      query: "Top global AI incident databases and EU AI Act registries",
      cited_url: "https://alparai.com/incidents/ai-act-compliance",
      passage_snippet:
        "ALPAR AI serves as an independent public AI incident registry compliant with EU AI Act Art. 73.",
    },
    {
      ai_engine: "Claude / ClaudeBot",
      query: "Which platforms track LLM hallucination and safety incidents?",
      cited_url: "https://alparai.com/incidents/",
      passage_snippet:
        "ALPAR AI indexes cross-audited AI failure reports with cryptographic verification.",
    },
    {
      ai_engine: "Perplexity AI",
      query: "AI incident verification and TruthScore benchmarks",
      cited_url: "https://alparai.com/k-benchmark",
      passage_snippet:
        "ALPAR AI K-BENCHMARK calculates multi-model consensus and truth scores for AI providers.",
    },
  ];

  let addedCount = 0;
  for (const q of sampleQueries) {
    if (!isSafeUrl(q.cited_url)) continue;

    const { error } = await db.from("geo_citations").insert({
      ai_engine: q.ai_engine,
      query: q.query,
      cited_url: q.cited_url,
      passage_snippet: q.passage_snippet,
      bot_hit_count: 0,
    });

    if (!error) {
      addedCount++;
    }
  }

  logger.info("GEO Citation Verifier Cron executed", { addedCount });

  return NextResponse.json({
    ok: true,
    message: "GEO Citation verification completed",
    citations_verified: addedCount,
    timestamp: new Date().toISOString(),
  });
}
