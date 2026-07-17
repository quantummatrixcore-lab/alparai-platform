"use client";

import { Card, CardContent } from "@/components/ui/card";

interface EcosystemStats {
  total: number;
  incidents: number;
  positive: number;
  queue: number;
  sourceCount?: number;
}

export function StatsCards({ stats }: { stats: EcosystemStats }) {
  const cards = [
    { label: "Total Published", value: stats.total, color: "text-brand-300" },
    { label: "Incidents", value: stats.incidents, color: "text-danger-400" },
    { label: "Positive Dev.", value: stats.positive, color: "text-emerald-400" },
    { label: "Queue", value: stats.queue, color: "text-warning-400" },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map((c) => (
        <Card key={c.label} variant="glass" padding="sm">
          <CardContent className="p-3">
            <p className="text-fg-muted text-xs font-semibold tracking-wider uppercase">
              {c.label}
            </p>
            <p className={`mt-1 text-3xl font-black ${c.color}`}>{c.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
