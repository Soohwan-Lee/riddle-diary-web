# Inkling — research notes

[← Back to the README](../README.md) · [Technical notes (INK.md)](INK.md) · [Drawing vocabulary (GLYPHS.md)](GLYPHS.md)

> A working note about what the artifact argues, what it borrows from HCI and
> design research, what it is likely to do to the people who use it, and what
> would count as evidence. The build details are in [INK.md](INK.md).

| | |
|---|---|
| **Artifact** | A one-page diary that answers in handwriting and then clears |
| **Question** | What changes when an AI answers by hand, at a hand's pace, and keeps nothing? |
| **Design position** | Memory is a choice with a cost, not an invisible default |
| **Expected outcome** | More candid writing, more rereading, a page read as a listener |
| **Evidence** | Deployed build (207 tests, axe verified, designer's log); study protocol in [§6](#6-a-study-that-could-test-it) |

**Contents:** [The provocation](#1-the-provocation) · [Lineage](#2-lineage-what-was-borrowed-where-it-departs) · [What it does to the exchange](#3-what-the-artifact-does-to-the-exchange) · [Design value & implications](#4-design-value-and-implications) · [Expected outcomes](#5-expected-outcomes) · [A study](#6-a-study-that-could-test-it) · [What the build shows](#7-what-the-build-already-shows) · [Limitations](#8-limitations) · [Guardrails](#9-what-would-make-it-a-betrayal) · [References](#10-references-acm-style)

---

## 1. The provocation

Conversational AI has a default: **keep**. Every turn is stored, indexed for search,
distilled into a profile, and carried into the next session (Park et al., 2023). Memory
is presented as continuity and care. It is also how a system builds a model of the
person speaking to it — and once that model exists, the product has a reason to use it:
personalize, anticipate, re-engage.

Tom Riddle's diary is the reference because it makes that mechanism visible. It answers
in handwriting on the same sheet of paper. It remembers. Its memory is how it takes
something from the writer. Inkling keeps the object and removes the mechanism: **the
page answers, and then it does not keep.**

> **Research question:** When a conversational AI answers in handwriting, at a hand's
> pace, and keeps nothing, how does that change what people are willing to write — and
> how they read the page?

When every sentence is kept, a writer is never only writing in the present. They are
writing for two silent observers: a system building a profile, and a future self who
may reread and judge the page later (Mayer-Schönberger, 2009; Sellen & Whittaker,
2010). A diary meant to be reread becomes a performance. A diary that clears is written
for the present moment.

This is a **design claim, not a clinical one**. It does not claim that forgetting is
therapeutic, that handwriting is better than typing, or that slowness is virtuous. It
claims that persistence, input mode, and tempo are designable conditions, and that
removing the archive changes the cost of being honest.

---

## 2. Lineage: what was borrowed, where it departs

Inkling sits at the intersection of **slow technology**, **critical design**, and
**counterfunctional design** — the sort of work that belongs in an ACM DIS Provocation.
Rather than treating those traditions as labels, the build borrows specific ideas from
each and departs from them where a conversational AI demands something different.

### Slow technology and microboundaries

Hallnäs and Redström (2001) proposed slow technology not as slow hardware, but as
design that creates time for reflection instead of optimizing it away. Grosse-Hering et
al. (2013) and Odom et al. (2014) showed how slowing down moments of interaction builds
anticipation and ritual. Cox et al. (2016) added the idea of **design frictions and
microboundaries**: small intentional pauses that interrupt automatic habits.

Inkling uses three microboundaries on every turn: a four-second hand-over ring when the
pen stops (with a **Not yet** button to keep the page), a one-hand gate that waits for
your ink to sink before the reply begins, and a 650ms listening beat before the first
stroke. Where slow technology usually studies domestic objects over months, Inkling
applies slowness to real-time AI streaming as a condition on what gets written.

### Counterfunctional things and undesigning

At DIS, Pierce and Paulos (2014) introduced **counterfunctional things**: objects that
deliberately remove or invert a core digital function — such as a camera that prevents
reviewing or exporting photos — to open new kinds of experience. This builds on
Pierce's (2012) account of **undesigning**: negating familiar features by design.

Inkling is a counterfunctional conversational interface. By removing history, search,
export, copy-paste bubbles, typing indicators, and a skip button, it takes away the
tools people normally use to manage a chat thread. What remains is a single turn on a
single sheet.

### Forgetting and ephemeral interfaces

Bannon (2006), Mayer-Schönberger (2009), and Sellen and Whittaker (2010) argued against
total capture: human memory depends on forgetting as much as keeping, and permanent
digital archives make people censor themselves. Döring et al. (2013) mapped out
**ephemeral user interfaces** where decay is an expressive material, and Sas and
Whittaker (2013) showed that letting go of digital traces works best when it is designed
as a visible ritual rather than a delete button.

Inkling turns ephemerality into conversational ink: words arrive wet, dry into the
sheet, stay long enough to be read, and fade out of both the screen and the DOM.

### Critical, reflective, and adversarial design

Critical design uses working or speculative objects to expose the hidden values inside
everyday products (Dunne & Raby, 2013; Bardzell & Bardzell, 2013). Sengers et al.
(2005) argued for reflective interfaces that make their own limits legible, and DiSalvo
(2012) described adversarial design as contesting a dominant narrative by building a
concrete alternative. Here the dominant narrative is memory-first AI; the counter-case
is a page that forgets on purpose.

### Embodiment, ambiguity, and seamfulness

Typing is uniform; handwriting carries the body's hesitation and pressure (Dourish,
2001). On the reply side, Inkling leans on Gaver, Beaver, and Benford's (2003)
**ambiguity as a resource for design**. Instead of acting like an all-knowing coach,
Riddle copies back one exact fragment of what you wrote, asks at most one question, or
draws one of sixty small shapes (`[[rain]]`, `[[knot]]`, `[[hourglass]]`) without
explaining it. Ambiguity leaves the meaning with the writer. And following Chalmers and
Galani's (2004) **seamful design**, the page does not hide what it is: if asked, it
states in one sentence that it is a program, and if handwriting is illegible, it says
so plainly.

### Social responses and restraint

Since Weizenbaum's (1966) ELIZA and Nass and Moon's (2000) work on social responses to
computers, HCI has known how easily people project a listener into a machine. Relational
agents (Bickmore & Picard, 2005) build on that projection to create long-term bonds.
Expressive writing (Pennebaker & Beall, 1986) shows the value of putting a hard day
into words, but pairing disclosure with a synthetic persona risks unhealthy attachment.
Inkling uses handwriting and tempo to feel attentive in the moment while refusing every
feature that builds long-term dependency.

### Research through design and strong concepts

In Research through Design, the artifact itself carries the argument (Zimmerman et al.,
2007; Gaver, 2012), and different readers will interpret a probe in different ways
(Boehner et al., 2007). To explain how a single design transfers to other projects,
Höök and Löwgren (2012) proposed **strong concepts**: intermediate-level knowledge that
names an interactive behavior over time. Inkling offers the five-part forgetting cycle
(*absorb, dwell, clear, hold, hand back*) as a strong concept for ephemeral interfaces.

| Work | Idea borrowed | Where it appears in Inkling | Where Inkling departs |
|---|---|---|---|
| Hallnäs & Redström, 2001; Grosse-Hering et al., 2013; Odom et al., 2014 | Slowness creates room for reflection and anticipation | 650ms beat, hand-paced reveal, reading dwell, no skip | Applied to live AI dialogue as a condition on candor, not only contemplation |
| Pierce & Paulos, 2014; Pierce, 2012 | Counterfunctional design: removing features to open new use | No history, export, search, chat bubbles, or skip | Moves counterfunctionality from hardware/cameras into LLM interfaces |
| Bannon, 2006; Mayer-Schönberger, 2009; Sellen & Whittaker, 2010 | Total capture chills candor; forgetting is a feature | Stateless server, tab-only context, `store: false` | Forgetting happens in front of the writer on every turn, not in an archive later |
| Döring et al., 2013; Sas & Whittaker, 2013 | Decay as a material; rituals of release | Ink absorbs at hand-over and fades word by word | Pairs visual decay with an accessible layer (`aria-live`, hold-to-keep) |
| Dunne & Raby, 2013; Bardzell & Bardzell, 2013; Sengers et al., 2005; DiSalvo, 2012 | Artifacts as arguments that contest dominant defaults | Inverting memory-first AI (Park et al., 2023) | Built as a daily-use web app with testable toggles, not a gallery prop |
| Dourish, 2001; Gaver et al., 2003; Chalmers & Galani, 2004 | Embodied input, interpretive ambiguity, honest seams | Pressure strokes, 60 unexplained glyphs, plain disclosure | Combines vision reading (`READ:` split) with typographic and SVG ink |
| Cox et al., 2016 | Microboundaries interrupt automatic habits | 4s hand-over ring, **Not yet**, one-hand sheet gate | Paces turn-taking inside a conversation rather than blocking app entry |
| Weizenbaum, 1966; Pennebaker & Beall, 1986; Nass & Moon, 2000; Bickmore & Picard, 2005 | Projecting a listener into text; writing a day down | Echoing one fragment, marking a phrase, at most one question | Refuses persona, avatar, advice, and relational memory |
| Zimmerman et al., 2007; Boehner et al., 2007; Gaver, 2012; Höök & Löwgren, 2012 | Artifact as argument; strong concepts that travel | The five-word forgetting vocabulary and built-in study modes | Pairs design reflection with 207 engine tests and a zero-logging study plan |

---

## 3. What the artifact does to the exchange

The constraints are not features. Each one removes something familiar from the exchange
to make room for something else.

| Constraint | What it removes | What it makes room for |
|---|---|---|
| **It forgets** | The archive, the future reader, continuity | Candor, present tense, release |
| **It is handwritten** | Uniform input, copy-paste, speed | Hesitation, pressure, presence |
| **It is slow** | Instant output, skimming | Rereading, anticipation, attention |
| **One hand at a time** | Multitasking, interruption, a scrolling feed | Ritual, turn-taking, a single shared sheet |

### The archive is removed

The page clears before the reply and again after it. There is no history panel, no
export, no search. The point is not privacy in the compliance sense; it is that the
writer has **no future audience to perform for**. The cost is real: no continuity, no
building on yesterday, no record to return to. The artifact does not claim this cost is
always worth paying; it makes the cost visible.

### The body is put back in

Handwriting is slower, clumsier, and more revealing than typing. Hesitation is a
wobble; feeling is pressure. When you write by hand, the canvas is sent to the model as
an image and its `READ:` transcription is stripped from the display stream, so what
remains on the paper is your own hand rather than machine text. Handwriting changes the
unit of expression from the message to the stroke, and the tempo of thought from
**send** to **compose**.

### Time is made visible

The reply is not pasted; it is written. Because the network request leaves the moment
you hand the entry over — while your ink is still sinking into the paper — model
latency hides inside the ritual instead of showing up as a spinner:

| Time | What happens on the sheet |
|---|---|
| `0s` | Pen stops. The 4s countdown ring fills (or you tap Hand over). Request leaves at once. |
| `0s – 1.3s` | Your ink sinks into the paper (`400ms` dwell + `900ms` fade). The composer disappears. |
| `~1.3s` | The sheet is empty. The turn gate opens; the `650ms` listening beat begins. |
| `~1.95s` | First character appears. Characters reveal at a hand's pace (`~50ms` weighted), with rests at commas and periods. |
| Reply end | The reply rests for a reading estimate (`4.5s – 20s`), then fades word by word over `5s`. |
| After fade | The empty sheet hands the composer back at the top (`640ms` rise). |

### Where it sits among familiar tools

Read down any column below and each choice has been tried before. Read across the last
row and the argument appears: remove any one constraint and Inkling collapses back into
a familiar category.

| Archetype | What it keeps | Input | Tempo | What it optimizes for |
|---|---|---|---|---|
| **Memory-first assistant** | Transcripts, user profile, cross-session recall | Keyboard, voice | Instant | Task speed, retention |
| **Companion chatbot** | Relationship history, persona backstory | Chat bubbles, voice | Instant | Attachment, daily return |
| **Journaling app** | Encrypted archive, tags, streaks | Keyboard | Immediate save | Habit, personal archive |
| **Slow-tech artifact** | Curated domestic traces | Varied | Hours to months | Anticipation, re-visitation |
| **Inkling** | **Nothing (`store: false`, tab-only, DOM-cleared)** | **Hand first** | **Hand-paced, one turn at a time** | **Present-tense candor, reflection** |

### Decisions and rejected alternatives

A refusal only matters if the easier option was real. Every decision below rejected a
simpler convention and paid a price for it:

| Decision | Easier alternative | Why rejected | Cost accepted |
|---|---|---|---|
| **Blank page by default** | Keep turns scrolling on screen | Forgetting should be structural, not hidden in settings | No rereading; a reload loses the turn |
| **Pen by default** | Open with a text box | Opening with a text box frames the app as a chatbot with a font | Higher friction on devices without a stylus |
| **Per-grapheme reveal** | Stream tokens as plain text | Token chunks read as machine output; character timing reads as a hand | Custom scheduling (`InkClock`) and script normalization |
| **Fixed 60-glyph table** | Let the model output raw SVG | Model SVG paths break often and can carry markup | Expression is bounded to sixty drawings |
| **Script-weighted dwell** | One fixed timer for every reply | A one-line reply and a three-line reply need different reading time | Formula tuning across Korean and English |
| **No leading nib/caret** | A dot or cursor at the writing edge | At reading size, a leading dot reads as a text cursor | The eye must follow the growing ink edge itself |
| **No skip button** | Skip animation control | A skip button turns writing back into a loading screen | Impatient readers leave; accessibility uses `prefers-reduced-motion` |

---

## 4. Design value and implications

The provocation does not argue that every AI should forget. It argues that **the cost
of memory is usually hidden**. A memory-first product shows what it remembers and calls
that personalization; it rarely shows what the person left unsaid to avoid being
remembered.

These six implications are the intermediate-level design knowledge (Höök & Löwgren,
2012) we think travel beyond Inkling:

### 1. Memory is a choice with a cost, not a default
A system that remembers builds a model of the user and gives the user a future observer
to perform for. Designers of reflective or wellbeing tools should run a **memory
audit**: state plainly what is kept, why, for how long, and what keeping it discourages
the user from saying. That audit has to include upstream provider defaults such as
OpenAI's 30-day retention (`store: false`).

### 2. Slowness has to be earned
Waiting is a claim on someone's time. If nothing meaningful happens in the gap, a slow
interface is just latency. In Inkling, the wait works only because the reply is short
(one to three sentences), the character rhythm has human pauses, and your own sentence
has just cleared the sheet. If you slow an interface down, write less.

### 3. One hand at a time replaces the scrolling feed
The scrolling chat feed treats conversation as a growing ledger. Giving the sheet to
one hand at a time — your ink leaves before Riddle writes, and Riddle's ink leaves
before the composer returns to the same spot at the top — turns the screen from a
thread into a place. Turn-taking becomes the unit of design.

### 4. Handwriting is a mode, not a skin
Putting a handwriting font on a chat bubble is decoration. Treating the hand as a mode
means designing for strokes, pressure, margin marks (`__underline__`, `((circle))`,
`==highlight==`), inline drawings (`[[leaf]]`, `[[candle]]`), and the risk of being
misread. Preserving the user's raw strokes on screen rather than swapping them for OCR
text keeps the body in the exchange.

### 5. Ambiguity beats false authority
Language models are trained to explain and advise. When someone is writing about a hard
day, unsolicited advice closes the thought and mimics clinical authority the model does
not have. Borrowing Gaver et al.'s (2003) **ambiguity as a resource**, Riddle copies one
phrase, asks at most one question, or leaves an unexplained drawing (`[[knot]]`). Doing
less leaves the interpretation with the writer.

### 6. Ephemerality and accessibility belong together
Disappearing text is exclusionary if designed carelessly: it punishes anyone who reads
slowly, looks away, or uses a screen reader. Inkling pairs visual decay with a
persistent `aria-live` region, a press-and-hold gesture that freezes the clock, timers
that pause when the tab is hidden or the user is writing, and `prefers-reduced-motion`
support. Ephemerality does not have to mean exclusion.

### A vocabulary for designing forgetting

To make these ideas usable in other projects, Inkling names five moments in a
disappearing exchange:

| Term | What it names | How it works here | What breaks without it |
|---|---|---|---|
| **absorb** | The entry sinks at hand-over, before the reply begins. | `400ms` dwell + `900ms` fade while the request is in flight. | Both voices crowd the sheet; the page reads like a chat log. |
| **dwell** | The reply stays for a reading estimate, not a fixed timer. | `readDwellMs()`: weighted by script and length (`4.5s – 20s`). | Short replies linger too long; long replies vanish mid-read. |
| **clear** | The reply leaves both the screen and the DOM word by word. | `5s` staggered CSS fade; unmounted on `animationend`. | Hidden nodes pile up in the DOM and break the privacy promise. |
| **hold** | Pressing the paper stops the clock so reading is not a race. | Pointer hold or `Space` sets `--fade-state: paused`. | Slow readers lose sentences they were still reading. |
| **hand back** | The composer returns only after the sheet is empty again. | `whenPaperClears()` opens the top of the sheet (`640ms` rise). | The input box jumps up and down the screen as turns fade. |

### The trade-offs the artifact accepts

| Decision | What it buys | What it costs | The tension left open |
|---|---|---|---|
| **No history** | Candor, release | Continuity, revisiting a good reply | Candor vs. continuity |
| **Hand input** | Embodiment, presence | Effort, slower input on desktop | Embodiment vs. convenience |
| **Slow reveal** | Attention, anticipation | Patience, friction | Reflection vs. friction |
| **One hand at a time** | Ritual, turn-taking | Control, ability to interrupt | Ritual vs. autonomy |
| **No persona** | Honesty, non-manipulation | Warmth, sense of a companion | Honesty vs. attachment |

The right-hand column is the design. A product tries to smooth these tensions over; a
provocation keeps them open.

---

## 5. Expected outcomes

These are predictions written as concrete signals so a study can confirm or refute
them.

### What we expect the writer to do

- **Write more candidly.** With no archive and no future audience, entries should shift
  from tidy summaries of the day toward unguarded, first-person fragments people would
  hesitate to leave in a permanent journal.
- **Reread their own sentence in the gap.** While the entry sinks (`1.3s`) and the
  listening beat rests (`650ms`), the writer's attention stays on what they just let go
  of rather than jumping straight to an answer.
- **Hold the paper to control time.** When a question or a drawing lands, readers will
  use **Not yet** and press-and-hold to pause the clock rather than wishing for a skip
  button.
- **Test the fade first.** In early sessions, users will reload the tab, wait out the
  fade, or check whether Riddle remembers a previous session to verify that the promise
  is real.

### What we expect the page to be called

How people describe a probe is part of the evidence (Boehner et al., 2007):
- *"It listens / it wrote back"*, rather than *"it generated a reply"*.
- *"Taking its turn"*, rather than *"loading"*.
- *"A sheet of paper"*, rather than *"a chat window with a font"*.
- *"Letting go"*, rather than *"losing data"*.

### What we expect design practice and research to take

- **A memory audit** for conversational AI: asking what a record prevents users from
  saying, and checking provider retention defaults (`store: false`).
- **The five-word vocabulary** (*absorb, dwell, clear, hold, hand back*) for specifying
  ephemeral interfaces.
- **A paired pattern for ephemerality and accessibility** that passes strict WCAG checks.
- **A counter-case to memory-first AI** that is concrete enough to test and argue with.

### What success looks like, and what would count against it

| Expected outcome | Why we expect it | If it holds | If it does not |
|---|---|---|---|
| **More disclosure** | No record removes the future audience | Longer, more specific first-person entries in Blank vs. Keep; *"I wouldn't have written that if it stayed"* | Shorter entries in Blank mode; screenshots; anxiety about losing text |
| **The wait reads as writing** | Per-character rhythm, punctuation rests, and a cleared sheet | Readers reread their own sentence and call the reveal *"writing"* | *"Too slow"*, *"laggy"*, requests for a skip button |
| **Handwriting feels embodied** | Raw strokes stay on screen; replies carry marks and drawings | Hand mode is chosen on free-choice days; marks and drawings are noticed | Immediate switch to typing; *"it's just text"* |
| **One hand creates ritual** | The sheet has one occupant at a time | **Not yet** and hold-to-keep are used and described as calm control | Readers tap the empty sheet trying to interrupt; the gate feels like a bug |
| **No memory feels lighter** | No profile is built across sessions | Readers contrast it favorably with assistants that keep everything | Readers disengage because *"it doesn't know me anymore"* |
| **Drawings carry ambiguity** | A sketch (`[[knot]]`, `[[candle]]`) makes no diagnostic claim | Solo drawings and margin marks are remembered longer than prose replies | Drawings are ignored or read as random icons |

### Rival explanations

- **Novelty.** First sessions may produce longer entries simply because the page is new.
  Running the study over two weeks and including a free-choice day helps separate
  novelty from preference.
- **Task demand.** Participants in a study may write more to be helpful. Using
  unprompted entries and comparing Blank against Keep within the same person reduces
  this.
- **Visual halo.** Warm paper colors and handwriting fonts might drive the effect on
  their own. The baseline condition (`Type + Keep`) uses the exact same paper palette
  and fonts while removing both the hand input and the blank-page fade.
- **Designer in the room.** Participants may call the page *"listening"* to please the
  interviewer. Neutral prompts and two independent coders help.

### If the result is negative — and what would surprise us

A negative result would not make the artifact useless. If Blank mode produces *less*
disclosure because total disappearance feels unsafe or pointless, the design question
becomes which part of forgetting caused the friction. The answer would not be to log
full transcripts by default, but to design a selective ritual — such as the roadmap's
*end-of-session ritual: keep one sentence you choose, burn the rest*.

What would surprise us:
- No one asks for memory across two weeks.
- People write *less* in `Hand + Blank` because the sheet feels too intimate.
- A solo drawing (`[[candle]]`) is remembered days later when the words are not.
- Handwriting is dropped as too effortful, while the slow blank-page tempo is kept.

Surprise is not failure; each of those outcomes sharpens the argument.

---

## 6. A study that could test it

The app already contains the conditions a study needs: `Hand / Type` and `Blank / Keep`
are live toggles. A small within-subject study would test the core claim without
pretending to be a clinical trial.

### Design

Twelve adult participants, balanced across Korean and English speakers. Over two weeks:
eight condition days (four conditions, two consecutive days each, Latin-square order),
one free-choice day where all toggles are unlocked, and one exit interview.

| Condition | Input | Page | What it isolates |
|---|---|---|---|
| **A** | Hand | Blank | The intended experience (hand + forgetting) |
| **B** | Type | Blank | Forgetting, without the hand |
| **C** | Hand | Keep | The hand, without forgetting |
| **D** | Type | Keep | The baseline (same paper theme, typed and kept) |

One entry per evening, about anything, with no writing prompts. Skipping a day is data,
not a failure.

### Measures and core hypotheses

| What is measured | How | Hypothesis |
|---|---|---|
| **Disclosure** | Device-computed character count, first-person rate, and a 1–7 comfort item after each turn | **Blank vs. Keep:** Blank mode (`A, B`) produces longer, more candid entries than Keep (`C, D`) without lowering comfort. |
| **Tempo & ritual** | Forced choice (*"written"* vs. *"loaded"*), perceived duration, and counts of **Not yet** / hold-to-keep | **Tempo:** Most participants read the wait as *writing* rather than *loading*, and use hold-to-keep as agency over time. |
| **Embodiment & absence** | Mode chosen on the free-choice day; exit interview coded by two raters (Braun & Clarke, 2006) | **Modality & memory:** Hand mode stays chosen by at least half the sample on the free day, and no-memory is framed as relief more often than loss. |

Because Korean drops pronouns more often than English and packs syllables differently,
all counts are compared **within participants** across conditions (`A–D`), never pooled
raw across languages.

### Data and ethics

**A study of a page that forgets must not become the archive the page refuses to be.**
No conversation content ever leaves the device. A study build computes character counts
and timing locally and lets the participant export a number-only CSV; neither the
server nor the researcher ever sees what was written. Participants are told upfront
that Riddle is a program (`store: false`) and that the researcher is the designer.
Crisis resources stay reachable in the header throughout.

---

## 7. What the build already shows

The build works as designed: 207 unit tests across eight test files pin the timing
math, script normalization, reading dwell, parser stability, turn gate, and glyph
vocabulary. Five lessons from making the artifact are design knowledge in their own
right:

- **Resemblance is not an invariant.** All sixty drawings passed geometry tests for
  bounding boxes and valid path syntax. Yet when rendered onto a
  [contact sheet](media/glyphs.png), five of the first thirty were the wrong picture: a
  cloud that read as mountains, a crescent that read as a lens, a teardrop that read as
  a gem, a bridge that read as a hammock, and wind that was scribble. Formal tests check
  structure; only looking checks meaning.
- **A gate must read the state, not the picture.** The one-hand gate first read a React
  render snapshot. On the second turn it described the page as it was before the entry
  landed, decided the sheet was empty, and let the reply start early on top of sinking
  ink.
- **Disappearing interfaces need strict internal ordering.** A vision `READ:`
  transcription of handwriting could arrive over the network after the visual turn had
  already faded from the DOM. The fix was to track turns by immutable id in the store
  rather than by what was still on screen.
- **The first mark carries the metaphor.** An early build had a glowing nib dot in front
  of each revealing letter. At body size it read as a blinking text cursor, turning the
  sheet back into a text field. Removing it made the reveal feel like ink.
- **A privacy promise includes provider defaults.** The OpenAI Responses API stores
  responses for 30 days by default unless the request passes `store: false`. A promise
  that the page keeps nothing has to include the parts of the stack the reader cannot
  see.

### Three notes from the designer's log

- Without the `650ms` listening beat, the reply started the instant the sheet cleared
  and felt like a UI state swap. Adding the pause made it feel as if someone had
  finished reading and picked up a pen.
- In `Keep` mode, the eye scans upward to check earlier turns, which invites editing
  yourself for consistency. In `Blank` mode, there is nothing above the line you are
  writing, and watching the sentence sink produces a physical sense of letting it go.
- The quietest turns were the ones where Riddle answered with a single drawing on its
  own line (`[[candle]]`, `[[knot]]`) and no words at all. A drawing makes no claim you
  have to agree or disagree with.

---

## 8. Limitations

1. **No formal user study yet.** The disclosure and ritual hypotheses are grounded in
   prior literature and single-designer autoethnography; the §6 study has not been run.
2. **The reply is typographic, not synthesized strokes.** Marks and the sixty drawings
   are true SVG paths, but the letters are handwriting fonts revealed per grapheme via
   `clip-path` (stroke data does not exist for 11,172 Hangul syllables; see
   [INK.md](INK.md)).
3. **Handwriting readings are model-generated.** `gpt-5.4-mini` reads the canvas image
   without human verification; subtle misreadings in the hidden `READ:` line can go
   unnoticed.
4. **Script and language coverage.** Korean and English only; four hands; sixty
   drawings. The private diary form itself is culturally specific.
5. **Pressure depends on hardware.** Pen input reports real pressure; finger and mouse
   infer it from velocity.
6. **Disappearance is not a security guarantee.** The app keeps no record, but it
   cannot stop a screenshot, a camera, or a browser extension.
7. **Provider abuse-monitoring retention is separate.** `store: false` disables
   application-state retention, not OpenAI's up-to-30-day abuse-monitoring logs (unless
   covered by enterprise Zero Data Retention).
8. **Prompt restraint is not a hard grammar.** Riddle's rules (no advice, brief replies,
   at most one question) live in the system prompt and can be pushed out of character by
   an insistent user.
9. **Accessibility is verified by tooling, not user testing.** The app passes `axe-core`
   WCAG AA checks across 11 states and provides `aria-live`, hold-to-keep, and reduced
   motion, but has not been tested with disabled participants.

---

## 9. What would make it a betrayal

The artifact is defined as much by what it refuses as by what it does. These are the
lines that would turn it into a different, more familiar product:

- Cross-session memory that stores transcripts and calls it care.
- Streaks, reminders, or notifications that turn reflection into a habit loop.
- Advice, diagnosis, or a coaching persona.
- An avatar or a voice that invites attachment while hiding the program.
- A history panel, export, or search.
- A skip button that turns the writing back into a loading state.
- Analytics on what people write.

The absence is the feature. A diary that remembers everything is a different object,
and the film already showed us what that object does.

---

## 10. References (ACM style)

1. Liam J. Bannon. 2006. Forgetting as a Feature, Not a Bug: The Duality of Memory and Implications for Ubiquitous Computing. *CoDesign* 2, 1 (2006), 3–15. https://doi.org/10.1080/15710880600608230
2. Jeffrey Bardzell and Shaowen Bardzell. 2013. What is "critical" about critical design? In *Proceedings of the SIGCHI Conference on Human Factors in Computing Systems* (CHI '13). ACM, New York, NY, USA, 3297–3306. https://doi.org/10.1145/2470654.2466451
3. Timothy W. Bickmore and Rosalind W. Picard. 2005. Establishing and Maintaining Long-Term Human-Computer Relationships. *ACM Transactions on Computer-Human Interaction* 12, 2 (2005), 293–327. https://doi.org/10.1145/1067860.1067867
4. Kirsten Boehner, Janet Vertesi, Phoebe Sengers, and Paul Dourish. 2007. How HCI Interprets the Probes. In *Proceedings of the SIGCHI Conference on Human Factors in Computing Systems* (CHI '07). ACM, New York, NY, USA, 1077–1086. https://doi.org/10.1145/1240624.1240789
5. Virginia Braun and Victoria Clarke. 2006. Using Thematic Analysis in Psychology. *Qualitative Research in Psychology* 3, 2 (2006), 77–101. https://doi.org/10.1191/1478088706qp063oa
6. Matthew Chalmers and Areti Galani. 2004. Seamful Interweaving: Heterogeneity in the Theory and Design of Interactive Systems. In *Proceedings of the 5th Conference on Designing Interactive Systems: Processes, Practices, Methods, and Techniques* (DIS '04). ACM, New York, NY, USA, 243–252. https://doi.org/10.1145/1013115.1013149
7. Anna L. Cox, Sandy J. J. Gould, Marta E. Cecchinato, Ioanna Iacovides, and Ian Renfree. 2016. Design Frictions for Mindful Interactions: The Case for Microboundaries. In *Proceedings of the 2016 CHI Conference Extended Abstracts on Human Factors in Computing Systems* (CHI EA '16). ACM, New York, NY, USA, 1389–1397. https://doi.org/10.1145/2851581.2892410
8. Carl DiSalvo. 2012. *Adversarial Design*. MIT Press, Cambridge, MA.
9. Tanja Döring, Axel Sylvester, and Albrecht Schmidt. 2013. A Design Space for Ephemeral User Interfaces. In *Proceedings of the 7th International Conference on Tangible, Embedded and Embodied Interaction* (TEI '13). ACM, New York, NY, USA, 75–82. https://doi.org/10.1145/2460625.2460637
10. Paul Dourish. 2001. *Where the Action Is: The Foundations of Embodied Interaction*. MIT Press, Cambridge, MA.
11. Anthony Dunne and Fiona Raby. 2013. *Speculative Everything: Design, Fiction, and Social Dreaming*. MIT Press, Cambridge, MA.
12. William Gaver. 2012. What Should We Expect from Research through Design? In *Proceedings of the SIGCHI Conference on Human Factors in Computing Systems* (CHI '12). ACM, New York, NY, USA, 937–946. https://doi.org/10.1145/2207676.2208538
13. William W. Gaver, Jacob Beaver, and Steve Benford. 2003. Ambiguity as a Resource for Design. In *Proceedings of the SIGCHI Conference on Human Factors in Computing Systems* (CHI '03). ACM, New York, NY, USA, 233–240. https://doi.org/10.1145/642611.642653
14. Barbara Grosse-Hering, Jon Mason, Dzmitry Aliakseyeu, Conny Bakker, and Pieter Desmet. 2013. Slow Design for Meaningful Interactions. In *Proceedings of the SIGCHI Conference on Human Factors in Computing Systems* (CHI '13). ACM, New York, NY, USA, 3431–3440. https://doi.org/10.1145/2470654.2466472
15. Lars Hallnäs and Johan Redström. 2001. Slow Technology – Designing for Reflection. *Personal and Ubiquitous Computing* 5, 3 (2001), 201–212. https://doi.org/10.1007/PL00000019
16. Kristina Höök and Jonas Löwgren. 2012. Strong Concepts: Intermediate-Level Knowledge in Interaction Design Research. *ACM Transactions on Computer-Human Interaction* 19, 3, Article 23 (Oct. 2012), 18 pages. https://doi.org/10.1145/2362364.2362371
17. Viktor Mayer-Schönberger. 2009. *Delete: The Virtue of Forgetting in the Digital Age*. Princeton University Press, Princeton, NJ.
18. Clifford Nass and Youngme Moon. 2000. Machines and Mindlessness: Social Responses to Computers. *Journal of Social Issues* 56, 1 (2000), 81–103. https://doi.org/10.1111/0022-4537.00153
19. William Odom, Abigail Sellen, Richard Banks, David Kirk, Tim Regan, Mark Selby, Jodi Forlizzi, and Jonathan Zimmerman. 2014. Designing for Slowness, Anticipation and Re-visitation: A Long Term Field Study of the Photobox. In *Proceedings of the SIGCHI Conference on Human Factors in Computing Systems* (CHI '14). ACM, New York, NY, USA, 1961–1970. https://doi.org/10.1145/2556288.2557178
20. Joon Sung Park, Joseph C. O'Brien, Carrie J. Cai, Meredith Ringel Morris, Percy Liang, and Michael S. Bernstein. 2023. Generative Agents: Interactive Simulacra of Human Behavior. In *Proceedings of the 36th Annual ACM Symposium on User Interface Software and Technology* (UIST '23). ACM, New York, NY, USA, Article 2, 1–22. https://doi.org/10.1145/3586183.3606763
21. James W. Pennebaker and Sandra K. Beall. 1986. Confronting a Traumatic Event: Toward an Understanding of Inhibition and Disease. *Journal of Abnormal Psychology* 95, 3 (1986), 274–281. https://doi.org/10.1037/0021-843X.95.3.274
22. James Pierce. 2012. Undesigning Technology: Considering the Negation of Design by Design. In *Proceedings of the SIGCHI Conference on Human Factors in Computing Systems* (CHI '12). ACM, New York, NY, USA, 957–966. https://doi.org/10.1145/2207676.2208540
23. James Pierce and Eric Paulos. 2014. Counterfunctional Things: Exploring Possibilities in Designing Digital Limitations. In *Proceedings of the 2014 Conference on Designing Interactive Systems* (DIS '14). ACM, New York, NY, USA, 375–384. https://doi.org/10.1145/2598510.2598522
24. Corina Sas and Steve Whittaker. 2013. Design for Forgetting: Disposing of Digital Possessions after a Breakup. In *Proceedings of the SIGCHI Conference on Human Factors in Computing Systems* (CHI '13). ACM, New York, NY, USA, 1823–1832. https://doi.org/10.1145/2470654.2466241
25. Abigail J. Sellen and Steve Whittaker. 2010. Beyond Total Capture: A Constructive Critique of Lifelogging. *Communications of the ACM* 53, 5 (2010), 70–77. https://doi.org/10.1145/1735223.1735243
26. Phoebe Sengers, Kirsten Boehner, Shay David, and Joseph 'Jofish' Kaye. 2005. Reflective Design. In *Proceedings of the 4th Decennial Conference on Critical Computing: Between Sense and Sensibility* (CC '05). ACM, New York, NY, USA, 49–58. https://doi.org/10.1145/1094562.1094569
27. Joseph Weizenbaum. 1966. ELIZA—A Computer Program for the Study of Natural Language Communication between Man and Machine. *Communications of the ACM* 9, 1 (1966), 36–45. https://doi.org/10.1145/365153.365168
28. John Zimmerman, Jodi Forlizzi, and Shelley Evenson. 2007. Research through Design as a Method for Interaction Design Research in HCI. In *Proceedings of the SIGCHI Conference on Human Factors in Computing Systems* (CHI '07). ACM, New York, NY, USA, 493–502. https://doi.org/10.1145/1240624.1240704

---

[← Back to the README](../README.md) · [Technical notes (INK.md)](INK.md) · [Drawing vocabulary (GLYPHS.md)](GLYPHS.md)
