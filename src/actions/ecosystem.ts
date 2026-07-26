"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { logger } from "@/lib/utils/logger";

export async function approveQueueItem(id: string): Promise<void> {
  const supabase = createAdminClient();

  const { data: item, error: fetchError } = await supabase
    .from("external_incidents_queue")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError || !item) {
    logger.error("[EcosystemAction] Queue item not found", { id, error: fetchError?.message });
    return;
  }

  const { error: newsError } = await supabase.from("ecosystem_news").insert({
    title_en: item.title,
    title_tr: item.title,
    summary_en: item.body ?? "",
    summary_tr: item.body ?? "",
    category: "incident",
    severity: "medium",
    source: item.source,
    url: item.external_url,
    status: "accepted",
    is_active: true,
    published_at: new Date().toISOString(),
  });

  if (newsError) {
    logger.error("[EcosystemAction] Failed to insert ecosystem_news", {
      id,
      error: newsError.message,
    });
    return;
  }

  await supabase
    .from("external_incidents_queue")
    .update({ status: "published", updated_at: new Date().toISOString() })
    .eq("id", id);

  revalidatePath("/admin/ecosystem");
}

export async function rejectQueueItem(id: string): Promise<void> {
  const supabase = createAdminClient();

  await supabase
    .from("external_incidents_queue")
    .update({ status: "rejected", updated_at: new Date().toISOString() })
    .eq("id", id);

  revalidatePath("/admin/ecosystem");
}

export async function archiveEcosystemNews(id: string): Promise<void> {
  const supabase = createAdminClient();

  await supabase.from("ecosystem_news").update({ is_active: false }).eq("id", id);

  revalidatePath("/admin/ecosystem");
}

export async function updateEcosystemCategory(id: string, category: string): Promise<void> {
  const supabase = createAdminClient();

  await supabase.from("ecosystem_news").update({ category }).eq("id", id);

  revalidatePath("/admin/ecosystem");
}

export async function triggerExternalFetch(): Promise<{ success: boolean; message: string }> {
  const secret = process.env.CRON_SECRET;
  if (!secret) return { success: false, message: "CRON_SECRET not configured" };

  try {
    const url = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const res = await fetch(`${url}/api/cron/fetch-external`, {
      headers: { authorization: `Bearer ${secret}` },
      signal: AbortSignal.timeout(130_000),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "unknown error");
      return { success: false, message: `Fetch failed (${res.status}): ${text}` };
    }

    const data = await res.json();
    revalidatePath("/admin/ecosystem");
    return {
      success: true,
      message: `Done: ${data.total_fetched || 0} incidents, ${data.positive_inserted || 0} positive, ${data.ai_verified_published || 0} auto-published`,
    };
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
