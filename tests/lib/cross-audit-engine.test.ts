/* eslint-disable */
import { describe, it, expect, vi, beforeEach } from "vitest";
import "../helpers/setup";

vi.hoisted(() => {
  vi.stubEnv("OPENROUTER_API_KEY", "test-key");
});

vi.mock("@/lib/supabase/admin", () => ({
  createAdminClient: vi.fn(),
}));

vi.mock("@/lib/ai/openrouter-gateway", () => ({
  callModel: vi.fn(),
  callWithFailover: vi.fn(),
  isGatewayConfigured: vi.fn().mockReturnValue(true),
  FREE_TRIAGE_MODELS: [
    { id: "deepseek/deepseek-chat", tier: "free", maxTokens: 2048 },
    { id: "meta-llama/llama-3.3-70b:free", tier: "free", maxTokens: 2048 },
    { id: "qwen/qwen-2.5-72b:free", tier: "free", maxTokens: 2048 },
  ],
  SUPREME_COURT_MODEL: {
    id: "anthropic/claude-3.5-sonnet",
    tier: "premium",
    maxTokens: 4096,
  },
  TRIAGE_SLOT_1_CHAIN: [
    { id: "deepseek/deepseek-chat", provider: "openrouter", tier: "free", maxTokens: 2048 },
  ],
  TRIAGE_SLOT_2_CHAIN: [
    { id: "meta-llama/llama-3.3-70b:free", provider: "openrouter", tier: "free", maxTokens: 2048 },
  ],
  TRIAGE_SLOT_3_CHAIN: [
    { id: "qwen/qwen-2.5-72b:free", provider: "openrouter", tier: "free", maxTokens: 2048 },
  ],
  SUPREME_COURT_CHAIN: [
    { id: "anthropic/claude-3.5-sonnet", provider: "openrouter", tier: "premium", maxTokens: 4096 },
  ],
}));

vi.mock("@/lib/utils/logger", () => ({
  logger: {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

import { callWithFailover } from "@/lib/ai/openrouter-gateway";
import { createAdminClient } from "@/lib/supabase/admin";
import { runCrossAudit } from "@/lib/ai/cross-audit-engine";
import { createMockSupabaseClient } from "../helpers/supabase-mock";

let mockAdminClient: ReturnType<typeof createMockSupabaseClient>;

describe("Cross-Audit Engine", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAdminClient = createMockSupabaseClient();
    vi.mocked(createAdminClient).mockReturnValue(mockAdminClient as never);
  });

  it("should complete the pipeline successfully when gateway models respond correctly", async () => {
    // 1. Mock Database Fetch
    mockAdminClient.from.mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: {
              id: "inc-123",
              title: "AI Medical Hallucination",
              description: "The medical chatbot told me to drink bleach.",
              title_masked: "AI Medical Hallucination",
              description_masked: "The medical chatbot told me to drink bleach.",
              category: "hallucination",
              severity: "critical",
            },
            error: null,
          }),
        }),
      }),
      update: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({
          data: null,
          error: null,
        }),
      }),
    } as any);

    // 2. Mock Triage Layer responses (callWithFailover called 3 times for slots)
    vi.mocked(callWithFailover)
      .mockResolvedValueOnce({
        ok: true,
        data: {
          content: JSON.stringify({
            plausibilityScore: 90,
            categoryAccuracy: 95,
            adversarialRisk: 5,
            summary: "Highly plausible AI hallucination safety concern.",
          }),
          model: "deepseek/deepseek-chat",
          usage: { promptTokens: 100, completionTokens: 50, totalTokens: 150 },
          latencyMs: 120,
        },
        attemptedModels: ["deepseek/deepseek-chat"],
      })
      .mockResolvedValueOnce({
        ok: true,
        data: {
          content: JSON.stringify({
            plausibilityScore: 85,
            categoryAccuracy: 90,
            adversarialRisk: 8,
            summary: "Plausible medical advice failure.",
          }),
          model: "meta-llama/llama-3.3-70b:free",
          usage: { promptTokens: 110, completionTokens: 55, totalTokens: 165 },
          latencyMs: 150,
        },
        attemptedModels: ["meta-llama/llama-3.3-70b:free"],
      })
      .mockResolvedValueOnce({
        ok: true,
        data: {
          content: JSON.stringify({
            plausibilityScore: 88,
            categoryAccuracy: 92,
            adversarialRisk: 4,
            summary: "Validated hallucination description.",
          }),
          model: "qwen/qwen-2.5-72b:free",
          usage: { promptTokens: 105, completionTokens: 52, totalTokens: 157 },
          latencyMs: 130,
        },
        attemptedModels: ["qwen/qwen-2.5-72b:free"],
      });

    // 3. Mock Supreme Court response (callWithFailover called 4th time)
    vi.mocked(callWithFailover).mockResolvedValueOnce({
      ok: true,
      data: {
        content: JSON.stringify({
          truthScore: 88,
          confidence: 0.95,
          reasoning: "Triage agreement is high, clear incident category matches safety issue.",
        }),
        model: "anthropic/claude-3.5-sonnet",
        usage: { promptTokens: 300, completionTokens: 150, totalTokens: 450 },
        latencyMs: 800,
      },
      attemptedModels: ["anthropic/claude-3.5-sonnet"],
    });

    const result = await runCrossAudit("inc-123");

    expect(result).not.toBeNull();
    if (result) {
      expect(result.truthScore).toBe(88);
      expect(result.confidence).toBe(0.95);
      expect(result.supremeCourtModel).toBe("anthropic/claude-3.5-sonnet");
      expect(result.triageModels).toEqual([
        "deepseek/deepseek-chat",
        "meta-llama/llama-3.3-70b:free",
        "qwen/qwen-2.5-72b:free",
      ]);
    }

    // Verify database update was called
    expect(mockAdminClient.from).toHaveBeenCalledWith("incidents");
  });

  it("should abort pipeline and return null if incident does not exist", async () => {
    mockAdminClient.from.mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: null,
            error: { message: "Incident not found" },
          }),
        }),
      }),
    } as any);

    const result = await runCrossAudit("inc-invalid");
    expect(result).toBeNull();
  });
});
