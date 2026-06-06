import { test, expect } from "@playwright/test";

test.describe("SEO", () => {
  test("home page has required meta tags", async ({ page }) => {
    await page.goto("/en");
    const title = await page.title();
    expect(title).toContain("ALPAR");

    const description = page.locator('meta[name="description"]');
    await expect(description).toHaveAttribute("content", /.+/);

    const ogTitle = page.locator('meta[property="og:title"]');
    await expect(ogTitle).toHaveAttribute("content", /.+/);

    const ogDescription = page.locator('meta[property="og:description"]');
    await expect(ogDescription).toHaveAttribute("content", /.+/);
  });

  test("twitter card meta is present", async ({ page }) => {
    await page.goto("/en");
    const twitterCard = page.locator('meta[name="twitter:card"]');
    const count = await twitterCard.count();
    if (count > 0) {
      await expect(twitterCard).toHaveAttribute(
        "content",
        "summary_large_image"
      );
    }
  });

  test("JSON-LD structured data exists", async ({ page }) => {
    await page.goto("/en");
    const jsonLd = page.locator('script[type="application/ld+json"]');
    const count = await jsonLd.count();
    expect(count).toBeGreaterThanOrEqual(1);
    const content = await jsonLd.first().textContent();
    expect(content).toBeTruthy();
    const parsed = JSON.parse(content!);
    expect(parsed).toHaveProperty("@context");
    expect(parsed).toHaveProperty("@type");
  });

  test("robots meta allows indexing on public pages", async ({ page }) => {
    await page.goto("/en");
    const robots = page.locator('meta[name="robots"]');
    const count = await robots.count();
    if (count > 0) {
      const content = await robots.getAttribute("content");
      expect(content).toContain("index");
      expect(content).toContain("follow");
    }
  });

  test("sitemap.xml is accessible", async ({ page }) => {
    const response = await page.goto("/sitemap.xml");
    expect(response?.status()).toBe(200);
    const contentType = response?.headers()["content-type"] ?? "";
    expect(contentType).toMatch(/xml/);
  });

  test("robots.txt is accessible", async ({ page }) => {
    const response = await page.goto("/robots.txt");
    expect(response?.status()).toBe(200);
    const body = await response?.text();
    expect(body).toContain("Sitemap");
  });

  test("canonical URL is present", async ({ page }) => {
    await page.goto("/en");
    const canonical = page.locator('link[rel="canonical"]');
    const count = await canonical.count();
    if (count > 0) {
      const href = await canonical.getAttribute("href");
      expect(href).toMatch(/^https?:\/\//);
    }
  });

  test("open graph image is specified", async ({ page }) => {
    await page.goto("/en");
    const ogImage = page.locator('meta[property="og:image"]');
    const count = await ogImage.count();
    if (count > 0) {
      const content = await ogImage.getAttribute("content");
      expect(content).toMatch(/^https?:\/\//);
    }
  });
});
