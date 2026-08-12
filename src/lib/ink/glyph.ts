import { smoothPath } from "./geometry";
import { noiseAt } from "./random";

/**
 * The small things Riddle can draw.
 *
 * A fixed vocabulary rather than free-form SVG, for two reasons. Reliability:
 * paths a model invents come out broken or ugly, and there is no way to know
 * which until it is on the paper. Safety: nothing the model writes reaches the
 * renderer as markup — a name is looked up, or it is not a drawing at all.
 *
 * Each glyph is a list of strokes in the order a hand would make them, drawn
 * in a 24×24 box. Everything is wobbled with the same seeded noise the marks
 * use, so a drawing and a circle around a word look like one person's hand.
 * Paths carry no length of their own; `pathLength="1"` on the element makes
 * the draw-on a plain `stroke-dashoffset: 1 → 0`.
 */

export const GLYPHS = [
  "star",
  "heart",
  "sun",
  "moon",
  "cloud",
  "leaf",
  "wave",
  "spiral",
  "arrow",
] as const;

export type GlyphName = (typeof GLYPHS)[number];

export function isGlyphName(value: string): value is GlyphName {
  return (GLYPHS as readonly string[]).includes(value);
}

/** The box every glyph is drawn in. */
export const GLYPH_BOX = 24;

/**
 * `weight` is how much of the drawing's time this stroke gets. A sun's disc
 * takes longer than one of its rays, and splitting the time evenly would make
 * the rays crawl and the circle race.
 */
export type GlyphStroke = { d: string; weight: number };

type Point = [number, number];

const C = GLYPH_BOX / 2;
const TAU = Math.PI * 2;

/** The hand's drift, in the same spirit as the marks: small and seeded. */
function wobble(points: readonly Point[], seed: number, amount = 0.7): Point[] {
  return points.map(([x, y], i) => [
    x + noiseAt(seed, i * 2) * amount,
    y + noiseAt(seed, i * 2 + 1) * amount,
  ]);
}

function stroke(points: readonly Point[], seed: number, weight: number, drift?: number): GlyphStroke {
  return { d: smoothPath(wobble(points, seed, drift)), weight };
}

/** Samples `steps + 1` points of `f` over t ∈ [0, 1]. */
function sample(steps: number, f: (t: number) => Point): Point[] {
  return Array.from({ length: steps + 1 }, (_, i) => f(i / steps));
}

function arc(cx: number, cy: number, r: number, from: number, to: number, steps = 22): Point[] {
  return sample(steps, (t) => {
    const angle = from + (to - from) * t;
    return [cx + Math.cos(angle) * r, cy + Math.sin(angle) * r];
  });
}

/** A five-pointed star in one stroke, finishing a little past where it began. */
function star(seed: number): GlyphStroke[] {
  const at = (step: number, r: number): Point => {
    const angle = -Math.PI / 2 + (Math.PI / 5) * step;
    return [C + Math.cos(angle) * r, C + Math.sin(angle) * r];
  };
  const points: Point[] = [];
  for (let i = 0; i <= 10; i++) points.push(at(i, i % 2 === 0 ? 10.6 : 4.4));
  // Past its own starting point, the way a hand finishes one.
  points.push(at(10.7, 8.6));
  return [stroke(points, seed, 1, 0.5)];
}

/** The usual parametric heart, started at the notch and closed with overshoot. */
function heart(seed: number): GlyphStroke[] {
  const scale = 0.58;
  const points = sample(60, (t) => {
    const a = t * TAU;
    const x = 16 * Math.sin(a) ** 3;
    const y =
      13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a);
    return [C + x * scale, C - y * scale + 1.4];
  });
  return [stroke(points, seed, 1, 0.38)];
}

/** A disc, then rays — the order a child draws one in. */
function sun(seed: number): GlyphStroke[] {
  const strokes: GlyphStroke[] = [
    stroke(arc(C, C, 5.6, -2.4, -2.4 + TAU * 1.06, 26), seed, 3),
  ];
  for (let i = 0; i < 8; i++) {
    const angle = (TAU / 8) * i + 0.18;
    strokes.push(
      stroke(
        [
          [C + Math.cos(angle) * 7.8, C + Math.sin(angle) * 7.8],
          [C + Math.cos(angle) * 11, C + Math.sin(angle) * 11],
        ],
        seed + i * 131,
        0.9,
        0.45,
      ),
    );
  }
  return strokes;
}

/** A crescent: out around the far edge, back along the near one. */
function moon(seed: number): GlyphStroke[] {
  const outer = arc(C, C, 9.6, Math.PI / 3, Math.PI * (5 / 3), 24);
  const [tipX, tipY] = outer[outer.length - 1];
  const [backX, backY] = outer[0];
  // Back towards the tips but not as far out as the rim — the bite is what
  // makes it a crescent rather than a lens.
  const inner = sample(16, (t) => [
    tipX + (backX - tipX) * t - Math.sin(Math.PI * t) * 9.2,
    tipY + (backY - tipY) * t,
  ]);
  return [stroke([...outer, ...inner.slice(1)], seed, 1, 0.5)];
}

/** Three puffs and a flat bottom, in one pass. */
function cloud(seed: number): GlyphStroke[] {
  const base = 19.4;
  // [centre, radius, how far the puff sits above the base] — tallest in the
  // middle, and overlapping so the outline never drops back to the base.
  // The outer two sit on the base so the outline comes back down to it; only
  // the middle one is lifted, which is what makes the silhouette a cloud.
  const puffs: [number, number, number][] = [
    [6.3, 4.3, 0],
    [12.2, 5.6, 3.4],
    [17.9, 4.5, 0],
  ];
  // The tallest puff at each x, rather than three arcs one after another:
  // chained arcs each begin at their own left edge, which sends the pen back
  // across the puff before it. Circular, not bell-shaped — bells make peaks,
  // and a cloud drawn with peaks is a mountain range.
  const top = sample(32, (t) => {
    const x = 2 + 20.4 * t;
    let lift = 0;
    for (const [cx, r, rise] of puffs) {
      const span = r ** 2 - (x - cx) ** 2;
      if (span > 0) lift = Math.max(lift, rise + Math.sqrt(span));
    }
    return [x, base - lift] as Point;
  });
  return [stroke([...top, [12, base + 0.7], [2.2, base + 0.2]], seed, 1, 0.42)];
}

/** Outline first, then the vein down the middle. */
function leaf(seed: number): GlyphStroke[] {
  const a: Point = [4.6, 19.4];
  const b: Point = [19.4, 4.6];
  const side = (bulge: number) =>
    sample(14, (t) => {
      const swell = Math.sin(Math.PI * t) * bulge;
      return [
        a[0] + (b[0] - a[0]) * t + swell,
        a[1] + (b[1] - a[1]) * t + swell,
      ] as Point;
    });
  const out = side(-4.4);
  const back = side(4.4).reverse();
  return [
    stroke([...out, ...back.slice(1)], seed, 3, 0.5),
    stroke(
      sample(8, (t) => [
        a[0] + (b[0] - a[0]) * t + Math.sin(Math.PI * t) * 0.8,
        a[1] + (b[1] - a[1]) * t + Math.sin(Math.PI * t) * 0.8,
      ]),
      seed + 401,
      1.1,
      0.4,
    ),
  ];
}

/** Water: a crest and a half, gentle rather than jagged. */
function wave(seed: number): GlyphStroke[] {
  const points = sample(30, (t) => [2.2 + 19.6 * t, C - Math.sin(TAU * 1.5 * t) * 4]);
  return [stroke(points, seed, 1, 0.5)];
}

/** Three turns outward from the middle. */
function spiral(seed: number): GlyphStroke[] {
  const turns = 2.9;
  const points = sample(46, (t) => {
    const angle = TAU * turns * t;
    const r = 0.9 + 9.6 * t;
    return [C + Math.cos(angle) * r, C + Math.sin(angle) * r * 0.96];
  });
  return [stroke(points, seed, 1, 0.4)];
}

/** A shaft, then the head as one V — the way a hand does it. */
function arrow(seed: number): GlyphStroke[] {
  const tip: Point = [20.4, 7.4];
  const shaft = sample(10, (t) => [
    3.4 + (tip[0] - 3.4) * t,
    17.6 + (tip[1] - 17.6) * t - Math.sin(Math.PI * t) * 1.3,
  ]);
  const head: Point[] = [[13.6, 6.2], tip, [18.4, 13.4]];
  return [stroke(shaft, seed, 2.6, 0.55), stroke(head, seed + 733, 1.2, 0.5)];
}

const BUILDERS: Record<GlyphName, (seed: number) => GlyphStroke[]> = {
  star,
  heart,
  sun,
  moon,
  cloud,
  leaf,
  wave,
  spiral,
  arrow,
};

export function glyphStrokes(name: GlyphName, seed: number): GlyphStroke[] {
  return BUILDERS[name](seed);
}
