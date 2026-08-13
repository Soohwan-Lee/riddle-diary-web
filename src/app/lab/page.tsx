"use client";

import { useMemo, useState } from "react";
import { Header } from "@/components/chrome/Header";
import { InkText } from "@/components/ink/InkText";
import { LOCALE_TAG } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/provider";
import { DWELL_MS, FADE_MS, WRITE_CPM, type FadePace } from "@/lib/prefs/config";
import { usePrefs } from "@/lib/prefs/provider";

const SAMPLES: Record<string, { user: string; ai: string }> = {
  ko: {
    user: "오늘은 회의가 세 개나 있었어. 마지막 회의에서는\n한 마디도 못 했고, 집에 오는 길에 그게 계속 걸렸어.",
    ai: "((한 마디도 못 했고)) — 거기서 걸음이 멈췄네요. [[knot]]\n오늘은 ==그 말을 고르는 것==까지만 해도 충분해요.\n[[candle]]",
  },
  en: {
    user: "Three meetings today. In the last one I did not say\na single word, and it followed me home.",
    ai: "((did not say a single word)) — that is where you stopped. [[knot]]\nToday, ==choosing the words== is enough on its own.\n[[candle]]",
  },
};

export default function LabPage() {
  const { locale } = useI18n();
  const { writeSpeed, fadePace } = usePrefs();
  const [run, setRun] = useState(0);
  const [pace, setPace] = useState<FadePace>(fadePace);
  const [paused, setPaused] = useState(false);

  const sample = SAMPLES[locale] ?? SAMPLES.en;
  const cpm = WRITE_CPM[writeSpeed];
  const dwellMs = useMemo(
    () => (Number.isFinite(DWELL_MS[pace]) ? DWELL_MS[pace] : 0),
    [pace],
  );
  const fadeMs = FADE_MS[pace];

  const [aiWritten, setAiWritten] = useState(false);

  const replay = () => {
    setAiWritten(false);
    setRun((value) => value + 1);
  };

  return (
    <div className="relative z-10 flex min-h-dvh flex-col">
      <Header />

      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-10">
        <div className="mb-8 flex flex-wrap items-center gap-2 text-[0.72rem]">
          <button
            type="button"
            onClick={replay}
            className="rounded-full border border-hairline px-3 py-1.5 text-muted-strong transition-colors hover:border-hairline-strong"
          >
            replay
          </button>
          <button
            type="button"
            onClick={() => setPaused((value) => !value)}
            className="rounded-full border border-hairline px-3 py-1.5 text-muted-strong transition-colors hover:border-hairline-strong"
          >
            {paused ? "resume time" : "pause time"}
          </button>
          {(["short", "normal", "long", "never"] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setPace(value)}
              aria-pressed={pace === value}
              className={[
                "rounded-full border px-3 py-1.5 transition-colors",
                pace === value
                  ? "border-hairline-strong text-ink-user"
                  : "border-hairline text-muted hover:text-muted-strong",
              ].join(" ")}
            >
              {value}
            </button>
          ))}
          <span className="text-muted">
            {cpm} cpm · dwell {Math.round(dwellMs / 1000)}s
          </span>
        </div>

        <div
          className="ink-surface space-y-8 text-2xl leading-[1.85] sm:text-[1.7rem]"
          data-paused={paused ? "true" : "false"}
        >
          <InkText
            key={`user-${run}`}
            id={`user-${run}`}
            voice="user"
            raw={sample.user}
            phase={aiWritten ? "resting" : "fresh"}
            cpm={cpm}
            locale={LOCALE_TAG[locale]}
            dwellMs={dwellMs}
            fadeMs={fadeMs}
            instant
          />

          <InkText
            key={`ai-${run}`}
            id={`ai-${run}`}
            voice="ai"
            raw={sample.ai}
            phase={aiWritten ? "resting" : "fresh"}
            cpm={cpm}
            locale={LOCALE_TAG[locale]}
            dwellMs={dwellMs}
            fadeMs={fadeMs}
            onWritten={() => setAiWritten(true)}
          />
        </div>
      </main>
    </div>
  );
}
