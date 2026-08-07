"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Header } from "@/components/chrome/Header";
import { InkStrokes } from "@/components/ink/InkStrokes";
import { InkText } from "@/components/ink/InkText";
import type { Stroke } from "@/lib/ink/strokes";
import {
  ConverseFailure,
  sseTransport,
  type ConverseError,
  type Transport,
} from "@/lib/ai/transport";
import { LOCALE_TAG } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/provider";
import { useComposingPause, useDocumentHidden } from "@/lib/ink/usePageClock";
import { DWELL_MS, FADE_MS, WRITE_CPM } from "@/lib/prefs/config";
import { usePrefs } from "@/lib/prefs/provider";
import { useSession } from "@/store/session";
import { Composer } from "./Composer";
import { InkCanvas } from "./InkCanvas";
import { Transcript } from "./Transcript";

export function Diary({ transport = sseTransport }: { transport?: Transport }) {
  const { t, locale } = useI18n();
  const { mode, writeSpeed, fadePace, reducedMotion, allowFinger } = usePrefs();

  const turns = useSession((state) => state.turns);
  const history = useSession((state) => state.history);
  const status = useSession((state) => state.status);

  const hidden = useDocumentHidden();
  const { composing, touch } = useComposingPause();
  const [held, setHeld] = useState(false);

  // Time only runs when someone is looking and nobody is mid-sentence.
  const paused = hidden || composing || held;

  const cpm = WRITE_CPM[writeSpeed];
  const dwell = DWELL_MS[fadePace];
  const dwellMs = Number.isFinite(dwell) ? dwell : 0;
  const fadeMs = fadePace === "never" ? 0 : FADE_MS[fadePace];

  const greeted = useRef(false);
  useEffect(() => {
    if (greeted.current) return;
    greeted.current = true;
    const { turns: existing, beginReply, appendReply, finishReply } =
      useSession.getState();
    if (existing.length > 0) return;
    // The page speaks first, and its opening line fades like everything else.
    const id = beginReply();
    appendReply(id, t.page.firstLine);
    finishReply(id);
  }, [t.page.firstLine]);

  const errorText = useCallback(
    (code: ConverseError["code"]) => {
      if (code === "rate_limited") return t.errors.rateLimited;
      if (code === "too_long") return t.errors.tooLong;
      if (code === "unreadable") return t.errors.unreadable;
      if (code === "offline") return t.errors.offline;
      return t.errors.generic;
    },
    [t.errors],
  );

  const send = useCallback(
    async ({
      text,
      image,
      strokes,
    }: {
      text?: string;
      image?: string;
      strokes?: Stroke[];
    }) => {
      const session = useSession.getState();
      // The history sent upstream is prior turns only; the current entry
      // travels beside it, since handwriting arrives as an image.
      const priorHistory = session.history;
      const userId = session.addUserTurn({
        raw: image ? "" : (text ?? ""),
        strokes,
      });
      const replyId = session.beginReply();

      try {
        await transport(
          {
            mode: image ? "ink" : "text",
            text,
            image,
            history: priorHistory,
            locale,
          },
          {
            onTranscript: (reading) =>
              useSession.getState().setUserTranscript(userId, reading),
            onDelta: (delta) => useSession.getState().appendReply(replyId, delta),
          },
        );
        useSession.getState().finishReply(replyId);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        const code = error instanceof ConverseFailure ? error.code : "upstream";
        useSession.getState().failReply(replyId, errorText(code));
      }
    },
    [transport, locale, errorText],
  );

  const busy = status !== "idle";

  return (
    <div className="relative z-10 flex min-h-dvh flex-col">
      <a
        href="#composer"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-full focus:bg-paper focus:px-4 focus:py-2"
      >
        {t.a11y.skipToComposer}
      </a>

      <Header />

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-6 pt-10 pb-16 sm:px-8">
        <div
          className="ink-surface flex-1 space-y-7"
          data-paused={paused ? "true" : "false"}
          // Hold anywhere on the page and time stops. It is the only way to
          // keep something, and it lasts exactly as long as you hold it.
          onPointerDown={(event) => {
            if (event.target instanceof HTMLElement && event.target.closest("button, a, textarea")) return;
            setHeld(true);
          }}
          onPointerUp={() => setHeld(false)}
          onPointerCancel={() => setHeld(false)}
          onPointerLeave={() => setHeld(false)}
        >
          {turns.map((turn) =>
            turn.strokes ? (
              <InkStrokes
                key={turn.id}
                strokes={turn.strokes}
                style={{ size: 4.4, simulatePressure: true }}
                phase={turn.phase}
                dwellMs={dwellMs}
                fadeMs={fadeMs}
                onFaded={() => useSession.getState().removeTurn(turn.id)}
              />
            ) : (
              <InkText
                key={turn.id}
                id={turn.id}
                voice={turn.voice}
                raw={turn.raw}
                streaming={turn.streaming}
                phase={turn.phase}
                cpm={cpm}
                locale={LOCALE_TAG[locale]}
                dwellMs={dwellMs}
                fadeMs={fadeMs}
                instant={turn.voice === "user" || reducedMotion}
                onWritten={
                  turn.voice === "ai"
                    ? () => useSession.getState().restAll()
                    : undefined
                }
                onFaded={() => useSession.getState().removeTurn(turn.id)}
                className="text-2xl leading-[1.85] sm:text-[1.7rem]"
              />
            ),
          )}

          {mode === "type" ? (
            <Composer
              disabled={busy}
              onSend={(text) => void send({ text })}
              onActivity={touch}
            />
          ) : (
            <InkCanvas
              disabled={busy}
              allowFinger={allowFinger}
              onSend={(payload) => void send(payload)}
              onActivity={touch}
            />
          )}
        </div>

        <p className="mt-10 text-[0.68rem] text-muted/80">{t.page.notice}</p>
      </main>

      <Transcript history={history} />
    </div>
  );
}
