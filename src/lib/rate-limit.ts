// src/lib/rate-limit.ts
// Robust in-memory rate limiting with sliding window and auto-cleanup

type RateLimitRecord = {
  timestamps: number[];
};

const limiters = new Map<string, RateLimitRecord>();

// Perform periodic cleanup of completely expired entries to prevent memory leaks
let lastCleanup = Date.now();
const CLEANUP_INTERVAL = 5 * 60 * 1000; // 5 minutes

function cleanupExpired(now: number, windowMs: number) {
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;

  for (const [key, record] of limiters.entries()) {
    const validTimestamps = record.timestamps.filter((t) => now - t < windowMs);
    if (validTimestamps.length === 0) {
      limiters.delete(key);
    } else {
      record.timestamps = validTimestamps;
    }
  }
}

export type RateLimitResult = {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
};

/**
 * Check if the request is within the rate limit.
 * @param key Unique key to identify the client (e.g. user ID, IP address)
 * @param limit Maximum number of requests allowed in the window
 * @param windowMs Time window in milliseconds
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();

  // Trigger cleanup occasionally
  cleanupExpired(now, windowMs);

  let record = limiters.get(key);
  if (!record) {
    record = { timestamps: [] };
    limiters.set(key, record);
  }

  // Filter out timestamps outside the sliding window
  record.timestamps = record.timestamps.filter((t) => now - t < windowMs);

  if (record.timestamps.length >= limit) {
    const oldestTimestamp = record.timestamps[0];
    const resetTime = oldestTimestamp + windowMs;
    return {
      success: false,
      limit,
      remaining: 0,
      reset: Math.ceil((resetTime - now) / 1000), // seconds until reset
    };
  }

  record.timestamps.push(now);
  return {
    success: true,
    limit,
    remaining: limit - record.timestamps.length,
    reset: Math.ceil(windowMs / 1000),
  };
}
