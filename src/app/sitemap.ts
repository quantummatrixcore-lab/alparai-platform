import type { MetadataRoute } from "next";
import { createServerClient } from "@/lib/supabase/server";
import { APP_URL } from "@/lib/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const locales = ["en", "tr"] as const;

  const supabase = await createServerClient();
  const [{ data: incidents }, { data: providers }, { data: models }] = await Promise.all([
    supabase
      .from("incidents")
      .select("id, created_at")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(500),
    supabase.from("ai_providers").select("slug"),
    supabase.from("ai_models").select("id, provider_id, released_at"),
  ]);

  const base: MetadataRoute.Sitemap = [
    { url: `${APP_URL}`, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    {
      url: `${APP_URL}/incidents`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${APP_URL}/leaderboard`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    { url: `${APP_URL}/models`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    {
      url: `${APP_URL}/suggestions`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: `${APP_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${APP_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${APP_URL}/legal/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${APP_URL}/legal/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${APP_URL}/legal/takedown`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${APP_URL}/legal/cookies`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ].flatMap((route) =>
    locales.map(
      (l) =>
        ({
          ...route,
          url: route.url.replace(`${APP_URL}`, `${APP_URL}/${l}`),
        }) as MetadataRoute.Sitemap[number]
    )
  );

  if (incidents) {
    for (const i of (incidents as Array<{ id: string; created_at: string }>) ?? []) {
      for (const locale of locales) {
        base.push({
          url: `${APP_URL}/${locale}/incidents/${i.id}`,
          lastModified: new Date(i.created_at),
          changeFrequency: "weekly",
          priority: 0.6,
        });
      }
    }
  }

  if (models) {
    for (const m of (models as Array<{
      id: string;
      provider_id: string;
      released_at: string | null;
    }>) ?? []) {
      for (const locale of locales) {
        base.push({
          url: `${APP_URL}/${locale}/models/${m.provider_id}/${m.id}`,
          lastModified: m.released_at ? new Date(m.released_at) : new Date(),
          changeFrequency: "weekly",
          priority: 0.6,
        });
      }
    }
  }

  for (const p of (providers as Array<{ slug: string }>) ?? []) {
    for (const locale of locales) {
      base.push({
        url: `${APP_URL}/${locale}/brand/${p.slug}`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.7,
      });
    }
  }

  return base;
}
