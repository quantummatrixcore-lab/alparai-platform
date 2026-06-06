import { setRequestLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, MapPin, MessageSquare } from "lucide-react";
import { ContactForm } from "@/components/marketing/contact-form";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  return { title: "Contact" };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <Container className="py-12">
      <header className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-fg-primary">Get in touch</h1>
        <p className="mt-2 text-sm text-fg-muted">
          Press, partnership, security disclosure, or just a question. We read
          every message.
        </p>
      </header>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Send us a message</CardTitle>
          </CardHeader>
          <CardContent>
            <ContactForm />
          </CardContent>
        </Card>
        <aside className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-fg-primary">
                <Mail className="h-4 w-4 text-brand-400" /> General
              </p>
              <a href="mailto:hello@alparai.online" className="mt-1 block text-sm text-fg-muted hover:text-brand-400">
                hello@alparai.online
              </a>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-fg-primary">
                <MessageSquare className="h-4 w-4 text-brand-400" /> Press
              </p>
              <a href="mailto:press@alparai.online" className="mt-1 block text-sm text-fg-muted hover:text-brand-400">
                press@alparai.online
              </a>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-fg-primary">
                <MapPin className="h-4 w-4 text-brand-400" /> Registered office
              </p>
              <p className="mt-1 text-sm text-fg-muted">
                Will be disclosed in the Imprint page once the legal entity is registered.
              </p>
            </CardContent>
          </Card>
        </aside>
      </div>
    </Container>
  );
}
