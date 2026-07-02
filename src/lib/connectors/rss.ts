function cleanCdata(str: string): string {
  if (!str) return "";
  return str.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").trim();
}

function decodeHtmlEntities(str: string): string {
  if (!str) return "";
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

export async function fetchRSSFeed(
  feedUrl: string,
  sourceName: string,
): Promise<
  Array<{
    title: string;
    body: string;
    external_url: string;
    source_score: number;
  }>
> {
  try {
    const res = await fetch(feedUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) ALPARAI/1.0.0 (contact@alparai.com)",
      },
    });

    if (!res.ok) {
      console.error(`RSS fetch failed for ${sourceName}: ${res.statusText}`);
      return [];
    }

    const xmlText = await res.text();
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    const matches = xmlText.match(itemRegex) || [];

    const results: Array<{
      title: string;
      body: string;
      external_url: string;
      source_score: number;
    }> = [];

    for (const item of matches) {
      const titleMatch = item.match(/<title>([\s\S]*?)<\/title>/);
      const linkMatch = item.match(/<link>([\s\S]*?)<\/link>/);
      const descMatch = item.match(/<description>([\s\S]*?)<\/description>/);

      const title = decodeHtmlEntities(cleanCdata(titleMatch ? titleMatch[1] || "" : ""));
      const link = cleanCdata(linkMatch ? linkMatch[1] || "" : "");
      const desc = decodeHtmlEntities(cleanCdata(descMatch ? descMatch[1] || "" : ""));

      // Only check if it contains AI keywords
      const lowerTitle = title.toLowerCase();
      const lowerDesc = desc.toLowerCase();
      const hasKeywords = [
        "ai ",
        "artificial intelligence",
        "llm",
        "gpt",
        "claude",
        "gemini",
        "copilot",
        "hallucination",
        "machine learning",
      ].some((kw) => lowerTitle.includes(kw) || lowerDesc.includes(kw));

      if (link && title && hasKeywords) {
        results.push({
          title: `[${sourceName}] ${title}`,
          body: desc || "No description provided.",
          external_url: link,
          source_score: 0,
        });
      }
    }

    return results;
  } catch (error) {
    console.error(`Error fetching RSS feed for ${sourceName}:`, error);
    return [];
  }
}
