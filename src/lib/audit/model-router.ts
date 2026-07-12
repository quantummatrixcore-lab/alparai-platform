export type ModelTier = "basic" | "deep" | "none";

export interface ModelChainItem {
  id: string;
  provider: string;
  tier: "free" | "premium";
  maxTokens: number;
}

export interface ModelRouterResult {
  tier: ModelTier;
  slot1Chain: ModelChainItem[];
  slot2Chain: ModelChainItem[];
  slot3Chain: ModelChainItem[];
  supremeChain: ModelChainItem[];
}

const BASIC_CHAIN: ModelChainItem[] = [
  { id: "command-r", provider: "cohere", tier: "free", maxTokens: 2048 },
  { id: "google/gemma-2-27b-it", provider: "nvidia", tier: "free", maxTokens: 2048 },
];

const BASIC_SUPREME: ModelChainItem[] = [
  { id: "command-r", provider: "cohere", tier: "free", maxTokens: 2048 },
  { id: "google/gemma-2-27b-it", provider: "nvidia", tier: "free", maxTokens: 2048 },
  { id: "openai/gpt-4o-mini", provider: "openrouter", tier: "free", maxTokens: 2048 },
];

export function selectModelTier(params: {
  title: string;
  description: string;
  severity: string;
  severityScore?: number;
  auditTier?: ModelTier;
}): ModelRouterResult {
  const auditTier = params.auditTier || "basic";

  if (auditTier === "none") {
    return { tier: "none", slot1Chain: [], slot2Chain: [], slot3Chain: [], supremeChain: [] };
  }

  const length = (params.title || "").length + (params.description || "").length;
  const isShort = length < 1200;
  const isHighRisk = params.severity === "critical" || params.severity === "high";

  const useDeep = auditTier === "deep" || !isShort || isHighRisk;

  if (!useDeep) {
    return {
      tier: "basic",
      slot1Chain: BASIC_CHAIN,
      slot2Chain: BASIC_CHAIN,
      slot3Chain: BASIC_CHAIN,
      supremeChain: BASIC_SUPREME,
    };
  }

  return {
    tier: "deep",
    slot1Chain: [
      {
        id: "anthropic/claude-3.5-sonnet",
        provider: "openrouter",
        tier: "premium",
        maxTokens: 4096,
      },
      { id: "gemini-1.5-pro", provider: "google", tier: "premium", maxTokens: 4096 },
      { id: "meta/llama-3.1-70b-instruct", provider: "nvidia", tier: "premium", maxTokens: 4096 },
    ],
    slot2Chain: [
      {
        id: "anthropic/claude-3.5-sonnet",
        provider: "openrouter",
        tier: "premium",
        maxTokens: 4096,
      },
      { id: "gemini-1.5-pro", provider: "google", tier: "premium", maxTokens: 4096 },
      { id: "meta/llama-3.1-70b-instruct", provider: "nvidia", tier: "premium", maxTokens: 4096 },
    ],
    slot3Chain: [
      {
        id: "anthropic/claude-3.5-sonnet",
        provider: "openrouter",
        tier: "premium",
        maxTokens: 4096,
      },
      { id: "gemini-1.5-pro", provider: "google", tier: "premium", maxTokens: 4096 },
      { id: "meta/llama-3.1-70b-instruct", provider: "nvidia", tier: "premium", maxTokens: 4096 },
    ],
    supremeChain: [
      {
        id: "anthropic/claude-3.5-sonnet",
        provider: "openrouter",
        tier: "premium",
        maxTokens: 4096,
      },
      { id: "gemini-1.5-pro", provider: "google", tier: "premium", maxTokens: 4096 },
      { id: "meta/llama-3.1-70b-instruct", provider: "nvidia", tier: "premium", maxTokens: 4096 },
    ],
  };
}
