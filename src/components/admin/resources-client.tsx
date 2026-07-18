"use client";

import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import {
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Database,
  Server,
  RefreshCw,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { getLiveCapacityMetrics, type CapacityMetrics } from "@/actions/capacity";
import { toast } from "sonner";

interface Vendor {
  id: string;
  name: string;
  category: string;
  plan: string;
  cost: string;
  prosCons: { en: string; tr: string };
  alternatives: { en: string; tr: string };
  url: string;
}

const VENDORS: Vendor[] = [
  {
    id: "vercel",
    name: "Vercel",
    category: "Hosting & Edge",
    plan: "Hobby Plan",
    cost: "$0.00 / mo",
    prosCons: {
      en: "Pro: Zero cost, instant Git deployments. Con: Shared bandwidth, 10s serverless timeout, Hobby team limitations.",
      tr: "Artı: Sıfır maliyet, anında Git dağıtımları. Eksi: Paylaşımlı bant genişliği, 10 saniye sunucusuz işlem zaman aşımı limitleri.",
    },
    alternatives: {
      en: "Netlify (Medium switch cost, DNS changes required), Cloudflare Pages (Low cost, near-zero migration).",
      tr: "Netlify (Orta geçiş maliyeti, DNS değişikliği), Cloudflare Pages (Düşük maliyet, neredeyse sıfır göç).",
    },
    url: "https://vercel.com",
  },
  {
    id: "supabase",
    name: "Supabase",
    category: "Database & Auth",
    plan: "Free Tier",
    cost: "$0.00 / mo",
    prosCons: {
      en: "Pro: Real-time DB, integrated Auth & Storage, auto RLS. Con: 500MB DB limit, project pauses after 7 days inactivity.",
      tr: "Artı: Gerçek zamanlı veri tabanı, entegre Auth & Depolama, otomatik RLS. Eksi: 500MB DB limiti, 7 gün inaktiflikte durma.",
    },
    alternatives: {
      en: "Firebase (High migration cost), AWS Aurora Serverless + Auth0 (Very high switch cost, database refactoring needed).",
      tr: "Firebase (Yüksek geçiş maliyeti), AWS Aurora Serverless + Auth0 (Çok yüksek geçiş maliyeti, şema değişimi gerektirir).",
    },
    url: "https://supabase.com",
  },
  {
    id: "upstash",
    name: "Upstash",
    category: "Redis / Rate Limiting",
    plan: "Free Tier",
    cost: "$0.00 / mo",
    prosCons: {
      en: "Pro: Serverless Redis, zero-maintenance, HTTP client support. Con: 10,000 daily commands ceiling on free tier.",
      tr: "Artı: Sunucusuz Redis, sıfır bakım, HTTP istemci desteği. Eksi: Ücretsiz planda günlük 10.000 komut sınırı.",
    },
    alternatives: {
      en: "Redis Cloud (Low migration cost, URL change only), Self-hosted Redis on Fly.io (Medium complexity, maintenance cost).",
      tr: "Redis Cloud (Düşük geçiş maliyeti, sadece URL değişimi), Fly.io üzerinde kendinden barındırmalı Redis (Orta karmaşıklık).",
    },
    url: "https://upstash.com",
  },
  {
    id: "resend",
    name: "Resend",
    category: "Email Services",
    plan: "Free Tier",
    cost: "$0.00 / mo",
    prosCons: {
      en: "Pro: Modern developer-friendly API, fast deliverability. Con: 3,000 monthly emails limit, domain warm-up needed.",
      tr: "Artı: Geliştirici dostu modern API, hızlı teslimat. Eksi: Aylık 3.000 e-posta limiti, yeni alan adı ısınma ihtiyacı.",
    },
    alternatives: {
      en: "SendGrid (Low migration cost, API client replacement), Mailgun (Medium cost, SMTP configuration change).",
      tr: "SendGrid (Düşük maliyet, API istemci değişimi), Mailgun (Orta maliyet, SMTP yapılandırma değişimi).",
    },
    url: "https://resend.com",
  },
  {
    id: "openrouter",
    name: "OpenRouter",
    category: "AI Gateway",
    plan: "Pay-as-you-go",
    cost: "~$2.00 / mo",
    prosCons: {
      en: "Pro: Single API for 200+ LLMs, auto-fallbacks, detailed logging, token-efficient. Con: Marginal network latency.",
      tr: "Artı: 200+ LLM için tek API, otomatik geri dönüşler, detaylı günlükleme. Eksi: Küçük de olsa ek ağ gecikmesi.",
    },
    alternatives: {
      en: "Direct API Integration (High complexity, separate billing), LiteLLM Proxy (Self-hosted maintenance needed).",
      tr: "Doğrudan API Entegrasyonu (Yüksek karmaşıklık, ayrı faturalar), LiteLLM Proxy (Sunucu bakım maliyeti).",
    },
    url: "https://openrouter.ai",
  },
  {
    id: "huggingface",
    name: "Hugging Face",
    category: "AI Inference & Spaces",
    plan: "Free Hub Tier",
    cost: "$0.00 / mo",
    prosCons: {
      en: "Pro: Host model weights, free inference endpoints for popular models. Con: Rate limits, cold starts on unused spaces.",
      tr: "Artı: Model ağırlıklarını barındırma, popüler modeller için ücretsiz çıkarım. Eksi: Hız limitleri, soğuk başlatma gecikmesi.",
    },
    alternatives: {
      en: "Replicate (Pay-per-second, high minimum cost), AWS SageMaker (Enterprise tier complexity, very high base cost).",
      tr: "Replicate (Saniye başına ödeme, yüksek taban), AWS SageMaker (Kurumsal karmaşıklık, çok yüksek taban maliyeti).",
    },
    url: "https://huggingface.co",
  },
  {
    id: "googlecloud",
    name: "Google Cloud",
    category: "Vertex AI & Cloud Maps",
    plan: "Free Tier Creds",
    cost: "$0.00 / mo",
    prosCons: {
      en: "Pro: Enterprise grade Gemini APIs, Imagen 3 access, high security. Con: Complex billing dashboard, strict IAM.",
      tr: "Artı: Kurumsal sınıf Gemini API'leri, Imagen 3 erişimi, yüksek güvenlik. Eksi: Karmaşık faturalandırma paneli.",
    },
    alternatives: {
      en: "AWS Bedrock (High migration cost, model coverage difference), Azure OpenAI (High compliance cost, enterprise focus).",
      tr: "AWS Bedrock (Yüksek geçiş maliyeti), Azure OpenAI (Yüksek uyumluluk maliyeti, kurumsal odaklı).",
    },
    url: "https://cloud.google.com",
  },
  {
    id: "github",
    name: "GitHub",
    category: "CI/CD & Actions",
    plan: "Free Organization",
    cost: "$0.00 / mo",
    prosCons: {
      en: "Pro: Industry standard VCS, 2,000 free runner mins/mo. Con: Limit on parallel jobs, spending limit configuration required.",
      tr: "Artı: Sektör standardı VCS, aylık 2.000 ücretsiz derleme dakikası. Eksi: Paralel işlerde sınır, harcama limiti.",
    },
    alternatives: {
      en: "GitLab CI (Medium switch cost, pipeline refactoring), Bitbucket Pipelines (Low limit, licensing overhead).",
      tr: "GitLab CI (Orta geçiş maliyeti, boru hattı değişimi), Bitbucket Pipelines (Düşük limit, lisanslama ek yükü).",
    },
    url: "https://github.com",
  },
  {
    id: "sentry",
    name: "Sentry",
    category: "Error & Crash Logs",
    plan: "Developer Free",
    cost: "$0.00 / mo",
    prosCons: {
      en: "Pro: Automatic stack traces, performance monitoring, Next.js SDK. Con: 5,000 errors/mo cap on free tier.",
      tr: "Artı: Otomatik yığın izleri, performans izleme, Next.js SDK. Eksi: Ücretsiz planda aylık 5.000 hata sınırı.",
    },
    alternatives: {
      en: "LogRocket (High cost, session replay focus), GlitchTip (Open source, self-hosting maintenance overhead).",
      tr: "LogRocket (Yüksek maliyet, oturum kaydı odaklı), GlitchTip (Açık kaynak, kendinden barındırma yükü).",
    },
    url: "https://sentry.io",
  },
  {
    id: "turnstile",
    name: "Cloudflare Turnstile",
    category: "Security / Bot Protection",
    plan: "Free Unlimited",
    cost: "$0.00 / mo",
    prosCons: {
      en: "Pro: Non-intrusive CAPTCHA, privacy-focused, zero cost. Con: Requires client-side script tag injection.",
      tr: "Artı: Kullanıcıyı yormayan CAPTCHA, gizlilik odaklı, sıfır maliyet. Eksi: İstemci tarafı script entegrasyonu.",
    },
    alternatives: {
      en: "hCaptcha (Low migration cost, key replacement only), Google reCAPTCHA v3 (Intrusive, privacy concerns).",
      tr: "hCaptcha (Düşük geçiş maliyeti, anahtar değişimi), Google reCAPTCHA v3 (Gizlilik endişeleri).",
    },
    url: "https://www.cloudflare.com/products/turnstile/",
  },
  {
    id: "stripe",
    name: "Stripe",
    category: "Payments Infrastructure",
    plan: "Pay-as-you-go",
    cost: "$0.00 / mo",
    prosCons: {
      en: "Pro: Global payout capabilities, sleek Checkout forms, robust subscription billing API. Con: 2.9% + 30c base fee.",
      tr: "Artı: Küresel ödeme altyapısı, şık Checkout formları, abonelik API'si. Eksi: İşlem başına %2.9 + 30c temel ücret.",
    },
    alternatives: {
      en: "Paddle (Low migration, merchant of record), Adyen (Complex integration, enterprise focus only).",
      tr: "Paddle (Düşük göç maliyeti, kayıtlı satıcı), Adyen (Karmaşık entegrasyon, yalnızca kurumsal odaklı).",
    },
    url: "https://stripe.com",
  },
  {
    id: "resend_domains",
    name: "DNS & Domains",
    category: "Domain Registry",
    plan: "Custom Domain",
    cost: "$12.00 / yr",
    prosCons: {
      en: "Pro: Identity sovereignty, required for brand outreach emails and SSL certs. Con: Annual recurring renewal cost.",
      tr: "Artı: Kimlik egemenliği, kurumsal e-postalar ve SSL sertifikaları için zorunlu. Eksi: Yıllık yenileme maliyeti.",
    },
    alternatives: {
      en: "Namecheap (Low migration cost, DNS transfer), GoDaddy (High renewal cost, aggressive upselling).",
      tr: "Namecheap (Düşük göç maliyeti, DNS transferi), GoDaddy (Yüksek yenileme maliyeti, agresif satış stratejileri).",
    },
    url: "https://resend.com/domains",
  },
  {
    id: "umami",
    name: "Umami Analytics",
    category: "Analytics & Telemetry",
    plan: "Free Cloud Tier",
    cost: "$0.00 / mo",
    prosCons: {
      en: "Pro: Privacy-friendly, GDPR/KVKK compliant, open-source engine, lightweight script. Con: 10,000 monthly events limit.",
      tr: "Artı: Gizlilik dostu, GDPR/KVKK uyumlu, hafif izleme betiği. Eksi: Ücretsiz planda aylık 10.000 olay sınırı.",
    },
    alternatives: {
      en: "Plausible Analytics (Paid only, high base cost), Google Analytics 4 (Intrusive, GDPR compliance issues).",
      tr: "Plausible Analytics (Yalnızca ücretli, yüksek taban), Google Analytics 4 (KVKK/GDPR uyum sorunları).",
    },
    url: "https://umami.is",
  },
  {
    id: "slack",
    name: "Slack Webhooks",
    category: "Operational Alerts",
    plan: "Free Workspace",
    cost: "$0.00 / mo",
    prosCons: {
      en: "Pro: Real-time incident & whitelist notifications directly to development channels. Con: 10k messages history limit.",
      tr: "Artı: Geliştirici kanallarına gerçek zamanlı bildirimler ve uyarılar. Eksi: 10 bin mesajlık geçmiş sınırı.",
    },
    alternatives: {
      en: "Discord Webhooks (Zero cost, minor payload structure adjustment), Telegram Bot API (Very low switch cost).",
      tr: "Discord Webhooks (Sıfır maliyet, küçük yapı değişikliği), Telegram Bot API (Çok düşük geçiş maliyeti).",
    },
    url: "https://slack.com",
  },
  {
    id: "openai",
    name: "OpenAI API",
    category: "Evaluation Fallback",
    plan: "Pay-as-you-go",
    cost: "~$1.00 / mo",
    prosCons: {
      en: "Pro: Standard GPT-4o capabilities, robust JSON schemas. Con: Strictly paid-only tier, require prepaid credits.",
      tr: "Artı: Standart GPT-4o yetenekleri, kararlı JSON şemaları. Eksi: Yalnızca ücretli kullanım, ön ödemeli kredi.",
    },
    alternatives: {
      en: "Anthropic API (High migration cost, prompt differences), DeepSeek API (Low cost, compatibility mode available).",
      tr: "Anthropic API (Yüksek geçiş maliyeti, prompt farkları), DeepSeek API (Düşük maliyet, uyumluluk modu).",
    },
    url: "https://openai.com",
  },
];

export function ResourcesClient({ locale }: { locale: string }) {
  const t = useTranslations("admin");
  const [metrics, setMetrics] = useState<CapacityMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function fetchMetrics(silent = false) {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const data = await getLiveCapacityMetrics();
      setMetrics(data);
    } catch (err: unknown) {
      toast.error(t("error_fetching_metrics") || "Failed to load live capacity metrics");
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    fetchMetrics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isTR = locale === "tr";

  // Calculate status based on thresholds
  let systemStatus: "operational" | "warning" | "degraded" = "operational";
  let maxUsage = 0;

  if (metrics) {
    maxUsage = Math.max(
      metrics.supabaseDb.percentage,
      metrics.supabaseStorage.percentage,
      metrics.vercelDeploys.percentage,
      metrics.vercelCrons.percentage,
      metrics.upstashRedis.percentage,
      metrics.resendEmails.percentage,
    );

    if (maxUsage > 80) systemStatus = "degraded";
    else if (maxUsage > 60) systemStatus = "warning";
  }

  const renderProgressBar = (percentage: number) => {
    let color = "bg-emerald-500";
    if (percentage > 80) color = "bg-rose-500";
    else if (percentage > 60) color = "bg-amber-500";

    return (
      <div className="mt-2 w-full">
        <div className="bg-bg-tertiary h-2.5 w-full rounded-full">
          <div
            className={`h-2.5 rounded-full transition-all duration-500 ${color}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  };

  const getUsageColorClass = (percentage: number) => {
    if (percentage > 80) return "text-rose-400";
    if (percentage > 60) return "text-amber-400";
    return "text-emerald-400";
  };

  return (
    <div className="space-y-8 p-4 lg:p-8">
      {/* Header Section */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="inline-flex items-center gap-2 text-3xl font-black tracking-tight text-white">
            <Server className="text-brand-400 h-8 w-8" />
            {t("resources_title")}
          </h1>
          <p className="text-fg-secondary mt-2 text-sm">{t("resources_subtitle")}</p>
        </div>
        <button
          onClick={() => fetchMetrics(true)}
          disabled={refreshing || loading}
          className="bg-bg-secondary hover:bg-bg-tertiary border-border-subtle inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-bold text-white transition duration-200 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          {t("integrations_refresh")}
        </button>
      </div>

      {/* System Health Status Banner */}
      <div
        className={`rounded-r-xl border-l-4 p-4 backdrop-blur-xl ${
          systemStatus === "operational"
            ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
            : systemStatus === "warning"
              ? "border-amber-500 bg-amber-500/10 text-amber-400"
              : "border-rose-500 bg-rose-500/10 text-rose-400"
        }`}
      >
        <div className="flex items-center gap-3">
          {systemStatus === "operational" ? (
            <CheckCircle2 className="h-6 w-6" />
          ) : systemStatus === "warning" ? (
            <AlertTriangle className="h-6 w-6" />
          ) : (
            <AlertCircle className="h-6 w-6" />
          )}
          <div>
            <h3 className="font-bold">
              {t("resources_system_health")}
              {systemStatus === "operational"
                ? t("resources_status_operational")
                : systemStatus === "warning"
                  ? t("resources_status_warning")
                  : t("resources_status_degraded")}
            </h3>
            <p className="mt-1 text-xs opacity-90">
              {t("resources_health_desc", { percentage: maxUsage.toFixed(1) })}
            </p>
          </div>
        </div>
      </div>

      {/* Live Capacity Dashboard Bento Grid */}
      <div className="bg-bg-secondary border-border-subtle rounded-xl border p-6">
        <h2 className="mb-6 flex items-center gap-2 text-lg font-bold tracking-tight text-white">
          <Database className="text-brand-400 h-5 w-5" />
          {t("resources_live_telemetry")}
        </h2>

        {loading ? (
          <div className="text-fg-muted animate-pulse py-8 text-center font-mono text-sm">
            {t("resources_loading")}
          </div>
        ) : !metrics ? (
          <div className="py-8 text-center font-mono text-sm text-rose-400">
            {t("resources_error")}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Supabase DB */}
            <div className="bg-bg-tertiary/20 flex flex-col justify-between rounded-xl border border-white/5 p-5">
              <div>
                <div className="flex items-start justify-between">
                  <span className="text-sm font-bold text-white">{t("resources_db_size")}</span>
                  <Badge
                    variant="outline"
                    className={getUsageColorClass(metrics.supabaseDb.percentage)}
                  >
                    {metrics.supabaseDb.percentage.toFixed(1)}%
                  </Badge>
                </div>
                <p className="text-fg-muted mt-1 font-mono text-xs">
                  {(metrics.supabaseDb.usedBytes / 1024 / 1024).toFixed(2)} MB /{" "}
                  {t("resources_db_size_limit")}
                </p>
              </div>
              {renderProgressBar(metrics.supabaseDb.percentage)}
            </div>

            {/* Supabase Storage */}
            <div className="bg-bg-tertiary/20 flex flex-col justify-between rounded-xl border border-white/5 p-5">
              <div>
                <div className="flex items-start justify-between">
                  <span className="text-sm font-bold text-white">
                    {t("resources_storage_size")}
                  </span>
                  <Badge
                    variant="outline"
                    className={getUsageColorClass(metrics.supabaseStorage.percentage)}
                  >
                    {metrics.supabaseStorage.percentage.toFixed(1)}%
                  </Badge>
                </div>
                <p className="text-fg-muted mt-1 font-mono text-xs">
                  {(metrics.supabaseStorage.usedBytes / 1024 / 1024).toFixed(2)} MB /{" "}
                  {t("resources_storage_limit")}
                </p>
              </div>
              {renderProgressBar(metrics.supabaseStorage.percentage)}
            </div>

            {/* Upstash Redis */}
            <div className="bg-bg-tertiary/20 flex flex-col justify-between rounded-xl border border-white/5 p-5">
              <div>
                <div className="flex items-start justify-between">
                  <span className="text-sm font-bold text-white">
                    {t("resources_redis_commands")}
                  </span>
                  <Badge
                    variant="outline"
                    className={getUsageColorClass(metrics.upstashRedis.percentage)}
                  >
                    {metrics.upstashRedis.percentage.toFixed(1)}%
                  </Badge>
                </div>
                <p className="text-fg-muted mt-1 font-mono text-xs">
                  {t("resources_redis_limit_val", {
                    used: metrics.upstashRedis.used.toLocaleString(),
                    limit: metrics.upstashRedis.limit.toLocaleString(),
                  })}
                </p>
              </div>
              {renderProgressBar(metrics.upstashRedis.percentage)}
              <span className="text-fg-muted mt-2 block text-right font-mono text-[10px]">
                {t("resources_redis_last_verified", { date: metrics.upstashRedis.lastVerified })}
              </span>
            </div>

            {/* Resend Email */}
            <div className="bg-bg-tertiary/20 flex flex-col justify-between rounded-xl border border-white/5 p-5">
              <div>
                <div className="flex items-start justify-between">
                  <span className="text-sm font-bold text-white">{t("resources_emails_sent")}</span>
                  <Badge
                    variant="outline"
                    className={getUsageColorClass(metrics.resendEmails.percentage)}
                  >
                    {metrics.resendEmails.percentage.toFixed(1)}%
                  </Badge>
                </div>
                <p className="text-fg-muted mt-1 font-mono text-xs">
                  {t("resources_emails_sent_val", {
                    used: metrics.resendEmails.used,
                    limit: metrics.resendEmails.limit,
                  })}
                </p>
              </div>
              {renderProgressBar(metrics.resendEmails.percentage)}
            </div>

            {/* AI Gateway Spend */}
            <div className="bg-bg-tertiary/20 flex flex-col justify-between rounded-xl border border-white/5 p-5 lg:col-span-2">
              <div>
                <div className="flex items-start justify-between">
                  <span className="text-sm font-bold text-white">
                    {t("resources_ai_gateway_ceiling")}
                  </span>
                  <div className="flex gap-2">
                    <Badge
                      variant="outline"
                      className={getUsageColorClass(
                        (metrics.aiGateway.dailyUsed / metrics.aiGateway.dailyLimit) * 100,
                      )}
                    >
                      {t("resources_ai_runs_daily")}
                      {((metrics.aiGateway.dailyUsed / metrics.aiGateway.dailyLimit) * 100).toFixed(
                        1,
                      )}
                      %
                    </Badge>
                    <Badge
                      variant="outline"
                      className={getUsageColorClass(
                        (metrics.aiGateway.monthlyUsed / metrics.aiGateway.monthlyLimit) * 100,
                      )}
                    >
                      {t("resources_ai_runs_monthly")}
                      {(
                        (metrics.aiGateway.monthlyUsed / metrics.aiGateway.monthlyLimit) *
                        100
                      ).toFixed(1)}
                      %
                    </Badge>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-fg-muted block text-xs">
                      {t("resources_today_spend")}
                    </span>
                    <span className="font-mono text-lg font-bold text-white">
                      ${metrics.aiGateway.dailyUsed.toFixed(4)} / $10.00 {t("resources_today_cap")}
                    </span>
                  </div>
                  <div>
                    <span className="text-fg-muted block text-xs">
                      {t("resources_month_spend")}
                    </span>
                    <span className="font-mono text-lg font-bold text-white">
                      ${metrics.aiGateway.monthlyUsed.toFixed(4)} / $30.00{" "}
                      {t("resources_month_cap")}
                    </span>
                  </div>
                </div>
              </div>
              {renderProgressBar(Math.min(((metrics.aiGateway.monthlyUsed || 0) / 30) * 100, 100))}
            </div>
          </div>
        )}
      </div>

      {/* Row Counts & Info Bento Section */}
      {metrics && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="bg-bg-secondary border-border-subtle rounded-xl border p-5">
            <span className="text-fg-muted text-xs font-bold tracking-wide uppercase">
              {t("resources_incident_count")}
            </span>
            <p className="mt-2 font-mono text-2xl font-black text-white">
              {metrics.rowCounts.incidents.toLocaleString()}
            </p>
          </div>
          <div className="bg-bg-secondary border-border-subtle rounded-xl border p-5">
            <span className="text-fg-muted text-xs font-bold tracking-wide uppercase">
              {t("resources_scores_count")}
            </span>
            <p className="mt-2 font-mono text-2xl font-black text-white">
              {metrics.rowCounts.kModelScores.toLocaleString()}
            </p>
          </div>
          <div className="bg-bg-secondary border-border-subtle rounded-xl border p-5">
            <span className="text-fg-muted text-xs font-bold tracking-wide uppercase">
              {t("resources_queue_size")}
            </span>
            <p className="mt-2 font-mono text-2xl font-black text-white">
              {metrics.rowCounts.externalIncidentsQueue.toLocaleString()}
            </p>
          </div>
        </div>
      )}

      {/* Handover Vendors Catalog Table */}
      <div className="bg-bg-secondary border-border-subtle overflow-hidden rounded-xl border">
        <div className="border-border-subtle border-b px-6 py-4">
          <h2 className="text-lg font-bold tracking-tight text-white">
            {t("resources_providers_pricing")}
          </h2>
          <p className="text-fg-muted mt-1 text-xs">{t("resources_providers_pricing_subtitle")}</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="bg-bg-tertiary/50 border-border-subtle text-fg-muted border-b text-xs font-bold tracking-wider uppercase">
                <th className="px-6 py-4">{t("resources_col_vendor")}</th>
                <th className="px-6 py-4">{t("resources_col_plan")}</th>
                <th className="px-6 py-4">{t("resources_col_cost")}</th>
                <th className="px-6 py-4">{t("resources_col_proscons")}</th>
                <th className="px-6 py-4">{t("resources_col_alternatives")}</th>
              </tr>
            </thead>
            <tbody className="divide-border-subtle divide-y">
              {VENDORS.map((v) => (
                <tr key={v.id} className="hover:bg-bg-tertiary/20 transition-colors">
                  {/* Name */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 font-bold text-white">
                      {v.name}
                      <a
                        href={v.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-400 hover:text-brand-300"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                    <span className="text-fg-muted mt-0.5 block text-xs">{v.category}</span>
                  </td>
                  {/* Plan */}
                  <td className="text-fg-primary px-6 py-4 font-mono text-xs">
                    <Badge variant="outline" className="border-white/10 bg-white/5 text-white">
                      {v.plan}
                    </Badge>
                  </td>
                  {/* Cost */}
                  <td className="text-fg-primary px-6 py-4 font-mono text-sm font-bold">
                    {v.cost}
                  </td>
                  {/* Pros & Cons */}
                  <td className="text-fg-muted max-w-sm px-6 py-4 text-xs">
                    {isTR ? v.prosCons.tr : v.prosCons.en}
                  </td>
                  {/* Alternatives */}
                  <td className="text-fg-muted max-w-sm px-6 py-4 text-xs">
                    {isTR ? v.alternatives.tr : v.alternatives.en}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
