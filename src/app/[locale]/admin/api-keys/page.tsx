import { setRequestLocale, getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui/layout";
import { getCurrentUser } from "@/lib/auth/session";
import { getApiKeys } from "@/actions/api-keys";
import { ApiKeysClient } from "@/components/admin/api-keys-client";
import { Key } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admin" });
  return { title: t("api_keys") };
}

export default async function AdminApiKeysPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "admin" });

  const user = await getCurrentUser();
  if (!user) redirect(`/${locale}/auth/signin?next=/${locale}/admin/api-keys`);
  if (user.role !== "admin" && user.role !== "ceo") {
    redirect(`/${locale}/admin`);
  }

  const res = await getApiKeys();
  const initialKeys = res.ok && res.data ? res.data : [];

  return (
    <Container className="py-10">
      <header className="mb-8">
        <h1 className="text-fg-primary inline-flex items-center gap-2 text-2xl font-bold">
          <Key className="text-brand-400 h-6 w-6" />
          {t("api_keys")}
        </h1>
        <p className="text-fg-muted mt-1 text-sm">{t("api_keys_subtitle")}</p>
      </header>

      <ApiKeysClient initialKeys={initialKeys} />
    </Container>
  );
}
