import { describe, it, expect, vi, beforeEach } from "vitest";
import "../helpers/setup";

vi.hoisted(() => {
  vi.doMock("openai", () => ({
    default: vi.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: vi.fn(),
        },
      },
    })),
  }));
});

import OpenAI from "openai";
import { runLiveSystemAnalysis } from "@/actions/admin/live-analysis";

describe("Live System Analysis", () => {
  let mockCompletionsCreate: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("OPENAI_API_KEY", "");
    mockCompletionsCreate = vi.fn();
    vi.mocked(OpenAI).mockImplementation(
      () =>
        ({
          chat: { completions: { create: mockCompletionsCreate } },
        }) as unknown as OpenAI,
    );
  });

  it("returns error when OPENAI_API_KEY is missing", async () => {
    vi.stubEnv("OPENAI_API_KEY", "");

    const result = await runLiveSystemAnalysis();

    expect(result.success).toBe(false);
    expect(result.error).toContain("OPENAI_API_KEY");
  });

  it("returns success with parsed data when API call works", async () => {
    vi.stubEnv("OPENAI_API_KEY", "sk-test");
    mockCompletionsCreate.mockResolvedValue({
      choices: [
        {
          message: {
            content: JSON.stringify({
              overall_score: 85,
              executive_summary: "System healthy",
              security_flaws: ["No rate limiting on API"],
              recommendations: ["Add rate limiting"],
            }),
          },
        },
      ],
    });

    const result = await runLiveSystemAnalysis();

    expect(result.success).toBe(true);
    expect(result.data.overall_score).toBe(85);
  });

  it("returns error when API call throws", async () => {
    vi.stubEnv("OPENAI_API_KEY", "sk-test");
    mockCompletionsCreate.mockRejectedValue(new Error("API timeout"));

    const result = await runLiveSystemAnalysis();

    expect(result.success).toBe(false);
    expect(result.error).toBe("API timeout");
  });
});
