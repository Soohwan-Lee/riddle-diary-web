"use client";

import { useI18n } from "@/lib/i18n/provider";
import { LocaleToggle, ModeToggle, ThemeToggle } from "./Controls";

export function Header({ actions }: { actions?: React.ReactNode }) {
  const { t } = useI18n();

  return (
    <header className="relative z-20 flex items-start justify-between gap-4 px-5 pt-5 sm:px-8 sm:pt-6">
      <div className="min-w-0">
        <p className="font-ui text-[0.82rem] leading-none font-medium tracking-[0.14em] text-ink-user uppercase">
          {t.app.name}
        </p>
        <p className="mt-1.5 hidden text-[0.7rem] leading-none text-muted sm:block">
          {t.app.tagline}
        </p>
      </div>

      <nav
        aria-label={t.chrome.settings}
        className="flex flex-wrap items-center justify-end gap-2"
      >
        <ModeToggle />
        {/* On a phone these two would take a third of the screen before a
            single word is written, so they live in the settings sheet there. */}
        <div className="hidden items-center gap-2 sm:flex">
          <ThemeToggle />
          <LocaleToggle />
        </div>
        {actions}
      </nav>
    </header>
  );
}
