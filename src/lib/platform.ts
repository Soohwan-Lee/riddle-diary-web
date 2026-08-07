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
