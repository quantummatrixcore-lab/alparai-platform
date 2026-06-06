import { describe, it, expect } from "vitest";
import { hasPII, detectPIITypes, maskPII } from "@/lib/pii/guardian";

describe("PII Guardian", () => {
  describe("email", () => {
    it("detects plain email", () => {
      expect(hasPII("Contact me at john.doe@example.com please")).toBe(true);
      expect(detectPIITypes("Contact me at john.doe@example.com please")).toContain("email");
    });
    it("masks email with placeholders", () => {
      const r = maskPII("Email john.doe@example.com");
      expect(r.masked).not.toContain("john.doe@example.com");
      expect(r.masked).toMatch(/\[REDACTED-EMAIL\]/);
    });
  });

  describe("phone", () => {
    it("detects TR phone", () => {
      expect(hasPII("Ara beni: 0532 123 45 67")).toBe(true);
    });
    it("detects international phone", () => {
      expect(hasPII("Call +1 415 555 0123")).toBe(true);
    });
  });

  describe("credit card", () => {
    it("detects a Luhn-valid Visa", () => {
      expect(hasPII("Card 4111 1111 1111 1111")).toBe(true);
    });
    it("rejects non-Luhn-valid 16-digit number", () => {
      expect(detectPIITypes("Order #1234 5678 9012 3456")).not.toContain("credit_card");
    });
  });

  describe("IBAN", () => {
    it("detects TR IBAN", () => {
      expect(hasPII("TR12 0006 4000 0011 2345 6789 01")).toBe(true);
    });
  });

  describe("API keys", () => {
    it("detects OpenAI key", () => {
      expect(detectPIITypes("Key: sk-proj-abcdefghij1234567890")).toContain("api_key");
    });
    it("detects xAI key", () => {
      expect(detectPIITypes("xai-abcdefghij1234567890")).toContain("api_key");
    });
    it("detects AWS access key", () => {
      expect(detectPIITypes("AKIAIOSFODNN7EXAMPLE")).toContain("api_key");
    });
  });

  describe("URL with token", () => {
    it("detects token in URL", () => {
      expect(hasPII("https://api.example.com/v1?token=abc123def456")).toBe(true);
    });
  });

  describe("clean text", () => {
    it("returns no PII for a normal incident report", () => {
      expect(
        hasPII(
          "The AI assistant gave incorrect medical advice about aspirin dosage. It recommended 5000mg, which is dangerous.",
        ),
      ).toBe(false);
    });
  });

  describe("maskPII", () => {
    it("returns original when no PII", () => {
      const r = maskPII("Clean text");
      expect(r.masked).toBe("Clean text");
      expect(r.piiFound).toBe(false);
      expect(r.redactedCount).toBe(0);
    });

    it("masks multiple PII types in one go", () => {
      const r = maskPII("Email a@b.com phone 05321234567 card 4111111111111111");
      expect(r.masked).not.toContain("a@b.com");
      expect(r.masked).not.toContain("4111111111111111");
      expect(r.piiFound).toBe(true);
      expect(r.detections.length).toBeGreaterThanOrEqual(2);
    });
  });
});
