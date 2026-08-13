"use client";

import { useEffect, useMemo, useRef } from "react";
import {
  GLYPH_PLACEHOLDER,
  parseInkScript,
  toGraphemeRange,
  type InkGlyphRef,
} from "@/lib/ink/inkscript";
import { hashSeed, noiseAt } from "@/lib/ink/random";
import { layoutText, wordEnd } from "@/lib/ink/segment";
import { InkGlyph } from "./InkGlyph";
import { MarkLayer, type ResolvedMark } from "./MarkLayer";
import { useInkReveal } from "./useInkReveal";

export type InkPhase = "fresh" | "resting";
export type InkVoice = "user" | "ai";

export type InkTextProps = {
  id: string;
  voice: InkVoice;
  /** Raw InkScript. May grow while a reply streams in. */
  raw: string;
  /** True while more text may still arrive. */
  streaming?: boolean;
  phase: InkPhase;
  /** Characters per minute the hand writes at. */
  cpm: number;
  locale: string;
  /** How long the ink rests before it starts thinning. */
  dwellMs: number;
  /** How long the thinning itself takes. `0` disables fading. */
  fadeMs: number;
  /** Skip the reveal — the reader's own words are already on the page. */
  instant?: boolean;
  held?: boolean;
  onWritten?: () => void;
  onFaded?: () => void;
  className?: string;
};

/** Spread between words as a paragraph lets go, in write order. */
const WORD_FADE_STAGGER_MS = 55;

export function InkText({
  id,
  voice,
  raw,
  streaming = false,
  phase,
  cpm,
  locale,
  dwellMs,
  fadeMs,
  instant = false,
  held = false,
  onWritten,
  onFaded,
  className,
}: InkTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const seed = useMemo(() => hashSeed(id), [id]);

  const parsed = useMemo(
    () => parseInkScript(raw, { complete: !streaming }),
    [raw, streaming],
  );

  const layout = useMemo(
    () => layoutText(parsed.text, { cpm, locale, seed }),
    [parsed.text, cpm, locale, seed],
  );

  const revealed = useInkReveal(layout.graphemes, { instant, streaming });
  const written = !streaming && revealed >= layout.graphemes.length;

  const marks = useMemo<ResolvedMark[]>(() => {
    const chars = layout.graphemes.map((grapheme) => grapheme.char);
    return parsed.marks.map((mark) => ({
      id: `${id}:${mark.id}`,
      kind: mark.kind,
      ...toGraphemeRange(chars, mark.start, mark.end),
    }));
    // `layout` already changes whenever the text does.
  }, [id, parsed.marks, layout]);

  /**
   * Which grapheme slots hold a drawing. Both lists are in document order, so
   * the nth placeholder in the layout is the nth drawing in the parse.
   */
  const drawings = useMemo(() => {
    const found = new Map<number, InkGlyphRef>();
    let seen = 0;
    layout.graphemes.forEach((grapheme, index) => {
      if (grapheme.char !== GLYPH_PLACEHOLDER) return;
      const glyph = parsed.glyphs[seen];
      seen += 1;
      if (glyph) found.set(index, glyph);
    });
    return found;
  }, [layout.graphemes, parsed.glyphs]);

  const writtenRef = useRef(false);
  useEffect(() => {
    if (written && !writtenRef.current) {
      writtenRef.current = true;
      onWritten?.();
    }
    if (!written) writtenRef.current = false;
  }, [written, onWritten]);

  const fading = phase === "resting" && fadeMs > 0;

  // Removal is driven by the animation actually finishing, not by a timer,
  // so a paused fade also pauses the clean-up.
  const handleAnimationEnd = (event: React.AnimationEvent<HTMLDivElement>) => {
    if (event.animationName !== "ink-fade") return;
    if ((event.target as HTMLElement).dataset.lastWord !== "true") return;
    onFaded?.();
  };

  const lastWordKey = useMemo(() => {
    for (let i = layout.lines.length - 1; i >= 0; i--) {
      const words = layout.lines[i].words;
      if (words.length > 0) return words[words.length - 1].key;
    }
    return null;
  }, [layout.lines]);

  return (
    <div
      ref={containerRef}
      className={["ink-node", className].filter(Boolean).join(" ")}
      data-voice={voice}
      data-phase={fading ? "resting" : "fresh"}
      data-held={held ? "true" : undefined}
      onAnimationEnd={handleAnimationEnd}
      // The visible ink is decorative duplication; the readable copy lives in
      // the transcript region, which never fades.
      aria-hidden
    >
      {layout.lines.map((line) => (
        <span
          key={line.key}
          className="ink-line"
          // Nothing but drawings on this line: it is a gesture rather than a
          // word, and it is given the room to be one.
          data-solo={line.solo ? "true" : undefined}
        >
          {line.words.map((word) => {
            const visibleChars = word.indices.filter((index) => index < revealed);
            if (visibleChars.length === 0) return null;

            return (
              <span key={word.key}>
                <span
                  className="ink-word"
                  data-last-word={word.key === lastWordKey ? "true" : undefined}
                  style={
                    {
                      "--fade-t": `${dwellMs + word.order * WORD_FADE_STAGGER_MS}ms`,
                      "--fade-d": `${fadeMs}ms`,
                    } as React.CSSProperties
                  }
                >
                  {visibleChars.map((index) => {
                    const grapheme = layout.graphemes[index];
                    // A little baseline noise, frozen per character so the
                    // line never twitches on a re-render.
                    const lift = noiseAt(seed, index * 3) * 0.45;
                    const tilt = noiseAt(seed, index * 3 + 1) * 0.4;

                    const drawing = drawings.get(index);
                    if (drawing) {
                      return (
                        <span
                          key={index}
                          className="ink-glyph"
                          // Marks measure by this, so a drawing can be
                          // circled like anything else on the line.
                          data-i={index}
                          style={{ transform: `translateY(${lift.toFixed(2)}px)` }}
                        >
                          <InkGlyph
                            id={`${id}:${drawing.id}`}
                            name={drawing.name}
                            durationMs={grapheme.durationMs}
                          />
                        </span>
                      );
                    }

                    return (
                      <span
                        key={index}
                        className="ink-char"
                        data-i={index}
                        style={
                          {
                            "--ink-d": `${Math.round(grapheme.durationMs)}ms`,
                            transform: `translateY(${lift.toFixed(2)}px) rotate(${tilt.toFixed(2)}deg)`,
                          } as React.CSSProperties
                        }
                      >
                        {grapheme.char}
                      </span>
                    );
                  })}
                </span>
                {wordEnd(word) < revealed ? word.trailing : ""}
              </span>
            );
          })}
        </span>
      ))}

      <MarkLayer
        containerRef={containerRef}
        marks={marks}
        active={written}
        fadeDelayMs={dwellMs}
        fadeMs={fadeMs}
      />
    </div>
  );
}
