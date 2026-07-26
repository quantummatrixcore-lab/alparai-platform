import { setRequestLocale, getTranslations } from "next-intl/server";
import { Radio, Cpu, Pulse } from "@phosphor-icons/react/dist/ssr";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/admin/metric-card";

export default async function AiPulsePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "admin" });

  const models = [
    {
      name: "GPT-4o",
      provider: "OpenAI",
      status: t("operational"),
      latency: "340ms",
    },
    {
      name: "Claude 3.5 Sonnet",
      provider: "Anthropic",
      status: t("operational"),
      latency: "210ms",
    },
    {
      name: "Gemini 1.5 Flash",
      provider: "Google",
      status: t("operational"),
      latency: "180ms",
    },
  ];

  const newsFeed = [
    {
      title: t("openai_announces_new_reasoning_capabilit"),
      date: t("2_hours_ago"),
    },
    {
      title: t("anthropic_expands_claude_3_5_api_context"),
      date: t("5_hours_ago"),
    },
    {
      title: t("google_deepmind_open_sources_new_protein"),
      date: t("1_day_ago"),
    },
    {
      title: t("eu_ai_act_implementation_phase_begins"),
      date: t("2_days_ago"),
    },
  ];

  return (
    <div className="animate-in fade-in space-y-8 duration-500">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-white drop-shadow-md">
          {t("ai_pulse_title")}
        </h1>
        <p className="text-fg-secondary mt-2">{t("ai_pulse_subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard
          title="GPT-4o P95 Latency"
          value="340ms"
          icon={<Cpu className="h-4 w-4" />}
          trend="neutral"
          trendLabel="Stable"
          accentColor="#10b981"
          sparkData={[
            { value: 310 },
            { value: 345 },
            { value: 320 },
            { value: 360 },
            { value: 330 },
            { value: 340 },
          ]}
          chartType="line"
        />
        <MetricCard
          title="Claude 3.5 Sonnet Latency"
          value="210ms"
          icon={<Cpu className="h-4 w-4" />}
          trend="down"
          trendLabel="Improving"
          accentColor="#6366f1"
          sparkData={[
            { value: 250 },
            { value: 230 },
            { value: 220 },
            { value: 215 },
            { value: 218 },
            { value: 210 },
          ]}
          chartType="line"
        />
        <MetricCard
          title="Gemini 1.5 Flash Latency"
          value="180ms"
          icon={<Cpu className="h-4 w-4" />}
          trend="down"
          trendLabel="Fastest"
          accentColor="#f59e0b"
          sparkData={[
            { value: 200 },
            { value: 195 },
            { value: 188 },
            { value: 190 },
            { value: 183 },
            { value: 180 },
          ]}
          chartType="line"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Model Health Tracker */}
        <Card className="bg-bg-secondary/40 overflow-hidden border-white/5 backdrop-blur-xl lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between border-b border-white/5">
            <CardTitle className="text-fg-muted flex items-center gap-2 text-sm font-bold tracking-wider uppercase">
              <Pulse weight="duotone" className="h-4 w-4" /> {t("integrated_models_health")}
            </CardTitle>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
              </span>
              <span className="font-mono text-xs text-emerald-400">{t("all_operational")}</span>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-white/5">
              {models.map((model, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 transition-colors hover:bg-white/[0.02]"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                      <Cpu weight="duotone" className="text-fg-muted h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{model.name}</h3>
                      <p className="text-fg-muted text-xs">{model.provider}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="font-mono text-xs text-emerald-400">{model.status}</p>
                      <p className="text-fg-muted font-mono text-[10px]">{model.latency}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Global AI News Feed */}
        <Card className="bg-bg-secondary/40 overflow-hidden border-white/5 backdrop-blur-xl">
          <CardHeader className="border-b border-white/5">
            <CardTitle className="text-fg-muted flex items-center gap-2 text-sm font-bold tracking-wider uppercase">
              <Radio weight="duotone" className="h-4 w-4" /> {t("global_intelligence")}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-4">
              {newsFeed.map((news, i) => (
                <div key={i} className="group cursor-pointer">
                  <h4 className="text-fg-primary group-hover:text-brand-300 line-clamp-2 text-sm transition-colors">
                    {news.title}
                  </h4>
                  <p className="text-fg-muted mt-1 font-mono text-[10px]">{news.date}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
