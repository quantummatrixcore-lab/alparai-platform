"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkle, Star } from "@phosphor-icons/react/dist/ssr";
import type { Database } from "@/types/database";

type EcosystemNews = Database["public"]["Tables"]["ecosystem_news"]["Row"];

export function PositiveDevelopments({ items }: { items: EcosystemNews[] }) {
  return (
    <Card variant="glass" padding="none">
      <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 px-5 py-4">
        <CardTitle className="text-fg-primary flex items-center gap-2 text-sm font-black tracking-wider uppercase">
          <Sparkle weight="duotone" className="h-4 w-4 text-emerald-400" />
          Positive Developments
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Star weight="duotone" className="text-fg-muted mb-2 h-8 w-8" />
            <p className="text-fg-muted text-sm">No positive developments tracked yet</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-4 px-5 py-4 transition-colors hover:bg-white/[0.02]"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10">
                  <Sparkle weight="fill" className="h-3.5 w-3.5 text-emerald-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    {item.source && (
                      <span className="text-fg-muted font-mono text-[10px]">{item.source}</span>
                    )}
                    {item.published_at && (
                      <span className="text-fg-muted font-mono text-[10px]">
                        {new Date(item.published_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
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
