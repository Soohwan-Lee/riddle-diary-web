"use client";

import { useCallback, useRef, useState, useSyncExternalStore } from "react";

/**
 * Time on this page is not wall-clock time. It stops while someone is
 * writing, and it stops while nobody is looking. Without that, you would come
 * back from another tab to a blank sheet, or watch your own first sentence
 * dissolve while you were still choosing the second one.
 */

function subscribeVisibility(listener: () => void) {
  document.addEventListener("visibilitychange", listener);
  return () => document.removeEventListener("visibilitychange", listener);
}

export function useDocumentHidden(): boolean {
  return useSyncExternalStore(
    subscribeVisibility,
    () => document.visibilityState === "hidden",
    () => false,
  );
}

/** How long after the last keystroke the page starts counting again. */
const SETTLE_MS = 2500;

export function useComposingPause() {
  const [composing, setComposing] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const touch = useCallback(() => {
    setComposing(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setComposing(false), SETTLE_MS);
  }, []);

  const release = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    setComposing(false);
  }, []);

  return { composing, touch, release };
}
