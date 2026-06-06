import * as React from "react";
import { cn, formatDate } from "@/lib/utils";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { Card } from "@/components/ui/card";
import { SeverityBadge, StatusBadge, Badge } from "@/components/ui/badge";
import type {
  IncidentListItem,
  IncidentSeverity,
  IncidentStatus,
} from "@/types";
import { MessageSquare, ThumbsUp, Clock, Building2 } from "lucide-react";

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

  return (
    <Card
      interactive
      padding="md"
      className={cn("group relative", className)}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <SeverityBadge severity={incident.severity as IncidentSeverity} />
          <StatusBadge status={incident.status as IncidentStatus} />
          <Badge variant="muted">
            <Building2 className="h-3 w-3" aria-hidden="true" />
            {incident.provider_name}
          </Badge>
          <Badge variant="outline">{tCat(incident.category)}</Badge>
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
        <h3 className="line-clamp-2 text-lg font-semibold text-fg-primary group-hover:text-brand-400 transition-colors">
          {incident.title_masked}
        </h3>
        <p className="mt-1.5 line-clamp-3 text-sm text-fg-muted">
          {incident.description_masked}
        </p>
      </Link>
      <div className="mt-4 flex items-center justify-between text-xs text-fg-muted">
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
            {formatDate(new Date(incident.incident_date), locale)}
          </span>
          <span className="inline-flex items-center gap-1">
            <ThumbsUp className="h-3.5 w-3.5" aria-hidden="true" />
            {incident.vote_count}
          </span>
          <span className="inline-flex items-center gap-1">
            <MessageSquare className="h-3.5 w-3.5" aria-hidden="true" />
            {incident.evidence_count}
          </span>
        </div>
        <span>
          {t("by")} {incident.author_name ?? t("anonymous")}
        </span>
      </div>
    </Card>
  );
}

