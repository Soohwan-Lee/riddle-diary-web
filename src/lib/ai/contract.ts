import { z } from "zod";

/** Roughly 1.5 MB of PNG once base64 is accounted for. */
const MAX_IMAGE_CHARS = 2_100_000;
const MAX_TEXT_CHARS = 4_000;
const MAX_HISTORY = 24;

export const ConverseRequestSchema = z
  .object({
    mode: z.enum(["text", "ink"]),
    text: z.string().max(MAX_TEXT_CHARS).optional(),
    image: z
      .string()
      .max(MAX_IMAGE_CHARS)
      .refine((value) => value.startsWith("data:image/png;base64,"), {
        message: "image must be a PNG data URL",
      })
      .optional(),
    history: z
      .array(
        z.object({
          role: z.enum(["user", "assistant"]),
          content: z.string().max(MAX_TEXT_CHARS),
        }),
      )
      .max(MAX_HISTORY)
      .default([]),
    locale: z.enum(["ko", "en"]),
  })
  .refine(
    (value) =>
      value.mode === "ink" ? Boolean(value.image) : Boolean(value.text?.trim()),
    { message: "a text entry or an ink image is required" },
  );

export type ConverseRequestBody = z.infer<typeof ConverseRequestSchema>;

export const ERROR_CODES = [
  "rate_limited",
  "too_long",
  "unreadable",
  "upstream",
  "offline",
  "invalid",
] as const;

export type ErrorCode = (typeof ERROR_CODES)[number];

/** The wire format. One JSON object per SSE `data:` line. */
export type ServerEvent =
  | { type: "transcript"; text: string }
  | { type: "delta"; text: string }
  | { type: "done" }
  | { type: "error"; code: ErrorCode };

export function encodeEvent(event: ServerEvent): string {
  return `data: ${JSON.stringify(event)}\n\n`;
}
