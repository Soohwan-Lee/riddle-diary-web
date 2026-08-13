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
 *
 * What belongs in here: things a diary page might reach for when a sentence
 * would say it worse. Weather, growing things, small objects, a knot. What
 * does not: faces, symbols with a fixed meaning, anything that would read as
 * an emoji dropped into handwriting.
 */

export const GLYPHS = [
  // sky
  "sun",
  "moon",
  "star",
  "cloud",
  "rain",
  "snow",
  "lightning",
  "rainbow",
  "wind",
  // growing
  "leaf",
  "sprout",
  "tree",
  "flower",
  "mountain",
  // water and air
  "wave",
  "drop",
  "boat",
  "bird",
  "feather",
  // small things
  "cup",
  "candle",
  "key",
  "window",
  "bridge",
  // shapes that mean something
  "heart",
  "spiral",
  "arrow",
  "knot",
  "clock",
  "hourglass",
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

function line(a: Point, b: Point, steps = 4): Point[] {
  return sample(steps, (t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
}

/**
 * Catmull-Rom rounds every corner it passes through, which is right for a
 * hand and wrong for a roof, a bolt or a windowsill. Crowding two points in
 * around a corner leaves the curve almost no room to round it off.
 */
function corner(points: readonly Point[], tightness = 0.88): Point[] {
  if (points.length < 3) return [...points];
  const out: Point[] = [points[0]];
  for (let i = 1; i < points.length - 1; i++) {
    const [px, py] = points[i - 1];
    const [x, y] = points[i];
    const [nx, ny] = points[i + 1];
    const slack = 1 - tightness;
    out.push([x + (px - x) * slack, y + (py - y) * slack]);
    out.push([x, y]);
    out.push([x + (nx - x) * slack, y + (ny - y) * slack]);
  }
  out.push(points[points.length - 1]);
  return out;
}

/**
 * A closed outline between two points, swelling out and back along the
 * perpendicular: leaves, petals, sails, a drop. `skew` above 1 pushes the
 * widest part towards `b`, which is the difference between a leaf and a tear.
 */
function blade(
  a: Point,
  b: Point,
  bulge: number,
  options: { steps?: number; skew?: number } = {},
): Point[] {
  const { steps = 14, skew = 1 } = options;
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const length = Math.hypot(dx, dy) || 1;
  const px = -dy / length;
  const py = dx / length;
  const side = (amount: number) =>
    sample(steps, (t) => {
      const swell = Math.sin(Math.PI * t ** skew) * amount;
      return [a[0] + dx * t + px * swell, a[1] + dy * t + py * swell] as Point;
    });
  return [...side(bulge), ...side(-bulge).reverse().slice(1)];
}

/**
 * The tallest of several overlapping circles at each x — a cloud's top.
 * Chained arcs would each begin at their own left edge, sending the pen back
 * across the puff before it; bell curves make peaks, and a cloud drawn with
 * peaks is a mountain range.
 */
type Puff = [cx: number, r: number, rise: number];

function puffTop(
  base: number,
  from: number,
  to: number,
  puffs: readonly Puff[],
  steps = 30,
): Point[] {
  return sample(steps, (t) => {
    const x = from + (to - from) * t;
    let lift = 0;
    for (const [cx, r, rise] of puffs) {
      const span = r ** 2 - (x - cx) ** 2;
      if (span > 0) lift = Math.max(lift, rise + Math.sqrt(span));
    }
    return [x, base - lift] as Point;
  });
}

/* ---- sky ---------------------------------------------------------------- */

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

const CLOUD_PUFFS: Puff[] = [
  [6.3, 4.3, 0],
  [12.2, 5.6, 3.4],
  [17.9, 4.5, 0],
];

/** Three puffs and a flat bottom, in one pass. */
function cloud(seed: number): GlyphStroke[] {
  const base = 19.4;
  const top = puffTop(base, 2, 22.4, CLOUD_PUFFS, 32);
  return [stroke([...top, [12, base + 0.7], [2.2, base + 0.2]], seed, 1, 0.42)];
}

/** The same cloud, lifted and shortened, with the weather under it. */
function rain(seed: number): GlyphStroke[] {
  const base = 13.8;
  const top = puffTop(
    base,
    2.6,
    21.4,
    [
      [6.9, 3.8, 0],
      [12, 4.9, 2.4],
      [17.1, 4, 0],
    ],
    28,
  );
  const strokes = [
    stroke([...top, [12, base + 0.6], [2.8, base + 0.2]], seed, 2.4, 0.4),
  ];
  const drops: Point[][] = [
    [
      [7.6, 16.2],
      [6.4, 21],
    ],
    [
      [12, 17],
      [10.8, 21.8],
    ],
    [
      [16.4, 16.2],
      [15.2, 21],
    ],
  ];
  drops.forEach(([from, to], i) =>
    strokes.push(stroke(line(from, to, 3), seed + 211 * (i + 1), 0.55, 0.3)),
  );
  return strokes;
}

/** Three spokes through the middle, each barred near its ends. */
function snow(seed: number): GlyphStroke[] {
  const strokes: GlyphStroke[] = [];
  const reach = 9.4;
  for (let i = 0; i < 3; i++) {
    const angle = Math.PI / 2 + (Math.PI / 3) * i;
    const dx = Math.cos(angle);
    const dy = Math.sin(angle);
    strokes.push(
      stroke(
        line([C - dx * reach, C - dy * reach], [C + dx * reach, C + dy * reach], 5),
        seed + i * 97,
        1.3,
        0.4,
      ),
    );
  }
  for (let i = 0; i < 6; i++) {
    const angle = Math.PI / 2 + (Math.PI / 3) * i;
    const dx = Math.cos(angle);
    const dy = Math.sin(angle);
    const at = 0.72 * reach;
    strokes.push(
      stroke(
        [
          [C + dx * at - dy * 1.9, C + dy * at + dx * 1.9],
          [C + dx * at + dy * 1.9, C + dy * at - dx * 1.9],
        ],
        seed + 400 + i * 53,
        0.35,
        0.28,
      ),
    );
  }
  return strokes;
}

/** A bolt: four points, and the corners have to stay corners. */
function lightning(seed: number): GlyphStroke[] {
  const points: Point[] = [
    [15.2, 2.4],
    [7.2, 13],
    [12.4, 13.4],
    [8.4, 21.6],
  ];
  return [stroke(corner(points, 0.9), seed, 1, 0.32)];
}

/** Three arcs over the same centre, drawn from the outside in. */
function rainbow(seed: number): GlyphStroke[] {
  const cy = 19.2;
  return [10.4, 7.6, 4.8].map((r, i) =>
    stroke(arc(C, cy, r, Math.PI, TAU, 20), seed + i * 149, 1, 0.4),
  );
}

/**
 * Air moving: long lines, the top one curling back on itself. Sampled coarsely
 * and drifted lightly — the wobble is per point, so a long line described by
 * many of them is not a hand, it is chatter.
 */
function wind(seed: number): GlyphStroke[] {
  const run = (from: number, to: number, y: number, amp: number, steps: number) =>
    sample(steps, (t) => [
      from + (to - from) * t,
      y + Math.sin(Math.PI * 1.2 * t) * amp,
    ] as Point);

  const top = run(2.6, 16.4, 7.8, 1.7, 8);
  const curl = arc(16.4, 9.7, 1.9, -Math.PI / 2, Math.PI * 0.62, 9);
  return [
    stroke([...top, ...curl.slice(1)], seed, 1.5, 0.2),
    stroke(run(2.2, 15.2, 13.4, 1.5, 8), seed + 311, 1.1, 0.2),
    stroke(run(4.4, 13, 18.4, 1.2, 7), seed + 577, 0.8, 0.2),
  ];
}

/* ---- growing ------------------------------------------------------------ */

/** Outline first, then the vein down the middle. */
function leaf(seed: number): GlyphStroke[] {
  const a: Point = [4.6, 19.4];
  const b: Point = [19.4, 4.6];
  return [
    stroke(blade(a, b, 6.2), seed, 3, 0.5),
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

/** A stem out of the ground and the first two leaves. */
function sprout(seed: number): GlyphStroke[] {
  const stem = sample(12, (t) => [
    12 + Math.sin(Math.PI * t) * 1.3,
    21.6 - 11.4 * t,
  ] as Point);
  return [
    stroke(stem, seed, 1.4, 0.36),
    stroke(blade([12.2, 15.4], [5, 11.4], 2.6, { steps: 10 }), seed + 233, 1, 0.34),
    stroke(blade([12.6, 13.2], [19.4, 9], 2.6, { steps: 10 }), seed + 467, 1, 0.34),
  ];
}

/** A canopy and a trunk. Nothing else survives at this size. */
function tree(seed: number): GlyphStroke[] {
  const canopy = sample(30, (t) => {
    const angle = TAU * t - Math.PI / 2;
    const r = 7 + Math.sin(angle * 3) * 0.7;
    return [12 + Math.cos(angle) * r, 9.6 + Math.sin(angle) * r * 0.94] as Point;
  });
  return [
    stroke(canopy, seed, 2.8, 0.45),
    stroke(
      corner([
        [10.4, 21.8],
        [11, 16.2],
        [13, 16.2],
        [13.4, 21.8],
      ], 0.8),
      seed + 349,
      1,
      0.3,
    ),
  ];
}

/**
 * Five petals, one at a time, then the middle and the stem. A rose curve got
 * there in a single stroke and came out as a scribble: the petals it makes are
 * too narrow to read, and the pen crosses the middle five times.
 */
function flower(seed: number): GlyphStroke[] {
  const cy = 9.6;
  const strokes: GlyphStroke[] = [];
  for (let i = 0; i < 5; i++) {
    const angle = -Math.PI / 2 + (TAU / 5) * i;
    const dx = Math.cos(angle);
    const dy = Math.sin(angle);
    strokes.push(
      stroke(
        blade([12 + dx * 1.7, cy + dy * 1.7], [12 + dx * 7.4, cy + dy * 7.4], 2.5, {
          steps: 10,
        }),
        seed + i * 137,
        1,
        0.26,
      ),
    );
  }
  strokes.push(stroke(arc(12, cy, 1.5, 0, TAU * 1.05, 10), seed + 911, 0.5, 0.2));
  strokes.push(
    stroke(
      sample(5, (t) => [12 + Math.sin(Math.PI * t) * 1.1, 17.2 + 5.6 * t] as Point),
      seed + 619,
      1,
      0.2,
    ),
  );
  return strokes;
}

/** A ridge line. Mountains are not drawn with a base. */
function mountain(seed: number): GlyphStroke[] {
  return [
    stroke(
      corner([
        [2.4, 19.8],
        [8.6, 6.6],
        [12.6, 13.4],
        [16.2, 8.4],
        [21.6, 19.8],
      ], 0.86),
      seed,
      1,
      0.34,
    ),
  ];
}

/* ---- water and air ------------------------------------------------------ */

/** Water: a crest and a half, gentle rather than jagged. */
function wave(seed: number): GlyphStroke[] {
  // Few samples on purpose: the drift is per point, so a long smooth stroke
  // described by many of them comes out as high-frequency chatter.
  const points = sample(20, (t) => [2.2 + 19.6 * t, C - Math.sin(TAU * 1.5 * t) * 4] as Point);
  return [stroke(points, seed, 1, 0.5)];
}

/**
 * A tear: two straight sides down from the point, and a bowl. Built from a
 * blade it came out a gem — both sides converge on the far end, so the bottom
 * finishes in a second point.
 */
function drop(seed: number): GlyphStroke[] {
  const tip: Point = [12, 2.6];
  const bowl = arc(12, 15.2, 5.6, -Math.PI * 0.3, Math.PI * 1.3, 24);
  return [stroke([tip, ...bowl, tip], seed, 1, 0.3)];
}

/** Hull, mast, sail. */
function boat(seed: number): GlyphStroke[] {
  return [
    stroke(
      corner([
        [3.2, 15.4],
        [5.8, 20.6],
        [18.2, 20.6],
        [20.8, 15.4],
      ], 0.82),
      seed,
      1.8,
      0.34,
    ),
    stroke(line([12, 15.2], [12, 4.4], 4), seed + 271, 0.9, 0.3),
    stroke(
      corner([
        [12.8, 5.6],
        [18.6, 14.2],
        [12.8, 14.2],
      ], 0.88),
      seed + 523,
      1.3,
      0.3,
    ),
  ];
}

/**
 * Two humps of the wrist. Drawn as a ridge it was a mountain with rounded
 * corners; what makes it a bird is that the wings arch over and the tips fall
 * back below the dip between them.
 */
function bird(seed: number): GlyphStroke[] {
  const left = arc(7.2, 12.2, 4.7, Math.PI, TAU, 12);
  const right = arc(16.8, 12.2, 4.7, Math.PI, TAU, 12);
  return [
    stroke(
      [[2.2, 13.9], ...left, ...right.slice(1), [21.8, 13.9]],
      seed,
      1,
      0.3,
    ),
  ];
}

/** A narrow blade with the shaft running past it at both ends, then barbs. */
function feather(seed: number): GlyphStroke[] {
  const tip: Point = [17.6, 4.4];
  const foot: Point = [7.4, 17.2];
  const strokes = [
    stroke(blade(tip, foot, 3.1, { steps: 16, skew: 1.15 }), seed, 2.6, 0.3),
    stroke(line([18.6, 3.2], [5.4, 20.4], 5), seed + 137, 1, 0.28),
  ];
  // What tells a feather from a leaf: the edge is not continuous.
  for (let i = 0; i < 3; i++) {
    const t = 0.28 + i * 0.2;
    const x = tip[0] + (foot[0] - tip[0]) * t;
    const y = tip[1] + (foot[1] - tip[1]) * t;
    strokes.push(
      stroke([[x, y], [x - 2.2, y - 1.8]], seed + 700 + i * 89, 0.35, 0.26),
    );
  }
  return strokes;
}

/* ---- small things ------------------------------------------------------- */

/** Rim, body, handle, and something rising off it. */
function cup(seed: number): GlyphStroke[] {
  return [
    stroke(line([6, 10.2], [18, 10.2], 4), seed, 0.8, 0.3),
    stroke(
      corner([
        [6.4, 10.4],
        [7.8, 19.6],
        [16.2, 19.6],
        [17.6, 10.4],
      ], 0.84),
      seed + 181,
      2,
      0.32,
    ),
    stroke(arc(17.6, 14.2, 3.1, -Math.PI / 2, Math.PI / 2, 12), seed + 359, 0.8, 0.3),
    stroke(
      sample(10, (t) => [12 + Math.sin(TAU * t) * 1.4, 8.6 - 5.4 * t] as Point),
      seed + 613,
      0.7,
      0.28,
    ),
  ];
}

/** A flame, then the thing under it. */
function candle(seed: number): GlyphStroke[] {
  return [
    stroke(blade([12, 2.2], [12, 9.6], 2.5, { steps: 12, skew: 1.5 }), seed, 1.1, 0.3),
    stroke(
      corner([
        [8.8, 10.6],
        [8.8, 21.4],
        [15.2, 21.4],
        [15.2, 10.6],
        [8.8, 10.6],
      ], 0.88),
      seed + 293,
      2,
      0.3,
    ),
  ];
}

/** Ring, shaft, and two teeth. */
function key(seed: number): GlyphStroke[] {
  return [
    stroke(arc(12, 6.4, 3.6, -1.9, -1.9 + TAU * 1.05, 18), seed, 1.6, 0.34),
    stroke(line([12, 10], [12, 21.6], 5), seed + 157, 1.2, 0.3),
    stroke(line([12, 17.4], [16.4, 17.4], 3), seed + 431, 0.4, 0.26),
    stroke(line([12, 20.4], [15.6, 20.4], 3), seed + 743, 0.35, 0.26),
  ];
}

/** A frame, a cross, a sill. */
function window(seed: number): GlyphStroke[] {
  return [
    stroke(
      corner([
        [5, 4.6],
        [19, 4.6],
        [19, 19.2],
        [5, 19.2],
        [5, 4.6],
      ], 0.9),
      seed,
      2.4,
      0.3,
    ),
    stroke(line([12, 4.8], [12, 19], 4), seed + 173, 0.7, 0.26),
    stroke(line([5.2, 11.9], [18.8, 11.9], 4), seed + 389, 0.7, 0.26),
    stroke(line([3.4, 20.6], [20.6, 20.6], 4), seed + 641, 0.6, 0.28),
  ];
}

/**
 * A deck, the arch that holds it, and the piers at each end. The arch has to
 * rise towards the deck: hung below it as a half circle it reads as a hammock.
 */
function bridge(seed: number): GlyphStroke[] {
  return [
    stroke(line([2.2, 10.8], [21.8, 10.8], 5), seed, 1.2, 0.3),
    stroke(arc(12, 19.8, 7.4, Math.PI, TAU, 20), seed + 211, 1.6, 0.3),
    stroke(line([3.2, 11], [3.2, 19.8], 3), seed + 457, 0.5, 0.26),
    stroke(line([20.8, 11], [20.8, 19.8], 3), seed + 701, 0.5, 0.26),
  ];
}

/* ---- shapes that mean something ----------------------------------------- */

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

/** Three turns outward from the middle. */
function spiral(seed: number): GlyphStroke[] {
  const turns = 2.9;
  const points = sample(46, (t) => {
    const angle = TAU * turns * t;
    const r = 0.9 + 9.6 * t;
    return [C + Math.cos(angle) * r, C + Math.sin(angle) * r * 0.96] as Point;
  });
  return [stroke(points, seed, 1, 0.4)];
}

/** A shaft, then the head as one V — the way a hand does it. */
function arrow(seed: number): GlyphStroke[] {
  const tip: Point = [20.4, 7.4];
  const shaft = sample(6, (t) => [
    3.4 + (tip[0] - 3.4) * t,
    17.6 + (tip[1] - 17.6) * t - Math.sin(Math.PI * t) * 1.3,
  ] as Point);
  const head: Point[] = [[13.6, 6.2], tip, [18.4, 13.4]];
  return [stroke(shaft, seed, 2.6, 0.4), stroke(head, seed + 733, 1.2, 0.4)];
}

/** A trefoil, drawn without lifting: a line that keeps crossing itself. */
function knot(seed: number): GlyphStroke[] {
  const points = sample(96, (t) => {
    const a = TAU * t;
    return [
      12 + (Math.sin(a) + 2 * Math.sin(2 * a)) * 3.4,
      12.6 + (Math.cos(a) - 2 * Math.cos(2 * a)) * 3.4,
    ] as Point;
  });
  return [stroke(points, seed, 1, 0.24)];
}

/** A face and two hands. */
function clock(seed: number): GlyphStroke[] {
  return [
    stroke(arc(12, 12, 8.6, -1.2, -1.2 + TAU * 1.04, 28), seed, 2.6, 0.4),
    stroke(line([12, 12], [12, 6.2], 3), seed + 251, 0.7, 0.28),
    stroke(line([12, 12], [16.6, 14.4], 3), seed + 509, 0.6, 0.28),
  ];
}

/** The waist is drawn twice, which is what makes it an hourglass. */
function hourglass(seed: number): GlyphStroke[] {
  return [
    stroke(
      corner([
        [6.6, 4.2],
        [17.4, 4.2],
        [12, 12],
        [17.4, 19.8],
        [6.6, 19.8],
        [12, 12],
        [6.6, 4.2],
      ], 0.86),
      seed,
      2.4,
      0.28,
    ),
    stroke(line([5.2, 3.8], [18.8, 3.8], 3), seed + 167, 0.6, 0.28),
    stroke(line([5.2, 20.2], [18.8, 20.2], 3), seed + 383, 0.6, 0.28),
  ];
}

const BUILDERS: Record<GlyphName, (seed: number) => GlyphStroke[]> = {
  sun,
  moon,
  star,
  cloud,
  rain,
  snow,
  lightning,
  rainbow,
  wind,
  leaf,
  sprout,
  tree,
  flower,
  mountain,
  wave,
  drop,
  boat,
  bird,
  feather,
  cup,
  candle,
  key,
  window,
  bridge,
  heart,
  spiral,
  arrow,
  knot,
  clock,
  hourglass,
};

export function glyphStrokes(name: GlyphName, seed: number): GlyphStroke[] {
  return BUILDERS[name](seed);
}
