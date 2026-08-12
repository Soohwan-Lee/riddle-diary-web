/**
 * InkScript — the tiny inline markup the page uses to ask for a mark, or for
 * one of the small things Riddle can draw.
 *
 *   __like this__   an underline
 *   ((like this))   a circle drawn around it
 *   ==like this==   a highlighter pass
 *   [[star]]        a drawing, from the fixed vocabulary in `glyph.ts`
 *
 * The parser runs on every streamed chunk, so it has one hard requirement:
 * the plain text it produces must be a stable prefix. A character that has
 * already been written must never move or disappear. Three rules keep that
 * true:
 *
 *   - An unclosed opener is treated as a mark that is still growing, not as
 *     literal text. Its content flows out immediately and the range simply
 *     extends until the closer arrives.
 *   - A lone delimiter at the very end of an incomplete stream is held back
 *     for one chunk, since it may be half of a marker.
 *   - A drawing cannot do either of those: half a name is not half a drawing.
 *     An unclosed `[[` therefore truncates the text until its `]]` arrives.
 *     Once the stream is complete it is nothing special, just characters.
 */

import { isGlyphName, type GlyphName } from "./glyph";

export const MARK_KINDS = ["underline", "circle", "highlight"] as const;
export type InkMarkKind = (typeof MARK_KINDS)[number];

export type InkMarkRange = {
  id: string;
  kind: InkMarkKind;
  /** Offsets into the plain text, in code units. */
  start: number;
  end: number;
  /** True while the closing delimiter has not arrived yet. */
  open: boolean;
};

export type InkGlyphRef = {
  id: string;
  name: GlyphName;
  /** Offset into the plain text, in code units. */
  index: number;
};

export type ParsedInk = {
  /**
   * What gets written, with U+FFFC standing in for each drawing. The
   * placeholder has to be there: it holds the position that mark ranges and
   * grapheme indices are counted against.
   */
  text: string;
  /**
   * The same thing with the drawings still written as `[[name]]`, and no mark
   * delimiters. This is what leaves the renderer — history keeps it, so Riddle
   * can see what it drew, and the transcript turns the tokens into words. The
   * placeholder never gets out.
   */
  source: string;
  marks: InkMarkRange[];
  glyphs: InkGlyphRef[];
};

/**
 * U+FFFC OBJECT REPLACEMENT CHARACTER — what Unicode reserves for "something
 * that is not text goes here". Spelled as an escape because the character
 * itself is invisible, and a constant you cannot see in the source is a
 * constant nobody can grep for.
 */
export const GLYPH_PLACEHOLDER = String.fromCharCode(0xfffc);

/**
 * More than two drawings in a two-sentence reply is not a diary page any
 * more. The prompt asks for restraint; this is what happens when it is not
 * given. Extras are dropped rather than shown, and the decision is the same
 * at every prefix, so dropping one cannot unwrite a character.
 */
const MAX_GLYPHS = 2;

type Delimiter = { token: string; kind: InkMarkKind; role: "open" | "close" | "both" };

const DELIMITERS: Delimiter[] = [
  { token: "__", kind: "underline", role: "both" },
  { token: "==", kind: "highlight", role: "both" },
  { token: "((", kind: "circle", role: "open" },
  { token: "))", kind: "circle", role: "close" },
];

const AMBIGUOUS_TAIL = /[_=()]$/;
const COMPLETE_TAIL = /(__|==|\(\(|\)\))$/;

export function parseInkScript(
  raw: string,
  options: { complete?: boolean } = {},
): ParsedInk {
  const complete = options.complete ?? true;

  let input = raw;
  if (!complete && AMBIGUOUS_TAIL.test(input) && !COMPLETE_TAIL.test(input)) {
    input = input.slice(0, -1);
  }

  let text = "";
  let source = "";
  const marks: InkMarkRange[] = [];
  const glyphs: InkGlyphRef[] = [];
  const open = new Map<InkMarkKind, InkMarkRange>();

  let i = 0;
  while (i < input.length) {
    const pair = input.slice(i, i + 2);

    // A `[` with nothing after it yet could be the start of a drawing or an
    // ordinary bracket, and there is no taking it back once written. This
    // cannot be trimmed off the tail before the loop the way a half-marker is:
    // that would eat the second `[` of a `[[` and hide the first from the
    // check below.
    if (!complete && input[i] === "[" && i === input.length - 1) break;

    if (pair === "[[") {
      const close = input.indexOf("]]", i + 2);

      if (close === -1 && !complete) {
        // The name is still arriving. Letting it through as text and taking
        // it back once the `]]` lands would unwrite characters already on the
        // paper, so everything from here waits for the next chunk.
        break;
      }

      const name = close === -1 ? "" : input.slice(i + 2, close);
      if (isGlyphName(name)) {
        if (glyphs.length < MAX_GLYPHS) {
          glyphs.push({ id: `${name}-${text.length}`, name, index: text.length });
          text += GLYPH_PLACEHOLDER;
          source += `[[${name}]]`;
        }
        i = close + 2;
        continue;
      }
      // Not a name it knows, or never closed at all: ordinary characters.
    }

    const delimiter = DELIMITERS.find((entry) => entry.token === pair);

    if (delimiter) {
      const active = open.get(delimiter.kind);

      if (active && delimiter.role !== "open") {
        active.end = text.length;
        active.open = false;
        open.delete(delimiter.kind);
        i += 2;
        continue;
      }

      if (!active && delimiter.role !== "close") {
        const mark: InkMarkRange = {
          id: `${delimiter.kind}-${text.length}`,
          kind: delimiter.kind,
          start: text.length,
          end: text.length,
          open: true,
        };
        marks.push(mark);
        open.set(delimiter.kind, mark);
        i += 2;
        continue;
      }
      // A closer with nothing open, or an opener token used as a closer for a
      // kind that is not open: fall through and treat it as literal text.
    }

    text += input[i];
    source += input[i];
    i += 1;
  }

  // Anything still open runs to the end of what we have so far.
  for (const mark of open.values()) mark.end = text.length;

  // Zero-width marks are noise — they happen when the model emits `____`.
  return { text, source, glyphs, marks: marks.filter((m) => m.end > m.start) };
}

/**
 * Maps a code-unit range in the plain text onto grapheme indices, which is
 * what the renderer addresses characters by.
 */
export function toGraphemeRange(
  graphemeChars: readonly string[],
  startUnits: number,
  endUnits: number,
): { start: number; end: number } {
  let units = 0;
  let start = graphemeChars.length;
  let end = graphemeChars.length;

  for (let i = 0; i < graphemeChars.length; i++) {
    if (units <= startUnits && start === graphemeChars.length && units + graphemeChars[i].length > startUnits) {
      start = i;
    }
    units += graphemeChars[i].length;
    if (units >= endUnits) {
      end = i + 1;
      break;
    }
  }

  if (startUnits <= 0) start = 0;
  return { start: Math.min(start, end), end };
}
