import { createHash } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { logger } from "@/lib/utils/logger";

/**
 * Check if the email recipient has received fewer than 3 notifications in the last 24 hours.
 * If yes, log the email send to the database and return true.
 * If no or on error, return false (indicating email should NOT be allowed/sent - fail-closed).
 */
export async function isEmailAllowed(email: string, emailType: string): Promise<boolean> {
  if (!email) return false;

  const admin = createAdminClient();
  const normalizedEmail = email.toLowerCase().trim();
  const emailHash = createHash("sha256").update(normalizedEmail).digest("hex");

  try {
    // Count emails sent to this email hash in the last 24 hours
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const { count, error } = await admin
      .from("email_sent_logs")
      .select("*", { count: "exact", head: true })
      .eq("email_hash", emailHash)
      .gte("sent_at", oneDayAgo);

    if (error) {
      logger.error(
        "[EmailCap] Failed to query email sent logs",
        undefined,
        error instanceof Error ? error : undefined,
      );
      // Fail-closed: if DB query fails, we block sending to protect user from spam
      return false;
    }

    if (count !== null && count >= 3) {
      logger.warn(
        `[EmailCap] Daily email cap of 3 reached for recipient. Skipping send. type=${emailType}`,
      );
      return false;
    }

    // Log this email send
    const { error: insertErr } = await admin.from("email_sent_logs").insert({
      email_hash: emailHash,
      email_type: emailType,
    });

    if (insertErr) {
      logger.error(
        "[EmailCap] Failed to insert email sent log",
        undefined,
        insertErr instanceof Error ? insertErr : undefined,
      );
      // Even if logging the send fails, we err on the side of caution (fail-closed)
      return false;
    }

    return true;
  } catch (err) {
    logger.error(
      "[EmailCap] Unexpected exception during check",
      undefined,
      err instanceof Error ? err : undefined,
    );
    return false; // Fail-closed
  }
}
