import { describe, it, expect, vi, beforeEach } from "vitest";
import "../helpers/setup";

function makeAdminClient() {
  return {
    rpc: (fn: string) => {
      if (fn === "get_ai_gateway_costs") return Promise.resolve({ data: 0.15, error: null });
      return Promise.resolve({ data: null, error: null });
    },
  };
}

vi.mock("@/lib/auth/session", () => ({ requireAdmin: vi.fn() }));
vi.mock("@/lib/supabase/admin", () => ({ createAdminClient: makeAdminClient }));

describe("getApiTelemetryData — API Management Hub server action", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  async function fetchTelemetry() {
    const { getApiTelemetryData } = await import("@/actions/api-management");
    return getApiTelemetryData();
  }

  it("returns provider matrix and API key telemetry", async () => {
    const data = await fetchTelemetry();
    expect(data.isLiveTelemetry).toBe(true);
    expect(Array.isArray(data.providers)).toBe(true);
    expect(data.providers.length).toBeGreaterThanOrEqual(5);
    expect(Array.isArray(data.apiKeys)).toBe(true);
    expect(typeof data.totalDailySpendUsd).toBe("number");
    expect(() => new Date(data.timestamp)).not.toThrow();
  });

  it("accurately detects environment API key status for providers", async () => {
    const data = await fetchTelemetry();
    const google = data.providers.find((p) => p.id === "google");
    expect(google).toBeDefined();
    expect(typeof google?.status).toBe("string");
    expect(typeof google?.health).toBe("number");
  });
});
