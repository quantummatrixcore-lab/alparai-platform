"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, ShieldQuestion, Plus, Zap } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PollCard, type Poll } from "./poll-card";
import { SuggestionCard, type SuggestionListItem } from "@/components/marketing/suggestion-card";

interface CommunityHubProps {
  polls: Poll[];
  suggestions: SuggestionListItem[];
  seedSuggestions: Array<
    SuggestionListItem & { title_tr: string; description_tr: string; author_name_tr: string }
  >;
  isLoggedIn: boolean;
  locale: string;
}

export function CommunityHub({
  polls,
  suggestions,
  seedSuggestions,
  isLoggedIn: _isLoggedIn,
  locale,
}: CommunityHubProps) {
  const tDilemmas = useTranslations("dilemmas");
  const tSuggestions = useTranslations("suggestions");
  const [activeTab, setActiveTab] = useState<"dilemmas" | "suggestions">("dilemmas");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("tab") === "suggestions") {
      setActiveTab("suggestions");
    }
  }, []);

  const displaySuggestions = suggestions.length > 0 ? suggestions : seedSuggestions;
  const isSeed = suggestions.length === 0;

  return (
    <div className="space-y-8">
      {/* Premium Tab Selector */}
      <div className="flex justify-center">
        <div className="bg-bg-secondary/80 border-border-subtle/30 relative flex rounded-full border p-1 shadow-lg backdrop-blur-md">
          <button
            onClick={() => setActiveTab("dilemmas")}
            className={`relative z-10 flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold transition-colors duration-300 ${
              activeTab === "dilemmas"
                ? "text-brand-400"
                : "text-fg-secondary hover:text-fg-primary"
            }`}
          >
            {activeTab === "dilemmas" && (
              <motion.div
                layoutId="active-tab-bg"
                className="absolute inset-0 rounded-full border border-white/5 bg-white/5 shadow-inner"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <ShieldQuestion className="h-4 w-4" />
            <span>{tDilemmas("pageTitle")}</span>
          </button>
          <button
            onClick={() => setActiveTab("suggestions")}
            className={`relative z-10 flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold transition-colors duration-300 ${
              activeTab === "suggestions"
                ? "text-brand-400"
                : "text-fg-secondary hover:text-fg-primary"
            }`}
          >
            {activeTab === "suggestions" && (
              <motion.div
                layoutId="active-tab-bg"
                className="absolute inset-0 rounded-full border border-white/5 bg-white/5 shadow-inner"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <Lightbulb className="h-4 w-4" />
            <span>{tSuggestions("title")}</span>
          </button>
        </div>
      </div>

      {/* Tab Contents with animations */}
      <AnimatePresence mode="wait">
        {activeTab === "dilemmas" ? (
          <motion.div
            key="dilemmas-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-fg-muted text-sm leading-relaxed">{tDilemmas("description")}</p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {polls.map((poll) => (
                <PollCard key={poll.id} poll={poll} />
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="suggestions-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="border-border-subtle/30 flex flex-wrap items-center justify-between gap-4 border-b pb-4">
              <div>
                <h2 className="text-fg-primary text-xl font-bold tracking-tight">
                  {tSuggestions("title")}
                </h2>
                <p className="text-fg-muted mt-1 text-xs">{tSuggestions("subtitle")}</p>
              </div>
              <Link href="/suggestions/new">
                <Button size="sm" leftIcon={<Plus className="h-4 w-4" />}>
                  {tSuggestions("create_title")}
                </Button>
              </Link>
            </div>

            {isSeed && (
              <Card variant="default" className="border-brand-500/30 bg-brand-500/5">
                <CardContent className="flex items-start gap-3 py-4">
                  <Zap className="text-brand-400 mt-0.5 h-4 w-4 shrink-0" />
                  <div>
                    <p className="text-fg-primary text-sm font-medium">
                      {tSuggestions("subtitle")}
                    </p>
                    <p className="text-fg-muted text-xs">{tSuggestions("create_description")}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="space-y-3">
              {displaySuggestions.map((it) => {
                const seedItem = seedSuggestions.find((s) => s.id === it.id);
                const isSeedItem = Boolean(seedItem);
                const displayTitle =
                  isSeedItem && locale === "tr" && seedItem && seedItem.title_tr
                    ? seedItem.title_tr
                    : it.title;
                const displayDesc =
                  isSeedItem && locale === "tr" && seedItem && seedItem.description_tr
                    ? seedItem.description_tr
                    : it.description;
                return (
                  <SuggestionCard
                    key={it.id}
                    item={{ ...it, title: displayTitle, description: displayDesc }}
                  />
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
