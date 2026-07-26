import { createAdminClient } from "@/lib/supabase/admin";
import { GrantsList } from "@/components/admin/grants-list";
import { AdminSectionCard } from "@/components/admin/admin-design-kit";
import { requireModerator } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { Building2 } from "lucide-react";

export default async function GrantsAdminPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const user = await requireModerator();
  if (!user) redirect(`/${locale}/login`);

  const supabase = createAdminClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: grants, error } = await (supabase as any)
    .from("grant_applications")
    .select("*")
    .order("phase", { ascending: true })
    .order("status", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching grant_applications", error);
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-12">
      <div>
        <h1 className="flex items-center gap-3 text-3xl font-black tracking-tight text-white">
          <Building2 className="h-8 w-8 text-amber-400" />
          Grant Cockpit
        </h1>
        <p className="text-fg-muted mt-2 text-lg">
          Manage foundation and state support grant applications.
        </p>
      </div>

      <AdminSectionCard title="Active Grants">
        <GrantsList initialGrants={grants || []} userRole={user.role} />
      </AdminSectionCard>
    </div>
  );
}
