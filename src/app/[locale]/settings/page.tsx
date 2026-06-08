import { setRequestLocale, getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getCurrentUser } from "@/lib/auth/session";
import { formatDate } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "settings" });
  return { title: t("title") };
}

export default async function SettingsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "settings" });
  const user = await getCurrentUser();
  if (!user) redirect(`/${locale}/auth/signin?next=/${locale}/settings`);

  return (
    <Container size="narrow" className="py-10">
      <header className="mb-6">
        <h1 className="text-fg-primary text-2xl font-bold">{t("title")}</h1>
        <p className="text-fg-muted mt-1 text-sm">{t("subtitle")}</p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>{t("account")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <Row label={t("email")} value={user.email} />
          <Row label={t("name")} value={user.fullName ?? "—"} />
          <Row label={t("memberSince")} value={formatDate(new Date(user.createdAt), locale)} />
          <Row label={t("role")} value={<Badge variant="muted">{user.role}</Badge>} />
        </CardContent>
      </Card>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>{t("privacy")}</CardTitle>
        </CardHeader>
        <CardContent className="text-fg-muted text-sm">
          <p>
            {t("privacyText")}{" "}
            <a href={`/${locale}/legal/privacy`} className="text-brand-400 hover:underline">
              {t("privacyPolicy")}
            </a>
            . {t("privacyErase")}{" "}
            <a href="mailto:privacy@alparai.com" className="text-brand-400 hover:underline">
              privacy@alparai.com
            </a>
            .
          </p>
        </CardContent>
      </Card>
    </Container>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="border-border-subtle flex items-center justify-between border-b py-2 last:border-0">
      <span className="text-fg-muted">{label}</span>
      <span className="text-fg-primary font-medium">{value}</span>
    </div>
  );
}
