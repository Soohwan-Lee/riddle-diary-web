import { describe, expect, it } from "vitest";
import { layoutText, pauseAfter, strokeWeight } from "./segment";

const options = { cpm: 72, locale: "ko-KR", seed: 12345 };

describe("strokeWeight", () => {
  it("gives a Hangul syllable more time than a Latin letter", () => {
    expect(strokeWeight("가")).toBeGreaterThan(strokeWeight("a"));
  });

  it("costs least for whitespace and punctuation", () => {
    expect(strokeWeight(" ")).toBeLessThan(strokeWeight("."));
    expect(strokeWeight(".")).toBeLessThan(strokeWeight("a"));
  });
});

describe("pauseAfter", () => {
  it("rests longest at a line break and a sentence end", () => {
    expect(pauseAfter("\n")).toBeGreaterThan(pauseAfter("."));
    expect(pauseAfter(".")).toBeGreaterThan(pauseAfter(","));
    expect(pauseAfter(",")).toBeGreaterThan(pauseAfter(" "));
    expect(pauseAfter("a")).toBe(0);
  });
});

describe("layoutText", () => {
  it("reconstructs the source exactly", () => {
    const text = "오늘은 조금 지쳤어요.\n\n그래도 괜찮아요 :)";
    const layout = layoutText(text, options);
    expect(layout.graphemes.map((g) => g.char).join("")).toBe(text);
  });

  it("assigns contiguous indices", () => {
    const layout = layoutText("hello there\nfriend", options);
    layout.graphemes.forEach((grapheme, index) => {
      expect(grapheme.index).toBe(index);
    });
  });

  it("keeps words unbroken and lines separate", () => {
    const layout = layoutText("one two\nthree", options);
    expect(layout.lines).toHaveLength(2);
    expect(layout.lines[0].words.map((w) => w.indices.length)).toEqual([3, 3]);
    expect(layout.lines[0].words[0].trailing).toBe(" ");
    expect(layout.lines[1].words).toHaveLength(1);
  });

  it("is deterministic for a given seed", () => {
    const a = layoutText("떨리는 손으로", options);
    const b = layoutText("떨리는 손으로", options);
    expect(a.graphemes.map((g) => g.durationMs)).toEqual(
      b.graphemes.map((g) => g.durationMs),
    );
  });

  it("varies neighbouring characters so the rhythm is not mechanical", () => {
    const layout = layoutText("aaaaaaaa", options);
    const durations = new Set(layout.graphemes.map((g) => Math.round(g.durationMs)));
    expect(durations.size).toBeGreaterThan(1);
  });

  it("holds the requested tempo", () => {
    const text = "오늘은 생각보다 긴 하루였습니다";
    const layout = layoutText(text, options);
    const expected = ([...text].length * 60_000) / options.cpm;
    // Only the pauses may push past the nominal duration.
    expect(layout.totalMs).toBeGreaterThanOrEqual(expected - 1);
    expect(layout.totalMs).toBeLessThan(expected + 1_000);
  });

  it("takes the same time in Korean as in English for the same length", () => {
    const korean = layoutText("오늘은참길었던하루였습니다열여덟자", options);
    const latin = layoutText("todaywasaverylong", options);
    expect(korean.graphemes).toHaveLength(latin.graphemes.length);
    expect(korean.totalMs).toBeCloseTo(latin.totalMs, 5);
  });

  it("still spends longer on a Hangul syllable than on a Latin letter", () => {
    const layout = layoutText("가a가a가a", options);
    const hangul = layout.graphemes[0].durationMs;
    const latin = layout.graphemes[1].durationMs;
    expect(hangul).toBeGreaterThan(latin);
  });

  it("scales with the requested speed", () => {
    const slow = layoutText("한 줄만 적어요", { ...options, cpm: 40 });
    const fast = layoutText("한 줄만 적어요", { ...options, cpm: 120 });
    expect(slow.totalMs).toBeGreaterThan(fast.totalMs * 2);
  });

  it("handles an empty string", () => {
    const layout = layoutText("", options);
    expect(layout.graphemes).toEqual([]);
    expect(layout.lines).toHaveLength(1);
    expect(layout.totalMs).toBe(0);
  });

  it("keeps combining emoji as one grapheme", () => {
    const layout = layoutText("👩‍👩‍👧", { ...options, locale: "en-US" });
    expect(layout.graphemes).toHaveLength(1);
  });
});
