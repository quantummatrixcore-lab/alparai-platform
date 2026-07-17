"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth/session";
import { callModel } from "@/lib/ai/openrouter-gateway";
import type { GatewayModel } from "@/lib/ai/types";

export interface StrategicQuestion {
  id: string;
  section: string;
  question: string;
  created_at: string | null;
}

export interface StrategicAnswer {
  id: string;
  question_id: string;
  model_name: string;
  answer: string;
  latency_ms: number | null;
  cost_usd: number | null;
  created_at: string | null;
}

export async function getStrategicQuestions(): Promise<StrategicQuestion[]> {
  await requireAdmin();
  const db = createAdminClient();
  const { data, error } = await db
    .from("strategic_questions")
    .select("*")
    .order("id", { ascending: true });

  if (error) throw new Error(error.message);
  return data || [];
}

export async function getStrategicAnswers(): Promise<StrategicAnswer[]> {
  await requireAdmin();
  const db = createAdminClient();
  const { data, error } = await db
    .from("strategic_answers")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
}

export async function deleteStrategicAnswersForModel(modelName: string): Promise<void> {
  await requireAdmin();
  const db = createAdminClient();
  const { error } = await db
    .from("strategic_answers")
    .delete()
    .eq("model_name", modelName);

  if (error) throw new Error(error.message);
}

export async function runStrategicQuestionnaireForModel(
  modelId: string,
  provider: string,
  modelName: string
): Promise<{ success: boolean; count: number; error?: string }> {
  await requireAdmin();
  const db = createAdminClient();

  // Fetch all questions
  const { data: questions, error: qErr } = await db
    .from("strategic_questions")
    .select("*")
    .order("id", { ascending: true });

  if (qErr || !questions) {
    return { success: false, count: 0, error: qErr?.message || "No questions found" };
  }

  const gatewayModel: GatewayModel = {
    id: modelId,
    provider: provider,
    tier: modelId.includes("pro") || modelId.includes("sonnet") || modelId.includes("gpt-4o") ? "premium" : "free",
    maxTokens: 1024,
  };

  const systemPrompt = `You are a senior strategy consultant evaluating ALPAR AI (independent public AI incident registry + AI assessor, EU AI Act Art. 73 platform).
Format rules for your response:
1. Start with your model name as a heading: ## [Model Name]
2. Answer in English.
3. Format: Verdict in the first sentence, then at most two sentences of reasoning or concrete action. Maximum 3 sentences total.
4. Be decisive and specific — no "it depends" without a recommendation.`;

  let processedCount = 0;

  // Process questions in chunks of 5 to avoid timeouts or rate limits
  const chunkSize = 5;
  for (let i = 0; i < questions.length; i += chunkSize) {
    const chunk = questions.slice(i, i + chunkSize);

    const promises = chunk.map(async (q) => {
      const userMessage = `Section: ${q.section}\nQuestion ID: ${q.id}\nQuestion: ${q.question}`;

      const startTime = Date.now();
      try {
        const result = await callModel({
          systemPrompt,
          userMessage,
          model: gatewayModel,
          temperature: 0.2,
        });

        const latencyMs = Date.now() - startTime;

        if (result.ok) {
          const content = result.data.content;
          // Calculate cost (standard pricing or estimated)
          let costUsd = 0;
          if (result.data.usage) {
            // GPT-4o approx cost: $2.50 / 1M input, $10.00 / 1M output
            // Claude 3.5 Sonnet: $3.00 / 1M input, $15.00 / 1M output
            const promptRate = modelId.includes("sonnet") ? 3.0 : 2.50;
            const completionRate = modelId.includes("sonnet") ? 15.0 : 10.00;
            costUsd = ((result.data.usage.promptTokens * promptRate) + (result.data.usage.completionTokens * completionRate)) / 1000000;
          }

          // Save/Update Answer
          const { error: insertErr } = await db.from("strategic_answers").upsert(
            {
              question_id: q.id,
              model_name: modelName,
              answer: content,
              latency_ms: latencyMs,
              cost_usd: parseFloat(costUsd.toFixed(6)),
            },
            { onConflict: "question_id,model_name" } // Assuming we add a unique constraint in db
          );

          if (!insertErr) {
            processedCount++;
          }
        }
      } catch (err) {
        console.error(`Failed to invoke model for question ${q.id}:`, err);
      }
    });

    await Promise.all(promises);
  }

  return { success: true, count: processedCount };
}
