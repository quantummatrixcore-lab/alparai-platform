/**
 * Provider-Agnostic AI Gateway.
 *
 * Implements a unified abstraction layer over multiple LLM providers:
 *   - OpenRouter (OpenAI SDK wrapper)
 *   - HuggingFace (Serverless Inference HTTP)
 *   - Cohere (Cohere REST chat completions)
 *   - Google Gemini (Native Google AI REST)
 *
 * Dynamically routes requests based on the `provider` field of the model definition.
 * Implements circuit-breaker failover across any model chain.
 *
 * KVKK/GDPR: All text MUST be pre-masked through PII Guardian before
 * reaching this module.
 */

import "server-only";
import { logger } from "@/lib/utils/logger";
import type {
  GatewayModel,
  GatewayRequest,
  GatewayResult,
  GatewayError,
  ProviderAdapter,
} from "./types";
import { OpenRouterAdapter } from "./adapters/openrouter";
import { CohereAdapter } from "./adapters/cohere";
import { HuggingFaceAdapter } from "./adapters/huggingface";
import { GoogleAdapter } from "./adapters/google";
import { BlackboxAdapter } from "./adapters/blackbox";
import { NvidiaNgcAdapter } from "./adapters/nvidia-ngc";
import { isCostKillSwitchActive } from "./cost-guard";

// Export the type interfaces from the common types file to keep backward compatibility
export type {
  GatewayModel,
  GatewayRequest,
  GatewayResponse,
  GatewayError,
  GatewayResult,
} from "./types";

// Default model setup for the Cross-Audit Engine (kept for backwards compatibility)
export const FREE_TRIAGE_MODELS: readonly GatewayModel[] = [
  { id: "gemini-1.5-flash", provider: "google", tier: "free", maxTokens: 2048 },
  { id: "deepseek/deepseek-chat", provider: "openrouter", tier: "free", maxTokens: 2048 },
  { id: "blackboxai", provider: "blackbox", tier: "free", maxTokens: 2048 },
] as const;

export const SUPREME_COURT_MODEL: GatewayModel = {
  id: "gemini-1.5-pro",
  provider: "google",
  tier: "premium",
  maxTokens: 4096,
} as const;

// Dedicated multi-provider failover chains for each parallel slot
export const TRIAGE_SLOT_1_CHAIN: readonly GatewayModel[] = [
  { id: "gemini-1.5-flash", provider: "google", tier: "free", maxTokens: 2048 },
  { id: "deepseek/deepseek-chat", provider: "openrouter", tier: "free", maxTokens: 2048 },
  { id: "blackboxai", provider: "blackbox", tier: "free", maxTokens: 2048 },
  { id: "command-r", provider: "cohere", tier: "free", maxTokens: 2048 },
] as const;

export const TRIAGE_SLOT_2_CHAIN: readonly GatewayModel[] = [
  { id: "gemini-1.5-flash", provider: "google", tier: "free", maxTokens: 2048 },
  { id: "meta-llama/llama-3.3-70b:free", provider: "openrouter", tier: "free", maxTokens: 2048 },
  { id: "blackboxai", provider: "blackbox", tier: "free", maxTokens: 2048 },
  {
    id: "meta-llama/Llama-3.3-70B-Instruct",
    provider: "huggingface",
    tier: "free",
    maxTokens: 2048,
  },
] as const;

export const TRIAGE_SLOT_3_CHAIN: readonly GatewayModel[] = [
  { id: "gemini-1.5-flash", provider: "google", tier: "free", maxTokens: 2048 },
  { id: "qwen/qwen-2.5-72b:free", provider: "openrouter", tier: "free", maxTokens: 2048 },
  { id: "blackboxai", provider: "blackbox", tier: "free", maxTokens: 2048 },
  { id: "command-r", provider: "cohere", tier: "free", maxTokens: 2048 },
] as const;

export const SUPREME_COURT_CHAIN: readonly GatewayModel[] = [
  { id: "gemini-1.5-pro", provider: "google", tier: "premium", maxTokens: 4096 },
  { id: "anthropic/claude-3.5-sonnet", provider: "openrouter", tier: "premium", maxTokens: 4096 },
  { id: "openai/gpt-4o", provider: "openrouter", tier: "premium", maxTokens: 4096 },
] as const;

// Instantiate adapters lazily or cache them
const adapters: Record<string, ProviderAdapter> = {
  openrouter: new OpenRouterAdapter(),
  cohere: new CohereAdapter(),
  huggingface: new HuggingFaceAdapter(),
  google: new GoogleAdapter(),
  blackbox: new BlackboxAdapter(),
  nvidia: new NvidiaNgcAdapter(),
};

/**
 * Route request to the appropriate adapter based on model.provider.
 */
export async function callModel(request: GatewayRequest): Promise<GatewayResult> {
  if (await isCostKillSwitchActive()) {
    logger.warn(`[Gateway] Call blocked — COST_KILL_SWITCH is active.`);
    return {
      ok: false,
      error: {
        code: "cost_kill_switch_active",
        message:
          "API calls are temporarily suspended because the project cost ceiling was exceeded.",
        model: request.model.id,
      },
    };
  }

  const provider = request.model.provider || "openrouter";
  if (provider === "blackbox" && process.env.ENABLE_BLACKBOX_PROVIDER !== "true") {
    return {
      ok: false,
      error: {
        code: "unsupported_provider",
        message: `Provider '${provider}' is disabled by feature flag.`,
        model: request.model.id,
      },
    };
  }

  const adapter = adapters[provider];

  if (!adapter) {
    logger.error(`[Gateway] Unsupported provider requested: ${provider}`, {
      model: request.model.id,
    });
    return {
      ok: false,
      error: {
        code: "unsupported_provider",
        message: `Provider '${provider}' is not supported or not implemented.`,
        model: request.model.id,
      },
    };
  }

  if (!adapter.isConfigured()) {
    return {
      ok: false,
      error: {
        code: "no_api_key",
        message: `API Key for provider '${provider}' is not configured in environment variables.`,
        model: request.model.id,
      },
    };
  }

  return adapter.call(request);
}

/**
 * Circuit-breaker failover: Try each model in the array sequentially.
 * If a model returns rate_limit (429/503) or times out, try the next one.
 * Works seamlessly across different providers (e.g. OpenRouter -> Cohere -> HuggingFace).
 */
export async function callWithFailover(
  request: Omit<GatewayRequest, "model">,
  models: readonly GatewayModel[],
): Promise<GatewayResult & { attemptedModels: string[] }> {
  const attemptedModels: string[] = [];
  let lastError: GatewayError | null = null;

  for (const model of models) {
    const modelKey = `${model.provider}:${model.id}`;
    attemptedModels.push(modelKey);

    const result = await callModel({ ...request, model });

    if (result.ok) {
      logger.info("[Gateway] Failover success", {
        model: modelKey,
        attemptedModels,
        latencyMs: result.data.latencyMs,
      });
      return { ...result, attemptedModels };
    }

    lastError = result.error;

    if (result.error.code === "rate_limit" || result.error.code === "timeout") {
      logger.warn("[Gateway] Failover cycling to next model", {
        failedModel: modelKey,
        reason: result.error.code,
        attemptedModels,
      });
      continue;
    }

    if (result.error.code === "no_api_key") {
      logger.warn("[Gateway] Failover cycling due to missing credentials", {
        failedModel: modelKey,
        reason: "no_api_key",
        attemptedModels,
      });
      continue; // Skip models where API keys are missing and proceed to fallback
    }

    logger.warn("[Gateway] Non-retryable error, cycling to next fallback model", {
      failedModel: modelKey,
      reason: result.error.code,
      attemptedModels,
    });
  }

  logger.error("[Gateway] All failover models exhausted across all providers", {
    attemptedModels,
    lastError: lastError?.message,
  });

  return {
    ok: false,
    error: lastError ?? {
      code: "api_error",
      message: "All models in failover chain failed.",
      model: "failover",
    },
    attemptedModels,
  };
}

export function isGatewayConfigured(): boolean {
  // If at least one provider is configured, the gateway is functional.
  return Object.values(adapters).some((adapter) => adapter.isConfigured());
}
