import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem(
      "alpar_cookie_consent",
      JSON.stringify({ level: "all", at: Date.now() }),
    );
  });
});

test.describe("Admin Panel Journey - Security Gates", () => {
  test("unauthenticated access to /admin redirects to signin page", async ({ page }) => {
    await page.goto("/en/admin");
    await page.waitForURL(/\/auth\/signin/);
    await expect(page).toHaveURL(/.*signin\?next=.*/);

    // Check if signin page renders Google button
    await expect(page.getByRole("button", { name: /continue with google/i })).toBeVisible();
  });

  test("unauthenticated access to /admin/autopilot/analytics redirects to signin page", async ({
    page,
  }) => {
    await page.goto("/en/admin/autopilot/analytics");
    await page.waitForURL(/\/auth\/signin/);
    await expect(page).toHaveURL(/.*signin\?next=.*/);
  });
});
