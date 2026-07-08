import { test, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

// Load .env.local manually for the test runner if it exists
try {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, "utf-8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
        const [key, ...valueParts] = trimmed.split("=");
        const value = valueParts
          .join("=")
          .trim()
          .replace(/^['"]|['"]$/g, "");
        if (key && value) {
          process.env[key.trim()] = value;
        }
      }
    }
  }
} catch (e) {
  console.warn("Failed to load .env.local for test runner:", e);
}

import { generateUnsubscribeToken } from "../../../src/lib/utils/unsubscribe";

test.describe("One-click Unsubscribe Flow", () => {
  test("should show invalid request when params are missing", async ({ page }) => {
    await page.goto("/en/unsubscribe");
    const title = page.locator("h3");
    await expect(title).toContainText("Invalid Request");
  });

  test("should show security verification failed with invalid token", async ({ page }) => {
    await page.goto("/en/unsubscribe?userId=usr-123&token=invalidtoken");
    const title = page.locator("h3");
    await expect(title).toContainText("Security Verification Failed");
  });

  test("should successfully unsubscribe with a valid token", async ({ page }) => {
    const userId = "00000000-0000-0000-0000-000000000000"; // Dummy UUID
    const token = generateUnsubscribeToken(userId);

    await page.goto(`/en/unsubscribe?userId=${userId}&token=${token}&type=reporter_notifications`);

    const title = page.locator("h3");
    await expect(title).toContainText("Unsubscribed Successfully");
  });
});
