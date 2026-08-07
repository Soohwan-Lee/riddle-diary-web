export const LOCALES = ["ko", "en"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "ko";

export const LOCALE_COOKIE = "inkling.locale";

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

/** BCP 47 tags for `<html lang>` and `Intl.Segmenter`. */
export const LOCALE_TAG: Record<Locale, string> = {
  ko: "ko-KR",
  en: "en-US",
};
