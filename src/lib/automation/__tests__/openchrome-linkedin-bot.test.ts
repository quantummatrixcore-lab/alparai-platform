import { describe, expect, it } from "vitest";
import { type LinkedInOutreachContact, runLinkedInOutreachBot } from "../openchrome-linkedin-bot";

describe("openchrome-linkedin-bot", () => {
  const sampleContacts: LinkedInOutreachContact[] = [
    {
      id: "1",
      fullName: "Yann LeCun",
      title: "VP & Chief AI Scientist, Meta",
      profileUrl: "https://www.linkedin.com/in/yann-lecun",
      messageTemplate: "Hi Yann, love to connect!",
      status: "to_add",
    },
    {
      id: "2",
      fullName: "Demis Hassabis",
      title: "CEO, Google DeepMind",
      profileUrl: "https://www.linkedin.com/in/demishassabis",
      status: "skipped",
    },
  ];

  it("runs gracefully in dry-run mode when CDP endpoint is unreachable", async () => {
    const result = await runLinkedInOutreachBot(sampleContacts, "http://127.0.0.1:99999");

    expect(result.processedCount).toBe(2);
    expect(result.navigatedCount).toBe(0);
    expect(result.connectedCount).toBe(0);
    expect(result.messageSentCount).toBe(0);
    expect(result.skippedCount).toBe(2);
    expect(result.logs.some((l) => l.includes("CDP port http://127.0.0.1:99999 unavailable"))).toBe(
      true,
    );
  });
});
