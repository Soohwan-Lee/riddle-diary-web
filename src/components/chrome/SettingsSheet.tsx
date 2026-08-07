"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { CloseIcon } from "@/components/icons";
import { useI18n } from "@/lib/i18n/provider";
import {
  DWELL_MS,
  FADE_PACES,
  WRITE_SPEEDS,
  type FadePace,
  type WriteSpeed,
} from "@/lib/prefs/config";
import { usePrefs } from "@/lib/prefs/provider";
import { LocaleToggle, ThemeToggle } from "./Controls";
import { SegmentedControl, type Segment } from "./SegmentedControl";

export function SettingsSheet({
  open,
  onClose,
  onClearPage,
}: {
  open: boolean;
  onClose: () => void;
  onClearPage: () => void;
}) {
  const { t } = useI18n();
  const {
    fadePace,
    writeSpeed,
    allowFinger,
    reducedMotion,
    setLocalPrefs,
  } = usePrefs();
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    panel.current?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const paceLabels: Record<FadePace, string> = {
    short: t.settings.paceShort,
    normal: t.settings.paceNormal,
    long: t.settings.paceLong,
    never: t.settings.paceNever,
  };

  const speedLabels: Record<WriteSpeed, string> = {
    slow: t.settings.speedSlow,
    normal: t.settings.speedNormal,
    brisk: t.settings.speedBrisk,
  };

  const paceSegments: Segment<FadePace>[] = FADE_PACES.map((value) => ({
    value,
    label: paceLabels[value],
  }));

  const speedSegments: Segment<WriteSpeed>[] = WRITE_SPEEDS.map((value) => ({
    value,
    label: speedLabels[value],
  }));

  const dwell = DWELL_MS[fadePace];

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label={t.chrome.close}
        onClick={onClose}
        className="absolute inset-0 bg-[color-mix(in_srgb,var(--paper)_72%,transparent)] backdrop-blur-[2px]"
      />

      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label={t.settings.title}
        tabIndex={-1}
        className="relative flex h-full w-full max-w-sm flex-col overflow-y-auto border-l border-hairline bg-paper px-6 py-6 outline-none"
      >
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-[0.82rem] font-medium tracking-[0.12em] uppercase">
            {t.settings.title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.chrome.close}
            className="text-muted transition-colors hover:text-ink-user"
          >
            <CloseIcon className="size-5" />
          </button>
        </div>

        <div className="space-y-8 text-[0.8rem]">
          <Field label={t.chrome.themeLabel}>
            <ThemeToggle />
          </Field>

          <Field label={t.chrome.localeLabel}>
            <LocaleToggle />
          </Field>

          <Field label={t.settings.paceLabel} hint={describePace(dwell, t.settings.paceHint)}>
            <SegmentedControl
              label={t.settings.paceLabel}
              value={fadePace}
              segments={paceSegments}
              onChange={(value) => setLocalPrefs({ fadePace: value })}
            />
          </Field>

          <Field
            label={t.settings.writingSpeedLabel}
            hint={reducedMotion ? t.settings.reducedMotionNote : undefined}
          >
            <SegmentedControl
              label={t.settings.writingSpeedLabel}
              value={writeSpeed}
              segments={speedSegments}
              onChange={(value) => setLocalPrefs({ writeSpeed: value })}
            />
          </Field>

          <Field label={t.settings.fingerLabel} hint={t.settings.fingerHint}>
            <Switch
              label={t.settings.fingerLabel}
              checked={allowFinger}
              onChange={(value) => setLocalPrefs({ allowFinger: value })}
            />
          </Field>

          <Field label={t.settings.clearPage} hint={t.settings.clearPageHint}>
            <button
              type="button"
              onClick={() => {
                onClearPage();
                onClose();
              }}
              className="rounded-full border border-hairline px-3.5 py-1.5 text-[0.72rem] text-danger transition-colors hover:border-hairline-strong"
            >
              {t.settings.clearPage}
            </button>
          </Field>

          <section className="border-t border-hairline pt-6">
            <h3 className="mb-2 text-[0.72rem] font-medium tracking-[0.08em] text-muted-strong uppercase">
              {t.settings.helpTitle}
            </h3>
            <p className="mb-3 leading-relaxed text-muted-strong">{t.crisis.intro}</p>
            <ul className="space-y-1 text-muted">
              <li>{t.crisis.kr}</li>
              <li>{t.crisis.intl}</li>
              <li>
                <a
                  href="https://findahelpline.com"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="underline decoration-hairline-strong underline-offset-4 hover:text-ink-user"
                >
                  {t.crisis.directory}
                </a>
              </li>
            </ul>
            <p className="mt-4 text-[0.7rem] leading-relaxed text-muted">
              {t.crisis.disclaimer}
            </p>
          </section>

          <Link
            href="/about"
            className="inline-block text-[0.75rem] text-muted underline decoration-hairline-strong underline-offset-4 transition-colors hover:text-ink-user"
          >
            {t.chrome.about}
          </Link>
        </div>
      </div>
    </div>
  );
}

function describePace(dwellMs: number, hint: string): string {
  if (!Number.isFinite(dwellMs)) return hint;
  const seconds = Math.round(dwellMs / 1000);
  // Rounding 90s up to "2m" would be a lie about the thing being configured.
  const value = seconds < 120 ? `${seconds}s` : `${Math.round(seconds / 60)}m`;
  return `${hint} (${value})`;
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <p className="mb-2 font-medium text-ink-user">{label}</p>
      {children}
      {hint && <p className="mt-2 text-[0.7rem] leading-relaxed text-muted">{hint}</p>}
    </section>
  );
}

function Switch({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className="relative inline-flex h-6 w-11 items-center rounded-full border border-hairline transition-colors"
    >
      <span
        aria-hidden
        className="absolute inset-[3px] rounded-full bg-[color-mix(in_srgb,var(--ink-user)_8%,transparent)] transition-opacity duration-[var(--duration-chrome)]"
        style={{ opacity: checked ? 1 : 0 }}
      />
      <span
        aria-hidden
        className="relative size-4 rounded-full bg-ink-user transition-transform duration-[var(--duration-chrome)] ease-[var(--ease-settle)]"
        style={{ transform: `translateX(${checked ? 1.5 : 0.25}rem)` }}
      />
    </button>
  );
}
