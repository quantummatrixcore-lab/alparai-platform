import React from "react";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/layout";
import { requireAdvisor } from "@/lib/auth/session";
import { createServerClient } from "@/lib/supabase/server";
import { RoadmapClient } from "@/components/admin/strategy/roadmap-client";
import { Compass } from "lucide-react";
import type { StrategyMilestone } from "@/types";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admin" });
  return { title: `${t("strategy_roadmap") || "OKR Roadmap"} | ALPAR AI` };
}

export default async function RoadmapPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Authenticate user & check advisor access
  const user = await requireAdvisor();
  const isReadOnly = user.role === "advisor";

  const supabase = await createServerClient();
  const { data } = await supabase.from("strategy_milestones").select("*").order("quarter");

  const initialMilestones = (data ?? []) as StrategyMilestone[];

  return (
    <div className="min-h-screen py-8">
      <Container>
        {/* Page Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <Compass className="h-6 w-6 text-blue-400" />
              <h1 className="text-2xl font-extrabold tracking-tight text-white md:text-3xl">
                {locale === "tr" ? "Milestone ve OKR Yol Haritası" : "Strategic Milestone Roadmap"}
              </h1>
            </div>
            <p className="text-fg-muted mt-1 text-sm">
              {locale === "tr"
                ? "Geliştirme hedefleri, pazar lansmanı ve çeyreklik OKR milestone takipleri."
                : "Track quarterly objectives, key results, and major startup rollout milestones."}
            </p>
          </div>
          {isReadOnly && (
            <span className="bg-brand-500/10 text-brand-300 border-brand-500/20 rounded-full border px-3 py-1 text-xs font-semibold tracking-wider uppercase">
              {locale === "tr" ? "Salt Okunur" : "Read-Only"}
            </span>
          )}
        </div>

        {/* Roadmap milestones timeline */}
        <RoadmapClient
          initialMilestones={initialMilestones}
          isReadOnly={isReadOnly}
          locale={locale}
        />
      </Container>
    </div>
  );
}
