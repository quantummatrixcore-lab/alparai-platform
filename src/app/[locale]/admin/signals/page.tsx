import { setRequestLocale, getTranslations } from "next-intl/server";
import {
  Lightning,
  ArrowsLeftRight,
  WarningCircle,
  HardDrives,
} from "@phosphor-icons/react/dist/ssr";

interface SignalCard {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

const MOCK_SIGNALS: SignalCard[] = [
  {
    label: "signals_latency",
    value: "87ms p50 · 312ms p95",
    icon: <Lightning weight="duotone" className="h-6 w-6" />,
    color: "text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]",
  },
  {
    label: "signals_traffic",
    value: "42 RPS avg · 156 RPS peak",
    icon: <ArrowsLeftRight weight="duotone" className="h-6 w-6" />,
    color: "text-brand-400 shadow-[0_0_15px_rgba(168,85,247,0.15)]",
  },
  {
    label: "signals_errors",
    value: "0.04% · 12/h rate",
    icon: <WarningCircle weight="duotone" className="h-6 w-6" />,
    color: "text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.15)]",
  },
  {
    label: "signals_saturation",
    value: "DB 32/100 · Mem 45%",
    icon: <HardDrives weight="duotone" className="h-6 w-6" />,
    color: "text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.15)]",
  },
];

export default async function SignalsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "admin" });

  return (
    <div className="animate-in fade-in space-y-8 duration-500">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-white drop-shadow-md">
          {t("signals_title")}
        </h1>
        <p className="text-fg-secondary mt-2">{t("signals_subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {MOCK_SIGNALS.map((s) => (
          <div
            key={s.label}
            className={`bg-bg-secondary/40 group relative overflow-hidden rounded-2xl border border-white/5 p-6 backdrop-blur-xl ${s.color}`}
          >
            <div className="flex items-center justify-between">
              <div className="rounded-xl border border-white/5 bg-white/5 p-3 transition-transform group-hover:scale-110">
                {s.icon}
              </div>
            </div>
            <div className="mt-4">
              <p className="font-mono text-lg font-black tracking-tighter text-white">{s.value}</p>
              <p className="text-fg-muted mt-1 text-xs font-bold tracking-wide uppercase">
                {t(s.label)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-bg-secondary/40 rounded-xl border border-white/5 p-6 backdrop-blur">
        <p className="text-fg-muted mb-2 text-xs font-bold tracking-wide uppercase">
          {t("signals_refresh_note")}
        </p>
        <p className="text-fg-muted/50 text-sm">{t("signals_refresh_desc")}</p>
      </div>
    </div>
  );
}
