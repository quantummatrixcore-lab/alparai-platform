"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth/session";

export interface CapacityMetrics {
  supabaseDb: {
    usedBytes: number;
    limitBytes: number;
    percentage: number;
  };
  supabaseStorage: {
    usedBytes: number;
    limitBytes: number;
    percentage: number;
  };
  rowCounts: {
    incidents: number;
    kModelScores: number;
    externalIncidentsQueue: number;
  };
  vercelDeploys: {
    used: number;
    limit: number;
    percentage: number;
    lastVerified: string;
  };
  vercelCrons: {
    used: number;
    limit: number;
    percentage: number;
    lastVerified: string;
  };
  upstashRedis: {
    used: number;
    limit: number;
    percentage: number;
    lastVerified: string;
  };
  resendEmails: {
    used: number;
    limit: number;
    percentage: number;
  };
  aiGateway: {
    dailyUsed: number;
    dailyLimit: number;
    monthlyUsed: number;
    monthlyLimit: number;
  };
}

export async function getLiveCapacityMetrics(): Promise<CapacityMetrics> {
  await requireAdmin();
  const db = createAdminClient();

  // 1. Supabase Database Size via RPC
  let dbUsedBytes = 24117248; // Default fallback: 23 MB
  const { data: dbSizeData, error: dbSizeErr } = await db.rpc("get_database_size");
  if (!dbSizeErr && dbSizeData) {
    dbUsedBytes = Number(dbSizeData);
  }

  // 2. Supabase Storage Size via RPC
  let storageUsedBytes = 5242880; // 5 MB fallback
  const { data: storageSizeData, error: storageSizeErr } = await db.rpc("get_storage_size");
  if (!storageSizeErr && storageSizeData) {
    storageUsedBytes = Number(storageSizeData);
  }

  // 3. Row Counts
  const { count: incidentsCount } = await db.from("incidents").select("*", { count: "exact", head: true });
  const { count: kScoresCount } = await db.from("k_model_scores").select("*", { count: "exact", head: true });
  const { count: queueCount } = await db.from("external_incidents_queue").select("*", { count: "exact", head: true });

  // 4. Resend Monthly Emails Sent
  const { count: emailsSent } = await db
    .from("email_sent_logs")
    .select("*", { count: "exact", head: true })
    .gte("sent_at", new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString());

  // 5. AI Gateway Cost via RPC
  const { data: dailyCost, error: dailyCostErr } = await db.rpc("get_ai_gateway_costs", {
    time_interval: "24 hours"
  });
  const { data: monthlyCost, error: monthlyCostErr } = await db.rpc("get_ai_gateway_costs", {
    time_interval: "30 days"
  });

  const dailyUsedCost = !dailyCostErr && dailyCost ? Number(dailyCost) : 0;
  const monthlyUsedCost = !monthlyCostErr && monthlyCost ? Number(monthlyCost) : 0;

  const dbLimit = 524288000; // 500 MB
  const storageLimit = 1073741824; // 1 GB

  return {
    supabaseDb: {
      usedBytes: dbUsedBytes,
      limitBytes: dbLimit,
      percentage: Math.min((dbUsedBytes / dbLimit) * 100, 100),
    },
    supabaseStorage: {
      usedBytes: storageUsedBytes,
      limitBytes: storageLimit,
      percentage: Math.min((storageUsedBytes / storageLimit) * 100, 100),
    },
    rowCounts: {
      incidents: incidentsCount || 0,
      kModelScores: kScoresCount || 0,
      externalIncidentsQueue: queueCount || 0,
    },
    vercelDeploys: {
      used: 12,
      limit: 100,
      percentage: 12,
      lastVerified: "2026-07-16",
    },
    vercelCrons: {
      used: 2,
      limit: 2,
      percentage: 100,
      lastVerified: "2026-07-16",
    },
    upstashRedis: {
      used: 350,
      limit: 10000,
      percentage: 3.5,
      lastVerified: "2026-07-16",
    },
    resendEmails: {
      used: emailsSent || 0,
      limit: 3000,
      percentage: Math.min(((emailsSent || 0) / 3000) * 100, 100),
    },
    aiGateway: {
      dailyUsed: dailyUsedCost,
      dailyLimit: 10.00,
      monthlyUsed: monthlyUsedCost,
      monthlyLimit: 30.00,
    },
  };
}
