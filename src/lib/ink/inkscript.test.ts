import { describe, expect, it } from "vitest";
import { GLYPH_PLACEHOLDER, parseInkScript, toGraphemeRange } from "./inkscript";

const box = GLYPH_PLACEHOLDER;

describe("parseInkScript", () => {
  it("strips delimiters and records ranges", () => {
    const { text, marks } = parseInkScript("a __b__ c ==d== e ((f))");
    expect(text).toBe("a b c d e f");
    expect(marks.map((mark) => [mark.kind, mark.start, mark.end])).toEqual([
      ["underline", 2, 3],
      ["highlight", 6, 7],
      ["circle", 10, 11],
    ]);
    expect(marks.every((mark) => !mark.open)).toBe(true);
  });

  it("keeps Hangul offsets intact", () => {
    const { text, marks } = parseInkScript("오늘은 __괜찮았어요__?");
    expect(text).toBe("오늘은 괜찮았어요?");
    expect(text.slice(marks[0].start, marks[0].end)).toBe("괜찮았어요");
  });

  it("treats an unclosed opener as a mark that is still growing", () => {
    const { text, marks } = parseInkScript("그건 __중요", { complete: false });
    expect(text).toBe("그건 중요");
    expect(marks[0].open).toBe(true);
    expect(marks[0].end).toBe(text.length);
  });

  it("produces a stable prefix as a stream arrives", () => {
    const full = "오늘 ((하루))는 ==길었==네요.";
    let previous = "";
    for (let i = 1; i <= full.length; i++) {
      const { text } = parseInkScript(full.slice(0, i), { complete: i === full.length });
      expect(text.startsWith(previous) || previous.startsWith(text)).toBe(true);
      // The written prefix must never shrink or rewrite itself.
      expect(text.length).toBeGreaterThanOrEqual(previous.length);
      previous = text;
    }
    expect(previous).toBe("오늘 하루는 길었네요.");
  });

  it("holds back a lone delimiter that might be half a marker", () => {
    expect(parseInkScript("wait _", { complete: false }).text).toBe("wait ");
    expect(parseInkScript("wait _", { complete: true }).text).toBe("wait _");
  });

  it("leaves unmatched closers as literal text", () => {
    expect(parseInkScript("smile :)) really").text).toBe("smile :)) really");
  });

  it("drops empty marks", () => {
    expect(parseInkScript("____").marks).toEqual([]);
  });

  it("keeps the source free of both delimiters and the placeholder", () => {
    const { text, source } = parseInkScript("a __b__ [[star]] c");
    expect(text).toBe(`a b ${box} c`);
    // What history and the transcript get: no markup, no invisible character.
    expect(source).toBe("a b [[star]] c");
  });
});

describe("parseInkScript · drawings", () => {
  it("takes one character's worth of room, in order", () => {
    const { text, glyphs } = parseInkScript("here [[moon]] and [[wave]]");
    expect(text).toBe(`here ${box} and ${box}`);
    expect(glyphs.map((g) => [g.name, g.index])).toEqual([
      ["moon", 5],
      ["wave", 11],
    ]);
  });

  it("leaves a name it does not know as text", () => {
    const { text, glyphs } = parseInkScript("a [[unicorn]] b");
    expect(text).toBe("a [[unicorn]] b");
    expect(glyphs).toEqual([]);
  });

  it("cannot be talked into emitting markup", () => {
    const raw = 'x [[star"/><script>alert(1)</script>]] y';
    const { text, glyphs } = parseInkScript(raw);
    expect(glyphs).toEqual([]);
    expect(text).toBe(raw);
  });

  it("keeps at most two, and drops the rest quietly", () => {
    const { text, glyphs } = parseInkScript("[[sun]][[moon]][[star]][[leaf]]");
    expect(glyphs.map((g) => g.name)).toEqual(["sun", "moon"]);
    expect(text).toBe(box + box);
  });

  it("counts positions in the marked-up text, so a mark can enclose one", () => {
    const { text, marks, glyphs } = parseInkScript("((a [[star]]))");
    expect(text).toBe(`a ${box}`);
    expect(glyphs[0].index).toBe(2);
    expect(marks[0]).toMatchObject({ kind: "circle", start: 0, end: 3 });
  });

  it("waits for the closing bracket rather than writing half a name", () => {
    for (const partial of ["a [", "a [[", "a [[s", "a [[star", "a [[star]"]) {
      expect(parseInkScript(partial, { complete: false }).text).toBe("a ");
    }
    // Once the stream is over, an unclosed opener is just characters.
    expect(parseInkScript("a [[star", { complete: true }).text).toBe("a [[star");
  });

  it("produces a stable prefix as a drawing streams in", () => {
    const full = "오늘 [[sun]] 하루는 __길었__네요. [[wave]]";
    let previous = "";
    for (let i = 1; i <= full.length; i++) {
      const { text } = parseInkScript(full.slice(0, i), {
        complete: i === full.length,
      });
      expect(text.startsWith(previous)).toBe(true);
      previous = text;
    }
    expect(previous).toBe(`오늘 ${box} 하루는 길었네요. ${box}`);
  });

  it("leaves a stray bracket alone", () => {
    expect(parseInkScript("note [1] and [x").text).toBe("note [1] and [x");
  });
});

describe("toGraphemeRange", () => {
  it("maps code-unit offsets onto grapheme indices", () => {
    const chars = ["오", "늘", " ", "괜", "찮", "아"];
    expect(toGraphemeRange(chars, 3, 6)).toEqual({ start: 3, end: 6 });
  });

  it("handles surrogate pairs", () => {
    const chars = ["a", "👋", "b"];
    // "👋" occupies two code units, so "b" starts at offset 3.
    expect(toGraphemeRange(chars, 3, 4)).toEqual({ start: 2, end: 3 });
  });
});
