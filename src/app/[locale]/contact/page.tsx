import { setRequestLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, MapPin, MessageSquare } from "lucide-react";
import { ContactForm } from "@/components/marketing/contact-form";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return { title: t("title") };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "contact" });
  return (
    <Container className="py-12">
      <header className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-fg-primary">{t("title")}</h1>
        <p className="mt-2 text-sm text-fg-muted">
          {t("subtitle")}
        </p>
      </header>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>{t("sendMessage")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ContactForm />
          </CardContent>
        </Card>
        <aside className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-fg-primary">
                <Mail className="h-4 w-4 text-brand-400" /> {t("general")}
              </p>
              <a href="mailto:hello@alparai.online" className="mt-1 block text-sm text-fg-muted hover:text-brand-400">
                hello@alparai.online
              </a>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-fg-primary">
                <MessageSquare className="h-4 w-4 text-brand-400" /> {t("press")}
              </p>
              <a href="mailto:press@alparai.online" className="mt-1 block text-sm text-fg-muted hover:text-brand-400">
                press@alparai.online
              </a>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-fg-primary">
                <MapPin className="h-4 w-4 text-brand-400" /> {t("office")}
              </p>
              <p className="mt-1 text-sm text-fg-muted">
                {t("officeText")}
              </p>
            </CardContent>
          </Card>
        </aside>
      </div>
    </Container>
  );
}
