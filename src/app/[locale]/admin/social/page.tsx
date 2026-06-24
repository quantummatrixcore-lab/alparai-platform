/* eslint-disable @typescript-eslint/no-explicit-any */
import { requireAdmin } from "@/lib/auth/session";
import { getSocialPosts, getSocialTemplates, getSocialAssets } from "@/actions/social";
import { SocialDashboardClient } from "@/components/admin/social-dashboard-client";
import { setRequestLocale } from "next-intl/server";

export default async function AdminSocialPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Guard access to admin/ceo
  await requireAdmin();

  const [posts, templates, assets] = await Promise.all([
    getSocialPosts(),
    getSocialTemplates(),
    getSocialAssets(),
  ]);

  return (
    <SocialDashboardClient
      initialPosts={posts as any}
      initialTemplates={templates as any}
      initialAssets={assets as any}
    />
  );
}
