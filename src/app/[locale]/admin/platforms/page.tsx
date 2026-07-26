import { createAdminClient } from "@/lib/supabase/admin";
import { PlatformsList } from "@/components/admin/platforms-list";
import { AdminSectionCard } from "@/components/admin/admin-design-kit";
import { requireModerator } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { Globe } from "lucide-react";

export default async function PlatformsAdminPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const user = await requireModerator();
  if (!user) redirect(`/${locale}/login`);

  const supabase = createAdminClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: platforms, error } = await (supabase as any)
    .from("platform_signups")
    .select("*")
    .order("status", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching platform_signups", error);
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-12">
      <div>
        <h1 className="flex items-center gap-3 text-3xl font-black tracking-tight text-white">
          <Globe className="h-8 w-8 text-pink-400" />
          Platform Accounts
        </h1>
        <p className="text-fg-muted mt-2 text-lg">
          Manage outreach and signup progress on third-party platforms.
        </p>
      </div>

      <AdminSectionCard title="Target Platforms">
        <PlatformsList initialPlatforms={platforms || []} />
      </AdminSectionCard>
    </div>
  );
}
