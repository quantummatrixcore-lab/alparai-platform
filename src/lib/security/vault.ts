import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "crypto";

const VAULT_SECRET = process.env.CRON_SECRET || "alpar-vault-fallback-secret-2026";
const ALGORITHM = "aes-256-gcm";
const KEY = scryptSync(VAULT_SECRET, "alpar-salt-vault-v1", 32);

/**
 * Encrypts a sensitive string (e.g. AI Provider API key) using AES-256-GCM.
 */
export function encryptAtRest(plainText: string): string {
  if (!plainText) return plainText;
  if (plainText.startsWith("enc:v1:")) return plainText; // Already encrypted

  const iv = randomBytes(12);
  const cipher = createCipheriv(ALGORITHM, KEY, iv);

  let encrypted = cipher.update(plainText, "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag().toString("hex");

  return `enc:v1:${iv.toString("hex")}:${authTag}:${encrypted}`;
}

/**
 * Decrypts an AES-256-GCM encrypted string.
 */
export function decryptAtRest(cipherText: string): string {
  if (!cipherText || !cipherText.startsWith("enc:v1:")) return cipherText;

  try {
    const parts = cipherText.split(":");
    if (parts.length !== 5) return cipherText;

    const iv = Buffer.from(parts[2]!, "hex");
    const authTag = Buffer.from(parts[3]!, "hex");
    const encryptedText = parts[4]!;

    const decipher = createDecipheriv(ALGORITHM, KEY, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch {
    return "••••••••";
  }
}
