"use server";

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

type IncidentRow = Database["public"]["Tables"]["incidents"]["Row"];

export interface SearchResult {
  id: string;
  title: string;
  category: string;
  severity: string;
  providerName: string | null;
  createdAt: string;
}

export async function searchIncidents(
  query: string,
  limit = 20
): Promise<{ ok: boolean; results: SearchResult[]; error?: string }> {
  if (!query || query.trim().length < 2) {
    return { ok: true, results: [] };
  }
  const supabase = await createClient();
  const sanitized = query.trim().replace(/[^\w\s-]/g, "").slice(0, 100);
  const { data: rawData, error } = await supabase
    .from("incidents")
    .select("id, title_masked, category, severity, created_at")
    .eq("status", "published")
    .or(`title_masked.ilike.%${sanitized}%,description_masked.ilike.%${sanitized}%`)
    .order("created_at", { ascending: false })
    .limit(limit);

  const data = rawData as unknown as Pick<IncidentRow, "id" | "title_masked" | "category" | "severity" | "created_at">[] | null;

  if (error) {
    console.error("searchIncidents error", error);
    return { ok: false, results: [], error: "Search failed" };
  }

  const results: SearchResult[] = (data ?? []).map((row) => ({
    id: row.id,
    title: row.title_masked ?? "",
    category: row.category,
    severity: row.severity,
    providerName: null,
    createdAt: row.created_at,
  }));

  return { ok: true, results };
}
