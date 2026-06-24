import { setRequestLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/layout";
import { Card, CardContent } from "@/components/ui/card";
import { Code, Zap, Globe } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "api" });
  return { title: t("title"), description: t("description") };
}

export default async function ApiDocsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "api" });

  return (
    <Container className="py-12">
      <header className="mb-10 max-w-3xl">
        <div className="border-brand-500/30 bg-brand-500/10 text-brand-400 mb-4 inline-flex items-center gap-2 rounded-sm border px-4 py-1.5 text-xs font-bold tracking-[0.2em] uppercase">
          <Code className="h-4 w-4" />
          {t("eyebrow")}
        </div>
        <h1 className="text-fg-primary mb-3 text-4xl font-black tracking-tight md:text-5xl">
          {t("title")}
        </h1>
        <p className="text-fg-secondary text-lg">{t("description")}</p>
      </header>

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="space-y-2 p-5">
            <Globe className="text-brand-400 h-5 w-5" aria-hidden="true" />
            <h2 className="text-fg-primary text-base font-semibold">{t("feature_anon")}</h2>
            <p className="text-fg-muted text-sm">{t("feature_anon_desc")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-2 p-5">
            <Zap className="text-warning-400 h-5 w-5" aria-hidden="true" />
            <h2 className="text-fg-primary text-base font-semibold">{t("feature_cache")}</h2>
            <p className="text-fg-muted text-sm">{t("feature_cache_desc")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-2 p-5">
            <Code className="text-success-500 h-5 w-5" aria-hidden="true" />
            <h2 className="text-fg-primary text-base font-semibold">{t("feature_openapi")}</h2>
            <p className="text-fg-muted text-sm">{t("feature_openapi_desc")}</p>
          </CardContent>
        </Card>
      </div>

      <section className="mb-10">
        <h2 className="text-fg-primary mb-3 text-2xl font-bold">{t("endpoints_title")}</h2>
        <p className="text-fg-muted mb-6">{t("endpoints_desc")}</p>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-0">
              <div className="border-success-500/30 bg-success-500/10 text-success-500 flex items-center gap-2 border-b px-5 py-3 text-xs font-bold tracking-wider uppercase">
                <span>GET</span>
                <span className="text-fg-muted font-mono normal-case">/api/v1/incidents</span>
              </div>
              <div className="space-y-4 p-5">
                <p className="text-fg-secondary text-sm">{t("list_desc")}</p>
                <div className="border-border-subtle bg-bg-secondary overflow-x-auto rounded-md border p-4">
                  <pre className="text-fg-primary font-mono text-xs leading-relaxed">
                    {`curl https://alparai.com/api/v1/incidents?limit=5&severity=critical

# Response
{
  "data": [
    {
      "id": "0a2c6a31-...",
      "title": "Teen Suicide Linked to AI Chatbot (Character.AI)",
      "description": "...",
      "severity": "critical",
      "category": "manipulation",
      "is_anonymous": true,
      "incident_date": "2024-02-28T00:00:00Z",
      "views": 1234,
      "upvotes": 56,
      "model": "Character.AI",
      "created_at": "2026-06-09T..."
    }
  ],
  "meta": { "count": 1, "limit": 5, "generated_at": "..." }
}`}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-0">
              <div className="border-success-500/30 bg-success-500/10 text-success-500 flex items-center gap-2 border-b px-5 py-3 text-xs font-bold tracking-wider uppercase">
                <span>GET</span>
                <span className="text-fg-muted font-mono normal-case">
                  /api/v1/incidents/{`{id}`}
                </span>
              </div>
              <div className="space-y-4 p-5">
                <p className="text-fg-secondary text-sm">{t("get_desc")}</p>
                <div className="border-border-subtle bg-bg-secondary overflow-x-auto rounded-md border p-4">
                  <pre className="text-fg-primary font-mono text-xs leading-relaxed">
                    {`curl https://alparai.com/api/v1/incidents/0a2c6a31-e4d7-45d5-9b94-7ab0e6eeb041

# Response
{
  "data": {
    "id": "0a2c6a31-...",
    "title": "...",
    ...
  }
}`}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-0">
              <div className="border-success-500/30 bg-success-500/10 text-success-500 flex items-center gap-2 border-b px-5 py-3 text-xs font-bold tracking-wider uppercase">
                <span>GET</span>
                <span className="text-fg-muted font-mono normal-case">/api/v1/providers</span>
              </div>
              <div className="space-y-4 p-5">
                <p className="text-fg-secondary text-sm">{t("providers_desc")}</p>
                <div className="border-border-subtle bg-bg-secondary overflow-x-auto rounded-md border p-4">
                  <pre className="text-fg-primary font-mono text-xs leading-relaxed">
                    {`curl https://alparai.com/api/v1/providers

# Response
{
  "data": [
    {
      "id": "9a12cf42-...",
      "name": "OpenAI",
      "slug": "openai",
      "website_url": "https://openai.com",
      "logo_url": "...",
      "is_verified": true,
      "trust_score": 88
    }
  ],
  "meta": { "count": 1, "generated_at": "..." }
}`}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-0">
              <div className="border-success-500/30 bg-success-500/10 text-success-500 flex items-center gap-2 border-b px-5 py-3 text-xs font-bold tracking-wider uppercase">
                <span>GET</span>
                <span className="text-fg-muted font-mono normal-case">/api/v1/stats</span>
              </div>
              <div className="space-y-4 p-5">
                <p className="text-fg-secondary text-sm">{t("stats_desc")}</p>
                <div className="border-border-subtle bg-bg-secondary overflow-x-auto rounded-md border p-4">
                  <pre className="text-fg-primary font-mono text-xs leading-relaxed">
                    {`curl https://alparai.com/api/v1/stats

# Response
{
  "data": {
    "total_incidents": 142,
    "total_providers": 8,
    "average_trust_score": 76.4,
    "by_category": {
      "hallucination": 64,
      "privacy": 32,
      "bias": 46
    }
  },
  "meta": { "generated_at": "..." }
}`}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-fg-primary mb-3 text-2xl font-bold">{t("spec_title")}</h2>
        <p className="text-fg-muted mb-3">{t("spec_desc")}</p>
        <Card>
          <CardContent className="p-5">
            <a
              href="/openapi.yaml"
              target="_blank"
              rel="noreferrer noopener"
              className="text-brand-400 hover:underline"
            >
              /openapi.yaml
            </a>
          </CardContent>
        </Card>
      </section>

      <section className="mb-10">
        <h2 className="text-fg-primary mb-3 text-2xl font-bold">{t("rate_title")}</h2>
        <p className="text-fg-muted">{t("rate_desc")}</p>
      </section>

      <section className="border-border-subtle mt-12 border-t pt-12">
        <h2 className="text-fg-primary mb-3 text-2xl font-bold">{t("pricing_title")}</h2>
        <p className="text-fg-muted mb-8">{t("pricing_desc")}</p>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card variant="glass">
            <CardContent className="space-y-4 p-6">
              <div>
                <h3 className="text-fg-primary text-lg font-bold">{t("tier_academic")}</h3>
                <p className="text-fg-muted mt-1 text-xs">{t("tier_academic_desc")}</p>
              </div>
              <div className="text-brand-400 text-3xl font-black">{t("tier_academic_price")}</div>
              <ul className="text-fg-secondary border-border-subtle space-y-2 border-t pt-4 text-xs">
                <li>✓ {t("tier_features_limit")}</li>
                <li>✓ {t("tier_features_support")}</li>
              </ul>
            </CardContent>
          </Card>

          <Card variant="glass" className="border-brand-500/50 relative">
            <div className="bg-brand-500 text-bg-primary absolute -top-3 right-4 rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase">
              Popular
            </div>
            <CardContent className="space-y-4 p-6">
              <div>
                <h3 className="text-fg-primary text-lg font-bold">{t("tier_pro")}</h3>
                <p className="text-fg-muted mt-1 text-xs">{t("tier_pro_desc")}</p>
              </div>
              <div className="text-brand-400 text-3xl font-black">{t("tier_pro_price")}</div>
              <ul className="text-fg-secondary border-border-subtle space-y-2 border-t pt-4 text-xs">
                <li>✓ {t("tier_features_limit_pro")}</li>
                <li>✓ {t("tier_features_support_pro")}</li>
              </ul>
            </CardContent>
          </Card>

          <Card variant="glass">
            <CardContent className="space-y-4 p-6">
              <div>
                <h3 className="text-fg-primary text-lg font-bold">{t("tier_enterprise")}</h3>
                <p className="text-fg-muted mt-1 text-xs">{t("tier_enterprise_desc")}</p>
              </div>
              <div className="text-brand-400 text-3xl font-black">{t("tier_enterprise_price")}</div>
              <ul className="text-fg-secondary border-border-subtle space-y-2 border-t pt-4 text-xs">
                <li>✓ {t("tier_features_limit_ent")}</li>
                <li>✓ {t("tier_features_support_ent")}</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>
    </Container>
  );
}
