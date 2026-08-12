"use client";

import { isGlyphName } from "@/lib/ink/glyph";
import { useI18n } from "@/lib/i18n/provider";
import type { ChatMessage } from "@/store/session";

/** `[[moon]]` is a drawing on the paper; here it has to become words. */
const GLYPH_TOKEN = /\[\[([a-z]+)\]\]/g;

/**
 * The accessibility counterweight to a disappearing interface.
 *
 * Ink on the page fades and is removed from the DOM; this region never is. It
 * mirrors the remembered history, so a screen reader user is not asked to
 * keep up with a race against an animation.
 */
export function Transcript({ history }: { history: readonly ChatMessage[] }) {
  const { t } = useI18n();

  const spoken = (content: string) =>
    content.replace(GLYPH_TOKEN, (token, name: string) =>
      isGlyphName(name) ? t.a11y.drawing.replace("{name}", t.glyphs[name]) : token,
    );

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
            {spoken(message.content)}
          </p>
        ))}
      </div>
    </section>
  );
}
