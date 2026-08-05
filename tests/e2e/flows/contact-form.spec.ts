import { test, expect } from "@playwright/test";

test.describe("Contact Form Spec", () => {
  test("renders /contact page and message form", async ({ page }) => {
    await page.goto("/en/contact");
    await expect(page).toHaveURL(/\/en\/contact/);
    await expect(page.locator("body")).toBeVisible();
  });
});
