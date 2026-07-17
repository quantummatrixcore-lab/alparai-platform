"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Radio, Archive } from "@phosphor-icons/react/dist/ssr";
import { archiveEcosystemNews } from "@/actions/ecosystem";
import { useTransition } from "react";
import type { Database } from "@/types/database";

type EcosystemNews = Database["public"]["Tables"]["ecosystem_news"]["Row"];

const CATEGORY_COLORS: Record<string, string> = {
  incident: "danger",
  positive_development: "success",
  regulation: "warning",
  research: "brand",
  business: "default",
};

export function LiveFeed({ items }: { items: EcosystemNews[] }) {
  const [, startTransition] = useTransition();

  const handleArchive = (id: string) => {
    startTransition(() => archiveEcosystemNews(id));
  };

  return (
    <Card variant="glass" padding="none">
      <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 px-5 py-4">
        <CardTitle className="text-fg-primary flex items-center gap-2 text-sm font-black tracking-wider uppercase">
          <Radio weight="duotone" className="h-4 w-4 text-sky-400" />
          Live Feed
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Radio weight="duotone" className="text-fg-muted mb-2 h-8 w-8" />
            <p className="text-fg-muted text-sm">No published items yet</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {items.map((item) => (
              <div
                key={item.id}
                className="group flex items-start gap-4 px-5 py-4 transition-colors hover:bg-white/[0.02]"
              >
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <Badge
                      variant={
                        (CATEGORY_COLORS[item.category] as
                          | "danger"
                          | "success"
                          | "warning"
                          | "brand"
                          | "default") || "default"
                      }
                      size="sm"
                      dot
                    >
                      {item.category}
                    </Badge>
                    {item.source && (
                      <span className="text-fg-muted font-mono text-[10px]">{item.source}</span>
                    )}
                    {item.published_at && (
                      <span className="text-fg-muted font-mono text-[10px]">
                        {new Date(item.published_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <div className="flex items-start gap-2">
                    {item.url ? (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-fg-primary hover:text-brand-300 line-clamp-2 text-sm font-semibold transition-colors"
                      >
                        {item.title_en}
                      </a>
                    ) : (
                      <span className="text-fg-primary line-clamp-2 text-sm font-semibold">
                        {item.title_en}
                      </span>
                    )}
                    <button
                      onClick={() => handleArchive(item.id)}
                      className="text-fg-muted hover:text-danger-400 mt-0.5 shrink-0 opacity-0 transition group-hover:opacity-100"
                      title="Archive"
                    >
                      <Archive weight="duotone" className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  {item.summary_en && (
                    <p className="text-fg-muted mt-1 line-clamp-2 text-xs">{item.summary_en}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
