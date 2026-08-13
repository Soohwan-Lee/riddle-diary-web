import { describe, expect, it } from "vitest";
import { systemPrompt } from "@/lib/ai/prompt";
import { dictionaries } from "@/lib/i18n/dictionaries";
import { GLYPHS, GLYPH_BOX, glyphStrokes, isGlyphName } from "./glyph";

/** Every coordinate in a path, in order. */
function coordinates(d: string): number[] {
  return (d.match(/-?\d+(\.\d+)?/g) ?? []).map(Number);
}

describe("isGlyphName", () => {
  it("accepts the vocabulary and nothing else", () => {
    expect(isGlyphName("star")).toBe(true);
    expect(isGlyphName("unicorn")).toBe(false);
    expect(isGlyphName("")).toBe(false);
    // The whole point of a fixed list is that markup cannot get through.
    expect(isGlyphName("star\"/><script>")).toBe(false);
  });
});

describe("glyphStrokes", () => {
  it.each(GLYPHS)("draws %s as real path data", (name) => {
    const strokes = glyphStrokes(name, 4242);
    expect(strokes.length).toBeGreaterThan(0);

    for (const stroke of strokes) {
      expect(stroke.d.startsWith("M ")).toBe(true);
      expect(stroke.d).toContain("C ");
      expect(stroke.weight).toBeGreaterThan(0);
      expect(coordinates(stroke.d).every(Number.isFinite)).toBe(true);
    }
  });

  it.each(GLYPHS)("keeps %s inside its box", (name) => {
    // A little slack for the hand's drift and for a stroke that overshoots
    // where it began; anything further out would clip against the line above.
    for (const stroke of glyphStrokes(name, 77)) {
      for (const value of coordinates(stroke.d)) {
        expect(value).toBeGreaterThan(-1.5);
        expect(value).toBeLessThan(GLYPH_BOX + 1.5);
      }
    }
  });

  it("is deterministic for a seed, and different for another", () => {
    expect(glyphStrokes("heart", 1)).toEqual(glyphStrokes("heart", 1));
    expect(glyphStrokes("heart", 1)).not.toEqual(glyphStrokes("heart", 2));
  });

  it("gives the sun's disc more of the time than one of its rays", () => {
    const [disc, ...rays] = glyphStrokes("sun", 9);
    expect(rays).toHaveLength(8);
    expect(disc.weight).toBeGreaterThan(rays[0].weight * 2);
  });
});

/**
 * A drawing nobody can name is a drawing a screen reader passes over in
 * silence, and one the model is never told about is dead code. Both are easy
 * to forget when adding to the vocabulary, so neither is left to memory.
 */
describe("the vocabulary", () => {
  it.each(["ko", "en"] as const)("has a %s label for every glyph", (locale) => {
    const labels = dictionaries[locale].glyphs;
    expect(Object.keys(labels).sort()).toEqual([...GLYPHS].sort());
    for (const name of GLYPHS) expect(labels[name].trim().length).toBeGreaterThan(0);
  });

  it("is offered to the model in full", () => {
    const prompt = systemPrompt("en", "text");
    for (const name of GLYPHS) expect(prompt).toContain(`[[${name}]]`);
  });
});
