import { describe, it, expect, beforeEach } from "vitest";
import { ContentStrategist } from "./content_strategist";
import { FlowGenerator } from "./flow_generator";
import { SocialPublisher } from "./social_publisher";

describe("Autonomous Marketing Pipeline", () => {
  it("Strategist should generate a valid content plan", async () => {
    const strategist = new ContentStrategist({});
    const plan = await strategist.generateContentPlan(["Test commit"]);

    expect(plan).toHaveProperty("topic");
    expect(plan).toHaveProperty("videoPrompt");
  });

  it("FlowGenerator should return a video URL", async () => {
    const flowGen = new FlowGenerator("test-project");
    const url = await flowGen.generateVideo("Test prompt");

    expect(url).toContain(".mp4");
    expect(url).toContain("https://storage.googleapis.com");
  });

  it("SocialPublisher should return PublishResult array", async () => {
    const publisher = new SocialPublisher();
    const results = await publisher.publish("https://test.com/video.mp4", "Test caption", [
      "TestPlatform",
    ]);

    expect(Array.isArray(results)).toBe(true);
    expect(results[0]).toHaveProperty("platform");
    expect(results[0]).toHaveProperty("success");
  });
});

describe("SocialPublisher — Kill Switch (Madde 90)", () => {
  const ORIGINAL_KILL_SWITCH = process.env.MARKETING_KILL_SWITCH;

  beforeEach(() => {
    process.env.MARKETING_KILL_SWITCH = ORIGINAL_KILL_SWITCH;
  });

  it("should block all external API calls when kill switch is active", async () => {
    process.env.MARKETING_KILL_SWITCH = "true";
    const publisher = new SocialPublisher();
    const results = await publisher.publish("https://test.com/video.mp4", "Test caption", [
      "linkedin",
      "x",
      "tiktok",
    ]);

    expect(results).toHaveLength(3);
    for (const r of results) {
      expect(r.success).toBe(true);
      expect(r.postUrl).toContain("kill-switch");
    }
  });

  it("should allow normal publish when kill switch is off", async () => {
    delete process.env.MARKETING_KILL_SWITCH;
    const publisher = new SocialPublisher();
    const results = await publisher.publish("https://test.com/video.mp4", "Test caption", [
      "unknown-platform",
    ]);

    expect(results).toHaveLength(1);
    expect(results[0].success).toBe(true);
    expect(results[0].postUrl).toContain("simulated");
  });
});
