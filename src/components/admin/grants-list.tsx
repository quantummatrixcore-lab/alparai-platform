"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { MetricCard } from "@/components/admin/metric-card";
import { ExternalLink, CheckCircle2, DollarSign, Building2, Send, FileText } from "lucide-react";
import { updateGrantStatus } from "@/actions/admin/grants";
import { toast } from "sonner";

interface GrantApplication {
  id: string;
  program_name: string;
  funding_amount: string | null;
  apply_url: string | null;
  category: string | null;
  phase: number;
  status:
    | "not_started"
    | "drafting"
    | "submitted_pending_review"
    | "approved"
    | "rejected"
    | "accepted_by_program";
  notes: string | null;
  created_at: string;
}

export function GrantsList({ initialGrants }: { initialGrants: GrantApplication[] }) {
  const t = useTranslations("admin");
  const [filter, setFilter] = useState<string>("all");
  const [isPending, startTransition] = useTransition();

  const handleUpdateStatus = (id: string, status: GrantApplication["status"], phase: number) => {
    startTransition(async () => {
      const result = await updateGrantStatus({ id, status, phase });
      if (result.success) {
        toast.success(t("status_updated") || "Status updated");
      } else {
        toast.error(result.error || "Failed to update status");
      }
    });
  };

  const filtered =
    filter === "all" ? initialGrants : initialGrants.filter((g) => g.status === filter);

  const stats = {
    total: initialGrants.length,
    drafting: initialGrants.filter((g) => g.status === "drafting").length,
    submitted: initialGrants.filter((g) => g.status === "submitted_pending_review").length,
    approved: initialGrants.filter(
      (g) => g.status === "approved" || g.status === "accepted_by_program",
    ).length,
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <MetricCard
          title="Total Grants"
          value={stats.total}
          icon={<Building2 className="h-4 w-4 text-sky-400" />}
        />
        <MetricCard
          title="Drafting"
          value={stats.drafting}
          icon={<FileText className="h-4 w-4 text-amber-400" />}
        />
        <MetricCard
          title="Submitted"
          value={stats.submitted}
          icon={<Send className="h-4 w-4 text-blue-400" />}
        />
        <MetricCard
          title="Approved"
          value={stats.approved}
          icon={<CheckCircle2 className="h-4 w-4 text-emerald-400" />}
        />
      </div>

      <div className="flex space-x-2 overflow-x-auto border-b border-white/10 pb-2">
        {(
          [
            "all",
            "not_started",
            "drafting",
            "submitted_pending_review",
            "approved",
            "rejected",
            "accepted_by_program",
          ] as const
        ).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors ${
              filter === tab ? "bg-white/10 text-white" : "text-fg-muted hover:text-white"
            }`}
          >
            {tab === "all"
              ? "All"
              : tab
                  .split("_")
                  .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                  .join(" ")}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="text-fg-muted rounded-xl border border-white/10 bg-black/20 py-12 text-center">
            No grant applications found.
          </div>
        ) : (
          filtered.map((grant) => (
            <Card
              key={grant.id}
              className="flex flex-col items-start justify-between gap-4 border-white/10 bg-black/40 p-4 md:flex-row md:items-center"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-white">{grant.program_name}</h3>
                  <span className="text-fg-muted rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs">
                    Phase {grant.phase}
                  </span>
                  {grant.funding_amount && (
                    <span className="flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-400">
                      <DollarSign className="h-3 w-3" /> {grant.funding_amount}
                    </span>
                  )}
                </div>
                <p className="text-fg-muted mt-1 text-sm">{grant.category || "General Grant"}</p>
                {grant.notes && (
                  <p className="text-fg-muted/70 mt-2 flex items-center gap-1 text-xs">
                    <FileText className="h-3 w-3" /> {grant.notes}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3">
                {grant.apply_url && (
                  <a
                    href={grant.apply_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-fg-muted rounded-md border border-white/5 bg-white/5 p-2 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}

                <div className="flex overflow-hidden rounded-md border border-white/10 bg-black/50">
                  <select
                    disabled={isPending}
                    value={grant.status}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onChange={(e) =>
                      handleUpdateStatus(grant.id, e.target.value as any, grant.phase)
                    }
                    className="cursor-pointer bg-transparent px-3 py-1.5 text-sm text-white outline-none hover:bg-white/5"
                  >
                    <option value="not_started">Not Started</option>
                    <option value="drafting">Drafting</option>
                    <option value="submitted_pending_review">Submitted</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="accepted_by_program">Accepted By Program</option>
                  </select>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
