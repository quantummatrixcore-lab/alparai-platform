import { createAdminClient } from "@/lib/supabase/admin";
import { fetchRedditPosts } from "@/lib/connectors/reddit";
import { fetchHNStories } from "@/lib/connectors/hackernews";
import { fetchGitHubIncidents } from "@/lib/connectors/github";
import { fetchRSSFeed } from "@/lib/connectors/rss";
import { verifyExternalItem, publishVerifiedItem } from "@/lib/ai/external-verifier";
import { logger } from "@/lib/utils/logger";

const TRUSTED_ALLOWLIST = [
  "technologyreview.mit.edu",
  "404media.co",
  "lastweekinai.substack.com",
  "theregister.com",
  "arstechnica.com",
  "theverge.com",
  "wired.com",
  "venturebeat.com",
];

function getDomain(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

export async function runExternalFetchTask() {
  const supabase = createAdminClient();

  const redditSubs = ["ChatGPT", "artificial", "MachineLearning", "ArtificialIntelligence"];
  const redditKeywords = ["hallucination", "bias", "error", "wrong", "harm"];
  const positiveKeywords = [
    "AI breakthrough",
    "AI helps",
    "AI benefit",
    "AI healthcare",
    "AI climate",
    "AI education",
    "AI accessibility",
    "open source AI",
    "AI safety research",
    "responsible AI",
  ];
  const hnKeywords = ["hallucination", "AI mistake", "AI bias", "AI harm"];

  const rssFeeds = [
    { name: "MIT Tech Review", url: "https://www.technologyreview.com/feed/" },
    { name: "404 Media", url: "https://www.404media.co/rss/" },
    { name: "Import AI", url: "https://importai.substack.com/feed" },
    { name: "The Register", url: "https://www.theregister.com/headlines.atom" },
    {
      name: "Google News AI",
      url: "https://news.google.com/rss/search?q=artificial+intelligence+when:24h&hl=en-US&gl=US&ceid=US:en",
    },
  ];

  const allFetched: Array<{
    source: string;
    external_url: string;
    title: string;
    body: string;
    source_score: number;
  }> = [];

  const allPositive: Array<{
    source: string;
    external_url: string;
    title: string;
    body: string;
    source_score: number;
  }> = [];

  // 1. Fetch Reddit — negative keywords
  for (const sub of redditSubs) {
    for (const kw of redditKeywords) {
      const posts = await fetchRedditPosts(sub, kw);
      allFetched.push(...posts.map((p) => ({ ...p, source: "reddit" })));
    }
  }

  // 2. Fetch Reddit — positive keywords
  for (const sub of redditSubs) {
    for (const kw of positiveKeywords) {
      const posts = await fetchRedditPosts(sub, kw);
      allPositive.push(...posts.map((p) => ({ ...p, source: "reddit" })));
    }
  }

  // 3. Fetch HN — negative
  for (const kw of hnKeywords) {
    const stories = await fetchHNStories(kw);
    allFetched.push(...stories.map((s) => ({ ...s, source: "hn" })));
  }

  // 4. Fetch HN — positive
  for (const kw of positiveKeywords) {
    const stories = await fetchHNStories(kw);
    allPositive.push(...stories.map((s) => ({ ...s, source: "hn" })));
  }

  // 5. Fetch GitHub — negative & security issues
  for (const kw of ["vulnerability", "leak", "hallucination"]) {
    const ghIssues = await fetchGitHubIncidents(kw);
    allFetched.push(...ghIssues.map((g) => ({ ...g, source: "github" })));
  }

  // 6. Fetch RSS Feeds
  for (const feed of rssFeeds) {
    const items = await fetchRSSFeed(feed.url, feed.name);
    allFetched.push(...items.map((i) => ({ ...i, source: "rss" })));
    allPositive.push(...items.map((i) => ({ ...i, source: "rss" })));
  }

  logger.info(
    `[FetchExternal] Fetched ${allFetched.length} potential incidents, ${allPositive.length} potential positive developments.`,
  );

  // --- Process positive developments directly into ecosystem_news ---
  let positiveInserted = 0;
  for (const item of allPositive) {
    const { error } = await supabase.from("ecosystem_news").insert({
      title_en: item.title,
      summary_en: item.body,
      category: "positive_development",
      severity: "low",
      status: "published",
      source: item.source,
      url: item.external_url,
      is_active: true,
      published_at: new Date().toISOString(),
    });

    if (error) {
      logger.warn("[FetchExternal] Positive insert skipped (likely duplicate)", {
        url: item.external_url,
        error: error.message,
      });
      continue;
    }
    positiveInserted++;
  }

  // --- Process negative/detection items into external_incidents_queue ---
  let insertedCount = 0;
  let aiPublishedCount = 0;
  let verificationSkippedCount = 0;

  for (const item of allFetched) {
    const isTrusted = TRUSTED_ALLOWLIST.includes(getDomain(item.external_url));
    let status = "pending";
    let verdict = null;

    if (isTrusted) {
      status = "published";
    } else {
      try {
        verdict = await verifyExternalItem(item.title, item.body);
        if (verdict.approved) {
          status = "accepted";
        }
      } catch (err) {
        logger.error("[FetchExternal] AI verification threw exception", {
          url: item.external_url,
          error: err instanceof Error ? err.message : String(err),
        });
        verificationSkippedCount++;
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

  return {
    total_fetched: allFetched.length,
    total_positive: allPositive.length,
    positive_inserted: positiveInserted,
    inserted_or_updated: insertedCount,
    ai_verified_published: aiPublishedCount,
    verification_skipped_or_failed: verificationSkippedCount,
  };
}
