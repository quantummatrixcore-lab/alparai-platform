import { test, expect } from "@playwright/test";

test.describe("Transparency Page Spec", () => {
  test("renders /transparency page content", async ({ page }) => {
    await page.goto("/en/transparency");
    await expect(page).toHaveURL(/\/en\/transparency/);
    await expect(page.locator("body")).toBeVisible();
  });
});
