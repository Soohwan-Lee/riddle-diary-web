"use client";

import { create } from "zustand";
import { parseInkScript } from "@/lib/ink/inkscript";

export type Voice = "user" | "ai";
export type TurnPhase = "fresh" | "resting";

export type Turn = {
  id: string;
  voice: Voice;
  /** InkScript for the page's replies, plain text for the reader's. */
  raw: string;
  /** Strokes captured in handwriting mode, drawn instead of text. */
  strokes?: readonly (readonly number[][])[];
  streaming: boolean;
  phase: TurnPhase;
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

  addUserTurn: (input: { raw: string; strokes?: Turn["strokes"] }) => string;
  /** Replaces a handwritten turn's placeholder text once the page reads it. */
  setUserTranscript: (id: string, transcript: string) => void;
  beginReply: () => string;
  appendReply: (id: string, delta: string) => void;
  finishReply: (id: string) => void;
  failReply: (id: string, message: string) => void;
  /** Called when a reply has finished being written out. */
  restAll: () => void;
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

  addUserTurn: ({ raw, strokes }) => {
    const id = newId();
    set((state) => ({
      turns: [
        ...state.turns,
        {
          id,
          voice: "user",
          raw,
          strokes,
          streaming: false,
          phase: "fresh",
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

  beginReply: () => {
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
          createdAt: Date.now(),
        },
      ],
      status: "writing",
    }));
    return id;
  },

  appendReply: (id, delta) =>
    set((state) => ({
      turns: state.turns.map((turn) =>
        turn.id === id ? { ...turn, raw: turn.raw + delta } : turn,
      ),
    })),

  finishReply: (id) =>
    set((state) => {
      const turn = state.turns.find((entry) => entry.id === id);
      // The model sees plain prose; the marks are a rendering instruction.
      const content = turn ? parseInkScript(turn.raw).text : "";
      return {
        turns: state.turns.map((entry) =>
          entry.id === id ? { ...entry, streaming: false } : entry,
        ),
        history: content
          ? trimHistory([...state.history, { role: "assistant", content }])
          : state.history,
      };
    }),

  failReply: (id, message) =>
    set((state) => ({
      turns: state.turns.map((turn) =>
        turn.id === id ? { ...turn, raw: message, streaming: false } : turn,
      ),
      status: "writing",
      error: message,
    })),

  restAll: () =>
    set((state) => ({
      turns: state.turns.map((turn) =>
        turn.phase === "resting" ? turn : { ...turn, phase: "resting" },
      ),
      status: "idle",
    })),

  removeTurn: (id) =>
    set((state) => ({ turns: state.turns.filter((turn) => turn.id !== id) })),

  setError: (message) => set({ error: message }),

  clearAll: () =>
    set({ turns: [], history: [], status: "idle", error: null }),
}));
