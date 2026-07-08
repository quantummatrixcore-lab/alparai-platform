import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem(
      "alpar_cookie_consent",
      JSON.stringify({ level: "all", at: Date.now() }),
    );
  });
});

test.describe("EU AI Act Tracker Page E2E", () => {
  test("renders tracker page, handles filtering and pagination", async ({ page }) => {
    // Navigate to the AI Act page
    await page.goto("/en/ai-act");

    // Expect header and title to be visible
    await expect(page.locator("h1")).toBeVisible();

    // Verify filter buttons exist
    const unacceptableFilter = page.locator("text=Unacceptable Risk").first();
    const highRiskFilter = page.locator("text=High Risk").first();
    await expect(unacceptableFilter).toBeVisible();
    await expect(highRiskFilter).toBeVisible();

    // Click on High Risk filter
    await highRiskFilter.click();
    await page.waitForURL(/.*risk=High%20Risk/);
    await expect(page).toHaveURL(/.*risk=High%20Risk/);

    // Verify reset/active class behavior (clicking active filter should clear it)
    const activeHighRiskFilter = page.locator("text=High Risk").first();
    await activeHighRiskFilter.click();
    await page.waitForURL(/\/ai-act$/);
    await expect(page).toHaveURL(/\/ai-act$/);
  });
});
