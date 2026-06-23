"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Radio, AlertTriangle, ShieldAlert, AlertCircle, Building2 } from "lucide-react";
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

const OpenAIIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M19.72 10.4A4.1 4.1 0 0 0 19.31 7.48A4.1 4.1 0 0 0 16.86 5.41A4.2 4.2 0 0 0 13.9 5.8A4.15 4.15 0 0 0 10.9 4.5A4.2 4.2 0 0 0 7.6 6.13A4.13 4.13 0 0 0 5.6 7.48A4.1 4.1 0 0 0 4.85 10.8A4.1 4.1 0 0 0 6.85 13.56A4.13 4.13 0 0 0 6.78 14.56A4.15 4.15 0 0 0 8.03 17.56A4.2 4.2 0 0 0 11.23 19A4.18 4.18 0 0 0 14.23 20.3A4.15 4.15 0 0 0 17.52 18.67A4.15 4.15 0 0 0 19.52 17.32A4.1 4.1 0 0 0 20.28 14A4.1 4.1 0 0 0 18.28 11.24A4.13 4.13 0 0 0 19.72 10.4Z"
      stroke="#10A37F"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="12" r="2" fill="#10A37F" />
  </svg>
);

const GeminiIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 2C12 7.52285 7.52285 12 2 12C7.52285 12 12 16.4771 12 22C12 16.4771 16.4771 12 22 12C16.4771 12 12 7.52285 12 2Z"
      fill="url(#gemini-gradient)"
    />
    <defs>
      <linearGradient
        id="gemini-gradient"
        x1="2"
        y1="2"
        x2="22"
        y2="22"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#9BC5FF" />
        <stop offset="0.5" stopColor="#E0B6FF" />
        <stop offset="1" stopColor="#FFC5E3" />
      </linearGradient>
    </defs>
  </svg>
);

const AnthropicIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M4 19L11.2 5H12.8L20 19H17.8L15.6 14.5H8.4L6.2 19H4ZM12 7.7L9.4 13H14.6L12 7.7Z"
      fill="#E0B89C"
    />
  </svg>
);

const MicrosoftIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="10.5" height="10.5" fill="#F25022" />
    <rect x="11.5" width="10.5" height="10.5" fill="#7FBA00" />
    <rect y="11.5" width="10.5" height="10.5" fill="#00A4EF" />
    <rect x="11.5" y="11.5" width="10.5" height="10.5" fill="#FFB900" />
  </svg>
);

const MetaIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M17 7C14.6 7 12.6 8.5 12 10.6C11.4 8.5 9.4 7 7 7C3.1 7 0 10.1 0 14C0 17.9 3.1 21 7 21C9.4 21 11.4 19.5 12 17.4C12.6 19.5 14.6 21 17 21C20.9 21 24 17.9 24 14C24 10.1 20.9 7 17 7ZM7 18.5C4.5 18.5 2.5 16.5 2.5 14C2.5 11.5 4.5 9.5 7 9.5C9.5 9.5 11.5 11.5 11.5 14C11.5 16.5 9.5 18.5 7 18.5ZM17 18.5C14.5 18.5 12.5 16.5 12.5 14C12.5 11.5 14.5 9.5 17 9.5C19.5 9.5 21.5 11.5 21.5 14C21.5 16.5 19.5 18.5 17 18.5Z"
      fill="#0081FB"
    />
  </svg>
);

const AppleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 22C7.79 22.05 6.8 20.68 5.96 19.47C4.25 17 2.94 12.45 4.7 9.39C5.57 7.87 7.13 6.91 8.82 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.1 16.67C20.08 16.73 19.67 18.11 18.71 19.5ZM15.97 4.17C16.63 3.37 17.07 2.28 16.95 1C15.85 1.04 14.51 1.73 13.73 2.64C13.07 3.41 12.49 4.52 12.64 5.78C13.87 5.87 15.12 5.17 15.97 4.17Z"
      fill="#A2A2A2"
    />
  </svg>
);

const XAIIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
      fill="#FFFFFF"
    />
  </svg>
);

const EUIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="4" fill="#003399" />
    <g fill="#FFCC00">
      <path d="M12 3.5l.2.7h.7l-.6.4.2.7-.5-.4-.5.4.2-.7-.6-.4h.7z" />
      <path d="M16.25 4.6l.2.7h.7l-.6.4.2.7-.5-.4-.5.4.2-.7-.6-.4h.7z" />
      <path d="M19.4 7.75l.2.7h.7l-.6.4.2.7-.5-.4-.5.4.2-.7-.6-.4h.7z" />
      <path d="M20.5 12l.2.7h.7l-.6.4.2.7-.5-.4-.5.4.2-.7-.6-.4h.7z" />
      <path d="M19.4 16.25l.2.7h.7l-.6.4.2.7-.5-.4-.5.4.2-.7-.6-.4h.7z" />
      <path d="M16.25 19.4l.2.7h.7l-.6.4.2.7-.5-.4-.5.4.2-.7-.6-.4h.7z" />
      <path d="M12 20.5l.2.7h.7l-.6.4.2.7-.5-.4-.5.4.2-.7-.6-.4h.7z" />
      <path d="M7.75 19.4l.2.7h.7l-.6.4.2.7-.5-.4-.5.4.2-.7-.6-.4h.7z" />
      <path d="M4.6 16.25l.2.7h.7l-.6.4.2.7-.5-.4-.5.4.2-.7-.6-.4h.7z" />
      <path d="M3.5 12l.2.7h.7l-.6.4.2.7-.5-.4-.5.4.2-.7-.6-.4h.7z" />
      <path d="M4.6 7.75l.2.7h.7l-.6.4.2.7-.5-.4-.5.4.2-.7-.6-.4h.7z" />
      <path d="M7.75 4.6l.2.7h.7l-.6.4.2.7-.5-.4-.5.4.2-.7-.6-.4h.7z" />
    </g>
  </svg>
);

const KoreaIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="4" fill="#F8F9FA" />
    <circle cx="12" cy="12" r="5" fill="#CD2E3A" />
    <path
      d="M12 7C9.24 7 7 9.24 7 12C7 14.76 9.24 17 12 17C12 14.24 14.24 12 17 12C14.24 12 12 9.24 12 7Z"
      fill="#0047A0"
    />
    <rect x="5" y="5" width="2" height="0.6" transform="rotate(45 5 5)" fill="#000000" />
    <rect x="17" y="17" width="2" height="0.6" transform="rotate(45 17 17)" fill="#000000" />
    <rect x="5" y="17" width="2" height="0.6" transform="rotate(-45 5 17)" fill="#000000" />
    <rect x="17" y="5" width="2" height="0.6" transform="rotate(-45 17 5)" fill="#000000" />
  </svg>
);

const SecurityShieldIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 2L4 5v6c0 5.25 3.42 10.16 8 11 4.58-.84 8-5.75 8-11V5l-8-3z"
      fill="url(#shield-grad)"
      stroke="#06B6D4"
      strokeWidth="1.5"
    />
    <path
      d="M12 6v10M9 9l3-3 3 3"
      stroke="#FFFFFF"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <defs>
      <linearGradient id="shield-grad" x1="4" y1="2" x2="20" y2="22" gradientUnits="userSpaceOnUse">
        <stop stopColor="#0891B2" stopOpacity="0.4" />
        <stop offset="1" stopColor="#0E7490" stopOpacity="0.1" />
      </linearGradient>
    </defs>
  </svg>
);

const ResearchAnalyticsIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="4" fill="#1E1B4B" />
    <path d="M6 18V12M12 18V8M18 18V14" stroke="#A855F7" strokeWidth="2.5" strokeLinecap="round" />
    <path
      d="M5 8l6-4 8 5"
      stroke="#F43F5E"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="19" cy="9" r="1.5" fill="#F43F5E" />
  </svg>
);

function getItemIcon(item: NewsTickerItem) {
  const title = item.title.toLowerCase();
  const source = item.source?.toLowerCase() || "";

  // 1. Check for institutional/research sources first to avoid generic severity symbols
  if (
    source.includes("european commission") ||
    title.includes("eu ai act") ||
    source.includes("commission") ||
    source.includes("european union")
  ) {
    return <EUIcon className="h-5 w-5 shrink-0" />;
  }
  if (
    source.includes("korea") ||
    title.includes("south korea") ||
    source.includes("republic of korea")
  ) {
    return <KoreaIcon className="h-5 w-5 shrink-0" />;
  }
  if (
    source.includes("security research") ||
    title.includes("echoleak") ||
    title.includes("vulnerability")
  ) {
    return <SecurityShieldIcon className="h-5 w-5 shrink-0" />;
  }
  if (
    source.includes("industry research") ||
    title.includes("spending") ||
    title.includes("governance platform")
  ) {
    return <ResearchAnalyticsIcon className="h-5 w-5 shrink-0" />;
  }

  // 2. Check for brand names in title or source
  if (
    title.includes("openai") ||
    title.includes("chatgpt") ||
    title.includes("gpt-") ||
    source.includes("openai") ||
    source.includes("chatgpt")
  ) {
    return <OpenAIIcon className="h-4 w-4 shrink-0" />;
  }
  if (
    title.includes("google") ||
    title.includes("gemini") ||
    title.includes("deepmind") ||
    source.includes("google") ||
    source.includes("gemini") ||
    source.includes("deepmind")
  ) {
    return <GeminiIcon className="h-4 w-4 shrink-0" />;
  }
  if (
    title.includes("anthropic") ||
    title.includes("claude") ||
    source.includes("anthropic") ||
    source.includes("claude")
  ) {
    return <AnthropicIcon className="h-4 w-4 shrink-0" />;
  }
  if (
    title.includes("microsoft") ||
    title.includes("bing") ||
    title.includes("copilot") ||
    source.includes("microsoft") ||
    source.includes("bing") ||
    source.includes("copilot")
  ) {
    return <MicrosoftIcon className="h-3.5 w-3.5 shrink-0" />;
  }
  if (
    title.includes("meta") ||
    title.includes("llama") ||
    source.includes("meta") ||
    source.includes("llama")
  ) {
    return <MetaIcon className="h-4 w-4 shrink-0" />;
  }
  if (title.includes("apple") || source.includes("apple")) {
    return <AppleIcon className="h-4 w-4 shrink-0" />;
  }
  if (
    title.includes("xai") ||
    title.includes("grok") ||
    source.includes("xai") ||
    source.includes("grok")
  ) {
    return <XAIIcon className="h-3.5 w-3.5 shrink-0" />;
  }

  // 2. Check for security/vulnerability topics
  if (
    title.includes("leak") ||
    title.includes("vulnerability") ||
    title.includes("hack") ||
    title.includes("breach") ||
    title.includes("security")
  ) {
    return (
      <ShieldAlert className="text-danger-400 h-3.5 w-3.5 shrink-0 drop-shadow-[0_0_3px_rgba(244,63,94,0.6)] filter" />
    );
  }

  // 3. Check for regulation/legal/law/act topics
  if (
    title.includes("act") ||
    title.includes("regulation") ||
    title.includes("law") ||
    title.includes("ban") ||
    title.includes("hapis") ||
    title.includes("ceza") ||
    title.includes("yasa")
  ) {
    return (
      <AlertTriangle className="text-warning-400 h-3.5 w-3.5 shrink-0 drop-shadow-[0_0_3px_rgba(251,191,36,0.6)] filter" />
    );
  }

  // 4. Default fallbacks based on severity
  if (item.severity === "critical")
    return <ShieldAlert className="text-danger-400 h-3.5 w-3.5 shrink-0" />;
  if (item.severity === "high")
    return <AlertTriangle className="text-warning-400 h-3.5 w-3.5 shrink-0" />;
  if (item.severity === "medium")
    return <AlertCircle className="text-brand-400 h-3.5 w-3.5 shrink-0" />;

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
              duration: Math.max(6, displayItems.length * 0.2),
              repeat: Infinity,
              ease: "linear",
            }}
            className="flex items-center gap-8 pl-6 whitespace-nowrap"
          >
            {displayItems.map((item, i) => (
              <div key={`${item.id}-${i}`} className="flex items-center gap-3">
                <span
                  className={`h-1.5 w-1.5 shrink-0 rounded-full ${SEVERITY_DOTS[item.severity]} inline-block`}
                />
                <div className="flex items-center gap-2">
                  {getItemIcon(item)}
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
