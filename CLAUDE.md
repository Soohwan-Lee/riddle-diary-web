# CLAUDE.md

Guidance for AI agents working in this repository.

## What this is

**Inkling** — an ephemeral handwriting diary. The user writes (by hand or by
typing); an AI writes back in handwriting at human speed; both fade from the
page and from the DOM. Framed as slow-technology / critical-design research in
a daily-reflection wellbeing context.

Read `docs/PLAN.md` before making design decisions. It is the source of truth
for concept, tokens, engine architecture, and safety rules.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript strict · Tailwind CSS 4
(`@theme`, CSS-first) · zustand · perfect-freehand · openai (Responses API,
`gpt-5.4-mini`) · zod · Vitest. No animation library — CSS + WAAPI only.

## Commands

```bash
npm run dev        # dev server
npm run check      # typecheck + lint + test (run before every commit)
npm run build      # production build
```

## Layout

```
src/app/          routes; api/converse is the only server endpoint
src/components/   UI; ink/ holds the rendering primitives
src/lib/ink/      the ink engine (timing, segmentation, mark geometry)
src/lib/ai/       prompt, InkScript parser, OpenAI client
src/lib/i18n/     ko/en dictionaries + provider
src/store/        zustand stores (ink nodes, session, settings)
```

## Non-negotiable rules

1. **Nothing is persisted.** No database, no server logs of user content, no
   localStorage of conversation. Only settings (theme, locale, mode, pace) are
   stored locally. History lives in memory and dies with the tab.
2. **Two ink backends, one clock.** Text reveals via per-grapheme `clip-path`;
   marks draw via SVG `stroke-dashoffset`. Both schedule through `InkClock`.
   Do not add a third timing mechanism.
3. **Animate only** `opacity`, `transform`, `clip-path`, `stroke-dashoffset`.
   Fades run as CSS animations, never a JS rAF loop.
4. **Never make it fast.** Minimum durations are deliberate. Do not add a
   "skip animation" affordance; do add accessibility escapes (§5).
5. **Accessibility is not optional.** Full text always reaches an `aria-live`
   region, `prefers-reduced-motion` is honored, and hold-to-keep must work.
6. **Safety.** Crisis resources stay reachable; the app never claims to be
   medical care. Validate every API input with zod.
7. `OPENAI_API_KEY` is server-only. Without it the route serves mock streams.

## Conventions

- Server components by default; `"use client"` only where interaction needs it.
- Colors come from CSS variables in `globals.css` — never hardcode hex in TSX.
- User-facing strings live in `src/lib/i18n/dictionaries`, never inline.
- Pure engine logic (segmentation, timing, geometry, parsing) is unit-tested;
  animation itself is verified by hand against `/lab`.
