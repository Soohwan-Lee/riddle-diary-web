import { noiseAt } from "./random";

/**
 * Hand-drawn marks. Everything here builds a polyline, wobbles it with
 * seeded noise, and smooths it into cubic béziers — the same way a person's
 * hand overshoots and drifts. Paths carry `pathLength="1"` so the draw-on
 * animation can be a plain `stroke-dashoffset: 1 → 0` with no measuring.
 */

export type Rect = { x: number; y: number; width: number; height: number };

type Point = [number, number];

const round = (value: number) => Math.round(value * 100) / 100;

/** Catmull-Rom through the points, emitted as cubic béziers. */
export function smoothPath(points: readonly Point[]): string {
  if (points.length < 2) return "";

  const out: string[] = [`M ${round(points[0][0])} ${round(points[0][1])}`];

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;

    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;

    out.push(
      `C ${round(c1x)} ${round(c1y)} ${round(c2x)} ${round(c2y)} ${round(p2[0])} ${round(p2[1])}`,
    );
  }

  return out.join(" ");
}

/**
 * A line under the text: slightly bowed, drifting off the baseline, finished
 * with the little upward flick a pen makes when it leaves the paper.
 */
export function underlinePath(rect: Rect, seed: number): string {
  const y = rect.y + rect.height * 0.94;
  const x0 = rect.x - 2;
  const x1 = rect.x + rect.width + 3;
  const span = Math.max(1, x1 - x0);
  const steps = Math.min(14, Math.max(4, Math.round(span / 26)));

  const points: Point[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const bow = Math.sin(Math.PI * t) * 1.1;
    const drift = noiseAt(seed, i) * 1.4;
    points.push([x0 + span * t, y + bow + drift - t * 1.6]);
  }

  // The flick.
  const [lastX, lastY] = points[points.length - 1];
  points.push([lastX + 5.5, lastY - 4.2]);

  return smoothPath(points);
}

/**
 * A circle around the text. The giveaway that a human drew it is that the
 * stroke passes its own starting point instead of meeting it, so this runs
 * a little past one full turn.
 */
export function circlePath(rect: Rect, seed: number): string {
  const cx = rect.x + rect.width / 2;
  const cy = rect.y + rect.height / 2;
  const rx = rect.width / 2 + Math.max(9, rect.height * 0.3);
  const ry = rect.height / 2 + rect.height * 0.42;

  const start = -2.5 + noiseAt(seed, 99) * 0.35;
  const sweep = Math.PI * 2 * 1.08;
  const steps = 30;
  const tilt = noiseAt(seed, 7) * 0.09;

  const points: Point[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const angle = start + sweep * t;
    // The radius breathes, and the hand squeezes the far side slightly.
    const wobble = 1 + noiseAt(seed, i) * 0.05 - t * 0.03;
    const px = Math.cos(angle) * rx * wobble;
    const py = Math.sin(angle) * ry * wobble;
    points.push([
      cx + px * Math.cos(tilt) - py * Math.sin(tilt),
      cy + px * Math.sin(tilt) + py * Math.cos(tilt),
    ]);
  }

  return smoothPath(points);
}

/**
 * A highlighter pass. Drawn as one thick stroke through the middle of the
 * line, with the small vertical drift of a marker held at an angle.
 */
export function highlightPath(rect: Rect, seed: number): string {
  const y = rect.y + rect.height * 0.56;
  const x0 = rect.x - 3;
  const x1 = rect.x + rect.width + 4;
  const span = Math.max(1, x1 - x0);
  const steps = Math.min(10, Math.max(3, Math.round(span / 40)));

  const points: Point[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    points.push([x0 + span * t, y + noiseAt(seed, i + 31) * 1.6]);
  }

  return smoothPath(points);
}

/** Stroke width for a highlighter pass over a line of this height. */
export function highlightWidth(rect: Rect): number {
  return Math.max(10, rect.height * 0.74);
}

export function markPath(
  kind: "underline" | "circle" | "highlight",
  rect: Rect,
  seed: number,
): string {
  if (kind === "circle") return circlePath(rect, seed);
  if (kind === "highlight") return highlightPath(rect, seed);
  return underlinePath(rect, seed);
}
