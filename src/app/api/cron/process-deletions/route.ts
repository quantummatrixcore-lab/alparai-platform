import { type NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { logger } from "@/lib/utils/logger";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const isVercelCron = request.headers.get("x-vercel-cron") === "1";
  const cronSecret = process.env.CRON_SECRET;

  const isAuthorized =
    isVercelCron ||
    (cronSecret && authHeader === `Bearer ${cronSecret}`) ||
    process.env.NODE_ENV !== "production";

  if (!isAuthorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const admin = createAdminClient();
    const now = new Date().toISOString();

    // 1. Process Soft Deletions (72h grace period ended)
    const { data: softPending, error: softError } = await admin
      .from("users")
      .select("id")
      .eq("is_soft_deleted", false)
      .lte("delete_scheduled_for", now);

    if (softError) {
      throw new Error(`Failed to fetch soft delete candidates: ${softError.message}`);
    }

    const softDeletedIds: string[] = [];
    for (const user of softPending ?? []) {
      logger.info(`[ProcessDeletionsCron] Soft-deleting user: ${user.id}`);

      // Update public.users record
      const { error: userUpdateErr } = await admin
        .from("users")
        .update({
          is_soft_deleted: true,
          soft_deleted_at: now,
          email: null,
          full_name: "Anonim Kullanıcı",
          avatar_url: null,
          reputation_score: 0,
          badges: [],
          interests: [],
        } as never)
        .eq("id", user.id);

      if (userUpdateErr) {
        logger.error(
          `[ProcessDeletionsCron] Failed to soft-delete user ${user.id}: ${userUpdateErr.message}`,
        );
        continue;
      }

      // Auto-unsubscribe from all notification preferences
      const { error: prefErr } = await admin
        .from("email_preferences")
        .update({
          weekly_digest: false,
          watches: false,
          reporter_notifications: false,
          updated_at: now,
        })
        .eq("user_id", user.id);

      if (prefErr) {
        logger.warn(
          `[ProcessDeletionsCron] Failed to clear email preferences for user ${user.id}: ${prefErr.message}`,
        );
      }

      softDeletedIds.push(user.id);
    }

    // 2. Process Hard Deletions (30 days since soft deletion)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const { data: hardPending, error: hardError } = await admin
      .from("users")
      .select("id")
      .eq("is_soft_deleted", true)
      .lte("soft_deleted_at", thirtyDaysAgo);

    if (hardError) {
      throw new Error(`Failed to fetch hard delete candidates: ${hardError.message}`);
    }

    const hardDeletedIds: string[] = [];
    for (const user of hardPending ?? []) {
      logger.info(`[ProcessDeletionsCron] Hard-deleting user: ${user.id}`);

      // Delete user from Supabase Auth (cascades to public.users or we delete manually)
      try {
        const { error: authErr } = await admin.auth.admin.deleteUser(user.id);
        if (authErr) {
          logger.error(
            `[ProcessDeletionsCron] Auth deletion failed for user ${user.id}: ${authErr.message}`,
          );

          // Try manual table deletion as fallback
          const { error: dbDelErr } = await admin.from("users").delete().eq("id", user.id);
          if (dbDelErr) {
            logger.error(
              `[ProcessDeletionsCron] Database fallback deletion failed for user ${user.id}: ${dbDelErr.message}`,
            );
            continue;
          }
        }
      } catch (e) {
        logger.error(
          `[ProcessDeletionsCron] Exception during hard deletion of user ${user.id}`,
          undefined,
          e instanceof Error ? e : undefined,
        );
        continue;
      }

      hardDeletedIds.push(user.id);
    }

    return NextResponse.json({
      success: true,
      softDeleted: {
        count: softDeletedIds.length,
        ids: softDeletedIds,
      },
      hardDeleted: {
        count: hardDeletedIds.length,
        ids: hardDeletedIds,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error during user deletion processing";
    logger.error("Process deletions cron failed", {}, error instanceof Error ? error : undefined);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
