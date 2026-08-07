"use client";

import { useI18n } from "@/lib/i18n/provider";
import type { ChatMessage } from "@/store/session";

/**
 * The accessibility counterweight to a disappearing interface.
 *
 * Ink on the page fades and is removed from the DOM; this region never is. It
 * mirrors the remembered history, so a screen reader user is not asked to
 * keep up with a race against an animation.
 */
export function Transcript({ history }: { history: readonly ChatMessage[] }) {
  const { t } = useI18n();

  return (
    // A named `section` is a landmark, which keeps the transcript reachable
    // by region navigation instead of stranded outside every landmark.
    <section className="sr-only" aria-label={t.a11y.transcript}>
      <h2>{t.a11y.transcript}</h2>
      <p>{t.a11y.transcriptHint}</p>
      <div role="log" aria-live="polite" aria-relevant="additions">
        {history.map((message, index) => (
          <p key={`${index}-${message.role}`}>
            <span>
              {message.role === "user" ? t.a11y.userSaid : t.a11y.aiSaid}:{" "}
            </span>
            {message.content}
          </p>
        ))}
      </div>
    </section>
  );
}
