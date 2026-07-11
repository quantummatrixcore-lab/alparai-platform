import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { fetchRedditPosts } from "@/lib/connectors/reddit";
import { fetchHNStories } from "@/lib/connectors/hackernews";
import { fetchRSSFeed } from "@/lib/connectors/rss";
import { logger } from "@/lib/utils/logger";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  // Simple bearer auth if needed, or check secret key
  const authHeader = request.headers.get("authorization");
  const isAuthorized = authHeader === `Bearer ${process.env.CRON_SECRET}`;
  if (!isAuthorized) return new NextResponse("Unauthorized", { status: 401 });

  const supabase = createAdminClient();

  const redditSubs = ["ChatGPT", "artificial", "MachineLearning", "ArtificialIntelligence"];
  const redditKeywords = ["hallucination", "bias", "error", "wrong", "harm"];
  const hnKeywords = ["hallucination", "AI mistake", "AI bias", "AI harm"];

  const rssFeeds = [
    { name: "MIT Tech Review", url: "https://www.technologyreview.com/feed/" },
    { name: "404 Media", url: "https://www.404media.co/rss/" },
    { name: "Import AI", url: "https://importai.substack.com/feed" },
    { name: "The Register", url: "https://www.theregister.com/headlines.atom" },
  ];

  const allFetched: Array<{
    source: string;
    external_url: string;
    title: string;
    body: string;
    source_score: number;
  }> = [];

  // 1. Fetch Reddit
  for (const sub of redditSubs) {
    for (const kw of redditKeywords) {
      const posts = await fetchRedditPosts(sub, kw);
      allFetched.push(...posts.map((p) => ({ ...p, source: "reddit" })));
    }
  }

  // 2. Fetch HN
  for (const kw of hnKeywords) {
    const stories = await fetchHNStories(kw);
    allFetched.push(...stories.map((s) => ({ ...s, source: "hn" })));
  }

  // 3. Fetch RSS Feeds
  for (const feed of rssFeeds) {
    const items = await fetchRSSFeed(feed.url, feed.name);
    allFetched.push(...items.map((i) => ({ ...i, source: "rss" })));
  }

  logger.info(`Fetched total of ${allFetched.length} potential incidents.`);

  let insertedCount = 0;
  // Ingest in DB with deduplication
  for (const item of allFetched) {
    const { error } = await supabase.from("external_incidents_queue").upsert(
      {
        source: item.source,
        external_url: item.external_url,
        title: item.title,
        body: item.body,
        source_score: item.source_score,
        status: "pending",
        fetched_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "external_url",
      },
    );

    if (!error) {
      insertedCount++;
    }
  }

  return NextResponse.json({
    success: true,
    total_fetched: allFetched.length,
    inserted_or_updated: insertedCount,
  });
}
