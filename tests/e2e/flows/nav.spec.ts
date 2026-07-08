import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem(
      "alpar_cookie_consent",
      JSON.stringify({ level: "all", at: Date.now() }),
    );
  });
});

test.describe("Navigation Flow E2E", () => {
  test("shows Academy link directly on desktop and in mobile drawer without dropdown", async ({
    page,
    isMobile,
  }) => {
    await page.goto("/en");

    if (isMobile) {
      // On mobile, the desktop nav is hidden, but mobile menu button is present
      const menuBtn = page.getByRole("button", { name: /open menu|menüyü aç/i }).first();
      await expect(menuBtn).toBeVisible();
      await menuBtn.click();

      // Inside mobile menu, the Academy link is visible directly
      const mobileAcademyLink = page.locator("a[href='/en/academy']").first();
      await expect(mobileAcademyLink).toBeVisible();
      await expect(mobileAcademyLink).toHaveText(/Academy/i);
    } else {
      // On desktop, the Academy link should be visible directly in the main header nav
      const desktopAcademyLink = page.locator("nav a[href='/en/academy']").first();
      await expect(desktopAcademyLink).toBeVisible();
      await expect(desktopAcademyLink).toHaveText(/Academy/i);
    }
  });
});
