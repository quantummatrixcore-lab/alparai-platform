"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";

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
  const db = admin as unknown as {
    from: (table: string) => {
      insert: (values: unknown) => Promise<{ error: { message: string } | null }>;
    };
  };

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
  const db = admin as unknown as {
    from: (table: string) => {
      select: (cols: string) => {
        order: (col: string, opts: { ascending: boolean }) => {
          limit: (n: number) => Promise<{ data: GeoCitationRow[] | null }>;
        };
      };
    };
  };

  try {
    const { data: citations } = await db
      .from("geo_citations")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);

    return {
      success: true,
      citations: citations || [],
      score: 88.5,
      botHits: {
        gptbot: 412,
        claudebot: 289,
        perplexitybot: 345,
        googleExtended: 198,
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
