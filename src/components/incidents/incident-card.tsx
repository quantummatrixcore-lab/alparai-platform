"use client";

import * as React from "react";
import { cn, formatDate } from "@/lib/utils";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { Card } from "@/components/ui/card";
import { SeverityBadge, StatusBadge, Badge } from "@/components/ui/badge";
import type { IncidentListItem, IncidentSeverity, IncidentStatus } from "@/types";
import {
  MessageSquare,
  ThumbsUp,
  Clock,
  Building2,
  CheckCircle2,
  Twitter,
  Linkedin,
} from "lucide-react";
import { motion } from "framer-motion";

export function IncidentCard({
  incident,
  className,
}: {
  incident: IncidentListItem;
  className?: string;
}) {
  const t = useTranslations("incident");
  const tCat = useTranslations("categories");
  const locale = useLocale();

  const displayTitle =
    locale === "tr" && incident.title_tr && incident.title_tr.length > 0
      ? incident.title_tr
      : incident.title_masked;
  const displayDesc =
    locale === "tr" && incident.description_tr && incident.description_tr.length > 0
      ? incident.description_tr
      : incident.description_masked;

  const severity = incident.severity as IncidentSeverity;

  const isRecent = React.useMemo(() => {
    try {
      const createdTime = new Date(incident.created_at).getTime();
      const now = new Date().getTime();
      const diffMs = now - createdTime;
      const diffHours = diffMs / (1000 * 60 * 60);
      return diffHours <= 48; // within last 48 hours
    } catch {
      return false;
    }
  }, [incident.created_at]);

  const shareUrl = React.useMemo(() => {
    const relativeUrl = `/incidents/${incident.id}`;
    if (typeof window === "undefined") return `https://alparai.com${relativeUrl}`;
    return `${window.location.origin}${relativeUrl}`;
  }, [incident.id]);

  const severityBorders: Record<IncidentSeverity, string> = {
    low: "border-l-4 border-l-success-500/80 focus-within:border-l-success-500",
    medium: "border-l-4 border-l-warning-500/80 focus-within:border-l-warning-500",
    high: "border-l-4 border-l-danger-500/80 focus-within:border-l-danger-500",
    critical: "border-l-4 border-l-danger-600 focus-within:border-l-danger-600 animate-pulse",
  };

  const borderClass = severityBorders[severity] || "border-l-4 border-l-brand-500";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      whileHover={{ y: -3, scale: 1.005 }}
      className="w-full"
    >
      <Card
        interactive
        padding="md"
        className={cn(
          "group relative overflow-hidden transition-all duration-300",
          borderClass,
          className,
        )}
      >
        {/* Hover Ambient Severity Glow */}
        <div
          className={cn(
            "pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100",
            severity === "low" &&
              "from-success-500/5 bg-gradient-to-r via-transparent to-transparent",
            severity === "medium" &&
              "from-warning-500/5 bg-gradient-to-r via-transparent to-transparent",
            severity === "high" &&
              "from-danger-500/5 bg-gradient-to-r via-transparent to-transparent",
            severity === "critical" &&
              "from-danger-600/10 bg-gradient-to-r via-transparent to-transparent",
          )}
        />
        <div className="relative z-10">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              {isRecent && (
                <Badge
                  variant="danger"
                  dot
                  className="animate-pulse shadow-[0_0_10px_rgba(230,57,70,0.4)]"
                >
                  {t("new_badge")}
                </Badge>
              )}
              <SeverityBadge severity={severity} />
              <StatusBadge status={incident.status as IncidentStatus} />
              <Badge variant="muted">
                <Building2 className="h-3 w-3" aria-hidden="true" />
                {incident.provider_name}
              </Badge>
              <Badge variant="outline">{tCat(incident.category)}</Badge>
              {incident.cross_audit_truth_score !== null && (
                <Badge
                  variant={
                    incident.cross_audit_truth_score >= 80
                      ? "success"
                      : incident.cross_audit_truth_score >= 50
                        ? "warning"
                        : "danger"
                  }
                  className="font-bold"
                >
                  TruthScore: {incident.cross_audit_truth_score}%
                </Badge>
              )}
            </div>
            {incident.is_anonymous && (
              <Badge variant="muted" size="sm">
                {t("anonymous")}
              </Badge>
            )}
          </div>
          <Link
            href={`/incidents/${incident.id}`}
            className="mt-3 block focus-visible:outline-none"
          >
            <h3 className="text-fg-primary group-hover:text-brand-400 line-clamp-2 text-lg font-semibold transition-colors">
              {displayTitle}
            </h3>
            <p className="text-fg-muted mt-1.5 line-clamp-3 text-sm">{displayDesc}</p>
          </Link>
          {/* Timeline indicator */}
          <TimelineIndicator status={incident.status as IncidentStatus} t={t} />
          <div className="text-fg-muted mt-4 flex items-center justify-between text-xs">
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                {formatDate(new Date(incident.incident_date), locale)}
              </span>
              <motion.span
                whileHover={{ scale: 1.15 }}
                className="inline-flex cursor-pointer items-center gap-1"
              >
                <ThumbsUp className="h-3.5 w-3.5" aria-hidden="true" />
                {incident.vote_count}
              </motion.span>
              <span className="inline-flex items-center gap-1">
                <MessageSquare className="h-3.5 w-3.5" aria-hidden="true" />
                {incident.evidence_count}
              </span>
              <div className="ml-1 flex items-center gap-2 border-l border-white/10 pl-3">
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(displayTitle)}&url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-fg-muted hover:text-brand-400 p-0.5 transition-colors"
                  aria-label="Share on X"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Twitter className="h-3.5 w-3.5" />
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-fg-muted hover:text-brand-400 p-0.5 transition-colors"
                  aria-label="Share on LinkedIn"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Linkedin className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
            <span>
              {t("by")} {incident.author_name ?? t("anonymous")}
            </span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

function TimelineIndicator({ status, t }: { status: IncidentStatus; t: (key: string) => string }) {
  const steps: { label: string; statuses: IncidentStatus[] }[] = [
    {
      label: t("timeline_reported"),
      statuses: ["pending_review", "published", "rejected", "archived", "takedown"],
    },
    { label: t("timeline_reviewed"), statuses: ["published", "rejected", "archived", "takedown"] },
    { label: t("timeline_published"), statuses: ["published", "archived"] },
  ];

  const isRejected = status === "rejected" || status === "takedown";

  return (
    <div className="mt-4 flex items-center gap-1" aria-label="Incident timeline">
      {steps.map((step, i) => {
        const active = step.statuses.includes(status);
        const isLast = i === steps.length - 1;
        return (
          <React.Fragment key={step.label}>
            <div className="flex flex-col items-center gap-1">
              <CheckCircle2
                className={cn(
                  "h-3.5 w-3.5 transition-colors duration-300",
                  active && !isRejected
                    ? "text-success-500"
                    : isRejected && i === 0
                      ? "text-danger-500"
                      : "text-fg-disabled",
                )}
                aria-hidden="true"
              />
              <span
                className={cn(
                  "text-[9px] font-semibold tracking-wider uppercase transition-colors",
                  active && !isRejected ? "text-success-400" : "text-fg-disabled",
                )}
              >
                {step.label}
              </span>
            </div>
            {!isLast && (
              <div
                className={cn(
                  "mb-3.5 h-[1px] flex-1 transition-colors duration-500",
                  steps[i + 1]?.statuses.includes(status) && !isRejected
                    ? "bg-success-500/60"
                    : "bg-fg-disabled/20",
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
