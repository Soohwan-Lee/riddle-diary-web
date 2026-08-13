import { beforeEach, describe, expect, it } from "vitest";
import { paperIsClear, useSession, whenPaperClears } from "./session";

const reset = () => useSession.getState().clearAll();

describe("paperIsClear", () => {
  beforeEach(reset);

  it("counts an empty sheet as clear", () => {
    expect(paperIsClear([])).toBe(true);
  });

  it("does not count a reply that has not been written into yet", () => {
    useSession.getState().beginReply();
    // A slot, not ink: the node exists so the first character has somewhere
    // to land, and the page still looks empty.
    expect(paperIsClear(useSession.getState().turns)).toBe(true);
  });

  it("counts words and strokes from either hand", () => {
    useSession.getState().greet("무엇이든 적어보세요");
    expect(paperIsClear(useSession.getState().turns)).toBe(false);

    reset();
    useSession.getState().addUserTurn({ raw: "", strokes: [[[1, 2, 0.5]]] });
    expect(paperIsClear(useSession.getState().turns)).toBe(false);
  });
});

describe("whenPaperClears", () => {
  beforeEach(reset);

  it("resolves at once when nothing is on the paper", async () => {
    await expect(whenPaperClears()).resolves.toBeUndefined();
  });

  /**
   * The bug this exists for: the wait was once taken from a React snapshot,
   * which still described the page as it looked before the entry landed. On
   * the second turn that snapshot said "empty" and the reply began writing on
   * top of the reader's own words.
   */
  it("does not resolve for an entry handed over this tick", async () => {
    useSession.getState().addUserTurn({ raw: "오늘은 좀 지쳤어요" });

    let opened = false;
    void whenPaperClears().then(() => {
      opened = true;
    });
    await Promise.resolve();
    expect(opened).toBe(false);

    const { turns, removeTurn } = useSession.getState();
    removeTurn(turns[0].id);
    await Promise.resolve();
    expect(opened).toBe(true);
  });

  it("waits for the last of several turns to go", async () => {
    const session = useSession.getState();
    session.greet("무엇이든 적어보세요");
    session.addUserTurn({ raw: "오늘은 좀 지쳤어요" });

    let opened = false;
    void whenPaperClears().then(() => {
      opened = true;
    });

    for (const turn of useSession.getState().turns.slice(0, -1)) {
      useSession.getState().removeTurn(turn.id);
    }
    await Promise.resolve();
    expect(opened).toBe(false);

    const last = useSession.getState().turns.at(-1);
    if (last) useSession.getState().removeTurn(last.id);
    await Promise.resolve();
    expect(opened).toBe(true);
  });
});
