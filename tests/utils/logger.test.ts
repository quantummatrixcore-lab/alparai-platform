import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { logger } from "@/lib/utils/logger";

describe("logger", () => {
  let infoSpy: ReturnType<typeof vi.spyOn>;
  let warnSpy: ReturnType<typeof vi.spyOn>;
  let errorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    infoSpy = vi.spyOn(console, "info").mockImplementation(() => {});
    warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    infoSpy.mockRestore();
    warnSpy.mockRestore();
    errorSpy.mockRestore();
  });

  it("logs info messages", () => {
    logger.info("test message", { foo: "bar" });
    expect(infoSpy).toHaveBeenCalled();
  });

  it("logs warnings", () => {
    logger.warn("warning message");
    expect(warnSpy).toHaveBeenCalled();
  });

  it("logs errors with stack", () => {
    const err = new Error("boom");
    logger.error("something failed", { ctx: 1 }, err);
    expect(errorSpy).toHaveBeenCalled();
    const firstCall = errorSpy.mock.calls[0];
    expect(firstCall).toBeDefined();
    if (firstCall) {
      expect(String(firstCall[0])).toContain("something failed");
    }
  });

  it("includes context in log line", () => {
    logger.info("ctx test", { user: "alice", id: 42 });
    const firstCall = infoSpy.mock.calls[0];
    expect(firstCall).toBeDefined();
    if (firstCall) {
      expect(String(firstCall[0])).toContain("user");
    }
  });

  it("handles missing context gracefully", () => {
    logger.info("no ctx");
    expect(infoSpy).toHaveBeenCalled();
  });
});
