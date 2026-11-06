import { describe, expect, it } from "vitest";
import { driftAt } from "./random";

describe("driftAt", () => {
  it("stays within [-1, 1]", () => {
    for (let i = 0; i < 500; i++) {
      const value = driftAt(42, i);
      expect(value).toBeGreaterThanOrEqual(-1);
      expect(value).toBeLessThanOrEqual(1);
    }
  });

  it("is frozen per position, so a re-render cannot move the line", () => {
    expect(driftAt(9, 13)).toBe(driftAt(9, 13));
  });

  it("wanders rather than jumps from one letter to the next", () => {
    // Per-letter noise can swing across the whole range between neighbours;
    // a hand drifting off the line cannot.
    let largest = 0;
    for (let i = 0; i < 400; i++) {
      largest = Math.max(largest, Math.abs(driftAt(3, i + 1) - driftAt(3, i)));
    }
    expect(largest).toBeLessThan(0.65);
  });

  it("does go somewhere over a line", () => {
    const values = Array.from({ length: 60 }, (_, i) => driftAt(5, i));
    expect(Math.max(...values) - Math.min(...values)).toBeGreaterThan(0.3);
  });
});
