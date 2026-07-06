import { setRequestLocale } from "next-intl/server";
import { Radio, Cpu, Pulse } from "@phosphor-icons/react/dist/ssr";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AiPulsePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="animate-in fade-in space-y-8 duration-500">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-white drop-shadow-md">
          AI Pulse & Ecosystem
        </h1>
        <p className="text-fg-secondary mt-2">
          Real-time tracking of global AI developments and integrated model statuses.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Model Health Tracker */}
        <Card className="bg-bg-secondary/40 overflow-hidden border-white/5 backdrop-blur-xl lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between border-b border-white/5">
            <CardTitle className="text-fg-muted flex items-center gap-2 text-sm font-bold tracking-wider uppercase">
              <Pulse weight="duotone" className="h-4 w-4" /> Integrated Models Health
            </CardTitle>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
              </span>
              <span className="font-mono text-xs text-emerald-400">ALL SYSTEMS OPERATIONAL</span>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-white/5">
              {[
                { name: "GPT-4o", provider: "OpenAI", status: "Operational", latency: "340ms" },
                {
                  name: "Claude 3.5 Sonnet",
                  provider: "Anthropic",
                  status: "Operational",
                  latency: "210ms",
                },
                {
                  name: "Gemini 1.5 Flash",
                  provider: "Google",
                  status: "Operational",
                  latency: "180ms",
                },
              ].map((model, i) => (
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
              <Radio weight="duotone" className="h-4 w-4" /> Global Intelligence
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-4">
              {[
                {
                  title: "OpenAI announces new reasoning capabilities for o1 models.",
                  date: "2 hours ago",
                },
                { title: "Anthropic expands Claude 3.5 API context window.", date: "5 hours ago" },
                {
                  title: "Google DeepMind open-sources new protein folding framework.",
                  date: "1 day ago",
                },
                { title: "EU AI Act implementation phase begins.", date: "2 days ago" },
              ].map((news, i) => (
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
