import React from "react";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/layout";
import { requireAdvisor } from "@/lib/auth/session";
import { createServerClient } from "@/lib/supabase/server";
import { RiskMatrixClient } from "@/components/admin/strategy/risk-matrix-client";
import { ShieldAlert } from "lucide-react";
import type { StrategyRisk } from "@/types";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admin" });
  return { title: `${t("strategy_risks") || "Risk Matrix"} | ALPAR AI` };
}

export default async function RisksPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Authenticate user & check advisor access
  const user = await requireAdvisor();
  const isReadOnly = user.role === "advisor";

  const supabase = await createServerClient();
  const { data } = await supabase.from("strategy_risks").select("*").order("code");

  const initialRisks = (data ?? []) as StrategyRisk[];

  return (
    <div className="min-h-screen py-8">
      <Container>
        {/* Page Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-6 w-6 text-red-400" />
              <h1 className="text-2xl font-extrabold tracking-tight text-white md:text-3xl">
                {locale === "tr" ? "Stratejik Risk Matrisi (5x5)" : "Risk Prioritization Heatmap"}
              </h1>
            </div>
            <p className="text-fg-muted mt-1 text-sm">
              {locale === "tr"
                ? "Operasyonel, teknik, yasal ve finansal risk profillerini önceliklendirir."
                : "Map probability vs impact score cards to prioritize operational, compliance, and product risks."}
            </p>
          </div>
          {isReadOnly && (
            <span className="bg-brand-500/10 text-brand-300 border-brand-500/20 rounded-full border px-3 py-1 text-xs font-semibold tracking-wider uppercase">
              {locale === "tr" ? "Salt Okunur" : "Read-Only"}
            </span>
          )}
        </div>

        {/* Risk Heatmap & Matrix */}
        <RiskMatrixClient initialRisks={initialRisks} isReadOnly={isReadOnly} locale={locale} />
      </Container>
    </div>
  );
}
