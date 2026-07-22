"use client";

import { useTranslations } from "next-intl";
import { StatsCards } from "./stats-cards";
import { ApprovalQueue } from "./approval-queue";
import { LiveFeed } from "./live-feed";
import { PositiveDevelopments } from "./positive-developments";
import { ManualFetchButton } from "./manual-fetch-button";
import type { Database } from "@/types/database";

type QueueItem = Database["public"]["Tables"]["external_incidents_queue"]["Row"];
type EcosystemNews = Database["public"]["Tables"]["ecosystem_news"]["Row"];

interface DashboardData {
  queue: QueueItem[];
  feed: EcosystemNews[];
  positive: EcosystemNews[];
  stats: {
    total: number;
    incidents: number;
    positive: number;
    queue: number;
    sourceCount: number;
  };
}

export function EcosystemDashboard({ data }: { data: DashboardData }) {
  const t = useTranslations("admin");

  return (
    <div className="animate-in fade-in space-y-6 duration-500">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white drop-shadow-md">
            {t("ecosystem_hub_title") || "Ecosystem Intelligence Hub"}
          </h1>
          <p className="text-fg-secondary mt-2">
            {t("ecosystem_hub_subtitle") ||
              "Monitor AI ecosystem news, review external incident submissions, and track positive developments — all in one place."}
          </p>
        </div>
        <ManualFetchButton />
      </div>

      <StatsCards stats={data.stats} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-3">
          <ApprovalQueue items={data.queue} />
          <LiveFeed items={data.feed} />
        </div>
        <div className="lg:col-span-2">
          <PositiveDevelopments items={data.positive} />
        </div>
      </div>
    </div>
  );
}
