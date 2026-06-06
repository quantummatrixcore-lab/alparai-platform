import { setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TakedownQueue, type TakedownItem } from "@/components/admin/takedown-queue";
import { getCurrentUser } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  return { title: "Takedown Requests" };
}

export default async function AdminTakedownPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const user = await getCurrentUser();
  if (!user) redirect(`/${locale}/auth/signin?next=/${locale}/admin/takedown`);
  if (user.role !== "moderator" && user.role !== "admin") {
    redirect(`/${locale}`);
  }
  const admin = createAdminClient();
  const { data } = await admin
    .from("takedown_requests")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  const items: TakedownItem[] = ((data as Array<Record<string, unknown>>) ?? []).map((r) => ({
    id: r["id"] as string,
    reason: (r["reason"] as string) ?? "",
    details: (r["details"] as string) ?? "",
    status: (r["status"] as TakedownItem["status"]) ?? "pending",
    created_at: r["created_at"] as string,
    requester_name: (r["requester_name"] as string | null) ?? null,
    requester_email: (r["requester_email"] as string | null) ?? null,
    organization: (r["organization"] as string | null) ?? (r["requester_organization"] as string | null) ?? null,
    country: (r["country"] as string | null) ?? null,
    target_url: (r["target_url"] as string | null) ?? null,
  }));

  const pending = items.filter((i) => i.status === "pending");

  return (
    <Container className="py-10">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-fg-primary">Takedown requests</h1>
        <p className="mt-1 text-sm text-fg-muted">
          {pending.length} pending · {items.length} total
        </p>
      </header>
      <Card>
        <CardContent className="pt-6">
          <TakedownQueue items={items} />
        </CardContent>
      </Card>
    </Container>
  );
}
