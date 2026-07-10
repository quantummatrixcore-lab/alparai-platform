import { test, expect } from "@playwright/test";

const PAGES = [
  "/en",
  "/en/incidents",
  "/en/submit",
  "/en/ai-act",
  "/en/transparency",
  "/en/leaderboard",
  "/en/academy",
  "/en/blog",
  "/en/unsubscribe"
];

test.describe("Mobile Layout Responsiveness", () => {
  test.beforeEach(async ({ page }) => {
    // Pre-inject cookie consent to avoid banner cluttering layout
    await page.addInitScript(() => {
      window.localStorage.setItem(
        "alpar_cookie_consent",
        JSON.stringify({ level: "all", at: Date.now() })
      );
    });
  });

  for (const path of PAGES) {
    test(`page ${path} has no horizontal overflow on mobile`, async ({ page, isMobile }) => {
      if (!isMobile) {
        test.skip();
        return;
      }

      await page.goto(path);
      await page.waitForLoadState("networkidle");

      // Verify no horizontal overflow
      const overflow = await page.evaluate(() => {
        const scrollWidth = document.documentElement.scrollWidth;
        const innerWidth = window.innerWidth;
        const bodyScrollWidth = document.body.scrollWidth;
        const bodyWidth = document.body.clientWidth;

        const maxScrollWidth = Math.max(scrollWidth, bodyScrollWidth);
        const maxInnerWidth = Math.max(innerWidth, bodyWidth);

        return {
          scrollWidth: maxScrollWidth,
          innerWidth: maxInnerWidth,
          hasOverflow: maxScrollWidth > maxInnerWidth + 1
        };
      });

      expect(
        overflow.hasOverflow,
        `Page ${path} has horizontal overflow: scrollWidth is ${overflow.scrollWidth}px but innerWidth is ${overflow.innerWidth}px`
      ).toBe(false);
    });
  }
});
