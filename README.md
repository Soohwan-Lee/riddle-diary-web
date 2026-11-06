<div align="center">

<img src="docs/media/mark.svg" width="84" alt="" />

# Inkling

**A Tom Riddle's diary that writes back, then forgets.**

A critical design provocation built from three deliberate constraints:
**the record disappears**, **the writing is by hand**, and **the reply arrives at a hand's pace**.

[![critical design](https://img.shields.io/badge/design-critical-b4553f)](#three-deliberate-constraints)
[![DIS provocation](https://img.shields.io/badge/research-DIS%20provocation-8a5a44)](#why-this-is-a-provocation)
[![slow technology](https://img.shields.io/badge/research-slow%20technology-2f5d57)](#research-framing)
[![counterfunctional](https://img.shields.io/badge/artifact-counterfunctional-5c4d3c)](#what-we-kept-what-we-refused)
[![ephemeral interface](https://img.shields.io/badge/interface-ephemeral-6c665a)](#three-deliberate-constraints)
[![License: MIT](https://img.shields.io/badge/License-MIT-8a8578)](LICENSE)

<img src="docs/media/writing.gif" width="820" alt="Riddle writes a reply by hand, one character at a time, draws a small knot mid-sentence, circles a phrase, and finishes with a candle drawn on a line of its own." />

</div>

> **The diary remembers nothing. It is still listening.**

> [!NOTE]
> Every recording on this page runs in real time, at the app's own pace. The clips are
> sped up slightly so a README stays a README.

**Contents**

- [Three constraints](#three-deliberate-constraints) · [Why a provocation](#why-this-is-a-provocation) · [What we kept](#what-we-kept-what-we-refused) · [The artifact](#the-artifact)
- [Research framing](#research-framing) · [Design value & implications](#design-value--implications) · [Expected outcomes](#expected-outcomes)
- [What we did not build](#what-we-deliberately-did-not-build) · [Quick start](#quick-start) · [Technical notes](docs/INK.md) · [Full research note](docs/RESEARCH.md)

> **If you have five minutes:** read [the three constraints](#three-deliberate-constraints),
> [design value & implications](#design-value--implications), and
> [what we deliberately did not build](#what-we-deliberately-did-not-build). The
> full argument is in [docs/RESEARCH.md](docs/RESEARCH.md); the craft is in [docs/INK.md](docs/INK.md).

---

## 🧭 Three deliberate constraints

Inkling is built from three refusals. Everything else follows from them.

| Constraint | In the interface | What it refuses |
|---|---|---|
| **It forgets.** | Blank-page mode; context only in the tab; no database, no logs; the OpenAI request sets `store: false`. | History, export, search, cross-session memory. |
| **It is written by hand.** | Stylus or finger; four handwriting faces; per-grapheme reveal; marks and drawings. Typing is an accommodation, not the intended experience. | Chat bubbles, pasted text, avatars, typing indicators. |
| **It is slow.** | A 650ms beat before the first stroke; a character-by-character reveal; a reading dwell before the fade; no skip. | Instant output, a skip button, a loading spinner. |

### It forgets

Nothing is stored on this server. The page clears; the tab dies; the conversation is
not a record. The OpenAI request sets `store: false`, so the Responses API does not
keep the exchange as retrievable application state. This is not a missing feature. It
is the point.

### It is written by hand

Handwriting is slower, clumsier, and more embodied than typing. The hand keeps
hesitation as a wobble and feeling as pressure. When you write by hand, the page reads
the image of your strokes and never replaces them on screen with machine text. Typing
is available when a stylus or a finger is not, but the hand is the intended mode.

### It is slow

The reply is not pasted; it is written. A **650ms listening beat** sits before the
first stroke, every character has its own duration, and the page waits about as long
as it takes to read the answer before it fades. There is no instant option. The
waiting is the interface.

### One hand at a time

Your ink is gone before Riddle writes a word, and Riddle's ink is gone before the page
comes back. Two voices never share a scrolling feed. The hand-over ring, **Not yet**,
and hold-to-keep make time something the reader can hold. These are consequences of
the three constraints, not separate features.

---

## 🕯️ Why this is a provocation

In *Harry Potter and the Chamber of Secrets*, Tom Riddle's diary answers in
handwriting. It remembers. Its intimacy is the mechanism by which it takes something
from the person writing in it. Inkling borrows the object and refuses the mechanism:
the page answers, and then it lets go.

This is a **design provocation in the DIS sense** (Designing Interactive Systems): not
a product proposal, but a working artifact that makes a default assumption visible by
building its opposite. The assumption is that a conversational AI should remember.
The question is what happens when it doesn't.

> **A guarantee of disappearance lowers the threshold for saying the thing.**

When every sentence is kept, a writer has two silent readers in the room: a system
building a profile, and a future self who might reread the page later
(Mayer-Schönberger, 2009; Sellen & Whittaker, 2010). A diary that keeps everything
invites performance. A diary that clears removes the audience.

In HCI terms, Inkling is a **counterfunctional thing** (Pierce & Paulos, 2014) built
by **undesigning** (Pierce, 2012): it strips away a core digital function—saving—to
see what kind of honesty becomes possible without it. Critical and reflective design
supply the stance: the interface is an argument about values, not a neutral wrapper
(Dunne & Raby, 2013; Bardzell & Bardzell, 2013; Sengers et al., 2005). Adversarial
design supplies the edge: contesting a dominant product narrative by building its
counter-case (DiSalvo, 2012). Research through design supplies the method: the working
artifact is itself the contribution, judged by the questions it opens rather than by
retention metrics (Zimmerman et al., 2007; Gaver, 2012; Boehner et al., 2007).

Inkling is not a productivity tool, not a therapist, and not a companion product. The
artifact is the argument; the code is the material.

---

## 🧱 What we kept, what we refused

| We kept | We refused |
|---|---|
| **The hand**: ink, pressure, wobble, a drawing in the margin | Convenience as the default experience |
| **The wait**: a hand's pace, a reading dwell, no skip | Instant output, loading spinners |
| **Forgetting**: the page clears, the tab dies, `store: false` | History, export, search, cross-session memory |
| **Restraint**: one exact fragment, at most one question, or a drawing | Advice, diagnosis, persona performance |
| **One hand at a time**: your ink goes before Riddle writes | Two voices stacking in a scrolling feed |
| **Accessible fading**: `aria-live`, hold-to-keep, clocks that pause | Treating disappearance as an excuse to exclude slow readers |

The table is the design. Most conversational AI products add memory, history,
personalization, and engagement loops because those things are useful and easy to
measure. Inkling removes them and asks what is left. What is left is attention, a
tempo, and a sheet that does not keep score.

---

## ✨ The artifact

A single-page web app, a single stateless endpoint, and a lot of ink.

<img src="docs/media/blank.gif" width="820" alt="An entry is handed over and sinks into the page until the sheet is completely empty; only then does Riddle write a reply, with a small drawing of rain in it — and that fades in turn once it has been read, leaving the caret back at the top." />

<div align="center"><sub><i>Hand it over · it sinks · Riddle reads · Riddle answers · you read · gone · your turn.</i></sub></div>

| | |
|---|---|
| 📖 | **Blank-page mode.** What you hand over sinks in at once; the reply leaves about the time you finish reading it |
| ✍️ | **Handwriting first.** Stylus, finger, or keyboard; four handwriting faces, each a Latin/Hangul pair |
| 🪶 | **The reveal is the pen.** Per-grapheme writing in Korean and English, no cursor in front of it |
| 🌤️ | **Riddle draws.** Sixty small things, stroke by stroke in the same hand — [catalogue](docs/GLYPHS.md) |
| ⏱️ | **The page can be held.** A hand-over ring, **Not yet**, hold-to-keep, and a clock that stops while you write |
| 🔒 | **No database, no logs, no history.** Context lives in the tab and dies with it |

The full technical story is in [docs/INK.md](docs/INK.md). The drawing vocabulary and
contact sheet are in [docs/GLYPHS.md](docs/GLYPHS.md).

---

## 🔬 Research framing

Slow technology is the starting point, not the whole lineage. Hallnäs and Redström's
slow technology is about producing time for reflection rather than removing it.
Inkling takes that seriously: there is no skip, the reply is written at a hand's pace,
and the page waits until you have read it.

But the artifact also draws on **counterfunctional design** (removing digital
capabilities on purpose), **design for forgetting** (treating decay and release as
features rather than bugs), **microboundaries** (small pauses that interrupt automatic
habits), and **interpretive ambiguity** (answering with a fragment or an unannotated
sketch rather than diagnostic advice). Together, these traditions turn a single build
into **intermediate-level design knowledge** (Höök & Löwgren, 2012) about how
conversational AI handles time, body, and memory.

| Lineage | What it explains here |
|---|---|
| **Slow Technology & Slow Design** — Hallnäs & Redström, 2001; Grosse-Hering et al., 2013; Odom et al., 2014 | The waiting is the interface. Anticipation, the 650ms beat, and a pace tuned for reflection rather than throughput. |
| **Counterfunctional Design & Undesigning** — Pierce & Paulos, 2014; Pierce, 2012 | Building digital limitations on purpose: removing save, search, export, and skip to open a different kind of use. |
| **Forgetting & Total Capture Critique** — Bannon, 2006; Mayer-Schönberger, 2009; Sellen & Whittaker, 2010 | Total capture is not human memory. A permanent record creates a future observer and chills candor; forgetting is a feature. |
| **Ephemeral UI & Rituals of Release** — Döring et al., 2013; Sas & Whittaker, 2013 | Ink as a decaying material. Letting go of a thought requires a visible ritual—sinking into paper—not a delete button. |
| **Critical, Reflective & Adversarial Design** — Dunne & Raby, 2013; Bardzell & Bardzell, 2013; Sengers et al., 2005; DiSalvo, 2012 | Contesting memory-first AI (Park et al., 2023) by building its opposite and leaving the trade-offs visible. |
| **Embodied Interaction, Ambiguity & Seams** — Dourish, 2001; Gaver et al., 2003; Chalmers & Galani, 2004 | Why physical strokes matter; why Riddle answers with one fragment or an unexplained drawing (`[[knot]]`); why system seams stay honest. |
| **Design Frictions & Microboundaries** — Cox et al., 2016 | Small pauses—the 4s hand-over ring, **Not yet**, and the one-hand gate—that keep the exchange from feeling automatic. |
| **Social Responses, ELIZA & Expressive Writing** — Weizenbaum, 1966; Pennebaker & Beall, 1986; Nass & Moon, 2000; Bickmore & Picard, 2005 | Why a replying page is read as someone, and why Inkling refuses long-term attachment cues. |
| **Research through Design & Strong Concepts** — Zimmerman et al., 2007; Boehner et al., 2007; Gaver, 2012; Höök & Löwgren, 2012 | The artifact as argument, and the five-word forgetting cycle (*absorb, dwell, clear, hold, hand back*) as a reusable concept. |

The full research note is in [docs/RESEARCH.md](docs/RESEARCH.md). All 28 references
are below.

<details>
<summary><strong>References</strong> — 28 sources, ACM style</summary>

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

</details>

---

## 💡 Design value & implications

The provocation does not argue that all AI should forget. It argues that **memory
should be a visible design choice with costs, not an invisible default**.

A memory-first product shows what it remembers and calls that care; it rarely shows
what the person held back because they knew it was being kept. By building the
opposite, Inkling surfaces six implications that travel beyond this project:

| Implication | What it means | What it asks of a designer |
|---|---|---|
| **Memory is a choice, not a default.** | Keeping a record creates a future audience and a user model. Forgetting gives both up so the writer can speak in the present tense. | Run a memory audit: ask what the existence of a record stops the user from saying, and check provider defaults (`store: false`). |
| **Slowness has to be earned.** | A delay on a chatbot is just latency. Waiting reads as writing only when the reply is short and has a human rhythm. | Never slow an interface down without making it briefer. Leave no skip button that turns the ritual back into a loading screen. |
| **One hand at a time.** | A scrolling feed turns conversation into a ledger. A single sheet that clears between turns makes conversation a place. | Question the infinite feed for reflective tools. Let one turn finish before the next begins. |
| **Handwriting is a mode, not a skin.** | A cursive font over a chat box is a costume. The hand changes the unit of thought from the message to the stroke. | Keep the user's raw ink on screen rather than replacing it with OCR text. Design for pressure, marks, and misreading. |
| **Ambiguity beats false authority.** | LLMs default to advice and explanations. In reflection, advice closes the thought; ambiguity keeps it open (Gaver et al., 2003). | Mirror a single fragment, ask at most one question, or answer with an unexplained drawing (`[[rain]]`, `[[knot]]`). |
| **Ephemerality needs an accessible layer.** | Disappearing text excludes anyone who reads slowly, looks away, or uses a screen reader. | Pair visual decay with a persistent `aria-live` region, hold-to-keep, and clocks that pause when the tab is hidden or the user writes. |

### The tensions left open

A product tries to resolve its trade-offs. A provocation keeps them visible:
- **Candor vs. continuity** — saying the unguarded thing today vs. building on it tomorrow.
- **Embodiment vs. convenience** — the weight of a stroke vs. the ease of a keyboard.
- **Reflection vs. friction** — a pause that lets you reread vs. a wait that tests patience.
- **Presence vs. honesty** — a page that feels like a listener vs. a program that admits what it is.

---

## 🧪 Expected outcomes

### What we expect the artifact to do

- **Lower the threshold for disclosure.** Without a future self or a profile to perform
  for, entries become more specific, more fragmented, and more honest than entries meant
  to be kept.
- **Turn the wait into rereading.** In the second or two while the entry sinks and the
  650ms listening beat rests on the empty sheet, writers reread the sentence they just
  let go of.
- **Make time something to hold.** Rather than looking for a skip button, readers use
  **Not yet** and press-and-hold to pause the page when a sentence or a drawing lands.
- **Shift how the page is described.** Readers talk about the page as *listening* rather
  than *generating*, and the pause as *writing* rather than *loading*.

### What it leaves behind for design and research

| Design outcomes | Research outcomes |
|---|---|
| A five-word vocabulary for designing **forgetting**: *absorb, dwell, clear, hold, hand back*. | A falsifiable counter-case to memory-first AI, with hand/type and blank/keep toggles built in. |
| A working pattern where **ephemerality and accessibility** reinforce rather than cancel each other. | A study protocol that measures disclosure and tempo **without logging a single word of content**. |
| A **memory audit** framing that treats provider retention defaults (`store: false`) as interaction design. | Craft reflections showing where formal tests end and visual inspection begins. |

### What would count as success, and what would not

| Success | Failure |
|---|---|
| Designers treat memory as a choice with a cost, not a default. | It reads as a *Harry Potter* skin over a standard chatbot. |
| Blank mode produces more candid writing than keep mode. | Disappearance makes people anxious, or entries get shorter. |
| Waiting reads as someone writing, not a slow connection. | People ask for a skip button or call the reveal laggy. |
| **Not yet** and hold-to-keep are used as agency over time. | People tap the empty sheet trying to interrupt Riddle's turn. |
| Unannotated drawings (`[[candle]]`, `[[knot]]`) land where prose would overstep. | The page is asked for advice, diagnosis, or history export. |

The current evidence is **207 unit tests, automated accessibility/frame-rate checks,
and the designer's log**, not a formal user study. A small within-subject study (12
participants, two weeks, four conditions across `Hand/Type` × `Blank/Keep`, with zero
conversation content leaving the device) is specified in
[docs/RESEARCH.md](docs/RESEARCH.md).

---

## 🛠️ What the making taught us

- **Five drawings went back for a second pass.** Every one passed unit tests for bounds
  and valid path data while being the wrong picture: a cloud that looked like mountains,
  a crescent that looked like a lens, a drop that looked like a gem. The fix was
  rendering a [contact sheet](docs/media/glyphs.png) and looking at it.
- **The one-hand gate read a render snapshot.** It described the page as it was before
  the entry landed; on the second turn it said "empty" and opened at once.
- **The handwriting reading could arrive after the turn had faded.** The fix was to
  track the handwritten turn by id and remember each reading once.
- **The OpenAI Responses API stores responses for 30 days by default.** The request now
  sets `store: false`; a privacy promise can be broken by a provider default.
- **The nib looked like a cursor.** Removing the leading mark made the writing feel
  like a pen on paper instead of a text field.

The craft behind these lessons is in [docs/INK.md](docs/INK.md).

---

## 🚫 What we deliberately did not build

### Cross-session memory

The obvious next feature is the one the film is about: you log in, Riddle remembers
you, and the conversation continues across sessions. It is not built.

That is not a scheduling problem. In the film, the diary's memory is the mechanism of
possession: it knows you in order to use you. The web's default is the same shape at a
larger scale — keep everything, personalize, re-engage. Inkling's answer is to remove
the mechanism, not to make it kinder.

If it is ever built, these hold or it is not this project any more:

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
- No skip button. No analytics.

The absence is the feature. A diary that remembers everything is a different object,
and the film already showed us what that object does.

---

## 🗺️ Roadmap

- [x] **Riddle draws** — sixty of them, through the same engine that draws the circles
- [x] **The page knows the hour** — a first line that follows the reader's local time
- [x] **A listening beat** — a short pause and an ink drop before the first stroke
- [x] **A date in the margin** — page furniture in the page's own hand
- [ ] Drawings that know where they are: a shape sized to the phrase it sits beside
- [ ] A single-stroke font backend for Latin text
- [ ] Page turns, paper textures, an optional pen sound
- [ ] An end-of-session ritual: keep one sentence, burn the rest
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
drawings, fading — is explorable at zero cost. A missing key is never a 500.

### Environment

| Variable | Required | Notes |
|---|---|---|
| `OPENAI_API_KEY` | no | Server-only. Absent ⇒ mock mode |
| `OPENAI_MODEL` | no | Defaults to `gpt-5.4-mini`. Must support image input and the Responses API |
| `MOCK_AI` | no | `1` forces mock mode even with a key present |
| `NEXT_PUBLIC_SITE_URL` | no | Public origin for canonical URLs, the sitemap and the social card |

### Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FSoohwan-Lee%2Friddle-diary-web&env=OPENAI_API_KEY&envDescription=Optional%20—%20leave%20blank%20to%20run%20in%20mock%20mode)

Zero configuration. The one endpoint runs on the Node runtime with a 60s ceiling,
which streaming makes irrelevant — time to first character is hidden inside the page's
own absorption beat.

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

- [docs/RESEARCH.md](docs/RESEARCH.md) — extended research framing, design implications, expected outcomes, study design, and all 28 references
- [docs/INK.md](docs/INK.md) — two ink backends, the parser, timing, fading, four hands
- [docs/GLYPHS.md](docs/GLYPHS.md) — the sixty drawings, the contact sheet, adding one
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
