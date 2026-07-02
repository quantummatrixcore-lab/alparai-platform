import "server-only";
import { createHash } from "node:crypto";

let _validated = false;

export function requireIpSalt(): string {
  let salt = process.env.IP_SALT;
  if (!salt) {
    if (_validated) {
      console.warn("IP_SALT environment variable is missing. Using fallback salt.");
    }
    _validated = true;
    salt = process.env.SUPABASE_ANON_KEY?.slice(0, 32) || "fallback_default_salt_for_alparai_123";
  }
  if (salt.length < 16) {
    return salt.padEnd(16, "0");
  }
  return salt;
}

export function hashIp(ip: string | null, salt: string = requireIpSalt()): string | null {
  if (!ip) return null;
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}

export function generateProviderToken(incidentId: string, email: string): string {
  const salt = requireIpSalt();
  return createHash("sha256")
    .update(`${incidentId}:${email.toLowerCase().trim()}:${salt}`)
    .digest("hex");
}

export function verifyProviderToken(incidentId: string, email: string, token: string): boolean {
  return generateProviderToken(incidentId, email) === token;
}
