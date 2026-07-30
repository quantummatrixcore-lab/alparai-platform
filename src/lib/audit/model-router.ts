import { createAdminClient } from "@/lib/supabase/admin";
import { logger } from "@/lib/utils/logger";
import {
  MATH_LOGIC_CHAIN as FALLBACK_MATH_LOGIC,
  CREATIVE_COPY_CHAIN as FALLBACK_CREATIVE_COPY,
  RISK_AUDIT_CHAIN as FALLBACK_RISK_AUDIT,
  FAST_TRIAGE_CHAIN as FALLBACK_FAST_TRIAGE,
} from "../ai/openrouter-gateway";

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

/**
 * Capability-based single chain selector for specific tasks (Now Dynamic from DB)
 */
export async function selectModelByCapability(domain: TaskDomain): Promise<ModelChainItem[]> {
  try {
    const supabase = createAdminClient();

    // @ts-expect-error table not in types
    const { data, error } = await supabase
      .from("ai_routing_chains")
      .select("models")
      .eq("domain_name", domain)
      .single();

    if (
      error ||
      !data ||
      typeof data !== "object" ||
      !("models" in data) ||
      !Array.isArray(data.models) ||
      data.models.length === 0
    ) {
      return getFallbackChain(domain);
    }

    return data.models as ModelChainItem[];
  } catch (err) {
    logger.error("[ModelRouter] Error fetching dynamic routing chain, falling back", {
      error: err,
    });
    return getFallbackChain(domain);
  }
}

function getFallbackChain(domain: TaskDomain): ModelChainItem[] {
  switch (domain) {
    case "math_logic":
      return [...FALLBACK_MATH_LOGIC];
    case "creative_copy":
      return [...FALLBACK_CREATIVE_COPY];
    case "risk_audit":
      return [...FALLBACK_RISK_AUDIT];
    case "fast_triage":
      return [...FALLBACK_FAST_TRIAGE];
    default:
      return [...FALLBACK_FAST_TRIAGE];
  }
}

/**
 * Multi-slot cross-audit selector (Legacy/Triage compatibility)
 */
export async function selectModelTier(params: {
  title: string;
  description: string;
  severity: string;
  severityScore?: number;
  auditTier?: ModelTier;
}): Promise<ModelRouterResult> {
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
      slot1Chain: await selectModelByCapability("fast_triage"),
      slot2Chain: await selectModelByCapability("creative_copy"),
      slot3Chain: await selectModelByCapability("math_logic"),
      supremeChain: await selectModelByCapability("risk_audit"),
    };
  }

  // For DEEP tier, we rely heavily on the Risk Audit (Premium) chain
  const riskAuditChain = await selectModelByCapability("risk_audit");
  return {
    tier: "deep",
    slot1Chain: [...riskAuditChain],
    slot2Chain: [...riskAuditChain],
    slot3Chain: [...riskAuditChain],
    supremeChain: [...riskAuditChain],
  };
}
