import { setRequestLocale, getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getCurrentUser } from "@/lib/auth/session";
import { createServerClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import { Mail, Calendar, Shield, User as UserIcon } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auth" });
  return { title: t("profile") };
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const user = await getCurrentUser();
  if (!user) redirect(`/${locale}/auth/signin?next=/${locale}/profile`);

  const supabase = await createServerClient();
  const [{ count: myIncidents }, { count: mySuggestions }] = await Promise.all([
    supabase.from("incidents").select("*", { count: "exact", head: true }).eq("user_id", user.id),
    supabase.from("suggestions").select("*", { count: "exact", head: true }).eq("user_id", user.id),
  ]);

  return (
    <Container size="narrow" className="py-10">
      <Card variant="elevated">
        <CardHeader>
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-bg-tertiary">
              <UserIcon className="h-8 w-8 text-fg-muted" />
            </div>
            <div className="flex-1 space-y-1">
              <CardTitle>{user.fullName ?? user.email}</CardTitle>
              <div className="flex flex-wrap items-center gap-3 text-sm text-fg-muted">
                <span className="inline-flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" /> {user.email}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" /> Joined {formatDate(new Date(user.createdAt), locale)}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 pt-2">
                {user.role !== "user" && (
                  <Badge variant="brand" size="sm" dot>
                    <Shield className="h-3 w-3" /> {user.role}
                  </Badge>
                )}
                {user.isVerified && (
                  <Badge variant="success" size="sm" dot>
                    Verified
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 border-t border-border-subtle pt-6">
          <div className="rounded-md bg-bg-tertiary p-4">
            <p className="text-2xl font-bold text-fg-primary">{myIncidents ?? 0}</p>
            <p className="text-xs text-fg-muted">Incidents reported</p>
          </div>
          <div className="rounded-md bg-bg-tertiary p-4">
            <p className="text-2xl font-bold text-fg-primary">{mySuggestions ?? 0}</p>
            <p className="text-xs text-fg-muted">Suggestions made</p>
          </div>
        </CardContent>
      </Card>
    </Container>
  );
}
