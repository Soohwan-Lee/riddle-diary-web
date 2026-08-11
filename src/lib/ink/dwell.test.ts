import { describe, expect, it } from "vitest";
import { BLANK_FADE_MS, readDwellMs, readingWeight } from "./dwell";

describe("readingWeight", () => {
  it("costs a Hangul syllable more than a Latin letter", () => {
    expect(readingWeight("가")).toBeGreaterThan(readingWeight("a"));
  });

  it("treats Han characters like Hangul", () => {
    expect(readingWeight("漢")).toBe(readingWeight("한"));
  });

  it("barely counts whitespace", () => {
    expect(readingWeight(" ")).toBeLessThan(readingWeight("a"));
  });
});

describe("readDwellMs", () => {
  it("never drops below the floor, however short the reply", () => {
    expect(readDwellMs("Oh.", "normal")).toBe(4_500);
    expect(readDwellMs("", "normal")).toBe(4_500);
  });

  it("gives a longer reply longer", () => {
    const short = readDwellMs("That sounds like it was a hard day.", "normal");
    const long = readDwellMs(
      "That sounds like it was a hard day. ".repeat(8),
      "normal",
    );
    expect(long).toBeGreaterThan(short);
  });

  it("reads Korean and English of equivalent length in comparable time", () => {
    // Same sentence, two scripts. Character counts differ by a factor of two;
    // the time to read should not.
    const en = readDwellMs(
      "I kept thinking about it on the way home, and I still am, honestly. " +
        "It would not leave me alone for a single minute of the evening.",
      "normal",
    );
    const ko = readDwellMs(
      "집에 오는 길 내내 그 생각을 했고, 솔직히 지금도 하고 있어요. " +
        "저녁 내내 한순간도 저를 놓아주지 않았어요.",
      "normal",
    );
    expect(Math.abs(en - ko) / en).toBeLessThan(0.3);
  });

  it("scales with the fade pace", () => {
    const text = "That sounds like it was a hard day, start to finish.";
    expect(readDwellMs(text, "short")).toBeLessThan(readDwellMs(text, "normal"));
    expect(readDwellMs(text, "long")).toBeGreaterThan(
      readDwellMs(text, "normal"),
    );
  });

  it("caps a long reply before the estimate runs away", () => {
    const wall = readDwellMs("a".repeat(20_000), "normal");
    expect(wall).toBe(20_000);
  });

  it("ignores InkScript markers", () => {
    expect(readDwellMs("((circled)) and __underlined__ and ==lit==", "long")).toBe(
      readDwellMs("circled and underlined and lit", "long"),
    );
  });
});

describe("BLANK_FADE_MS", () => {
  it("has nothing to fade when fading is off", () => {
    expect(BLANK_FADE_MS.never).toBe(0);
  });
});
