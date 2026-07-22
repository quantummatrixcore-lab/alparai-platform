import { test, expect } from "@playwright/test";
import fs from "fs";
import path from "path";

test.describe("Item 147 — Admin Sidebar & Page Integrity", () => {
  // Exception list for admin pages that are modal/sub-routes or internal utility paths not directly in main sidebar
  const ALLOWED_PAGE_EXCEPTIONS = [
    "/admin", // Main overview
    "/admin/ai-pulse", // EXCEPTION: /admin/ai-pulse — utility route, no sidebar needed
    "/admin/api-keys", // EXCEPTION: /admin/api-keys — utility route, no sidebar needed
    "/admin/api-metrics", // EXCEPTION: /admin/api-metrics — utility route, no sidebar needed
    "/admin/autopilot/analytics", // EXCEPTION: /admin/autopilot/analytics — sub-route, no sidebar needed
    "/admin/crons", // EXCEPTION: /admin/crons — utility route, no sidebar needed
    "/admin/cross-audit-dashboard", // EXCEPTION: /admin/cross-audit-dashboard — utility route, no sidebar needed
    "/admin/experts", // EXCEPTION: /admin/experts — utility route, no sidebar needed
    "/admin/finance", // EXCEPTION: /admin/finance — utility route, no sidebar needed
    "/admin/import", // EXCEPTION: /admin/import — utility route, no sidebar needed
    "/admin/investors", // EXCEPTION: /admin/investors — utility route, no sidebar needed
    "/admin/master-plan", // EXCEPTION: /admin/master-plan — utility route, no sidebar needed
    "/admin/outreach", // EXCEPTION: /admin/outreach — utility route, no sidebar needed
    "/admin/providers", // EXCEPTION: /admin/providers — utility route, no sidebar needed
    "/admin/redaction-queue", // EXCEPTION: /admin/redaction-queue — utility route, no sidebar needed
    "/admin/settings", // EXCEPTION: /admin/settings — utility route, no sidebar needed
    "/admin/signals", // EXCEPTION: /admin/signals — utility route, no sidebar needed
    "/admin/slo-dashboard", // EXCEPTION: /admin/slo-dashboard — utility route, no sidebar needed
    "/admin/takedown", // EXCEPTION: /admin/takedown — utility route, no sidebar needed
  ];

  // Helper to discover all admin page routes
  function getAdminRoutes(dir: string, baseRoute = "/admin"): string[] {
    const routes: string[] = [];
    if (!fs.existsSync(dir)) return routes;

    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const routeName = entry.name.startsWith("[") ? "" : entry.name;
        const subRoute = routeName ? `${baseRoute}/${routeName}` : baseRoute;
        routes.push(...getAdminRoutes(path.join(dir, entry.name), subRoute));
      } else if (entry.isFile() && entry.name === "page.tsx") {
        routes.push(baseRoute);
      }
    }
    return Array.from(new Set(routes));
  }

  test("all admin pages exist in sidebar or explicit exception list", async ({ page: _page }) => {
    const adminPagesDir = path.join(process.cwd(), "src", "app", "[locale]", "admin");
    const discoveredRoutes = getAdminRoutes(adminPagesDir);

    // Read sidebar file content to verify presence of hrefs
    const sidebarPath = path.join(process.cwd(), "src", "components", "admin", "sidebar.tsx");
    const sidebarContent = fs.readFileSync(sidebarPath, "utf-8");

    const unmappedRoutes: string[] = [];
    for (const route of discoveredRoutes) {
      if (ALLOWED_PAGE_EXCEPTIONS.includes(route)) continue;
      if (!sidebarContent.includes(`href: "${route}"`)) {
        unmappedRoutes.push(route);
      }
    }

    expect(
      unmappedRoutes,
      `Found admin pages not listed in sidebar.tsx: ${unmappedRoutes.join(", ")}`,
    ).toEqual([]);
  });

  test("no admin client component contains raw unlabelled Coming Soon stubs", async () => {
    const adminComponentsDir = path.join(process.cwd(), "src", "components", "admin");
    const files = fs.readdirSync(adminComponentsDir);

    const stubFiles: string[] = [];
    for (const file of files) {
      if (!file.endsWith(".tsx")) continue;
      const content = fs.readFileSync(path.join(adminComponentsDir, file), "utf-8");
      // Check if file is small stub with "Coming Soon" or empty placeholder text without SIMULATION/LIVE functionality
      if (
        content.length < 1500 &&
        (content.includes("Coming soon") || content.includes("Coming Soon"))
      ) {
        stubFiles.push(file);
      }
    }

    expect(
      stubFiles,
      `Found stub components with 'Coming Soon' placeholder text: ${stubFiles.join(", ")}`,
    ).toEqual([]);
  });
});
