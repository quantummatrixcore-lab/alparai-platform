import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getWhistleblowerConfirmationEmail, getAdminNotificationEmail } from "@/emails/templates";

describe("Email Templates", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("getWhistleblowerConfirmationEmail", () => {
    const defaultParams = {
      title: "Test Incident Title",
      category: "bias",
      severity: "high",
      date: "2026-06-24",
      locale: "en" as const,
    };

    it("should generate English email template with correct values", () => {
      const html = getWhistleblowerConfirmationEmail(defaultParams);

      expect(html).toContain("Incident Report Received — ALPAR AI");
      expect(html).toContain("Hello Whistleblower,");
      expect(html).toContain("Test Incident Title");
      expect(html).toContain("bias");
      expect(html).toContain("high");
      expect(html).toContain("2026-06-24");
      expect(html).toContain("This is an automated email.");
      expect(html).toContain("color: #f97316"); // high severity color
    });

    it("should generate Turkish email template with correct values", () => {
      const html = getWhistleblowerConfirmationEmail({
        ...defaultParams,
        locale: "tr",
      });

      expect(html).toContain("Olay Raporunuz Alındı — ALPAR AI");
      expect(html).toContain("Merhaba Whistleblower,");
      expect(html).toContain("Test Incident Title");
      expect(html).toContain("bias");
      expect(html).toContain("high");
      expect(html).toContain("2026-06-24");
      expect(html).toContain("Bu e-posta otomatik olarak gönderilmiştir.");
    });

    it("should apply correct severity colors for critical severity", () => {
      const html = getWhistleblowerConfirmationEmail({
        ...defaultParams,
        severity: "critical",
      });
      expect(html).toContain("color: #ef4444");
    });

    it("should apply correct severity colors for medium severity", () => {
      const html = getWhistleblowerConfirmationEmail({
        ...defaultParams,
        severity: "medium",
      });
      expect(html).toContain("color: #eab308");
    });

    it("should apply correct severity colors for low/other severity", () => {
      const html = getWhistleblowerConfirmationEmail({
        ...defaultParams,
        severity: "low",
      });
      expect(html).toContain("color: #3b82f6");
    });
  });

  describe("getAdminNotificationEmail", () => {
    const adminParams = {
      id: "inc-12345",
      title: "Critical Model Failure",
      category: "security",
      severity: "critical",
    };

    it("should generate admin notification template with correct values", () => {
      process.env.NEXT_PUBLIC_APP_URL = "https://custom-app.com";
      const html = getAdminNotificationEmail(adminParams);

      expect(html).toContain("ALERT: NEW INCIDENT SUBMITTED");
      expect(html).toContain("Critical Model Failure");
      expect(html).toContain("inc-12345");
      expect(html).toContain("security");
      expect(html).toContain("critical");
      expect(html).toContain("color: #ef4444"); // critical severity color
      expect(html).toContain("https://custom-app.com/admin/incidents");
    });

    it("should fallback to default app URL if env is missing", () => {
      delete process.env.NEXT_PUBLIC_APP_URL;
      const html = getAdminNotificationEmail(adminParams);

      expect(html).toContain("https://alparai.com/admin/incidents");
    });

    it("should apply correct severity colors for high severity in admin email", () => {
      const html = getAdminNotificationEmail({
        ...adminParams,
        severity: "high",
      });
      expect(html).toContain("color: #f97316");
    });

    it("should apply correct severity colors for medium severity in admin email", () => {
      const html = getAdminNotificationEmail({
        ...adminParams,
        severity: "medium",
      });
      expect(html).toContain("color: #eab308");
    });

    it("should apply correct severity colors for low severity in admin email", () => {
      const html = getAdminNotificationEmail({
        ...adminParams,
        severity: "low",
      });
      expect(html).toContain("color: #3b82f6");
    });
  });
});
