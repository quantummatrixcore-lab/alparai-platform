import { describe, it, expect, vi, beforeEach } from "vitest";
import "../helpers/setup";

const mockInsert = vi.fn().mockResolvedValue({ error: null });
const mockSelect = vi.fn().mockImplementation(() => ({
  eq: vi.fn().mockImplementation(() => ({
    maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
  })),
}));

vi.mock("@/lib/supabase/admin", () => ({
  createAdminClient: () => ({
    from: vi.fn().mockImplementation((table: string) => {
      if (table === "email_preferences") {
        return {
          select: mockSelect,
          insert: mockInsert,
        };
      }
      return {
        upsert: () => ({
          select: () => ({ single: () => Promise.resolve({ data: { id: "mock" }, error: null }) }),
        }),
      };
    }),
  }),
}));

import { joinWaitlist } from "@/actions/waitlist";

function buildWaitlistForm(overrides: Record<string, string> = {}): FormData {
  const fd = new FormData();
  fd.set("email", "waitlist@example.com");
  for (const [key, value] of Object.entries(overrides)) {
    fd.set(key, value);
  }
  return fd;
}

describe("joinWaitlist", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("submits successfully with valid email", async () => {
    const result = await joinWaitlist({ ok: false }, buildWaitlistForm());
    expect(result.ok).toBe(true);
  });

  it("returns field errors for invalid email", async () => {
    const fd = buildWaitlistForm({ email: "invalid-email" });
    const result = await joinWaitlist({ ok: false }, fd);
    expect(result.ok).toBe(false);
    expect(result.fieldErrors).toBeDefined();
    expect(result.fieldErrors?.email).toBeDefined();
  });
});
