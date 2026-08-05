import { requireModerator } from "@/lib/auth/session";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { ResourcesClient } from "@/components/admin/resources-client";
import { AdminContainer } from "@/components/admin/admin-design-kit";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admin" });
  return {
    title: `${t("resources_title") || "Resource Management"} | ALPAR AI Admin`,
  };
}

export default async function ResourcesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Authenticate user & check moderator access
  await requireModerator();

  return (
    <div className="space-y-8 rounded-3xl bg-zinc-900/40 p-6 shadow-2xl ring-1 ring-white/10 backdrop-blur-xl md:p-8">
      <AdminContainer>
        <ResourcesClient locale={locale} />
      </AdminContainer>
    </div>
  );
}
