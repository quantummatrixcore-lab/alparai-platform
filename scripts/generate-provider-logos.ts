// Generate wordmark SVGs for all AI providers
// Wordmark = brand name in brand color with brand-specific typography
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

interface Provider {
  slug: string;
  name: string;
  color: string;
  fontWeight?: number;
  letterSpacing?: string;
  fontFamily?: string;
  symbol?: string;
  symbolColor?: string;
}

const providers: Provider[] = [
  { slug: "xai", name: "xAI", color: "#000000", fontWeight: 700, letterSpacing: "0.05em" },
  { slug: "openai", name: "OpenAI", color: "#10A37F", fontWeight: 600 },
  { slug: "anthropic", name: "Anthropic", color: "#D97757", fontWeight: 700 },
  { slug: "google", name: "Google", color: "#4285F4", fontWeight: 500, letterSpacing: "-0.02em" },
  { slug: "meta", name: "Meta", color: "#0866FF", fontWeight: 700 },
  { slug: "mistral", name: "Mistral AI", color: "#FA520F", fontWeight: 700 },
  { slug: "cohere", name: "Cohere", color: "#39594D", fontWeight: 700 },
  { slug: "perplexity", name: "Perplexity", color: "#20808D", fontWeight: 700 },
  { slug: "qwen", name: "Qwen", color: "#615CED", fontWeight: 700 },
  { slug: "deepseek", name: "DeepSeek", color: "#1A4D8F", fontWeight: 700 },
  { slug: "ai21", name: "AI21 Labs", color: "#E03C31", fontWeight: 700, letterSpacing: "0.02em" },
  {
    slug: "elevenlabs",
    name: "ElevenLabs",
    color: "#FFFFFF",
    fontWeight: 700,
    letterSpacing: "-0.02em",
  },
  { slug: "groq", name: "Groq", color: "#F55036", fontWeight: 800 },
  { slug: "inflection", name: "Pi", color: "#FF6B6B", fontWeight: 600, letterSpacing: "0.1em" },
  {
    slug: "midjourney",
    name: "Midjourney",
    color: "#1B1B1B",
    fontWeight: 700,
    letterSpacing: "-0.02em",
  },
  { slug: "runway", name: "Runway", color: "#000000", fontWeight: 700, letterSpacing: "-0.01em" },
  {
    slug: "stability",
    name: "Stability AI",
    color: "#7B2CBF",
    fontWeight: 700,
    letterSpacing: "-0.01em",
  },
  { slug: "baidu", name: "Baidu", color: "#2932E1", fontWeight: 700 },
  { slug: "tencent", name: "Tencent", color: "#0052D9", fontWeight: 700, letterSpacing: "-0.01em" },
  { slug: "alibaba", name: "Alibaba", color: "#FF6A00", fontWeight: 700 },
  { slug: "other", name: "Other", color: "#6B7280", fontWeight: 500 },
];

function generateWordmark(p: Provider): string {
  const text = p.name;
  const fontSize = text.length > 10 ? 18 : text.length > 6 ? 22 : 28;
  const textWidth = text.length * fontSize * 0.55;
  const svgWidth = Math.max(160, Math.min(280, textWidth + 40));
  const svgHeight = 60;

  // Special: dark logos need inverted display in dark theme
  const needsInversion = ["xai", "midjourney", "runway"].includes(p.slug);

  let textColor = p.color;
  if (needsInversion) {
    textColor = "currentColor";
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgWidth} ${svgHeight}" width="${svgWidth}" height="${svgHeight}" role="img" aria-label="${p.name}">
  <title>${p.name}</title>
  <style>
    .wordmark {
      font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'SF Pro Display', system-ui, sans-serif;
      font-weight: ${p.fontWeight || 600};
      letter-spacing: ${p.letterSpacing || "0"};
      fill: ${textColor};
      font-size: ${fontSize}px;
      dominant-baseline: central;
    }
  </style>
  <text x="${svgWidth / 2}" y="${svgHeight / 2}" text-anchor="middle" class="wordmark">${text}</text>
</svg>`;
}

const outputDir = join(process.cwd(), "public", "logos", "providers");
mkdirSync(outputDir, { recursive: true });

providers.forEach((p) => {
  const svg = generateWordmark(p);
  const outPath = join(outputDir, `${p.slug}.svg`);
  writeFileSync(outPath, svg, "utf-8");
  console.log(`✓ ${p.slug}.svg`);
});

console.log(`\n${providers.length} logos written to ${outputDir}`);
