import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem(
      "alpar_cookie_consent",
      JSON.stringify({ level: "all", at: Date.now() }),
    );
  });
});

test.describe("i18n Language & Routing Checks", () => {
  test("switches between English and Turkish languages and displays appropriate translations", async ({
    page,
    isMobile,
  }) => {
    // 1. Visit English page
    await page.goto("/en");
    await page.waitForLoadState("domcontentloaded");

    // Header check
    const headerTitle = page.locator("html");
    await expect(headerTitle).toHaveAttribute("lang", "en");

    if (isMobile) {
      const menuBtn = page.getByRole("button", { name: /open menu|menüyü aç/i }).first();
      await expect(menuBtn).toBeVisible();
      await menuBtn.click();
    }

    // 2. Click Language Switcher to switch to Turkish
    const trButton = isMobile
      ? page.locator("#mobile-nav-panel").getByRole("button", { name: /^TR$/i }).first()
      : page.getByRole("button", { name: /^TR$/i }).first();
    await expect(trButton).toBeVisible();
    await trButton.click();
    await page.waitForURL(/\/tr/);

    // Verify html lang is now 'tr'
    await expect(page.locator("html")).toHaveAttribute("lang", "tr");
  });
});
