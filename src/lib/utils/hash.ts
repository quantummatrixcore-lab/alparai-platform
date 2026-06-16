import "server-only";
import { createHash } from "node:crypto";

let _validated = false;

export function requireIpSalt(): string {
  const salt = process.env.IP_SALT;
  if (!salt) {
    if (_validated) {
      throw new Error("IP_SALT environment variable is required");
    }
    _validated = true;
    throw new Error("IP_SALT environment variable is required");
  }
  if (salt.length < 16) {
    throw new Error("IP_SALT must be at least 16 characters");
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
