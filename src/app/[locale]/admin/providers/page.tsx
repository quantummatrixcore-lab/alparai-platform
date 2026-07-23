import { setRequestLocale, getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui/layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getCurrentUser } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { Building2, CheckCircle2 } from "lucide-react";
import { VerifiedRespondentToggle } from "@/components/admin/verified-respondent-toggle";
import { MetricCard } from "@/components/admin/metric-card";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admin" });
  return { title: t("providers") };
}

export default async function AdminProvidersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "admin" });

  const user = await getCurrentUser();
  if (!user) redirect(`/${locale}/auth/signin?next=/${locale}/admin/providers`);
  if (user.role !== "moderator" && user.role !== "admin" && user.role !== "ceo") {
    redirect(`/${locale}`);
  }
  const admin = createAdminClient();
  const { data } = await admin
    .from("ai_providers")
    .select(
      "id, slug, name, website_url, contact_email, is_verified, is_verified_respondent, respondent_contact_email, created_at",
    )
    .order("name");

  const verified = (data ?? []).filter((p) => p.is_verified);
  const respondents = (data ?? []).filter((p) => p.is_verified_respondent);

  return (
    <Container className="py-10">
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard
          title="Total AI Providers"
          value={data?.length ?? 0}
          icon={Building2}
          trend="up"
          trendLabel="Registered"
          accentColor="#6366f1"
          sparkData={(data ?? []).map((_, i) => ({ value: i + 1 }))}
          chartType="bar"
        />
        <MetricCard
          title="Verified Providers"
          value={verified.length}
          icon={CheckCircle2}
          trend="up"
          trendLabel="Verified status"
          accentColor="#10b981"
          badge={`${data && data.length > 0 ? Math.round((verified.length / data.length) * 100) : 0}%`}
          badgeColor="text-emerald-400"
        />
        <MetricCard
          title="Active Respondents"
          value={respondents.length}
          icon={Building2}
          trend="neutral"
          trendLabel="Responding providers"
          accentColor="#f59e0b"
        />
      </div>
      <header className="mb-6">
        <h1 className="text-fg-primary inline-flex items-center gap-2 text-2xl font-bold">
          <Building2 className="text-brand-400 h-6 w-6" /> {t("providers")}
        </h1>
        <p className="text-fg-muted mt-1 text-sm">{t("all_registered_providers")}</p>
      </header>
      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <caption className="sr-only">AI Providers Table</caption>
            <thead>
              <tr className="border-border-subtle text-fg-muted border-b text-left text-xs font-semibold tracking-wider uppercase">
                <th className="p-4">{t("provider")}</th>
                <th className="p-4">{t("slug")}</th>
                <th className="p-4">{t("website")}</th>
                <th className="p-4">{t("status")}</th>
                <th className="p-4">Respondent</th>
              </tr>
            </thead>
            <tbody className="divide-border-subtle divide-y">
              {((data as unknown as Array<Record<string, unknown>>) ?? []).map((p) => (
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
                        {t("verified")}
                      </Badge>
                    ) : (
                      <Badge variant="warning" dot>
                        {t("unverified")}
                      </Badge>
                    )}
                  </td>
                  <td className="p-4">
                    <VerifiedRespondentToggle
                      providerId={p["id"] as string}
                      isVerified={!!p["is_verified_respondent"]}
                      contactEmail={p["respondent_contact_email"] as string | null}
                      providerName={p["name"] as string}
                    />
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
