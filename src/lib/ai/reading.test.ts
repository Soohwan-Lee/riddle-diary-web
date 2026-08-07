import { describe, expect, it } from "vitest";
import { createReadingSplitter } from "./reading";

/** Feeds a whole response through in chunks of `size` and collects the split. */
function run(text: string, size: number) {
  const splitter = createReadingSplitter();
  let transcript = "";
  let body = "";

  for (let i = 0; i < text.length; i += size) {
    const part = splitter.push(text.slice(i, i + size));
    if (part.transcript) transcript += part.transcript;
    if (part.delta) body += part.delta;
  }
  const tail = splitter.flush();
  if (tail.transcript) transcript += tail.transcript;
  if (tail.delta) body += tail.delta;

  return { transcript, body };
}

describe("createReadingSplitter", () => {
  const response = "READ: 오늘은 좀 지쳤다\n\n((지쳤다))고 적으셨네요.\n무엇이 제일 무거웠어요?";
  const expectedBody = "((지쳤다))고 적으셨네요.\n무엇이 제일 무거웠어요?";

  it("splits the reading line from the reply", () => {
    const { transcript, body } = run(response, 1000);
    expect(transcript).toBe("오늘은 좀 지쳤다");
    expect(body).toBe(expectedBody);
  });

  it("gives the same result at every chunk size", () => {
    for (const size of [1, 2, 3, 5, 8, 13, 40]) {
      const { transcript, body } = run(response, size);
      expect({ size, transcript, body }).toEqual({
        size,
        transcript: "오늘은 좀 지쳤다",
        body: expectedBody,
      });
    }
  });

  it("passes everything through when the model skips the convention", () => {
    const { transcript, body } = run("듣고 있어요.\n천천히 적어도 괜찮아요.", 3);
    expect(transcript).toBe("");
    expect(body).toBe("듣고 있어요.\n천천히 적어도 괜찮아요.");
  });

  it("treats a question mark as illegible and reports no reading", () => {
    const { transcript, body } = run("READ: ?\n\n잘 안 읽혀요. 다시 적어줄래요?", 4);
    expect(transcript).toBe("");
    expect(body).toBe("잘 안 읽혀요. 다시 적어줄래요?");
  });

  it("recovers a reading line that never got its newline", () => {
    const { transcript, body } = run("READ: 한 줄만 적었다", 3);
    expect(transcript).toBe("한 줄만 적었다");
    expect(body).toBe("");
  });

  it("does not mistake a reply that merely starts with R", () => {
    const { body } = run("Right now, I am reading it.", 2);
    expect(body).toBe("Right now, I am reading it.");
  });
});
