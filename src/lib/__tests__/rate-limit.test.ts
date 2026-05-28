import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { rateLimit } from "../rate-limit";

describe("rateLimit", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-27T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should allow requests under the limit", () => {
    const key = "test-user-1";
    const limit = 3;
    const windowMs = 60 * 1000; // 1 minute

    for (let i = 0; i < limit; i++) {
      const result = rateLimit(key, limit, windowMs);
      expect(result.success).toBe(true);
      expect(result.remaining).toBe(limit - (i + 1));
    }
  });

  it("should block requests exceeding the limit", () => {
    const key = "test-user-2";
    const limit = 2;
    const windowMs = 60 * 1000;

    rateLimit(key, limit, windowMs);
    rateLimit(key, limit, windowMs);

    const result = rateLimit(key, limit, windowMs);
    expect(result.success).toBe(false);
    expect(result.remaining).toBe(0);
    expect(result.reset).toBe(60); // 60 seconds until reset
  });

  it("should recover after the window passes", () => {
    const key = "test-user-3";
    const limit = 1;
    const windowMs = 1000; // 1 second

    expect(rateLimit(key, limit, windowMs).success).toBe(true);
    expect(rateLimit(key, limit, windowMs).success).toBe(false);

    vi.advanceTimersByTime(1100);

    expect(rateLimit(key, limit, windowMs).success).toBe(true);
  });
});
