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

export default async function SignInPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const user = await getCurrentUser();
  if (user) redirect(`/${locale}/profile`);

  return (
    <Container size="narrow" className="py-12">
      <Card variant="elevated">
        <CardHeader>
          <CardTitle className="inline-flex items-center gap-2 text-xl">
            <Shield className="h-6 w-6 text-brand-400" />
            Sign in to ALPAR AI
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <p className="text-sm text-fg-muted">
            We use Google for secure authentication. We never see your password.
            We do not post anything to your social media.
          </p>
          <GoogleSignInButton next={`/${locale}/profile`} className="w-full" />
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border-subtle" />
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-wider">
              <span className="bg-bg-elevated px-2 text-fg-muted">or</span>
            </div>
          </div>
          <EmailMagicLinkForm />
          <p className="text-xs text-fg-muted">
            By signing in you confirm that you are at least 18 years old and
            accept our{" "}
            <a href={`/${locale}/legal/terms`} className="text-brand-400 hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href={`/${locale}/legal/privacy`} className="text-brand-400 hover:underline">
              Privacy Policy
            </a>.
          </p>
          <ul className="space-y-1.5 text-xs text-fg-muted">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-success-500" />
              No password to remember
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-success-500" />
              We never sell your data
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-success-500" />
              You can delete your account at any time
            </li>
          </ul>
        </CardContent>
      </Card>
    </Container>
  );
}
