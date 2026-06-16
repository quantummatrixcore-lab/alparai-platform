import { setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui/layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getCurrentUser } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { Building2 } from "lucide-react";

export async function generateMetadata({
  params: _params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return { title: "AI Providers" };
}

export default async function AdminProvidersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const user = await getCurrentUser();
  if (!user) redirect(`/${locale}/auth/signin?next=/${locale}/admin/providers`);
  if (user.role !== "moderator" && user.role !== "admin" && user.role !== "ceo") {
    redirect(`/${locale}`);
  }
  const admin = createAdminClient();
  const { data } = await admin
    .from("ai_providers")
    .select("id, slug, name, website_url, contact_email, is_verified, created_at")
    .order("name");

  return (
    <Container className="py-10">
      <header className="mb-6">
        <h1 className="text-fg-primary inline-flex items-center gap-2 text-2xl font-bold">
          <Building2 className="text-brand-400 h-6 w-6" /> AI Providers
        </h1>
        <p className="text-fg-muted mt-1 text-sm">All registered providers.</p>
      </header>
      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-border-subtle text-fg-muted border-b text-left text-xs font-semibold tracking-wider uppercase">
                <th className="p-4">Name</th>
                <th className="p-4">Slug</th>
                <th className="p-4">Website</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-border-subtle divide-y">
              {((data as Array<Record<string, unknown>>) ?? []).map((p) => (
                <tr key={p["id"] as string} className="hover:bg-bg-tertiary/30">
                  <td className="text-fg-primary p-4 font-medium">{p["name"] as string}</td>
                  <td className="text-fg-muted p-4 font-mono text-xs">{p["slug"] as string}</td>
                  <td className="p-4 text-xs">
                    {(p["website_url"] as string | null) ? (
                      <a
                        href={p["website_url"] as string}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="text-brand-400 hover:underline"
                      >
                        {(p["website_url"] as string).replace(/^https?:\/\//, "")}
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="p-4">
                    {p["is_verified"] ? (
                      <Badge variant="success" dot>
                        Verified
                      </Badge>
                    ) : (
                      <Badge variant="warning" dot>
                        Unverified
                      </Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </Container>
  );
}
