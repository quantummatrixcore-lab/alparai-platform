"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Radio, AlertTriangle, ShieldAlert, Cpu, AlertCircle, Building2 } from "lucide-react";
import { useTranslations } from "next-intl";

type NewsTickerItem = {
  id: string;
  title: string;
  severity: "critical" | "high" | "medium" | "low";
  source?: string | null;
};

const SEVERITY_COLORS: Record<NewsTickerItem["severity"], string> = {
  critical: "text-danger-400",
  high: "text-warning-400",
  medium: "text-brand-400",
  low: "text-fg-muted",
};

const SEVERITY_DOTS: Record<NewsTickerItem["severity"], string> = {
  critical: "bg-danger-500",
  high: "bg-warning-500",
  medium: "bg-brand-500",
  low: "bg-fg-muted",
};

function getSourceIcon(source?: string | null, severity?: string | null) {
  const src = source?.toLowerCase() || "";
  if (src.includes("openai") || src.includes("chatgpt")) {
    return <Cpu className="h-3.5 w-3.5 shrink-0 text-emerald-400" />;
  }
  if (src.includes("google") || src.includes("gemini")) {
    return <Cpu className="h-3.5 w-3.5 shrink-0 text-blue-400" />;
  }
  if (src.includes("anthropic") || src.includes("claude")) {
    return <Cpu className="h-3.5 w-3.5 shrink-0 text-amber-500" />;
  }
  if (src.includes("microsoft") || src.includes("bing")) {
    return <Cpu className="h-3.5 w-3.5 shrink-0 text-cyan-400" />;
  }
  if (src.includes("xai") || src.includes("grok")) {
    return <Cpu className="h-3.5 w-3.5 shrink-0 text-purple-400" />;
  }

  if (severity === "critical")
    return <ShieldAlert className="text-danger-400 h-3.5 w-3.5 shrink-0" />;
  if (severity === "high")
    return <AlertTriangle className="text-warning-400 h-3.5 w-3.5 shrink-0" />;
  if (severity === "medium") return <AlertCircle className="text-brand-400 h-3.5 w-3.5 shrink-0" />;

  return <Building2 className="text-fg-muted h-3.5 w-3.5 shrink-0" />;
}

export function NewsTicker({ items }: { items: NewsTickerItem[] }) {
  const t = useTranslations("common");
  const displayItems = items.length > 0 ? [...items, ...items] : [];

  if (displayItems.length === 0) return null;

  return (
    <div className="border-danger-500/20 bg-bg-secondary/80 relative overflow-hidden border-y backdrop-blur-sm">
      <div className="flex items-stretch">
        <div className="border-danger-500/30 bg-danger-500/10 flex shrink-0 items-center gap-2 border-r px-4 py-2.5">
          <motion.div
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <Radio className="text-danger-400 h-3.5 w-3.5" />
          </motion.div>
          <span className="text-danger-400 text-[10px] font-black tracking-[0.25em] whitespace-nowrap uppercase">
            {t("live")}
          </span>
        </div>

        <div className="relative flex-1 overflow-hidden py-2.5">
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              duration: Math.max(10, displayItems.length * 2.5),
              repeat: Infinity,
              ease: "linear",
            }}
            className="flex items-center gap-8 whitespace-nowrap"
          >
            {displayItems.map((item, i) => (
              <div key={`${item.id}-${i}`} className="flex items-center gap-3">
                <span
                  className={`h-1.5 w-1.5 shrink-0 rounded-full ${SEVERITY_DOTS[item.severity]} inline-block`}
                />
                <div className="flex items-center gap-2">
                  {getSourceIcon(item.source, item.severity)}
                  <span className={`text-sm font-semibold ${SEVERITY_COLORS[item.severity]}`}>
                    {item.title}
                  </span>
                </div>
                {item.source && (
                  <span className="text-fg-muted text-xs font-medium">— {item.source}</span>
                )}
                <span className="text-fg-muted/30 mx-4 text-lg">·</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
