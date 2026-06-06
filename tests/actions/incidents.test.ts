import { describe, it, expect, vi, beforeEach } from "vitest";
import "../helpers/setup";
import {
  createMockSupabaseClient,
  createTestUser,
} from "../helpers/supabase-mock";

vi.hoisted(() => {
  vi.doMock("@/lib/supabase/server", () => ({
    createClient: vi.fn(),
    createServerClient: vi.fn(),
  }));
  vi.doMock("@/lib/supabase/admin", () => ({
    createAdminClient: vi.fn(),
  }));
  vi.doMock("@/lib/auth/session", () => ({
    getCurrentUser: vi.fn(),
  }));
  vi.doMock("@/lib/utils/rate-limit", () => ({
    checkRateLimit: vi.fn(),
    RATE_LIMIT_KEYS: {
      incident_submission: "ratelimit:incident_submission",
      suggestion_submission: "ratelimit:suggestion_submission",
      auth_signin: "ratelimit:auth_signin",
      api_general: "ratelimit:api_general",
    },
  }));
  vi.doMock("@/lib/pii/guardian", () => ({
    maskPII: vi.fn(),
  }));
});

import { createClient, createServerClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/session";
import { checkRateLimit } from "@/lib/utils/rate-limit";
import { maskPII } from "@/lib/pii/guardian";
import { submitIncident, voteOnIncident } from "@/actions/incidents";

let mockSupabase: ReturnType<typeof createMockSupabaseClient>;
let mockAdminClient: ReturnType<typeof createMockSupabaseClient>;
let mockUser: ReturnType<typeof createTestUser>;

beforeEach(() => {
  vi.clearAllMocks();
  mockSupabase = createMockSupabaseClient();
  mockAdminClient = createMockSupabaseClient();
  mockUser = createTestUser();
  vi.mocked(createClient).mockResolvedValue(mockSupabase as never);
  vi.mocked(createServerClient).mockResolvedValue(mockSupabase as never);
  vi.mocked(createAdminClient).mockReturnValue(mockAdminClient as never);
  vi.mocked(getCurrentUser).mockResolvedValue(mockUser as never);
  vi.mocked(checkRateLimit).mockResolvedValue({ ok: true, remaining: 4 });
  vi.mocked(maskPII).mockImplementation((input: string) => ({
    masked: input,
    detections: [],
    piiFound: false,
    redactedCount: 0,
    detectedTypes: [],
  }));
});

function buildFormData(overrides: Record<string, string> = {}): FormData {
  const fd = new FormData();
  fd.set("title", "A valid incident title here");
  fd.set(
    "description",
    "This is a detailed description of the AI incident that happened recently with enough detail"
  );
  fd.set("category", "hallucination");
  fd.set("severity", "medium");
  fd.set("provider_id", "");
  fd.set("model_id", "");
  fd.set("incident_date", "2026-01-15");
  fd.set("consent_truth", "on");
  fd.set("consent_anonymous", "on");
  fd.set("consent_age", "on");
  fd.set("consent_terms", "on");
  for (const [key, value] of Object.entries(overrides)) {
    fd.set(key, value);
  }
  return fd;
}

describe("submitIncident", () => {
  beforeEach(() => {
    vi.mocked(getCurrentUser).mockResolvedValue(mockUser);
    vi.mocked(checkRateLimit).mockResolvedValue({ ok: true, remaining: 4 });
    vi.mocked(maskPII).mockImplementation((input: string) => ({
      masked: input,
      detections: [],
      piiFound: false,
      redactedCount: 0,
      detectedTypes: [],
    }));
    mockSupabase.from.mockReturnValue({
      insert: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi
            .fn()
            .mockResolvedValue({ data: { id: "inc-123" }, error: null }),
        }),
      }),
      select: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({ data: null, error: null }),
      }),
    } as ReturnType<typeof mockSupabase.from>);
  });

  it("returns error when user is not authenticated", async () => {
    vi.mocked(getCurrentUser).mockResolvedValueOnce(null);
    const result = await submitIncident({ ok: false }, buildFormData());
    expect(result.ok).toBe(false);
    expect(result.formError).toContain("signed in");
  });

  it("returns error when rate limited", async () => {
    vi.mocked(checkRateLimit).mockResolvedValueOnce({
      ok: false,
      retryAfter: 300,
    });
    const result = await submitIncident({ ok: false }, buildFormData());
    expect(result.ok).toBe(false);
    expect(result.formError).toContain("Too many");
    expect(result.formError).toContain("300");
  });

  it("returns error when consents are not all accepted", async () => {
    const fd = buildFormData();
    fd.delete("consent_truth");
    const result = await submitIncident({ ok: false }, fd);
    expect(result.ok).toBe(false);
    expect(result.formError).toContain("consents");
  });

  it("returns field errors for invalid title (too short)", async () => {
    const fd = buildFormData({ title: "short" });
    const result = await submitIncident({ ok: false }, fd);
    expect(result.ok).toBe(false);
    expect(result.fieldErrors).toBeDefined();
  });

  it("returns field errors for invalid description (too short)", async () => {
    const fd = buildFormData({ description: "too short" });
    const result = await submitIncident({ ok: false }, fd);
    expect(result.ok).toBe(false);
    expect(result.fieldErrors).toBeDefined();
  });

  it("successfully submits a valid incident", async () => {
    const result = await submitIncident({ ok: false }, buildFormData());
    expect(result.ok).toBe(true);
    expect(result.incidentId).toBe("inc-123");
  });

  it("calls maskPII on title and description", async () => {
    await submitIncident({ ok: false }, buildFormData());
    expect(maskPII).toHaveBeenCalledWith("A valid incident title here");
    expect(maskPII).toHaveBeenCalledWith(
      expect.stringContaining("detailed description")
    );
  });

  it("detects PII in masked fields", async () => {
    vi.mocked(maskPII).mockImplementation((input: string) => ({
      masked: input.replace("test@email.com", "[REDACTED-EMAIL]"),
      detections: [{ type: "email", count: 1, samples: ["test…om"] }],
      piiFound: true,
      redactedCount: 1,
      detectedTypes: ["email"],
    }));
    const fd = buildFormData({
      title: "Report about test@email.com issue here",
    });
    const result = await submitIncident({ ok: false }, fd);
    expect(result.ok).toBe(true);
    expect(maskPII).toHaveBeenCalled();
  });

  it("returns error when database insert fails", async () => {
    mockSupabase.from.mockReturnValue({
      insert: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi
            .fn()
            .mockResolvedValue({ data: null, error: { message: "DB error" } }),
        }),
      }),
      select: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({ data: null, error: null }),
      }),
    } as ReturnType<typeof mockSupabase.from>);
    const result = await submitIncident({ ok: false }, buildFormData());
    expect(result.ok).toBe(false);
    expect(result.formError).toContain("Failed");
  });

  it("handles anonymous submission flag", async () => {
    const fd = buildFormData();
    fd.set("is_anonymous", "on");
    const result = await submitIncident({ ok: false }, fd);
    expect(result.ok).toBe(true);
  });

  it("passes empty provider_id as null to schema", async () => {
    const fd = buildFormData({ provider_id: "" });
    const result = await submitIncident({ ok: false }, fd);
    expect(result.ok).toBe(true);
  });
});

describe("voteOnIncident", () => {
  beforeEach(() => {
    vi.mocked(getCurrentUser).mockResolvedValue(mockUser);

    const mockDeleteInnerEq = vi
      .fn()
      .mockResolvedValue({ data: null, error: null });
    const mockDeleteOuterEq = vi.fn().mockReturnValue({
      eq: mockDeleteInnerEq,
    });
    const mockMaybeSingle = vi
      .fn()
      .mockResolvedValue({ data: null, error: null });
    const mockEqInner = vi.fn().mockReturnValue({
      maybeSingle: mockMaybeSingle,
    });
    const mockEqOuter = vi.fn().mockReturnValue({
      eq: mockEqInner,
    });
    const mockSelect = vi.fn().mockReturnValue({
      eq: mockEqOuter,
    });

    mockAdminClient.from.mockReturnValue({
      select: mockSelect,
      delete: vi.fn().mockReturnValue({ eq: mockDeleteOuterEq }),
      upsert: vi.fn().mockResolvedValue({ data: null, error: null }),
      insert: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi
            .fn()
            .mockResolvedValue({ data: null, error: null }),
        }),
      }),
      update: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ data: null, error: null }),
      }),
    } as ReturnType<typeof mockAdminClient.from>);
  });

  it("returns error when not authenticated", async () => {
    vi.mocked(getCurrentUser).mockResolvedValueOnce(null);
    const result = await voteOnIncident({
      incidentId: "inc-1",
      value: 1,
    });
    expect(result).toEqual({ ok: false, error: "Sign in to vote" });
  });

  it("successfully upvotes an incident", async () => {
    const result = await voteOnIncident({
      incidentId: "inc-1",
      value: 1,
    });
    expect(result).toEqual({ ok: true });
    expect(mockAdminClient.from).toHaveBeenCalledWith("incident_votes");
  });

  it("successfully downvotes an incident", async () => {
    const result = await voteOnIncident({
      incidentId: "inc-1",
      value: -1,
    });
    expect(result).toEqual({ ok: true });
  });

  it("removes vote when value is 0", async () => {
    const result = await voteOnIncident({
      incidentId: "inc-1",
      value: 0,
    });
    expect(result).toEqual({ ok: true });
  });

  it("toggles vote when same value already exists", async () => {
    const mockMaybeSingle = vi
      .fn()
      .mockResolvedValue({ data: { value: 1 }, error: null });
    const mockEqInner = vi.fn().mockReturnValue({
      maybeSingle: mockMaybeSingle,
    });
    const mockEqOuter = vi.fn().mockReturnValue({
      eq: mockEqInner,
    });
    const mockSelect = vi.fn().mockReturnValue({
      eq: mockEqOuter,
    });
    const mockDeleteInnerEq = vi
      .fn()
      .mockResolvedValue({ data: null, error: null });
    const mockDeleteOuterEq = vi.fn().mockReturnValue({
      eq: mockDeleteInnerEq,
    });

    mockAdminClient.from.mockReturnValue({
      select: mockSelect,
      delete: vi.fn().mockReturnValue({ eq: mockDeleteOuterEq }),
      upsert: vi.fn().mockResolvedValue({ data: null, error: null }),
      insert: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi
            .fn()
            .mockResolvedValue({ data: null, error: null }),
        }),
      }),
      update: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ data: null, error: null }),
      }),
    } as ReturnType<typeof mockAdminClient.from>);

    const result = await voteOnIncident({
      incidentId: "inc-1",
      value: 1,
    });
    expect(result).toEqual({ ok: true });
  });
});
