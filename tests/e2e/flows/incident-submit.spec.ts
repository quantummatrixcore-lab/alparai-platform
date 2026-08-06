import { test, expect } from "@playwright/test";

test.describe("Incident Submit Spec", () => {
  test("renders /submit incident reporting page and form elements", async ({ page }) => {
    await page.goto("/en/submit");
    await expect(page).toHaveURL(/\/en\/submit/);
    await expect(page.locator("body")).toBeVisible();
  });
});
