import "server-only";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { logger } from "@/lib/utils/logger";

const ALGORITHM = "aes-256-gcm";
const VAULT_PATH = path.resolve(process.cwd(), ".vault.json");

function getMasterKey(): Buffer {
  const key = process.env.VAULT_MASTER_KEY;
  if (!key || key.length < 16) {
    throw new Error("VAULT_MASTER_KEY env var required (min 16 chars)");
  }
  return crypto.scryptSync(key, "alpar-vault-salt-v1", 32);
}

interface EncryptedPayload {
  iv: string;
  encrypted_value: string;
  version: number;
}

function encrypt(plaintext: string): EncryptedPayload {
  const key = getMasterKey();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return {
    iv: iv.toString("hex"),
    encrypted_value: Buffer.concat([encrypted, tag]).toString("hex"),
    version: 2,
  };
}

function decrypt(payload: EncryptedPayload): string {
  const key = getMasterKey();
  const iv = Buffer.from(payload.iv, "hex");
  const combined = Buffer.from(payload.encrypted_value, "hex");
  if (combined.length < 16) throw new Error("Ciphertext too short");
  const encrypted = combined.subarray(0, combined.length - 16);
  const tag = combined.subarray(combined.length - 16);
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf8");
}

function loadVault(): Record<string, string> {
  try {
    if (fs.existsSync(VAULT_PATH)) {
      return JSON.parse(fs.readFileSync(VAULT_PATH, "utf8"));
    }
  } catch {
    logger.warn("[vault] load failed");
  }
  return {};
}

function saveVault(data: Record<string, string>): void {
  try {
    fs.writeFileSync(VAULT_PATH, JSON.stringify(data, null, 2));
  } catch (err) {
    logger.error("[vault] save failed", undefined, err instanceof Error ? err : undefined);
  }
}

export const vault = {
  get(key: string): string | null {
    const store = loadVault();
    const raw = store[key];
    if (!raw) return null;
    try {
      return decrypt(JSON.parse(raw));
    } catch {
      return null;
    }
  },

  set(key: string, value: string): void {
    const store = loadVault();
    store[key] = JSON.stringify(encrypt(value));
    saveVault(store);
  },

  remove(key: string): boolean {
    const store = loadVault();
    if (!store[key]) return false;
    delete store[key];
    saveVault(store);
    return true;
  },

  list(): string[] {
    return Object.keys(loadVault());
  },

  has(key: string): boolean {
    const store = loadVault();
    return key in store;
  },
};
