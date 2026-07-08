import { createHash } from "node:crypto";

/**
 * Generate a stateless secure unsubscribe token for a given user.
 */
export function generateUnsubscribeToken(userId: string): string {
  const salt = process.env.SUPABASE_SERVICE_ROLE_KEY || "alparai-fallback-unsubscribe-salt-2026";
  return createHash("sha256").update(`${userId}:${salt}`).digest("hex");
}

/**
 * Verify if the provided unsubscribe token is valid for the given user.
 */
export function verifyUnsubscribeToken(userId: string, token: string): boolean {
  if (!userId || !token) return false;
  const expected = generateUnsubscribeToken(userId);
  return expected === token;
}
