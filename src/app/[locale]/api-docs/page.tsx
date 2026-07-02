import { setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@/i18n/routing";
import { Code2, Shield, Zap, Globe, ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Developer API — ALPAR AI",
  description:
    "Public REST API for security researchers, journalists and developers. Access incident data, provider trust scores and leaderboard rankings programmatically.",
};

const ENDPOINTS = [
  {
    method: "GET",
    path: "/api/v1/stats",
    summary: "Platform Statistics",
    description:
      "Returns aggregate platform stats: total incidents, providers tracked, average trust score and incident breakdown by category.",
    example: `curl https://alparai.com/api/v1/stats`,
    response: `{
  "data": {
    "total_incidents": 142,
    "total_providers": 14,
    "average_trust_score": 72.5,
    "by_category": {
      "misinformation": 38,
      "privacy": 29,
      "bias": 21
    }
  },
  "meta": { "generated_at": "2026-07-02T16:00:00.000Z" }
}`,
  },
  {
    method: "GET",
    path: "/api/v1/leaderboard",
    summary: "Provider Leaderboard",
    description:
      "Returns all tracked AI providers ranked by trust score, with response rate and incident count. Ideal for comparative analysis.",
    example: `curl https://alparai.com/api/v1/leaderboard`,
    response: `{
  "data": [
    {
      "rank": 1,
      "id": "...",
      "slug": "openai",
      "name": "OpenAI",
      "is_verified": true,
      "trust_score": 82,
      "incident_count": 14,
      "response_count": 11,
      "response_rate": 78
    }
  ],
  "meta": {
    "total": 14,
    "generated_at": "2026-07-02T16:00:00.000Z",
    "docs": "https://alparai.com/api-docs"
  }
}`,
  },
  {
    method: "GET",
    path: "/api/v1/providers",
    summary: "AI Providers List",
    description:
      "Returns all tracked AI providers with metadata: name, slug, description, website, logo URL, verification status and trust score.",
    example: `curl https://alparai.com/api/v1/providers`,
    response: `{
  "data": [
    {
      "id": "...",
      "name": "OpenAI",
      "slug": "openai",
      "description": "...",
      "website_url": "https://openai.com",
      "logo_url": "...",
      "is_verified": true,
      "trust_score": 82
    }
  ],
  "meta": { "count": 14, "generated_at": "2026-07-02T16:00:00.000Z" }
}`,
  },
  {
    method: "GET",
    path: "/api/v1/incidents",
    summary: "Published Incidents",
    description:
      "Returns paginated list of published AI accountability incidents. Supports filtering by category, severity and provider.",
    example: `curl "https://alparai.com/api/v1/incidents?limit=10&offset=0"`,
    response: `{
  "data": [
    {
      "id": "...",
      "title": "...",
      "slug": "...",
      "category": "misinformation",
      "severity": "high",
      "status": "published",
      "created_at": "2026-06-25T00:00:00.000Z"
    }
  ],
  "meta": { "total": 142, "limit": 10, "offset": 0 }
}`,
  },
  {
    method: "GET",
    path: "/api/v1/incidents/:id",
    summary: "Single Incident",
    description:
      "Returns full detail for a single published incident including description, evidence links and provider response.",
    example: `curl https://alparai.com/api/v1/incidents/{id}`,
    response: `{
  "data": {
    "id": "...",
    "title": "...",
    "description": "...",
    "category": "misinformation",
    "severity": "high",
    "provider": { "name": "OpenAI", "slug": "openai" },
    "created_at": "2026-06-25T00:00:00.000Z"
  }
}`,
  },
] as const;

export default async function ApiDocsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isEn = locale === "en";

  return (
    <div className="min-h-screen bg-[#060E17]">
      {/* Hero */}
      <div className="border-b border-white/5 bg-[#0A1622] py-16">
        <Container>
          <Link
            href="/press-kit"
            className="mb-6 inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {isEn ? "Back to Press Kit" : "Press Kit'e Dön"}
          </Link>
          <div className="max-w-2xl">
            <span className="mb-3 inline-block rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-bold tracking-wider text-blue-400 uppercase">
              {isEn ? "Open API" : "Açık API"}
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              {isEn ? "Developer API" : "Geliştirici API"}
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-slate-400">
              {isEn
                ? "Public REST API for security researchers, journalists and developers. No authentication required — free, open and rate-limited."
                : "Güvenlik araştırmacıları, gazeteciler ve geliştiriciler için açık REST API. Kimlik doğrulama gerekmez — ücretsiz, açık ve rate-limitli."}
            </p>
          </div>
        </Container>
      </div>

      <Container className="py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_300px]">
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-white">{isEn ? "Endpoints" : "Endpoint'ler"}</h2>

            {ENDPOINTS.map((ep) => (
              <Card key={ep.path} className="border-white/5 bg-[#0F1E2E]">
                <CardHeader className="pb-3">
                  <CardTitle className="flex flex-wrap items-center gap-3">
                    <span className="rounded border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 font-mono text-[11px] font-black text-emerald-400">
                      {ep.method}
                    </span>
                    <code className="font-mono text-sm font-semibold text-white">{ep.path}</code>
                    <span className="text-sm font-normal text-slate-400">{ep.summary}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-slate-400">{ep.description}</p>

                  <div>
                    <p className="mb-1.5 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                      {isEn ? "Example Request" : "Örnek İstek"}
                    </p>
                    <pre className="overflow-x-auto rounded-lg border border-white/5 bg-[#08121C] p-3 font-mono text-xs text-emerald-300">
                      {ep.example}
                    </pre>
                  </div>

                  <div>
                    <p className="mb-1.5 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                      {isEn ? "Example Response" : "Örnek Yanıt"}
                    </p>
                    <pre className="overflow-x-auto rounded-lg border border-white/5 bg-[#08121C] p-3 font-mono text-xs text-slate-300">
                      {ep.response}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Sticky sidebar */}
          <div className="space-y-4 lg:sticky lg:top-6 lg:self-start">
            <Card className="border-white/5 bg-[#0F1E2E]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm text-white">
                  <Zap className="h-4 w-4 text-yellow-400" />
                  {isEn ? "Rate Limits" : "Rate Limit"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs text-slate-400">
                <div className="flex items-center justify-between">
                  <span>{isEn ? "Requests per minute" : "Dakika başı istek"}</span>
                  <span className="font-bold text-white">100</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>{isEn ? "Burst limit" : "Anlık limit"}</span>
                  <span className="font-bold text-white">20</span>
                </div>
                <p className="border-t border-white/5 pt-3 text-[10px] leading-relaxed">
                  {isEn
                    ? "Exceeded limits return HTTP 429. Check X-RateLimit-* headers for remaining quota."
                    : "Limit aşıldığında HTTP 429 döner. Kalan kota için X-RateLimit-* header'larını kontrol edin."}
                </p>
              </CardContent>
            </Card>

            <Card className="border-white/5 bg-[#0F1E2E]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm text-white">
                  <Globe className="h-4 w-4 text-blue-400" />
                  CORS
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-slate-400">
                <p>
                  {isEn
                    ? "All endpoints are CORS-enabled and accessible from any origin."
                    : "Tüm endpoint'ler CORS açık — herhangi bir origin'den erişilebilir."}
                </p>
                <pre className="rounded border border-white/5 bg-[#08121C] p-2 font-mono text-[10px] text-slate-300">
                  Access-Control-Allow-Origin: *
                </pre>
              </CardContent>
            </Card>

            <Card className="border-white/5 bg-[#0F1E2E]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm text-white">
                  <Shield className="h-4 w-4 text-emerald-400" />
                  {isEn ? "Base URL" : "Temel URL"}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-slate-400">
                <pre className="rounded border border-white/5 bg-[#08121C] p-2 font-mono text-[10px] text-emerald-300">
                  https://alparai.com/api/v1
                </pre>
                <p className="mt-2">
                  {isEn
                    ? "All responses are JSON. No API key required."
                    : "Tüm yanıtlar JSON formatında. API anahtarı gerekmez."}
                </p>
              </CardContent>
            </Card>

            <Card className="border-white/5 bg-[#0F1E2E]">
              <CardContent className="p-4">
                <p className="mb-2 flex items-center gap-2 text-xs font-semibold text-white">
                  <Code2 className="h-3.5 w-3.5 text-emerald-400" />
                  {isEn ? "Questions?" : "Sorunuz mu var?"}
                </p>
                <a
                  href="mailto:press@alparai.com"
                  className="text-xs text-emerald-400 hover:text-emerald-300"
                >
                  press@alparai.com
                </a>
                <p className="mt-1 text-[10px] text-slate-500">
                  {isEn
                    ? "For research partnerships and data access requests."
                    : "Araştırma ortaklıkları ve veri erişim talepleri için."}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
}
