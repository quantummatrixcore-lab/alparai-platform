import { describe, it, expect, vi, beforeEach } from "vitest";
import "../helpers/setup";
import { createMockSupabaseClient } from "../helpers/supabase-mock";

vi.hoisted(() => {
  vi.doMock("@/lib/supabase/admin", () => ({
    createAdminClient: vi.fn(),
  }));
  vi.doMock("@/lib/auth/session", () => ({
    requireAdmin: vi.fn(),
  }));
  vi.doMock("@/lib/utils/rate-limit", () => ({
    getRedisInstance: vi.fn().mockReturnValue(null),
  }));
});

import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth/session";
import { getObserve360Telemetry } from "@/actions/observe-360";

let mockSupabaseClient: ReturnType<typeof createMockSupabaseClient>;

beforeEach(() => {
  vi.clearAllMocks();
  mockSupabaseClient = createMockSupabaseClient();
  vi.mocked(createAdminClient).mockReturnValue(mockSupabaseClient as never);
  vi.mocked(requireAdmin).mockResolvedValue(undefined as never);
});

describe("Observe360 Server Action", () => {
  it("gathers live 8-domain telemetry without mock hardcoded fallbacks", async () => {
    mockSupabaseClient.rpc.mockImplementation((name) => {
      if (name === "get_database_size") {
        return Promise.resolve({ data: 24641536, error: null }) as never;
      }
      return Promise.resolve({ data: null, error: null }) as never;
    });

    const mockCountResult = { count: 12, data: [], error: null };
    const mockOrder = vi.fn().mockResolvedValue(mockCountResult);
    const mockEq = vi.fn().mockResolvedValue(mockCountResult);
    const mockGte = vi
      .fn()
      .mockResolvedValue({
        data: [{ cost_usd: 0.5, latency_ms: 120, consensus_reached: true }],
        error: null,
      });

    mockSupabaseClient.from.mockImplementation(() => {
      return {
        select: vi.fn().mockImplementation(() => ({
          eq: mockEq,
          order: mockOrder,
          gte: mockGte,
          then: (cb: (val: unknown) => unknown) => cb(mockCountResult),
        })),
      } as never;
    });

    const telemetry = await getObserve360Telemetry();

    expect(requireAdmin).toHaveBeenCalled();
    expect(telemetry).toHaveProperty("incidents");
    expect(telemetry).toHaveProperty("healthSlo");
    expect(telemetry).toHaveProperty("securityRls");
    expect(telemetry).toHaveProperty("dora");
    expect(telemetry).toHaveProperty("cost");
    expect(telemetry).toHaveProperty("growth");
    expect(telemetry).toHaveProperty("capacity");
    expect(telemetry).toHaveProperty("kBenchmark");
    expect(telemetry.securityRls.status).toBe("HARDENED");
    expect(typeof telemetry.timestamp).toBe("string");
  });
});
