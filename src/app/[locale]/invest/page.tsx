import * as React from "react";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { createServerClient } from "@/lib/supabase/server";
import { Container, Section } from "@/components/ui/layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Shield, Activity, Cpu, Award } from "lucide-react";
import { InvestorForm } from "@/components/invest/investor-form";

export const revalidate = 60; // Cache for 1 minute

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "invest" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function InvestPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "invest" });
  const supabase = await createServerClient();

  // Fetch real-time stats
  const { count: incidentCount } = await supabase
    .from("incidents")
    .select("*", { count: "exact", head: true })
    .eq("status", "published");

  const { count: providerCount } = await supabase
    .from("ai_providers")
    .select("*", { count: "exact", head: true });

  const finalIncidentsCount = (incidentCount ?? 0) > 371 ? `${incidentCount}+` : "371+";
  const finalProvidersCount = (providerCount ?? 0) > 23 ? `${providerCount}` : "23";

  return (
    <div className="min-h-screen bg-[#0A1622] text-[#E2E8F0]">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-800 bg-radial-[circle_at_center,_var(--tw-gradient-stops)] from-[#0F2942] via-[#0A1622] to-[#0A1622] pt-20 pb-16 md:pt-32 md:pb-24">
        <Container size="default" className="relative z-10 text-center">
          <Badge className="mb-6 border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold tracking-wider text-emerald-400 uppercase hover:bg-emerald-500/20">
            {t("eyebrow")}
          </Badge>
          <h1 className="mx-auto max-w-4xl text-4xl leading-tight font-extrabold tracking-tight text-white md:text-6xl">
            {t("hero_title")}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-400 md:text-xl">
            {t("hero_subtitle")}
          </p>

          {/* Stats Display */}
          <div className="mx-auto mt-12 grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="rounded-lg border border-slate-800 bg-[#0F1E2E] p-6 text-center transition-all duration-300 hover:border-emerald-500/20 md:p-8">
              <span className="block text-4xl font-black text-emerald-400 md:text-5xl">
                {finalIncidentsCount}
              </span>
              <span className="mt-2 block text-sm font-medium text-slate-400">
                {t("stat_incidents_label")}
              </span>
            </div>
            <div className="rounded-lg border border-slate-800 bg-[#0F1E2E] p-6 text-center transition-all duration-300 hover:border-emerald-500/20 md:p-8">
              <span className="block text-4xl font-black text-emerald-400 md:text-5xl">
                {finalProvidersCount}
              </span>
              <span className="mt-2 block text-sm font-medium text-slate-400">
                {t("stat_providers_label")}
              </span>
            </div>
          </div>

          <div className="mt-10">
            <a
              href="#apply"
              className="text-bg-primary inline-flex items-center justify-center rounded-md bg-emerald-500 px-6 py-3.5 text-base font-bold transition-colors duration-200 hover:bg-emerald-600"
            >
              {t("cta_apply")}
            </a>
          </div>
        </Container>
      </section>

      {/* The Opportunity Section */}
      <Section className="bg-[#0A1622]">
        <Container size="default">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">
              {t("opportunity_title")}
            </h2>
            <div className="mx-auto mt-2 h-1 w-12 rounded bg-emerald-500"></div>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Card 1 */}
            <Card className="border border-slate-800 bg-[#0F1E2E] transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/20">
              <CardContent className="p-8">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="mb-4 text-xl font-bold text-white">
                  {t("opportunity_card1_title")}
                </h3>
                <p className="text-sm leading-relaxed text-slate-400">
                  {t("opportunity_card1_desc")}
                </p>
              </CardContent>
            </Card>

            {/* Card 2 */}
            <Card className="border border-slate-800 bg-[#0F1E2E] transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/20">
              <CardContent className="p-8">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                  <Activity className="h-6 w-6" />
                </div>
                <h3 className="mb-4 text-xl font-bold text-white">
                  {t("opportunity_card2_title")}
                </h3>
                <p className="text-sm leading-relaxed text-slate-400">
                  {t("opportunity_card2_desc")}
                </p>
              </CardContent>
            </Card>

            {/* Card 3 */}
            <Card className="border border-slate-800 bg-[#0F1E2E] transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/20">
              <CardContent className="p-8">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                  <Cpu className="h-6 w-6" />
                </div>
                <h3 className="mb-4 text-xl font-bold text-white">
                  {t("opportunity_card3_title")}
                </h3>
                <p className="text-sm leading-relaxed text-slate-400">
                  {t("opportunity_card3_desc")}
                </p>
              </CardContent>
            </Card>
          </div>
        </Container>
      </Section>

      {/* Traction Section */}
      <Section className="border-y border-slate-800 bg-[#0D1B2A] bg-radial-[circle_at_center,_var(--tw-gradient-stops)] from-[#0F2942]/40 via-[#0D1B2A] to-[#0D1B2A]">
        <Container size="default">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">
              {t("traction_title")}
            </h2>
            <div className="mx-auto mt-2 h-1 w-12 rounded bg-emerald-500"></div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
            <div className="rounded-lg border border-slate-800 bg-[#0F1E2E] p-6 transition-all duration-300 hover:border-emerald-500/10">
              <Calendar className="mb-4 h-6 w-6 text-emerald-400" />
              <h4 className="text-lg font-extrabold text-emerald-400">
                {t("traction_card1_date")}
              </h4>
              <p className="mt-2 text-sm text-slate-400">{t("traction_card1_desc")}</p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-[#0F1E2E] p-6 transition-all duration-300 hover:border-emerald-500/10">
              <Activity className="mb-4 h-6 w-6 text-emerald-400" />
              <h4 className="text-lg font-extrabold text-emerald-400">{finalIncidentsCount}</h4>
              <p className="mt-2 text-sm text-slate-400">{t("traction_card2_desc")}</p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-[#0F1E2E] p-6 transition-all duration-300 hover:border-emerald-500/10">
              <Cpu className="mb-4 h-6 w-6 text-emerald-400" />
              <h4 className="text-lg font-extrabold text-emerald-400">
                {finalProvidersCount} Providers
              </h4>
              <p className="mt-2 text-sm text-slate-400">{t("traction_card3_desc")}</p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-[#0F1E2E] p-6 transition-all duration-300 hover:border-emerald-500/10">
              <Award className="mb-4 h-6 w-6 text-emerald-400" />
              <h4 className="text-lg font-extrabold text-emerald-400">
                {t("traction_card4_title")}
              </h4>
              <p className="mt-2 text-sm text-slate-400">{t("traction_card4_desc")}</p>
            </div>
          </div>
        </Container>
      </Section>

      {/* Business Model Section */}
      <Section className="bg-[#0A1622]">
        <Container size="default">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">
              {t("business_title")}
            </h2>
            <div className="mx-auto mt-2 h-1 w-12 rounded bg-emerald-500"></div>
          </div>

          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
            {/* Stream 1 */}
            <div className="flex flex-col justify-between rounded-lg border border-slate-800 bg-[#0F1E2E]/60 p-8 transition-all duration-300 hover:border-emerald-500/20">
              <div>
                <h4 className="text-lg font-bold text-white">{t("business_card1_title")}</h4>
                <div className="mt-4 h-0.5 w-full bg-emerald-500/20"></div>
                <p className="mt-6 text-sm leading-relaxed text-slate-400">
                  {t("business_card1_desc")}
                </p>
              </div>
            </div>

            {/* Stream 2 */}
            <div className="relative flex flex-col justify-between overflow-hidden rounded-lg border border-emerald-500/30 bg-[#0F1E2E] p-8 shadow-[0_0_15px_rgba(16,185,129,0.05)] transition-all duration-300 hover:border-emerald-500/50">
              <div className="text-bg-primary absolute top-0 right-0 rounded-bl bg-emerald-500 px-3 py-1 text-[10px] font-bold uppercase">
                Popular
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">{t("business_card2_title")}</h4>
                <div className="mt-4 h-0.5 w-full bg-emerald-500/20"></div>
                <p className="mt-6 text-sm leading-relaxed text-slate-400">
                  {t("business_card2_desc")}
                </p>
              </div>
            </div>

            {/* Stream 3 */}
            <div className="flex flex-col justify-between rounded-lg border border-slate-800 bg-[#0F1E2E]/60 p-8 transition-all duration-300 hover:border-emerald-500/20">
              <div>
                <h4 className="text-lg font-bold text-white">{t("business_card3_title")}</h4>
                <div className="mt-4 h-0.5 w-full bg-emerald-500/20"></div>
                <p className="mt-6 text-sm leading-relaxed text-slate-400">
                  {t("business_card3_desc")}
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Vision Section */}
      <Section className="border-t border-slate-800 bg-[#0D1B2A]">
        <Container size="narrow" className="py-8 text-center">
          <h2 className="text-2xl font-extrabold tracking-tight text-white md:text-3xl">
            {t("vision_title")}
          </h2>
          <div className="mx-auto mt-2 h-1 w-12 rounded bg-emerald-500"></div>
          <p className="mx-auto mt-6 max-w-xl text-xl leading-relaxed font-semibold text-slate-300 italic md:text-2xl">
            "{t("vision_desc")}"
          </p>
        </Container>
      </Section>

      {/* Application Form Section */}
      <Section id="apply" className="scroll-mt-10 border-t border-slate-800 bg-[#0A1622]">
        <Container size="narrow">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">
              {t("form_title")}
            </h2>
            <p className="mt-3 text-sm text-slate-400">{t("form_subtitle")}</p>
            <div className="mx-auto mt-4 h-1 w-12 rounded bg-emerald-500"></div>
          </div>

          <Card className="border border-slate-800 bg-[#0F1E2E] shadow-xl">
            <CardContent className="p-6 md:p-8">
              <InvestorForm />
            </CardContent>
          </Card>
        </Container>
      </Section>

      {/* Contact Section */}
      <section className="border-t border-slate-900 bg-[#0A1622] py-12 text-center text-sm md:py-16">
        <Container size="default">
          <p className="text-slate-400">{t("contact_title")}</p>
          <a
            href={`mailto:${t("contact_email")}?subject=${encodeURIComponent(t("contact_subject"))}`}
            className="mt-2 block text-base font-extrabold text-emerald-400 transition-colors hover:text-emerald-300"
          >
            {t("contact_email")}
          </a>
        </Container>
      </section>
    </div>
  );
}
