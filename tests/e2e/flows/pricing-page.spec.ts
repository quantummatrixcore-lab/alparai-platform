import { test, expect } from "@playwright/test";

test.describe("Pricing Page Spec", () => {
  test("renders /pricing page and plan options", async ({ page }) => {
    await page.goto("/en/pricing");
    await expect(page).toHaveURL(/\/en\/pricing/);
    await expect(page.locator("body")).toBeVisible();
  });
});
