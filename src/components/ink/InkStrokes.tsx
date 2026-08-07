"use client";

import { useMemo } from "react";
import {
  strokeToPath,
  strokesBounds,
  type Stroke,
  type StrokeStyle,
} from "@/lib/ink/strokes";

/** Spread between strokes as a handwritten entry lets go, in writing order. */
const STROKE_FADE_STAGGER_MS = 24;

/**
 * Committed handwriting. The reader's own strokes, drawn as filled outlines
 * so pressure survives, and fading on the same clock as everything else.
 */
export function InkStrokes({
  strokes,
  style,
  phase,
  dwellMs,
  fadeMs,
  onFaded,
}: {
  strokes: readonly Stroke[];
  style: StrokeStyle;
  phase: "fresh" | "resting";
  dwellMs: number;
  fadeMs: number;
  onFaded?: () => void;
}) {
  const bounds = useMemo(() => strokesBounds(strokes, 8), [strokes]);
  const paths = useMemo(
    () => strokes.map((stroke) => strokeToPath(stroke, style)),
    [strokes, style],
  );

  if (!bounds) return null;

  const fading = phase === "resting" && fadeMs > 0;

  return (
    <div
      className="ink-node text-ink-user"
      data-voice="user"
      data-phase={fading ? "resting" : "fresh"}
      onAnimationEnd={(event) => {
        if (event.animationName !== "ink-fade") return;
        if ((event.target as SVGElement).dataset.lastStroke !== "true") return;
        onFaded?.();
      }}
      aria-hidden
    >
      {/* Kept at the size it was written, left-aligned, and only scaled down
          if the column is narrower than the hand was wide. */}
      <svg
        viewBox={`${bounds.x} ${bounds.y} ${bounds.width} ${bounds.height}`}
        width={bounds.width}
        height={bounds.height}
        preserveAspectRatio="xMinYMin meet"
        style={{ display: "block", maxWidth: "100%", height: "auto" }}
        focusable="false"
      >
        {paths.map((d, index) =>
          d ? (
            <path
              key={index}
              className="ink-stroke"
              data-last-stroke={index === paths.length - 1 ? "true" : undefined}
              d={d}
              style={
                {
                  "--fade-t": `${dwellMs + index * STROKE_FADE_STAGGER_MS}ms`,
                  "--fade-d": `${fadeMs}ms`,
                } as React.CSSProperties
              }
            />
          ) : null,
        )}
      </svg>
    </div>
  );
}
