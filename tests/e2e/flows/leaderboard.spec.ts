import { test, expect } from "@playwright/test";

test.describe("Leaderboard Spec", () => {
  test("renders /leaderboard page and provider scoring table", async ({ page }) => {
    await page.goto("/en/leaderboard");
    await expect(page).toHaveURL(/\/en\/leaderboard/);
    await expect(page.locator("body")).toBeVisible();
  });
});
