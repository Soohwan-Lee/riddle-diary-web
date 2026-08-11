"use client";

import { createContext, use, useCallback, useMemo, useState } from "react";
import {
  HAND_AI_COOKIE,
  HAND_USER_COOKIE,
  MODE_COOKIE,
  THEME_COOKIE,
  writeCookie,
  type Hand,
  type InputMode,
  type LocalPrefs,
  type Theme,
} from "./config";
import { updateLocalPrefs, useLocalPrefs, useReducedMotion } from "./store";

type PrefsValue = LocalPrefs & {
  theme: Theme;
  mode: InputMode;
  handUser: Hand;
  handAi: Hand;
  reducedMotion: boolean;
  setTheme: (theme: Theme) => void;
  setMode: (mode: InputMode) => void;
  setHand: (voice: "user" | "ai", hand: Hand) => void;
  setLocalPrefs: (patch: Partial<LocalPrefs>) => void;
};

const PrefsContext = createContext<PrefsValue | null>(null);

export function PrefsProvider({
  initialTheme,
  initialMode,
  initialHandUser,
  initialHandAi,
  children,
}: {
  initialTheme: Theme;
  initialMode: InputMode;
  initialHandUser: Hand;
  initialHandAi: Hand;
  children: React.ReactNode;
}) {
  const [theme, setThemeState] = useState<Theme>(initialTheme);
  const [mode, setModeState] = useState<InputMode>(initialMode);
  const [handUser, setHandUserState] = useState<Hand>(initialHandUser);
  const [handAi, setHandAiState] = useState<Hand>(initialHandAi);
  const local = useLocalPrefs();
  const reducedMotion = useReducedMotion();

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    document.documentElement.dataset.theme = next;
    writeCookie(THEME_COOKIE, next);
  }, []);

  const setMode = useCallback((next: InputMode) => {
    setModeState(next);
    writeCookie(MODE_COOKIE, next);
  }, []);

  // Same shape as the theme: written onto <html> so the ink picks it up
  // through a custom property, and into a cookie so the server can render it.
  const setHand = useCallback((voice: "user" | "ai", next: Hand) => {
    if (voice === "user") {
      setHandUserState(next);
      document.documentElement.dataset.handUser = next;
      writeCookie(HAND_USER_COOKIE, next);
    } else {
      setHandAiState(next);
      document.documentElement.dataset.handAi = next;
      writeCookie(HAND_AI_COOKIE, next);
    }
  }, []);

  const value = useMemo<PrefsValue>(
    () => ({
      ...local,
      theme,
      mode,
      handUser,
      handAi,
      reducedMotion,
      setTheme,
      setMode,
      setHand,
      setLocalPrefs: updateLocalPrefs,
    }),
    [local, theme, mode, handUser, handAi, reducedMotion, setTheme, setMode, setHand],
  );

  return <PrefsContext value={value}>{children}</PrefsContext>;
}

export function usePrefs(): PrefsValue {
  const value = use(PrefsContext);
  if (!value) throw new Error("usePrefs must be used inside <PrefsProvider>");
  return value;
}
