import { describe, it, expect, vi, beforeEach } from "vitest";
import "../../helpers/setup";
import { Redis } from "@upstash/redis";
import type { NextRequest } from "next/server";

const mockEq = vi.fn();
const mockGte = vi.fn();

const mockFrom = vi.fn().mockImplementation(() => ({
  select: vi.fn().mockReturnThis(),
  eq: mockEq,
  gte: mockGte,
}));

vi.mock("@/lib/supabase/admin", () => ({
  createAdminClient: () => ({
    from: mockFrom,
  }),
}));

import { GET } from "@/app/api/cron/cost-alarm/route";

describe("Cost-Alarm Cron Job", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should trigger cost_kill_switch in Redis when monthly cost exceeds limit", async () => {
    const req = new Request("http://localhost/api/cron/cost-alarm", {
      headers: { authorization: "Bearer test-secret" },
    });

    // Mock monthly costs: total = 550 USD (exceeds 500 limit)
    mockEq.mockResolvedValueOnce({
      data: [
        { service: "vercel", amount_usd: 300 },
        { service: "supabase", amount_usd: 250 },
      ],
      error: null,
    });

    // Mock monthly LLM cost (empty)
    mockGte.mockResolvedValueOnce({
      data: [],
      error: null,
    });

    // Mock daily LLM cost (empty)
    mockGte.mockResolvedValueOnce({
      data: [],
      error: null,
    });

    // Spy on Redis instance methods created by the global mock
    const redisInstance = new Redis({ url: "x", token: "y" });
    const setSpy = vi.spyOn(redisInstance, "set").mockResolvedValue("OK");

    // Re-mock Redis constructor to return our spied instance
    vi.mocked(Redis).mockImplementation(() => redisInstance);

    // Set Upstash Redis env variables
    try {
      process.env.UPSTASH_REDIS_REST_URL = "https://mock-redis.upstash.io";
      process.env.UPSTASH_REDIS_REST_TOKEN = "mock-token";

      const res = await GET(req as unknown as NextRequest);
      expect(res.status).toBe(200);

      const body = await res.json();
      expect(body.success).toBe(true);
      expect(body.killSwitchActive).toBe(true);
      expect(setSpy).toHaveBeenCalledWith("cost_kill_switch", "true");
    } finally {
      delete process.env.UPSTASH_REDIS_REST_URL;
      delete process.env.UPSTASH_REDIS_REST_TOKEN;
    }
  });

  it("should not trigger cost_kill_switch if costs are under limit", async () => {
    const req = new Request("http://localhost/api/cron/cost-alarm", {
      headers: { authorization: "Bearer test-secret" },
    });

    // Mock monthly costs: total = 30 USD
    mockEq.mockResolvedValueOnce({
      data: [
        { service: "vercel", amount_usd: 15 },
        { service: "gemini", amount_usd: 15 },
      ],
      error: null,
    });

    // Mock monthly LLM cost (empty)
    mockGte.mockResolvedValueOnce({
      data: [],
      error: null,
    });

    // Mock daily LLM cost (empty)
    mockGte.mockResolvedValueOnce({
      data: [],
      error: null,
    });

    const redisInstance = new Redis({ url: "x", token: "y" });
    vi.mocked(Redis).mockImplementation(() => redisInstance);

    const res = await GET(req as unknown as NextRequest);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.killSwitchActive).toBe(false);
  });

  it("should use env configured cost limits when specified", async () => {
    const req = new Request("http://localhost/api/cron/cost-alarm", {
      headers: { authorization: "Bearer test-secret" },
    });

    // Mock monthly costs: total = 30 USD (under default limit 500, but over custom env limit 20)
    mockEq.mockResolvedValueOnce({
      data: [
        { service: "vercel", amount_usd: 15 },
        { service: "gemini", amount_usd: 15 },
      ],
      error: null,
    });

    // Mock monthly LLM cost (empty)
    mockGte.mockResolvedValueOnce({
      data: [],
      error: null,
    });

    // Mock daily LLM cost (empty)
    mockGte.mockResolvedValueOnce({
      data: [],
      error: null,
    });

    const redisInstance = new Redis({ url: "x", token: "y" });
    const setSpy = vi.spyOn(redisInstance, "set").mockResolvedValue("OK");
    vi.mocked(Redis).mockImplementation(() => redisInstance);

    process.env.COST_LIMIT_MONTHLY = "20";
    process.env.UPSTASH_REDIS_REST_URL = "https://mock-redis.upstash.io";
    process.env.UPSTASH_REDIS_REST_TOKEN = "mock-token";

    try {
      const res = await GET(req as unknown as NextRequest);
      expect(res.status).toBe(200);

      const body = await res.json();
      expect(body.success).toBe(true);
      expect(body.killSwitchActive).toBe(true);
      expect(setSpy).toHaveBeenCalledWith("cost_kill_switch", "true");
    } finally {
      delete process.env.COST_LIMIT_MONTHLY;
      delete process.env.UPSTASH_REDIS_REST_URL;
      delete process.env.UPSTASH_REDIS_REST_TOKEN;
    }
  });
});
