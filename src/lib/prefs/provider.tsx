"use client";

import { createContext, use, useCallback, useMemo, useState } from "react";
import {
  MODE_COOKIE,
  THEME_COOKIE,
  writeCookie,
  type InputMode,
  type LocalPrefs,
  type Theme,
} from "./config";
import { updateLocalPrefs, useLocalPrefs, useReducedMotion } from "./store";

type PrefsValue = LocalPrefs & {
  theme: Theme;
  mode: InputMode;
  reducedMotion: boolean;
  setTheme: (theme: Theme) => void;
  setMode: (mode: InputMode) => void;
  setLocalPrefs: (patch: Partial<LocalPrefs>) => void;
};

const PrefsContext = createContext<PrefsValue | null>(null);

export function PrefsProvider({
  initialTheme,
  initialMode,
  children,
}: {
  initialTheme: Theme;
  initialMode: InputMode;
  children: React.ReactNode;
}) {
  const [theme, setThemeState] = useState<Theme>(initialTheme);
  const [mode, setModeState] = useState<InputMode>(initialMode);
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

  const value = useMemo<PrefsValue>(
    () => ({
      ...local,
      theme,
      mode,
      reducedMotion,
      setTheme,
      setMode,
      setLocalPrefs: updateLocalPrefs,
    }),
    [local, theme, mode, reducedMotion, setTheme, setMode],
  );

  return <PrefsContext value={value}>{children}</PrefsContext>;
}

export function usePrefs(): PrefsValue {
  const value = use(PrefsContext);
  if (!value) throw new Error("usePrefs must be used inside <PrefsProvider>");
  return value;
}
