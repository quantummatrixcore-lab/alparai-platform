"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { Search, Shield, Activity, Users, Globe, ToggleRight, FileText } from "lucide-react";

export function Manage360CommandPalette() {
  const t = useTranslations("admin");
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");

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

  if (!isOpen) return null;

  const actions = [
    {
      id: "moderation",
      title: t("moderation_queue") || "Moderation Queue",
      category: "Operations",
      icon: Shield,
      action: () => {
        router.push("/admin/moderation");
        setIsOpen(false);
      },
    },
    {
      id: "geo",
      title: t("nav_geo") || "GEO Engine",
      category: "Intelligence",
      icon: Globe,
      action: () => {
        router.push("/admin/geo");
        setIsOpen(false);
      },
    },
    {
      id: "feature-flags",
      title: t("nav_featureFlags") || "Feature Flags",
      category: "System",
      icon: ToggleRight,
      action: () => {
        router.push("/admin/feature-flags");
        setIsOpen(false);
      },
    },
    {
      id: "health",
      title: t("nav_systemHealth") || "System Health",
      category: "System",
      icon: Activity,
      action: () => {
        router.push("/admin/health");
        setIsOpen(false);
      },
    },
    {
      id: "audit",
      title: t("audit_log") || "Audit Log",
      category: "Governance",
      icon: FileText,
      action: () => {
        router.push("/admin/audit");
        setIsOpen(false);
      },
    },
    {
      id: "users",
      title: t("users") || "Users Management",
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
    <div className="animate-fade-in fixed inset-0 z-50 flex items-start justify-center bg-black/60 pt-24 backdrop-blur-sm">
      <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/95 shadow-2xl">
        <div className="flex items-center border-b border-white/10 px-4 py-3">
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

        <div className="max-h-80 overflow-y-auto p-2">
          {filteredActions.length === 0 ? (
            <div className="p-4 text-center text-xs text-zinc-500">
              No matching 360° actions found.
            </div>
          ) : (
            filteredActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  onClick={action.action}
                  className="hover:bg-brand-500/15 flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm text-zinc-200 transition-colors hover:text-white"
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="text-brand-400 h-4 w-4" />
                    <span>{action.title}</span>
                  </div>
                  <span className="rounded-md bg-zinc-800 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-zinc-400 uppercase">
                    {action.category}
                  </span>
                </button>
              );
            })
          )}
        </div>

        <div className="border-t border-white/5 bg-zinc-950/50 px-4 py-2 text-right text-[11px] text-zinc-500">
          ALPAR AI 360° Command Center Active
        </div>
      </div>
    </div>
  );
}
