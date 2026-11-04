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
/** The pen is the intended first experience; the keyboard is the fallback. */
export const DEFAULT_INPUT_MODE: InputMode = "hand";
export const MODE_COOKIE = "inkling.mode";

/**
 * The handwriting faces. Each is a Latin face paired with a Hangul one, so a
 * line that mixes scripts still looks like one person wrote it. Which hand is
 * in use is visible in the very first paint, so it travels in a cookie
 * alongside the theme rather than in localStorage.
 */
export const HANDS = ["pen", "quill", "brush", "print"] as const;
export type Hand = (typeof HANDS)[number];
export const DEFAULT_HAND_USER: Hand = "pen";
export const DEFAULT_HAND_AI: Hand = "quill";
export const HAND_USER_COOKIE = "inkling.hand.user";
export const HAND_AI_COOKIE = "inkling.hand.ai";

export function isHand(value: unknown): value is Hand {
  return typeof value === "string" && (HANDS as readonly string[]).includes(value);
}

/**
 * What the paper does between turns.
 *
 *   `blank` — the film's behaviour. What you hand over sinks into the page at
 *             once; the answer stays as long as it takes to read, then goes.
 *             You are always writing on an empty sheet.
 *   `keep`  — the exchange stays together and leaves together, after the
 *             dwell set below.
 */
export const PAGE_MODES = ["blank", "keep"] as const;
export type PageMode = (typeof PAGE_MODES)[number];
export const DEFAULT_PAGE_MODE: PageMode = "blank";

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
 *
 * Well past what a real hand can do, deliberately. What has to survive is the
 * sense of being written to, and that turns out to live in the per-character
 * rhythm rather than in the total: at `normal` a character takes 50ms, which
 * is still one visible stroke after another, and a two-sentence reply lands in
 * about three seconds. It reads as a quick hand, not as a paste.
 *
 * The rests scale with these numbers rather than sitting on top of them (see
 * `PAUSE_REFERENCE_CPM`), so a hand twice as fast really is twice as fast.
 * Change one of these and you have changed the tempo, not just the letters.
 */
export const WRITE_CPM: Record<WriteSpeed, number> = {
  slow: 720,
  normal: 1_200,
  brisk: 1_720,
};

/**
 * The hand the rests in `pauseAfter` were written for. It is a fixed reference
 * rather than `WRITE_CPM.normal`: the whole point is that the pauses shrink
 * when the hand speeds up, and pinning them to the default would freeze them
 * at whatever the default happens to be — a tax the tempo cannot outrun.
 */
export const PAUSE_REFERENCE_CPM = 600;

/**
 * How long a handwriting entry sits still before the page takes it. Short
 * enough that nobody wonders whether anything is going to happen, long enough
 * to cross a `t` or start another word. Any new stroke puts it back to zero.
 */
export const AUTO_HANDOFF_MS = 4_000;

export type LocalPrefs = {
  pageMode: PageMode;
  fadePace: FadePace;
  writeSpeed: WriteSpeed;
  allowFinger: boolean;
  /** Hand a finished piece of handwriting over once the pen stops. */
  autoHandoff: boolean;
  /** The three lines a first visit needs. Dismissed once, or from settings. */
  introSeen: boolean;
};

/**
 * Also the server snapshot, which is why `introSeen` starts *true*: rendering
 * the note during SSR and then hiding it a beat later would flash it at every
 * returning reader. `readLocalPrefs` turns it off when there are no stored
 * preferences at all, which is exactly the first visit.
 */
export const DEFAULT_LOCAL_PREFS: LocalPrefs = {
  pageMode: DEFAULT_PAGE_MODE,
  fadePace: DEFAULT_FADE_PACE,
  writeSpeed: DEFAULT_WRITE_SPEED,
  allowFinger: true,
  autoHandoff: true,
  introSeen: true,
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
    if (!raw) return { ...DEFAULT_LOCAL_PREFS, introSeen: false };
    const parsed = JSON.parse(raw) as Partial<LocalPrefs>;
    return {
      pageMode: (PAGE_MODES as readonly string[]).includes(parsed.pageMode ?? "")
        ? (parsed.pageMode as PageMode)
        : DEFAULT_PAGE_MODE,
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
      autoHandoff:
        typeof parsed.autoHandoff === "boolean"
          ? parsed.autoHandoff
          : DEFAULT_LOCAL_PREFS.autoHandoff,
      // Anyone whose stored preferences predate the note has not seen it.
      introSeen: parsed.introSeen === true,
    };
  } catch {
    return DEFAULT_LOCAL_PREFS;
  }
}
