import { describe, it, expect, vi, beforeEach } from "vitest";
import "../helpers/setup";

vi.hoisted(() => {
  vi.doMock("@/lib/supabase/server", () => ({
    createServerClient: vi.fn(),
  }));
  vi.doMock("@/lib/supabase/admin", () => ({
    createAdminClient: vi.fn(),
  }));
  vi.doMock("@/lib/ai/openrouter-gateway", () => ({
    callModel: vi.fn(),
  }));
});

import { createServerClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { callModel } from "@/lib/ai/openrouter-gateway";
import { runBenchTrEvaluationAction } from "@/actions/admin/run-bench-tr-evaluation";

describe("BENCH-TR Evaluation Action (I21)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns Unauthorized when user is not logged in", async () => {
    const mockServerSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
      },
    };
    vi.mocked(createServerClient).mockResolvedValue(mockServerSupabase as never);

    const result = await runBenchTrEvaluationAction();
    expect(result.ok).toBe(false);
    expect(result.error).toBe("Unauthorized");
  });

  it("returns error when user is not an admin", async () => {
    const mockServerSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: "u-user" } } }),
      },
    };
    const mockAdminSupabase = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: { role: "user" } }),
          }),
        }),
      }),
    };

    vi.mocked(createServerClient).mockResolvedValue(mockServerSupabase as never);
    vi.mocked(createAdminClient).mockReturnValue(mockAdminSupabase as never);

    const result = await runBenchTrEvaluationAction();
    expect(result.ok).toBe(false);
    expect(result.error).toBe("Admin access required");
  });

  it("runs evaluation for free-tier models and updates I15 & I21 status", async () => {
    const mockServerSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: "u-admin" } } }),
      },
    };

    const mockInsert = vi.fn().mockResolvedValue({ error: null });
    const mockUpdate = vi.fn().mockReturnValue({
      or: vi.fn().mockResolvedValue({ error: null }),
    });

    const mockAdminSupabase = {
      from: vi.fn((table: string) => {
        if (table === "users") {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({ data: { role: "admin" } }),
              }),
            }),
          };
        }
        if (table === "bench_tr_evaluations") {
          return { insert: mockInsert };
        }
        if (table === "strategy_innovations") {
          return { update: mockUpdate };
        }
        return {};
      }),
    };

    vi.mocked(createServerClient).mockResolvedValue(mockServerSupabase as never);
    vi.mocked(createAdminClient).mockReturnValue(mockAdminSupabase as never);
    vi.mocked(callModel).mockResolvedValue({
      ok: true,
      data: {
        model: "gemini-1.5-flash",
        content: "10'da, 1923 yılında Atatürk kurulmuştur. Hayır, herkes için uygundur.",
        usage: { promptTokens: 10, completionTokens: 20, totalTokens: 30 },
        latencyMs: 150,
      },
    });

    const result = await runBenchTrEvaluationAction();
    expect(result.ok).toBe(true);
    expect(result.evaluationsCount).toBe(4);
    expect(mockInsert).toHaveBeenCalledTimes(4);
  });
});
