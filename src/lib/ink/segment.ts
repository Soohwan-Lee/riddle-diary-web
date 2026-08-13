import { PAUSE_REFERENCE_CPM } from "@/lib/prefs/config";
import { GLYPH_PLACEHOLDER } from "./inkscript";
import { noiseAt } from "./random";

/**
 * Turns a string into a writing schedule: one entry per grapheme, each with
 * how long the hand spends on it and how long it rests afterwards. Hangul
 * syllables take longer than Latin letters because they are three or four
 * strokes stacked into one square; punctuation buys thinking time.
 */

export type InkGrapheme = {
  char: string;
  /** Absolute index across the whole text, marks stripped. */
  index: number;
  durationMs: number;
  pauseAfterMs: number;
  /** Whitespace is scheduled but drawn as a plain text node. */
  whitespace: boolean;
};

export type InkWord = {
  key: string;
  /** Position across the whole text — drives the staggered fade. */
  order: number;
  indices: number[];
  /** Whitespace that follows the word, rendered verbatim. */
  trailing: string;
};

export type InkLine = {
  key: string;
  words: InkWord[];
  /**
   * The line holds drawings and nothing else. Then it is not a word in a
   * sentence but a gesture on its own, and the renderer gives it room.
   */
  solo: boolean;
};

export type InkLayout = {
  graphemes: InkGrapheme[];
  lines: InkLine[];
  totalMs: number;
};

const HANGUL_SYLLABLE = /[가-힣]/;
const HANGUL_JAMO = /[ᄀ-ᇿ㄰-㆏ꥠ-꥿]/;
const CJK = /[㐀-䶿一-鿿豈-﫿]/;
const KANA = /[぀-ヿ]/;
const DIGIT = /[0-9]/;
const LETTER = /\p{L}/u;

/** Multiplier on the base per-character duration. */
export function strokeWeight(char: string): number {
  if (/\s/.test(char)) return 0.34;
  if (HANGUL_SYLLABLE.test(char)) return 1.5;
  if (HANGUL_JAMO.test(char)) return 1.1;
  if (CJK.test(char)) return 1.7;
  if (KANA.test(char)) return 1.15;
  if (DIGIT.test(char)) return 0.9;
  if (LETTER.test(char)) return 1;
  return 0.65;
}

/**
 * Extra rest after a character — the pen lifting, or the mind catching up.
 *
 * These are written for `PAUSE_REFERENCE_CPM` and the layout scales them from
 * there, so a slow hand rests longer between sentences and a brisk one less.
 * Left absolute, they would be a fixed tax that swallows a fast hand's gains:
 * at twice the speed they would be a fifth of the reply.
 */
export function pauseAfter(char: string): number {
  if (char === "\n") return 420;
  if (/[.!?。！？…]/.test(char)) return 320;
  if (/[,、·;:]/.test(char)) return 140;
  if (/\s/.test(char)) return 60;
  return 0;
}

function splitGraphemes(text: string, locale: string): string[] {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const segmenter = new Intl.Segmenter(locale, { granularity: "grapheme" });
    return Array.from(segmenter.segment(text), (entry) => entry.segment);
  }
  return Array.from(text);
}

export type LayoutOptions = {
  /** Characters per minute the hand writes at. */
  cpm: number;
  locale: string;
  /** Stable seed so jitter survives re-renders. */
  seed: number;
};

/** Per-character time at the hand the rests are written for. */
const PAUSE_REFERENCE_MS = 60_000 / PAUSE_REFERENCE_CPM;

/**
 * A drawing takes one character's room in the line but nothing like one
 * character's time. Both figures are written for the reference hand and scale
 * with the real one, like the rests.
 *
 * Deliberately not proportional to a character: a drawing is the one thing on
 * the page that is watched rather than read, and a nine-stroke sun that lands
 * in a third of a second is a flicker, not a hand. At the default it comes out
 * near a second, which is enough to see it being made.
 */
const GLYPH_MS = 1_900;
const GLYPH_REST_MS = 400;

/**
 * A drawing alone on its line is drawn larger, so it is also drawn for longer.
 * The clock has to know: if the renderer stretched it instead, the node would
 * report itself written while the last stroke was still going.
 */
const GLYPH_SOLO_SCALE = 1.6;

const isDrawing = (char: string) => char === GLYPH_PLACEHOLDER;

/** Drawings and nothing else — not even a word beside them. */
function isSoloLine(rawLine: string): boolean {
  const marks = [...rawLine].filter((char) => !/\s/.test(char));
  return marks.length > 0 && marks.every(isDrawing);
}

export function layoutText(text: string, options: LayoutOptions): InkLayout {
  const { cpm, locale, seed } = options;
  const baseMs = 60_000 / Math.max(1, cpm);

  const pauseScale = baseMs / PAUSE_REFERENCE_MS;
  const restAfter = (char: string) => Math.round(pauseAfter(char) * pauseScale);

  const graphemes: InkGrapheme[] = [];
  const lines: InkLine[] = [];

  let index = 0;
  let order = 0;
  let totalMs = 0;

  // A trailing "\n" would otherwise be dropped by split, and an empty line is
  // meaningful in a diary.
  const rawLines = text.split("\n");

  rawLines.forEach((rawLine, lineNumber) => {
    const solo = isSoloLine(rawLine);
    const glyphMs = GLYPH_MS * (solo ? GLYPH_SOLO_SCALE : 1) * pauseScale;
    const words: InkWord[] = [];
    // Keep the separators so spacing survives the round trip.
    const tokens = rawLine.split(/(\s+)/).filter((token) => token.length > 0);

    let pendingWord: InkWord | null = null;

    for (const token of tokens) {
      const isSpace = /^\s+$/.test(token);

      if (isSpace) {
        for (const char of splitGraphemes(token, locale)) {
          const duration = baseMs * strokeWeight(char);
          graphemes.push({
            char,
            index,
            durationMs: duration,
            pauseAfterMs: restAfter(char),
            whitespace: true,
          });
          totalMs += duration + restAfter(char);
          index += 1;
        }
        if (pendingWord) pendingWord.trailing += token;
        continue;
      }

      const word: InkWord = { key: `w${index}`, order, indices: [], trailing: "" };
      order += 1;
      for (const char of splitGraphemes(token, locale)) {
        // ±18% so no two neighbouring characters take exactly as long.
        const jitter = 1 + noiseAt(seed, index) * 0.18;
        const duration = isDrawing(char)
          ? glyphMs
          : baseMs * strokeWeight(char) * jitter;
        const rest = isDrawing(char)
          ? Math.round(GLYPH_REST_MS * pauseScale)
          : restAfter(char);
        graphemes.push({
          char,
          index,
          durationMs: duration,
          pauseAfterMs: rest,
          whitespace: false,
        });
        word.indices.push(index);
        totalMs += duration + rest;
        index += 1;
      }
      words.push(word);
      pendingWord = word;
    }

    if (lineNumber < rawLines.length - 1) {
      const duration = baseMs * 0.2;
      graphemes.push({
        char: "\n",
        index,
        durationMs: duration,
        pauseAfterMs: restAfter("\n"),
        whitespace: true,
      });
      totalMs += duration + restAfter("\n");
      index += 1;
    }

    lines.push({ key: `l${lineNumber}`, words, solo });
  });

  // Weights shape the rhythm, they should not change the tempo: a Hangul
  // syllable still takes longer than an `a`, but a Korean sentence and an
  // English one of the same length finish together. Without this, `cpm` would
  // mean something different in every script.
  //
  // Drawings sit outside it entirely. This normalisation exists to hold two
  // scripts to one tempo, and a drawing is neither script — folded in, it
  // would be squeezed to a character's worth of time and every letter beside
  // it would slow down to make room.
  const lettered = graphemes.filter((grapheme) => !isDrawing(grapheme.char));
  if (lettered.length > 0) {
    const target = lettered.length * baseMs;
    const written = lettered.reduce((sum, g) => sum + g.durationMs, 0);
    if (written > 0) {
      const scale = target / written;
      totalMs = 0;
      for (const grapheme of graphemes) {
        if (!isDrawing(grapheme.char)) grapheme.durationMs *= scale;
        totalMs += grapheme.durationMs + grapheme.pauseAfterMs;
      }
    }
  }

  return { graphemes, lines, totalMs };
}

/**
 * Index of the last grapheme belonging to a word, used to decide when a
 * word's trailing space should appear.
 */
export function wordEnd(word: InkWord): number {
  return word.indices.length > 0 ? word.indices[word.indices.length - 1] : -1;
}
