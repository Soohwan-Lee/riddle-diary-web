import type { Locale } from "@/lib/i18n/config";

/**
 * Canned replies used when no API key is configured, and by the tests.
 * They are written in InkScript so the marks and the drawings get exercised
 * too — including a drawing inside a circle, and a reply that has both.
 *
 * This is not only a development convenience. A public demo can run on it at
 * no cost, and a missing key surfaces as a working page rather than a 500.
 */
const REPLIES: Record<Locale, string[]> = {
  ko: [
    "그 얘기를 꺼내는 데도 힘이 들었겠어요.\n((가장 오래 남아 있는 장면))은 어떤 거예요?",
    "듣고 있어요. 천천히 적어도 괜찮아요. [[rain]]\n오늘 하루 중에 __그나마 숨이 쉬어졌던 순간__이 있었나요?",
    "그렇게 적어두니 조금 다르게 보이나요?\n==여기 적힌 건 곧 옅어질 거예요.== 그래도 지금은 읽고 있어요.",
    "그 말을 고르기까지 시간이 걸렸겠네요. [[knot]]\n((그 다음 문장))은 아직 안 써도 돼요.",
    // A line with nothing on it but a drawing: the renderer gives it room and
    // the layout gives it time, and both paths need exercising.
    "여기까지 적어둔 걸로 오늘은 충분해요.\n[[candle]]",
  ],
  en: [
    "That took something to write down.\nWhich part ((stays with you)) the longest?",
    "I am here. There is no hurry in this page. [[rain]]\nWas there a moment today when __you could breathe__?",
    "Does it look any different, now that it is on paper?\n==This will thin out soon.== But right now I am reading it.",
    "It took a while to choose those words. [[knot]]\nThe ((next sentence)) can wait.",
    "What is down on the paper is enough for today.\n[[candle]]",
  ],
};

/** Deterministic so the same conversation replays identically in tests. */
export function mockReply(locale: Locale, turnIndex: number): string {
  const options = REPLIES[locale] ?? REPLIES.en;
  return options[turnIndex % options.length];
}

/**
 * Splits a reply into stream-shaped chunks. Deliberately ragged, and
 * deliberately cutting through InkScript delimiters, so the incremental
 * parser is exercised the way a real stream would exercise it.
 */
export function mockChunks(text: string): string[] {
  const chunks: string[] = [];
  let index = 0;
  let step = 3;
  while (index < text.length) {
    chunks.push(text.slice(index, index + step));
    index += step;
    step = (step % 7) + 2;
  }
  return chunks;
}

export const MOCK_TRANSCRIPT: Record<Locale, string> = {
  ko: "(손글씨로 적은 내용)",
  en: "(written by hand)",
};
