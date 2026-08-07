import { describe, expect, it } from "vitest";
import {
  circlePath,
  highlightPath,
  highlightWidth,
  smoothPath,
  underlinePath,
} from "./geometry";

const rect = { x: 20, y: 40, width: 180, height: 34 };

function points(d: string): [number, number][] {
  const numbers = d.match(/-?\d+(\.\d+)?/g)?.map(Number) ?? [];
  const out: [number, number][] = [];
  for (let i = 0; i + 1 < numbers.length; i += 2) out.push([numbers[i], numbers[i + 1]]);
  return out;
}

describe("smoothPath", () => {
  it("returns nothing for fewer than two points", () => {
    expect(smoothPath([])).toBe("");
    expect(smoothPath([[0, 0]])).toBe("");
  });

  it("starts with a move and continues with cubics", () => {
    const d = smoothPath([
      [0, 0],
      [10, 4],
      [20, 0],
    ]);
    expect(d.startsWith("M 0 0")).toBe(true);
    expect(d.match(/C /g)).toHaveLength(2);
  });
});

describe("underlinePath", () => {
  it("runs the width of the text and sits below it", () => {
    const drawn = points(underlinePath(rect, 7));
    const xs = drawn.map(([x]) => x);
    const ys = drawn.map(([, y]) => y);
    expect(Math.min(...xs)).toBeLessThanOrEqual(rect.x);
    expect(Math.max(...xs)).toBeGreaterThanOrEqual(rect.x + rect.width);
    expect(Math.min(...ys)).toBeGreaterThan(rect.y + rect.height * 0.6);
  });

  it("is not a straight line", () => {
    const ys = points(underlinePath(rect, 7)).map(([, y]) => y);
    expect(new Set(ys.map((y) => Math.round(y))).size).toBeGreaterThan(1);
  });

  it("differs between seeds but repeats for the same one", () => {
    expect(underlinePath(rect, 1)).not.toBe(underlinePath(rect, 2));
    expect(underlinePath(rect, 1)).toBe(underlinePath(rect, 1));
  });
});

describe("circlePath", () => {
  it("encloses the text with room to spare", () => {
    const drawn = points(circlePath(rect, 3));
    const xs = drawn.map(([x]) => x);
    expect(Math.min(...xs)).toBeLessThan(rect.x);
    expect(Math.max(...xs)).toBeGreaterThan(rect.x + rect.width);
  });

  it("overshoots its start, the way a hand does", () => {
    const drawn = points(circlePath(rect, 3));
    const [sx, sy] = drawn[0];
    const [ex, ey] = drawn[drawn.length - 1];
    const gap = Math.hypot(ex - sx, ey - sy);
    expect(gap).toBeGreaterThan(1);
    expect(gap).toBeLessThan(rect.width / 2);
  });
});

describe("highlightPath", () => {
  it("crosses the middle of the line", () => {
    const ys = points(highlightPath(rect, 5)).map(([, y]) => y);
    const mid = rect.y + rect.height / 2;
    for (const y of ys) expect(Math.abs(y - mid)).toBeLessThan(rect.height * 0.4);
  });

  it("is thick enough to cover the text", () => {
    expect(highlightWidth(rect)).toBeGreaterThan(rect.height * 0.6);
  });
});
