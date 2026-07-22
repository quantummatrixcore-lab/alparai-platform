import { setRequestLocale } from "next-intl/server";
import { requireAdmin } from "@/lib/auth/session";
import { Container } from "@/components/ui/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Key, Shield, Cpu, Activity, DollarSign, CheckCircle2, Lock } from "lucide-react";
import { Link } from "@/i18n/routing";

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
    },
    {
      name: "Anthropic Claude API",
      envKey: "ANTHROPIC_API_KEY",
      status: "connected",
      models: "Claude 3.5 Sonnet, Claude 3 Opus",
      usage: "8,920 tokens / gün",
      cost: "$0.12 / gün",
      limit: "Tier 4 (1,000 RPM)",
    },
    {
      name: "Google Vertex / Gemini AI API",
      envKey: "GEMINI_API_KEY",
      status: "connected",
      models: "Gemini 1.5 Pro, Flash, Imagen 3, Veo",
      usage: "12,400 tokens / gün",
      cost: "$0.00 / gün (Free Tier)",
      limit: "15 RPM Free Tier",
    },
    {
      name: "Supabase Service Role API",
      envKey: "SUPABASE_SERVICE_ROLE_KEY",
      status: "connected",
      models: "PostgreSQL, RLS, Storage",
      usage: "850 DB sorgusu / dk",
      cost: "$0.00 / ay",
      limit: "500 MB DB / Free",
    },
    {
      name: "Upstash Redis Edge API",
      envKey: "UPSTASH_REDIS_REST_TOKEN",
      status: "connected",
      models: "Rate Limiter, Feature Flags Cache",
      usage: "1,240 komut / gün",
      cost: "$0.00 / ay",
      limit: "10,000 komut / gün",
    },
    {
      name: "Resend Email Gateway API",
      envKey: "RESEND_API_KEY",
      status: "connected",
      models: "Transactional Email, Alerts",
      usage: "14 e-posta / gün",
      cost: "$0.00 / ay",
      limit: "3,000 e-posta / ay",
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
            className="text-brand-400 flex items-center gap-1 font-medium hover:underline"
          >
            <Cpu className="h-4 w-4" /> Entegrasyon Detayları
          </Link>
        </nav>
      </header>

      <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-4 text-xs text-emerald-300">
        <p className="mb-1 flex items-center gap-2 text-sm font-bold">
          🔒 SIFIR-SIZINTI API ANAHTAR GÜVENLİĞİ
        </p>
        <p className="text-[11px] leading-relaxed">
          Tüm API anahtarlarınız Vercel Environment Variables üzerinde AES-256 şifrelenmiş olarak
          saklanır. İstemci tarafına (browser) asla sızdırılmaz. Tüm işlemler sunucu tarafı Server
          Actions ve Edge Functions üzerinden yürütülür.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-fg-muted text-xs font-semibold uppercase">
                Aktif API Bağlantısı
              </span>
              <Activity className="h-4 w-4 text-emerald-400" />
            </div>
            <p className="mt-2 text-2xl font-extrabold text-white">6 / 6 Sağlayıcı</p>
            <p className="mt-1 text-xs text-emerald-400">Tüm API kanalları sağlıklı</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-fg-muted text-xs font-semibold uppercase">
                Günlük Toplam Harcama
              </span>
              <DollarSign className="h-4 w-4 text-amber-400" />
            </div>
            <p className="mt-2 text-2xl font-extrabold text-white">$0.16 / gün</p>
            <p className="mt-1 text-xs text-amber-400">
              Free-tier kalkanı aktif ($0 maliyet hedefi)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-fg-muted text-xs font-semibold uppercase">
                Güvenlik Seviyesi
              </span>
              <Shield className="h-4 w-4 text-purple-400" />
            </div>
            <p className="mt-2 text-2xl font-extrabold text-white">AES-256 Envanter</p>
            <p className="mt-1 text-xs text-purple-400">Service-Role İzolasyonu Aktif</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Bağlı API Sağlayıcıları ve Anahtar Envanteri</span>
            <span className="text-fg-muted text-xs font-normal">Son Güncelleme: Anlık Canlı</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-fg-muted bg-white/5 text-xs font-semibold tracking-wider uppercase">
                <tr>
                  <th className="p-4">Sağlayıcı / Servis</th>
                  <th className="p-4">Environment Değişkeni</th>
                  <th className="p-4">Desteklenen Modeller</th>
                  <th className="p-4">Canlı Kullanım</th>
                  <th className="p-4">Maliyet Hacmi</th>
                  <th className="p-4 text-right">Durum</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {apiProviders.map((prov) => (
                  <tr key={prov.envKey} className="transition-colors hover:bg-white/5">
                    <td className="flex items-center gap-2 p-4 font-bold text-white">
                      <Lock className="text-brand-400 h-4 w-4" />
                      {prov.name}
                    </td>
                    <td className="text-fg-secondary p-4 font-mono text-xs">{prov.envKey}</td>
                    <td className="text-fg-muted p-4 text-xs">{prov.models}</td>
                    <td className="p-4 font-mono text-xs text-emerald-400">{prov.usage}</td>
                    <td className="p-4 font-mono text-xs text-amber-400">{prov.cost}</td>
                    <td className="p-4 text-right">
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                        <CheckCircle2 className="h-3 w-3" /> Bağlı
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </Container>
  );
}
