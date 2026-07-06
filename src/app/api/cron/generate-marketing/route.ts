import { type NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateMarketingAssets, generateNewsSocialPosts } from "@/lib/marketing/content-engine";
import { logger } from "@/lib/utils/logger";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const isVercelCron = request.headers.get("x-vercel-cron") === "1";
  const cronSecret = process.env.CRON_SECRET;

  const isAuthorized =
    isVercelCron ||
    (cronSecret && authHeader === `Bearer ${cronSecret}`) ||
    process.env.NODE_ENV !== "production";

  if (!isAuthorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const admin = createAdminClient();

    // 1. Fetch recently published incidents (up to 30)
    const { data: incidents, error: incError } = await admin
      .from("incidents")
      .select("id")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(30);

    if (incError) {
      throw new Error(`Failed to fetch incidents: ${incError.message}`);
    }

    if (!incidents || incidents.length === 0) {
      return NextResponse.json({ message: "No published incidents found." });
    }

    // 2. Fetch all linked incident ids from social_posts
    const { data: posts, error: postError } = await admin
      .from("social_posts")
      .select("linked_incident_id")
      .not("linked_incident_id", "is", null);

    if (postError) {
      throw new Error(`Failed to fetch social posts: ${postError.message}`);
    }

    const linkedIncidentIds = new Set(
      (posts ?? [])
        .map((p) => p.linked_incident_id)
        .filter((id): id is string => typeof id === "string"),
    );

    // 3. Find incidents that need marketing assets generated
    const pendingIncidents = incidents.filter((inc) => !linkedIncidentIds.has(inc.id));

    // 4. Process up to 3 incidents to avoid Vercel Function timeouts (10s on hobby, 60s/900s on pro)
    const processedIds: string[] = [];
    if (pendingIncidents.length > 0) {
      const toProcess = pendingIncidents.slice(0, 3);
      for (const inc of toProcess) {
        logger.info(`[GenerateMarketingCron] Generating assets for incident: ${inc.id}`);
        const success = await generateMarketingAssets(inc.id);
        if (success) {
          processedIds.push(inc.id);
        }
      }
    }

    // === NEWS PROCESSING ===
    // 5. Fetch accepted news (up to 30)
    const { data: newsItems, error: newsError } = await admin
      .from("ecosystem_news")
      .select("id")
      .eq("status", "accepted")
      .order("published_at", { ascending: false })
      .limit(30);

    if (newsError) {
      throw new Error(`Failed to fetch news: ${newsError.message}`);
    }

    // 6. Fetch all linked news ids from social_posts
    const { data: newsPosts, error: newsPostError } = await admin
      .from("social_posts")
      .select("linked_news_id")
      .not("linked_news_id", "is", null);

    if (newsPostError) {
      throw new Error(`Failed to fetch news social posts: ${newsPostError.message}`);
    }

    const linkedNewsIds = new Set(
      (newsPosts ?? [])
        .map((p) => p.linked_news_id)
        .filter((id): id is string => typeof id === "string"),
    );

    // 7. Find news items that need social drafts generated
    const pendingNews = (newsItems ?? []).filter((item) => !linkedNewsIds.has(item.id));

    const processedNewsIds: string[] = [];
    if (pendingNews.length > 0) {
      // Process up to 3 news items per run
      const newsToProcess = pendingNews.slice(0, 3);
      for (const item of newsToProcess) {
        logger.info(`[GenerateMarketingCron] Generating assets for news: ${item.id}`);
        const success = await generateNewsSocialPosts(item.id);
        if (success) {
          processedNewsIds.push(item.id);
        }
      }
    }

    return NextResponse.json({
      success: true,
      incidents: {
        found: pendingIncidents.length,
        processed: processedIds.length,
        processedIds,
      },
      news: {
        found: pendingNews.length,
        processed: processedNewsIds.length,
        processedIds: processedNewsIds,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error during marketing asset generation";
    logger.error("Generate marketing cron failed", {}, error instanceof Error ? error : undefined);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
