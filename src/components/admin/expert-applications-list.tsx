"use client";

import * as React from "react";
import { useState, useTransition } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, ExternalLink, Calendar, Award } from "lucide-react";
import { useTranslations } from "next-intl";
import { reviewExpertApplication } from "@/actions/admin";
import { toast } from "sonner";
import { formatRelativeTime } from "@/lib/utils";
import { useLocale } from "next-intl";

export interface ExpertApplicationItem {
  id: string;
  name: string;
  title_institution: string;
  expertise: string;
  linkedin_url: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
}

export function ExpertApplicationsList({
  applications,
}: {
  applications: ExpertApplicationItem[];
}) {
  const t = useTranslations("admin");
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");

  const filtered = applications.filter((app) => {
    if (filter === "all") return true;
    return app.status === filter;
  });

  return (
    <div className="space-y-4">
      <div className="border-border-subtle flex gap-2 border-b pb-4">
        {(["pending", "approved", "rejected", "all"] as const).map((f) => (
          <Button
            key={f}
            size="sm"
            variant={filter === f ? "primary" : "ghost"}
            onClick={() => setFilter(f)}
            className="capitalize"
          >
            {t(`filter_${f}`, { defaultValue: f })}
          </Button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="text-fg-muted py-12 text-center text-sm">
            {t("noApplications", { defaultValue: "No expert applications found." })}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((app) => (
            <ExpertApplicationRow key={app.id} application={app} />
          ))}
        </div>
      )}
    </div>
  );
}

function ExpertApplicationRow({ application }: { application: ExpertApplicationItem }) {
  const t = useTranslations("admin");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const [pending, start] = useTransition();

  const handleReview = (decision: "approve" | "reject") => {
    start(async () => {
      const res = await reviewExpertApplication({
        id: application.id,
        decision,
      });
      if (res.ok) {
        toast.success(decision === "approve" ? t("approved") + " ✓" : t("rejected") + " ✓");
      } else {
        toast.error(res.error ?? tCommon("loading"));
      }
    });
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-fg-primary flex items-center gap-1.5 text-lg font-bold">
                <Award className="text-success-500 h-5 w-5" />
                {application.name}
              </h3>
              <Badge
                variant={
                  application.status === "approved"
                    ? "success"
                    : application.status === "rejected"
                      ? "danger"
                      : "warning"
                }
              >
                {t(application.status, { defaultValue: application.status })}
              </Badge>
              <span className="text-fg-muted flex items-center gap-1 text-xs">
                <Calendar className="h-3 w-3" />
                {formatRelativeTime(new Date(application.created_at), locale)}
              </span>
            </div>

            <p className="text-fg-primary text-sm font-semibold">{application.title_institution}</p>

            <p className="text-fg-muted bg-bg-secondary/40 border-border-subtle rounded-md border p-3 text-sm italic">
              &ldquo;{application.expertise}&rdquo;
            </p>

            <div className="pt-1">
              <a
                href={application.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-400 hover:text-brand-300 inline-flex items-center gap-1 text-xs font-semibold"
              >
                {t("view_linkedin", { defaultValue: "View LinkedIn Profile" })}
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          {application.status === "pending" && (
            <div className="flex gap-2 self-end md:self-start">
              <Button
                size="sm"
                variant="success"
                leftIcon={<Check className="h-3.5 w-3.5" />}
                isLoading={pending}
                onClick={() => handleReview("approve")}
              >
                {t("approve")}
              </Button>
              <Button
                size="sm"
                variant="danger"
                leftIcon={<X className="h-3.5 w-3.5" />}
                isLoading={pending}
                onClick={() => handleReview("reject")}
              >
                {t("reject")}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
