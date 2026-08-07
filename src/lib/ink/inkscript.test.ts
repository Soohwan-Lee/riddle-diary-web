import { describe, expect, it } from "vitest";
import { parseInkScript, toGraphemeRange } from "./inkscript";

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
