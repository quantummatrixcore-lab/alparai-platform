import { describe, it, expect, vi, beforeEach } from "vitest";
import "../helpers/setup";
import { createTestAdmin } from "../helpers/supabase-mock";

vi.hoisted(() => {
  vi.doMock("@/lib/supabase/admin", () => ({
    createAdminClient: vi.fn(),
  }));
  vi.doMock("@/lib/auth/session", () => ({
    requireAdmin: vi.fn(),
  }));
  vi.doMock("@/lib/utils/rate-limit", () => ({
    checkRateLimit: vi.fn(),
    RATE_LIMIT_KEYS: {
      export_request: "ratelimit:export_request",
    },
  }));
  vi.doMock("@/lib/utils/hash", () => ({
    hashIp: vi.fn().mockReturnValue("hashed-ip"),
  }));
  vi.doMock("@/lib/autopilot", () => ({
    withAutopilot: vi.fn(),
    exportDataPolicy: {},
  }));
  vi.doMock("next/headers", () => ({
    headers: vi.fn().mockResolvedValue({
      get: vi.fn().mockReturnValue("127.0.0.1"),
    }),
  }));
});

import { requireAdmin } from "@/lib/auth/session";
import { checkRateLimit } from "@/lib/utils/rate-limit";
import { withAutopilot } from "@/lib/autopilot";
import { exportIncidentsCSV, exportAuditLogCSV } from "@/actions/export";

let testAdmin: ReturnType<typeof createTestAdmin>;

beforeEach(() => {
  vi.clearAllMocks();
  testAdmin = createTestAdmin();
  vi.mocked(requireAdmin).mockResolvedValue(testAdmin as never);
  vi.mocked(checkRateLimit).mockResolvedValue({ ok: true, remaining: 4 });
  vi.mocked(withAutopilot).mockResolvedValue({
    kind: "ok",
    value: { csv: "id,title\n1,Test", rowCount: 1 },
  } as never);
});

describe("exportIncidentsCSV", () => {
  it("returns forbidden when not admin", async () => {
    vi.mocked(requireAdmin).mockResolvedValue(null as never);
    const result = await exportIncidentsCSV();
    expect(result.ok).toBe(false);
    expect(result.error).toBe("Forbidden");
  });

  it("returns error when rate limited", async () => {
    vi.mocked(checkRateLimit).mockResolvedValue({ ok: false, retryAfter: 60 });
    const result = await exportIncidentsCSV();
    expect(result.ok).toBe(false);
    expect(result.error).toContain("Too many exports");
  });

  it("returns CSV on success", async () => {
    const result = await exportIncidentsCSV();
    expect(result.ok).toBe(true);
    expect(result.csv).toContain("id,title");
  });

  it("returns error when autopilot exhausts", async () => {
    vi.mocked(withAutopilot).mockResolvedValue({ kind: "exhausted" } as never);
    const result = await exportIncidentsCSV();
    expect(result.ok).toBe(false);
    expect(result.error).toBe("Export failed");
  });
});

describe("exportAuditLogCSV", () => {
  it("returns forbidden when not admin", async () => {
    vi.mocked(requireAdmin).mockResolvedValue(null as never);
    const result = await exportAuditLogCSV();
    expect(result.ok).toBe(false);
    expect(result.error).toBe("Forbidden");
  });

  it("returns CSV on success", async () => {
    vi.mocked(withAutopilot).mockResolvedValue({
      kind: "ok",
      value: { csv: "id,actor_id\n1,admin", rowCount: 1 },
    } as never);
    const result = await exportAuditLogCSV();
    expect(result.ok).toBe(true);
  });
});
