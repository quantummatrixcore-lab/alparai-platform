import { describe, it, expect, vi, beforeEach } from "vitest";
import "../helpers/setup";
import {
  createMockSupabaseClient,
  createTestModerator,
} from "../helpers/supabase-mock";

const mockAdminClient = createMockSupabaseClient();
const mockModerator = createTestModerator();

vi.mock("@/lib/supabase/admin", () => ({
  createAdminClient: vi.fn().mockReturnValue(mockAdminClient),
}));

vi.mock("@/lib/auth/session", () => ({
  requireModerator: vi.fn().mockResolvedValue(mockModerator),
}));

import {
  moderateIncident,
  reviewTakedown,
  setUserRole,
} from "@/actions/admin";
import { requireModerator } from "@/lib/auth/session";

describe("moderateIncident", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(requireModerator).mockResolvedValue(mockModerator);

    const mockUpdateEq = vi
      .fn()
      .mockResolvedValue({ data: null, error: null });
    mockAdminClient.from.mockReturnValue({
      update: vi.fn().mockReturnValue({ eq: mockUpdateEq }),
      select: vi.fn().mockReturnValue({
        single: vi
          .fn()
          .mockResolvedValue({ data: null, error: null }),
      }),
      insert: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi
            .fn()
            .mockResolvedValue({ data: null, error: null }),
        }),
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

  it("approves an incident successfully", async () => {
    const result = await moderateIncident({
      incidentId: "inc-1",
      decision: "approve",
    });
    expect(result.ok).toBe(true);
    expect(mockAdminClient.from).toHaveBeenCalledWith("incidents");
  });

  it("rejects an incident successfully", async () => {
    const result = await moderateIncident({
      incidentId: "inc-1",
      decision: "reject",
      moderationNote: "Does not meet guidelines",
    });
    expect(result.ok).toBe(true);
  });

  it("returns error when not a moderator", async () => {
    vi.mocked(requireModerator).mockRejectedValueOnce(new Error("FORBIDDEN"));
    const result = await moderateIncident({
      incidentId: "inc-1",
      decision: "approve",
    });
    expect(result.ok).toBe(false);
    expect(result.error).toBe("Forbidden");
  });

  it("returns error for invalid input", async () => {
    const result = await moderateIncident({
      incidentId: "",
      decision: "approve",
    });
    expect(result.ok).toBe(false);
    expect(result.error).toBe("Invalid input");
  });
});

describe("reviewTakedown", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(requireModerator).mockResolvedValue(mockModerator);

    const mockUpdateEq = vi
      .fn()
      .mockResolvedValue({ data: null, error: null });
    mockAdminClient.from.mockReturnValue({
      update: vi.fn().mockReturnValue({ eq: mockUpdateEq }),
      select: vi.fn().mockReturnValue({
        single: vi
          .fn()
          .mockResolvedValue({ data: null, error: null }),
      }),
      insert: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi
            .fn()
            .mockResolvedValue({ data: null, error: null }),
        }),
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

  it("approves a takedown request", async () => {
    const result = await reviewTakedown({
      id: "td-1",
      decision: "approve",
    });
    expect(result.ok).toBe(true);
    expect(mockAdminClient.from).toHaveBeenCalledWith("takedown_requests");
  });

  it("rejects a takedown request", async () => {
    const result = await reviewTakedown({
      id: "td-1",
      decision: "reject",
    });
    expect(result.ok).toBe(true);
  });
});

describe("setUserRole", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(requireModerator).mockResolvedValue(mockModerator);

    const mockUpdateEq = vi
      .fn()
      .mockResolvedValue({ data: null, error: null });
    mockAdminClient.from.mockReturnValue({
      update: vi.fn().mockReturnValue({ eq: mockUpdateEq }),
      select: vi.fn().mockReturnValue({
        single: vi
          .fn()
          .mockResolvedValue({ data: null, error: null }),
      }),
      insert: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi
            .fn()
            .mockResolvedValue({ data: null, error: null }),
        }),
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

  it("sets user role successfully", async () => {
    const result = await setUserRole({
      userId: "user-1",
      role: "moderator",
    });
    expect(result.ok).toBe(true);
    expect(mockAdminClient.from).toHaveBeenCalledWith("users");
  });

  it("returns error for invalid role input", async () => {
    const result = await setUserRole({
      userId: "",
      role: "moderator",
    });
    expect(result.ok).toBe(false);
    expect(result.error).toBe("Invalid input");
  });
});
