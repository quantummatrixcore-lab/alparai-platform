import { setRequestLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusCards } from "./status-cards";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "status" });
  return { title: t("title"), description: t("desc") };
}

export default async function StatusPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "status" });

  return (
    <Container className="py-12">
      <h1 className="text-fg-primary mb-2 text-3xl font-bold">{t("heading")}</h1>
      <p className="text-fg-muted mb-8">{t("subheading")}</p>
      <StatusCards />
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>{t("uptimeTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-fg-muted text-sm">{t("uptimeText")}</p>
          <div className="mt-4 grid grid-cols-3 gap-4">
            {["supabase", "upstash", "vercel"].map((svc) => (
              <div key={svc} className="border-border-subtle rounded-lg border p-4 text-center">
                <p className="text-fg-primary text-lg font-semibold capitalize">{svc}</p>
                <p className="text-success-500 text-2xl font-bold">99.9%</p>
                <p className="text-fg-muted text-xs">{t("uptime90d")}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </Container>
  );
}
