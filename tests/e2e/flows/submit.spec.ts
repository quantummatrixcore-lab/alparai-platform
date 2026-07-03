import { test, expect } from "@playwright/test";

test.describe("Submit Flow", () => {
  test("should extract url correctly", async ({ request }) => {
    // API Route test
    const response = await request.post("/api/v1/extract", {
      data: { url: "https://chatgpt.com/share/test-id" },
    });
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.providerId).toBe("provider-openai");
    expect(data.providerName).toBe("ChatGPT");
  });
});
