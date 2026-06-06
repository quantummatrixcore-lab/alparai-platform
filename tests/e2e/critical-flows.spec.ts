/**
 * Playwright E2E tests for the critical user flows.
 * Run with: pnpm test:e2e
 */
import { test, expect } from "@playwright/test";

test.describe("Home page", () => {
  test("renders hero, live feed, and leaderboard", async ({ page }) => {
    await page.goto("/en");
    await expect(page).toHaveTitle(/ALPAR AI/);
    await expect(page.getByRole("heading", { name: /hold ai accountable/i })).toBeVisible();
    await expect(page.getByText(/live feed/i)).toBeVisible();
    await expect(page.getByRole("link", { name: /leaderboard/i }).first()).toBeVisible();
  });

  test("switches language to Turkish", async ({ page }) => {
    await page.goto("/en");
    await page.getByRole("button", { name: /switch language/i }).click();
    await expect(page).toHaveURL(/\/tr/);
  });
});

test.describe("Submit flow (gated)", () => {
  test("shows sign-in CTA when not authenticated", async ({ page }) => {
    await page.goto("/en/submit");
    await expect(page.getByRole("button", { name: /continue with google/i })).toBeVisible();
  });
});

test.describe("Legal pages", () => {
  test("privacy policy renders", async ({ page }) => {
    await page.goto("/en/legal/privacy");
    await expect(page.getByRole("heading", { name: /privacy policy/i })).toBeVisible();
  });
  test("takedown form renders", async ({ page }) => {
    await page.goto("/en/legal/takedown");
    await expect(page.getByRole("heading", { name: /takedown/i })).toBeVisible();
    await expect(page.getByLabel(/url of the content/i)).toBeVisible();
  });
});
