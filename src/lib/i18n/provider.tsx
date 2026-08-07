"use client";

import { createContext, use, useCallback, useMemo, useState } from "react";
import { LOCALE_COOKIE, LOCALE_TAG, type Locale } from "./config";
import { getDictionary, type Dictionary } from "./dictionaries";

type Translation<T> = {
  [K in keyof T]: T[K] extends string ? string : Translation<T[K]>;
};

type I18nValue = {
  locale: Locale;
  tag: string;
  t: Translation<Dictionary>;
  setLocale: (locale: Locale) => void;
};

const I18nContext = createContext<I18nValue | null>(null);

/**
 * The locale is a cookie rather than localStorage so the server renders the
 * right language on the first paint — no flash of the wrong copy.
 */
export function I18nProvider({
  initialLocale,
  children,
}: {
  initialLocale: Locale;
  children: React.ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    document.documentElement.lang = LOCALE_TAG[next];
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
  }, []);

  const value = useMemo<I18nValue>(
    () => ({
      locale,
      tag: LOCALE_TAG[locale],
      t: getDictionary(locale),
      setLocale,
    }),
    [locale, setLocale],
  );

  return <I18nContext value={value}>{children}</I18nContext>;
}

export function useI18n(): I18nValue {
  const value = use(I18nContext);
  if (!value) throw new Error("useI18n must be used inside <I18nProvider>");
  return value;
}
