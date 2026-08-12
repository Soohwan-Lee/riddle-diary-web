"use client";

import { useMemo } from "react";
import { GLYPH_BOX, glyphStrokes, type GlyphName } from "@/lib/ink/glyph";
import { hashSeed } from "@/lib/ink/random";

/**
 * One of the small things Riddle draws, in the slot a character would take.
 *
 * This is the marks backend, not a third one: a generated path with
 * `pathLength="1"`, drawn by `stroke-dashoffset`. The only thing added is
 * order — the strokes arrive one after another, each taking the share of the
 * time its weight asks for, so a sun's disc is drawn before its rays and
 * takes longer than one of them.
 */
export function InkGlyph({
  id,
  name,
  durationMs,
}: {
  /** Stable per drawing, so the same one always wobbles the same way. */
  id: string;
  name: GlyphName;
  durationMs: number;
}) {
  const strokes = useMemo(() => {
    const drawn = glyphStrokes(name, hashSeed(id));
    const total = drawn.reduce((sum, stroke) => sum + stroke.weight, 0);

    let elapsed = 0;
    return drawn.map((stroke) => {
      const share = (stroke.weight / total) * durationMs;
      const delayMs = elapsed;
      elapsed += share;
      return { d: stroke.d, delayMs, durationMs: share };
    });
  }, [id, name, durationMs]);

  return (
    <svg viewBox={`0 0 ${GLYPH_BOX} ${GLYPH_BOX}`} aria-hidden focusable="false">
      {strokes.map((stroke, index) => (
        <path
          key={index}
          d={stroke.d}
          pathLength={1}
          style={
            {
              "--glyph-d": `${Math.round(stroke.durationMs)}ms`,
              "--glyph-t": `${Math.round(stroke.delayMs)}ms`,
            } as React.CSSProperties
          }
        />
      ))}
    </svg>
  );
}
