import type { MetadataRoute } from "next";
import { createServerClient } from "@/lib/supabase/server";
import { APP_URL } from "@/lib/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const locales = ["en", "tr"] as const;
  const base: MetadataRoute.Sitemap = [];
  for (const locale of locales) {
    base.push(
      { url: `${APP_URL}/${locale}`, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
      { url: `${APP_URL}/${locale}/incidents`, lastModified: new Date(), changeFrequency: "hourly", priority: 0.9 },
      { url: `${APP_URL}/${locale}/leaderboard`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
      { url: `${APP_URL}/${locale}/suggestions`, lastModified: new Date(), changeFrequency: "daily", priority: 0.7 },
      { url: `${APP_URL}/${locale}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
      { url: `${APP_URL}/${locale}/contact`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
      { url: `${APP_URL}/${locale}/legal/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.2 },
      { url: `${APP_URL}/${locale}/legal/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.2 },
      { url: `${APP_URL}/${locale}/legal/takedown`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.2 },
      { url: `${APP_URL}/${locale}/legal/cookies`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.2 },
    );
  }
  try {
    const supabase = await createServerClient();
    const [{ data: incidents }, { data: providers }] = await Promise.all([
      supabase.from("incidents").select("id, updated_at").eq("status", "published").order("published_at", { ascending: false }).limit(500),
      supabase.from("ai_providers").select("slug, updated_at").limit(200),
    ]);
    for (const inc of (incidents as Array<{ id: string; updated_at: string }>) ?? []) {
      for (const locale of locales) {
        base.push({
          url: `${APP_URL}/${locale}/incidents/${inc.id}`,
          lastModified: new Date(inc.updated_at),
          changeFrequency: "weekly",
          priority: 0.6,
        });
      }
    }
    for (const p of (providers as Array<{ slug: string; updated_at: string }>) ?? []) {
      for (const locale of locales) {
        base.push({
          url: `${APP_URL}/${locale}/brand/${p.slug}`,
          lastModified: new Date(p.updated_at),
          changeFrequency: "daily",
          priority: 0.7,
        });
      }
    }
  } catch {
    // best-effort
  }
  return base;
}
