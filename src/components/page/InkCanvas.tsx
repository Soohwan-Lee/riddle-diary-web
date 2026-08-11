"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  EraserIcon,
  InkDropIcon,
  PenIcon,
  UndoIcon,
} from "@/components/icons";
import { useI18n } from "@/lib/i18n/provider";
import {
  rasterizeStrokes,
  strokeHitTest,
  strokeToPath,
  type Stroke,
  type StrokePoint,
  type StrokeStyle,
} from "@/lib/ink/strokes";
import { AUTO_HANDOFF_MS } from "@/lib/prefs/config";

/** Beyond this the page is full; the reader is asked to hand it over. */
const MAX_STROKES = 800;
const ERASER_RADIUS = 14;
const MIN_HEIGHT = 260;
/** Extra room that appears below the lowest stroke, so writing never boxes in. */
const HEADROOM = 140;

type Tool = "pen" | "eraser";

export function InkCanvas({
  disabled,
  allowFinger,
  autoHandoff,
  onSend,
  onActivity,
}: {
  disabled: boolean;
  allowFinger: boolean;
  /** Take a finished entry once the pen has been still for a moment. */
  autoHandoff: boolean;
  onSend: (payload: { strokes: Stroke[]; image: string }) => void;
  onActivity: () => void;
}) {
  const { t } = useI18n();
  const surfaceRef = useRef<HTMLDivElement>(null);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [live, setLive] = useState<Stroke | null>(null);
  const [tool, setTool] = useState<Tool>("pen");
  const [pointerKind, setPointerKind] = useState<"pen" | "other">("other");
  /** Bumped to put the countdown back to zero. */
  const [arm, setArm] = useState(0);
  /** "Not yet" — this entry waits for the button, however long it takes. */
  const [waiting, setWaiting] = useState(false);

  const style = useMemo<StrokeStyle>(
    () => ({ size: 4.4, simulatePressure: pointerKind !== "pen" }),
    [pointerKind],
  );

  const height = Math.max(
    MIN_HEIGHT,
    ...[...strokes, live ?? []].flat().map(([, y]) => y + HEADROOM),
  );

  const pointFrom = useCallback(
    (event: React.PointerEvent): StrokePoint | null => {
      const surface = surfaceRef.current;
      if (!surface) return null;
      const box = surface.getBoundingClientRect();
      return [
        event.clientX - box.left,
        event.clientY - box.top,
        event.pressure > 0 ? event.pressure : 0.5,
      ];
    },
    [],
  );

  const accepts = (event: React.PointerEvent) =>
    !disabled && (allowFinger || event.pointerType !== "touch");

  const rearm = useCallback(() => setArm((count) => count + 1), []);

  const handleDown = (event: React.PointerEvent) => {
    if (!accepts(event)) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    setPointerKind(event.pointerType === "pen" ? "pen" : "other");
    onActivity();
    rearm();

    const point = pointFrom(event);
    if (!point) return;

    if (tool === "eraser") {
      erase(point[0], point[1]);
      return;
    }
    if (strokes.length >= MAX_STROKES) return;
    setLive([point]);
  };

  const handleMove = (event: React.PointerEvent) => {
    if (!accepts(event)) return;

    if (tool === "eraser") {
      if (event.buttons === 0) return;
      const point = pointFrom(event);
      if (point) erase(point[0], point[1]);
      return;
    }

    if (!live) return;
    onActivity();

    // Coalesced events recover the samples the browser batched between
    // frames — the difference between a smooth curve and a polygon.
    const events =
      typeof event.nativeEvent.getCoalescedEvents === "function"
        ? event.nativeEvent.getCoalescedEvents()
        : [event.nativeEvent];

    const surface = surfaceRef.current;
    if (!surface) return;
    const box = surface.getBoundingClientRect();

    const added: StrokePoint[] = events.map((sample) => [
      sample.clientX - box.left,
      sample.clientY - box.top,
      sample.pressure > 0 ? sample.pressure : 0.5,
    ]);

    setLive((current) => (current ? [...current, ...added] : current));
  };

  const handleUp = () => {
    if (!live) return;
    const finished = live;
    setLive(null);
    if (finished.length > 1) setStrokes((current) => [...current, finished]);
  };

  const erase = (x: number, y: number) => {
    setStrokes((current) =>
      current.filter((stroke) => !strokeHitTest(stroke, x, y, ERASER_RADIUS)),
    );
    rearm();
  };

  const undo = () => {
    setStrokes((current) => current.slice(0, -1));
    rearm();
  };

  const clear = () => {
    setStrokes([]);
    setWaiting(false);
  };

  const send = useCallback(() => {
    if (strokes.length === 0 || disabled) return;
    const image = rasterizeStrokes(strokes, style);
    if (!image) return;
    onSend({ strokes, image });
    setStrokes([]);
    setWaiting(false);
  }, [strokes, disabled, style, onSend]);

  const ready = strokes.length > 0 && !disabled;
  const inking = live !== null;
  /** The countdown is running: something is written, the pen is down nowhere. */
  const counting = autoHandoff && !waiting && ready && !inking;

  // The timer is what actually hands the page over; the ring beside the button
  // is the same duration rendered, so the wait is never a guess. Restarting is
  // a matter of bumping `arm` — every stroke, erase and undo does.
  // Held in a ref rather than a dependency: `send` is re-created whenever the
  // page above re-renders, and a countdown that restarts because a word
  // somewhere else finished fading would never finish.
  const sendRef = useRef(send);
  useEffect(() => {
    sendRef.current = send;
  }, [send]);

  useEffect(() => {
    if (!counting) return;
    const id = window.setTimeout(() => sendRef.current(), AUTO_HANDOFF_MS);
    return () => window.clearTimeout(id);
  }, [counting, arm]);

  const drawing = [...strokes, ...(live ? [live] : [])];

  return (
    <div>
      {/* Handwriting is inherently pointer-driven. Rather than dress the
          canvas in `role="application"` and trap a screen reader in a surface
          with no keyboard affordances, say so plainly and point at the mode
          that does work. */}
      <p className="sr-only">{t.hand.pointerOnly}</p>

      <div
        ref={surfaceRef}
        role="group"
        aria-label={t.hand.canvasLabel}
        aria-disabled={disabled}
        onPointerDown={handleDown}
        onPointerMove={handleMove}
        onPointerUp={handleUp}
        onPointerCancel={handleUp}
        onPointerLeave={handleUp}
        // Without this the browser scrolls the page instead of drawing.
        style={{ touchAction: "none", height }}
        className={[
          "relative w-full rounded-sm",
          "bg-[repeating-linear-gradient(to_bottom,transparent,transparent_calc(2.6rem_-_1px),var(--rule)_calc(2.6rem_-_1px),var(--rule)_2.6rem)]",
          tool === "eraser" ? "cursor-cell" : "cursor-crosshair",
          disabled ? "opacity-40" : "",
        ].join(" ")}
      >
        <svg
          className="pointer-events-none absolute inset-0 size-full text-ink-user"
          focusable="false"
          aria-hidden
        >
          {drawing.map((stroke, index) => (
            <path key={index} className="ink-stroke" d={strokeToPath(stroke, style)} />
          ))}
        </svg>

        {strokes.length === 0 && !live && (
          <p className="ink-entry pointer-events-none absolute top-1 left-0 text-muted/45 select-none">
            {t.composer.placeholder}
          </p>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1">
          <ToolButton
            label={t.hand.pen}
            active={tool === "pen"}
            onClick={() => setTool("pen")}
          >
            <PenIcon className="size-4" />
          </ToolButton>
          <ToolButton
            label={t.hand.eraser}
            active={tool === "eraser"}
            onClick={() => setTool("eraser")}
          >
            <EraserIcon className="size-4" />
          </ToolButton>
          <ToolButton
            label={t.hand.undo}
            disabled={strokes.length === 0}
            onClick={undo}
          >
            <UndoIcon className="size-4" />
          </ToolButton>
          <button
            type="button"
            onClick={clear}
            disabled={strokes.length === 0}
            className="ml-1 rounded-full px-2 py-1 text-[0.68rem] text-muted transition-colors hover:text-muted-strong disabled:opacity-35"
          >
            {t.hand.clear}
          </button>
        </div>

        <div className="flex items-center gap-2.5">
          {/* One line that always says what will happen next: what the surface
              accepts when it is empty, that the page is about to take the
              entry while the countdown runs, and that it is waiting on the
              button once you have said "not yet". */}
          <p className="text-right text-[0.68rem] text-muted" aria-live="polite">
            {!ready
              ? allowFinger
                ? t.hand.fingerHint
                : t.hand.penOnlyHint
              : counting
                ? t.hand.autoHint
                : t.hand.manualHint}
          </p>

          {counting && (
            <button
              type="button"
              onClick={() => setWaiting(true)}
              className="rounded-full px-2 py-1 text-[0.68rem] text-muted underline decoration-hairline-strong underline-offset-4 transition-colors hover:text-ink-user"
            >
              {t.hand.notYet}
            </button>
          )}

          <span className="relative inline-flex size-9 shrink-0">
            {counting && (
              // Remounting on `arm` is what restarts the animation; the
              // timeout above is armed by the same value.
              <svg
                key={arm}
                className="handoff-ring pointer-events-none absolute inset-0 size-full"
                viewBox="0 0 36 36"
                aria-hidden
                focusable="false"
                style={
                  { "--arm-d": `${AUTO_HANDOFF_MS}ms` } as React.CSSProperties
                }
              >
                <circle cx="18" cy="18" r="17.25" pathLength={1} />
              </svg>
            )}
            <button
              type="button"
              onClick={send}
              disabled={!ready}
              aria-label={t.hand.send}
              title={t.hand.send}
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
          </span>
        </div>
      </div>
    </div>
  );
}

function ToolButton({
  label,
  active,
  disabled,
  onClick,
  children,
}: {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-pressed={active}
      title={label}
      className={[
        "inline-flex size-8 items-center justify-center rounded-full transition-colors",
        active
          ? "bg-[color-mix(in_srgb,var(--ink-user)_9%,transparent)] text-ink-user"
          : "text-muted hover:text-muted-strong",
        "disabled:pointer-events-none disabled:opacity-35",
      ].join(" ")}
    >
      {children}
    </button>
  );
}
