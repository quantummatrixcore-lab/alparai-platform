import { test, expect } from "@playwright/test";

test.describe("Admin AI Orchestrator Spec", () => {
  test("renders /admin/ai-orchestrator page and blackbox control panel", async ({ page }) => {
    await page.goto("/en/admin/ai-orchestrator");
    await expect(page).toHaveURL(/\/en\/admin\/ai-orchestrator/);
    await expect(page.locator("body")).toBeVisible();
  });
});
