"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Rss,
  AlertTriangle,
  TrendingUp,
  FlaskConical,
  ShieldAlert,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import { Container, Section } from "@/components/ui/layout";

export type EcosystemNewsItem = {
  id: string;
  title_en: string;
  title_tr: string | null;
  summary_en: string | null;
  summary_tr: string | null;
  url: string | null;
  source: string | null;
  category: string;
  severity: "critical" | "high" | "medium" | "low";
  published_at: string;
};

export type EcosystemPoll = {
  id: string;
  title: string;
  yes_count: number;
  no_count: number;
  unsure_count: number;
};

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  regulation: ShieldAlert,
  security: AlertTriangle,
  research: FlaskConical,
  incident: AlertTriangle,
  ban: ShieldAlert,
};

const SEVERITY_CONFIG = {
  critical: {
    badge: "bg-danger-500/15 text-danger-400 border-danger-500/30",
    dot: "bg-danger-500",
    label: "KRİTİK",
    labelEn: "CRITICAL",
  },
  high: {
    badge: "bg-warning-500/15 text-warning-400 border-warning-500/30",
    dot: "bg-warning-500",
    label: "GÜNCEL",
    labelEn: "NOTABLE",
  },
  medium: {
    badge: "bg-brand-500/15 text-brand-400 border-brand-500/30",
    dot: "bg-brand-500",
    label: "ANALİZ",
    labelEn: "ANALYSIS",
  },
  low: {
    badge: "bg-fg-muted/15 text-fg-muted border-fg-muted/20",
    dot: "bg-fg-muted",
    label: "BİLGİ",
    labelEn: "INFO",
  },
};

export function EcosystemPulse({
  news,
  poll,
}: {
  news: EcosystemNewsItem[];
  poll: EcosystemPoll | null;
}) {
  const locale = useLocale();
  const t = useTranslations("ecosystemPulse");

  const getTitle = (item: EcosystemNewsItem) =>
    locale === "tr" && item.title_tr ? item.title_tr : item.title_en;

  const getSummary = (item: EcosystemNewsItem) =>
    locale === "tr" && item.summary_tr ? item.summary_tr : item.summary_en;

  const totalVotes = poll ? poll.yes_count + poll.no_count + poll.unsure_count : 0;
  const yesPercent = totalVotes > 0 ? Math.round((poll!.yes_count / totalVotes) * 100) : 0;
  const noPercent = totalVotes > 0 ? Math.round((poll!.no_count / totalVotes) * 100) : 0;

  return (
    <Section className="bg-bg-secondary border-brand-500/10 border-y">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="bg-brand-500/10 border-brand-500/20 rounded-lg border p-2">
              <Rss className="text-brand-400 h-5 w-5" />
            </div>
            <div>
              <h2 className="text-fg-primary text-xl font-black tracking-tight">{t("title")}</h2>
              <p className="text-fg-muted text-sm">{t("subtitle")}</p>
            </div>
          </div>
          <Link
            href="/incidents"
            className="text-brand-400 hover:text-brand-300 hidden items-center gap-1.5 text-sm font-bold transition-colors sm:flex"
          >
            {t("viewAll")}
            <ChevronRight className="h-4 w-4" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
          {/* News Feed */}
          <div className="space-y-3">
            {news.map((item, i) => {
              const cfg = SEVERITY_CONFIG[item.severity] ?? SEVERITY_CONFIG.medium;
              const CategoryIcon = CATEGORY_ICONS[item.category] ?? TrendingUp;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                >
                  <div className="bg-bg-primary/60 hover:bg-bg-primary border-bg-tertiary hover:border-brand-500/30 group flex items-start gap-4 rounded-lg border p-4 transition-all duration-200">
                    <div className="mt-0.5 shrink-0">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-sm border px-2 py-0.5 text-[10px] font-black tracking-[0.15em] uppercase ${cfg.badge}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                        {locale === "tr" ? cfg.label : cfg.labelEn}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-start justify-between gap-2">
                        <p className="text-fg-primary group-hover:text-brand-300 line-clamp-2 text-sm leading-snug font-bold transition-colors">
                          {getTitle(item)}
                        </p>
                        {item.url && (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-fg-muted hover:text-brand-400 mt-0.5 shrink-0 transition-colors"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        )}
                      </div>
                      {getSummary(item) && (
                        <p className="text-fg-muted line-clamp-2 text-xs leading-relaxed">
                          {getSummary(item)}
                        </p>
                      )}
                      <div className="mt-2 flex items-center gap-2">
                        <CategoryIcon className="text-fg-muted h-3 w-3" />
                        {item.source && (
                          <span className="text-fg-muted text-[11px] font-medium">
                            {item.source}
                          </span>
                        )}
                        <span className="text-fg-muted/40">·</span>
                        <time className="text-fg-muted text-[11px]">
                          {new Date(item.published_at).toLocaleDateString(
                            locale === "tr" ? "tr-TR" : "en-US",
                            { day: "numeric", month: "short" },
                          )}
                        </time>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Poll Widget */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="h-fit"
          >
            {poll ? (
              <div className="bg-bg-primary/60 border-brand-500/20 rounded-xl border p-6">
                <div className="mb-3 flex items-center gap-2">
                  <span className="bg-brand-500/10 text-brand-400 border-brand-500/20 rounded-sm border px-2 py-0.5 text-[10px] font-black tracking-[0.2em] uppercase">
                    {t("pollBadge")}
                  </span>
                </div>
                <h3 className="text-fg-primary mb-4 text-base leading-snug font-black">
                  {poll.title}
                </h3>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-success-400 uppercase">{t("yes")}</span>
                    <span className="text-danger-400 uppercase">{t("no")}</span>
                  </div>
                  <div className="bg-bg-tertiary flex h-7 w-full overflow-hidden rounded-md border border-white/5">
                    <div
                      className="bg-success-500/80 flex items-center justify-start px-2 transition-all duration-1000"
                      style={{ width: `${yesPercent}%` }}
                    >
                      {yesPercent > 10 && (
                        <span className="text-xs font-bold text-white drop-shadow">
                          %{yesPercent}
                        </span>
                      )}
                    </div>
                    <div
                      className="bg-danger-500/80 flex items-center justify-end px-2 transition-all duration-1000"
                      style={{ width: `${noPercent}%` }}
                    >
                      {noPercent > 10 && (
                        <span className="text-xs font-bold text-white drop-shadow">
                          %{noPercent}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-fg-muted text-center text-xs">
                    {t("totalVotes", { count: totalVotes.toLocaleString() })}
                  </p>
                </div>

                <Link
                  href="/#poll"
                  className="bg-brand-500/10 hover:bg-brand-500/20 border-brand-500/30 text-brand-400 mt-4 flex w-full items-center justify-center gap-2 rounded-lg border py-2.5 text-sm font-bold transition-all"
                >
                  {t("voteCta")}
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            ) : (
              <div className="bg-bg-primary/60 border-bg-tertiary rounded-xl border p-6 text-center">
                <p className="text-fg-muted text-sm">{t("noPoll")}</p>
              </div>
            )}
          </motion.div>
        </div>
      </Container>
    </Section>
  );
}
