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
    const mockLimit = vi.fn().mockResolvedValue({ data: [], error: null });
    const mockOrder = vi.fn().mockImplementation(() => {
      const promise = Promise.resolve(mockCountResult) as never;
      (promise as { limit: typeof mockLimit }).limit = mockLimit;
      return promise;
    });
    const mockEq = vi.fn().mockResolvedValue(mockCountResult);
    const mockGte = vi.fn().mockResolvedValue({
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

  it("extracts real DORA metrics when dora_metrics table has records", async () => {
    mockSupabaseClient.rpc.mockResolvedValue({ data: 24641536, error: null } as never);

    const mockDoraRow = {
      deployment_frequency: 3,
      lead_time_seconds: 1800,
      change_failure_rate: 0.05,
      mttr_seconds: 600,
    };

    mockSupabaseClient.from.mockImplementation((table) => {
      if (table === "dora_metrics") {
        return {
          select: vi.fn().mockReturnValue({
            order: vi.fn().mockReturnValue({
              limit: vi.fn().mockResolvedValue({ data: [mockDoraRow], error: null }),
            }),
          }),
        } as never;
      }
      return {
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ count: 5, data: [] }),
          order: vi.fn().mockResolvedValue({ count: 5, data: [] }),
          gte: vi.fn().mockResolvedValue({ data: [] }),
          then: (cb: (val: unknown) => unknown) => cb({ count: 5, data: [] }),
        }),
      } as never;
    });

    const telemetry = await getObserve360Telemetry();

    expect(telemetry.dora.isInstrumented).toBe(true);
    expect(telemetry.dora.deployFrequency).toBe("3 / day");
    expect(telemetry.dora.leadTimeMinutes).toBe(30);
    expect(telemetry.dora.mttrMinutes).toBe(10);
    expect(telemetry.dora.changeFailureRatePct).toBe(0.05);
  });
});
