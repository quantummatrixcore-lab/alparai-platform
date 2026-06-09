import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { sha256 } from "@/lib/utils";
import { headers } from "next/headers";
import { logger } from "@/lib/utils/logger";

export interface AuditLogEntry {
  actorId: string | null;
  action: string;
  entityType: string;
  entityId: string;
  beforeData?: Record<string, unknown> | null;
  afterData?: Record<string, unknown> | null;
}

export async function logAuditEvent(entry: AuditLogEntry): Promise<void> {
  try {
    const admin = createAdminClient();
    const hdrs = await headers();
    const rawIp = hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const ipHash = await sha256(rawIp);

    await admin.from("audit_log").insert({
      actor_id: entry.actorId,
      action: entry.action,
      entity_type: entry.entityType,
      entity_id: entry.entityId,
      before_data: entry.beforeData ?? null,
      after_data: entry.afterData ?? null,
      ip_hash: ipHash,
    } as never);
  } catch (error) {
    logger.error(
      "Failed to write audit log",
      { action: entry.action },
      error instanceof Error ? error : undefined
    );
  }
}
