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

/**
 * Reads the server's SSE stream. `fetch` rather than `EventSource` because
 * the request is a POST carrying an image, and because an abort has to be
 * able to cut the model off mid-sentence.
 */
export const sseTransport: Transport = async (request, handlers) => {
  let response: Response;
  try {
    response = await fetch("/api/converse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
      signal: handlers.signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") throw error;
    throw new ConverseFailure("offline");
  }

  if (!response.ok || !response.body) {
    const code = response.status === 429 ? "rate_limited" : "upstream";
    throw new ConverseFailure(await readErrorCode(response, code));
  }

  const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += value;
    // SSE frames are separated by a blank line.
    let boundary = buffer.indexOf("\n\n");
    while (boundary !== -1) {
      const frame = buffer.slice(0, boundary);
      buffer = buffer.slice(boundary + 2);
      handleFrame(frame, handlers);
      boundary = buffer.indexOf("\n\n");
    }
  }
};

function handleFrame(frame: string, handlers: ConverseHandlers) {
  const line = frame.split("\n").find((entry) => entry.startsWith("data:"));
  if (!line) return;

  let event: ServerEventShape;
  try {
    event = JSON.parse(line.slice(5).trim()) as ServerEventShape;
  } catch {
    return;
  }

  if (event.type === "delta") handlers.onDelta(event.text);
  else if (event.type === "transcript") handlers.onTranscript?.(event.text);
  else if (event.type === "error") throw new ConverseFailure(event.code);
}

type ServerEventShape =
  | { type: "transcript"; text: string }
  | { type: "delta"; text: string }
  | { type: "done" }
  | { type: "error"; code: ConverseError["code"] };

async function readErrorCode(
  response: Response,
  fallback: ConverseError["code"],
): Promise<ConverseError["code"]> {
  try {
    const body = await response.text();
    const line = body.split("\n").find((entry) => entry.startsWith("data:"));
    if (!line) return fallback;
    const parsed = JSON.parse(line.slice(5).trim()) as ServerEventShape;
    return parsed.type === "error" ? parsed.code : fallback;
  } catch {
    return fallback;
  }
}

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
