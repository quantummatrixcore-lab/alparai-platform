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

  it("requires IP_SALT to be set", () => {
    process.env.IP_SALT = "";
    expect(() => requireIpSalt()).toThrow("IP_SALT environment variable is required");
  });

  it("requires IP_SALT to be at least 16 chars", () => {
    process.env.IP_SALT = "short";
    expect(() => requireIpSalt()).toThrow("IP_SALT must be at least 16 characters");
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
