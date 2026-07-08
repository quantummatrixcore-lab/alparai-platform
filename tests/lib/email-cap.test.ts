import { describe, it, expect, vi, beforeEach } from "vitest";
import { checkEmailCapAndLog } from "@/lib/email/cap";

const mockSelect = vi.fn();
const mockInsert = vi.fn();

vi.mock("@/lib/supabase/admin", () => ({
  createAdminClient: () => ({
    from: vi.fn().mockImplementation((table: string) => {
      if (table === "email_sent_logs") {
        return {
          select: mockSelect,
          insert: mockInsert,
        };
      }
      return {};
    }),
  }),
}));

describe("checkEmailCapAndLog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return true and log the send if count is less than 3", async () => {
    // Mock select returning count = 1
    mockSelect.mockReturnValue({
      eq: vi.fn().mockReturnValue({
        gte: vi.fn().mockResolvedValue({ count: 1, error: null }),
      }),
    });
    // Mock insert returning success
    mockInsert.mockResolvedValue({ error: null });

    const result = await checkEmailCapAndLog("test@example.com", "test_type");
    expect(result).toBe(true);
    expect(mockInsert).toHaveBeenCalled();
  });

  it("should return false and skip logging if count is 3 or more", async () => {
    // Mock select returning count = 3
    mockSelect.mockReturnValue({
      eq: vi.fn().mockReturnValue({
        gte: vi.fn().mockResolvedValue({ count: 3, error: null }),
      }),
    });

    const result = await checkEmailCapAndLog("test@example.com", "test_type");
    expect(result).toBe(false);
    expect(mockInsert).not.toHaveBeenCalled();
  });

  it("should return true (fail-open) if database query fails", async () => {
    // Mock select returning error
    mockSelect.mockReturnValue({
      eq: vi.fn().mockReturnValue({
        gte: vi.fn().mockResolvedValue({ count: null, error: { message: "DB Error" } }),
      }),
    });

    const result = await checkEmailCapAndLog("test@example.com", "test_type");
    expect(result).toBe(true);
  });
});
