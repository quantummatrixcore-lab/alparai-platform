import { describe, it, expect, beforeEach } from "vitest";
import "../helpers/setup";
import {
  hashIp,
  requireIpSalt,
  generateProviderToken,
  verifyProviderToken,
} from "@/lib/utils/hash";

describe("hash utilities", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  it("uses fallback if IP_SALT is missing", () => {
    process.env.IP_SALT = "";
    process.env.SUPABASE_ANON_KEY = "test_anon_key_long_enough_1234567890";
    expect(requireIpSalt()).toBe("test_anon_key_long_enough_123456");
  });

  it("pads IP_SALT with 0 if it is shorter than 16 chars", () => {
    process.env.IP_SALT = "short";
    expect(requireIpSalt()).toBe("short00000000000");
  });

  it("hashes IP successfully with salt", () => {
    process.env.IP_SALT = "long-salt-value-for-testing-12345";
    const hash1 = hashIp("192.168.1.1");
    const hash2 = hashIp("192.168.1.1");
    const hash3 = hashIp("192.168.1.2");

    expect(hash1).toBe(hash2);
    expect(hash1).not.toBe(hash3);
    expect(hash1).toHaveLength(64); // sha256 hex length
  });

  it("generates and verifies provider tokens statelessly", () => {
    process.env.IP_SALT = "long-salt-value-for-testing-12345";
    const incidentId = "550e8400-e29b-41d4-a716-446655440000";
    const email = "trust@openai.com";

    const token = generateProviderToken(incidentId, email);
    expect(token).toHaveLength(64);

    const isValid = verifyProviderToken(incidentId, email, token);
    expect(isValid).toBe(true);

    const isInvalidEmail = verifyProviderToken(incidentId, "other@openai.com", token);
    expect(isInvalidEmail).toBe(false);

    const isInvalidIncident = verifyProviderToken("other-incident-id", email, token);
    expect(isInvalidIncident).toBe(false);
  });
});
