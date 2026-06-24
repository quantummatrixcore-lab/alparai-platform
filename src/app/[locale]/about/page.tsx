import { setRequestLocale, getTranslations } from "next-intl/server";
import { Container, Section } from "@/components/ui/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@/i18n/routing";
import { Wordmark } from "@/components/layout/wordmark";
import { Sparkles, Users, Shield, Globe, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FounderStory } from "@/components/marketing/founder-story";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return {
    title: t("mission"),
    description: t("description"),
  };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "about" });
  const tApp = await getTranslations({ locale, namespace: "app" });

  return (
    <div>
      {/* Premium Header */}
      <div className="bg-bg-secondary/20 border-border-subtle border-b py-16 text-center">
        <Container>
          <Wordmark size="lg" showTagline />
          <p className="text-fg-secondary mx-auto mt-4 max-w-xl text-lg">{tApp("tagline")}</p>
        </Container>
      </div>

      {/* Founder Story Section */}
      <FounderStory />

      {/* Pillars Section */}
      <Section className="bg-bg-primary py-16">
        <Container>
          <div className="mb-12 text-center">
            <h2 className="text-fg-primary text-3xl font-extrabold tracking-tight">
              {t("principlesTitle")}
            </h2>
            <p className="text-fg-muted mx-auto mt-2 max-w-md text-sm">{t("principlesSubtitle")}</p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card variant="glass" padding="md">
              <CardHeader>
                <CardTitle className="inline-flex items-center gap-2 text-white">
                  <Sparkles className="text-brand-400 h-5 w-5" />
                  {t("mission")}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-fg-secondary text-sm leading-relaxed">
                {t("missionText")}
              </CardContent>
            </Card>

            <Card variant="glass" padding="md">
              <CardHeader>
                <CardTitle className="inline-flex items-center gap-2 text-white">
                  <Shield className="text-success-500 h-5 w-5" />
                  {t("intermediary")}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-fg-secondary text-sm leading-relaxed">
                {t("intermediaryText")}
              </CardContent>
            </Card>

            <Card variant="glass" padding="md">
              <CardHeader>
                <CardTitle className="inline-flex items-center gap-2 text-white">
                  <Users className="text-warning-500 h-5 w-5" />
                  {t("voice")}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-fg-secondary text-sm leading-relaxed">
                {t("voiceText")}
              </CardContent>
            </Card>

            <Card variant="glass" padding="md">
              <CardHeader>
                <CardTitle className="inline-flex items-center gap-2 text-white">
                  <Globe className="text-brand-400 h-5 w-5" />
                  {t("openSource")}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-fg-secondary text-sm leading-relaxed">
                {t("openSourceText")}
              </CardContent>
            </Card>
          </div>

          <div className="border-border-subtle mt-20 border-t pt-16">
            <div className="mb-12 text-center">
              <h2 className="text-fg-primary text-3xl font-extrabold tracking-tight">
                {t("teamTitle")}
              </h2>
              <p className="text-fg-muted mx-auto mt-2 max-w-2xl text-sm">{t("teamSubtitle")}</p>
            </div>

            <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
              <Card variant="glass" padding="md">
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <div className="bg-brand-500/10 text-brand-400 border-brand-500/20 flex h-12 w-12 items-center justify-center rounded-full border">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold text-white">
                      {t("founderName")}
                    </CardTitle>
                    <p className="text-brand-400 mt-0.5 text-xs font-semibold tracking-wider uppercase">
                      {t("founderRole")}
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="text-fg-secondary mt-2 text-sm leading-relaxed">
                  {t("founderBio")}
                </CardContent>
              </Card>

              <Card variant="glass" padding="md">
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <div className="bg-success-500/10 text-success-400 border-success-500/20 flex h-12 w-12 items-center justify-center rounded-full border">
                    <Shield className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold text-white">
                      {t("advisoryName")}
                    </CardTitle>
                    <p className="text-success-400 mt-0.5 text-xs font-semibold tracking-wider uppercase">
                      {t("advisoryRole")}
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="text-fg-secondary mt-2 text-sm leading-relaxed">
                  {t("advisoryBio")}
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mt-16 text-center">
            <Link href="/submit">
              <Button
                size="lg"
                className="group"
                rightIcon={
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                }
              >
                {tApp("description")}
              </Button>
            </Link>
          </div>
        </Container>
      </Section>
    </div>
  );
}
