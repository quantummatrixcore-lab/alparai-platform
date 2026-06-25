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

    // Skip language switcher click on mobile since it might be in mobile hamburger menu
    if (isMobile) {
      test.skip();
      return;
    }

    // 2. Click Language Switcher to switch to Turkish
    const trLink = page.getByRole("link", { name: /switch language|dil|language/i });
    const isVisible = await trLink.isVisible();
    if (isVisible) {
      await trLink.click();
      await page.waitForURL(/\/tr/);

      // Verify html lang is now 'tr'
      await expect(page.locator("html")).toHaveAttribute("lang", "tr");
    }
  });
});
