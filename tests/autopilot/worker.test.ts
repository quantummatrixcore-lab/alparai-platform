import { describe, it, expect, beforeEach, vi } from "vitest";

vi.mock("server-only", () => ({}));

import {
  registerAutopilotHandler,
  getAutopilotHandler,
  runAutopilotWorkerOnce,
  runAutopilotWorker,
} from "@/lib/autopilot/worker";
import { enqueueAutopilotJob, getQueue } from "@/lib/autopilot/queue";
import type { QueueJob } from "@/lib/autopilot/queue";
import { createIdempotencyKey } from "@/lib/autopilot/types";

describe("autopilot worker", () => {
  beforeEach(() => {
    const q = getQueue();
    vi.spyOn(q, "pull").mockResolvedValue([]);
    vi.spyOn(q, "ack").mockResolvedValue();
  });

  it("registers and retrieves handlers", () => {
    const handler = async () => ({ kind: "success" as const, value: { ok: true } });
    registerAutopilotHandler("submitIncident", handler);
    expect(getAutopilotHandler("submitIncident")).toBe(handler);
  });

  it("returns null for unregistered action", () => {
    expect(getAutopilotHandler("doesNotExist")).toBeNull();
  });

  it("processes jobs and reports stats", async () => {
    const handler = async (job: QueueJob) => {
      void job;
      return { kind: "success" as const, value: { ok: true } };
    };
    registerAutopilotHandler("submitIncident", handler);
    const job: QueueJob = {
      id: "j1",
      action: "submitIncident",
      idempotencyKey: "key1",
      payload: {},
      enqueuedAt: Date.now(),
    };
    const q = getQueue();
    vi.spyOn(q, "pull").mockResolvedValue([job]);
    const stats = await runAutopilotWorkerOnce({ batchSize: 5 });
    expect(stats.processed).toBe(1);
    expect(stats.succeeded).toBe(1);
    expect(stats.failed).toBe(0);
  });

  it("fails jobs with no registered action", async () => {
    const job: QueueJob = {
      id: "j2",
      action: "submitContact",
      idempotencyKey: "key2",
      payload: {},
      enqueuedAt: Date.now(),
    };
    const q = getQueue();
    vi.spyOn(q, "pull").mockResolvedValue([job]);
    const stats = await runAutopilotWorkerOnce({ batchSize: 5 });
    expect(stats.failed).toBe(1);
  });

  it("loops until maxEmptyPolls and stops", async () => {
    const controller = new AbortController();
    controller.abort();
    const stats = await runAutopilotWorker({
      batchSize: 5,
      pollIntervalMs: 1,
      maxEmptyPolls: 1,
      signal: controller.signal,
    });
    expect(stats.processed).toBe(0);
  });
});

describe("enqueueAutopilotJob", () => {
  it("returns an id when enqueued", async () => {
    const id = await enqueueAutopilotJob(
      "submitIncident",
      createIdempotencyKey("abc"),
      { hello: "world" }
    );
    expect(typeof id === "string" && id.length > 0).toBe(true);
  });
});
