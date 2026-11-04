import OpenAI from "openai";
import type { ResponseInput } from "openai/resources/responses/responses";
import {
  ConverseRequestSchema,
  encodeEvent,
  type ErrorCode,
  type ServerEvent,
} from "@/lib/ai/contract";
import { mockChunks, mockReply } from "@/lib/ai/mock";
import { systemPrompt } from "@/lib/ai/prompt";
import { createReadingSplitter } from "@/lib/ai/reading";
import { CONVERSE_LIMIT, clientKey, takeToken } from "@/lib/ratelimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const MODEL = process.env.OPENAI_MODEL ?? "gpt-5.4-mini";
const API_KEY = process.env.OPENAI_API_KEY;
const MOCK = process.env.MOCK_AI === "1" || !API_KEY;

/** Replies are one to three handwritten sentences; the ceiling is for safety. */
const MAX_OUTPUT_TOKENS = 1_500;

export async function POST(request: Request) {
  if (!takeToken(clientKey(request), CONVERSE_LIMIT)) {
    return errorResponse("rate_limited", 429);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse("invalid", 400);
  }

  const parsed = ConverseRequestSchema.safeParse(body);
  if (!parsed.success) {
    const tooLong = parsed.error.issues.some((issue) => issue.code === "too_big");
    return errorResponse(tooLong ? "too_long" : "invalid", 400);
  }

  const input = parsed.data;
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: ServerEvent) =>
        controller.enqueue(encoder.encode(encodeEvent(event)));

      try {
        if (MOCK) {
          await streamMock(input, send, request.signal);
        } else {
          await streamModel(input, send, request.signal);
        }
        send({ type: "done" });
      } catch (error) {
        if (!isAbort(error)) {
          // Never log request content — the whole promise of this app is that
          // nothing anyone writes is recorded anywhere.
          console.error("[converse] upstream failure:", describe(error));
          send({ type: "error", code: "upstream" });
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-store, no-transform",
      Connection: "keep-alive",
      // Tells proxies not to buffer, which would defeat the point.
      "X-Accel-Buffering": "no",
    },
  });
}

type Send = (event: ServerEvent) => void;
type Input = ReturnType<typeof ConverseRequestSchema.parse>;

async function streamModel(input: Input, send: Send, signal: AbortSignal) {
  const client = new OpenAI({ apiKey: API_KEY });
  const splitter = createReadingSplitter();

  const stream = await client.responses.create(
    {
      model: MODEL,
      instructions: systemPrompt(input.locale, input.mode),
      input: buildInput(input),
      reasoning: { effort: "low" },
      text: { verbosity: "low" },
      max_output_tokens: MAX_OUTPUT_TOKENS,
      // The Responses API stores responses for 30 days by default. This app's
      // whole promise is that nothing is kept, so opt out explicitly rather
      // than relying on a provider default.
      store: false,
      stream: true,
    },
    { signal },
  );

  for await (const event of stream) {
    if (event.type !== "response.output_text.delta") continue;
    emit(send, splitter.push(event.delta));
  }
  emit(send, splitter.flush());
}

function emit(send: Send, part: { transcript?: string; delta?: string }) {
  if (part.transcript) send({ type: "transcript", text: part.transcript });
  if (part.delta) send({ type: "delta", text: part.delta });
}

function buildInput(input: Input): ResponseInput {
  const history: ResponseInput = input.history.map((message) => ({
    role: message.role,
    content: message.content,
  }));

  if (input.mode === "ink" && input.image) {
    return [
      ...history,
      {
        role: "user",
        content: [
          { type: "input_image", image_url: input.image, detail: "high" },
        ],
      },
    ];
  }

  return [...history, { role: "user", content: input.text ?? "" }];
}

async function streamMock(input: Input, send: Send, signal: AbortSignal) {
  const turnIndex = input.history.filter((m) => m.role === "assistant").length;
  await sleep(600, signal);

  if (input.mode === "ink") {
    send({ type: "transcript", text: input.locale === "ko" ? "(손글씨)" : "(handwritten)" });
  }

  for (const chunk of mockChunks(mockReply(input.locale, turnIndex))) {
    await sleep(70, signal);
    send({ type: "delta", text: chunk });
  }
}

function sleep(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) return reject(signal.reason);
    const timer = setTimeout(resolve, ms);
    signal.addEventListener(
      "abort",
      () => {
        clearTimeout(timer);
        reject(signal.reason);
      },
      { once: true },
    );
  });
}

function isAbort(error: unknown): boolean {
  return (
    (error instanceof Error && error.name === "AbortError") ||
    (error instanceof DOMException && error.name === "AbortError")
  );
}

/** Error shape only — never the message body, which may quote user content. */
function describe(error: unknown): string {
  if (error instanceof OpenAI.APIError) return `APIError ${error.status}`;
  if (error instanceof Error) return error.name;
  return "unknown";
}

function errorResponse(code: ErrorCode, status: number) {
  return new Response(encodeEvent({ type: "error", code }), {
    status,
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
