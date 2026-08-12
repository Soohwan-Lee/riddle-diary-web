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
src/lib/ink/      the ink engine (timing, segmentation, mark and glyph geometry)
src/lib/ai/       prompt, InkScript parser, OpenAI client
src/lib/i18n/     ko/en dictionaries + provider
src/store/        zustand stores (ink nodes, session, settings)
```

## How the page turns

`pageMode` is `blank` (default) or `keep`.

- **blank** — handing something over rests it immediately and marks everything
  already on the paper `absorbing`; those sink at `ABSORB_*` speed. A reply
  rests for `readDwellMs()` — a script-weighted reading estimate, not a fixed
  number. The result is that you always write on an empty sheet.
- **keep** — one dwell for everything, as before.
- `fadePace: "never"` overrides both. In `blank` the pace control is a
  multiplier on reading time instead of a dwell.

The opening line is `pinned`: `restAll()` skips it until an entry unpins it.
It is written by `greet()`, which never touches `status`, so the surface
accepts writing while the page is still asking its question.

## What Riddle draws

`[[name]]` in InkScript asks for one of the nine glyphs in `lib/ink/glyph.ts`.
A fixed vocabulary, not free-form SVG: model-invented paths are unreliable, and
a name looked up in a table cannot carry markup into the renderer.

- `parseInkScript` returns `text` (U+FFFC per drawing, so mark ranges and
  grapheme indices still line up) and `source` (the tokens kept, the mark
  delimiters gone). `source` is what history, the model and the transcript get;
  the placeholder never leaves the renderer.
- Streaming: an unclosed `[[` truncates the text until `]]` arrives. Half a name
  is not half a drawing, and text may only ever grow.
- A drawing occupies one grapheme slot, so text wraps around it and a mark can
  enclose it. It is excluded from the script-tempo normalisation and gets a
  fixed duration that scales with `writeSpeed`.
- New glyphs go in `glyph.ts` and need a label in `dictionaries.glyphs`, or a
  screen reader hears nothing.

## Someday: memory, not transcript

Not built. Recorded here so nobody builds half of it by accident, and so
nobody reads rule 1 and concludes the idea is off the table.

In the film, the writing vanishes and the two of them still remember. What
they carry forward is not a log of the words — the words are gone — but the
fact of having talked. That distinction is the whole feature.

The direction: **people log in, and Riddle keeps a memory of them.** What is
kept is a memory, never a transcript. The conversation itself never comes
back, and no affordance may ever exist for reading it again.

- **Within a session this already works** — `history` in `src/store/session.ts`
  (last `MAX_HISTORY_TURNS` messages) is what goes upstream. It lives in the
  tab and dies with it, which is why reloading is a clean slate today.
- **The next step is across sessions**: log out, come back, and Riddle picks up
  where you left off.

If it is ever built, these hold or it is not this product any more:

- A memory is written *about* an exchange, not *from* it. Storing the messages
  and calling it memory is the failure mode, not a shortcut to the feature.
- Opt-in per account, visible, editable, and deletable in one action.
- The page still clears. Nothing kept ever comes back onto the paper.
- Rule 1 gets rewritten before a single row is stored, not after — and
  `/about` and the README say plainly what is kept and what is not.

## Non-negotiable rules

1. **Nothing is persisted.** No database, no server logs of user content, no
   localStorage of conversation. Only settings (theme, locale, mode, page mode,
   handwriting faces, pace, speed, whether the opening note was dismissed) are
   stored locally. History lives in memory and dies with the tab. There is a
   direction that would change this — see "Someday: memory, not transcript" —
   but it is not built, and until it is, this rule holds without exception.
2. **Two ink backends, one clock.** Text reveals via per-grapheme `clip-path`;
   marks *and drawings* draw via SVG `stroke-dashoffset`. Both schedule through
   `InkClock`. Do not add a third timing mechanism.
3. **Animate only** `opacity`, `transform`, `clip-path`, `stroke-dashoffset`.
   Fades run as CSS animations, never a JS rAF loop.
4. **It must read as writing, not as waiting.** What carries that is the
   per-character rhythm, not the total, so the tempo may be raised — but never
   to the point where a reply arrives at once. No "skip animation" affordance;
   accessibility escapes instead (§5). The one thing exempt from
   reduced-motion shortening is the hand-over countdown ring: it reports when
   your writing leaves, so it must run its real length.
   Reduced motion shortens a draw-on by *position in the `animation`
   shorthand*, never through `--mark-d` / `--glyph-d` — those are set inline on
   the element, and an inline custom property beats any stylesheet.
5. **Accessibility is not optional.** Full text always reaches an `aria-live`
   region, `prefers-reduced-motion` is honored, and hold-to-keep must work.
6. **Safety.** Crisis resources stay reachable; the app never claims to be
   medical care. Validate every API input with zod.
7. `OPENAI_API_KEY` is server-only. Without it the route serves mock streams.

## Conventions

- Server components by default; `"use client"` only where interaction needs it.
- Colors come from CSS variables in `globals.css` — never hardcode hex in TSX.
- Handwriting faces are four Latin+Hangul pairs defined in `globals.css` as
  `--hand-<name>`. Anything visible in the first paint (theme, locale, input
  mode, both hands) travels in a cookie and is read by `readServerPrefs`;
  everything else is localStorage.
- User-facing strings live in `src/lib/i18n/dictionaries`, never inline.
- Pure engine logic (segmentation, timing, geometry, parsing) is unit-tested;
  animation itself is verified by hand against `/lab`.
