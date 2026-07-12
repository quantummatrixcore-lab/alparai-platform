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
  supremeChain: ModelChainItem[];
}

export function selectModelTier(params: {
  title: string;
  description: string;
  severity: string;
  auditTier?: ModelTier;
}): ModelRouterResult {
  const auditTier = params.auditTier || "basic";
  const length = (params.title || "").length + (params.description || "").length;
  const isShort = length < 1200;
  const isHighRisk = params.severity === "critical" || params.severity === "high";

  // If none, return empty chains
  if (auditTier === "none") {
    return {
      tier: "none",
      slot1Chain: [],
      slot2Chain: [],
      supremeChain: [],
    };
  }

  // Force deep or dynamically determine based on length and severity
  const useDeep = auditTier === "deep" || !isShort || isHighRisk;

  if (!useDeep) {
    return {
      tier: "basic",
      slot1Chain: [{ id: "gemini-1.5-flash", provider: "google", tier: "free", maxTokens: 2048 }],
      slot2Chain: [{ id: "gemini-1.5-flash", provider: "google", tier: "free", maxTokens: 2048 }],
      supremeChain: [
        { id: "openai/gpt-4o-mini", provider: "openrouter", tier: "free", maxTokens: 2048 },
        { id: "gemini-1.5-flash", provider: "google", tier: "free", maxTokens: 2048 },
      ],
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
    ],
    slot2Chain: [
      {
        id: "anthropic/claude-3.5-sonnet",
        provider: "openrouter",
        tier: "premium",
        maxTokens: 4096,
      },
      { id: "gemini-1.5-pro", provider: "google", tier: "premium", maxTokens: 4096 },
    ],
    supremeChain: [
      {
        id: "anthropic/claude-3.5-sonnet",
        provider: "openrouter",
        tier: "premium",
        maxTokens: 4096,
      },
      { id: "gemini-1.5-pro", provider: "google", tier: "premium", maxTokens: 4096 },
    ],
  };
}
