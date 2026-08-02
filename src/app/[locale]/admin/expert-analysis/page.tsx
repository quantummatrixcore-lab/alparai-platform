import { EXPERT_PERSONAS, type ExpertPersona } from "@/lib/config/expert-personas";
import {
  Users,
  Sparkles,
  Brain,
  ShieldAlert,
  Rocket,
  DollarSign,
  Scale,
  Eye,
  Radio,
  Share2,
} from "lucide-react";
import { useTranslations } from "next-intl";

const ICON_MAP: Record<string, React.ReactNode> = {
  "ai-ecosystem-architect": <Brain className="h-6 w-6 text-purple-400" />,
  "silicon-valley-startup-team": <Rocket className="h-6 w-6 text-amber-400" />,
  "vc-angel-investor": <DollarSign className="h-6 w-6 text-emerald-400" />,
  "advisory-board": <Users className="h-6 w-6 text-blue-400" />,
  "growth-gtm-hacker": <Sparkles className="h-6 w-6 text-pink-400" />,
  "regulatory-legal-assessor": <Scale className="h-6 w-6 text-cyan-400" />,
  "futurist-strategist": <Eye className="h-6 w-6 text-indigo-400" />,
  "red-team-security": <ShieldAlert className="h-6 w-6 text-rose-400" />,
  "osint-analyst": <Radio className="h-6 w-6 text-yellow-400" />,
  "social-media-viral-strategist": <Share2 className="h-6 w-6 text-teal-400" />,
};

export default function ExpertAnalysisAdminPage() {
  const t = useTranslations("admin");
  return (
    <div className="space-y-8 p-6 text-white">
      <div>
        <h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight text-white">
          <Users className="h-8 w-8 text-cyan-400" />
          {t("multi_perspective_expert_board_analysis")}
        </h1>
        <p className="mt-2 text-slate-400">{t("simulated_10_persona_c_suite_specialist_")}</p>
      </div>

      {/* Grid of 10 Expert Personas */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {EXPERT_PERSONAS.map((persona: ExpertPersona) => (
          <div
            key={persona.id}
            className="flex flex-col justify-between space-y-4 rounded-xl border border-slate-800 bg-slate-900/80 p-6 transition hover:border-slate-700"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="rounded-lg border border-slate-700 bg-slate-800/60 p-2.5">
                  {ICON_MAP[persona.id] ?? <Brain className="h-6 w-6 text-cyan-400" />}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{persona.name}</h3>
                  <p className="font-mono text-xs text-slate-400">{persona.roleTitle}</p>
                </div>
              </div>
              <p className="line-clamp-3 text-xs text-slate-300">{persona.focusArea}</p>
            </div>

            <div className="flex items-center justify-between border-t border-slate-800/80 pt-2">
              <span className="rounded border border-cyan-800/60 bg-cyan-950/60 px-2 py-0.5 font-mono text-[11px] text-cyan-400">
                {t("chain")}
                {persona.capabilityDomain}
              </span>
              <button
                type="button"
                className="flex items-center gap-1.5 rounded-md bg-cyan-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-cyan-500"
              >
                <Sparkles className="h-3.5 w-3.5" />
                {t("trigger_analysis")}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
