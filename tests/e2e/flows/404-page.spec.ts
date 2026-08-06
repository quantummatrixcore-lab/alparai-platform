import { test, expect } from "@playwright/test";

test.describe("404 Page Spec", () => {
  test("returns 404 for invalid non-existent URL", async ({ page }) => {
    const response = await page.goto("/en/invalid-non-existent-page-xyz");
    expect(response?.status()).toBe(404);
  });
});
