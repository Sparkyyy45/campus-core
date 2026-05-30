import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Initialize Redis only if environment variables are provided
export const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

/**
 * Creates an Upstash rate limiter with fallback handling.
 * Note: The fallback will not persist across Vercel serverless edge invocations,
 * but prevents the app from crashing in dev without keys.
 */
function createRateLimiter(
  config: Parameters<typeof Ratelimit.slidingWindow>[0],
  window: Parameters<typeof Ratelimit.slidingWindow>[1]
) {
  if (redis) {
    return new Ratelimit({
      redis: redis,
      limiter: Ratelimit.slidingWindow(config, window),
      analytics: true,
      /**
       * Optional prefix for the keys used in redis. This is useful if you want to share a redis
       * instance with other applications and want to avoid key collisions. The default prefix is
       * @upstash/ratelimit
       */
      prefix: "@upstash/ratelimit",
    });
  }

  // Fallback map if redis is not configured
  const fallbackMap = new Map();
  return {
    limit: async (identifier: string) => {
      const now = Date.now();
      const windowMs = parseInt(window.replace(/[^0-9]/g, "")) * 1000;

      const record = fallbackMap.get(identifier) || {
        count: 0,
        resetTime: now + windowMs,
      };

      if (now > record.resetTime) {
        record.count = 1;
        record.resetTime = now + windowMs;
      } else {
        record.count++;
      }

      fallbackMap.set(identifier, record);

      return {
        success: record.count <= config,
        limit: config,
        remaining: Math.max(0, config - record.count),
        reset: record.resetTime,
      };
    },
  };
}

// 1. Auth Limiter: Very strict to prevent brute force attacks (5 requests per minute)
export const authRateLimiter = createRateLimiter(5, "1 m");

// 2. API Limiter: Moderate limit for data endpoints (20 requests per 10 seconds)
export const apiRateLimiter = createRateLimiter(20, "10 s");

// 3. Global Limiter: Baseline protection for general page navigation (100 requests per 10 seconds)
export const globalRateLimiter = createRateLimiter(100, "10 s");
