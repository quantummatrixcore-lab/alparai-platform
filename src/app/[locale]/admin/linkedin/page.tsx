import { createAdminClient } from "@/lib/supabase/admin";
import { LinkedinContactsList } from "@/components/admin/linkedin-contacts-list";
import { AdminSectionCard } from "@/components/admin/admin-design-kit";
import { requireModerator } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { Users } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";

export default async function LinkedinAdminPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "admin" });
  const user = await requireModerator();
  if (!user) redirect(`/${locale}/login`);

  const supabase = createAdminClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: contacts, error } = await (supabase as any)
    .from("linkedin_contacts")
    .select("*")
    .order("status", { ascending: true })
    .order("priority", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching linkedin_contacts", error);
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-12">
      <div>
        <h1 className="flex items-center gap-3 text-3xl font-black tracking-tight text-white">
          <Users className="h-8 w-8 text-sky-400" />
          {t("linkedin_title") || "LinkedIn Contacts Tracker"}
        </h1>
        <p className="text-fg-muted mt-2 text-lg">{t("linkedin_subtitle")}</p>
      </div>

      <AdminSectionCard title={t("linkedin_target_section")}>
        <LinkedinContactsList initialContacts={contacts || []} />
      </AdminSectionCard>
    </div>
  );
}
