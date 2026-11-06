import { describe, expect, it } from "vitest";
import { strokeShape } from "./stroke-order";

describe("strokeShape", () => {
  it("puts the vowel down the right when it is vertical", () => {
    expect(strokeShape("가")).toBe("v");
    expect(strokeShape("너")).toBe("v");
    expect(strokeShape("미")).toBe("v");
    expect(strokeShape("개")).toBe("v");
  });

  it("writes the final consonant last, along the bottom", () => {
    expect(strokeShape("각")).toBe("vf");
    expect(strokeShape("렸")).toBe("vf");
    expect(strokeShape("곡")).toBe("hf");
    expect(strokeShape("음")).toBe("hf");
    expect(strokeShape("관")).toBe("cf");
  });

  it("stacks the vowel beneath when it is horizontal", () => {
    expect(strokeShape("고")).toBe("h");
    expect(strokeShape("누")).toBe("h");
    expect(strokeShape("므")).toBe("h");
    expect(strokeShape("요")).toBe("h");
  });

  it("treats a compound vowel as the bottom stroke, then the right", () => {
    expect(strokeShape("과")).toBe("c");
    expect(strokeShape("뉘")).toBe("c");
    expect(strokeShape("의")).toBe("c");
  });

  it("covers both ends of the syllable block", () => {
    expect(strokeShape("가")).toBe("v");
    expect(strokeShape("힣")).toBe("vf");
  });

  it("leaves everything else to the left-to-right pen", () => {
    for (const char of ["a", "Q", "7", ".", " ", "ㄱ", "ㅏ", "字", "", "👩‍👩‍👧"]) {
      expect(strokeShape(char)).toBe("line");
    }
  });
});
