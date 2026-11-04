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

- **blank** — the paper is one hand's at a time. Handing something over rests
  it immediately and marks everything already on the paper `absorbing`; those
  sink at `ABSORB_*` speed. The reply is **held until the sheet is empty** —
  `whenPaperClears()` in the session store — while the request itself goes out
  at once and the text queues in the meantime. The reply then rests for
  `readDwellMs()`, a script-weighted reading estimate, and the entry area comes
  back only when the last of it has gone.
- **keep** — one dwell for everything, and the reply starts straight away.
- `fadePace: "never"` overrides both. In `blank` the pace control is a
  multiplier on reading time instead of a dwell.

The gate reads the store, never a render snapshot: a snapshot describes the
page as it was before the entry landed, which reports an empty sheet at exactly
the wrong moment. `src/store/session.test.ts` pins that down.

The one thing that shares the paper is the opening line. It is `pinned` and
waits there until you answer, so your first entry lands beside it; both then
sink together before the reply starts.

The opening line is `pinned`: resting skips it until `addUserTurn` unpins it.
It is written by `greet()`, which never touches `status`, so the surface
accepts writing while the page is still asking its question.

## What Riddle draws

`[[name]]` in InkScript asks for one of the sixty glyphs in `lib/ink/glyph.ts`.
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
- A line holding drawings and nothing else is `solo`: drawn at 2.9em, and given
  proportionally more time by the layout. Stretch it in CSS alone and the node
  reports itself written with a stroke still going.
- New glyphs go in `glyph.ts`, need a label in `dictionaries.glyphs` and a name
  in the prompt's DRAWINGS list. `glyph.test.ts` fails if either is missing —
  without the label a screen reader hears nothing, without the prompt line the
  drawing is never asked for.
- Shapes are verified by rendering a contact sheet and looking at it. Four of
  the first thirty were wrong in ways no test can see: a cloud that was a
  mountain range, a crescent that was a lens, a teardrop that was a gem, an
  arch that was a hammock. The contact sheet is `docs/media/glyphs.png`.

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
   The OpenAI Responses request **must set `store: false`** — the API stores
   responses for 30 days by default, which would quietly break this promise.
   Note that this disables application-state retention, not the provider's
   abuse-monitoring retention; say so plainly wherever the privacy claim is
   made.
2. **Two ink backends, one clock.** Text reveals via per-grapheme `clip-path`;
   marks *and drawings* draw via SVG `stroke-dashoffset`. Both schedule through
   `InkClock`. Do not add a third timing mechanism.
3. **Animate only** `opacity`, `transform`, `clip-path`, `stroke-dashoffset`.
   Fades run as CSS animations, never a JS rAF loop.
4. **It must read as writing, not as waiting.** What carries that is the
   per-character rhythm, not the total, so the tempo may be raised — but never
   to the point where a reply arrives at once. The rests scale with the hand
   against `PAUSE_REFERENCE_CPM`, so the tempo is one number rather than
   letters plus a fixed tax. No "skip animation" affordance;
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
- The paper's width is `.ink-sheet` and its type size is `--ink-size`, both in
  `ink.css`. Both hands read the one variable: the caret has to sit in the same
  line of text the ink lands on, so the composer and the ink can never be given
  sizes separately.
- Pure engine logic (segmentation, timing, geometry, parsing) is unit-tested;
  animation itself is verified by hand against `/lab`.
