"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
  readDwellMs,
} from "@/lib/ink/dwell";
import { useComposingPause, useDocumentHidden } from "@/lib/ink/usePageClock";
import { DWELL_MS, FADE_MS, WRITE_CPM } from "@/lib/prefs/config";
import { usePrefs } from "@/lib/prefs/provider";
import { useSession, type Turn } from "@/store/session";
import { Composer } from "./Composer";
import { InkCanvas } from "./InkCanvas";
import { IntroNote } from "./IntroNote";
import { Transcript } from "./Transcript";

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

  const hidden = useDocumentHidden();
  const { composing, touch } = useComposingPause();
  const [held, setHeld] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

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

  const greeted = useRef(false);
  useEffect(() => {
    if (greeted.current) return;
    greeted.current = true;
    // The page speaks first. Its opening line is pinned — it waits on the
    // paper until there is something to answer — and it is not a turn, so it
    // does not lock the surface while it is being written.
    useSession.getState().greet(t.page.firstLine);
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
        clearPage: blankPage,
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
    [transport, locale, errorText, blankPage],
  );

  const busy = status !== "idle";

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

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-6 pt-10 pb-16 sm:px-8">
        <h1 className="sr-only">
          {t.app.name} — {t.app.tagline}
        </h1>

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
                    ? () => useSession.getState().restAll()
                    : undefined
                }
                onFaded={() => useSession.getState().removeTurn(turn.id)}
                className="text-2xl leading-[1.85] sm:text-[1.7rem]"
              />
            );
          })}

          {/* Between handing something over and the first character coming
              back there is nothing on the paper at all in blank-page mode.
              A nib resting on the page is the whole indicator. */}
          {status === "thinking" && (
            <p className="flex items-center gap-2" aria-hidden>
              <span className="ink-thinking" />
            </p>
          )}
          <span role="status" className="sr-only">
            {status === "thinking" ? t.page.thinking : ""}
          </span>

          <div id="entry" tabIndex={-1} className="outline-none">
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
                autoHandoff={autoHandoff}
                onSend={(payload) => void send(payload)}
                onActivity={touch}
              />
            )}
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
