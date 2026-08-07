/**
 * Preferences that change what the very first paint looks like live in
 * cookies, so the server can render them and nothing flashes. Everything else
 * lives in localStorage and hydrates a beat later without visual cost.
 */

export const THEMES = ["light", "dark", "system"] as const;
export type Theme = (typeof THEMES)[number];
export const DEFAULT_THEME: Theme = "system";
export const THEME_COOKIE = "inkling.theme";

export const INPUT_MODES = ["hand", "type"] as const;
export type InputMode = (typeof INPUT_MODES)[number];
export const DEFAULT_INPUT_MODE: InputMode = "type";
export const MODE_COOKIE = "inkling.mode";

/** How long ink rests after it is written, before it starts thinning out. */
export const FADE_PACES = ["short", "normal", "long", "never"] as const;
export type FadePace = (typeof FADE_PACES)[number];
export const DEFAULT_FADE_PACE: FadePace = "normal";

export const DWELL_MS: Record<FadePace, number> = {
  short: 30_000,
  normal: 90_000,
  long: 300_000,
  never: Number.POSITIVE_INFINITY,
};

/** How long the thinning-out itself takes. */
export const FADE_MS: Record<FadePace, number> = {
  short: 6_000,
  normal: 12_000,
  long: 20_000,
  never: 0,
};

/**
 * The page writes at roughly a human hand's pace. The ceiling is deliberate:
 * there is no "instant" option, because waiting is the point.
 */
export const WRITE_SPEEDS = ["slow", "normal", "brisk"] as const;
export type WriteSpeed = (typeof WRITE_SPEEDS)[number];
export const DEFAULT_WRITE_SPEED: WriteSpeed = "normal";

/**
 * Characters per minute, script-independent — the layout normalises its
 * per-character weights so Korean and English take the same total time.
 * A two-sentence reply lands around fifteen seconds at `normal`: long enough
 * to feel written, short enough that nobody walks away.
 */
export const WRITE_CPM: Record<WriteSpeed, number> = {
  slow: 120,
  normal: 190,
  brisk: 280,
};

export type LocalPrefs = {
  fadePace: FadePace;
  writeSpeed: WriteSpeed;
  allowFinger: boolean;
};

export const DEFAULT_LOCAL_PREFS: LocalPrefs = {
  fadePace: DEFAULT_FADE_PACE,
  writeSpeed: DEFAULT_WRITE_SPEED,
  allowFinger: true,
};

export const LOCAL_PREFS_KEY = "inkling.prefs";

export function isTheme(value: unknown): value is Theme {
  return typeof value === "string" && (THEMES as readonly string[]).includes(value);
}

export function isInputMode(value: unknown): value is InputMode {
  return (
    typeof value === "string" && (INPUT_MODES as readonly string[]).includes(value)
  );
}

export function writeCookie(name: string, value: string) {
  document.cookie = `${name}=${value}; path=/; max-age=31536000; samesite=lax`;
}

export function readLocalPrefs(): LocalPrefs {
  if (typeof window === "undefined") return DEFAULT_LOCAL_PREFS;
  try {
    const raw = window.localStorage.getItem(LOCAL_PREFS_KEY);
    if (!raw) return DEFAULT_LOCAL_PREFS;
    const parsed = JSON.parse(raw) as Partial<LocalPrefs>;
    return {
      fadePace: (FADE_PACES as readonly string[]).includes(parsed.fadePace ?? "")
        ? (parsed.fadePace as FadePace)
        : DEFAULT_FADE_PACE,
      writeSpeed: (WRITE_SPEEDS as readonly string[]).includes(parsed.writeSpeed ?? "")
        ? (parsed.writeSpeed as WriteSpeed)
        : DEFAULT_WRITE_SPEED,
      allowFinger:
        typeof parsed.allowFinger === "boolean"
          ? parsed.allowFinger
          : DEFAULT_LOCAL_PREFS.allowFinger,
    };
  } catch {
    return DEFAULT_LOCAL_PREFS;
  }
}
