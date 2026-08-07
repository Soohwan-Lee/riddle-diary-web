import getStroke from "perfect-freehand";

/** `[x, y, pressure]`. Pressure is 0.5 when the device does not report it. */
export type StrokePoint = [number, number, number];
export type Stroke = StrokePoint[];

export type StrokeStyle = {
  size: number;
  /** True for mouse and finger input, where pressure has to be inferred. */
  simulatePressure: boolean;
};

export function freehandOptions(style: StrokeStyle) {
  return {
    size: style.size,
    thinning: 0.62,
    smoothing: 0.55,
    streamline: 0.42,
    simulatePressure: style.simulatePressure,
    last: true,
  };
}

/**
 * perfect-freehand returns the outline of the stroke, not a centre line, so
 * it is filled rather than stroked — which is what makes pressure visible.
 */
export function strokeToPath(stroke: Stroke, style: StrokeStyle): string {
  const outline = getStroke(stroke, freehandOptions(style));
  if (outline.length === 0) return "";

  const parts: string[] = [];
  for (let i = 0; i < outline.length; i++) {
    const [x0, y0] = outline[i];
    const [x1, y1] = outline[(i + 1) % outline.length];
    if (i === 0) parts.push(`M ${round(x0)} ${round(y0)}`);
    parts.push(`Q ${round(x0)} ${round(y0)} ${round((x0 + x1) / 2)} ${round((y0 + y1) / 2)}`);
  }
  parts.push("Z");
  return parts.join(" ");
}

const round = (value: number) => Math.round(value * 10) / 10;

export type Bounds = { x: number; y: number; width: number; height: number };

export function strokesBounds(strokes: readonly Stroke[], pad = 24): Bounds | null {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const stroke of strokes) {
    for (const [x, y] of stroke) {
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }
  }

  if (!Number.isFinite(minX)) return null;
  return {
    x: minX - pad,
    y: minY - pad,
    width: maxX - minX + pad * 2,
    height: maxY - minY + pad * 2,
  };
}

/** Longest edge of the image handed to the model. */
const RASTER_MAX = 1024;

/**
 * Flattens the strokes into a high-contrast PNG: dark ink on white, whatever
 * the page theme is. The model reads handwriting, not a mood board, and the
 * smaller and plainer the image the fewer tokens it costs.
 */
export function rasterizeStrokes(
  strokes: readonly Stroke[],
  style: StrokeStyle,
): string | null {
  const bounds = strokesBounds(strokes, 32);
  if (!bounds || bounds.width <= 0 || bounds.height <= 0) return null;

  const scale = Math.min(1, RASTER_MAX / Math.max(bounds.width, bounds.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bounds.width * scale));
  canvas.height = Math.max(1, Math.round(bounds.height * scale));

  const context = canvas.getContext("2d");
  if (!context) return null;

  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.scale(scale, scale);
  context.translate(-bounds.x, -bounds.y);
  context.fillStyle = "#101010";

  for (const stroke of strokes) {
    const outline = getStroke(stroke, freehandOptions(style));
    if (outline.length < 3) continue;
    context.beginPath();
    context.moveTo(outline[0][0], outline[0][1]);
    for (let i = 1; i < outline.length; i++) {
      context.lineTo(outline[i][0], outline[i][1]);
    }
    context.closePath();
    context.fill();
  }

  return canvas.toDataURL("image/png");
}

/** Distance from a point to a stroke, for the eraser. */
export function strokeHitTest(
  stroke: Stroke,
  x: number,
  y: number,
  radius: number,
): boolean {
  const limit = radius * radius;
  for (const [px, py] of stroke) {
    const dx = px - x;
    const dy = py - y;
    if (dx * dx + dy * dy <= limit) return true;
  }
  return false;
}
