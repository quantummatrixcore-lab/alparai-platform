"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Copy, CheckCircle2, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { logger } from "@/lib/utils/logger";
import { OutreachQueueList } from "@/components/admin/outreach-queue-list";
import type { OutreachQueueItem } from "@/components/admin/outreach-queue-list";

const MEDIA_PITCH = `Subject: Embargoed Aug 2: The EU just delayed AI incident reporting to 2027 — this registry isn't waiting

Hi [First name],

On August 2, the EU AI Act's serious-incident reporting was supposed to become mandatory. The Digital Omnibus quietly pushed it to December 2027 — leaving a 17-month gap in which no public body records AI failures.

On that same date, we're launching the answer: ALPAR AI, an independent, open-source (AGPL) registry where anyone can report an AI incident anonymously in under a minute, providers get a formal right of reply, and every case is classified against the Article 73 taxonomy regulators will eventually enforce.

At launch: 400+ verified incidents across 40+ providers, a live provider response-rate leaderboard, and a founding case worth reading — an AI that invented a corporation and requested the founder's passport.

Happy to share embargoed access, the dataset sample, and founder interview.

[Ad Soyad] — Founder, ALPAR AI · alparai.com · hello@alparai.com`;

const EXPERT_PITCH = `Konu: ALPAR AI — "State of AI Incidents Q4 2026" raporu için ortak yazarlık daveti

Sayın [Unvan Ad Soyad],

[Üniversite]'deki [alan] çalışmalarınızı takip ediyorum. ALPAR AI, kullanıcıların yapay zekâ kaynaklı olayları (halüsinasyon, önyargı, gizlilik ihlali, güvenlik) kanıtlı ve anonim raporladığı, sağlayıcılara resmi yanıt hakkı tanıyan açık kaynaklı bağımsız bir kayıt platformudur. Şu an 400+ doğrulanmış vaka ve AB AI Act Madde 73 taksonomisiyle hizalı bir veri seti barındırıyor.

Çeyreklik "State of AI Incidents" raporumuzun ilk sayısını Q4 2026'da yayımlayacağız ve [alan] bölümü için ortak yazarlık teklif etmek istiyorum. Beklenen katkı çeyrek başına 2-3 saat (vaka doğrulama + kısa yorum); karşılığında ortak yazarlık, veri setine tam araştırma erişimi ve platformdaki "Doğrulayan Uzman" statüsü sunuyoruz. Öğrencileriniz için de vaka analizi çalışmalarına açığız.

15 dakikalık bir görüşme için uygun olur musunuz?

Saygılarımla, 
[Ad Soyad] — Kurucu, ALPAR AI · alparai.com/academy`;

export function OutreachPageContent({ initialQueue }: { initialQueue: OutreachQueueItem[] }) {
  const t = useTranslations("admin");
  const [activeTab, setActiveTab] = useState<"queue" | "media" | "expert" | "plan">("queue");
  const [copied, setCopied] = useState(false);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      logger.error("Failed to copy", undefined, err instanceof Error ? err : undefined);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2 border-b border-white/5 pb-4">
        <button
          onClick={() => setActiveTab("queue")}
          className={cn(
            "rounded-full px-4 py-2 text-sm font-semibold transition-all",
            activeTab === "queue"
              ? "bg-brand-500/20 text-brand-300 border-brand-500/30 border"
              : "text-slate-400 hover:bg-white/5 hover:text-white",
          )}
        >
          Outreach Queue
        </button>
        <button
          onClick={() => setActiveTab("media")}
          className={cn(
            "rounded-full px-4 py-2 text-sm font-semibold transition-all",
            activeTab === "media"
              ? "bg-brand-500/20 text-brand-300 border-brand-500/30 border"
              : "text-slate-400 hover:bg-white/5 hover:text-white",
          )}
        >
          {t("outreach_media_pitch")}
        </button>
        <button
          onClick={() => setActiveTab("expert")}
          className={cn(
            "rounded-full px-4 py-2 text-sm font-semibold transition-all",
            activeTab === "expert"
              ? "bg-brand-500/20 text-brand-300 border-brand-500/30 border"
              : "text-slate-400 hover:bg-white/5 hover:text-white",
          )}
        >
          {t("outreach_expert_invite")}
        </button>
        <button
          onClick={() => setActiveTab("plan")}
          className={cn(
            "rounded-full px-4 py-2 text-sm font-semibold transition-all",
            activeTab === "plan"
              ? "border border-emerald-500/30 bg-emerald-500/20 text-emerald-300"
              : "text-slate-400 hover:bg-white/5 hover:text-white",
          )}
        >
          {t("outreach_strategy")}
        </button>
      </div>

      <div className="mt-6">
        {activeTab === "queue" && <OutreachQueueList initialQueue={initialQueue} />}

        {activeTab === "media" && (
          <Card className="border-white/5 bg-[#0F1E2E]">
            <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 bg-black/20 pb-4">
              <CardTitle className="text-lg text-emerald-400">Embargoed Press Pitch (EN)</CardTitle>
              <button
                onClick={() => handleCopy(MEDIA_PITCH)}
                className="flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-400 transition-colors hover:bg-emerald-500/20"
              >
                {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? t("outreach_copy_success") : "Copy"}
              </button>
            </CardHeader>
            <CardContent className="pt-6">
              <pre className="font-sans text-sm leading-relaxed whitespace-pre-wrap text-slate-300">
                {MEDIA_PITCH}
              </pre>
            </CardContent>
          </Card>
        )}

        {activeTab === "expert" && (
          <Card className="border-white/5 bg-[#0F1E2E]">
            <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 bg-black/20 pb-4">
              <CardTitle className="text-lg text-emerald-400">
                Academic / Expert Invite (TR)
              </CardTitle>
              <button
                onClick={() => handleCopy(EXPERT_PITCH)}
                className="flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-400 transition-colors hover:bg-emerald-500/20"
              >
                {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? t("outreach_copy_success") : "Copy"}
              </button>
            </CardHeader>
            <CardContent className="pt-6">
              <pre className="font-sans text-sm leading-relaxed whitespace-pre-wrap text-slate-300">
                {EXPERT_PITCH}
              </pre>
              <div className="mt-6 rounded-lg bg-white/5 p-4 text-xs text-slate-400">
                <Info className="text-brand-400 mb-2 h-4 w-4" />
                (EN sürümü aynı yapıda — TU München/ETH/Oxford için gerekirse eklenecektir.)
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "plan" && (
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-white/5 bg-[#0F1E2E]">
              <CardHeader className="border-b border-white/5 bg-black/20">
                <CardTitle className="text-brand-300">Targeting & Strategy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6 text-sm text-slate-300">
                <div>
                  <strong className="mb-1 block text-white">Expert Invites (This Week)</strong>
                  <ul className="list-inside list-disc space-y-1 text-slate-400">
                    <li>Target: 5 people at TR university AI ethics/law labs.</li>
                    <li>Expected response rate: 20-40%.</li>
                    <li>Value prop: Academic co-authorship for Q4 report.</li>
                  </ul>
                </div>
                <div className="border-t border-white/5 pt-4">
                  <strong className="mb-1 block text-white">Media Outlets (Embargoed)</strong>
                  <ul className="list-inside list-disc space-y-1 text-slate-400">
                    <li>Send window: July 27-29.</li>
                    <li>Too early = forgotten; too late = doesn't fit schedules.</li>
                    <li>
                      Targets: AI policy reporters (TechCrunch AI, The Verge policy, Politico Europe
                      tech, MLex, Euractiv digital).
                    </li>
                    <li>Newsletters: Import AI, Transformer.</li>
                    <li>TR Tech Press: Webrazzi, ShiftDelete (corporate).</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="border-emerald-500/20 bg-emerald-500/5">
              <CardHeader className="border-b border-emerald-500/10 bg-emerald-500/10">
                <CardTitle className="flex items-center gap-2 text-emerald-400">
                  <Info className="h-5 w-5" />
                  Golden Rules
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-4 text-sm text-emerald-200/80">
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-emerald-500">1.</span>
                    <p>
                      <strong>Personalized First Line:</strong> Always send from a personal address
                      with a highly personalized first sentence. A mass-email appearance is the
                      "kiss of death".
                    </p>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-emerald-500">2.</span>
                    <p>
                      <strong>Do Not Guess Emails:</strong> Find the exact email or Twitter DM from
                      the author's page on their outlet's site. 10-15 high-quality contacts are
                      enough.
                    </p>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
