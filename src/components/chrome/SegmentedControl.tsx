"use client";

import { useId } from "react";

export type Segment<T extends string> = {
  value: T;
  label: string;
  icon?: React.ReactNode;
  /** Shown to assistive tech when the visible label is an icon alone. */
  srLabel?: string;
};

type Props<T extends string> = {
  label: string;
  value: T;
  segments: readonly Segment<T>[];
  onChange: (value: T) => void;
  /**
   * `true` shows icons only. `"sm"` shows icons only on narrow screens and
   * labels from the `sm` breakpoint up — "Handwriting / Typing" is short in
   * Korean and long enough in English to wrap a 390px header.
   */
  compact?: boolean | "sm";
};

/**
 * A radio group dressed as a pill. The thumb slides rather than cross-fades,
 * because every transition in this app is supposed to feel continuous.
 */
export function SegmentedControl<T extends string>({
  label,
  value,
  segments,
  onChange,
  compact = false,
}: Props<T>) {
  const groupId = useId();
  const iconOnly = compact === true;
  const iconOnlyBelowSm = compact === "sm";
  const index = Math.max(
    0,
    segments.findIndex((segment) => segment.value === value),
  );

  return (
    <div
      role="radiogroup"
      aria-label={label}
      // Grid rather than flex so every segment is exactly as wide as the
      // widest one, which is what lets the thumb be a pure CSS calc.
      className="relative grid auto-cols-fr grid-flow-col items-center rounded-full border border-hairline p-[3px]"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute top-[3px] bottom-[3px] rounded-full bg-[color-mix(in_srgb,var(--ink-user)_8%,transparent)] transition-[left] duration-[var(--duration-chrome)] ease-[var(--ease-settle)]"
        style={{
          width: `calc((100% - 6px) / ${segments.length})`,
          left: `calc(3px + ${index} * (100% - 6px) / ${segments.length})`,
        }}
      />
      {segments.map((segment) => {
        const selected = segment.value === value;
        return (
          <button
            key={segment.value}
            type="button"
            role="radio"
            id={`${groupId}-${segment.value}`}
            aria-checked={selected}
            aria-label={compact ? (segment.srLabel ?? segment.label) : undefined}
            title={compact ? (segment.srLabel ?? segment.label) : undefined}
            onClick={() => onChange(segment.value)}
            className={[
              "relative z-10 inline-flex items-center justify-center gap-1.5 rounded-full",
              iconOnly
                ? "size-7"
                : iconOnlyBelowSm
                  ? "size-7 sm:h-7 sm:w-auto sm:px-3.5"
                  : "h-7 px-3.5",
              "text-[0.72rem] tracking-[0.02em] whitespace-nowrap",
              "transition-colors duration-[var(--duration-chrome)]",
              selected ? "text-ink-user" : "text-muted hover:text-muted-strong",
            ].join(" ")}
          >
            {segment.icon}
            {!iconOnly && (
              <span className={iconOnlyBelowSm ? "hidden sm:inline" : undefined}>
                {segment.label}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
