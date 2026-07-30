import { describe, it, expect, vi, beforeEach } from "vitest";
import "../helpers/setup";

vi.hoisted(() => {
  vi.doMock("@/lib/ai/openrouter-gateway", async (importOriginal: () => Promise<Record<string, unknown>>) => {
    const actual = await importOriginal();
    return {
      ...actual,
      callWithFailover: vi.fn(),
    };
  });
});

import { callWithFailover } from "@/lib/ai/openrouter-gateway";
import { runLiveCrossAuditTest } from "@/actions/admin/live-cross-audit";

describe("Live Cross-Audit Test", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns fallback data when gateway returns error", async () => {
    vi.mocked(callWithFailover).mockResolvedValue({
      ok: false,
      error: {
        code: "api_error",
        message: "Gateway connection error",
        model: "google/gemini-1.5-flash",
      },
      attemptedModels: ["google/gemini-1.5-flash"],
    });

    const result = await runLiveCrossAuditTest("test incident");

    expect(result.success).toBe(true);
    expect(result.data?.models[0]?.name).toBe("Sistem-Güvenlik-Modu");
  });

  it("returns success with model stances and judge verdict", async () => {
    vi.mocked(callWithFailover).mockResolvedValue({
      ok: true,
      data: {
        content: JSON.stringify({
          models: [
            { name: "GPT-4o", stance: "Destekliyor", reason: "Credible" },
            { name: "Claude 3.5 Sonnet", stance: "Şüpheli", reason: "Unverified" },
          ],
          judge_verdict: "Moderately credible",
          truth_score: 75,
          risk_level: "Minimal",
        }),
        model: "google/gemini-1.5-flash",
        usage: { promptTokens: 10, completionTokens: 10, totalTokens: 20 },
        latencyMs: 100,
      },
      attemptedModels: ["google/gemini-1.5-flash"],
    });

    const result = await runLiveCrossAuditTest("test incident");

    expect(result.success).toBe(true);
    expect(result.data?.truth_score).toBe(75);
    expect(result.data?.models).toHaveLength(2);
  });
});
