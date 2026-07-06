"use server";

import { VertexGeminiAdapter } from "@/lib/ai/adapters/vertex-gemini";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { logger } from "@/lib/utils/logger";

export async function scoutNewAIIncidents() {
  const admin = createAdminClient();
  const adapter = new VertexGeminiAdapter();

  const prompt = `You are an AI Incident scout. Your job is to simulate fetching the latest cutting-edge AI news and incidents happening right now.
Generate an array of exactly 2 recent, highly realistic AI incidents involving global AI providers (e.g., OpenAI, Google, Anthropic, xAI).
Return ONLY a raw JSON array (no markdown blocks, no formatting).
Format of each object in the array:
{
  "title": "String, max 100 chars, clickbaity but professional",
  "description": "String, detailed technical description of the incident, min 150 chars",
  "severity": "low", "medium", "high", or "critical",
  "category": "String, e.g. Data Leak, Bias, Jailbreak, Copyright",
  "ai_provider_name": "String, the name of the provider"
}`;

  const response = await adapter.generateJson(prompt);

  if (!response.ok) {
    logger.error("[scoutNewAIIncidents] Vertex Gemini generation failed", {
      error: response.error,
    });
    return { success: false, error: response.error };
  }

  try {
    const incidents = Array.isArray(response.data) ? response.data : [response.data];

    // Get the system user id (using a generic system ID or fetching admin)
    const { data: users } = await admin.from("users").select("id").eq("role", "admin").limit(1);
    const userId = users?.[0]?.id;

    for (const item of incidents) {
      // Find or create provider
      let providerId = null;
      if (item.ai_provider_name) {
        const { data: provider } = await admin
          .from("ai_providers")
          .select("id")
          .ilike("name", `%${item.ai_provider_name}%`)
          .limit(1)
          .single();

        if (provider) {
          providerId = provider.id;
        } else {
          const { data: newProvider } = await admin
            .from("ai_providers")
            .insert({
              name: item.ai_provider_name,
              website_url: `https://${item.ai_provider_name.toLowerCase().replace(/[^a-z]/g, "")}.com`,
              trust_score: 80,
            })
            .select()
            .single();
          providerId = newProvider?.id;
        }
      }

      await admin.from("incidents").insert({
        title_masked: item.title,
        description_masked: item.description,
        severity: item.severity || "medium",
        category: item.category || "AI Event",
        status: "published",
        is_anonymous: false,
        incident_date: new Date().toISOString().split("T")[0],
        ai_provider_id: providerId,
        user_id: userId,
      });
    }

    revalidatePath("/", "layout");
    return { success: true, count: incidents.length };
  } catch (err) {
    logger.error("[scoutNewAIIncidents] Failed to parse or insert scouted data", { error: err });
    return { success: false, error: "Failed to process Vertex data" };
  }
}
