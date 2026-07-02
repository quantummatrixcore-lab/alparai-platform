import React from "react";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/layout";
import { requireAdvisor } from "@/lib/auth/session";
import { createServerClient } from "@/lib/supabase/server";
import { RoadmapClient } from "@/components/admin/strategy/roadmap-client";
import { RoadmapTodosClient } from "@/components/admin/strategy/todos-client";
import { Compass } from "lucide-react";
import type { StrategyMilestone, StrategyTodo } from "@/types";

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
  const { data: milestonesData } = await supabase
    .from("strategy_milestones")
    .select("*")
    .order("quarter");
  const { data: todosData } = await supabase
    .from("strategy_todos")
    .select("*")
    .order("priority")
    .order("created_at");

  const initialMilestones = (milestonesData ?? []) as StrategyMilestone[];
  const initialTodos = (todosData ?? []) as StrategyTodo[];

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

        {/* Strategic Scenarios Section */}
        <div className="mb-10">
          <h2 className="mb-4 text-lg font-bold text-white">
            {locale === "tr" ? "Stratejik Yol Haritası Senaryoları" : "Strategic Roadmap Scenarios"}
          </h2>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Scenario A */}
            <div className="relative overflow-hidden rounded-2xl border border-purple-500/20 bg-purple-500/5 p-5 backdrop-blur-md">
              <div className="absolute top-0 right-0 rounded-bl-xl border-b border-l border-purple-500/20 bg-purple-500/10 px-3 py-1 text-[10px] font-extrabold tracking-wider text-purple-400 uppercase">
                {locale === "tr" ? "Senaryo A" : "Scenario A"}
              </div>
              <span className="text-[10px] font-extrabold tracking-widest text-purple-400 uppercase">
                {locale === "tr"
                  ? "İhbar & Olay Genişletmesi"
                  : "Whistleblower & Incident Expansion"}
              </span>
              <h3 className="mt-1 text-base font-black text-white">
                {locale === "tr" ? "Küresel YZ Suç Veritabanı" : "Global AI Crime Database"}
              </h3>
              <p className="text-fg-secondary mt-3 text-xs leading-relaxed">
                {locale === "tr"
                  ? "Yapay zeka sistemlerinin neden olduğu siber suç, manipülasyon ve büyük veri ihlallerini kayıt altına alan ve kamuoyuna duyuran küresel veri havuzu."
                  : "A global repository documenting and publicizing cybercrime, manipulation, and data breaches caused by artificial intelligence systems."}
              </p>
              <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-3">
                <span className="text-fg-muted text-[10px] font-bold tracking-wider uppercase">
                  Status
                </span>
                <span className="rounded border border-purple-500/20 bg-purple-500/10 px-2 py-0.5 text-[9px] font-black text-purple-400 uppercase">
                  {locale === "tr" ? "Geliştiriliyor (Faz 2)" : "In Development (Phase 2)"}
                </span>
              </div>
            </div>

            {/* Scenario B */}
            <div className="relative overflow-hidden rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5 backdrop-blur-md">
              <div className="absolute top-0 right-0 rounded-bl-xl border-b border-l border-blue-500/20 bg-blue-500/10 px-3 py-1 text-[10px] font-extrabold tracking-wider text-blue-400 uppercase">
                {locale === "tr" ? "Senaryo B" : "Scenario B"}
              </div>
              <span className="text-[10px] font-extrabold tracking-widest text-blue-400 uppercase">
                {locale === "tr" ? "Sertifikasyon & Karne" : "Certification & Scorecard"}
              </span>
              <h3 className="mt-1 text-base font-black text-white">
                {locale === "tr" ? "Etik Değerlendirme Çerçevesi" : "Ethical Evaluation Framework"}
              </h3>
              <p className="text-fg-secondary mt-3 text-xs leading-relaxed">
                {locale === "tr"
                  ? "Modellerin şeffaflık, ayrımcılık yapmama ve veri gizliliği kriterlerine göre puanlanması ve AB YZ Yasası (EU AI Act) uyumluluk karnelerinin oluşturulması."
                  : "Scoring models based on transparency, non-discrimination, and privacy criteria, generating EU AI Act compliance scorecards."}
              </p>
              <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-3">
                <span className="text-fg-muted text-[10px] font-bold tracking-wider uppercase">
                  Status
                </span>
                <span className="rounded border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 text-[9px] font-black text-blue-400 uppercase">
                  {locale === "tr" ? "Planlanıyor" : "Active Planning"}
                </span>
              </div>
            </div>

            {/* Scenario C */}
            <div className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 backdrop-blur-md">
              <div className="absolute top-0 right-0 rounded-bl-xl border-b border-l border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[10px] font-extrabold tracking-wider text-emerald-400 uppercase">
                {locale === "tr" ? "Senaryo C" : "Scenario C"}
              </div>
              <span className="text-[10px] font-extrabold tracking-widest text-emerald-400 uppercase">
                {locale === "tr" ? "Arabuluculuk & Şeffaflık" : "Mediation & Transparency"}
              </span>
              <h3 className="mt-1 text-base font-black text-white">
                {locale === "tr" ? "Halka Açık YZ Agoraları" : "Public AI Agoras"}
              </h3>
              <p className="text-fg-secondary mt-3 text-xs leading-relaxed">
                {locale === "tr"
                  ? "YZ sağlayıcıları ile hak ihlaline uğrayan kullanıcılar arasında 'Mahkeme Öncesi' arabuluculuk sağlayan bağımsız hakem heyeti paneli."
                  : "Independent arbitration panel providing pre-court mediation between AI providers and users affected by rights violations."}
              </p>
              <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-3">
                <span className="text-fg-muted text-[10px] font-bold tracking-wider uppercase">
                  Status
                </span>
                <span className="rounded border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[9px] font-black text-emerald-400 uppercase">
                  {locale === "tr" ? "Gelecek Hedef" : "Planned"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Roadmap milestones timeline */}
        <RoadmapClient
          initialMilestones={initialMilestones}
          isReadOnly={isReadOnly}
          locale={locale}
        />

        {/* Roadmap To-Dos / Checklists */}
        <RoadmapTodosClient initialTodos={initialTodos} isReadOnly={isReadOnly} locale={locale} />
      </Container>
    </div>
  );
}
