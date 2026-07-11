import { NextResponse } from "next/server";
import { logger } from "@/lib/utils/logger";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
    }

    let providerId = "provider-other";
    let providerName = "Unknown";
    let title = "Imported Chat";

    const host = parsedUrl.hostname.toLowerCase();
    if (host.includes("chatgpt.com") || host.includes("openai.com")) {
      providerId = "provider-openai";
      providerName = "ChatGPT";
    } else if (host.includes("claude.ai")) {
      providerId = "provider-anthropic";
      providerName = "Claude";
    } else if (host.includes("grok.com") || host.includes("x.com")) {
      providerId = "provider-xai";
      providerName = "Grok";
    } else if (host.includes("gemini.google.com")) {
      providerId = "provider-google";
      providerName = "Gemini";
    }

    // Attempt to fetch the URL to grab basic meta tags
    let description = `Automatically imported evidence from ${url}`;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          "User-Agent": "ALPAR-AI-Evidence-Bot/1.0",
        },
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const html = await response.text();

        // Simple regex to extract <title>
        const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
        if (titleMatch && titleMatch[1]) {
          // Basic decoding
          title = titleMatch[1]
            .replace(/&amp;/g, "&")
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .trim();
          // Remove common prefixes
          title = title
            .replace(/^ChatGPT\s*-\s*/i, "")
            .replace(/^Claude\s*-\s*/i, "")
            .trim();
        }

        // Try to get meta description
        const metaMatch =
          html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i) ||
          html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["']/i);
        if (metaMatch && metaMatch[1]) {
          description = metaMatch[1];
        }
      }
    } catch (e) {
      // Ignore fetch errors, just use fallback
      logger.error("Fetch error for extract", undefined, e instanceof Error ? e : undefined);
    }

    return NextResponse.json({
      url,
      providerId,
      providerName,
      title,
      description,
      extractedAt: new Date().toISOString(),
    });
  } catch (error) {
    logger.error("Extract API Error", undefined, error instanceof Error ? error : undefined);
    return NextResponse.json({ error: "Failed to extract data" }, { status: 500 });
  }
}
