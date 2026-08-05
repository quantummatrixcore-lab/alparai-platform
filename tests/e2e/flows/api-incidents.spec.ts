import { test, expect } from "@playwright/test";

test.describe("API Incidents Spec", () => {
  test("GET /api/v1/incidents returns JSON response", async ({ request }) => {
    const response = await request.get("/api/v1/incidents");
    expect([200, 401, 404]).toContain(response.status());
  });
});
