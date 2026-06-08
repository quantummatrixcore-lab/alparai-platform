import { setRequestLocale, getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SignInForm } from "@/components/auth/sign-in-form";
import { Shield } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/session";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auth" });
  return { title: t("welcome_back") };
}

export default async function SignInPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const user = await getCurrentUser();
  if (user) redirect(`/${locale}/profile`);

  const t = await getTranslations({ locale, namespace: "auth" });

  return (
    <Container size="narrow" className="py-12">
      <Card variant="elevated">
        <CardHeader>
          <CardTitle className="inline-flex items-center gap-2 text-xl">
            <Shield className="text-brand-400 h-6 w-6" />
            {t("signin_title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <p className="text-fg-muted text-sm">{t("signin_description")}</p>
          <SignInForm locale={locale} />
        </CardContent>
      </Card>
    </Container>
  );
}
