import { createHash } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Check if the email recipient has received fewer than 3 notifications in the last 24 hours.
 * If yes, log the email send to the database and return true.
 * If no, return false (indicating email should be capped/skipped).
 */
export async function checkEmailCapAndLog(email: string, emailType: string): Promise<boolean> {
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
      console.error("[EmailCap] Failed to query email sent logs:", error);
      // Fail-open: if DB query fails, we allow sending but log it, to avoid blocking critical emails
      return true;
    }

    if (count !== null && count >= 3) {
      console.warn(
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
      console.error("[EmailCap] Failed to insert email sent log:", insertErr);
    }

    return true;
  } catch (err) {
    console.error("[EmailCap] Unexpected exception during check:", err);
    return true; // Fail-open
  }
}
