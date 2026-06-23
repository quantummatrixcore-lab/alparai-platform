"use client";

import * as React from "react";
import { useTranslations, useLocale } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, TrendingUp, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "@/i18n/routing";
import type { IncidentListItem } from "@/types";
import { formatDistanceToNow } from "date-fns";

export function IncidentOfTheWeek({ incident }: { incident: IncidentListItem | null }) {
  const t = useTranslations("marketing.incident_of_week");
  const locale = useLocale();

  if (!incident) return null;

  const displayTitle =
    locale === "tr" && incident.title_tr && incident.title_tr.length > 0
      ? incident.title_tr
      : incident.title_masked;
  const displayDesc =
    locale === "tr" && incident.description_tr && incident.description_tr.length > 0
      ? incident.description_tr
      : incident.description_masked;

  return (
    <div className="group relative w-full">
      <div className="from-danger-500 to-warning-500 absolute -inset-0.5 rounded-xl bg-gradient-to-r opacity-20 blur transition duration-500 group-hover:opacity-40"></div>
      <Card variant="glass" className="relative overflow-hidden rounded-xl">
        <motion.div
          animate={{
            y: [0, -10, 0],
            rotate: [0, 2, -2, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="pointer-events-none absolute top-0 right-0 p-4 opacity-10"
        >
          <AlertTriangle className="h-32 w-32" />
        </motion.div>
        <CardContent className="p-6 sm:p-8">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="bg-danger-500/10 text-danger-400 border-danger-500/20 inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-xs font-bold tracking-widest uppercase">
              <TrendingUp className="h-4 w-4" />
              {t("title")}
            </span>
            <Badge variant="outline" className="border-border-strong text-fg-muted">
              {incident.category}
            </Badge>
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

          <Link
            href={`/incidents/${incident.id}`}
            className="focus-visible:ring-brand-500 block rounded-md outline-none focus-visible:ring-2"
          >
            <h3 className="text-fg-primary group-hover:text-brand-400 relative mb-3 inline-block pb-1 text-2xl leading-tight font-black transition-colors sm:text-3xl">
              {displayTitle}
              <span className="bg-danger-500 absolute bottom-0 left-0 h-[2px] w-0 transition-all duration-300 group-hover:w-full"></span>
            </h3>
            <p className="text-fg-secondary mb-6 line-clamp-3 text-base sm:text-lg">
              {displayDesc}
            </p>
          </Link>

          <div className="border-border-subtle flex flex-wrap items-center justify-between gap-4 border-t pt-4">
            <div className="flex items-center gap-3">
              <div className="bg-bg-tertiary border-border-strong flex h-10 w-10 items-center justify-center rounded-full border">
                <ShieldCheck className="text-fg-muted h-5 w-5" />
              </div>
              <div>
                <p className="text-fg-primary text-sm font-semibold">{incident.provider_name}</p>
                <p className="text-fg-muted text-xs">{t("provider")}</p>
              </div>
            </div>

            <div className="text-fg-muted flex items-center gap-4 text-sm font-medium">
              <span>
                {incident.view_count} {t("views")}
              </span>
              <span>•</span>
              <span>{formatDistanceToNow(new Date(incident.created_at), { addSuffix: true })}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
