import type { Metadata, Viewport } from "next";
import { fontVariables } from "@/lib/fonts";
import { LOCALE_TAG } from "@/lib/i18n/config";
import { I18nProvider } from "@/lib/i18n/provider";
import { PrefsProvider } from "@/lib/prefs/provider";
import { readServerPrefs } from "@/lib/server-prefs";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Inkling — a page that writes back",
    template: "%s · Inkling",
  },
  description:
    "An ephemeral handwriting diary. Write by hand or by keyboard, watch a page write back at human speed, and let both fade away. Nothing is saved.",
  applicationName: "Inkling",
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    title: "Inkling — a page that writes back",
    description:
      "Write today by hand. The page answers in its own handwriting, then lets it go.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f3ea" },
    { media: "(prefers-color-scheme: dark)", color: "#0f1216" },
  ],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme, mode, locale } = await readServerPrefs();

  return (
    <html lang={LOCALE_TAG[locale]} data-theme={theme} className={fontVariables}>
      <body>
        <PrefsProvider initialTheme={theme} initialMode={mode}>
          <I18nProvider initialLocale={locale}>{children}</I18nProvider>
        </PrefsProvider>
      </body>
    </html>
  );
}
