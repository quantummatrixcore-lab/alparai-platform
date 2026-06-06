"use client";

import * as React from "react";
import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Check, X, Eye, MessageSquare } from "lucide-react";
import { useTranslations } from "next-intl";
import { moderateIncident, reviewTakedown } from "@/actions/admin";
import { toast } from "sonner";
import { formatRelativeTime } from "@/lib/utils";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import type { IncidentListItem } from "@/types";

export function ModerationQueue({
  incidents,
}: {
  incidents: IncidentListItem[];
}) {
  const t = useTranslations("admin");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  if (incidents.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-sm text-fg-muted">
          {t("queueEmpty", { defaultValue: "Queue is empty. All caught up." })}
        </CardContent>
      </Card>
    );
  }
  return (
    <div className="space-y-3">
      {incidents.map((inc) => (
        <ModerationRow key={inc.id} incident={inc} />
      ))}
    </div>
  );
}

function ModerationRow({ incident }: { incident: IncidentListItem }) {
  const t = useTranslations("admin");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const [pending, start] = useTransition();
  const [note, setNote] = useState("");
  const [showNote, setShowNote] = useState(false);

  const decide = (decision: "approve" | "reject") => {
    start(async () => {
      const res = await moderateIncident({
        incidentId: incident.id,
        decision,
        moderationNote: note || undefined,
      });
      if (res.ok) {
        toast.success(decision === "approve" ? t("approve") + " ✓" : t("reject") + " ✓");
      } else {
        toast.error(res.error ?? tCommon("loading"));
      }
    });
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-wrap items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={incident.severity === "critical" ? "danger" : incident.severity === "high" ? "danger" : incident.severity === "medium" ? "warning" : "success"} dot>
                {incident.severity}
              </Badge>
              <Badge variant="muted">{incident.provider_name}</Badge>
              <Badge variant="outline">{incident.category}</Badge>
              <span className="text-xs text-fg-muted">
                {formatRelativeTime(new Date(incident.created_at), locale)}
              </span>
            </div>
            <Link
              href={`/incidents/${incident.id}` as never}
              className="mt-2 block"
            >
              <h3 className="line-clamp-2 font-semibold text-fg-primary hover:text-brand-400">
                {incident.title_masked}
              </h3>
              <p className="mt-1 line-clamp-2 text-sm text-fg-muted">
                {incident.description_masked}
              </p>
            </Link>
            {showNote && (
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={t("moderationNotePlaceholder", {
                  defaultValue: "Optional note for the submitter",
                })}
                rows={2}
                className="mt-3"
              />
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Button
              size="sm"
              variant="success"
              leftIcon={<Check className="h-3.5 w-3.5" />}
              isLoading={pending}
              onClick={() => decide("approve")}
            >
              {t("approve")}
            </Button>
            <Button
              size="sm"
              variant="danger"
              leftIcon={<X className="h-3.5 w-3.5" />}
              isLoading={pending}
              onClick={() => decide("reject")}
            >
              {t("reject")}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              leftIcon={<MessageSquare className="h-3.5 w-3.5" />}
              onClick={() => setShowNote((v) => !v)}
            >
              {showNote ? t("hideNote") : t("addNote")}
            </Button>
            <Link href={`/incidents/${incident.id}` as never}>
              <Button
                size="sm"
                variant="outline"
                leftIcon={<Eye className="h-3.5 w-3.5" />}
                className="w-full"
              >
                {t("view", { defaultValue: "View" })}
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
