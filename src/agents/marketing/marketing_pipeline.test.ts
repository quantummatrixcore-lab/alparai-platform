import { describe, it, expect } from "vitest";
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

  it("SocialPublisher should handle publishing without errors", async () => {
    const publisher = new SocialPublisher();

    // We expect this not to throw
    await expect(
      publisher.publish("https://test.com/video.mp4", "Test caption", ["TestPlatform"]),
    ).resolves.toBeUndefined();
  });
});
