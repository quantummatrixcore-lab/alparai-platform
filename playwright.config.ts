import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    ignoreHTTPSErrors: true,
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "mobile-safari", use: { ...devices["iPhone 14"] } },
    { name: "mobile-pixel", use: { ...devices["Pixel 7"] } },
  ],
  webServer: process.env.CI
    ? undefined
    : {
        command: "npx next start",
        port: 3000,
        timeout: 60_000,
        reuseExistingServer: false,
        env: {
          NEXT_PUBLIC_SUPABASE_URL: "https://mock-supabase.supabase.co",
          NEXT_PUBLIC_SUPABASE_ANON_KEY: "mock-anon-key",
          IS_PLAYWRIGHT_TEST: "true",
          IP_SALT: process.env.IP_SALT ?? "test-salt-must-be-at-least-16-chars",
          NEXT_PUBLIC_APP_URL: "http://127.0.0.1:3000",
        },
      },
});
