/**
 * Which order the pen visits the parts of a character in.
 *
 * Text has no stroke data, so the reveal cannot trace a letter. What it can
 * do is uncover the regions of the character's box in the order a hand fills
 * them. For a Latin letter that is simply left to right. A Hangul syllable is
 * not written left to right at all: the initial consonant goes in first, then
 * the vowel beside or beneath it, then the final consonant along the bottom.
 * A left-to-right wipe uncovers the 받침 of 각 together with its ㄱ, which is
 * the one thing a Korean reader is sure a hand never does.
 *
 * Each shape names a set of `ink-write-*` keyframes in `ink.css`.
 *
 *   `v`   initial left, vowel down the right            가 너 미
 *   `vf`  the same, then the final along the bottom     각 넣 민
 *   `h`   initial on top, vowel beneath                 고 누 므
 *   `hf`  initial, vowel, final as three bands          곡 눈 믈
 *   `c`   initial, the horizontal stroke, then the
 *         vertical one down the right                   과 뉘 의
 *   `cf`  the same, then the final                      관 뉩 읜
 */
export type StrokeShape = "line" | "v" | "vf" | "h" | "hf" | "c" | "cf";

const SYLLABLE_BASE = 0xac00;
const SYLLABLE_LAST = 0xd7a3;
const MEDIALS = 21;
const FINALS = 28;

/*
 * Medial vowels by index (ㅏ ㅐ ㅑ ㅒ ㅓ ㅔ ㅕ ㅖ ㅗ ㅘ ㅙ ㅚ ㅛ ㅜ ㅝ ㅞ ㅟ ㅠ ㅡ ㅢ ㅣ).
 * Where the vowel sits decides where the initial consonant goes.
 */
const VERTICAL = new Set([0, 1, 2, 3, 4, 5, 6, 7, 20]);
const HORIZONTAL = new Set([8, 12, 13, 17, 18]);

export function strokeShape(char: string): StrokeShape {
  const code = char.codePointAt(0);
  if (code === undefined || char.length !== 1) return "line";
  if (code < SYLLABLE_BASE || code > SYLLABLE_LAST) return "line";

  const offset = code - SYLLABLE_BASE;
  const medial = Math.floor(offset / FINALS) % MEDIALS;
  const hasFinal = offset % FINALS !== 0;

  if (VERTICAL.has(medial)) return hasFinal ? "vf" : "v";
  if (HORIZONTAL.has(medial)) return hasFinal ? "hf" : "h";
  return hasFinal ? "cf" : "c";
}
