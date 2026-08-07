"use client";

import type { Locale } from "@/lib/i18n/config";
import type { ChatMessage } from "@/store/session";
import { mockChunks, mockReply } from "./mock";

export type ConverseRequest = {
  mode: "text" | "ink";
  text?: string;
  /** A PNG data URL of the reader's strokes, for handwriting mode. */
  image?: string;
  history: ChatMessage[];
  locale: Locale;
};

export type ConverseHandlers = {
  /** What the page read in the handwriting. Kept for context, never shown. */
  onTranscript?: (text: string) => void;
  onDelta: (text: string) => void;
  signal?: AbortSignal;
};

export type ConverseError = {
  code: "rate_limited" | "too_long" | "unreadable" | "upstream" | "offline";
};

export class ConverseFailure extends Error {
  readonly code: ConverseError["code"];
  constructor(code: ConverseError["code"]) {
    super(code);
    this.name = "ConverseFailure";
    this.code = code;
  }
}

/**
 * Streams a reply straight into the ink engine. Nothing is buffered to
 * completion first — the hand starts writing as soon as the first characters
 * land, and keeps its own pace from there.
 */
export type Transport = (
  request: ConverseRequest,
  handlers: ConverseHandlers,
) => Promise<void>;

/** Replays a canned reply at a plausible network cadence. */
export const localMockTransport: Transport = async (request, handlers) => {
  const turnIndex = request.history.filter((m) => m.role === "assistant").length;

  await wait(650, handlers.signal);
  if (request.mode === "ink") {
    handlers.onTranscript?.(request.text ?? "");
  }

  for (const chunk of mockChunks(mockReply(request.locale, turnIndex))) {
    await wait(70, handlers.signal);
    handlers.onDelta(chunk);
  }
};

function wait(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("aborted", "AbortError"));
      return;
    }
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener(
      "abort",
      () => {
        clearTimeout(timer);
        reject(new DOMException("aborted", "AbortError"));
      },
      { once: true },
    );
  });
}
