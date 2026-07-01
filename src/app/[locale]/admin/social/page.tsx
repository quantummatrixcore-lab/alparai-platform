import { requireAdmin } from "@/lib/auth/session";
import { getSocialPosts, getSocialTemplates, getSocialAssets } from "@/actions/social";
import { SocialDashboardClient } from "@/components/admin/social-dashboard-client";
import { setRequestLocale } from "next-intl/server";

export default async function AdminSocialPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  await requireAdmin();

  const [posts, templates, assets] = await Promise.all([
    getSocialPosts(),
    getSocialTemplates(),
    getSocialAssets(),
  ]);

  return (
    <SocialDashboardClient
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      initialPosts={posts as any}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      initialTemplates={templates as any}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      initialAssets={assets as any}
    />
  );
}
