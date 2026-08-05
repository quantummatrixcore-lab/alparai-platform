import { test, expect } from "@playwright/test";

test.describe("Auth Flow Spec", () => {
  test("renders signin page and verifies Google auth button is visible", async ({ page }) => {
    await page.goto("/en/auth/signin");
    await expect(page).toHaveURL(/\/en\/auth\/signin/);
    const googleBtn = page.getByRole("button", { name: /google/i }).first();
    await expect(googleBtn).toBeVisible();
  });
});
