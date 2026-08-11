import { cookies } from "next/headers";
import {
  DEFAULT_HAND_AI,
  DEFAULT_HAND_USER,
  DEFAULT_INPUT_MODE,
  DEFAULT_THEME,
  HAND_AI_COOKIE,
  HAND_USER_COOKIE,
  MODE_COOKIE,
  THEME_COOKIE,
  isHand,
  isInputMode,
  isTheme,
  type Hand,
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
  handUser: Hand;
  handAi: Hand;
};

/** Reads first-paint preferences so the server renders the right shell. */
export async function readServerPrefs(): Promise<ServerPrefs> {
  const jar = await cookies();
  const theme = jar.get(THEME_COOKIE)?.value;
  const mode = jar.get(MODE_COOKIE)?.value;
  const locale = jar.get(LOCALE_COOKIE)?.value;
  const handUser = jar.get(HAND_USER_COOKIE)?.value;
  const handAi = jar.get(HAND_AI_COOKIE)?.value;

  return {
    theme: isTheme(theme) ? theme : DEFAULT_THEME,
    mode: isInputMode(mode) ? mode : DEFAULT_INPUT_MODE,
    locale: isLocale(locale) ? locale : DEFAULT_LOCALE,
    handUser: isHand(handUser) ? handUser : DEFAULT_HAND_USER,
    handAi: isHand(handAi) ? handAi : DEFAULT_HAND_AI,
  };
}
