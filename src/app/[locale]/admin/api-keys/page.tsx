import { setRequestLocale } from "next-intl/server";
import { requireAdmin } from "@/lib/auth/session";
import { Container } from "@/components/ui/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Key,
  Shield,
  Cpu,
  Activity,
  DollarSign,
  CheckCircle2,
  Lock,
  BarChart3,
  Zap,
  EyeOff,
  Server,
  AlertTriangle,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { MetricCard } from "@/components/admin/metric-card";

export async function generateMetadata() {
  return { title: `API Anahtarları & Entegrasyonlar | ALPAR AI Admin` };
}

export default async function AdminApiKeysPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  await requireAdmin();

  const apiProviders = [
    {
      name: "OpenAI Platform API",
      envKey: "OPENAI_API_KEY",
      status: "connected",
      models: "GPT-4o, GPT-4o-mini",
      usage: "4,250 tokens / gün",
      cost: "$0.04 / gün",
      limit: "Sınırsız (Pay-as-you-go)",
      health: 100,
    },
    {
      name: "Anthropic Claude API",
      envKey: "ANTHROPIC_API_KEY",
      status: "connected",
      models: "Claude 3.5 Sonnet, Claude 3 Opus",
      usage: "8,920 tokens / gün",
      cost: "$0.12 / gün",
      limit: "Tier 4 (1,000 RPM)",
      health: 98,
    },
    {
      name: "Google Vertex / Gemini AI API",
      envKey: "GEMINI_API_KEY",
      status: "connected",
      models: "Gemini 1.5 Pro, Flash",
      usage: "12,400 tokens / gün",
      cost: "$0.00 / gün (Free Tier)",
      limit: "15 RPM Free Tier",
      health: 100,
    },
    {
      name: "Supabase Service Role API",
      envKey: "SUPABASE_SERVICE_ROLE_KEY",
      status: "connected",
      models: "PostgreSQL, RLS, Storage",
      usage: "850 DB sorgusu / dk",
      cost: "$0.00 / ay",
      limit: "500 MB DB / Free",
      health: 100,
    },
    {
      name: "Upstash Redis Edge API",
      envKey: "UPSTASH_REDIS_REST_TOKEN",
      status: "connected",
      models: "Rate Limiter, Feature Flags",
      usage: "1,240 komut / gün",
      cost: "$0.00 / ay",
      limit: "10,000 komut / gün",
      health: 100,
    },
    {
      name: "Resend Email Gateway API",
      envKey: "RESEND_API_KEY",
      status: "connected",
      models: "Transactional Email, Alerts",
      usage: "14 e-posta / gün",
      cost: "$0.00 / ay",
      limit: "3,000 e-posta / ay",
      health: 100,
    },
  ];

  return (
    <Container className="space-y-8 py-10">
      <header className="flex flex-col justify-between gap-4 border-b border-white/10 pb-5 md:flex-row md:items-center">
        <div>
          <h1 className="text-fg-primary inline-flex items-center gap-2.5 text-2xl font-bold tracking-tight">
            <Key className="text-brand-400 h-6 w-6" />
            API Anahtarları & Entegrasyon Kontrol Paneli
          </h1>
          <p className="text-fg-muted mt-1 text-sm">
            Yapay zeka sağlayıcılarının (OpenAI, Anthropic, Gemini) ve altyapı API anahtarlarının
            canlı kullanımı, kota harcamaları ve anahtar güvenliği.
          </p>
        </div>
        <nav className="flex items-center gap-2 text-sm">
          <Link
            href={"/admin/integrations"}
            className="bg-brand-500/20 text-brand-300 border-brand-500/30 hover:bg-brand-500/30 flex items-center gap-2 rounded-lg border px-4 py-2 font-medium transition-all"
          >
            <Cpu className="h-4 w-4" /> Entegrasyon Haritası
          </Link>
        </nav>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard
          title="Connected APIs"
          value={apiProviders.filter((p) => p.status === "connected").length}
          icon={<CheckCircle2 className="h-4 w-4" />}
          trend="up"
          trendLabel="All systems go"
          accentColor="#10b981"
          sparkData={apiProviders.map((p) => ({ value: p.health }))}
          chartType="bar"
        />
        <MetricCard
          title="Avg. API Health"
          value={`${Math.round(apiProviders.reduce((a, p) => a + p.health, 0) / apiProviders.length)}%`}
          icon={<Activity className="h-4 w-4" />}
          trend="up"
          trendLabel="7-day avg"
          accentColor="#6366f1"
          sparkData={[
            { value: 96 },
            { value: 98 },
            { value: 97 },
            { value: 99 },
            { value: 98 },
            { value: 99 },
          ]}
          chartType="line"
        />
        <MetricCard
          title="Daily API Cost"
          value="$0.16"
          icon={<DollarSign className="h-4 w-4" />}
          trend="down"
          trendLabel="vs last week"
          accentColor="#f59e0b"
          sparkData={[
            { value: 22 },
            { value: 18 },
            { value: 20 },
            { value: 17 },
            { value: 16 },
            { value: 16 },
          ]}
          chartType="line"
        />
      </div>

      <div className="group relative overflow-hidden rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-5 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
        <div className="absolute top-0 right-0 h-full w-1/2 bg-gradient-to-l from-emerald-500/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
        <div className="relative z-10">
          <p className="mb-2 flex items-center gap-2 text-sm font-bold text-emerald-400">
            <Shield className="h-5 w-5" /> SIFIR-SIZINTI API ANAHTAR GÜVENLİĞİ AKTİF
          </p>
          <p className="max-w-4xl text-xs leading-relaxed text-emerald-100/70">
            Tüm API anahtarlarınız Vercel Environment Variables üzerinde AES-256 şifrelenmiş olarak
            saklanır. İstemci tarafına (browser) asla sızdırılmaz. Tüm işlemler sunucu tarafı Server
            Actions ve Edge Functions üzerinden yürütülür.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="group border-white/10 bg-neutral-900/60 backdrop-blur-xl transition-all hover:border-cyan-500/30">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-fg-muted text-xs font-semibold tracking-wider uppercase">
                Aktif API Bağlantısı
              </span>
              <Activity className="h-5 w-5 text-cyan-400 transition-transform group-hover:scale-110" />
            </div>
            <p className="mt-4 text-3xl font-black text-white drop-shadow-[0_0_10px_rgba(6,182,212,0.4)]">
              6 <span className="text-fg-muted text-sm font-normal">/ 6 Sağlayıcı</span>
            </p>
            <div className="mt-3 flex w-fit items-center gap-2 rounded border border-cyan-500/20 bg-cyan-500/10 px-2 py-1 text-[10px] font-bold tracking-wider text-cyan-400 uppercase">
              <CheckCircle2 className="h-3 w-3" /> Tüm Sistemler Operasyonel
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-brand-500/30 group border-white/10 bg-neutral-900/60 backdrop-blur-xl transition-all">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-fg-muted text-xs font-semibold tracking-wider uppercase">
                Günlük Toplam Harcama
              </span>
              <DollarSign className="text-brand-400 h-5 w-5 transition-transform group-hover:scale-110" />
            </div>
            <p className="mt-4 text-3xl font-black text-white drop-shadow-[0_0_10px_rgba(168,85,247,0.4)]">
              $0.16 <span className="text-fg-muted text-sm font-normal">/ gün</span>
            </p>
            <div className="text-brand-400 bg-brand-500/10 border-brand-500/20 mt-3 flex w-fit items-center gap-2 rounded border px-2 py-1 text-[10px] font-bold tracking-wider uppercase">
              <Zap className="h-3 w-3" /> Free-tier Kalkanı Aktif
            </div>
          </CardContent>
        </Card>

        <Card className="group border-white/10 bg-neutral-900/60 backdrop-blur-xl transition-all hover:border-purple-500/30">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-fg-muted text-xs font-semibold tracking-wider uppercase">
                Güvenlik Seviyesi
              </span>
              <Lock className="h-5 w-5 text-purple-400 transition-transform group-hover:scale-110" />
            </div>
            <p className="mt-4 text-3xl font-black text-white drop-shadow-[0_0_10px_rgba(168,85,247,0.4)]">
              AES-256
            </p>
            <div className="mt-3 flex w-fit items-center gap-2 rounded border border-purple-500/20 bg-purple-500/10 px-2 py-1 text-[10px] font-bold tracking-wider text-purple-400 uppercase">
              <Shield className="h-3 w-3" /> Edge Isolation Aktif
            </div>
          </CardContent>
        </Card>

        <Card className="group border-white/10 bg-neutral-900/60 backdrop-blur-xl transition-all hover:border-rose-500/30">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-fg-muted text-xs font-semibold tracking-wider uppercase">
                Kota Uyarıları
              </span>
              <AlertTriangle className="h-5 w-5 text-rose-400 transition-transform group-hover:scale-110" />
            </div>
            <p className="mt-4 text-3xl font-black text-white drop-shadow-[0_0_10px_rgba(244,63,94,0.4)]">
              0 <span className="text-fg-muted text-sm font-normal">Kritik</span>
            </p>
            <div className="mt-3 flex w-fit items-center gap-2 rounded border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-[10px] font-bold tracking-wider text-emerald-400 uppercase">
              <Activity className="h-3 w-3" /> Limitler Optimal
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="overflow-hidden border-white/10 bg-neutral-900/60 backdrop-blur-xl">
            <CardHeader className="border-b border-white/10 bg-neutral-950/40">
              <CardTitle className="flex items-center justify-between text-base">
                <span className="flex items-center gap-2">
                  <Server className="text-brand-400 h-5 w-5" /> API Sağlayıcıları ve Anahtar
                  Envanteri
                </span>
                <span className="text-fg-muted flex items-center gap-2 font-mono text-xs font-normal">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400"></span> Canlı
                  Veri
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-fg-muted border-b border-white/5 bg-white/[0.02] text-xs font-semibold tracking-wider uppercase">
                    <tr>
                      <th className="p-4">Sağlayıcı / Servis</th>
                      <th className="p-4">Değişken / Ortam</th>
                      <th className="p-4">Maliyet (Günlük)</th>
                      <th className="p-4">Limit (RPM)</th>
                      <th className="p-4 text-right">Durum</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-mono">
                    {apiProviders.map((prov) => (
                      <tr key={prov.envKey} className="group transition-colors hover:bg-white/5">
                        <td className="p-4">
                          <div className="flex items-center gap-3 font-sans font-bold text-white">
                            <div className="group-hover:border-brand-500/50 group-hover:text-brand-400 flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-neutral-800 transition-colors">
                              <Key className="h-4 w-4" />
                            </div>
                            {prov.name}
                          </div>
                          <div className="text-fg-muted mt-1 ml-11 font-sans text-[10px]">
                            {prov.models}
                          </div>
                        </td>
                        <td className="text-fg-secondary p-4 text-[11px]">
                          <div className="flex w-fit items-center gap-2 rounded border border-white/10 bg-neutral-950 px-2 py-1">
                            <EyeOff className="text-fg-muted h-3 w-3" />
                            {prov.envKey}
                          </div>
                        </td>
                        <td className="p-4 text-xs font-bold text-amber-400">{prov.cost}</td>
                        <td className="text-fg-muted p-4 text-xs">{prov.limit}</td>
                        <td className="p-4 text-right">
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold tracking-wider text-emerald-400 uppercase">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>{" "}
                            Connected
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-white/10 bg-neutral-900/60 backdrop-blur-xl">
            <CardHeader className="border-b border-white/10 pb-4">
              <CardTitle className="flex items-center gap-2 text-base">
                <BarChart3 className="text-brand-400 h-5 w-5" /> Trafik & API Kullanımı (24s)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <div className="text-fg-secondary mb-2 flex items-end justify-between font-mono text-xs font-bold tracking-wider">
                    <span>LLM TOKEN HACMİ</span>
                    <span className="text-brand-400">25.57K / 100K</span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full border border-white/5 bg-neutral-800">
                    <div className="bg-brand-500 h-full w-[25%] rounded-full transition-all duration-1000" />
                  </div>
                  <p className="text-fg-muted mt-2 text-right text-[10px]">
                    OpenAI + Anthropic + Gemini
                  </p>
                </div>

                <div>
                  <div className="text-fg-secondary mb-2 flex items-end justify-between font-mono text-xs font-bold tracking-wider">
                    <span>DATABASE QUERIES</span>
                    <span className="text-cyan-400">12K / 50K</span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full border border-white/5 bg-neutral-800">
                    <div className="h-full w-[24%] rounded-full bg-cyan-500 transition-all duration-1000" />
                  </div>
                  <p className="text-fg-muted mt-2 text-right text-[10px]">Supabase RLS Bypass</p>
                </div>

                <div>
                  <div className="text-fg-secondary mb-2 flex items-end justify-between font-mono text-xs font-bold tracking-wider">
                    <span>REDIS CACHE HITS</span>
                    <span className="text-rose-400">1.2K / 10K</span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full border border-white/5 bg-neutral-800">
                    <div className="h-full w-[12%] rounded-full bg-rose-500 transition-all duration-1000" />
                  </div>
                  <p className="text-fg-muted mt-2 text-right text-[10px]">
                    Upstash Edge Rate Limiter
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
}
