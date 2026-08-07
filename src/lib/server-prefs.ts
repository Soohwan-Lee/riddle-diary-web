import { cookies } from "next/headers";
import {
  DEFAULT_INPUT_MODE,
  DEFAULT_THEME,
  MODE_COOKIE,
  THEME_COOKIE,
  isInputMode,
  isTheme,
  type InputMode,
  type Theme,
} from "@/lib/prefs/config";
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  isLocale,
  type Locale,
} from "@/lib/i18n/config";

export type ServerPrefs = {
  theme: Theme;
  mode: InputMode;
  locale: Locale;
};

/** Reads first-paint preferences so the server renders the right shell. */
export async function readServerPrefs(): Promise<ServerPrefs> {
  const jar = await cookies();
  const theme = jar.get(THEME_COOKIE)?.value;
  const mode = jar.get(MODE_COOKIE)?.value;
  const locale = jar.get(LOCALE_COOKIE)?.value;

  return {
    theme: isTheme(theme) ? theme : DEFAULT_THEME,
    mode: isInputMode(mode) ? mode : DEFAULT_INPUT_MODE,
    locale: isLocale(locale) ? locale : DEFAULT_LOCALE,
  };
}
