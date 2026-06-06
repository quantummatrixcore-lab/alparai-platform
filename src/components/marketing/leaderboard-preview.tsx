"use client";

import * as React from "react";
import { Link } from "@/i18n/routing";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, TrendingDown, TrendingUp, Minus } from "lucide-react";
import { cn, formatNumber } from "@/lib/utils";
import { useTranslations } from "next-intl";
import type { LeaderboardEntry } from "@/types";

export function LeaderboardPreview({ entries }: { entries: LeaderboardEntry[] }) {
  const t = useTranslations("leaderboard");
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="inline-flex items-center gap-2 text-xl font-semibold text-fg-primary">
          <Trophy className="h-5 w-5 text-warning-500" />
          {t("title")}
        </h2>
        <Link
          href="/leaderboard"
          className="text-sm text-brand-400 hover:underline"
        >
          {t("subtitle")}
        </Link>
      </div>
      <Card>
        <CardContent className="p-0">
          <ol className="divide-y divide-border-subtle">
            {entries.slice(0, 10).map((e, i) => {
              const trend =
                e.trend > 0
                  ? "up"
                  : e.trend < 0
                  ? "down"
                  : "flat";
              return (
                <li
                  key={e.provider_id}
                  className="flex items-center gap-3 p-3"
                >
                  <span
                    className={cn(
                      "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                      i === 0
                        ? "bg-warning-500/15 text-warning-500"
                        : i === 1
                        ? "bg-fg-muted/15 text-fg-muted"
                        : i === 2
                        ? "bg-warning-700/15 text-warning-700"
                        : "bg-bg-tertiary text-fg-muted"
                    )}
                  >
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/brand/${e.provider_slug}`}
                      className="block truncate text-sm font-semibold text-fg-primary hover:text-brand-400"
                    >
                      {e.provider_name}
                    </Link>
                    <p className="text-xs text-fg-muted">
                      {formatNumber(e.incident_count)} {t("incidents").toLowerCase()}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 text-xs font-medium",
                      trend === "up" && "text-danger-400",
                      trend === "down" && "text-success-500",
                      trend === "flat" && "text-fg-muted"
                    )}
                  >
                    {trend === "up" && <TrendingUp className="h-3 w-3" />}
                    {trend === "down" && <TrendingDown className="h-3 w-3" />}
                    {trend === "flat" && <Minus className="h-3 w-3" />}
                    {Math.abs(e.trend)}
                  </span>
                </li>
              );
            })}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
