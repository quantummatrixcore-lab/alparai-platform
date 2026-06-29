import { describe, it, expect, vi, beforeEach } from "vitest";
import "../helpers/setup";

vi.mock("resend", () => ({
  Resend: vi.fn().mockImplementation(() => ({
    emails: {
      send: vi.fn().mockResolvedValue({ id: "email-123" }),
    },
  })),
}));

vi.mock("@/lib/supabase/admin", () => ({
  createAdminClient: () => ({
    from: () => ({
      upsert: () => ({
        select: () => ({ single: () => Promise.resolve({ data: { id: "mock" }, error: null }) }),
      }),
    }),
  }),
}));

vi.mock("@/lib/constants", () => ({
  APP_EMAIL: "hello@alparai.com",
}));

import { submitExpert } from "@/actions/experts";

function buildExpertForm(overrides: Record<string, string> = {}): FormData {
  const fd = new FormData();
  fd.set("name", "John Expert");
  fd.set("titleInstitution", "Senior Professor, Stanford University");
  fd.set("expertise", "AI Safety and Alignment Research");
  fd.set("linkedinUrl", "https://linkedin.com/in/johnexpert");
  for (const [key, value] of Object.entries(overrides)) {
    fd.set(key, value);
  }
  return fd;
}

describe("submitExpert", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("submits successfully with valid data", async () => {
    const result = await submitExpert({ ok: false }, buildExpertForm());
    expect(result.ok).toBe(true);
  });

  it("returns field errors for short name", async () => {
    const fd = buildExpertForm({ name: "A" });
    const result = await submitExpert({ ok: false }, fd);
    expect(result.ok).toBe(false);
    expect(result.fieldErrors).toBeDefined();
    expect(result.fieldErrors?.name).toBeDefined();
  });

  it("returns field errors for short titleInstitution", async () => {
    const fd = buildExpertForm({ titleInstitution: "B" });
    const result = await submitExpert({ ok: false }, fd);
    expect(result.ok).toBe(false);
    expect(result.fieldErrors).toBeDefined();
    expect(result.fieldErrors?.titleInstitution).toBeDefined();
  });

  it("returns field errors for short expertise", async () => {
    const fd = buildExpertForm({ expertise: "C" });
    const result = await submitExpert({ ok: false }, fd);
    expect(result.ok).toBe(false);
    expect(result.fieldErrors).toBeDefined();
    expect(result.fieldErrors?.expertise).toBeDefined();
  });

  it("returns field errors for invalid linkedinUrl", async () => {
    const fd = buildExpertForm({ linkedinUrl: "not-a-url" });
    const result = await submitExpert({ ok: false }, fd);
    expect(result.ok).toBe(false);
    expect(result.fieldErrors).toBeDefined();
    expect(result.fieldErrors?.linkedinUrl).toBeDefined();
  });
});
