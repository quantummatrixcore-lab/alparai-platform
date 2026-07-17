"use client";

import React, { useState } from "react";
import { Check, X, Shield, ExternalLink } from "lucide-react";
import { bulkApproveIncidents, bulkRejectIncidents } from "@/actions/admin";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

export interface ImportedIncident {
  id: string;
  title: string;
  description: string;
  category: string;
  severity: string;
  incident_date: string | null;
  incident_source: string;
  import_external_id: string | null;
  import_attribution: string | null;
  source_url: string | null;
}

interface ImportQueueClientProps {
  initialIncidents: ImportedIncident[];
  locale: string;
}

export function ImportQueueClient({ initialIncidents, locale: _locale }: ImportQueueClientProps) {
  const t = useTranslations("admin");
  const [incidents, setIncidents] = useState<ImportedIncident[]>(initialIncidents);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sourceFilter, setSourceFilter] = useState<string>("all");

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredIncidents.map((i) => i.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleBulkApprove = async () => {
    if (selectedIds.length === 0) return;
    setIsProcessing(true);
    try {
      const res = await bulkApproveIncidents(selectedIds);
      if (res.ok) {
        setIncidents((prev) => prev.filter((i) => !selectedIds.includes(i.id)));
        setSelectedIds([]);
        toast.success(t("import_q_approved_toast", { count: selectedIds.length }));
      } else {
        toast.error(res.error || "Failed to approve incidents.");
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Operation failed.";
      toast.error(errMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBulkReject = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(t("import_q_reject_confirm", { count: selectedIds.length }))) {
      return;
    }
    setIsProcessing(true);
    try {
      const res = await bulkRejectIncidents(selectedIds);
      if (res.ok) {
        setIncidents((prev) => prev.filter((i) => !selectedIds.includes(i.id)));
        setSelectedIds([]);
        toast.success(t("import_q_rejected_toast", { count: selectedIds.length }));
      } else {
        toast.error(res.error || "Failed to reject incidents.");
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Operation failed.";
      toast.error(errMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredIncidents = incidents.filter((i) => {
    if (sourceFilter === "all") return true;
    return i.incident_source === sourceFilter;
  });

  const getSeverityColor = (sev: string) => {
    switch (sev) {
      case "critical":
        return "bg-red-500/10 text-red-400 border border-red-500/20";
      case "high":
        return "bg-orange-500/10 text-orange-400 border border-orange-500/20";
      case "medium":
        return "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20";
      default:
        return "bg-blue-500/10 text-blue-400 border border-blue-500/20";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-black text-white">{t("import_q_title")}</h1>
          <p className="text-fg-secondary mt-1 text-xs">{t("import_q_subtitle")}</p>
        </div>

        {/* Source filter tabs */}
        <div className="bg-bg-secondary/40 border-border-subtle flex gap-2 rounded-xl border p-1 backdrop-blur-md">
          <button
            onClick={() => setSourceFilter("all")}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-bold transition duration-200",
              sourceFilter === "all"
                ? "bg-white/10 text-white shadow-md"
                : "text-fg-muted hover:text-white",
            )}
          >
            {t("import_q_filter_all")}
          </button>
          <button
            onClick={() => setSourceFilter("aiaaic_import")}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-bold transition duration-200",
              sourceFilter === "aiaaic_import"
                ? "bg-white/10 text-white shadow-md"
                : "text-fg-muted hover:text-white",
            )}
          >
            AIAAIC
          </button>
          <button
            onClick={() => setSourceFilter("aiid_import")}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-bold transition duration-200",
              sourceFilter === "aiid_import"
                ? "bg-white/10 text-white shadow-md"
                : "text-fg-muted hover:text-white",
            )}
          >
            AIID
          </button>
        </div>
      </div>

      {/* Action panel */}
      {selectedIds.length > 0 && (
        <div className="bg-brand-950/20 border-brand-500/30 animate-in fade-in slide-in-from-top-4 flex items-center justify-between rounded-2xl border px-6 py-4 backdrop-blur-md duration-300">
          <span className="text-brand-400 text-xs font-bold">
            {t("import_q_selected", { count: selectedIds.length })}
          </span>
          <div className="flex gap-3">
            <button
              onClick={handleBulkReject}
              disabled={isProcessing}
              className="flex items-center gap-1.5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-xs font-bold text-red-400 transition hover:bg-red-500/20"
            >
              <X className="h-4 w-4" />
              {t("import_q_reject")}
            </button>
            <button
              onClick={handleBulkApprove}
              disabled={isProcessing}
              className="bg-brand-600 hover:bg-brand-500 hover:shadow-brand-500/10 flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-white shadow-lg transition"
            >
              <Check className="h-4 w-4" />
              {t("import_q_bulk_approve")}
            </button>
          </div>
        </div>
      )}

      {/* Incident List */}
      <div className="border-border-subtle bg-bg-secondary/20 overflow-hidden rounded-2xl border backdrop-blur-md">
        {filteredIncidents.length === 0 ? (
          <div className="py-16 text-center">
            <Shield className="text-fg-muted mx-auto h-12 w-12 opacity-30" />
            <h3 className="mt-4 text-sm font-bold text-white">{t("import_q_empty")}</h3>
            <p className="text-fg-muted mt-2 text-xs">{t("import_q_empty_desc")}</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {/* Header row */}
            <div className="text-fg-secondary flex items-center gap-4 bg-white/5 px-6 py-3.5 text-xs font-bold">
              <input
                type="checkbox"
                checked={
                  selectedIds.length === filteredIncidents.length && filteredIncidents.length > 0
                }
                onChange={handleSelectAll}
                className="bg-bg-tertiary text-brand-600 focus:ring-brand-500 focus:ring-offset-bg-primary h-4 w-4 rounded border-white/10"
              />
              <div className="w-16">{t("import_q_source")}</div>
              <div className="flex-1">{t("import_q_title_details")}</div>
              <div className="w-24 text-center">{t("import_q_category")}</div>
              <div className="w-24 text-center">{t("import_q_severity")}</div>
            </div>

            {/* Data rows */}
            {filteredIncidents.map((incident) => {
              const isSelected = selectedIds.includes(incident.id);
              return (
                <div
                  key={incident.id}
                  className={cn(
                    "flex items-start gap-4 px-6 py-5 transition-colors duration-200",
                    isSelected ? "bg-brand-950/5" : "hover:bg-white/5",
                  )}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleSelectOne(incident.id)}
                    className="bg-bg-tertiary text-brand-600 focus:ring-brand-500 focus:ring-offset-bg-primary mt-1 h-4 w-4 rounded border-white/10"
                  />

                  {/* Source badge */}
                  <div className="w-16 pt-0.5">
                    <span
                      className={cn(
                        "rounded border px-2 py-0.5 text-[9px] font-extrabold tracking-wide uppercase",
                        incident.incident_source === "aiaaic_import"
                          ? "border-purple-500/20 bg-purple-500/10 text-purple-400"
                          : "border-blue-500/20 bg-blue-500/10 text-blue-400",
                      )}
                    >
                      {incident.incident_source === "aiaaic_import" ? "AIAAIC" : "AIID"}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{incident.title}</span>
                      {incident.source_url && (
                        <a
                          href={incident.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-fg-muted transition hover:text-white"
                          title={t("import_q_original_source")}
                        >
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                    <p className="text-fg-secondary line-clamp-2 max-w-3xl text-xs leading-relaxed">
                      {incident.description}
                    </p>
                    <div className="text-fg-muted flex items-center gap-4 pt-1 text-[10px]">
                      {incident.incident_date && (
                        <span>
                          {t("import_q_date")}
                          {incident.incident_date}
                        </span>
                      )}
                      {incident.import_external_id && (
                        <span className="font-mono">ID: {incident.import_external_id}</span>
                      )}
                    </div>
                  </div>

                  {/* Category */}
                  <div className="w-24 pt-0.5 text-center">
                    <span className="text-fg-secondary rounded border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-bold tracking-wide uppercase">
                      {incident.category}
                    </span>
                  </div>

                  {/* Severity */}
                  <div className="w-24 pt-0.5 text-center">
                    <span
                      className={cn(
                        "rounded px-2.5 py-1 text-[10px] font-bold tracking-wide uppercase",
                        getSeverityColor(incident.severity),
                      )}
                    >
                      {incident.severity}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
