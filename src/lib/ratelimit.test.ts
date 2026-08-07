import { beforeEach, describe, expect, it } from "vitest";
import { CONVERSE_LIMIT, clientKey, resetRateLimits, takeToken } from "./ratelimit";

const limit = { capacity: 3, refillPerSecond: 1 };

beforeEach(resetRateLimits);

describe("takeToken", () => {
  it("allows a burst up to capacity, then refuses", () => {
    const now = 1_000_000;
    expect([1, 2, 3].map(() => takeToken("a", limit, now))).toEqual([
      true,
      true,
      true,
    ]);
    expect(takeToken("a", limit, now)).toBe(false);
  });

  it("refills over time", () => {
    const now = 1_000_000;
    for (let i = 0; i < 3; i++) takeToken("a", limit, now);
    expect(takeToken("a", limit, now + 500)).toBe(false);
    expect(takeToken("a", limit, now + 1_100)).toBe(true);
  });

  it("never refills past capacity", () => {
    const now = 1_000_000;
    takeToken("a", limit, now);
    // An hour later the bucket is full, not overflowing.
    for (let i = 0; i < 3; i++) {
      expect(takeToken("a", limit, now + 3_600_000)).toBe(true);
    }
    expect(takeToken("a", limit, now + 3_600_000)).toBe(false);
  });

  it("keeps callers separate", () => {
    const now = 1_000_000;
    for (let i = 0; i < 3; i++) takeToken("a", limit, now);
    expect(takeToken("a", limit, now)).toBe(false);
    expect(takeToken("b", limit, now)).toBe(true);
  });

  it("lets a conversation proceed at a human pace", () => {
    let now = 1_000_000;
    // A reply takes at least fifteen seconds to write, so a real reader
    // cannot outpace the bucket.
    for (let turn = 0; turn < 20; turn++) {
      expect(takeToken("reader", CONVERSE_LIMIT, now)).toBe(true);
      now += 15_000;
    }
  });
});

describe("clientKey", () => {
  it("prefers the first forwarded address", () => {
    const request = new Request("https://example.test", {
      headers: { "x-forwarded-for": "203.0.113.7, 70.41.3.18" },
    });
    expect(clientKey(request)).toBe("203.0.113.7");
  });

  it("falls back when no address is present", () => {
    expect(clientKey(new Request("https://example.test"))).toBe("anonymous");
  });
});
