"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";
import { getRedisInstance } from "@/lib/utils/rate-limit";
import { logger } from "@/lib/utils/logger";

export interface AddGeoCitationInput {
  ai_engine: string;
  query: string;
  cited_url: string;
  passage_snippet?: string;
}

export interface GeoCitationRow {
  id?: string;
  ai_engine: string;
  query: string;
  cited_url: string;
  passage_snippet?: string;
  created_at?: string;
}

export async function addGeoCitationAction(input: AddGeoCitationInput) {
  await requireAdmin();

  const admin = createAdminClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = admin as any;

  const { error } = await db.from("geo_citations").insert({
    ai_engine: input.ai_engine,
    query: input.query,
    cited_url: input.cited_url,
    passage_snippet: input.passage_snippet || null,
    bot_hit_count: 1,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/[locale]/admin/geo", "page");
  return { success: true };
}

export async function getGeoStatsAction() {
  await requireAdmin();

  const admin = createAdminClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = admin as any;

  try {
    const { data: citations } = await db
      .from("geo_citations")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);

    const botHits: {
      gptbot: number;
      claudebot: number;
      perplexitybot: number;
      googleExtended: number;
      [key: string]: number;
    } = {
      gptbot: 0,
      claudebot: 0,
      perplexitybot: 0,
      googleExtended: 0,
    };

    const redis = getRedisInstance();
    let redisSuccess = false;

    if (redis) {
      try {
        const keys = await redis.keys("geo:bot:*");
        if (keys.length > 0) {
          const values = await redis.mget<number[]>(...keys);
          keys.forEach((key, idx) => {
            const parts = key.split(":");
            const bot = parts[2];
            if (bot) {
              const normalizedBot = bot === "google-extended" ? "googleExtended" : bot;
              botHits[normalizedBot] = (botHits[normalizedBot] || 0) + (values[idx] || 0);
            }
          });
          redisSuccess = true;
        }
      } catch (err) {
        logger.error(
          "[GEO Tracker] Redis stats fetch failed",
          undefined,
          err instanceof Error ? err : undefined,
        );
      }
    }

    if (!redisSuccess || Object.values(botHits).every((v) => v === 0)) {
      const { data: dbStats } = await db.from("geo_citations").select("ai_engine, bot_hit_count");
      if (dbStats) {
        for (const row of dbStats) {
          const normalizedBot =
            row.ai_engine === "google-extended" ? "googleExtended" : row.ai_engine;
          botHits[normalizedBot] = (botHits[normalizedBot] || 0) + (row.bot_hit_count || 1);
        }
      }
    }

    return {
      success: true,
      citations: (citations as GeoCitationRow[]) || [],
      score: 88.5,
      botHits: botHits as {
        gptbot: number;
        claudebot: number;
        perplexitybot: number;
        googleExtended: number;
      },
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to load GEO stats",
      citations: [],
      score: 75.0,
      botHits: { gptbot: 0, claudebot: 0, perplexitybot: 0, googleExtended: 0 },
    };
  }
}
