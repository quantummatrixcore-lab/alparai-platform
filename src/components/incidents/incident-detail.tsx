import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, FileText, Clock, Eye, Globe, Tag } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { formatDate, formatRelativeTime } from "@/lib/utils";
import { VoteButtons } from "./vote-buttons";
import { ProviderResponseCard } from "./provider-response-card";
import { ShareButtons } from "./share-buttons";
import { PIIBanner } from "./pii-banner";
import { Badge as UIBadge } from "@/components/ui/badge";
import type { IncidentDetail, ProviderResponse } from "@/types";
import { Link } from "@/i18n/routing";
import { TakedownButton } from "./takedown-button";

export function IncidentDetailView({
  incident,
  evidence,
  providerResponse,
  userVote,
  isAuthenticated,
}: {
  incident: IncidentDetail;
  evidence: Array<{ id: string; file_name: string; file_url: string; file_type: string }>;
  providerResponse: ProviderResponse | null;
  userVote: -1 | 0 | 1;
  isAuthenticated: boolean;
}) {
  const t = useTranslations("incident");
  const tCat = useTranslations("categories");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  return (
    <article className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        <header className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <UIBadge variant={incident.severity === "critical" || incident.severity === "high" ? "danger" : incident.severity === "medium" ? "warning" : "success"} dot>
              {incident.severity}
            </UIBadge>
            <UIBadge variant="outline">{tCat(incident.category)}</UIBadge>
            <UIBadge variant="muted">
              <Building2 className="h-3 w-3" /> {incident.provider_name}
            </UIBadge>
            {incident.model_name && (
              <UIBadge variant="muted">{incident.model_name}</UIBadge>
            )}
            {incident.is_anonymous && (
              <UIBadge variant="muted" size="sm">{t("anonymous")}</UIBadge>
            )}
          </div>
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-fg-primary">
            {incident.title_masked}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-xs text-fg-muted">
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {t("by")} {incident.author_name ?? t("anonymous")} ·{" "}
              {formatRelativeTime(new Date(incident.created_at), locale)}
            </span>
            <span className="inline-flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" />
              {tCommon("viewCount", { defaultValue: "viewed" })} {incident.view_count}
            </span>
            <span className="inline-flex items-center gap-1">
              <Globe className="h-3.5 w-3.5" />
              {incident.language ?? "—"}
            </span>
          </div>
        </header>

        <PIIBanner />

        <Card>
          <CardContent className="prose prose-invert max-w-none whitespace-pre-wrap text-fg-primary">
            {incident.description_masked}
          </CardContent>
        </Card>

        {evidence.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="inline-flex items-center gap-2">
                <FileText className="h-4 w-4" />
                {t("evidence")} ({evidence.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {evidence.map((e) =>
                e.file_type.startsWith("image/") ? (
                  <a
                    key={e.id}
                    href={e.file_url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="block overflow-hidden rounded-md border border-border-subtle"
                  >
                    <img
                      src={e.file_url}
                      alt={e.file_name}
                      className="h-48 w-full object-cover hover:scale-105 transition-transform"
                      loading="lazy"
                    />
                  </a>
                ) : (
                  <a
                    key={e.id}
                    href={e.file_url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex items-center gap-2 rounded-md border border-border-subtle bg-bg-tertiary p-3 text-sm hover:border-brand-500"
                  >
                    <FileText className="h-4 w-4 shrink-0" />
                    <span className="truncate">{e.file_name}</span>
                  </a>
                )
              )}
            </CardContent>
          </Card>
        )}

        {providerResponse ? (
          <ProviderResponseCard
            providerName={providerResponse.provider_name}
            response={providerResponse.response}
            createdAt={providerResponse.created_at}
            verified={providerResponse.verified}
          />
        ) : (
          <Card variant="default" className="border-dashed">
            <CardContent className="flex items-center justify-between gap-3 py-6">
              <div>
                <p className="text-sm font-medium text-fg-primary">
                  {t("ai_response_pending")}
                </p>
                <p className="text-xs text-fg-muted">
                  {tCommon("aiResponseDesc", {
                    defaultValue:
                      "AI providers are notified of new reports and have the right to respond.",
                  })}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <aside className="space-y-4">
        <div className="flex items-start gap-3">
          <VoteButtons
            incidentId={incident.id}
            initialUpvotes={incident.upvotes}
            initialDownvotes={incident.downvotes}
            initialUserVote={userVote}
            disabled={!isAuthenticated}
          />
          <div className="flex-1">
            <ShareButtons url={`/incidents/${incident.id}`} title={incident.title_masked} />
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">{tCommon("details", { defaultValue: "Details" })}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <Row icon={<Building2 className="h-3.5 w-3.5" />} label="Provider" value={
              <Link href={`/brand/${incident.provider_slug}`} className="text-brand-400 hover:underline">
                {incident.provider_name}
              </Link>
            } />
            <Row icon={<Tag className="h-3.5 w-3.5" />} label="Category" value={tCat(incident.category)} />
            <Row icon={<Clock className="h-3.5 w-3.5" />} label={t("incident_date")} value={formatDate(new Date(incident.incident_date), locale)} />
            <Row icon={<Globe className="h-3.5 w-3.5" />} label={t("language")} value={incident.language ?? "—"} />
          </CardContent>
        </Card>
        <TakedownButton incidentId={incident.id} />
      </aside>
    </article>
  );
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-2">
      <span className="inline-flex items-center gap-1.5 text-xs text-fg-muted">
        {icon}
        {label}
      </span>
      <span className="text-right text-sm text-fg-primary">{value}</span>
    </div>
  );
}
