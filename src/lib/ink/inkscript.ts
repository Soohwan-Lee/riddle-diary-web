/**
 * InkScript — the tiny inline markup the page uses to ask for a mark.
 *
 *   __like this__   an underline
 *   ((like this))   a circle drawn around it
 *   ==like this==   a highlighter pass
 *
 * The parser runs on every streamed chunk, so it has one hard requirement:
 * the plain text it produces must be a stable prefix. A character that has
 * already been written must never move or disappear. Two rules keep that true:
 *
 *   - An unclosed opener is treated as a mark that is still growing, not as
 *     literal text. Its content flows out immediately and the range simply
 *     extends until the closer arrives.
 *   - A lone delimiter at the very end of an incomplete stream is held back
 *     for one chunk, since it may be half of a marker.
 */

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

export type ParsedInk = {
  text: string;
  marks: InkMarkRange[];
};

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

  let source = raw;
  if (!complete && AMBIGUOUS_TAIL.test(source) && !COMPLETE_TAIL.test(source)) {
    source = source.slice(0, -1);
  }

  let text = "";
  const marks: InkMarkRange[] = [];
  const open = new Map<InkMarkKind, InkMarkRange>();

  let i = 0;
  while (i < source.length) {
    const pair = source.slice(i, i + 2);
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

    text += source[i];
    i += 1;
  }

  // Anything still open runs to the end of what we have so far.
  for (const mark of open.values()) mark.end = text.length;

  // Zero-width marks are noise — they happen when the model emits `____`.
  return { text, marks: marks.filter((mark) => mark.end > mark.start) };
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
