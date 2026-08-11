"use client";

import { useI18n } from "@/lib/i18n/provider";
import { HANDS, type Hand } from "@/lib/prefs/config";

/**
 * You cannot pick a handwriting face from its name, so every option writes
 * the same line in its own hand. The sample is the label; the name underneath
 * is only there to be spoken and to be found again later.
 */
export function HandPicker({
  label,
  value,
  tone,
  onChange,
}: {
  label: string;
  value: Hand;
  /** Which ink the samples are written in. */
  tone: "user" | "ai";
  onChange: (hand: Hand) => void;
}) {
  const { t } = useI18n();

  const names: Record<Hand, string> = {
    pen: t.settings.handPen,
    quill: t.settings.handQuill,
    brush: t.settings.handBrush,
    print: t.settings.handPrint,
  };

  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="grid grid-cols-2 gap-2"
    >
      {HANDS.map((hand) => {
        const active = hand === value;
        return (
          <button
            key={hand}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={names[hand]}
            onClick={() => onChange(hand)}
            className={[
              "flex flex-col items-start gap-1 rounded-lg border px-3 py-2.5 text-left",
              "transition-colors duration-[var(--duration-chrome)]",
              active
                ? "border-hairline-strong bg-[color-mix(in_srgb,var(--ink-user)_5%,transparent)]"
                : "border-hairline hover:border-hairline-strong",
            ].join(" ")}
          >
            <span
              aria-hidden
              data-hand={hand}
              className={[
                "hand-sample block max-w-full truncate leading-tight",
                tone === "ai" ? "text-ink-ai" : "text-ink-user",
              ].join(" ")}
            >
              {t.settings.handSample}
            </span>
            <span
              aria-hidden
              className={[
                "text-[0.66rem] tracking-[0.06em] uppercase",
                active ? "text-muted-strong" : "text-muted",
              ].join(" ")}
            >
              {names[hand]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
