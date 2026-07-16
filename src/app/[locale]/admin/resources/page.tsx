import { requireAdmin } from "@/actions/auth";
import { setRequestLocale } from "next-intl/server";
import { ResourcesClient } from "@/components/admin/resources-client";

export async function generateMetadata() {
  return {
    title: `Resource Efficiency | ALPAR AI`,
  };
}

export default async function ResourcesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Authenticate user & check admin access
  await requireAdmin();

  return <ResourcesClient />;
}
