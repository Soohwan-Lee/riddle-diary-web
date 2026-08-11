import type { FadePace } from "@/lib/prefs/config";

/**
 * How long ink stays on the page in blank-page mode.
 *
 * The film this borrows from never lets two things share the paper: what you
 * write sinks in as soon as you hand it over, and the answer stays exactly as
 * long as it takes to read, then goes. So the dwell cannot be a fixed number —
 * it has to be a reading estimate.
 */

/**
 * Weighted units a reader gets through in a minute. Scripts are not read at
 * the same rate per character: a Hangul syllable or a Han character carries
 * roughly a short Latin word, so it costs more units but there are far fewer
 * of them. Weighting here and dividing by one constant keeps Korean and
 * English replies feeling like the same amount of time to read.
 */
const READ_UPM = 900;

const HANGUL = /[가-힣ᄀ-ᇿ㄰-㆏]/;
const CJK = /[㐀-䶿一-鿿豈-﫿]/;
const KANA = /[぀-ヿ]/;

/** A beat after the last word before it starts to go. */
const TAIL_MS = 1_200;
/** Bounds on the estimate itself, before the pace multiplier. */
const MIN_READ_MS = 4_500;
const MAX_READ_MS = 20_000;

/** In blank-page mode the fade-pace control scales the reading estimate. */
const PACE_SCALE: Record<FadePace, number> = {
  short: 0.6,
  normal: 1,
  long: 1.8,
  never: 1,
};

/** How long the thinning itself takes once the reading time is up. */
export const BLANK_FADE_MS: Record<FadePace, number> = {
  short: 3_000,
  normal: 5_000,
  long: 8_000,
  never: 0,
};

/**
 * What you hand over is taken almost at once — long enough to see it happen,
 * short enough that it reads as the page absorbing it rather than as a fade.
 */
export const ABSORB_DWELL_MS = 900;
export const ABSORB_FADE_MS = 1_800;

/** Strips InkScript markers, which are instructions rather than words. */
function plain(text: string): string {
  return text.replace(/__|==|\(\(|\)\)/g, "");
}

export function readingWeight(char: string): number {
  if (/\s/.test(char)) return 0.4;
  if (HANGUL.test(char) || CJK.test(char)) return 2.6;
  if (KANA.test(char)) return 1.8;
  return 1;
}

/** Reading time for a finished reply, in milliseconds. */
export function readDwellMs(raw: string, pace: FadePace): number {
  const text = plain(raw);
  let units = 0;
  for (const char of text) units += readingWeight(char);

  const estimate = (units / READ_UPM) * 60_000 + TAIL_MS;
  // Clamp the estimate, then scale: otherwise "short" and "long" would both
  // collapse onto the floor for the one- and two-sentence replies that make up
  // almost everything the page writes.
  const bounded = Math.min(MAX_READ_MS, Math.max(MIN_READ_MS, estimate));
  return Math.round(bounded * PACE_SCALE[pace]);
}
