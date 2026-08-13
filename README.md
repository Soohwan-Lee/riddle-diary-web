<div align="center">

<img src="docs/media/mark.svg" width="84" alt="" />

# Inkling

**A page that writes back — and lets go.**

Write down your day. Something answers in its own handwriting, at the speed of a hand.<br/>
Then both of you fade off the paper, and nothing is kept.

[![Next.js 16](https://img.shields.io/badge/Next.js-16-000?logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![React 19](https://img.shields.io/badge/React-19-087ea4?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![gpt-5.4-mini](https://img.shields.io/badge/OpenAI-gpt--5.4--mini-412991?logo=openai&logoColor=white)](https://developers.openai.com/api/docs/models/gpt-5.4-mini)
[![axe: 0 violations](https://img.shields.io/badge/axe-0%20violations-3f8378)](#-accessibility-is-the-hard-part)
[![License: MIT](https://img.shields.io/badge/License-MIT-8a8578)](LICENSE)

<img src="docs/media/writing.gif" width="820" alt="Riddle writes a reply by hand, one character at a time, draws a small knot mid-sentence, circles a phrase, and finishes with a candle drawn on a line of its own." />

</div>

> [!NOTE]
> Every recording on this page runs in real time, at the app's own pace. The
> clips are sped up slightly so a README stays a README.

---

## 🕯️ What this is

Every conversational AI keeps everything. That is useful, and it is also not the only
possible shape.

Inkling is the other one. You write — by hand or by keyboard — and **Riddle** writes
back. Riddle writes the way a person writes: character by character, pausing at commas,
pressing harder at the start of a stroke, and once in a while drawing something small
instead of saying it. Then, after a while, the ink thins and goes, taking your words
with it. Nothing is saved to a server. Nothing survives closing the tab.

The hypothesis it exists to test: **a guarantee of disappearance lowers the threshold
for saying the thing.**

---

## 📖 Always a blank page

The film this borrows from never lets two things share the paper. You write, the
words sink in, the answer surfaces, and by the time you have read it the sheet is
empty again.

<div align="center">
<img src="docs/media/blank.gif" width="820" alt="An entry is handed over and sinks into the page until the sheet is completely empty; only then does Riddle write a reply, with a small drawing of rain in it — and that fades in turn once it has been read, leaving the caret back at the top." />
<br/>
<sub><i>Hand it over · it sinks · Riddle reads · Riddle answers · you read · gone · your turn.</i></sub>
</div>

The reply's dwell is not a fixed number — it is a **reading estimate**, weighted by
script so that Korean and English of equivalent content get equal time on the page.
If you would rather the exchange stayed together, **Keep the exchange** in settings
restores the older behaviour, and **Never fade** turns the whole thing off.

### One hand at a time

Strictly. **Your ink is completely gone before Riddle writes a word, and Riddle's ink is
completely gone before the page comes back to you.** The two of you never share a sheet.

Only half of that used to be true. The reply began the moment the request was sent, so
for a second or two it was writing over an entry that was still sinking. Now the request
goes out immediately and the *reply* is held until the paper is empty; text that arrives
early queues up. Nothing is spent waiting that was not going to be spent anyway — the
model and the absorb run at the same time, and whichever finishes last is the one being
waited for. Measured: 1.4s from your last word to Riddle's first, and no sample in a
three-turn recording with both hands' ink on the page.

The gate reads the store rather than a render snapshot. Taken from a snapshot it
described the page as it was *before* the entry landed — which on the second turn said
"empty" and opened the gate at once. That one is pinned down by a test.

The entry area follows the same rule: in blank-page mode **it exists only on your turn.**
It leaves when you hand something over and returns when the last of the reply has gone,
easing in and taking the caret with it. Before, it sat below the ink in normal flow, so a
reply growing line by line dragged the caret down and snapped it back up when the ink
went — all during a window where nothing could be typed anyway. Now, from the second turn
on, it comes back to exactly the same place: the top of an empty sheet.

There is also **no caret while Riddle writes.** There was once a nib riding the edge of
the reveal; at text sizes it read as a cursor blinking along a line, which is the one
thing this page must never look like. Handwriting appearing on paper has nothing in
front of it. The reveal itself is the pen.

---

## ✨ Features

|   | |
|---|---|
| 📖 | **Blank-page mode.** What you hand over sinks in at once; the reply leaves about the time you finish reading it |
| 🤝 | **One hand at a time.** Your ink is gone before Riddle starts, and Riddle's is gone before the page comes back — the entry area and the caret wait their turn |
| ✍️ | **Two hands, one page.** Write with a stylus, a finger, or a keyboard — toggle at any time |
| 🪶 | **Real handwriting animation.** Per-grapheme reveal in Korean and English, and no cursor in front of it |
| 🖋️ | **Four handwriting faces**, each a Latin face paired with a Hangul one, chosen separately for you and for the page |
| ✏️ | **Hand-drawn marks.** Underlines that flick, circles that overshoot their own start, a highlighter pass |
| 🌤️ | **Riddle draws.** Thirty small things — weather, growing things, a cup, a key, a knot — stroke by stroke in the same hand, inline where a word would go, and now and then as the whole reply |
| 📱 | **A sheet that fits the screen.** The paper and the writing on it grow in four steps from a phone to a wide desktop |
| ⏱️ | **Hand-over you can see coming.** Stop writing and a ring fills; any new stroke puts it back to zero |
| ⏸️ | **Time that waits for you.** The clock stops while you write, while the tab is hidden, and while you hold the paper |
| 🌗 | **Light · dark · system**, resolved server-side so nothing flashes |
| 🌏 | **한국어 / English**, including the page's own handwriting |
| 🔒 | **No database, no logs, no history.** Context lives in the tab and dies with it |
| ♿ | **Zero axe violations** across thirteen page, theme and mode combinations |

---

## 🚀 Quick start

```bash
git clone https://github.com/Soohwan-Lee/riddle-diary-web.git
cd riddle-diary-web
npm install
cp .env.example .env.local     # optional — see below
npm run dev
```

Open <http://localhost:3000>.

**No API key? It still runs.** Without `OPENAI_API_KEY` the route serves canned replies
at a realistic streaming cadence, so the whole interaction — writing, marks, fading — is
fully explorable at zero cost. A missing key is never a 500.

### Environment

| Variable | Required | Notes |
|---|---|---|
| `OPENAI_API_KEY` | no | Server-only. Absent ⇒ mock mode |
| `OPENAI_MODEL` | no | Defaults to `gpt-5.4-mini`. Must support image input and the Responses API |
| `MOCK_AI` | no | `1` forces mock mode even with a key present |

### Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FSoohwan-Lee%2Friddle-diary-web&env=OPENAI_API_KEY&envDescription=Optional%20—%20leave%20blank%20to%20run%20in%20mock%20mode)

Zero configuration. The one endpoint runs on the Node runtime with a 60s ceiling, which
streaming makes irrelevant — time to first character is under a second.

### Scripts

```bash
npm run dev        # dev server
npm run check      # typecheck + lint + tests — run before committing
npm run build      # production build
npm run test       # Vitest
```

---

## 🖋️ How the ink works

The interesting problem: **you cannot animate Hangul handwriting the way tutorials
animate signatures.**

The usual trick is `stroke-dashoffset` along a font's outline. That traces the *contour*
of a letter, not the letter — it looks like someone shading in an outline, and it needs
per-glyph stroke data that simply does not exist for 11,172 Hangul syllables.

So Inkling runs **two backends on one clock**:

| What | Technique | Why |
|---|---|---|
| **Text** | Per-grapheme animated `clip-path` over a real handwriting face | Works identically in Korean and English, at any font size, for any string |
| **Marks and drawings** | `stroke-dashoffset` along a generated path | These *have* real paths, so the pen genuinely moves |

What sells the illusion is the timing, not the technique:

- **Per-character duration** from script and stroke count — a Hangul syllable is three or
  four strokes stacked into one square, so it takes longer than an `a`. Weights shape the
  rhythm; the total is then normalised, so `cpm` means the same thing in every script.
- **±18% jitter** from a seeded hash. Irregular, but frozen per character — a re-render
  must never make the line twitch.
- **Pen lifts** after spaces, longer rests at commas and full stops. The page appears to
  think mid-sentence. These are written against one fixed reference hand and scale from
  there, so the tempo is a single number rather than letters plus a fixed tax: left
  absolute, the rests would have been a fifth of a quick reply.
- **Wet ink** that dries to its resting tone over the following second.
- **Nothing in front of the reveal.** No nib, no caret, no leading marker of any kind —
  see [One hand at a time](#one-hand-at-a-time).

At `normal` a character takes 50ms and a two-sentence Korean reply lands in **2.9s**,
down from 5.9s — exactly 2.00× at every one of the three settings, because the rests
moved with the letters. Well past what a real hand can do, deliberately: what has to
survive is the sense of being written to, and that lives in the per-character rhythm
rather than in the total. There is still no instant option, and there never will be.

Marks are drawn *after* the sentence is finished, the way a person marks. A hand-drawn
circle's giveaway is that it passes its own starting point instead of meeting it, so it
sweeps 1.08 turns.

### Riddle draws

Not only writes. Riddle asks for a drawing by name — `[[rain]]`, `[[knot]]`,
`[[hourglass]]` — and the same `stroke-dashoffset` engine that draws the circles draws
it, stroke by stroke, in the order a hand would make them.

A fixed vocabulary of thirty rather than free-form SVG, for two reasons.
**Reliability:** paths a model invents come out broken or ugly and there is no way to
know which until it is on the paper. **Safety:** a name is looked up in a table, so
nothing the model writes can reach the renderer as markup.

<div align="center">
<img src="docs/media/glyphs.png" width="820" alt="Thirty hand-drawn glyphs: sun, moon, star, cloud, rain, snow, lightning, rainbow, wind, leaf, sprout, tree, flower, mountain, wave, drop, boat, bird, feather, cup, candle, key, window, bridge, heart, spiral, arrow, knot, clock, hourglass." />
<br/>
<sub><i>The same wobble the marks use, so a drawing and a circle around a word look like one person's hand.</i></sub>
</div>

Nine of these was a set of icons, not a vocabulary. Someone writing by hand reaches for a
doodle when a sentence would say it worse, so the list now covers weather in six kinds,
growing things, a few small objects to point at — and a knot, which is what going over
the same thing again looks like.

A drawing takes **one character's room in the line** but nothing like one character's
time. It sits outside the script normalisation — that exists to hold Korean and English
to the same tempo, and a drawing is neither script; folded in, it would be squeezed into
a letter's worth of time while every letter beside it stretched to make room. So it gets
its own duration, which scales with the hand, and strokes share it by weight: a sun's
disc takes longer than one of its rays.

Because it occupies a real slot in the line, text wraps around it and a mark can be
measured against it — **Riddle can circle its own drawing.** And a line holding nothing
but drawings is drawn at nearly three times the size, because a drawing that *is* the
reply should not arrive at the size of a letter. The extra time for that comes from the
layout, not from CSS: stretched in the renderer, the node would report itself finished
with a stroke still going.

**Five of the thirty had to go back for a second pass**, and none of it was catchable by
a test — every one passed "is inside its box, is real path data" while being the wrong
picture. A crescent needs its inner edge to bite *left* into the disc, or it is a lens. A
cloud cannot be three arcs in a row (each begins at its own left edge, sending the pen
back across the puff before it) nor bell curves (peaks — that is a mountain range); it is
the tallest of three overlapping circles at each x. A teardrop built from a leaf outline
comes out a gem, because both sides converge at the far end. A bridge's arch has to rise
towards the deck or it reads as a hammock. And wind was pure chatter: the wobble is per
point, so a long smooth line described by many of them is not a hand. The fix for all of
them was rendering a contact sheet and looking at it.

### Streaming into a hand

A model streams faster than a hand writes. Characters therefore **mount when their turn
comes** rather than carrying CSS delays — that is what lets a growing reply extend a node
without re-timing the words already on the paper.

### Fading

One CSS animation per word, staggered in writing order, with its play state driven by an
inherited `--fade-state` custom property. Pausing the entire page is a single variable
write. Clean-up hangs off `animationend` rather than a timer, so a paused fade also
pauses its own removal.

**Measured:** 3,504 character spans and 6,066 DOM nodes render at a **16.7ms median
frame**, p95 16.8ms, two frames over 32ms out of 590.

### Four hands

Each hand is a Latin face plus a Hangul one, so a line that mixes scripts still reads as
one person wrote it — the Latin face comes first in the stack and Hangul falls through by
unicode-range.

| Hand | Latin | Hangul |
|---|---|---|
| Ballpoint | Caveat | Gaegu |
| Nib | Shadows Into Light | Nanum Pen Script |
| Brush | Kalam | Nanum Brush Script |
| Print | Patrick Hand | Hi Melody |

These faces disagree about x-height, so each carries a scale factor; the correction lives
on `.ink-line` rather than the node, which keeps `1em` resolving to the size the caller
asked for. The choice travels in a cookie next to the theme, so a chosen hand is there in
the first paint instead of swapping in after hydration.

---

## 🤝 The conversation

<img src="docs/media/handwriting.jpg" width="820" alt="Handwriting mode: three lines of ink on a ruled surface, with pen, eraser, undo and clear on the left, and a countdown ring filling around the hand-over button on the right." />

### Knowing when it leaves your hands

Handwriting has no Enter key, and the old build hid the hand-over button until a stroke
existed — so there was nothing to discover and then nothing happened. Now the button is
always there, dimmed until there is something to give it. **Stop writing and a ring fills
around it over four seconds, then the page takes the entry.** Every stroke, erase and undo
puts the ring back to zero, and **Not yet** drops that entry to manual for as long as you
like.

The ring is deliberately excluded from the `prefers-reduced-motion` shortening that every
other animation gets: a countdown that completes instantly is a lie about when your
writing leaves.

Handwriting is sent to `gpt-5.4-mini` as an image — no OCR service, and Korean and English
both just work. The model reads it and replies in one call, emitting a single leading
`READ: …` line with its transcription. The server splits that off the token stream: it
becomes conversational context, but it is **never drawn**, so what stays on the page is
your hand, not a machine's rendering of it.

Marks and drawings travel as inline markup inside the stream, so they can be parsed
incrementally:

```
__text__     underline
((text))     circle it
==text==     highlighter
[[star]]     draw one of the thirty
```

The parser has one hard requirement — **the plain text it emits must be a stable prefix**.
A character already written can never move or disappear. An unclosed opener is therefore
treated as a mark that is still growing, not as literal text.

A drawing cannot do that: half a name is not half a drawing. An unclosed `[[` truncates
the text until its `]]` arrives, and once the stream is over it is nothing special, just
characters. The lone `[` at the end of a chunk cannot be trimmed off the tail the way a
half-marker is, either — that would eat the second bracket of a `[[` and leave the first
looking ordinary.

### Riddle

The one who answers has a name, and it is not "the assistant". **Riddle** listens, does
not advise, and usually copies out one exact fragment of what you wrote so you can see
it from outside. Replies are one to three sentences — **not to save tokens, but because
something writing by hand cannot write much.** The constraint is the product.

Named, not disguised: asked directly whether it is a program, Riddle says so in one
sentence and goes back to you.

The system prompt is in [`src/lib/ai/prompt.ts`](src/lib/ai/prompt.ts) and is worth
reading; it is more of the design than the CSS is.

---

## ♿ Accessibility is the hard part

Text that vanishes is an accessibility problem, and the honest answer is not to shrug at
it:

- The **full conversation stays in a live region** that never fades. A screen reader user
  is never asked to race an animation. This matters more in blank-page mode than it did
  before, and it was already the answer.
- **A drawing becomes words there** — `[[moon]]` is read out as "a drawing of the moon".
  The placeholder the renderer counts positions with never leaves the renderer.
- A first visit gets **three sentences** saying what this is, that it disappears, and how
  to hold it. Not a modal — someone who ignores it and starts writing has understood it.
- `prefers-reduced-motion` drops the writing animation. Ink still fades — that is the
  idea, not the decoration — just more gently and without blur.
- **Hold anywhere on the paper and time stops.** Fading can also be switched off entirely.
- Time also stops while the tab is hidden and while you are mid-sentence. You will never
  come back to a blank sheet.
- Handwriting mode does not pretend to be keyboard-operable. It says it needs a pointer
  and points at typing mode, rather than trapping a screen reader in a `role="application"`
  surface with nothing to do.

Audited with axe (`wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `best-practice`) across
thirteen states — home light/dark/handwriting, a first visit, phone and tablet widths, a
reply being written and a reply resting, reduced motion, `/about` light/dark, `/lab`, and
the settings sheet: **0 violations**.

---

## 🔐 Privacy, honestly

| | |
|---|---|
| Server storage | **None.** No database, no session store, no files |
| Server logs | Error *shape* only (`APIError 429`) — never a message, which could quote your words |
| Conversation context | In the memory of your browser tab. Reload or close it and it is gone, with no recovery offered |
| Browser storage | Settings only: theme, language, input mode, handwriting faces, page mode, fade pace, writing speed, and whether you have seen the opening note |
| Third parties | The OpenAI API, and only when you have configured a key |

Rate limiting is an in-process token bucket, and its limits are honest: it stops one tab
hammering the endpoint, but each serverless instance keeps its own bucket. For real
exposure, put a shared store behind it —
[`@upstash/ratelimit`](https://github.com/upstash/ratelimit) drops into
[`src/lib/ratelimit.ts`](src/lib/ratelimit.ts) with no other changes.

> [!IMPORTANT]
> Inkling is **not** a medical or counselling service and does not replace diagnosis or
> treatment. Crisis resources are one tap away from anywhere in the app.
> 🇰🇷 자살예방상담전화 **109** · 정신건강위기상담전화 **1577-0199** ·
> 🌐 **988** (US/CA) · **116 123** (UK) · [findahelpline.com](https://findahelpline.com)

---

## 🔬 Research framing

This began as a design-research question rather than a product idea, and
[`/about`](src/lib/i18n/about.ts) states the position in the app itself.

- **Slow Technology** (Hallnäs & Redström, 2001) — technology not aimed at efficiency,
  where producing time for reflection is the function. There is no skip button. In the
  seconds a reply takes to arrive, you re-read the sentence you just wrote.
- **Critical Design** (Dunne & Raby) — a counter-proposal to accumulation as the default.
- **Expressive writing** (Pennebaker) — the clinical effect of putting an event into words.
- **Materiality** — typing is uniform; handwriting keeps hesitation as a wobble and feeling
  as pressure. The two modes sit side by side as a toggle so the difference is observable.

[`docs/PLAN.md`](docs/PLAN.md) is the working plan, including a section on where the build
diverged from it and why.

---

## 🗺️ Roadmap

- [x] **Riddle draws** — [thirty of them](#riddle-draws), through the same engine that
      draws the circles, and one on its own line is the whole reply
- [ ] Drawings that know where they are: a shape sized to the phrase it sits beside, an
      arrow that actually reaches between two things you said
- [ ] Diagrams proper: a node/edge spec on top of the same engine
- [ ] A single-stroke font backend for Latin text, promoting it to the true stroke engine
- [ ] Page turns, paper textures, an optional pen sound
- [ ] An end-of-session ritual: keep one sentence, burn the rest
- [ ] Writing rhythm — speed, pressure, pauses — as an affective signal, **only** behind a
      designed research-consent flow

---

## 🧱 Layout

```
src/
├─ app/
│  ├─ api/converse/   the only server endpoint — SSE, stateless
│  ├─ about/          the research note
│  ├─ lab/            ink engine testbed
│  ├─ icon.*          the mark, as favicon / PWA icon / social card
│  ├─ ink.css         the animation layer
│  └─ globals.css     design tokens, themes, the four hands
├─ components/
│  ├─ ink/            InkText, InkStrokes, MarkLayer, InkGlyph, the reveal scheduler
│  ├─ page/           Diary, Composer, InkCanvas, IntroNote, Transcript
│  └─ chrome/         header, toggles, hand picker, settings sheet
├─ lib/
│  ├─ ink/            segmentation, timing, dwell, mark and glyph geometry, strokes
│  ├─ ai/             prompt, InkScript parser, reading splitter, transport
│  ├─ i18n/           ko/en dictionaries
│  └─ prefs/          cookie + localStorage preferences
└─ store/session.ts   turns (fade away), history (does not), the turn gate
```

Every icon in the app — favicon, PWA icon, social card — is rendered from the one drawing
in [`docs/media/mark.svg`](docs/media/mark.svg): three written lines thinning out, and a
nib still resting on the first.

Pure logic is unit-tested — segmentation, timing, geometry, the incremental parser, the
rate limiter. The animation itself is verified by looking at it, against `/lab`.

---

## 📄 License

[MIT](LICENSE).

Inspired, at a distance, by a diary in a film that wrote back. That one was a manipulator;
this one holds still.
