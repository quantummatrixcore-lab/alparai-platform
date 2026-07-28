import { describe, it, expect, vi, beforeEach } from "vitest";
import "../helpers/setup";

vi.mock("@/lib/ai/openrouter-gateway", () => ({
  callWithFailover: vi.fn(),
  TRIAGE_SLOT_1_CHAIN: ["google/gemini-1.5-flash"],
}));

import { callWithFailover } from "@/lib/ai/openrouter-gateway";
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
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns fallback data when gateway returns error", async () => {
    vi.mocked(callWithFailover).mockResolvedValue({
      ok: false,
      error: "Gateway connection error",
      provider: "google",
      model: "gemini-1.5-flash",
    });

    const result = await runLiveStrategyAnalysis(MOCK_CONTEXT);

    expect(result.success).toBe(true);
    expect(result.data?.executive_summary).toContain(
      "Gateway hatası nedeniyle varsayılan güvenli rapor.",
    );
  });

  it("returns success with strategic analysis data", async () => {
    vi.mocked(callWithFailover).mockResolvedValue({
      ok: true,
      data: {
        content: JSON.stringify({
          health_score: 72,
          executive_summary: "Good progress but risk exposure high",
          strategic_gaps: ["Monetization missing", "PITR not configured"],
          recommendations: ["Activate Stripe Pro tier", "Upgrade Supabase to Pro"],
        }),
      },
      provider: "google",
      model: "gemini-1.5-flash",
    });

    const result = await runLiveStrategyAnalysis(MOCK_CONTEXT);

    expect(result.success).toBe(true);
    expect(result.data?.health_score).toBe(72);
    expect(result.data?.recommendations).toHaveLength(2);
  });
});
