"use client";

import { useCallback, useRef, useState } from "react";
import { InkDropIcon } from "@/components/icons";
import { useI18n } from "@/lib/i18n/provider";
import { useIsMac } from "@/lib/platform";

/**
 * The composer is not a chat input. It is the same paper, in the same hand,
 * with a caret in it — a real `<textarea>` so Korean IME composition works,
 * dressed so that nothing about it announces "form field".
 */
export function Composer({
  disabled,
  onSend,
  onActivity,
}: {
  disabled: boolean;
  onSend: (text: string) => void;
  onActivity: () => void;
}) {
  const { t } = useI18n();
  const isMac = useIsMac();
  const ref = useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = useState("");
  const ready = value.trim().length > 0 && !disabled;

  const grow = useCallback(() => {
    const element = ref.current;
    if (!element) return;
    element.style.height = "auto";
    element.style.height = `${element.scrollHeight}px`;
  }, []);

  const submit = useCallback(() => {
    const text = value.trim();
    if (!text || disabled) return;
    onSend(text);
    setValue("");
    // Reset the grown height along with the text.
    requestAnimationFrame(grow);
  }, [value, disabled, onSend, grow]);

  return (
    <div className="relative">
      <label htmlFor="composer" className="sr-only">
        {t.composer.placeholder}
      </label>
      <textarea
        id="composer"
        ref={ref}
        rows={1}
        value={value}
        disabled={disabled}
        spellCheck={false}
        placeholder={t.composer.placeholder}
        onChange={(event) => {
          setValue(event.target.value);
          onActivity();
          grow();
        }}
        onKeyDown={(event) => {
          // Enter is a new line — this is a diary, not a chat box.
          if (event.key !== "Enter") return;
          if (event.nativeEvent.isComposing) return;
          if (!event.metaKey && !event.ctrlKey) return;
          event.preventDefault();
          submit();
        }}
        className="font-hand-user placeholder:text-muted/45 w-full resize-none overflow-hidden border-none bg-transparent text-2xl leading-[1.85] text-ink-user caret-ink-user outline-none disabled:opacity-40 sm:text-[1.7rem]"
      />

      <div className="mt-2 flex items-center justify-between gap-4">
        {/* A soft keyboard has no Ctrl key; on a phone the button is the
            whole affordance. */}
        <p className="hidden text-[0.7rem] text-muted sm:block">
          {isMac ? t.composer.hintMac : t.composer.hint}
        </p>
        <button
          type="button"
          onClick={submit}
          disabled={!ready}
          aria-label={t.composer.send}
          title={t.composer.send}
          // Visible from the start, dimmed until there is something to hand
          // over. Hiding it entirely left a first-time reader with no clue
          // that handing anything over was a thing you could do.
          className={[
            "inline-flex size-9 items-center justify-center rounded-full border",
            "transition-colors duration-[var(--duration-chrome)] ease-[var(--ease-settle)]",
            ready
              ? "border-hairline-strong text-ink-ai"
              : "border-hairline text-muted/50",
          ].join(" ")}
        >
          <InkDropIcon className="size-4" />
        </button>
      </div>
    </div>
  );
}
