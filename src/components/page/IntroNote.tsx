"use client";

import { useI18n } from "@/lib/i18n/provider";

/**
 * Three sentences, once. Deliberately not a modal: this app's whole argument
 * is that nothing should demand to be dealt with, and a first-time reader who
 * ignores this and starts writing has done the right thing anyway.
 */
export function IntroNote({ onDismiss }: { onDismiss: () => void }) {
  const { t } = useI18n();

  return (
    <aside
      aria-label={t.intro.title}
      className="ink-intro mb-9 rounded-lg border border-hairline px-5 py-4"
    >
      <p className="mb-3 text-[0.7rem] font-medium tracking-[0.1em] text-muted-strong uppercase">
        {t.intro.title}
      </p>

      <ul className="space-y-1.5 text-[0.82rem] leading-relaxed text-muted-strong">
        <li>{t.intro.write}</li>
        <li>{t.intro.fade}</li>
        <li>{t.intro.hold}</li>
      </ul>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
        <button
          type="button"
          onClick={onDismiss}
          className="rounded-full border border-hairline-strong px-3.5 py-1.5 text-[0.72rem] text-ink-user transition-colors hover:bg-[color-mix(in_srgb,var(--ink-user)_6%,transparent)]"
        >
          {t.intro.dismiss}
        </button>
        <p className="text-[0.68rem] text-muted">{t.intro.again}</p>
      </div>
    </aside>
  );
}
