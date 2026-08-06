import { setRequestLocale, getTranslations } from "next-intl/server";
import { requireAdmin } from "@/lib/auth/session";
import { getVendorPortalDataAction } from "@/actions/admin/vendor-portal";
import { VendorPortalDashboard } from "@/components/admin/vendor-portal/vendor-portal-dashboard";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admin" });
  return { title: `${t("nav_vendor_portal") || "Vendor Portal"} | ALPAR AI Admin` };
}

export default async function VendorPortalPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  await requireAdmin();

  const data = await getVendorPortalDataAction();

  return <VendorPortalDashboard data={data} />;
}
