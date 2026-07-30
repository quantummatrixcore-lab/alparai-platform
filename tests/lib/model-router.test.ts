import { describe, it, expect } from "vitest";
import "../helpers/setup";
import { selectModelTier } from "@/lib/audit/model-router";

describe("selectModelTier router", () => {
  it("returns none tier and empty chains when auditTier is none", () => {
    const res = selectModelTier({
      title: "Short Title",
      description: "Short Description",
      severity: "low",
      auditTier: "none",
    });

    expect(res.tier).toBe("none");
    expect(res.slot1Chain).toEqual([]);
    expect(res.slot2Chain).toEqual([]);
    expect(res.supremeChain).toEqual([]);
  });

  it("routes to basic tier for short descriptions and low/medium severity", () => {
    const res = selectModelTier({
      title: "Short Title",
      description: "A very short description that is less than 1200 characters.",
      severity: "low",
      auditTier: "basic",
    });

    expect(res.tier).toBe("basic");
    expect(res.slot1Chain[0]?.provider).toBe("nvidia");
    expect(res.slot2Chain[0]?.provider).toBe("nvidia");
    expect(res.supremeChain[0]?.provider).toBe("openrouter");
  });

  it("routes to deep tier if auditTier is explicitly forced to deep", () => {
    const res = selectModelTier({
      title: "Short Title",
      description: "A very short description that is less than 1200 characters.",
      severity: "low",
      auditTier: "deep",
    });

    expect(res.tier).toBe("deep");
    expect(res.slot1Chain[0]?.id).toBe("openai/gpt-4o");
    expect(res.slot2Chain[0]?.id).toBe("openai/gpt-4o");
    expect(res.supremeChain[0]?.id).toBe("openai/gpt-4o");
  });

  it("routes to deep tier for long descriptions even if severity is low", () => {
    const longDesc = "A".repeat(1200);
    const res = selectModelTier({
      title: "Short Title",
      description: longDesc,
      severity: "low",
      auditTier: "basic",
    });

    expect(res.tier).toBe("deep");
    expect(res.slot1Chain[0]?.id).toBe("openai/gpt-4o");
  });

  it("routes to deep tier for critical severity even if description is short", () => {
    const res = selectModelTier({
      title: "Short Title",
      description: "Short Description",
      severity: "critical",
      auditTier: "basic",
    });

    expect(res.tier).toBe("deep");
    expect(res.slot1Chain[0]?.id).toBe("openai/gpt-4o");
  });

  it("routes to deep tier for high severity even if description is short", () => {
    const res = selectModelTier({
      title: "Short Title",
      description: "Short Description",
      severity: "high",
      auditTier: "basic",
    });

    expect(res.tier).toBe("deep");
    expect(res.slot1Chain[0]?.id).toBe("openai/gpt-4o");
  });
});
