"use client";

import { AutoIcon, KeyboardIcon, MoonIcon, PenIcon, SunIcon } from "@/components/icons";
import { SegmentedControl, type Segment } from "./SegmentedControl";
import { useI18n } from "@/lib/i18n/provider";
import { LOCALES, type Locale } from "@/lib/i18n/config";
import { usePrefs } from "@/lib/prefs/provider";
import type { InputMode, Theme } from "@/lib/prefs/config";

export function ModeToggle() {
  const { t } = useI18n();
  const { mode, setMode } = usePrefs();

  const segments: Segment<InputMode>[] = [
    { value: "hand", label: t.chrome.modeHand, icon: <PenIcon className="size-3.5" /> },
    {
      value: "type",
      label: t.chrome.modeType,
      icon: <KeyboardIcon className="size-3.5" />,
    },
  ];

  return (
    <SegmentedControl
      label={t.chrome.modeLabel}
      value={mode}
      segments={segments}
      onChange={setMode}
    />
  );
}

export function ThemeToggle() {
  const { t } = useI18n();
  const { theme, setTheme } = usePrefs();

  const segments: Segment<Theme>[] = [
    {
      value: "light",
      label: t.chrome.themeLight,
      srLabel: t.chrome.themeLight,
      icon: <SunIcon className="size-3.5" />,
    },
    {
      value: "dark",
      label: t.chrome.themeDark,
      srLabel: t.chrome.themeDark,
      icon: <MoonIcon className="size-3.5" />,
    },
    {
      value: "system",
      label: t.chrome.themeSystem,
      srLabel: t.chrome.themeSystem,
      icon: <AutoIcon className="size-3.5" />,
    },
  ];

  return (
    <SegmentedControl
      compact
      label={t.chrome.themeLabel}
      value={theme}
      segments={segments}
      onChange={setTheme}
    />
  );
}

const LOCALE_LABEL: Record<Locale, string> = { ko: "KOR", en: "ENG" };

export function LocaleToggle() {
  const { t, locale, setLocale } = useI18n();

  const segments: Segment<Locale>[] = LOCALES.map((value) => ({
    value,
    label: LOCALE_LABEL[value],
  }));

  return (
    <SegmentedControl
      label={t.chrome.localeLabel}
      value={locale}
      segments={segments}
      onChange={setLocale}
    />
  );
}
