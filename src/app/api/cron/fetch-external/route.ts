import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { fetchRedditPosts } from "@/lib/connectors/reddit";
import { fetchHNStories } from "@/lib/connectors/hackernews";
import { fetchRSSFeed } from "@/lib/connectors/rss";
import { isGatewayConfigured } from "@/lib/ai/openrouter-gateway";
import { verifyExternalItem, publishVerifiedItem } from "@/lib/ai/external-verifier";
import { logger } from "@/lib/utils/logger";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

const TRUSTED_ALLOWLIST = [
  "technologyreview.mit.edu",
  "404media.co",
  "lastweekinai.substack.com",
  "theregister.com",
];

function getDomain(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

export async function GET(request: Request) {
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

  logger.info(`[FetchExternal] Fetched total of ${allFetched.length} potential incidents.`);

  const aiAvailable = isGatewayConfigured();
  let insertedCount = 0;
  let aiPublishedCount = 0;

  for (const item of allFetched) {
    const isTrusted = TRUSTED_ALLOWLIST.includes(getDomain(item.external_url));
    let status = "pending";
    let verdict = null;

    if (isTrusted) {
      status = "published";
    } else if (aiAvailable) {
      try {
        verdict = await verifyExternalItem(item.title, item.body);
        if (verdict.approved) {
          status = "accepted";
        }
      } catch (err) {
        logger.error("[FetchExternal] AI verification failed", {
          url: item.external_url,
          error: err instanceof Error ? err.message : String(err),
        });
      }
    }

    const { error } = await supabase.from("external_incidents_queue").upsert(
      {
        source: item.source,
        external_url: item.external_url,
        title: item.title,
        body: item.body,
        source_score: item.source_score,
        status,
        fetched_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "external_url",
      },
    );

    if (error) {
      logger.error("[FetchExternal] Upsert failed", {
        url: item.external_url,
        error: error.message,
      });
      continue;
    }

    insertedCount++;

    if (verdict?.approved) {
      const published = await publishVerifiedItem({
        title: item.title,
        body: item.body,
        externalUrl: item.external_url,
        source: item.source,
        category: verdict.category,
        severity: verdict.severity,
        plausibilityScore: verdict.plausibilityScore,
      });
      if (published.success) {
        aiPublishedCount++;
      }
    }
  }

  return NextResponse.json({
    success: true,
    total_fetched: allFetched.length,
    inserted_or_updated: insertedCount,
    ai_verified_published: aiPublishedCount,
  });
}
