import * as React from "react";
import { IncidentCard } from "./incident-card";
import { EmptyState, Skeleton } from "@/components/ui/feedback";
import { useTranslations } from "next-intl";
import { AlertCircle } from "lucide-react";
import type { IncidentListItem } from "@/types";

export function IncidentList({
  incidents,
  isLoading = false,
  error = null,
}: {
  incidents: IncidentListItem[];
  isLoading?: boolean;
  error?: string | null;
}) {
  const t = useTranslations("incident");
  if (error) {
    return (
      <div className="rounded-md border border-danger-500/30 bg-danger-500/5 p-4 text-sm text-danger-400" role="alert">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      </div>
    );
  }
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-40 w-full" />
        ))}
      </div>
    );
  }
  if (!incidents.length) {
    return <EmptyState title={t("no_incidents")} />;
  }
  return (
    <div className="space-y-3">
      {incidents.map((inc) => (
        <IncidentCard key={inc.id} incident={inc} />
      ))}
    </div>
  );
}
