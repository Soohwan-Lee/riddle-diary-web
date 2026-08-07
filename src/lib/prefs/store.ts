"use client";

import { useSyncExternalStore } from "react";
import {
  DEFAULT_LOCAL_PREFS,
  LOCAL_PREFS_KEY,
  readLocalPrefs,
  type LocalPrefs,
} from "./config";

/**
 * A module-level store rather than `useEffect` + `setState`: the server
 * snapshot is the defaults, the client snapshot is whatever localStorage
 * holds, and `useSyncExternalStore` bridges the two without a cascading
 * render or a hydration mismatch.
 */
let cache: LocalPrefs | null = null;
const listeners = new Set<() => void>();

function getSnapshot(): LocalPrefs {
  cache ??= readLocalPrefs();
  return cache;
}

function getServerSnapshot(): LocalPrefs {
  return DEFAULT_LOCAL_PREFS;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function updateLocalPrefs(patch: Partial<LocalPrefs>) {
  cache = { ...getSnapshot(), ...patch };
  try {
    window.localStorage.setItem(LOCAL_PREFS_KEY, JSON.stringify(cache));
  } catch {
    // Private browsing or a full quota. The preference just will not survive
    // a reload, which is in keeping with the rest of the app.
  }
  for (const listener of listeners) listener();
}

export function useLocalPrefs(): LocalPrefs {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Tracks `prefers-reduced-motion` without a mount-time setState. */
const motionQuery = () =>
  typeof window === "undefined"
    ? null
    : window.matchMedia("(prefers-reduced-motion: reduce)");

function subscribeMotion(listener: () => void) {
  const query = motionQuery();
  query?.addEventListener("change", listener);
  return () => query?.removeEventListener("change", listener);
}

export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeMotion,
    () => motionQuery()?.matches ?? false,
    () => false,
  );
}
