/**
 * A token bucket held in the instance's memory.
 *
 * This is deliberately modest. On a serverless platform each instance keeps
 * its own bucket, so the effective limit is per-instance rather than global —
 * enough to stop a single tab hammering the endpoint, not enough to stop a
 * determined attacker. A shared store (Upstash, Redis) is the upgrade path,
 * and it is called out in the README rather than pretended away here.
 */

type Bucket = { tokens: number; updatedAt: number };

const BUCKETS = new Map<string, Bucket>();

/** Trims the map so a long-lived instance cannot grow without bound. */
const MAX_KEYS = 5_000;

export type RateLimit = {
  /** Bucket capacity, and therefore the largest allowed burst. */
  capacity: number;
  /** Tokens replenished per second. */
  refillPerSecond: number;
};

export const CONVERSE_LIMIT: RateLimit = {
  capacity: 8,
  refillPerSecond: 8 / 60,
};

export function takeToken(key: string, limit: RateLimit, now = Date.now()): boolean {
  if (BUCKETS.size > MAX_KEYS) BUCKETS.clear();

  const bucket = BUCKETS.get(key) ?? { tokens: limit.capacity, updatedAt: now };
  const elapsedSeconds = Math.max(0, now - bucket.updatedAt) / 1000;
  const tokens = Math.min(
    limit.capacity,
    bucket.tokens + elapsedSeconds * limit.refillPerSecond,
  );

  if (tokens < 1) {
    BUCKETS.set(key, { tokens, updatedAt: now });
    return false;
  }

  BUCKETS.set(key, { tokens: tokens - 1, updatedAt: now });
  return true;
}

/** Best-effort client identity. Spoofable, and only used for throttling. */
export function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "anonymous";
}

/** Test seam. */
export function resetRateLimits() {
  BUCKETS.clear();
}
