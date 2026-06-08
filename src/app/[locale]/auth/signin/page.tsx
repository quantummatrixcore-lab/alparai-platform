import { setRequestLocale, getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GoogleSignInButton, EmailMagicLinkForm } from "@/components/auth/auth-buttons";
import { Shield, CheckCircle2 } from "lucide-react";
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
          <GoogleSignInButton next={`/${locale}/profile`} className="w-full" />
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="border-border-subtle w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs tracking-wider uppercase">
              <span className="bg-bg-elevated text-fg-muted px-2">{t("or_divider")}</span>
            </div>
          </div>
          <EmailMagicLinkForm />
          <p className="text-fg-muted text-xs">
            {t("terms_prefix")}{" "}
            <a href={`/${locale}/legal/terms`} className="text-brand-400 hover:underline">
              {t("terms_service")}
            </a>{" "}
            {t("terms_and")}{" "}
            <a href={`/${locale}/legal/privacy`} className="text-brand-400 hover:underline">
              {t("terms_privacy")}
            </a>
            .
          </p>
          <ul className="text-fg-muted space-y-1.5 text-xs">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="text-success-500 h-3.5 w-3.5" />
              {t("benefit_no_password")}
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="text-success-500 h-3.5 w-3.5" />
              {t("benefit_no_sell")}
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="text-success-500 h-3.5 w-3.5" />
              {t("benefit_delete")}
            </li>
          </ul>
        </CardContent>
      </Card>
    </Container>
  );
}
