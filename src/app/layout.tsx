import type { Metadata, Viewport } from "next";
import { fontVariables } from "@/lib/fonts";
import { LOCALE_TAG } from "@/lib/i18n/config";
import { I18nProvider } from "@/lib/i18n/provider";
import { PrefsProvider } from "@/lib/prefs/provider";
import { readServerPrefs } from "@/lib/server-prefs";
import "./globals.css";

/**
 * Vercel sets `VERCEL_PROJECT_PRODUCTION_URL` for us; without it the icons and
 * social card still resolve, just against localhost. Set `NEXT_PUBLIC_SITE_URL`
 * when deploying anywhere else.
 */
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
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
  const { theme, mode, locale, handUser, handAi } = await readServerPrefs();

  return (
    <html
      lang={LOCALE_TAG[locale]}
      data-theme={theme}
      data-hand-user={handUser}
      data-hand-ai={handAi}
      className={fontVariables}
    >
      <body>
        <PrefsProvider
          initialTheme={theme}
          initialMode={mode}
          initialHandUser={handUser}
          initialHandAi={handAi}
        >
          <I18nProvider initialLocale={locale}>{children}</I18nProvider>
        </PrefsProvider>
      </body>
    </html>
  );
}
