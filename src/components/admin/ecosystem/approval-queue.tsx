"use client";

import { useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { approveQueueItem, rejectQueueItem } from "@/actions/ecosystem";
import { Clock, Check, X, Globe } from "@phosphor-icons/react/dist/ssr";
import type { Database } from "@/types/database";

type QueueItem = Database["public"]["Tables"]["external_incidents_queue"]["Row"];

function SourceBadge({ source }: { source: string }) {
  const colors: Record<string, string> = {
    reddit: "bg-orange-500/15 text-orange-400 border-orange-500/30",
    hn: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    rss: "bg-sky-500/15 text-sky-400 border-sky-500/30",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase ${colors[source] || "bg-bg-tertiary text-fg-muted border-border-subtle"}`}
    >
      {source}
    </span>
  );
}

export function ApprovalQueue({ items }: { items: QueueItem[] }) {
  const [isPending, startTransition] = useTransition();

  const handleApprove = (id: string) => {
    startTransition(() => approveQueueItem(id));
  };

  const handleReject = (id: string) => {
    startTransition(() => rejectQueueItem(id));
  };

  return (
    <Card variant="glass" padding="none">
      <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 px-5 py-4">
        <CardTitle className="text-fg-primary flex items-center gap-2 text-sm font-black tracking-wider uppercase">
          <Clock weight="duotone" className="text-warning-400 h-4 w-4" />
          Review Queue
          {items.length > 0 && (
            <Badge variant="warning" size="sm">
              {items.length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Check weight="duotone" className="mb-2 h-8 w-8 text-emerald-400" />
            <p className="text-fg-muted text-sm">Queue is clear — no pending items</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-4 px-5 py-4 transition-colors hover:bg-white/[0.02]"
              >
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <SourceBadge source={item.source} />
                    <span className="text-fg-muted font-mono text-[10px]">
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <a
                    href={item.external_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-fg-primary hover:text-brand-300 line-clamp-2 text-sm font-bold transition-colors"
                  >
                    {item.title}
                  </a>
                  <p className="text-fg-muted mt-1 line-clamp-2 text-xs">{item.body}</p>
                  <div className="mt-2 flex items-center gap-3">
                    <Globe weight="duotone" className="text-fg-muted h-3 w-3" />
                    <span className="text-fg-muted truncate font-mono text-[10px]">
                      {item.external_url}
                    </span>
                    <span className="text-fg-muted font-mono text-[10px]">
                      Score: {item.source_score}
                    </span>
                  </div>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    onClick={() => handleApprove(item.id)}
                    disabled={isPending}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 transition hover:bg-emerald-500/20 disabled:opacity-40"
                    title="Approve & publish"
                  >
                    <Check weight="bold" className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleReject(item.id)}
                    disabled={isPending}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 transition hover:bg-red-500/20 disabled:opacity-40"
                    title="Reject"
                  >
                    <X weight="bold" className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
