"use client";

import { useEffect, useRef, useState } from "react";
import type { InkGrapheme } from "@/lib/ink/segment";

/** How often the writer looks for more text once it has caught up. */
const IDLE_POLL_MS = 120;

/**
 * Paces the reveal. The hand writes at its own speed regardless of how fast
 * the model streams: arriving text queues up, and a stream that stalls simply
 * leaves the writer waiting, exactly as it would leave a person waiting.
 *
 * Each character mounts when its turn comes, so its CSS animation delay is
 * always zero relative to itself. That is what keeps a growing node from
 * re-timing the characters already on the page.
 */
export function useInkReveal(
  graphemes: readonly InkGrapheme[],
  options: { instant: boolean; streaming: boolean },
): number {
  const [revealed, setRevealed] = useState(0);
  const latest = useRef<readonly InkGrapheme[]>(graphemes);
  const streaming = useRef(options.streaming);
  const cursor = useRef(0);

  useEffect(() => {
    latest.current = graphemes;
    streaming.current = options.streaming;
  });

  useEffect(() => {
    if (options.instant) return;

    let cancelled = false;
    let handle: ReturnType<typeof setTimeout>;

    const step = () => {
      if (cancelled) return;

      const queue = latest.current;
      const index = cursor.current;

      if (index >= queue.length) {
        // Caught up. Poll only while more text may still arrive — otherwise
        // every finished node on the page would keep a timer alive forever.
        if (streaming.current) handle = setTimeout(step, IDLE_POLL_MS);
        return;
      }

      const grapheme = queue[index];
      cursor.current = index + 1;
      setRevealed(index + 1);
      handle = setTimeout(step, grapheme.durationMs + grapheme.pauseAfterMs);
    };

    handle = setTimeout(step, 0);
    return () => {
      cancelled = true;
      clearTimeout(handle);
    };
  }, [options.instant]);

  return options.instant ? graphemes.length : revealed;
}
