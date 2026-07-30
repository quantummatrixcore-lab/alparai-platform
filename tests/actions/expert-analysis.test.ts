import { describe, it, expect } from "vitest";
import { runExpertAnalysisAction, EXPERT_PERSONAS } from "@/actions/admin/expert-analysis";

describe("Multi-Perspective Expert Analysis Action", () => {
  it("contains 10 specialized expert personas", () => {
    expect(EXPERT_PERSONAS).toHaveLength(10);
    const ids = EXPERT_PERSONAS.map((p) => p.id);
    expect(ids).toContain("ai-ecosystem-architect");
    expect(ids).toContain("silicon-valley-startup-team");
    expect(ids).toContain("vc-angel-investor");
    expect(ids).toContain("red-team-security");
    expect(ids).toContain("osint-analyst");
    expect(ids).toContain("social-media-viral-strategist");
  });

  it("runs analysis for a specific persona successfully", async () => {
    const report = await runExpertAnalysisAction(
      "vc-angel-investor",
      "Project valuation and burn rate evaluation",
    );
    expect(report).toBeDefined();
    expect(report.expertId).toBe("vc-angel-investor");
    expect(report.expertName).toBe("Venture Capitalist & Angel Investor");
    expect(report.critique).toBeTruthy();
  });

  it("throws error for invalid persona id", async () => {
    await expect(runExpertAnalysisAction("invalid-expert-id")).rejects.toThrow(
      "Invalid expert persona",
    );
  });
});
