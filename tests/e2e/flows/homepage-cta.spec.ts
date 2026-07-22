import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem(
      "alpar_cookie_consent",
      JSON.stringify({ level: "all", at: Date.now() }),
    );
  });
});

test.describe("Homepage Submit CTA", () => {
  test("shows live submit CTA banner above the fold on EN homepage", async ({ page }) => {
    await page.goto("/en");
    await page.waitForLoadState("domcontentloaded");

    const ctaLink = page.locator("a[href='/submit']").first();
    await expect(ctaLink).toBeVisible({ timeout: 10000 });

    await expect(ctaLink).toContainText(/report an incident/i);
  });

  test("shows live submit CTA banner above the fold on TR homepage", async ({ page }) => {
    await page.goto("/tr");
    await page.waitForLoadState("domcontentloaded");

    const ctaLink = page.locator("a[href='/submit']").first();
    await expect(ctaLink).toBeVisible({ timeout: 10000 });

    await expect(ctaLink).toContainText(/olay bildir/i);
  });

  test("clicking CTA navigates to /submit page", async ({ page }) => {
    await page.goto("/en");
    await page.waitForLoadState("domcontentloaded");

    const ctaLink = page.locator("a[href='/submit']").first();
    await ctaLink.click();

    await page.waitForURL(/\/submit/, { timeout: 10000 });
    await expect(page).toHaveURL(/\/submit/);
  });

  test("shows LIVE NOW badge on CTA banner", async ({ page }) => {
    await page.goto("/en");
    await page.waitForLoadState("domcontentloaded");

    const liveBadge = page.locator("text=/LIVE NOW|CANLI YAYINDA/i").first();
    await expect(liveBadge).toBeVisible({ timeout: 10000 });
  });
});
