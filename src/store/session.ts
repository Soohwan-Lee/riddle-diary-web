"use client";

import { create } from "zustand";
import { parseInkScript } from "@/lib/ink/inkscript";
import type { Stroke } from "@/lib/ink/strokes";

export type Voice = "user" | "ai";
export type TurnPhase = "fresh" | "resting";

export type Turn = {
  id: string;
  voice: Voice;
  /** InkScript for the page's replies, plain text for the reader's. */
  raw: string;
  /** Strokes captured in handwriting mode, drawn instead of text. */
  strokes?: readonly Stroke[];
  streaming: boolean;
  phase: TurnPhase;
  /**
   * Holds the opening line on the page until there is something to answer.
   * An empty sheet is the resting state of this app, but it is a poor
   * first impression.
   */
  pinned?: boolean;
  /**
   * Set when handing something over cleared the page under it. Such a turn
   * has already been read, so it sinks at the speed of the entry that
   * displaced it rather than at reading speed.
   */
  absorbing?: boolean;
  createdAt: number;
};

export type ChatMessage = { role: "user" | "assistant"; content: string };

export type SessionStatus = "idle" | "thinking" | "writing";

/**
 * Two collections, deliberately kept apart:
 *
 *   `turns`   is what is on the paper. Entries leave it when their ink fades.
 *   `history` is what the page remembers. It survives the fade, and it dies
 *             with the tab — it is never written to disk or to a server.
 */
type SessionState = {
  turns: Turn[];
  history: ChatMessage[];
  status: SessionStatus;
  error: string | null;

  /**
   * `clearPage` is blank-page mode: handing something over takes it, and
   * everything already on the paper, straight into its fade.
   */
  addUserTurn: (input: {
    raw: string;
    strokes?: Turn["strokes"];
    clearPage?: boolean;
  }) => string;
  /**
   * The opening line. Not a reply: it never touches `status`, so the surface
   * accepts writing while the page is still writing its question.
   */
  greet: (text: string) => void;
  /** Replaces a handwritten turn's placeholder text once the page reads it. */
  setUserTranscript: (id: string, transcript: string) => void;
  beginReply: (options?: { pinned?: boolean }) => string;
  appendReply: (id: string, delta: string) => void;
  finishReply: (id: string) => void;
  failReply: (id: string, message: string) => void;
  /**
   * Called when a reply has finished being written out: it and everything
   * older settles. Anything *newer* is left alone — the opening line can
   * finish writing after an entry has already been handed over, and it must
   * not put a reply that is still being written to rest.
   */
  restFrom: (id: string) => void;
  removeTurn: (id: string) => void;
  setError: (message: string | null) => void;
  clearAll: () => void;
};

/** Keeps the request payload bounded without truncating mid-conversation. */
const MAX_HISTORY_TURNS = 24;

function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `t${Date.now()}${Math.floor(Math.random() * 1e6)}`;
}

function trimHistory(history: ChatMessage[]): ChatMessage[] {
  return history.length > MAX_HISTORY_TURNS
    ? history.slice(history.length - MAX_HISTORY_TURNS)
    : history;
}

export const useSession = create<SessionState>()((set) => ({
  turns: [],
  history: [],
  status: "idle",
  error: null,

  addUserTurn: ({ raw, strokes, clearPage }) => {
    const id = newId();
    set((state) => ({
      turns: [
        // Whatever was on the paper is no longer waiting for anything: the
        // opening line has been answered, and in blank-page mode the answer
        // before this one has been read.
        ...state.turns.map((turn) => ({
          ...turn,
          pinned: false,
          absorbing: clearPage || turn.absorbing,
          phase: clearPage ? ("resting" as const) : turn.phase,
        })),
        {
          id,
          voice: "user",
          raw,
          strokes,
          streaming: false,
          phase: clearPage ? ("resting" as const) : ("fresh" as const),
          createdAt: Date.now(),
        },
      ],
      // Handwriting arrives without text; the transcript fills it in later.
      history: raw
        ? trimHistory([...state.history, { role: "user", content: raw }])
        : state.history,
      status: "thinking",
      error: null,
    }));
    return id;
  },

  greet: (text) =>
    set((state) => {
      if (state.turns.length > 0) return state;
      return {
        turns: [
          {
            id: newId(),
            voice: "ai",
            raw: text,
            streaming: false,
            phase: "fresh",
            pinned: true,
            createdAt: Date.now(),
          },
        ],
        history: [{ role: "assistant", content: text }],
      };
    }),

  // A handwritten turn keeps showing the reader's own strokes; only the
  // remembered history gains the words the page read in them.
  setUserTranscript: (id, transcript) =>
    set((state) => {
      const turn = state.turns.find((entry) => entry.id === id);
      if (!turn || turn.raw || !transcript.trim()) return state;
      return {
        history: trimHistory([
          ...state.history,
          { role: "user", content: transcript },
        ]),
      };
    }),

  beginReply: (options) => {
    const id = newId();
    set((state) => ({
      turns: [
        ...state.turns,
        {
          id,
          voice: "ai",
          raw: "",
          streaming: true,
          phase: "fresh",
          pinned: options?.pinned,
          createdAt: Date.now(),
        },
      ],
      status: "thinking",
    }));
    return id;
  },

  // The first delta is the moment the page stops thinking and starts writing.
  appendReply: (id, delta) =>
    set((state) => ({
      turns: state.turns.map((turn) =>
        turn.id === id ? { ...turn, raw: turn.raw + delta } : turn,
      ),
      status: "writing",
    })),

  finishReply: (id) =>
    set((state) => {
      const turn = state.turns.find((entry) => entry.id === id);
      // The model sees plain prose; the marks are a rendering instruction. A
      // drawing keeps its token — Riddle should be able to see what it drew,
      // and the transcript turns the token into words for a screen reader.
      const content = turn ? parseInkScript(turn.raw).source : "";

      // A reply with no words in it would sit on the paper forever: there is
      // nothing to run a fade animation, so nothing ever reports finishing and
      // the turn is never removed. Drop it, settle the rest, hand the page back.
      if (!content.trim()) {
        return {
          turns: state.turns
            .filter((entry) => entry.id !== id)
            .map((entry) =>
              entry.pinned ? entry : { ...entry, phase: "resting" as const },
            ),
          status: "idle" as const,
        };
      }

      return {
        turns: state.turns.map((entry) =>
          entry.id === id ? { ...entry, streaming: false } : entry,
        ),
        history: content
          ? trimHistory([...state.history, { role: "assistant", content }])
          : state.history,
      };
    }),

  // If the stream died partway, the words already on the paper stay there —
  // rewriting `raw` would make characters someone watched being written
  // change under them.
  failReply: (id, message) =>
    set((state) => ({
      turns: state.turns.map((turn) =>
        turn.id === id
          ? {
              ...turn,
              raw: turn.raw ? `${turn.raw.trimEnd()}\n${message}` : message,
              streaming: false,
            }
          : turn,
      ),
      status: "writing",
      error: message,
    })),

  restFrom: (id) =>
    set((state) => {
      const index = state.turns.findIndex((turn) => turn.id === id);
      if (index === -1) return state;
      // A reply that arrived after this one is still in flight; the page is
      // not free yet, whatever this node has just finished doing.
      const newerReply = state.turns
        .slice(index + 1)
        .some((turn) => turn.voice === "ai");

      return {
        turns: state.turns.map((turn, position) =>
          position <= index && !turn.pinned && turn.phase !== "resting"
            ? { ...turn, phase: "resting" as const }
            : turn,
        ),
        status: newerReply ? state.status : "idle",
      };
    }),

  removeTurn: (id) =>
    set((state) => ({ turns: state.turns.filter((turn) => turn.id !== id) })),

  setError: (message) => set({ error: message }),

  clearAll: () =>
    set({ turns: [], history: [], status: "idle", error: null }),
}));
