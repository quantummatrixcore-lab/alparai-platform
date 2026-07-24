import { describe, it, expect, vi, beforeEach } from "vitest";
import "../helpers/setup";

vi.hoisted(() => {
  vi.doMock("openai", () => ({
    default: vi.fn(),
  }));
});

import OpenAI from "openai";
import { runLiveStrategyAnalysis } from "@/actions/admin/live-strategy";

const MOCK_CONTEXT = {
  strengths: 8,
  weaknesses: 5,
  opportunities: 12,
  threats: 4,
  highRisks: 3,
  activeRisks: 7,
  doneMilestones: 24,
  totalMilestones: 50,
};

describe("Live Strategy Analysis", () => {
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

    const result = await runLiveStrategyAnalysis(MOCK_CONTEXT);

    expect(result.success).toBe(false);
    expect(result.error).toContain("OPENAI_API_KEY");
  });

  it("returns success with strategic analysis data", async () => {
    vi.stubEnv("OPENAI_API_KEY", "sk-test");
    mockCreate.mockResolvedValue({
      choices: [
        {
          message: {
            content: JSON.stringify({
              health_score: 72,
              executive_summary: "Good progress but risk exposure high",
              strategic_gaps: ["Monetization missing", "PITR not configured"],
              recommendations: ["Activate Stripe Pro tier", "Upgrade Supabase to Pro"],
            }),
          },
        },
      ],
    });

    const result = await runLiveStrategyAnalysis(MOCK_CONTEXT);

    expect(result.success).toBe(true);
    expect(result.data.health_score).toBe(72);
    expect(result.data.recommendations).toHaveLength(2);
  });

  it("returns error when API call throws", async () => {
    vi.stubEnv("OPENAI_API_KEY", "sk-test");
    mockCreate.mockRejectedValue(new Error("Rate limit exceeded"));

    const result = await runLiveStrategyAnalysis(MOCK_CONTEXT);

    expect(result.success).toBe(false);
  });
});
