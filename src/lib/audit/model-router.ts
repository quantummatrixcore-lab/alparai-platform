export type ModelTier = "basic" | "deep" | "none";
export type TaskDomain = "math_logic" | "creative_copy" | "risk_audit" | "fast_triage";

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

// Ensure these match the definitions in openrouter-gateway.ts exactly (or import them if possible, but keeping them here for decoupling if preferred. Actually, let's import them from openrouter-gateway).
import {
  MATH_LOGIC_CHAIN,
  CREATIVE_COPY_CHAIN,
  RISK_AUDIT_CHAIN,
  FAST_TRIAGE_CHAIN,
} from "../ai/openrouter-gateway";

/**
 * Capability-based single chain selector for specific tasks
 */
export function selectModelByCapability(domain: TaskDomain): readonly ModelChainItem[] {
  switch (domain) {
    case "math_logic":
      return MATH_LOGIC_CHAIN;
    case "creative_copy":
      return CREATIVE_COPY_CHAIN;
    case "risk_audit":
      return RISK_AUDIT_CHAIN;
    case "fast_triage":
      return FAST_TRIAGE_CHAIN;
    default:
      return FAST_TRIAGE_CHAIN;
  }
}

/**
 * Multi-slot cross-audit selector (Legacy/Triage compatibility)
 */
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
    // For BASIC tier, we leverage different capabilities for a diverse cross-audit
    return {
      tier: "basic",
      slot1Chain: [...FAST_TRIAGE_CHAIN],
      slot2Chain: [...CREATIVE_COPY_CHAIN],
      slot3Chain: [...MATH_LOGIC_CHAIN],
      supremeChain: [...RISK_AUDIT_CHAIN],
    };
  }

  // For DEEP tier, we rely heavily on the Risk Audit (Premium) chain
  return {
    tier: "deep",
    slot1Chain: [...RISK_AUDIT_CHAIN],
    slot2Chain: [...RISK_AUDIT_CHAIN],
    slot3Chain: [...RISK_AUDIT_CHAIN],
    supremeChain: [...RISK_AUDIT_CHAIN],
  };
}
