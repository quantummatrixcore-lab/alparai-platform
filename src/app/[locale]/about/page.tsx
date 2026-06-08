import { setRequestLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@/i18n/routing";
import { Wordmark } from "@/components/layout/wordmark";
import { Sparkles, Users, Shield, Globe, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return { title: t("mission") };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "about" });
  const tApp = await getTranslations({ locale, namespace: "app" });
  return (
    <Container className="py-12">
      <header className="mb-12 text-center">
        <Wordmark size="lg" showTagline />
        <p className="text-fg-secondary mt-4 text-lg">{tApp("tagline")}</p>
      </header>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="inline-flex items-center gap-2">
              <Sparkles className="text-brand-400 h-5 w-5" />
              {t("mission")}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-fg-secondary text-sm">{t("missionText")}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="inline-flex items-center gap-2">
              <Shield className="text-success-500 h-5 w-5" />
              {t("intermediary")}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-fg-secondary text-sm">{t("intermediaryText")}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="inline-flex items-center gap-2">
              <Users className="text-warning-500 h-5 w-5" />
              {t("voice")}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-fg-secondary text-sm">{t("voiceText")}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="inline-flex items-center gap-2">
              <Globe className="text-brand-400 h-5 w-5" />
              {t("openSource")}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-fg-secondary text-sm">{t("openSourceText")}</CardContent>
        </Card>
      </div>
      <div className="mt-12 text-center">
        <Link href="/submit">
          <Button size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
            {tApp("description")}
          </Button>
        </Link>
      </div>
    </Container>
  );
}
