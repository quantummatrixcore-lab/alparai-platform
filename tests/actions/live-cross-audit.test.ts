import { describe, it, expect, vi, beforeEach } from "vitest";
import "../helpers/setup";

vi.hoisted(() => {
  vi.doMock("openai", () => ({
    default: vi.fn(),
  }));
});

import OpenAI from "openai";
import { runLiveCrossAuditTest } from "@/actions/admin/live-cross-audit";

describe("Live Cross-Audit Test", () => {
  let mockCreate: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("OPENAI_API_KEY", "");
    mockCreate = vi.fn();
    vi.mocked(OpenAI).mockImplementation(
      () =>
        ({
          chat: { completions: { create: mockCreate } },
        }) as unknown as OpenAI,
    );
  });

  it("returns error when OPENAI_API_KEY is missing", async () => {
    vi.stubEnv("OPENAI_API_KEY", "");

    const result = await runLiveCrossAuditTest("test incident");

    expect(result.success).toBe(false);
    expect(result.error).toContain("OPENAI_API_KEY");
  });

  it("returns success with model stances and judge verdict", async () => {
    vi.stubEnv("OPENAI_API_KEY", "sk-test");
    mockCreate.mockResolvedValue({
      choices: [
        {
          message: {
            content: JSON.stringify({
              models: [
                { name: "GPT-4o", stance: "Destekliyor", reason: "Credible" },
                { name: "Claude 3.5 Sonnet", stance: "Şüpheli", reason: "Missing evidence" },
                { name: "Mistral Large", stance: "Destekliyor", reason: "Matches pattern" },
              ],
              judge_verdict: "Majority supports — credible incident",
              truth_score: 78,
              risk_level: "High Risk",
            }),
          },
        },
      ],
    });

    const result = await runLiveCrossAuditTest("test incident");

    expect(result.success).toBe(true);
    expect(result.data.models).toHaveLength(3);
    expect(result.data.truth_score).toBe(78);
  });

  it("returns error when API call throws", async () => {
    vi.stubEnv("OPENAI_API_KEY", "sk-test");
    mockCreate.mockRejectedValue(new Error("Network error"));

    const result = await runLiveCrossAuditTest("test");

    expect(result.success).toBe(false);
  });
});
