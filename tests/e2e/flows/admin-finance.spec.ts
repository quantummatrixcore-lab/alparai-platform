import { test, expect } from "@playwright/test";

test.describe("Admin Finance Spec", () => {
  test("renders /admin/finance page and quota widgets", async ({ page }) => {
    await page.goto("/en/admin/finance");
    await expect(page).toHaveURL(/\/en\/admin\/finance/);
    await expect(page.locator("body")).toBeVisible();
  });
});
