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
      en: "Pro: Multi-model failover chains, single API key, competitive pricing. Con: Gateway latency overhead (50-200ms).",
      tr: "Artı: Çoklu model hata toleransı zinciri, tek API anahtarı. Eksi: Gateway kaynaklı gecikme yükü (50-200ms).",
    },
    alternatives: {
      en: "Direct OpenAI/Anthropic/DeepSeek API keys (Medium switch cost, necessitates multiple client implementations).",
      tr: "Doğrudan OpenAI/Anthropic/DeepSeek API entegrasyonu (Orta maliyet, kodda çoklu istemci yapısı gerektirir).",
    },
    url: "https://openrouter.ai",
  },
  {
    id: "vertex",
    name: "Google Vertex / Gemini",
    category: "AI Models",
    plan: "Pay-as-you-go",
    cost: "~$1.00 / mo",
    prosCons: {
      en: "Pro: Huge context window, native multimodal support. Con: Complex enterprise billing, regional quota limitations.",
      tr: "Artı: Devasa bağlam penceresi, yerel multimodel desteği. Eksi: Karmaşık kurumsal faturalandırma, bölgesel kota sınırları.",
    },
    alternatives: {
      en: "OpenRouter Gemini endpoint (Low migration), Google AI Studio (Low cost, API key change).",
      tr: "OpenRouter Gemini uç noktası (Düşük göç maliyeti), Google AI Studio (Düşük maliyet, API anahtarı değişimi).",
    },
    url: "https://console.cloud.google.com/vertex-ai",
  },
  {
    id: "cloudflare",
    name: "Cloudflare",
    category: "Security & CAPTCHA",
    plan: "Free Plan",
    cost: "$0.00 / mo",
    prosCons: {
      en: "Pro: Turnstile is non-intrusive CAPTCHA, robust DNS and DDoS protection. Con: Analytics are aggregated on free tier.",
      tr: "Artı: Turnstile kullanıcıyı yormayan CAPTCHA sunar, güçlü DNS ve DDoS koruması. Eksi: Ücretsiz planda analitik kısıtlıdır.",
    },
    alternatives: {
      en: "hCaptcha (Low switch cost, client library swap), Google reCAPTCHA (Low switch cost but user-friction concerns).",
      tr: "hCaptcha (Düşük geçiş maliyeti, kütüphane değişimi), Google reCAPTCHA (Düşük maliyet ancak kullanıcı deneyimi sıkıntıları).",
    },
    url: "https://dash.cloudflare.com",
  },
  {
    id: "sentry",
    name: "Sentry",
    category: "Observability",
    plan: "Developer Plan",
    cost: "$0.00 / mo",
    prosCons: {
      en: "Pro: Deep stack traces, Next.js integration, performance profiling. Con: High bandwidth log usage, quickly hits monthly caps.",
      tr: "Artı: Derin yığın izleri, Next.js entegrasyonu, performans profili. Eksi: Yüksek log hacminde aylık kotayı hızla aşar.",
    },
    alternatives: {
      en: "GlitchTip (Open-source self-hosted alternative, low cost), LogRocket (High cost, heavy client payload).",
      tr: "GlitchTip (Açık kaynak kendinden barındırmalı alternatif, düşük maliyet), LogRocket (Yüksek maliyet, ağır kod yükü).",
    },
    url: "https://sentry.io",
  },
  {
    id: "plausible",
    name: "Plausible Analytics",
    category: "Analytics",
    plan: "Self-Hosted",
    cost: "$0.00 / mo",
    prosCons: {
      en: "Pro: Privacy-friendly, no cookies needed, lightweight script (<1KB). Con: No user segmentation, requires Docker hosting.",
      tr: "Artı: Gizlilik dostu, çerez gerektirmez, son derece hafif betik (<1KB). Eksi: Kullanıcı segmentasyonu yok, Docker barındırma ister.",
    },
    alternatives: {
      en: "Plausible Cloud ($9/mo, zero maintenance), Umami Analytics (Self-hosted or cloud, low migration cost).",
      tr: "Plausible Cloud (Aylık 9$, sıfır bakım), Umami Analytics (Kendinden barındırmalı veya bulut, düşük geçiş maliyeti).",
    },
    url: "https://plausible.io",
  },
  {
    id: "stripe",
    name: "Stripe",
    category: "Payments",
    plan: "Pay-as-you-go",
    cost: "2.9% + $0.30",
    prosCons: {
      en: "Pro: Industry standard, clean subscriptions portal. Con: High fees compared to local gateways in Turkey.",
      tr: "Artı: Sektör standardı abonelik altyapısı, kolay entegrasyon. Eksi: Türkiye'deki yerel ödeme geçitlerine göre yüksek komisyon.",
    },
    alternatives: {
      en: "Adyen (High implementation cost), iyzico (For TR home market, lower transaction fees but separate dashboard).",
      tr: "Adyen (Yüksek kurulum maliyeti), iyzico (TR pazarı için daha düşük işlem ücretleri, ayrı yönetim paneli).",
    },
    url: "https://stripe.com",
  },
  {
    id: "anthropic",
    name: "Anthropic",
    category: "AI Models",
    plan: "Pay-as-you-go",
    cost: "~$1.50 / mo",
    prosCons: {
      en: "Pro: Claude 3.5 Sonnet offers exceptional logic & code generation. Con: Premium API cost, strict rate limiting.",
      tr: "Artı: Claude 3.5 Sonnet olağanüstü mantık ve kod üretimi sunar. Eksi: Pahalı API maliyeti, katı istek hız limitleri.",
    },
    alternatives: {
      en: "OpenRouter Claude endpoint (Near-zero switch cost), OpenAI GPT-4o (Low cost, prompt adaptation required).",
      tr: "OpenRouter Claude uç noktası (Sıfır göç maliyeti), OpenAI GPT-4o (Düşük maliyet, istemlerin uyarlanması gerekir).",
    },
    url: "https://console.anthropic.com",
  },
  {
    id: "openai",
    name: "OpenAI",
    category: "AI Models",
    plan: "Pay-as-you-go",
    cost: "~$1.00 / mo",
    prosCons: {
      en: "Pro: Low latency, excellent structured outputs support. Con: Subnet censorship, model drift over time.",
      tr: "Artı: Düşük gecikme süresi, mükemmel yapılandırılmış çıktı desteği. Eksi: Ağ sansürleri, zaman içinde model kayması.",
    },
    alternatives: {
      en: "OpenRouter GPT-4o endpoint (Low migration), Anthropic Claude 3.5 (Medium cost, prompt adaptation needed).",
      tr: "OpenRouter GPT-4o uç noktası (Düşük göç), Anthropic Claude 3.5 (Orta maliyet, istem uyarlama ihtiyacı).",
    },
    url: "https://platform.openai.com",
  },
  {
    id: "blackbox",
    name: "Blackbox AI",
    category: "AI Models",
    plan: "Free Tier",
    cost: "$0.00 / mo",
    prosCons: {
      en: "Pro: Specialized code assistant model fallback. Con: Lower reasoning quality for general strategy tasks.",
      tr: "Artı: Özel kod asistanı modeli yedekleme imkanı. Eksi: Genel strateji görevleri için daha düşük muhakeme kalitesi.",
    },
    alternatives: {
      en: "GitHub Copilot (Paid subscription), DeepSeek Coder (Low cost, high quality alternative).",
      tr: "GitHub Copilot (Ücretli abonelik), DeepSeek Coder (Düşük maliyetli, yüksek kaliteli alternatif).",
    },
    url: "https://blackbox.ai",
  },
  {
    id: "huggingface",
    name: "Hugging Face",
    category: "AI Image & Models",
    plan: "Free API",
    cost: "$0.00 / mo",
    prosCons: {
      en: "Pro: Open-source model access, FLUX.1-schnell image generation. Con: Shared rate limits, intermittent down times.",
      tr: "Artı: Açık kaynaklı model erişimi, FLUX.1-schnell görsel üretimi. Eksi: Paylaşımlı hız limitleri, zaman zaman kesintiler.",
    },
    alternatives: {
      en: "Replicate (Pay-as-you-go, high reliability), Vertex Imagen (Higher cost, enterprise quota).",
      tr: "Replicate (Kullanım başı ödeme, yüksek güvenilirlik), Vertex Imagen (Daha yüksek maliyet, kurumsal kota).",
    },
    url: "https://huggingface.co",
  },
  {
    id: "github",
    name: "GitHub",
    category: "VCS & CI",
    plan: "Free Plan",
    cost: "$0.00 / mo",
    prosCons: {
      en: "Pro: Industry standard hosting, free actions runners (2000 mins). Con: Closed-source organization features require paid upgrades.",
      tr: "Artı: Sektör standardı barındırma, ücretsiz CI koşucuları (2000 dk). Eksi: Kapalı kaynak organizasyon özellikleri ücretlidir.",
    },
    alternatives: {
      en: "GitLab (Medium migration complexity, CI yaml rewrite), Bitbucket (Low cost, inferior integration ecosystem).",
      tr: "GitLab (Orta göç karmaşıklığı, CI yaml yeniden yazımı), Bitbucket (Düşük maliyet, yetersiz entegrasyon ekosistemi).",
    },
    url: "https://github.com",
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

  const isTurkish = locale === "tr";

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
            {isTurkish ? "Platform Kaynakları ve Sağlayıcılar" : "Platform Resources & Vendors"}
          </h1>
          <p className="text-fg-secondary mt-2 text-sm">
            {isTurkish
              ? "15 aktif ALPAR AI altyapı sağlayıcısını ve canlı sunucu kapasite kullanım oranlarını izleyin."
              : "Monitor status, metrics, and dashboards for all 15 active ALPAR AI infrastructure vendors."}
          </p>
        </div>
        <button
          onClick={() => fetchMetrics(true)}
          disabled={refreshing || loading}
          className="bg-bg-secondary hover:bg-bg-tertiary border-border-subtle inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-bold text-white transition duration-200 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          {isTurkish ? "Tazele" : "Refresh"}
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
              {isTurkish ? "Sistem Sağlığı: " : "System Health: "}
              {systemStatus === "operational"
                ? isTurkish
                  ? "Tüm Servisler Normal"
                  : "Operational"
                : systemStatus === "warning"
                  ? isTurkish
                    ? "Kapasite Uyarısı"
                    : "Capacity Warning"
                  : isTurkish
                    ? "Kritik Aşım"
                    : "Degraded Performance"}
            </h3>
            <p className="mt-1 text-xs opacity-90">
              {isTurkish
                ? `Maksimum kaynak doluluk oranı: %${maxUsage.toFixed(1)}. Limit aşımlarını engellemek için kontrolleri sıklaştırın.`
                : `Maximum resource allocation stands at ${maxUsage.toFixed(1)}%. Track closely to prevent usage lockouts.`}
            </p>
          </div>
        </div>
      </div>

      {/* Live Capacity Dashboard Bento Grid */}
      <div className="bg-bg-secondary border-border-subtle rounded-xl border p-6">
        <h2 className="mb-6 flex items-center gap-2 text-lg font-bold tracking-tight text-white">
          <Database className="text-brand-400 h-5 w-5" />
          {isTurkish ? "Canlı Kapasite Göstergeleri" : "Live Capacity Telemetry"}
        </h2>

        {loading ? (
          <div className="text-fg-muted animate-pulse py-8 text-center font-mono text-sm">
            {isTurkish
              ? "Canlı kapasite verileri sorgulanıyor..."
              : "Fetching live capacity metrics..."}
          </div>
        ) : !metrics ? (
          <div className="py-8 text-center font-mono text-sm text-rose-400">
            {isTurkish ? "Veriler yüklenemedi." : "Could not load metrics."}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Supabase DB */}
            <div className="bg-bg-tertiary/20 flex flex-col justify-between rounded-xl border border-white/5 p-5">
              <div>
                <div className="flex items-start justify-between">
                  <span className="text-sm font-bold text-white">
                    {isTurkish ? "Supabase Veritabanı Boyutu" : "Supabase Database size"}
                  </span>
                  <Badge
                    variant="outline"
                    className={getUsageColorClass(metrics.supabaseDb.percentage)}
                  >
                    {metrics.supabaseDb.percentage.toFixed(1)}%
                  </Badge>
                </div>
                <p className="text-fg-muted mt-1 font-mono text-xs">
                  {(metrics.supabaseDb.usedBytes / 1024 / 1024).toFixed(2)} MB /{" "}
                  {isTurkish ? "500 MB limiti" : "500 MB limit"}
                </p>
              </div>
              {renderProgressBar(metrics.supabaseDb.percentage)}
            </div>

            {/* Supabase Storage */}
            <div className="bg-bg-tertiary/20 flex flex-col justify-between rounded-xl border border-white/5 p-5">
              <div>
                <div className="flex items-start justify-between">
                  <span className="text-sm font-bold text-white">
                    {isTurkish ? "Supabase Depolama" : "Supabase Storage"}
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
                  {isTurkish ? "1,024 MB limiti" : "1,024 MB limit"}
                </p>
              </div>
              {renderProgressBar(metrics.supabaseStorage.percentage)}
            </div>

            {/* Upstash Redis */}
            <div className="bg-bg-tertiary/20 flex flex-col justify-between rounded-xl border border-white/5 p-5">
              <div>
                <div className="flex items-start justify-between">
                  <span className="text-sm font-bold text-white">
                    {isTurkish ? "Upstash Redis Komutları" : "Upstash Redis Commands"}
                  </span>
                  <Badge
                    variant="outline"
                    className={getUsageColorClass(metrics.upstashRedis.percentage)}
                  >
                    {metrics.upstashRedis.percentage.toFixed(1)}%
                  </Badge>
                </div>
                <p className="text-fg-muted mt-1 font-mono text-xs">
                  {isTurkish
                    ? `${metrics.upstashRedis.used.toLocaleString()} / ${metrics.upstashRedis.limit.toLocaleString()} komut/gün`
                    : `${metrics.upstashRedis.used.toLocaleString()} / ${metrics.upstashRedis.limit.toLocaleString()} commands/day`}
                </p>
              </div>
              {renderProgressBar(metrics.upstashRedis.percentage)}
              <span className="text-fg-muted mt-2 block text-right font-mono text-[10px]">
                {isTurkish
                  ? `Son Doğrulama: ${metrics.upstashRedis.lastVerified} (Manuel Giriş)`
                  : `Last Verified: ${metrics.upstashRedis.lastVerified} (Manual Entry)`}
              </span>
            </div>

            {/* Resend Email */}
            <div className="bg-bg-tertiary/20 flex flex-col justify-between rounded-xl border border-white/5 p-5">
              <div>
                <div className="flex items-start justify-between">
                  <span className="text-sm font-bold text-white">
                    {isTurkish ? "Resend E-posta Gönderimi" : "Resend Emails Sent"}
                  </span>
                  <Badge
                    variant="outline"
                    className={getUsageColorClass(metrics.resendEmails.percentage)}
                  >
                    {metrics.resendEmails.percentage.toFixed(1)}%
                  </Badge>
                </div>
                <p className="text-fg-muted mt-1 font-mono text-xs">
                  {isTurkish
                    ? `${metrics.resendEmails.used} / ${metrics.resendEmails.limit} gönderildi (aylık)`
                    : `${metrics.resendEmails.used} / ${metrics.resendEmails.limit} sent (monthly)`}
                </p>
              </div>
              {renderProgressBar(metrics.resendEmails.percentage)}
            </div>

            {/* AI Gateway Spend */}
            <div className="bg-bg-tertiary/20 flex flex-col justify-between rounded-xl border border-white/5 p-5 lg:col-span-2">
              <div>
                <div className="flex items-start justify-between">
                  <span className="text-sm font-bold text-white">
                    {isTurkish
                      ? "AI Gateway Maliyet Tavanı (Kural #20)"
                      : "AI Gateway Cost ceiling (Rule #20)"}
                  </span>
                  <div className="flex gap-2">
                    <Badge
                      variant="outline"
                      className={getUsageColorClass(
                        (metrics.aiGateway.dailyUsed / metrics.aiGateway.dailyLimit) * 100,
                      )}
                    >
                      {isTurkish ? "Günlük: " : "Daily: "}
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
                      {isTurkish ? "Aylık: " : "Monthly: "}
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
                      {isTurkish ? "Bugünkü Harcama" : "Today Spend"}
                    </span>
                    <span className="font-mono text-lg font-bold text-white">
                      ${metrics.aiGateway.dailyUsed.toFixed(4)} / $10.00{" "}
                      {isTurkish ? "sınır" : "cap"}
                    </span>
                  </div>
                  <div>
                    <span className="text-fg-muted block text-xs">
                      {isTurkish ? "Bu Ayki Harcama" : "This Month Spend"}
                    </span>
                    <span className="font-mono text-lg font-bold text-white">
                      ${metrics.aiGateway.monthlyUsed.toFixed(4)} / $30.00{" "}
                      {isTurkish ? "sınır" : "cap"}
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
              {isTurkish ? "Olay Kayıt Sayısı" : "Incidents Row Count"}
            </span>
            <p className="mt-2 font-mono text-2xl font-black text-white">
              {metrics.rowCounts.incidents.toLocaleString()}
            </p>
          </div>
          <div className="bg-bg-secondary border-border-subtle rounded-xl border p-5">
            <span className="text-fg-muted text-xs font-bold tracking-wide uppercase">
              {isTurkish ? "K-Model Puan Sayısı" : "K-Model Scores Count"}
            </span>
            <p className="mt-2 font-mono text-2xl font-black text-white">
              {metrics.rowCounts.kModelScores.toLocaleString()}
            </p>
          </div>
          <div className="bg-bg-secondary border-border-subtle rounded-xl border p-5">
            <span className="text-fg-muted text-xs font-bold tracking-wide uppercase">
              {isTurkish ? "Harici Kuyruk Boyutu" : "External Queue size"}
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
            {isTurkish
              ? "15 Altyapı ve AI Sağlayıcı Kataloğu"
              : "15 Infrastructure & AI Vendors Catalog"}
          </h2>
          <p className="text-fg-muted mt-1 text-xs">
            {isTurkish
              ? "Her bir bağımlılığın rolü, maliyeti, artı/eksi yönleri ve alternatif geçiş seçenekleri."
              : "Core vendor matrices, pricing, pros/cons, and cost/complexity transition options."}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="bg-bg-tertiary/50 border-border-subtle text-fg-muted border-b text-xs font-bold tracking-wider uppercase">
                <th className="px-6 py-4">
                  {isTurkish ? "Sağlayıcı / Kategori" : "Vendor / Category"}
                </th>
                <th className="px-6 py-4">{isTurkish ? "Paket / Plan" : "Plan / Tier"}</th>
                <th className="px-6 py-4">{isTurkish ? "Aylık Maliyet" : "Monthly Cost"}</th>
                <th className="px-6 py-4">{isTurkish ? "Artı ve Eksi Yönleri" : "Pros / Cons"}</th>
                <th className="px-6 py-4">
                  {isTurkish ? "Alternatifler & Geçiş Maliyeti" : "Alternatives & Switch Costs"}
                </th>
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
                    {isTurkish ? v.prosCons.tr : v.prosCons.en}
                  </td>
                  {/* Alternatives */}
                  <td className="text-fg-muted max-w-sm px-6 py-4 text-xs">
                    {isTurkish ? v.alternatives.tr : v.alternatives.en}
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
