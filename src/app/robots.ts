import type { MetadataRoute } from "next";
import { APP_URL } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/en",
          "/tr",
          "/incidents",
          "/leaderboard",
          "/suggestions",
          "/about",
          "/contact",
          "/blog",
          "/blog/*",
        ],
        disallow: [
          "/admin",
          "/admin/*",
          "/api/*",
          "/auth/*",
          "/profile",
          "/my-incidents",
          "/settings",
          "/legal/takedown",
        ],
      },
    ],
    sitemap: `${APP_URL}/sitemap.xml`,
    host: APP_URL,
  };
}
