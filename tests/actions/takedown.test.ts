import { describe, it, expect, vi, beforeEach } from "vitest";
import "../helpers/setup";
import {
  createMockSupabaseClient,
  createTestUser,
} from "../helpers/supabase-mock";

const mockSupabase = createMockSupabaseClient();
const mockAdminClient = createMockSupabaseClient();
const mockUser = createTestUser();

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn().mockResolvedValue(mockSupabase),
  createServerClient: vi.fn().mockResolvedValue(mockSupabase),
}));

vi.mock("@/lib/supabase/admin", () => ({
  createAdminClient: vi.fn().mockReturnValue(mockAdminClient),
}));

vi.mock("@/lib/auth/session", () => ({
  getCurrentUser: vi.fn().mockResolvedValue(null),
}));

vi.mock("@/lib/constants", () => ({
  APP_TAKEDOWN_EMAIL: "takedown@alparai.online",
}));

import {
  submitTakedownRequest,
  submitTakedown,
} from "@/actions/takedown";
import { getCurrentUser } from "@/lib/auth/session";

describe("submitTakedownRequest", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAdminClient.from.mockReturnValue({
      insert: vi.fn().mockResolvedValue({ data: null, error: null }),
      select: vi.fn().mockReturnValue({
        single: vi
          .fn()
          .mockResolvedValue({ data: null, error: null }),
      }),
      update: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ data: null, error: null }),
      }),
      delete: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          eq: vi
            .fn()
            .mockResolvedValue({ data: null, error: null }),
        }),
      }),
      upsert: vi.fn().mockResolvedValue({ data: null, error: null }),
    } as ReturnType<typeof mockAdminClient.from>);
  });

  it("submits a valid takedown request", async () => {
    const result = await submitTakedownRequest({
      target_url: "https://alparai.online/incidents/123",
      reason: "Copyright infringement on this content",
      details:
        "The content posted contains copyrighted material that belongs to our organization without permission.",
      requester_name: "Legal Team",
      requester_email: "legal@company.com",
      identity_proof_url: "https://proof.example.com/doc",
    });
    expect(result.ok).toBe(true);
    expect(result.message).toBe("Request received");
  });

  it("returns error for invalid form data", async () => {
    const result = await submitTakedownRequest({
      target_url: "not-a-url",
      reason: "x",
      details: "too short",
      requester_name: "A",
      requester_email: "bad",
      identity_proof_url: "not-url",
    });
    expect(result.ok).toBe(false);
    expect(result.error).toContain("Invalid");
  });

  it("returns error when database insert fails", async () => {
    mockAdminClient.from.mockReturnValue({
      insert: vi.fn().mockResolvedValue({
        data: null,
        error: { message: "DB error" },
      }),
      select: vi.fn().mockReturnValue({
        single: vi
          .fn()
          .mockResolvedValue({ data: null, error: null }),
      }),
      update: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ data: null, error: null }),
      }),
      delete: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          eq: vi
            .fn()
            .mockResolvedValue({ data: null, error: null }),
        }),
      }),
      upsert: vi.fn().mockResolvedValue({ data: null, error: null }),
    } as ReturnType<typeof mockAdminClient.from>);
    const result = await submitTakedownRequest({
      target_url: "https://alparai.online/incidents/123",
      reason: "Copyright infringement on this content",
      details:
        "The content posted contains copyrighted material that belongs to our organization without permission.",
      requester_name: "Legal Team",
      requester_email: "legal@company.com",
      identity_proof_url: "https://proof.example.com/doc",
    });
    expect(result.ok).toBe(false);
    expect(result.error).toContain("Failed");
  });
});

describe("submitTakedown", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getCurrentUser).mockResolvedValue(null);
    mockAdminClient.from.mockReturnValue({
      insert: vi.fn().mockResolvedValue({ data: null, error: null }),
      select: vi.fn().mockReturnValue({
        single: vi
          .fn()
          .mockResolvedValue({ data: null, error: null }),
      }),
      update: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ data: null, error: null }),
      }),
      delete: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          eq: vi
            .fn()
            .mockResolvedValue({ data: null, error: null }),
        }),
      }),
      upsert: vi.fn().mockResolvedValue({ data: null, error: null }),
    } as ReturnType<typeof mockAdminClient.from>);
  });

  it("submits inline takedown without auth", async () => {
    const result = await submitTakedown({
      incidentId: "inc-1",
      reason: "Defamatory content in report",
      details:
        "This incident report contains false and defamatory statements about our company.",
      contactEmail: "contact@company.com",
    });
    expect(result.ok).toBe(true);
    expect(result.message).toBe("Submitted");
  });

  it("submits inline takedown with authenticated user", async () => {
    vi.mocked(getCurrentUser).mockResolvedValueOnce(mockUser);
    const result = await submitTakedown({
      incidentId: "inc-1",
      reason: "Defamatory content in report",
      details:
        "This incident report contains false and defamatory statements about our company.",
      contactEmail: "contact@company.com",
    });
    expect(result.ok).toBe(true);
  });
});
