"use client";

import { useCallback, useEffect, useState } from "react";
import { Header } from "@/components/chrome/Header";
import { SettingsSheet } from "@/components/chrome/SettingsSheet";
import { SettingsIcon } from "@/components/icons";
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
import {
  ABSORB_DWELL_MS,
  ABSORB_FADE_MS,
  BLANK_FADE_MS,
  LISTENING_BEAT_MS,
  readDwellMs,
} from "@/lib/ink/dwell";
import { useComposingPause, useDocumentHidden } from "@/lib/ink/usePageClock";
import { DWELL_MS, FADE_MS, WRITE_CPM } from "@/lib/prefs/config";
import { usePrefs } from "@/lib/prefs/provider";
import {
  paperIsClear,
  useSession,
  whenPaperClears,
  type Turn,
} from "@/store/session";
import { Composer } from "./Composer";
import { InkCanvas } from "./InkCanvas";
import { IntroNote } from "./IntroNote";
import { Transcript } from "./Transcript";

function firstLineForHour(
  hour: number,
  lines: { morning: string; afternoon: string; evening: string; night: string },
): string {
  if (hour < 5) return lines.night;
  if (hour < 12) return lines.morning;
  if (hour < 18) return lines.afternoon;
  return lines.evening;
}

export function Diary({ transport = sseTransport }: { transport?: Transport }) {
  const { t, locale } = useI18n();
  const {
    mode,
    pageMode,
    writeSpeed,
    fadePace,
    reducedMotion,
    allowFinger,
    autoHandoff,
    introSeen,
    setLocalPrefs,
  } = usePrefs();

  const turns = useSession((state) => state.turns);
  const history = useSession((state) => state.history);
  const status = useSession((state) => state.status);
  const error = useSession((state) => state.error);

  const hidden = useDocumentHidden();
  const { composing, touch, release } = useComposingPause();
  const [held, setHeld] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [date, setDate] = useState<{ label: string; iso: string } | null>(null);

  // Time only runs when someone is looking and nobody is mid-sentence.
  const paused = hidden || composing || held;

  const cpm = WRITE_CPM[writeSpeed];
  const dwell = DWELL_MS[fadePace];
  const dwellMs = Number.isFinite(dwell) ? dwell : 0;
  const fadeMs = fadePace === "never" ? 0 : FADE_MS[fadePace];

  // "Never fade" wins over blank-page mode: someone who asked for nothing to
  // disappear did not ask for the page to clear itself between turns.
  const blankPage = pageMode === "blank" && fadePace !== "never";

  /**
   * In blank-page mode the two voices keep different time. What you hand over
   * is absorbed almost at once; what the page writes stays for as long as it
   * takes to read. Everywhere else both rest together on the dwell setting.
   */
  const timingFor = useCallback(
    (turn: Turn) => {
      if (!blankPage) return { dwellMs, fadeMs };
      if (turn.voice === "user" || turn.absorbing) {
        return { dwellMs: ABSORB_DWELL_MS, fadeMs: ABSORB_FADE_MS };
      }
      return {
        dwellMs: readDwellMs(turn.raw, fadePace),
        fadeMs: BLANK_FADE_MS[fadePace],
      };
    },
    [blankPage, dwellMs, fadeMs, fadePace],
  );

  /**
   * Nothing on the paper at all — not the reader's ink, not the page's. In
   * blank-page mode this is the handover: one hand writes, its ink goes, and
   * only then does the other start. A reply that begins while the entry above
   * it is still sinking is two hands on one sheet, which is the one thing this
   * mode exists to prevent.
   */
  const paperClear = paperIsClear(turns);

  useEffect(() => {
    // The page speaks first, and it knows roughly what time it is. The line is
    // pinned — it waits on the paper until there is something to answer — and
    // it is not a turn, so it does not lock the surface while it is written.
    // `greet` replaces an unanswered opening line, which lets the greeting
    // follow a language switch; once someone has written, it leaves the page
    // alone.
    const hour = new Date().getHours();
    useSession.getState().greet(
      firstLineForHour(hour, {
        morning: t.page.firstLineMorning,
        afternoon: t.page.firstLineAfternoon,
        evening: t.page.firstLineEvening,
        night: t.page.firstLineNight,
      }),
    );
  }, [
    t.page.firstLineMorning,
    t.page.firstLineAfternoon,
    t.page.firstLineEvening,
    t.page.firstLineNight,
  ]);

  // The date is page furniture, not a turn: it is set after hydration so the
  // server and the browser cannot disagree about which day it is, and it
  // follows a language switch. The frame keeps the write out of the effect
  // body, where React asks for effects to synchronize rather than set state.
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const now = new Date();
      const iso = [
        now.getFullYear(),
        String(now.getMonth() + 1).padStart(2, "0"),
        String(now.getDate()).padStart(2, "0"),
      ].join("-");
      setDate({
        iso,
        label: new Intl.DateTimeFormat(LOCALE_TAG[locale], {
          weekday: "long",
          month: "long",
          day: "numeric",
        }).format(now),
      });
    });
    return () => cancelAnimationFrame(frame);
  }, [locale]);

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
      // Handing something over ends the sentence, whatever the settle timer
      // still thinks. Left running it would hold the clock for another couple
      // of seconds — and with the reply now waiting on an empty page, that is
      // time the reader spends watching nothing happen.
      release();
      // The history sent upstream is prior turns only; the current entry
      // travels beside it, since handwriting arrives as an image.
      const priorHistory = session.history;
      const userId = session.addUserTurn({
        raw: image ? "" : (text ?? ""),
        strokes,
        clearPage: blankPage,
      });

      /**
       * The request goes out now; the reply waits for an empty page. Asking
       * upstream only after the paper cleared would spend the absorb doing
       * nothing and then make the reader wait again for the model — this way
       * the two happen at once, and whichever finishes last is the one being
       * waited for. Text that arrives early queues in `pending`, which is also
       * what keeps `raw` growing monotonically: the node is not mounted until
       * there is something to write.
       */
      let replyId: string | null = null;
      let pending = "";
      const opened = (async () => {
        if (blankPage) await whenPaperClears();
        // A beat before the first stroke. The model is already working, so
        // this is only visible when it answered faster than a person could
        // have decided to pick the pen up.
        await wait(LISTENING_BEAT_MS);
        replyId = useSession.getState().beginReply();
        if (pending) {
          useSession.getState().appendReply(replyId, pending);
          pending = "";
        }
      })();

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
            onDelta: (delta) => {
              if (replyId) useSession.getState().appendReply(replyId, delta);
              else pending += delta;
            },
          },
        );
        await opened;
        if (replyId) useSession.getState().finishReply(replyId);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        const code = error instanceof ConverseFailure ? error.code : "upstream";
        // The page still owes an answer, even if the answer is that it failed.
        await opened;
        if (replyId) useSession.getState().failReply(replyId, errorText(code));
      }
    },
    [transport, locale, errorText, blankPage, release],
  );

  const busy = status !== "idle";

  /**
   * In blank-page mode the paper belongs to one hand at a time. The entry area
   * exists only when it is yours: it leaves the moment you hand something over
   * and comes back when the last of the reply has gone.
   *
   * This is a layout fix as much as a conceptual one. The entry sits below the
   * ink in normal flow, so a reply growing line by line used to drag the caret
   * down with it and snap it back up when the ink went — all during the window
   * where nothing could be typed anyway. Now nothing moves, and from the second
   * turn on the caret returns to exactly the same place: the top of an empty
   * sheet.
   */
  const inkOnPaper = turns.some(
    (turn) => !turn.pinned && (turn.strokes?.length || turn.raw.trim().length > 0),
  );
  const yourTurn = !blankPage || (!busy && !inkOnPaper);

  // Give the caret back when the paper does, but not on the first visit —
  // arriving at a page that grabs focus is a different, worse thing.
  const hasWritten = history.some((message) => message.role === "user");

  return (
    <div className="relative z-10 flex min-h-dvh flex-col">
      {/* A landmark of its own, so the link is not content stranded outside
          every region — and it targets the entry area rather than the
          textarea, which does not exist in handwriting mode. */}
      <nav aria-label={t.a11y.skipToComposer}>
        <a
          href="#entry"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-full focus:bg-paper focus:px-4 focus:py-2"
        >
          {t.a11y.skipToComposer}
        </a>
      </nav>

      <Header
        actions={
          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            aria-label={t.chrome.settings}
            title={t.chrome.settings}
            className="inline-flex size-8 items-center justify-center rounded-full border border-hairline text-muted transition-colors hover:border-hairline-strong hover:text-ink-user"
          >
            <SettingsIcon className="size-4" />
          </button>
        }
      />

      <main className="ink-sheet flex flex-1 flex-col pt-8 pb-12 sm:pt-10 sm:pb-16 lg:pt-14">
        <h1 className="sr-only">
          {t.app.name} — {t.app.tagline}
        </h1>

        <p className="ink-date" aria-hidden={!date}>
          {date && <time dateTime={date.iso}>{date.label}</time>}
        </p>

        {!introSeen && (
          <IntroNote onDismiss={() => setLocalPrefs({ introSeen: true })} />
        )}

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
          {turns.map((turn) => {
            const timing = timingFor(turn);
            return turn.strokes ? (
              <InkStrokes
                key={turn.id}
                strokes={turn.strokes}
                style={{ size: 4.4, simulatePressure: true }}
                phase={turn.phase}
                dwellMs={timing.dwellMs}
                fadeMs={timing.fadeMs}
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
                dwellMs={timing.dwellMs}
                fadeMs={timing.fadeMs}
                instant={turn.voice === "user" || reducedMotion}
                onWritten={
                  turn.voice === "ai"
                    ? () => useSession.getState().restFrom(turn.id)
                    : undefined
                }
                onFaded={() => useSession.getState().removeTurn(turn.id)}
                className="ink-body"
              />
            );
          })}

          {/* Between handing something over and the first character coming
              back there is nothing on the paper at all in blank-page mode.
              A nib resting on the page is the whole indicator — and it waits
              for the sheet to empty too, rather than sitting under ink that
              is still sinking. */}
          {status === "thinking" && (!blankPage || paperClear) && (
            <p className="flex items-center gap-2" aria-hidden>
              <span className="ink-thinking" />
            </p>
          )}
          <span role="status" className="sr-only">
            {status === "thinking" ? t.page.thinking : ""}
          </span>
          {/* The visible failure is written into the ink, which is aria-hidden.
              Without this the transcript region never learns that a reply did
              not arrive, and a screen reader user is left waiting. */}
          {error && (
            <span role="alert" className="sr-only">
              {error}
            </span>
          )}

          {/* The wrapper always stays: the skip link needs somewhere to land
              even on a turn that is not yours. */}
          <div id="entry" tabIndex={-1} className="outline-none">
            {yourTurn &&
              (mode === "type" ? (
                <Composer
                  disabled={busy}
                  returning={blankPage && hasWritten}
                  onSend={(text) => void send({ text })}
                  onActivity={touch}
                />
              ) : (
                <div className={blankPage && hasWritten ? "ink-entry-return" : undefined}>
                  <InkCanvas
                    disabled={busy}
                    allowFinger={allowFinger}
                    autoHandoff={autoHandoff}
                    onSend={(payload) => void send(payload)}
                    onActivity={touch}
                  />
                </div>
              ))}
          </div>
        </div>

        {/* Full-strength `--muted`: at this size an alpha modifier drops the
            contrast below AA, and this line is the app's one honest warning. */}
        <p className="mt-10 text-[0.72rem] leading-relaxed text-muted">
          {t.page.notice}
          <span className="ml-2">· {t.a11y.holdToKeep}</span>
        </p>
      </main>

      <Transcript history={history} />

      <SettingsSheet
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onClearPage={() => useSession.getState().clearAll()}
      />
    </div>
  );
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
