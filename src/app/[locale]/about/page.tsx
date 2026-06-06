import { setRequestLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@/i18n/routing";
import { Wordmark } from "@/components/layout/wordmark";
import { Sparkles, Users, Shield, Globe, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "app" });
  return { title: t("name") };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "about" });
  const tApp = await getTranslations({ locale, namespace: "app" });
  return (
    <Container className="py-12">
      <header className="mb-12 text-center">
        <Wordmark size="lg" showTagline />
        <p className="mt-4 text-lg text-fg-secondary">{tApp("tagline")}</p>
      </header>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="inline-flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-brand-400" />
              {t("mission")}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-fg-secondary">
            {t("missionText")}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="inline-flex items-center gap-2">
              <Shield className="h-5 w-5 text-success-500" />
              {t("intermediary")}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-fg-secondary">
            {t("intermediaryText")}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="inline-flex items-center gap-2">
              <Users className="h-5 w-5 text-warning-500" />
              {t("voice")}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-fg-secondary">
            {t("voiceText")}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="inline-flex items-center gap-2">
              <Globe className="h-5 w-5 text-brand-400" />
              {t("openSource")}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-fg-secondary">
            {t("openSourceText")}
          </CardContent>
        </Card>
      </div>
      <div className="mt-12 text-center">
        <Link href={`/${locale}/submit`}>
          <Button size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
            {tApp("description")}
          </Button>
        </Link>
      </div>
    </Container>
  );
}
