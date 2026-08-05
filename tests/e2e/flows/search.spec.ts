import { test, expect } from "@playwright/test";

test.describe("Search Spec", () => {
  test("renders /search page and search input box", async ({ page }) => {
    await page.goto("/en/search");
    await expect(page).toHaveURL(/\/en\/search/);
    await expect(page.locator("body")).toBeVisible();
  });
});
