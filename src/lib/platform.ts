"use client";

import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

/**
 * Only affects which modifier key the hint names. Read through
 * `useSyncExternalStore` so the server renders the Ctrl variant and the
 * client corrects it after hydration instead of mismatching.
 */
export function useIsMac(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    // iPad counts — it takes a keyboard with a ⌘ key. A phone does not.
    () => /Mac|iPad/.test(navigator.userAgent),
    () => false,
  );
}

const coarseQuery = () =>
  typeof window === "undefined"
    ? null
    : window.matchMedia("(pointer: coarse)");

function subscribeCoarsePointer(listener: () => void) {
  const query = coarseQuery();
  query?.addEventListener("change", listener);
  return () => query?.removeEventListener("change", listener);
}

/**
 * True when the primary pointer is a finger. Used to keep the soft keyboard
 * from sliding over the paper every time the page comes back after a reply.
 */
export function useCoarsePointer(): boolean {
  return useSyncExternalStore(
    subscribeCoarsePointer,
    () => coarseQuery()?.matches ?? false,
    () => false,
  );
}
