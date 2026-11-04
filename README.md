<div align="center">

<img src="docs/media/mark.svg" width="84" alt="" />

# Inkling

**A page that writes back — and lets go.**

A critical design provocation about what a diary could be if it were designed to forget you.

Write by hand or by keyboard. Riddle answers in its own handwriting, at the pace of a
hand. Then both of you fade off the paper, and nothing is kept.

[![critical design](https://img.shields.io/badge/design-critical-b4553f)](#the-provocation)
[![DIS provocation](https://img.shields.io/badge/research-DIS%20provocation-8a5a44)](#the-provocation)
[![slow technology](https://img.shields.io/badge/research-slow%20technology-2f5d57)](#research-framing)
[![ephemeral interface](https://img.shields.io/badge/interface-ephemeral-6c665a)](#the-interface-is-the-argument)
[![License: MIT](https://img.shields.io/badge/License-MIT-8a8578)](LICENSE)

<img src="docs/media/writing.gif" width="820" alt="Riddle writes a reply by hand, one character at a time, draws a small knot mid-sentence, circles a phrase, and finishes with a candle drawn on a line of its own." />

</div>

> **The diary remembers nothing. It is still listening.**

> [!NOTE]
> Every recording on this page runs in real time, at the app's own pace. The clips are
> sped up slightly so a README stays a README.

**Contents**

- [The provocation](#the-provocation) · [What we kept](#what-we-kept-what-we-refused) · [The interface is the argument](#the-interface-is-the-argument)
- [The artifact](#the-artifact) · [Research](#research-framing) · [Design value](#design-value) · [Expected outcomes](#expected-outcomes)
- [What we did not build](#what-we-deliberately-did-not-build) · [Run it](#quick-start) · [Technical notes](docs/INK.md) · [Full research](docs/RESEARCH.md)

> **If you have five minutes:** read [The provocation](#the-provocation),
> [Design value](#design-value), and
> [What we deliberately did not build](#what-we-deliberately-did-not-build). The
> technical notes are in [docs/INK.md](docs/INK.md).

---

## 🕯️ The provocation

In *Harry Potter and the Chamber of Secrets*, Tom Riddle's diary is a seductive
object. It answers in handwriting. It remembers. Its intimacy is the mechanism by
which it takes something from the person writing in it.

Inkling borrows the object and refuses the mechanism. You write; Riddle writes back;
the ink thins and goes. The page does not keep a record, and this server does not
either.

This is a **design provocation in the DIS sense** (Designing Interactive Systems):
not a product proposal, but a working artifact that makes a default assumption
visible by building its opposite.
The assumption is that a conversational AI should remember. The question is what
happens if it doesn't.

> **A guarantee of disappearance lowers the threshold for saying the thing.**

### What it asks

- What changes when an AI diary is designed to forget you?
- Does the writing get more honest, or more guarded?
- Is the wait experienced as writing, or as loading?
- Does a relationship without memory feel lighter, or emptier?
- What would a memory-first AI have to give up to become this?

### Why a provocation, not a product

A provocation is judged by the questions it opens, not by task success or retention.
The research-through-design position is that the artifact itself is the contribution
(Gaver, 2012; Zimmerman et al., 2007), and that different audiences will read a probe
differently (Boehner et al., 2007). Critical design supplies the stance: the artifact
is an argument about values, not a neutral tool (Dunne & Raby, 2013; Bardzell &
Bardzell, 2013). Adversarial design supplies the edge: the work contests a dominant
narrative rather than serving it (DiSalvo, 2012).

Inkling is not a productivity tool, not a therapist, and not a companion product. It
is a counter-position, a conversation opener, and a small working system. The
artifact is the argument; the code is the material.

---

## 🧭 What we kept, what we refused

| We kept | We refused |
|---|---|
| The object: a page that answers in a hand | A history panel, export, search, training on your words |
| Attention: Riddle copies one exact fragment | Advice, diagnosis, reframing, silver linings |
| Ritual: handing over, waiting, holding the paper | Skip, instant output, autoplay |
| The hand: pressure, wobble, a drawing in the margin | Avatars, chat bubbles, typing indicators |
| Forgetting: the page clears | Cross-session memory, streaks, notifications |

The table is the design. Most conversational AI products add memory, history,
personalization, and engagement loops because those things are useful and because
they are easy to measure. Inkling removes them and asks what is left. What is left is
attention, a tempo, and a sheet that does not keep score.

---

## 🖤 The interface is the argument

| Principle | What you see | What it refuses |
|---|---|---|
| **One hand at a time** | Your ink is gone before Riddle writes; Riddle's is gone before the page returns | Two voices sharing a sheet |
| **Writing is slow** | Per-grapheme reveal, rests at punctuation, a reading estimate before the fade | A skip button |
| **Riddle listens** | One exact fragment, at most one question, no advice | Therapy, coaching, personality performance |
| **The page forgets** | No database, no logs, `store: false`, context in the tab | Memory, export, training |
| **The reader holds the pen** | A four-second hand-over ring, **Not yet**, hold-to-keep | Engagement, reminders, notifications |

### One hand at a time

Your ink is completely gone before Riddle writes a word, and Riddle's ink is
completely gone before the page comes back to you. The reply is held until the paper
is empty; text that arrives early queues up. The model and the absorb run at the same
time, so the wait is whichever finishes last. Measured: **1.4s from your last word to
Riddle's first**, with no sample in a three-turn recording showing both hands' ink on
the page.

The entry area follows the same rule: it exists only on your turn. There is no caret
while Riddle writes. A nib riding the reveal read as a text cursor, and handwriting
appearing on paper has nothing in front of it.

### Writing is slow

Replies do not appear at once. They are written at the speed of a hand, and the
waiting is part of the interface rather than a loading state. There is still no
instant option, and there never will be. The reply's dwell is a **reading estimate**,
weighted by script so Korean and English of equivalent content get equal time on the
page. A **650ms listening beat** sits before the first stroke; the request is already
in flight, so it costs nothing when the model is slower than a pause.

### Riddle listens

Riddle usually copies out one exact fragment of what you wrote, asks at most one
question, and does not advise. Replies are one to three short sentences — not to save
tokens, but because something writing by hand cannot write much. Sometimes one word
or one line is the whole reply. The first line knows roughly what time it is, and
Riddle may pick up a thread from earlier in the same conversation when it adds
something.

Named, not disguised: asked directly whether it is a program, Riddle says so in one
sentence and goes back to you.

### The page forgets

Nothing is stored on this server. There is no database, no session store, no file,
and no log of what you wrote. History lives in the memory of the browser tab and dies
with it. The OpenAI request sets `store: false`, so the Responses API does not keep
the exchange as retrievable application state.

### The reader holds the pen

Stop writing and a ring fills; any new stroke puts it back to zero. **Not yet** drops
that entry to manual for as long as you like. Hold anywhere on the paper and time
stops; fading can be switched off entirely. The page never takes something you did
not hand over.

---

## ✨ The artifact

A single-page web app, a single stateless endpoint, and a lot of ink.

<img src="docs/media/blank.gif" width="820" alt="An entry is handed over and sinks into the page until the sheet is completely empty; only then does Riddle write a reply, with a small drawing of rain in it — and that fades in turn once it has been read, leaving the caret back at the top." />

<div align="center"><sub><i>Hand it over · it sinks · Riddle reads · Riddle answers · you read · gone · your turn.</i></sub></div>

| | |
|---|---|
| 📖 | **Blank-page mode.** What you hand over sinks in at once; the reply leaves about the time you finish reading it |
| 🤝 | **One hand at a time.** Your ink is gone before Riddle starts, and Riddle's is gone before the page comes back |
| ✍️ | **Two hands, one page.** Write with a stylus, a finger, or a keyboard — toggle at any time |
| 🪶 | **Real handwriting animation.** Per-grapheme reveal in Korean and English, and no cursor in front of it |
| 🖋️ | **Four handwriting faces**, each a Latin face paired with a Hangul one, chosen separately for you and for the page |
| 🌤️ | **Riddle draws.** Sixty small things — weather, growing things, water and air, small objects, a knot — stroke by stroke in the same hand |
| ⏱️ | **Hand-over you can see coming.** Stop writing and a ring fills; any new stroke puts it back to zero |
| ⏸️ | **Time that waits for you.** The clock stops while you write, while the tab is hidden, and while you hold the paper |
| 🌗 | **Light · dark · system**, resolved server-side so nothing flashes |
| 🌏 | **한국어 / English**, including the page's own handwriting, the opening line and the date |
| 🔒 | **No database, no logs, no history.** Context lives in the tab and dies with it |
| ♿ | **Zero axe violations** across thirteen page, theme and mode combinations |

The sixty drawings are catalogued in [docs/GLYPHS.md](docs/GLYPHS.md), with the
contact sheet and the rules for adding one. The full technical story is in
[docs/INK.md](docs/INK.md).

---

## 🔬 Research framing

Slow technology is the right starting point, but it is not the whole lineage.
Hallnäs and Redström's slow technology is about producing time for reflection rather
than removing it. Inkling takes that seriously: there is no skip, the reply is
written at a hand's pace, and the page waits until you have read it. But the artifact
is also an **ephemeral interface**, a design about **forgetting**, and a **critical
design** about accumulation.

| Lineage | What it explains here |
|---|---|
| **Slow Technology & Slow Design** — Hallnäs & Redström, 2001; Grosse-Hering et al., 2013 | The waiting is the interface. The hand-over ritual, **Not yet**, holding the paper. |
| **Slowness in the field** — Odom et al., 2014 | A domestic artifact designed for anticipation and re-visitation, not utility. |
| **Ephemeral UI** — Döring et al., 2013 | Ink as a material, intentional decay, an interface experienced in time. |
| **Forgetting** — Bannon, 2006 | Disappearance as a feature, not a failure. |
| **Critical & reflective design** — Dunne & Raby, 2013; Bardzell & Bardzell, 2013; Sengers et al., 2005 | A counter-proposal to accumulation; the interface should make its own assumptions visible. |
| **Research through Design & provocation** — Zimmerman et al., 2007; Gaver, 2012; Boehner et al., 2007; DiSalvo, 2012 | The artifact is the contribution; a provocation is judged by the questions it opens. |
| **Social responses & relational agents** — Nass & Moon, 2000; Bickmore & Picard, 2005 | Why a page that answers is read as someone, and the long history of designing for attachment. |
| **Expressive writing** — Pennebaker & Beall, 1986 | Background for writing a day down. Not a claim of clinical efficacy. |
| **ELIZA** — Weizenbaum, 1966 | The long history of projecting a listener into a machine. |

The extended method and limitations are in [docs/RESEARCH.md](docs/RESEARCH.md).
The full reference list is below.

<details>
<summary><strong>References</strong> — 16 sources, ACM style</summary>

1. Liam J. Bannon. 2006. Forgetting as a Feature, Not a Bug: The Duality of Memory and Implications for Ubiquitous Computing. *CoDesign* 2, 1 (2006), 3–15. https://doi.org/10.1080/15710880600608230
2. Jeffrey Bardzell and Shaowen Bardzell. 2013. What is "critical" about critical design? In *Proceedings of the SIGCHI Conference on Human Factors in Computing Systems* (CHI '13). ACM, New York, NY, USA, 3297–3306. https://doi.org/10.1145/2470654.2466451
3. Timothy W. Bickmore and Rosalind W. Picard. 2005. Establishing and Maintaining Long-Term Human-Computer Relationships. *ACM Transactions on Computer-Human Interaction* 12, 2 (2005), 293–327. https://doi.org/10.1145/1067860.1067867
4. Kirsten Boehner, Janet Vertesi, Phoebe Sengers, and Paul Dourish. 2007. How HCI Interprets the Probes. In *Proceedings of the SIGCHI Conference on Human Factors in Computing Systems* (CHI '07). ACM, New York, NY, USA, 1077–1086. https://doi.org/10.1145/1240624.1240789
5. Carl DiSalvo. 2012. *Adversarial Design*. MIT Press, Cambridge, MA.
6. Tanja Döring, Axel Sylvester, and Albrecht Schmidt. 2013. A Design Space for Ephemeral User Interfaces. In *Proceedings of the 7th International Conference on Tangible, Embedded and Embodied Interaction* (TEI '13). ACM, New York, NY, USA, 75–82. https://doi.org/10.1145/2460625.2460637
7. Anthony Dunne and Fiona Raby. 2013. *Speculative Everything: Design, Fiction, and Social Dreaming*. MIT Press, Cambridge, MA.
8. William Gaver. 2012. What Should We Expect from Research through Design? In *Proceedings of the SIGCHI Conference on Human Factors in Computing Systems* (CHI '12). ACM, New York, NY, USA, 937–946. https://doi.org/10.1145/2207676.2208538
9. Barbara Grosse-Hering, Jon Mason, Dzmitry Aliakseyeu, Conny Bakker, and Pieter Desmet. 2013. Slow Design for Meaningful Interactions. In *Proceedings of the SIGCHI Conference on Human Factors in Computing Systems* (CHI '13). ACM, New York, NY, USA, 3431–3440. https://doi.org/10.1145/2470654.2466472
10. Lars Hallnäs and Johan Redström. 2001. Slow Technology – Designing for Reflection. *Personal and Ubiquitous Computing* 5, 3 (2001), 201–212. https://doi.org/10.1007/PL00000019
11. Clifford Nass and Youngme Moon. 2000. Machines and Mindlessness: Social Responses to Computers. *Journal of Social Issues* 56, 1 (2000), 81–103. https://doi.org/10.1111/0022-4537.00153
12. William Odom, Abigail Sellen, Richard Banks, David Kirk, Tim Regan, Mark Selby, Jodi Forlizzi, and Jonathan Zimmerman. 2014. Designing for Slowness, Anticipation and Re-visitation: A Long Term Field Study of the Photobox. In *Proceedings of the SIGCHI Conference on Human Factors in Computing Systems* (CHI '14). ACM, New York, NY, USA, 1961–1970. https://doi.org/10.1145/2556288.2557178
13. James W. Pennebaker and Sandra K. Beall. 1986. Confronting a Traumatic Event: Toward an Understanding of Inhibition and Disease. *Journal of Abnormal Psychology* 95, 3 (1986), 274–281. https://doi.org/10.1037/0021-843X.95.3.274
14. Phoebe Sengers, Kirsten Boehner, Shay David, and Joseph 'Jofish' Kaye. 2005. Reflective Design. In *Proceedings of the 4th Decennial Conference on Critical Computing: Between Sense and Sensibility* (CC '05). ACM, New York, NY, USA, 49–58. https://doi.org/10.1145/1094562.1094569
15. Joseph Weizenbaum. 1966. ELIZA—A Computer Program for the Study of Natural Language Communication between Man and Machine. *Communications of the ACM* 9, 1 (1966), 36–45. https://doi.org/10.1145/365153.365168
16. John Zimmerman, Jodi Forlizzi, and Shelley Evenson. 2007. Research through Design as a Method for Interaction Design Research in HCI. In *Proceedings of the SIGCHI Conference on Human Factors in Computing Systems* (CHI '07). ACM, New York, NY, USA, 493–502. https://doi.org/10.1145/1240624.1240704

</details>

---

## 🧪 Design value

The provocation does not argue that all AI should forget. It argues that **memory
should be a visible design choice with costs, not an invisible default**.

| For | What the provocation makes visible |
|---|---|
| **AI product design** | Memory is a design choice. Forgetting can be an ethical affordance, not a missing feature. |
| **HCI research** | Ephemerality and slowness are materials for interaction, not constraints. A provocation can be evaluated by the questions it opens. |
| **Interface design** | The interface can disclose the model's role: no bubbles, avatars, or typing indicators; the hand is the interface. |
| **Accessibility** | Disappearing content needs a persistent accessible layer. Ephemerality without accessibility is exclusion. |
| **Ethics** | A listening object should not pretend to be a person, a therapist, or a friend with obligations. |
| **Practice** | A non-extractive AI interaction can still be engaging; engagement is not the only measure of a relationship. |

The tension the artifact leaves unresolved is the point: safety vs. continuity,
intimacy vs. extraction, reflection vs. friction. A product would try to resolve it.
A provocation keeps it open.

---

## 🧪 Expected outcomes

### What the artifact leaves behind

| Design outcomes | Research outcomes |
|---|---|
| A vocabulary for designing **forgetting** in conversational AI: absorb, dwell, clear, hold, hand back. | **Testable hypotheses** about disappearance, waiting, embodiment, ritual, and memory. |
| A working demonstration that **ephemerality and accessibility can be designed together**, not treated as opposites. | A method for evaluating a provocation with **technical measurement plus autoethnography**, without pretending it is a clinical trial. |
| A counter-narrative to memory-first AI that is concrete enough to critique. | A discussion piece for design research, HCI, and AI ethics about what a non-extractive conversational artifact could be. |
| A reusable visual language: the hand, the mark, the drawing, the page that clears. | A public artifact that can be taught, forked, and argued with. |

### What would count as success, and what would not

| Success | Failure |
|---|---|
| Designers treat memory as a choice, not a default. | It reads as a gimmick, a skin over a chatbot. |
| Readers describe the page as listening, not generating. | Disappearance reads as a bug, or as something to fix with history. |
| Waiting reads as writing, not loading. | Waiting reads as a slow loading screen. |
| The artifact generates interpretations the designer did not plan. | It becomes a product that adds memory to keep people coming back. |
| The vocabulary travels to other projects. | It claims therapeutic benefit it cannot support. |

### Hypotheses

| Hypothesis | Look for | False if |
|---|---|---|
| Disappearance lowers the threshold for disclosure | Longer, more specific, more first-person entries; readers saying they wrote something they would not otherwise have written | Entries get shorter; readers ask for history or export; the fade makes them anxious |
| The wait reads as writing, not loading | Readers re-read their own sentence before the reply; describing the page as being written to | "Too slow", "loading", "why isn't it instant" |
| Handwriting makes the exchange feel embodied | Handwriting mode is chosen; Riddle is described as someone; marks and drawings are noticed | Readers switch to typing immediately; "it's just text" |
| One hand at a time creates a ritual | **Not yet** and hold-to-keep are used; readers wait for the page | Readers try to interrupt; the rule feels like a bug |
| No memory changes what is said | Readers mention the absence; they compare it with assistants that keep everything | Readers ask for memory; the page feels unsafe without it |

The current evidence is **technical measurement plus autoethnography**, not a formal
user study. A small study would be enough to learn something: 8–12 participants, two
weeks, a pre/post self-report, and interviews, with no conversation content logged.
The point would not be to prove a clinical effect; it would be to see whether the
artifact changes what people are willing to write down. The full method is in
[docs/RESEARCH.md](docs/RESEARCH.md).

---

## 🛠️ What the making taught us

- **Five drawings went back for a second pass.** None of it was catchable by a test —
  every one passed "is inside its box, is real path data" while being the wrong
  picture. The fix was rendering a contact sheet and looking at it.
- **The one-hand gate read a render snapshot.** It described the page as it was before
  the entry landed; on the second turn it said "empty" and opened at once. The fix was
  to read the store and pin the behaviour with a test.
- **The handwriting reading could arrive after the turn had faded.** The history lost
  the reader's words because the code looked for a turn that had already gone. The fix
  was to track the handwritten turn by id and remember each reading once.
- **The OpenAI Responses API stores responses for 30 days by default.** A privacy
  promise can be broken by a provider default. The request now sets `store: false`.
- **The nib looked like a cursor.** A leading mark riding the reveal read as a text
  caret at handwriting sizes. Removing it made the writing feel more like writing.
- **The v1 accessibility audit found 0 violations across thirteen states.** The
  interesting work was the live region, the drawing labels, the reduced-motion path,
  and the decision not to pretend the canvas is keyboard-operable.

The craft behind these lessons — two ink backends, the sixty drawings, the parser,
the timing — is in [docs/INK.md](docs/INK.md).

---

## 🧱 What we deliberately did not build

### Cross-session memory

The obvious next feature is the one the film is about: you log in, Riddle remembers
you, and the conversation continues across sessions. It is not built.

That is not a scheduling problem. In the film, the diary's memory is the mechanism of
possession: it knows you in order to use you. The web's default is the same shape at a
larger scale — keep everything, personalize, re-engage. Inkling's answer is to remove
the mechanism, not to make it kinder.

If it is ever built, these hold or it is not this product any more:

- A memory is written *about* an exchange, not *from* it. Storing the messages and
  calling it memory is the failure mode.
- It is opt-in per account, visible, editable, and deletable in one action.
- The page still clears. Nothing kept ever comes back onto the paper.
- The non-persistence rule in [`CLAUDE.md`](CLAUDE.md) is rewritten before a single
  row is stored, not after.

### The rest

- No history panel, export, search, or transcript download.
- No streaks, reminders, notifications, or engagement metrics.
- No advice, diagnosis, or coaching persona.
- No avatar, chat bubbles, or typing indicator.
- No skip button.
- No analytics.

The absence is the feature. A diary that remembers everything is a different object,
and the film already showed us what that object does.

---

## 🗺️ Roadmap

- [x] **Riddle draws** — sixty of them, through the same engine that draws the circles
- [x] **The page knows the hour** — a first line that follows the reader's local time
- [x] **A listening beat** — a short pause and an ink drop before the first stroke
- [x] **A date in the margin** — page furniture in the page's own hand
- [ ] Drawings that know where they are: a shape sized to the phrase it sits beside
- [ ] Diagrams proper: a node/edge spec on top of the same engine
- [ ] A single-stroke font backend for Latin text
- [ ] Page turns, paper textures, an optional pen sound
- [ ] An end-of-session ritual: keep one sentence, burn the rest
- [ ] Writing rhythm as an affective signal, **only** behind a consent flow
- **Cross-session memory — deliberately not planned.** See
  [What we deliberately did not build](#what-we-deliberately-did-not-build).

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

**No API key? It still runs.** Without `OPENAI_API_KEY` the route serves canned
replies at a realistic streaming cadence, so the whole interaction — writing, marks,
fading — is fully explorable at zero cost. A missing key is never a 500.

### Environment

| Variable | Required | Notes |
|---|---|---|
| `OPENAI_API_KEY` | no | Server-only. Absent ⇒ mock mode |
| `OPENAI_MODEL` | no | Defaults to `gpt-5.4-mini`. Must support image input and the Responses API |
| `MOCK_AI` | no | `1` forces mock mode even with a key present |
| `NEXT_PUBLIC_SITE_URL` | no | Public origin for canonical URLs, the sitemap and the social card. Vercel supplies its production domain automatically |

### Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FSoohwan-Lee%2Friddle-diary-web&env=OPENAI_API_KEY&envDescription=Optional%20—%20leave%20blank%20to%20run%20in%20mock%20mode)

Zero configuration. The one endpoint runs on the Node runtime with a 60s ceiling,
which streaming makes irrelevant — time to first character is under a second.

The one deployment rule that matters: **set an OpenAI project spend limit.** The rate
limiter is per-instance, so a public deployment needs a second, account-level ceiling.

### Scripts

```bash
npm run dev        # dev server
npm run check      # typecheck + lint + tests — run before committing
npm run build      # production build
npm run test       # Vitest
```

---

## 📚 Technical notes

- [docs/INK.md](docs/INK.md) — two ink backends, the parser, timing, fading, four hands
- [docs/GLYPHS.md](docs/GLYPHS.md) — the sixty drawings, the contact sheet, adding one
- [docs/RESEARCH.md](docs/RESEARCH.md) — extended research framing, all references, method
- [docs/PLAN.md](docs/PLAN.md) — the working plan and its divergences

Built with Next.js 16, React 19, TypeScript, Tailwind CSS 4, zustand, perfect-freehand,
and the OpenAI Responses API.

---

## 📄 License

[MIT](LICENSE).

### Cite this artifact

```bibtex
@misc{lee2026inkling,
  author = {Lee, Soohwan},
  title  = {Inkling: A diary that writes back and lets go},
  year   = {2026},
  url    = {https://github.com/Soohwan-Lee/riddle-diary-web}
}
```

Inspired, at a distance, by a diary in a film that wrote back. That one was a
manipulator; this one holds still.

<div align="right"><a href="#inkling">Back to top ↑</a></div>
