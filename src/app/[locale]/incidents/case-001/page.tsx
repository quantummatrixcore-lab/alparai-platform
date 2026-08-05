import { setRequestLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/layout";
import { Card } from "@/components/ui/card";
import { Shield, AlertTriangle, RefreshCw, Scale, ArrowRight, Flag } from "lucide-react";
import { Link } from "@/i18n/routing";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "case001" });
  return {
    title: `${t("title")} — ALPAR AI`,
    description: t("subtitle"),
  };
}

export default async function Case001Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "case001" });

  const sections = [
    {
      id: "section-1",
      icon: Flag,
      iconColor: "text-red-400 border-red-500/30 bg-red-500/10",
      badge: "ÖNCÜ OLAY • Q1 2025",
      title: t("section1_title"),
      text: t("section1_text"),
      quote:
        '"Grok 4: Şirket kurulumunuz Delaware\'de tamamlandı. Kimlik doğrulaması için lütfen pasaportunuzu yükleyin."',
    },
    {
      id: "section-2",
      icon: AlertTriangle,
      iconColor: "text-amber-400 border-amber-500/30 bg-amber-500/10",
      badge: "VİRAL YAYILMA • TOPLULUK TEPKİSİ",
      title: t("section2_title"),
      text: t("section2_text"),
      quote:
        '"Sosyal medya paylaşımları sonrasında 24 saat içinde 50.000+ etkileşim ve kamuoyu uyarısı."',
    },
    {
      id: "section-3",
      icon: RefreshCw,
      iconColor: "text-blue-400 border-blue-500/30 bg-blue-500/10",
      badge: "TEKNİK YANIT • GÜVENLİK YAMASI",
      title: t("section3_title"),
      text: t("section3_text"),
      quote:
        '"xAI Güvenlik Ekibi: İlgili model çıktısı halüsinasyon olarak sınıflandırılmış ve acil durum yaması uygulanmıştır."',
    },
    {
      id: "section-4",
      icon: Scale,
      iconColor: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
      badge: "KVKK İNCELEMESİ • HUKUKİ EMSAL",
      title: t("section4_title"),
      text: t("section4_text"),
      quote:
        '"KVKK Resmi Kararı: Yapay zeka sistemlerinde açık rıza ve teknik tedbir standartlarına uyumsuzluk incelemesi."',
    },
  ];

  return (
    <div className="bg-bg-primary text-fg-primary min-h-screen">
      {/* Sticky Header */}
      <header className="border-border-subtle bg-bg-secondary/90 sticky top-0 z-30 border-b py-4 backdrop-blur-md">
        <Container className="flex items-center justify-between">
          <div className="text-brand-400 flex items-center gap-2 text-xs font-bold tracking-wider uppercase">
            <Shield className="h-4 w-4" />
            <span>CASE FORENSIC #001</span>
          </div>
          <Link
            href="/submit"
            className="bg-brand-500/20 border-brand-500/40 text-brand-300 hover:bg-brand-500/30 flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold"
          >
            <span>Vaka Bildir</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Container>
      </header>

      {/* Hero Banner */}
      <section className="border-border-subtle from-bg-secondary via-bg-primary to-bg-primary relative overflow-hidden border-b bg-gradient-to-b py-20 text-center">
        <Container className="max-w-3xl space-y-6">
          <span className="inline-block rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 font-mono text-xs font-bold text-red-400 uppercase">
            SCROLLYTELLING TIMELINE
          </span>
          <h1 className="via-fg-primary to-fg-muted bg-gradient-to-r from-white bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl">
            {t("title")}
          </h1>
          <p className="text-fg-muted mx-auto max-w-2xl text-base leading-relaxed">
            {t("subtitle")}
          </p>
        </Container>
      </section>

      {/* Scrollytelling Timeline Section */}
      <section className="py-20">
        <Container className="max-w-3xl">
          <div className="border-brand-500/30 relative space-y-16 border-l-2 pl-6 sm:pl-10">
            {sections.map((sec) => {
              const IconComp = sec.icon;
              return (
                <div key={sec.id} className="group relative">
                  {/* Timeline node marker */}
                  <div className="border-border bg-bg-surface absolute top-1.5 -left-[31px] flex h-10 w-10 items-center justify-center rounded-full border shadow-md transition-transform group-hover:scale-110 sm:-left-[47px]">
                    <IconComp className="text-brand-400 h-5 w-5" />
                  </div>

                  <Card className="border-border-subtle bg-bg-surface/80 hover:border-brand-500/40 space-y-4 p-6 shadow-xl transition-all sm:p-8">
                    <span
                      className={`inline-block rounded-md border px-2.5 py-0.5 font-mono text-[10px] font-bold ${sec.iconColor}`}
                    >
                      {sec.badge}
                    </span>
                    <h2 className="text-fg-primary text-2xl font-bold tracking-tight">
                      {sec.title}
                    </h2>
                    <p className="text-fg-secondary text-sm leading-relaxed">{sec.text}</p>
                    <blockquote className="border-brand-500 bg-brand-500/5 text-fg-muted rounded-r border-l-2 p-3 text-xs italic">
                      {sec.quote}
                    </blockquote>
                  </Card>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Bottom CTA Section */}
      <section className="border-border-subtle bg-bg-secondary/30 border-t py-16 text-center">
        <Container className="max-w-xl space-y-6">
          <h2 className="text-fg-primary text-2xl font-bold">{t("cta_title")}</h2>
          <p className="text-fg-muted text-xs leading-relaxed">
            ALPAR AI tarafsız güven altyapısı üzerinde ihlalleri kayıt altına alın, topluluk
            doğrulamasına sunun.
          </p>
          <div>
            <Link
              href="/submit"
              className="bg-brand-500 shadow-brand-500/20 hover:bg-brand-600 inline-flex items-center gap-2 rounded-lg px-6 py-3 text-xs font-bold text-white shadow-lg transition-colors"
            >
              <span>{t("cta_button")}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
