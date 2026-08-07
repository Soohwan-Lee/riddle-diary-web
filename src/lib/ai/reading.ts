/**
 * Handwriting turns ask the model for one leading `READ: …` line — its
 * transcription of the image — before the reply itself. That reading is kept
 * as conversational context but never drawn: what stays on the paper is the
 * reader's own hand, not a machine's rendering of it.
 *
 * This splits the line off a token stream, and degrades to passing everything
 * through if the model skips the convention.
 */

const PREFIX = "READ:";

export type Split = { transcript?: string; delta?: string };

export function createReadingSplitter() {
  let buffer = "";
  // `gap` is the blank line between the reading and the reply. It may arrive
  // in a later chunk than the newline that ended the reading line, so it
  // needs a state of its own rather than a one-shot trim.
  let state: "sniffing" | "reading" | "gap" | "body" = "sniffing";

  const passThrough = (): Split => {
    const delta = buffer;
    buffer = "";
    state = "body";
    return delta ? { delta } : {};
  };

  const afterGap = (text: string): Split => {
    const rest = text.replace(/^[\r\n]+/, "");
    if (!rest) {
      state = "gap";
      return {};
    }
    state = "body";
    return { delta: rest };
  };

  return {
    push(chunk: string): Split {
      if (state === "body") return chunk ? { delta: chunk } : {};
      if (state === "gap") return afterGap(chunk);

      buffer += chunk;

      if (state === "sniffing") {
        const head = buffer.replace(/^\s+/, "");
        if (head.length < PREFIX.length) {
          // Still ambiguous — unless it has already diverged.
          return PREFIX.startsWith(head) ? {} : passThrough();
        }
        if (!head.startsWith(PREFIX)) return passThrough();
        state = "reading";
      }

      const newline = buffer.indexOf("\n");
      if (newline === -1) return {};

      const line = buffer.slice(0, newline);
      const rest = buffer.slice(newline + 1);
      buffer = "";

      return { ...readingOf(line), ...afterGap(rest) };
    },

    /** Called once the stream ends, for anything still held back. */
    flush(): Split {
      if (!buffer) return {};
      if (state === "reading") {
        const line = buffer;
        buffer = "";
        state = "body";
        return readingOf(line);
      }
      return passThrough();
    },
  };
}

function readingOf(line: string): Split {
  const transcript = line.replace(/^\s*READ:\s*/, "").trim();
  // "?" is the agreed signal for handwriting the model could not make out.
  if (!transcript || transcript === "?") return {};
  return { transcript };
}
