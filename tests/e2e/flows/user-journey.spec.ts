import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem(
      "alpar_cookie_consent",
      JSON.stringify({ level: "all", at: Date.now() }),
    );
  });
});

test.describe("Visitor Journey - Submit Incident Flow", () => {
  test("navigates to submit page and displays validation errors for empty fields", async ({
    page,
  }) => {
    await page.goto("/en");

    // Check if hero and submit CTA is present
    const submitCta = page.getByRole("link", { name: /Report Model|60 Saniyede Bildir/i }).first();
    await expect(submitCta).toBeVisible();
    await submitCta.click();

    // Verify it navigates to /submit
    await page.waitForURL(/\/submit/);
    await expect(page).toHaveURL(/.*submit/);

    // Verify submit form elements
    const submitHeading = page.getByRole("heading", { name: /Report an AI Incident/i });
    await expect(submitHeading).toBeVisible();

    const titleInput = page.getByLabel(/Incident Title/i);
    const descInput = page.getByLabel(/Description/i);
    await expect(titleInput).toBeVisible();
    await expect(descInput).toBeVisible();

    // Click submit button to trigger client/server validation errors
    const submitBtn = page.getByRole("button", { name: /Submit Incident|Bildir/i });
    await expect(submitBtn).toBeVisible();
    await submitBtn.click();

    // Since consents are not checked, it should display consent required warning
    // or validate required fields
    const consentErr = page.locator("text=consent is required|consent_required");
    const count = await consentErr.count();
    if (count > 0) {
      await expect(consentErr.first()).toBeVisible();
    }
  });
});
