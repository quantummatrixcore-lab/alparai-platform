"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import {
  Search,
  Shield,
  Activity,
  Users,
  Globe,
  ToggleRight,
  FileText,
  Zap,
  RotateCw,
  EyeOff,
  Flame,
  Command,
} from "lucide-react";
import { triggerExternalFetch } from "@/actions/ecosystem";

export function Manage360CommandPalette() {
  const t = useTranslations("admin");
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleCrawlerTrigger = async () => {
    setStatusMsg("Triggering AI Scraper & Crawler...");
    const res = await triggerExternalFetch();
    setStatusMsg(res.message);
    setTimeout(() => {
      setStatusMsg(null);
      setIsOpen(false);
    }, 2000);
  };

  const actions = [
    {
      id: "moderation",
      title: t("moderation_queue") || "Moderation Queue (Approve / Reject)",
      category: "Operations",
      icon: Shield,
      action: () => {
        router.push("/admin/moderation");
        setIsOpen(false);
      },
    },
    {
      id: "crawl-trigger",
      title: "Trigger AI Scraper & Ingestion Cron",
      category: "Operations",
      icon: Zap,
      action: handleCrawlerTrigger,
    },
    {
      id: "feature-flags",
      title: t("nav_featureFlags") || "Feature Flags & Kill-Switch",
      category: "System",
      icon: ToggleRight,
      action: () => {
        router.push("/admin/feature-flags");
        setIsOpen(false);
      },
    },
    {
      id: "cost-alarm",
      title: "Cost Telemetry & Throttle Controls",
      category: "System",
      icon: Flame,
      action: () => {
        router.push("/admin/api-metrics");
        setIsOpen(false);
      },
    },
    {
      id: "redaction",
      title: "Redaction & Provider Privacy Queue",
      category: "Governance",
      icon: EyeOff,
      action: () => {
        router.push("/admin/redaction-queue");
        setIsOpen(false);
      },
    },
    {
      id: "takedown",
      title: "DSA Art. 14 Legal Takedowns",
      category: "Governance",
      icon: RotateCw,
      action: () => {
        router.push("/admin/takedown");
        setIsOpen(false);
      },
    },
    {
      id: "geo",
      title: t("nav_geo") || "GEO Engine Telemetry",
      category: "Intelligence",
      icon: Globe,
      action: () => {
        router.push("/admin/geo");
        setIsOpen(false);
      },
    },
    {
      id: "health",
      title: t("nav_systemHealth") || "System Health & SLO Alarms",
      category: "System",
      icon: Activity,
      action: () => {
        router.push("/admin/health");
        setIsOpen(false);
      },
    },
    {
      id: "audit",
      title: t("audit_log") || "Audit Log & System Tracing",
      category: "Governance",
      icon: FileText,
      action: () => {
        router.push("/admin/audit");
        setIsOpen(false);
      },
    },
    {
      id: "users",
      title: t("users") || "Users & Moderator Permissions",
      category: "Governance",
      icon: Users,
      action: () => {
        router.push("/admin/users");
        setIsOpen(false);
      },
    },
  ];

  const filteredActions = actions.filter(
    (a) =>
      a.title.toLowerCase().includes(query.toLowerCase()) ||
      a.category.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <>
      {/* Mobile Floating Command Button */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Open 360 Command Palette"
        className="border-brand-500/40 text-brand-300 fixed bottom-6 left-6 z-40 flex h-12 w-12 items-center justify-center rounded-full border bg-zinc-900/90 shadow-2xl backdrop-blur-xl transition-transform hover:scale-105 sm:hidden"
      >
        <Command className="h-5 w-5" />
      </button>

      {isOpen && (
        <div className="animate-fade-in fixed inset-0 z-50 flex items-start justify-center bg-black/70 pt-20 backdrop-blur-md">
          <div className="mx-4 w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/95 shadow-2xl">
            <div className="flex items-center border-b border-white/10 px-4 py-3.5">
              <Search className="h-5 w-5 text-zinc-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="360° Command Palette — Type a command or search (Cmd+K)"
                className="ml-3 flex-1 bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none"
                autoFocus
              />
              <kbd className="rounded bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400">ESC</kbd>
            </div>

            {statusMsg && (
              <div className="border-brand-500/30 bg-brand-500/10 text-brand-300 border-b px-4 py-2 text-center text-xs font-bold">
                {statusMsg}
              </div>
            )}

            <div className="max-h-80 overflow-y-auto p-2">
              {filteredActions.length === 0 ? (
                <div className="p-6 text-center text-xs text-zinc-500">
                  No matching 360° actions found.
                </div>
              ) : (
                filteredActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.id}
                      onClick={action.action}
                      className="hover:bg-brand-500/15 flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-left text-sm text-zinc-200 transition-colors hover:text-white"
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="text-brand-400 h-4 w-4" />
                        <span className="font-medium">{action.title}</span>
                      </div>
                      <span className="rounded-md bg-zinc-800 px-2 py-0.5 text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                        {action.category}
                      </span>
                    </button>
                  );
                })
              )}
            </div>

            <div className="flex items-center justify-between border-t border-white/5 bg-zinc-950/80 px-4 py-2.5 text-[11px] text-zinc-500">
              <span>ALPAR AI 360° Manage Surface</span>
              <span className="font-mono text-zinc-400">Cmd + K / Ctrl + K</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
