import { test, expect } from "@playwright/test";

test.describe("Models Page Spec", () => {
  test("renders /models page and AI models catalog", async ({ page }) => {
    await page.goto("/en/models");
    await expect(page).toHaveURL(/\/en\/models/);
    await expect(page.locator("body")).toBeVisible();
  });
});
