import { setRequestLocale, getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@/i18n/routing";
import { getCurrentUser } from "@/lib/auth/session";
import { Wordmark } from "@/components/layout/wordmark";
import { Sparkles, Users, Shield, Globe, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  return { title: "About ALPAR AI" };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "app" });
  return (
    <Container className="py-12">
      <header className="mb-12 text-center">
        <Wordmark size="lg" showTagline />
        <p className="mt-4 text-lg text-fg-secondary">{t("tagline")}</p>
      </header>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="inline-flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-brand-400" />
              Our mission
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-fg-secondary">
            Build a public, independent, verifiable record of how AI systems
            behave in the real world — so that users, regulators, and
            developers can make better decisions.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="inline-flex items-center gap-2">
              <Shield className="h-5 w-5 text-success-500" />
              Intermediary, not publisher
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-fg-secondary">
            We host community-submitted reports. We are not the publisher of
            the content. The liability for the accuracy of any submission
            rests with the user who submitted it — the same model as
            Trustpilot or sikayetvar.com.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="inline-flex items-center gap-2">
              <Users className="h-5 w-5 text-warning-500" />
              AI providers get a voice
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-fg-secondary">
            Every published incident invites an official response from the
            AI provider. We verify their identity and publish the response
            alongside the report. Healthy debate over real evidence.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="inline-flex items-center gap-2">
              <Globe className="h-5 w-5 text-brand-400" />
              Open source
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-fg-secondary">
            ALPAR is licensed under AGPL-3.0. Anyone can audit the code, run
            an instance, or contribute. We believe trust infrastructure
            should itself be trustworthy.
          </CardContent>
        </Card>
      </div>
      <div className="mt-12 text-center">
        <Link href={`/${locale}/submit`}>
          <Button size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
            {t("description")}
          </Button>
        </Link>
      </div>
    </Container>
  );
}
