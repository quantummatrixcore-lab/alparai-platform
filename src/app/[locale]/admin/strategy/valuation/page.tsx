import React from "react";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/layout";
import { requireAdvisor } from "@/lib/auth/session";
import { createServerClient } from "@/lib/supabase/server";
import { ValuationCalculatorClient } from "@/components/admin/strategy/valuation-calculator-client";
import { TrendingUp } from "lucide-react";
import type { StrategyValuation } from "@/types";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admin" });
  return { title: `${t("strategy_valuation") || "Valuation Calculator"} | ALPAR AI` };
}

export default async function ValuationPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Authenticate user & check advisor access
  const user = await requireAdvisor();
  const isReadOnly = user.role === "advisor";

  const supabase = await createServerClient();
  const { data } = await supabase
    .from("strategy_valuations")
    .select("*")
    .order("snapshot_date", { ascending: false });

  const initialValuations = (data ?? []) as StrategyValuation[];

  return (
    <div className="min-h-screen py-8">
      <Container>
        {/* Page Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-amber-400" />
              <h1 className="text-2xl font-extrabold tracking-tight text-white md:text-3xl">
                {locale === "tr" ? "Şirket Değerleme Simülatörü" : "Company Valuation Simulator"}
              </h1>
            </div>
            <p className="text-fg-muted mt-1 text-sm">
              {locale === "tr"
                ? "Berkus, Scorecard ve Girişim Sermayesi (VC) yöntemlerine göre pre-money değerleme modelleri."
                : "Simulate valuation caps with Berkus, Scorecard, and VC exit methodologies."}
            </p>
          </div>
          {isReadOnly && (
            <span className="bg-brand-500/10 text-brand-300 border-brand-500/20 rounded-full border px-3 py-1 text-xs font-semibold tracking-wider uppercase">
              {locale === "tr" ? "Salt Okunur" : "Read-Only"}
            </span>
          )}
        </div>

        {/* Valuation Calculator Component */}
        <ValuationCalculatorClient
          initialValuations={initialValuations}
          isReadOnly={isReadOnly}
          locale={locale}
        />
      </Container>
    </div>
  );
}
