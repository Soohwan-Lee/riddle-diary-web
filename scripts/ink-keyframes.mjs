// Prints the `ink-write-*` keyframes in `src/app/ink.css`, one set per
// `StrokeShape` in `src/lib/ink/stroke-order.ts`.
//
//   node scripts/ink-keyframes.mjs
//
// Paste the output between the "generated" markers in ink.css. Tune the
// splits here and look at the result on /lab; the numbers are percentages of
// a character's box, measured against the Hangul faces in globals.css.
//
// Every frame is the same eight-point staircase polygon, revealed from the
// top-left, so the browser interpolates it instead of snapping between shapes:
//
//   (L,T) (x1,T) (x1,y1) (x2,y1) (x2,y2) (x3,y2) (x3,B) (L,B)
const L = -15, R = 115, T = -45, B = 135;
const XA = -8, XB = 110; // visible wipe range across the box
const YA = 10, YB = 92;  // visible range down a vowel column
const SX = 54;           // where a vertical vowel's column starts
const EASE = "cubic-bezier(0.42, 0, 0.32, 1)"; // --ease-pen in globals.css
const lerp = (a, b, u) => a + (b - a) * u;
const f = (n) => `${+n.toFixed(1)}%`;

// staircase polygon: (L,T) (x1,T) (x1,y1) (x2,y1) (x2,y2) (x3,y2) (x3,B) (L,B)
const poly = ({ x1, y1, x2, y2, x3 }) =>
  `polygon(${[[L, T], [x1, T], [x1, y1], [x2, y1], [x2, y2], [x3, y2], [x3, B], [L, B]]
    .map(([x, y]) => `${f(x)} ${f(y)}`).join(", ")})`;

const wipe = (to = XB) => (u) => lerp(XA, to, u);
const down = (to = YB) => (u) => lerp(YA, to, u);

const SHAPES = {
  v: [
    [0.55, (u, x = wipe(SX)(u)) => ({ x1: x, y1: B, x2: x, y2: B, x3: x })],
    [0.45, (u, y = down()(u)) => ({ x1: R, y1: y, x2: SX, y2: B, x3: SX })],
  ],
  vf: (YV = 55) => [
    [0.4, (u, x = wipe(SX)(u)) => ({ x1: x, y1: YV, x2: L, y2: YV, x3: L })],
    [0.24, (u, y = down(YV)(u)) => ({ x1: R, y1: y, x2: SX, y2: YV, x3: L })],
    [0.36, (u, x = wipe()(u)) => ({ x1: R, y1: YV, x2: x, y2: B, x3: x })],
  ],
  h: (YH = 50) => [
    [0.55, (u, x = wipe()(u)) => ({ x1: x, y1: YH, x2: L, y2: YH, x3: L })],
    [0.45, (u, x = wipe()(u)) => ({ x1: R, y1: YH, x2: x, y2: B, x3: x })],
  ],
  hf: (Y1 = 42, Y2 = 58) => [
    [0.38, (u, x = wipe()(u)) => ({ x1: x, y1: Y1, x2: L, y2: Y1, x3: L })],
    [0.27, (u, x = wipe()(u)) => ({ x1: R, y1: Y1, x2: x, y2: Y2, x3: L })],
    [0.35, (u, x = wipe()(u)) => ({ x1: R, y1: Y2, x2: x, y2: B, x3: x })],
  ],
  c: (YC = 48) => [
    [0.34, (u, x = wipe(SX)(u)) => ({ x1: x, y1: YC, x2: L, y2: YC, x3: L })],
    [0.24, (u, x = wipe(SX)(u)) => ({ x1: SX, y1: YC, x2: x, y2: B, x3: x })],
    [0.42, (u, y = down()(u)) => ({ x1: R, y1: y, x2: SX, y2: B, x3: SX })],
  ],
  cf: (Y1 = 36, Y2 = 58) => [
    [0.28, (u, x = wipe(SX)(u)) => ({ x1: x, y1: Y1, x2: L, y2: Y1, x3: L })],
    [0.2, (u, x = wipe(SX)(u)) => ({ x1: SX, y1: Y1, x2: x, y2: Y2, x3: L })],
    [0.24, (u, y = down(Y2)(u)) => ({ x1: R, y1: y, x2: SX, y2: Y2, x3: L })],
    [0.28, (u, x = wipe()(u)) => ({ x1: R, y1: Y2, x2: x, y2: B, x3: x })],
  ],
};

const FULL = poly({ x1: R, y1: B, x2: R, y2: B, x3: R });
const LIFT = 0.06; // share of the time the pen is off the paper between parts
const END = 0.97;

function keyframes(name, phases) {
  const n = phases.length;
  const writing = END - LIFT * (n - 1);
  const total = phases.reduce((s, [w]) => s + w, 0);
  const lines = [`@keyframes ink-write-${name} {`];
  let t = 0;
  phases.forEach(([w, at], i) => {
    const span = (w / total) * writing;
    const pct = (v) => `${+(v * 100).toFixed(2)}%`;
    if (i > 0) {
      // the pen lifts: the next part's start, held until it comes down
      lines.push(`  ${pct(t + 0.0001)}, ${pct(t + LIFT)} {\n    clip-path: ${poly(at(0))};\n    animation-timing-function: ${EASE};\n  }`);
      t += LIFT;
    } else {
      lines.push(`  0% {\n    clip-path: ${poly(at(0))};\n    animation-timing-function: ${EASE};\n  }`);
    }
    t += span;
    lines.push(`  ${pct(t)} {\n    clip-path: ${poly(at(1))};\n  }`);
  });
  lines.push(`  100% {\n    clip-path: ${FULL};\n  }\n}`);
  return lines.join("\n");
}

const out = [];
for (const [name, def] of Object.entries(SHAPES)) {
  out.push(keyframes(name, typeof def === "function" ? def() : def));
}
console.log(out.join("\n\n"));
