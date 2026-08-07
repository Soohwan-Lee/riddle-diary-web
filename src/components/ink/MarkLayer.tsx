"use client";

import { useEffect, useState, type RefObject } from "react";
import { highlightWidth, markPath, type Rect } from "@/lib/ink/geometry";
import { hashSeed } from "@/lib/ink/random";
import type { InkMarkKind } from "@/lib/ink/inkscript";

export type ResolvedMark = {
  id: string;
  kind: InkMarkKind;
  /** Grapheme indices, half-open. */
  start: number;
  end: number;
};

type Drawn = {
  key: string;
  kind: InkMarkKind;
  d: string;
  width?: number;
  delayMs: number;
  durationMs: number;
};

const DRAW_MS: Record<InkMarkKind, number> = {
  underline: 540,
  circle: 820,
  highlight: 480,
};

/** A mark is made after the sentence is finished, the way a person does it. */
const FIRST_MARK_DELAY_MS = 260;
const BETWEEN_MARKS_MS = 300;

/**
 * Unions the boxes of a grapheme range, one box per visual line, so a mark
 * that wraps becomes two strokes rather than one impossible diagonal.
 */
function measureRange(container: HTMLElement, start: number, end: number): Rect[] {
  const rows = new Map<number, Rect>();

  for (let i = start; i < end; i++) {
    const element = container.querySelector<HTMLElement>(`[data-i="${i}"]`);
    if (!element) continue;

    const rect: Rect = {
      x: element.offsetLeft,
      y: element.offsetTop,
      width: element.offsetWidth,
      height: element.offsetHeight,
    };
    // Characters on one line share a top within a pixel or two.
    const row = Math.round(rect.y / 4);
    const existing = rows.get(row);

    if (!existing) {
      rows.set(row, rect);
      continue;
    }

    const x0 = Math.min(existing.x, rect.x);
    const y0 = Math.min(existing.y, rect.y);
    const x1 = Math.max(existing.x + existing.width, rect.x + rect.width);
    const y1 = Math.max(existing.y + existing.height, rect.y + rect.height);
    rows.set(row, { x: x0, y: y0, width: x1 - x0, height: y1 - y0 });
  }

  return [...rows.values()].filter((rect) => rect.width > 0);
}

export function MarkLayer({
  containerRef,
  marks,
  active,
  fadeDelayMs,
  fadeMs,
}: {
  containerRef: RefObject<HTMLElement | null>;
  marks: readonly ResolvedMark[];
  /** Marks are held back until the text they refer to is finished. */
  active: boolean;
  fadeDelayMs: number;
  fadeMs: number;
}) {
  const [drawn, setDrawn] = useState<Drawn[]>([]);

  useEffect(() => {
    const container = containerRef.current;

    const measure = () => {
      if (!container || !active || marks.length === 0) {
        setDrawn([]);
        return;
      }

      const next: Drawn[] = [];
      marks.forEach((mark, markIndex) => {
        const seed = hashSeed(mark.id);
        for (const [rectIndex, rect] of measureRange(
          container,
          mark.start,
          mark.end,
        ).entries()) {
          next.push({
            key: `${mark.id}-${rectIndex}`,
            kind: mark.kind,
            d: markPath(mark.kind, rect, seed + rectIndex * 977),
            width: mark.kind === "highlight" ? highlightWidth(rect) : undefined,
            delayMs:
              FIRST_MARK_DELAY_MS +
              markIndex * BETWEEN_MARKS_MS +
              rectIndex * 180,
            durationMs: DRAW_MS[mark.kind],
          });
        }
      });
      setDrawn(next);
    };

    // Measure after a frame so layout has settled, and again whenever the
    // column resizes and the text rewraps.
    const frame = requestAnimationFrame(measure);
    const observer = container ? new ResizeObserver(() => measure()) : null;
    if (container) observer?.observe(container);

    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
    };
  }, [containerRef, marks, active]);

  if (drawn.length === 0) return null;

  const under = drawn.filter((mark) => mark.kind === "highlight");
  const over = drawn.filter((mark) => mark.kind !== "highlight");

  const render = (items: Drawn[], layer: "under" | "over") =>
    items.length === 0 ? null : (
      <svg className="ink-marks" data-layer={layer} aria-hidden focusable="false">
        {items.map((mark) => (
          <path
            key={mark.key}
            className="ink-mark-path"
            data-kind={mark.kind}
            d={mark.d}
            pathLength={1}
            strokeWidth={mark.width}
            style={
              {
                "--mark-d": `${mark.durationMs}ms`,
                "--mark-t": `${mark.delayMs}ms`,
                "--fade-t": `${fadeDelayMs}ms`,
                "--fade-d": `${fadeMs}ms`,
              } as React.CSSProperties
            }
          />
        ))}
      </svg>
    );

  return (
    <>
      {render(under, "under")}
      {render(over, "over")}
    </>
  );
}
