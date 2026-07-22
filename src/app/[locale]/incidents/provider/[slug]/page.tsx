export const revalidate = 60;

import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { Container } from "@/components/ui/layout";
import { Shield, Activity, Cpu } from "lucide-react";
import { Link } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug, locale } = await params;
  const supabase = await createServerClient();
  const { data: provider } = await supabase
    .from("ai_providers")
    .select("name, description")
    .eq("slug", slug)
    .maybeSingle();

  const providerName = provider?.name || slug.toUpperCase();
  return {
    title:
      locale === "tr"
        ? `${providerName} Yapay Zeka Hataları ve Olay Raporları`
        : `${providerName} AI Incidents & Failure Reports`,
    description:
      locale === "tr"
        ? `${providerName} modellerinin ürettiği doğruluk ihlalleri, halüsinasyonlar ve güvenlik zafiyetlerinin açık veri tabanı.`
        : `Public database of safety incidents, hallucinations, and accountability reports for ${providerName} AI models.`,
  };
}

export default async function ProviderIncidentsPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const supabase = await createServerClient();
  const { data: provider } = await supabase
    .from("ai_providers")
    .select("id, name, slug, description, website_url, is_verified")
    .eq("slug", slug)
    .maybeSingle();

  if (!provider) notFound();

  const { data: incidents } = await supabase
    .from("incidents")
    .select("id, title_masked, category, severity, incident_date")
    .eq("ai_provider_id", provider.id)
    .eq("status", "published")
    .order("incident_date", { ascending: false })
    .limit(20);

  const incidentList = incidents ?? [];

  return (
    <Container className="py-10">
      <header className="mb-8 rounded-xl border border-white/10 bg-white/5 p-6 shadow-lg">
        <div className="mb-2 flex items-center gap-3">
          <Cpu className="text-brand-400 h-6 w-6" />
          <h1 className="text-2xl font-bold text-white">
            {locale === "tr"
              ? `${provider.name} AI Olay Raporları`
              : `${provider.name} AI Incident Cluster`}
          </h1>
        </div>
        <p className="text-fg-muted max-w-2xl text-sm">
          {provider.description ||
            (locale === "tr"
              ? "Bu sağlayıcıya ait tüm yapay zeka hataları ve topluluk bildirimleri."
              : "Verified incident log and accountability trail for this AI provider.")}
        </p>
      </header>

      <section className="mb-10 space-y-4">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
          <Activity className="h-5 w-5 text-emerald-400" />
          {locale === "tr" ? "Son Bildirilen Olaylar" : "Recently Reported Incidents"}
        </h2>

        {incidentList.length === 0 ? (
          <div className="text-fg-muted rounded-lg border border-white/10 bg-white/5 p-8 text-center text-sm">
            {locale === "tr"
              ? "Bu sağlayıcı için henüz doğrulanmış olay bulunmuyor."
              : "No verified incidents reported for this provider yet."}
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {incidentList.map((inc) => (
              <Link
                key={inc.id}
                href={`/incidents/${inc.id}`}
                className="hover:border-brand-500/50 block rounded-lg border border-white/10 bg-white/5 p-4 transition hover:bg-white/10"
              >
                <div className="text-fg-muted mb-1 flex items-center justify-between text-xs">
                  <span className="text-brand-400 font-mono uppercase">{inc.category}</span>
                  <span>
                    {new Date((inc.incident_date as string) || "2026-01-01").toLocaleDateString(
                      locale,
                    )}
                  </span>
                </div>
                <h3 className="line-clamp-2 text-sm font-medium text-white">{inc.title_masked}</h3>
              </Link>
            ))}
          </div>
        )}
      </section>

      <div className="border-brand-500/30 bg-brand-500/10 rounded-xl border p-6 text-center">
        <h3 className="mb-2 text-base font-bold text-white">
          {locale === "tr"
            ? `${provider.name} ile İlgili Bir Sorun mu Yaşadınız?`
            : `Encountered an issue with ${provider.name}?`}
        </h3>
        <Link
          href="/submit"
          className="bg-brand-500 hover:bg-brand-600 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold text-white transition"
        >
          <Shield className="h-4 w-4" />
          {locale === "tr" ? "Yeni Olay Bildir" : "Report New Incident"}
        </Link>
      </div>
    </Container>
  );
}
