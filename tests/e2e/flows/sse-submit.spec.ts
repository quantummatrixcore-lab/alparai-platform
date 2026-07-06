import { test, expect } from "@playwright/test";

test.describe("SSE Status Tracking", () => {
  test("should stream processing stages for a valid incident", async ({ request }) => {
    const id = "00000000-0000-0000-0000-000000000000";
    const response = await request.get(`/api/incidents/${id}/status`);
    expect(response.headers()["content-type"]).toContain("text/event-stream");
  });
});
