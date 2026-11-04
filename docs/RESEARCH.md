# Inkling — research notes

[← Back to the README](../README.md)

> A working note for a built artifact, not a paper. It separates three things
> that are easy to blur: what Inkling claims, what the build actually does, and
> what has been observed. The study in §7 has not been run.

**Status:** deployed artifact, no formal user study. 207 tests pass.

| | |
|---|---|
| **Artifact** | A one-page diary that answers in handwriting and then clears |
| **Constraints** | It forgets · it is written by hand · it is slow |
| **Evidence** | 207 tests, craft observations, one designer's log |
| **Study** | 12 participants, four conditions, two weeks — not yet run |
| **Wager** | A guarantee of disappearance changes what people are willing to write |

**Contents:** [The claim](#1-the-claim) · [The instrument](#2-the-artifact-as-an-instrument) · [Rejected alternatives](#3-decisions-and-rejected-alternatives) · [Positioning](#4-where-it-sits) · [Related work](#5-related-work-what-was-borrowed-where-it-departs) · [Evidence](#6-evidence-so-far) · [Study](#7-a-study-that-could-be-run) · [Hypotheses](#8-hypotheses-operationalized) · [Contributions](#9-contributions) · [Limitations](#10-limitations) · [Guardrails](#11-what-would-make-it-a-betrayal) · [References](#12-references-acm-style)

---

## 1. The claim

Conversational AI has a default: **keep**. The conversation is stored, searchable,
summarized into a profile, and carried into the next session. Memory is presented as
continuity and care. It is also how a system builds a model of the person it is
talking to — and once that model exists, the product has a reason to use it:
personalize, anticipate, re-engage.

Tom Riddle's diary is the reference because it makes the mechanism visible. It answers
in handwriting. It remembers. Its memory is how it takes something from the writer.
Inkling keeps the object and removes the mechanism: **the page answers, and then it
does not keep.**

> **Research question:** what does a conversational AI become when it answers in
> handwriting, at a hand's pace, and keeps nothing?

Five sub-questions follow, one per constraint and one for their combination:

- **RQ1 — Forgetting.** Does a guarantee of disappearance change what someone is
  willing to write?
- **RQ2 — Hand.** Does writing by hand change what is written, or how the exchange is
  experienced?
- **RQ3 — Tempo.** Is the wait read as writing, or as loading?
- **RQ4 — Ritual.** Does one hand at a time produce a ritual, or just friction?
- **RQ5 — Absence.** Does no memory feel lighter, or emptier?

This is a **design claim, not a clinical one**. It does not claim that forgetting is
therapeutic, that handwriting is better, or that slowness is virtuous. It claims that
these are designable conditions, and that their effect on disclosure is an empirical
question. The artifact is the instrument; the study is how the instrument would be
read.

---

## 2. The artifact as an instrument

The three constraints are not themes. They are mechanisms, and each one has a number
attached to it.

| Constraint | Mechanism | What the reader meets |
|---|---|---|
| **It forgets** | No database, no content logs. Error logging keeps the error class only. | Nothing to retrieve after the tab closes. |
| ↳ | Chat context lives in tab memory; the last 24 messages go upstream. | A reload is a clean slate. |
| ↳ | The OpenAI Responses request sets `store: false`. | No application-state retention at the provider. |
| ↳ | The entry is absorbed in 400 ms + 900 ms; the reply leaves after a reading estimate. | The sheet is empty before the reply, and empty again after it. |
| **It is written by hand** | Hand is the default input; four Latin/Hangul faces; typing is a toggle. | The first screen asks for a hand. |
| ↳ | Pointer input with pressure where the device reports it; 4 s of stillness hands over. | Hesitation and pressure stay visible. |
| ↳ | The entry is sent as an image; a `READ:` line becomes the transcript. | The page answers what it can read, not what was typed. |
| ↳ | The reply is a handwriting face revealed per grapheme at 1,200 cpm; marks and drawings are stroke-drawn. | The reply arrives as writing, not as a block. |
| **It is slow** | A 650 ms beat after the sheet clears. | A pause that reads as someone taking the pen. |
| ↳ | The reply is held until the entry has sunk; the composer returns only after the reply has gone. | One hand at a time. |
| ↳ | No skip control. Reduced motion shortens; hold stops the clock; fade can be disabled. | Waiting is not a loading state with an exit. |
| ↳ | Reading estimate: 900 weighted units/min + 1.2 s tail, clamped to 4.5–20 s, then scaled by pace. | The reply stays about as long as it takes to read. |

The reply is **typographic handwriting**: a face revealed by `clip-path`, not
synthesized strokes. Marks and drawings are SVG strokes. That distinction matters for
the embodiment claim and is returned to in [§10](#10-limitations).

### One turn, in milliseconds

These are the client's numbers in blank-page mode. The request is already in flight
while the entry sinks, so model latency hides inside the ritual rather than adding to
it.

| Time | Event |
|---|---|
| `0` | Last stroke. 4 s of stillness, or a tap, hands the entry over. The request leaves at once. |
| `0–1.3 s` | The entry sinks: 400 ms dwell, 900 ms fade. |
| `~1.3 s` | The sheet is empty. The reply gate opens; the 650 ms beat begins. |
| `~1.95 s` | First grapheme, if tokens have arrived. Network delay pushes this later, never earlier. |
| `≈50 ms / weighted character` | The reply writes. Punctuation and line breaks add rests, scaled to the hand. |
| Reply end | Reading dwell of 4.5–20 s, then a 5 s fade at the default pace. |
| After the fade | The composer returns. |

### What is deliberately absent

| Absent | Why |
|---|---|
| History, export, search | They turn the page into an archive and make the fade a bug. |
| Cross-session memory | It is the film's mechanism of possession; it would change what the page is. |
| Avatar, voice, persona | They invite attachment while hiding the program. |
| Skip | It converts writing back into loading. |
| Streaks, reminders, notifications | They turn reflection into a habit loop. |
| Analytics on what people write, or on how often they return | They turn the page into a funnel. |

---

## 3. Decisions and rejected alternatives

A provocation is made of refusals, but a refusal is only interesting if the
alternative was real. These are the decisions where the easier option was available.

| Decision | Easier alternative | Why rejected | Cost accepted |
|---|---|---|---|
| Blank page by default | Keep the exchange on screen | Forgetting should be structural, not a setting | No rereading; an accidental reload loses the exchange |
| Pen by default | Type by default | The claim is about the hand; a typing default would make it a chat app with a font | First-visit friction; typing is one toggle away |
| Per-grapheme reveal | Stream tokens as text | Token streaming reads as a chat window; the reveal is the pen | More timing code; no instant option |
| Fixed glyph vocabulary | Let the model invent SVG | Invented paths are unreliable and can carry markup; a table cannot | Only sixty drawings; expression is bounded |
| Reading estimate | One fixed dwell | A one-line reply and a three-line reply need different time | Formula tuning; a pace multiplier |
| No caret | Blinking caret | A caret signals a text field and instant text | Less obvious where writing starts; affordances must carry it |
| Tab-only memory | `sessionStorage` or `localStorage` | A reload should be a clean slate | A reload loses the conversation |
| No skip | Skip animation | Skip turns the wait back into loading | Some readers will find it slow; accessibility escapes instead |

The right-hand column is the part that makes this a design argument rather than a
feature list. Every refusal has a price, and the artifact pays it on purpose.

---

## 4. Where it sits

Inkling is not the first ephemeral interface, the first handwriting interface, or the
first slow chat. The contribution is the **combination, held as one constraint set**.

| Archetype | Keeps | Input | Tempo | Optimizes for |
|---|---|---|---|---|
| Memory-first assistant | History, profile, cross-session recall | Keyboard, voice | Instant | Task success, retention |
| Companion app | Relationship history, persona | Chat | Instant | Attachment, daily return |
| Journaling app | Entries, archive, export, streaks | Keyboard | Immediate | Habit, archive |
| Slow-tech artifact | Often little or nothing | Varied | Deliberately slow | Reflection, interpretation |
| **Inkling** | **No conversation storage** | **Hand first** | **Hand-paced** | **Disclosure, interpretation** |

Read down the columns and each cell is unremarkable. Read across the last row and the
argument appears: the page is slow because it is handwritten, handwritten because the
body is part of the exchange, and forgetful because memory is the mechanism the film
warns about. Remove one constraint and the object becomes a different, more familiar
thing.

---

## 5. Related work: what was borrowed, where it departs

The lineage is not a list of influences. Each row names the idea taken and the point
where Inkling refuses it.

| Work | Idea used | Where it appears | Where Inkling departs |
|---|---|---|---|
| Hallnäs & Redström, 2001 | Slow technology produces time for reflection rather than removing it | No skip, reading dwell, one hand at a time | Slowness is not only an aesthetic; it is a condition on what gets written |
| Grosse-Hering et al., 2013 | Tempo and ritual make an interaction meaningful | Hand-over ring, **Not yet**, hold-to-keep | No engagement target; the ritual is allowed to be inconvenient |
| Odom et al., 2014 | Anticipation and re-visitation in a domestic artifact | The page returns, day after day | There is no archive to revisit; the return is to a blank page |
| Döring et al., 2013 | Ephemeral UI treats decay as a material | Ink absorbs and fades | Ephemerality is conversational, not only material |
| Bannon 2006 | Forgetting is a feature, not a failure | No history, no export | Extends the argument from ubicomp to conversational AI |
| Sellen & Whittaker 2010 | Total capture is not the same as memory | No lifelog, no transcript | The alternative to capture is not better retrieval; it is no capture |
| Park et al., 2023 | Generative agents run on a memory stream, reflection, and retrieval | A negative reference | Removes the memory stream that makes the agent continuous |
| Bardzell & Bardzell 2013 | Critical design is an argument about values | The three refusals | A working web artifact, not a gallery object |
| Dunne & Raby 2013 | Speculation proposes a counter-position | The diary that answers and forgets | Meant to be used daily, not only interpreted |
| DiSalvo 2012 | Adversarial design contests a dominant narrative | Memory-first AI | The adversary is a product default, not an institution |
| Gaver 2012; Zimmerman et al., 2007 | The artifact is the contribution in research through design | The build, the tests, the contact sheet | Adds technical measurement and autoethnography to the annotated artifact |
| Boehner et al., 2007 | Probes are read differently by different audiences | Expected misreadings | Names those readings as failure criteria instead of leaving them open |
| Nass & Moon 2000; Bickmore & Picard 2005 | People respond socially to machines; relational agents are designed for attachment | The page reads as someone | Refuses the durable relationship features: memory, name, avatar, voice |
| Pennebaker & Beall 1986; Weizenbaum 1966 | Writing a day down; projecting a listener into a machine | The daily entry; the risk of ELIZA | No therapeutic claim; the program is disclosed in one sentence |

The closest neighbour is slow technology, and the most important departure is that
slowness here is not a lifestyle proposal. It is a constraint on disclosure: if the
reply is written, the reader has time to reread what they wrote; if the page clears,
there is nothing to perform for later. The artifact tests whether those conditions
change the sentence.

---

## 6. Evidence so far

The evidence is uneven, and the note says so. Some claims are true by construction;
some are design observations; the central hypothesis is untested.

| Claim | Status | Basis |
|---|---|---|
| The page keeps nothing | By construction | No database, no content logs, tab memory, `store: false` |
| The reply is written at a hand's pace | By construction | 1,200 cpm; timing tests |
| The page waits for a reading | By construction | Dwell formula and tests |
| The wait reads as writing | Partial | Designer's observations; no participants |
| Disappearance lowers the threshold | Untested | Hypothesis |
| Handwriting changes what is said | Untested | Hypothesis |
| One hand at a time creates ritual | Untested | Hypothesis |
| No memory changes what is said | Untested | Hypothesis |

### What the build pins down

- **207 tests in eight files.** The dwell tests pin the floor (4.5 s), the ceiling
  (20 s), the tail (1.2 s), and pace scaling. The tempo tests pin script
  normalization: a Korean reply and an English reply of the same reading weight take
  the same time.
- **The parser tests pin streaming behavior.** An unclosed `[[` truncates text until
  `]]` arrives, and a drawing occupies one grapheme slot so marks and indices still
  line up.
- **The glyph tests pin the vocabulary.** All sixty drawings have geometry, a
  Korean/English label, and a prompt entry. A missing label is silent to a screen
  reader; a missing prompt entry means the drawing is never asked for.
- **The session tests pin the one-hand gate to the store, not a render snapshot.**
  This was a real bug: on the second turn the snapshot said the sheet was empty and
  the reply started early.
- **The transcript tests pin a reading to the turn id**, so a handwriting transcript
  that arrives after the entry has faded is still retained for the next request.
- **The route sets `store: false`**, and the error path logs only the error class,
  never the message body.

### What the making taught us

These are the design lessons that survived the build. Each one changed the artifact.

- **Generated shapes need looking at.** Five drawings were redrawn after the contact
  sheet. Four of the first thirty passed every geometry test while being the wrong
  picture: a cloud that read as a mountain range, a crescent that read as a lens, a
  teardrop that read as a gem, an arch that read as a hammock. Invariants are not
  resemblance.
- **A gate must read the state, not the picture.** The one-hand gate first read a
  render snapshot. On the second turn it described the page as it was before the
  entry landed, decided the sheet was empty, and let the reply start early. The fix
  was to read the store.
- **Ephemerality makes ordering a first-class problem.** A handwriting reading could
  arrive after the turn had faded. The fix was to remember the turn by id and fold
  each reading in once. A disappearing interface has to be more careful about time,
  not less.
- **The first mark carries the metaphor.** The first reveal had a leading mark; it
  read as a cursor. Removing it made the writing feel like a pen. The smallest mark
  decides whether the page is a text field or a hand.
- **A privacy promise includes provider defaults.** The Responses API stores
  responses for 30 days by default. `store: false` is part of the design, not an
  implementation detail.

### The designer's log

The log is not a dataset. Three observations recurred while building and using the
page:

- Without the 650 ms beat, the reply began the instant the sheet cleared, and the
  page read as a text field rather than a hand taking up a pen. The beat was added to
  make the gap intentional.
- An early fixed dwell treated a one-line reply and a three-line reply the same. The
  page either held the short one too long or rushed the long one. Weighting the dwell
  by script and length made the page feel as if it were waiting for a reader, not
  running a timer.
- In blank mode, the entry sinking before the reply was the strongest signal that the
  page would not keep it. In keep mode, the same exchange felt like a transcript. The
  difference is not the words; it is whether the sheet is allowed to remember them.

### What this evidence is not

There are no participants, no pre/post measures, no inter-rater reliability, and no
longitudinal use. The build evidence supports the coherence of the artifact. It does
not support the central hypothesis. That is what the next section is for.

---

## 7. A study that could be run

The app already contains the conditions a study needs: hand/type and blank/keep are
toggles, and the timing is deterministic. A small within-subject study would be
enough to learn something without pretending to be a trial.

### Design

Twelve participants. Over two weeks: eight condition days (four conditions, two days
each, Latin-square order), one free-choice day, and one exit interview. That is
roughly ninety-six entries across the sample.

| Condition | Input | Page | What it isolates |
|---|---|---|---|
| A | Hand | Blank | The intended experience |
| B | Type | Blank | The hand, without the page mode |
| C | Hand | Keep | The page mode, without the hand |
| D | Type | Keep | The conventional baseline |

One entry per day, at the end of the day, about anything. No prompts are supplied:
the question is what participants choose to write, not how they respond to a prompt.
Skipping a day is data, not a failure.

### Participants

Twelve adults, recruited outside the designer's immediate circle, balanced across
Korean- and English-speaking participants and across comfort with handwriting. There
is no mood-based exclusion; this is not a clinical study. Participants are compensated
for their time.

### Measures

| Construct | Operationalization | Source |
|---|---|---|
| Disclosure | Characters per entry; first-person pronoun rate; comfort after writing (1–7) | Device-computed counts; post-entry survey |
| Tempo | Perceived duration vs. actual; forced choice "written" or "loaded"; a "too slow" item | Survey |
| Embodiment | Share of entries in hand mode on the free day; whether marks and drawings were noticed | Mode log; interview |
| Ritual | Use of **Not yet** and hold-to-keep; gap between reply end and next entry | Device-computed counts |
| Memory | What they remember writing; whether they wanted history or export | Exit interview |
| Interpretation | How they describe the page: listening, generating, trick, other | Exit interview |

The first-person count is a rough proxy: Korean drops pronouns more readily than
English, and character counts differ by script. Both are compared within participants,
not across languages.

### Data handling

No conversation content leaves the device. A study build adds a local-only panel that
computes counts and lets the participant export a CSV; nothing is sent to a server.
The post-entry survey is local. Interviews are recorded with consent, transcribed,
and pseudonymized. There is no server analytics, and the study does not add one.

That last point matters: a study of a page that forgets must not become the archive
the page refuses to be. The consent form should say that the researcher will not
retain the entries either.

### Analysis

Descriptive statistics by condition, paired comparisons with effect sizes rather than
significance alone, and thematic analysis of interviews (Braun & Clarke, 2006) with
two coders. Disagreements are resolved by discussion. Survey, counts, and interviews
are triangulated; a claim that appears in only one channel is reported as weak.

### Ethics

Informed consent; the provocation is disclosed; participants know the model is a
program and the researcher is the designer; no deception; the right to withdraw and
delete data; crisis resources; compensation.

### What it can and cannot show

**Can:** whether the constraints change entry length, self-reported comfort, mode
choice, and how participants describe the page in a small sample.

**Cannot:** clinical benefit, long-term effects, causality at scale, or generalization
beyond Korean/English web users with a stylus or a finger.

---

## 8. Hypotheses, operationalized

The thresholds below are illustrative. They would be fixed before data collection,
not after.

| Hypothesis | Comparison | Signal | Refuted if |
|---|---|---|---|
| **H1. Disappearance lowers the threshold** | Blank vs. keep | +20% median characters; higher first-person density; comfort at least as high | Blank entries are shorter, or comfort is lower |
| **H2. The wait reads as writing** | Hand + blank | At least 60% choose "written" over "loaded"; perceived duration close to actual | Most choose "loaded", or ask for a skip |
| **H3. Handwriting changes the exchange** | Hand vs. type | Hand is chosen on the free day; marks and drawings are noticed | Hand is abandoned, or described as "just text" |
| **H4. One hand at a time creates ritual** | Blank | **Not yet** or hold-to-keep is used at least once per participant, and described as agency | It is described as a bug or an interruption |
| **H5. No memory changes what is said** | All | The absence is described as relief or neutrality, and mentioned without prompting | Participants ask for history or export, or feel unsafe without it |

The numbers above are illustrative targets, not effect sizes. They are the shape of
the result that would make the claim worth pursuing, written down before the data can
tempt anyone to move them.

---

## 9. Contributions

What another designer or researcher can take from this, beyond the demo.

| For | Contribution |
|---|---|
| **Design practice** | A constraint-first method: build the refusal, then look at what it does. The vocabulary below. |
| **HCI** | Ephemerality and accessibility as a paired pattern: the visual layer disappears, the `aria-live` layer does not. |
| **AI product design** | Memory as a visible choice with costs; provider defaults as part of the privacy design (`store: false`). |
| **Interface engineering** | Two ink backends on one clock; a fixed glyph vocabulary with a parser that keeps grapheme indices aligned. |
| **Readers** | A small room with no record. |

### A vocabulary for designing forgetting

| Term | What it names |
|---|---|
| **absorb** | The entry sinks at hand-over, before the reply begins. |
| **dwell** | The reply stays for a reading estimate, not a fixed timer. |
| **clear** | The page returns empty; there is no history to reopen. |
| **hold** | Press and hold stops the clock, so reading is not a race. |
| **hand back** | The composer returns only after the reply has gone. |

These five words are the design vocabulary the artifact offers. Each names a moment
that can be observed, removed, or varied — which is what makes the vocabulary useful
to a study rather than only to a critique.

---

## 10. Limitations

1. **No formal study.** The central hypothesis is untested; the autoethnography is one
   designer.
2. **The reply is typographic, not synthesized.** It is a handwriting face revealed
   per grapheme. Marks and drawings are stroke-drawn, but the letters are not. The
   embodiment claim is weaker than the interface suggests.
3. **The reading is model-generated.** A `READ:` line can misread handwriting, and an
   illegible entry may reach the model as an image with no reliable transcript. The
   page's understanding is not verified.
4. **Script and language coverage.** Korean and English only; four faces; sixty
   drawings. The diary form is culturally specific.
5. **Pressure is device-dependent.** Pen hardware reports pressure; finger and mouse
   infer it. The pressure in the stroke is partly simulated.
6. **Disappearance is not a security guarantee.** The page can be screenshotted,
   recorded, or captured by an extension. It prevents the app from keeping a record;
   it cannot prevent the person or the device from doing so.
7. **Provider retention is separate.** `store: false` disables application-state
   retention, not OpenAI's abuse-monitoring retention (up to 30 days unless the
   organization has Zero Data Retention). The privacy claim is scoped to this server.
8. **The model is prompt-dependent.** Riddle can fail to listen, give advice, or
   perform a persona. The prompt is a design constraint, not a guarantee.
9. **Accessibility is designed, not validated.** The full text reaches an `aria-live`
   region, reduced motion is honored, and hold-to-keep works. But no study with
   disabled users has been run, and handwriting input itself may exclude some users;
   typing is the fallback.
10. **Rate limiting is per instance.** A public deployment needs an account-level
    spend limit; the app's limiter is not a global guarantee.
11. **Novelty and designer bias.** A first encounter may be read as a trick; a
    two-week study may be read as a habit. The designer is also the developer, and
    the artifact encodes his values.
12. **The reading can overshoot.** A provocation against memory can be read as a claim
    that forgetting is always good. The artifact argues for designability, not for a
    universal rule.

---

## 11. What would make it a betrayal

The artifact is defined as much by what it refuses as by what it does. These are the
lines that would make it a different, more familiar product.

- Cross-session memory that stores the conversation and calls it care.
- Streaks, reminders, or notifications that turn reflection into a habit loop.
- Advice, diagnosis, or a coaching persona.
- An avatar or a voice that invites attachment while hiding the program.
- A history panel, export, or search.
- A skip button that turns the writing back into a loading state.
- Analytics on what people write.

The absence is the feature. A diary that remembers everything is a different object,
and the film already showed us what that object does.

---

## 12. References (ACM style)

1. Liam J. Bannon. 2006. Forgetting as a Feature, Not a Bug: The Duality of Memory and Implications for Ubiquitous Computing. *CoDesign* 2, 1 (2006), 3–15. https://doi.org/10.1080/15710880600608230
2. Jeffrey Bardzell and Shaowen Bardzell. 2013. What is "critical" about critical design? In *Proceedings of the SIGCHI Conference on Human Factors in Computing Systems* (CHI '13). ACM, New York, NY, USA, 3297–3306. https://doi.org/10.1145/2470654.2466451
3. Timothy W. Bickmore and Rosalind W. Picard. 2005. Establishing and Maintaining Long-Term Human-Computer Relationships. *ACM Transactions on Computer-Human Interaction* 12, 2 (2005), 293–327. https://doi.org/10.1145/1067860.1067867
4. Kirsten Boehner, Janet Vertesi, Phoebe Sengers, and Paul Dourish. 2007. How HCI Interprets the Probes. In *Proceedings of the SIGCHI Conference on Human Factors in Computing Systems* (CHI '07). ACM, New York, NY, USA, 1077–1086. https://doi.org/10.1145/1240624.1240789
5. Virginia Braun and Victoria Clarke. 2006. Using Thematic Analysis in Psychology. *Qualitative Research in Psychology* 3, 2 (2006), 77–101. https://doi.org/10.1191/1478088706qp063oa
6. Carl DiSalvo. 2012. *Adversarial Design*. MIT Press, Cambridge, MA.
7. Tanja Döring, Axel Sylvester, and Albrecht Schmidt. 2013. A Design Space for Ephemeral User Interfaces. In *Proceedings of the 7th International Conference on Tangible, Embedded and Embodied Interaction* (TEI '13). ACM, New York, NY, USA, 75–82. https://doi.org/10.1145/2460625.2460637
8. Anthony Dunne and Fiona Raby. 2013. *Speculative Everything: Design, Fiction, and Social Dreaming*. MIT Press, Cambridge, MA.
9. William Gaver. 2012. What Should We Expect from Research through Design? In *Proceedings of the SIGCHI Conference on Human Factors in Computing Systems* (CHI '12). ACM, New York, NY, USA, 937–946. https://doi.org/10.1145/2207676.2208538
10. Barbara Grosse-Hering, Jon Mason, Dzmitry Aliakseyeu, Conny Bakker, and Pieter Desmet. 2013. Slow Design for Meaningful Interactions. In *Proceedings of the SIGCHI Conference on Human Factors in Computing Systems* (CHI '13). ACM, New York, NY, USA, 3431–3440. https://doi.org/10.1145/2470654.2466472
11. Lars Hallnäs and Johan Redström. 2001. Slow Technology – Designing for Reflection. *Personal and Ubiquitous Computing* 5, 3 (2001), 201–212. https://doi.org/10.1007/PL00000019
12. Clifford Nass and Youngme Moon. 2000. Machines and Mindlessness: Social Responses to Computers. *Journal of Social Issues* 56, 1 (2000), 81–103. https://doi.org/10.1111/0022-4537.00153
13. William Odom, Abigail Sellen, Richard Banks, David Kirk, Tim Regan, Mark Selby, Jodi Forlizzi, and Jonathan Zimmerman. 2014. Designing for Slowness, Anticipation and Re-visitation: A Long Term Field Study of the Photobox. In *Proceedings of the SIGCHI Conference on Human Factors in Computing Systems* (CHI '14). ACM, New York, NY, USA, 1961–1970. https://doi.org/10.1145/2556288.2557178
14. Joon Sung Park, Joseph C. O'Brien, Carrie J. Cai, Meredith Ringel Morris, Percy Liang, and Michael S. Bernstein. 2023. Generative Agents: Interactive Simulacra of Human Behavior. In *Proceedings of the 36th Annual ACM Symposium on User Interface Software and Technology* (UIST '23). ACM, New York, NY, USA, Article 2, 1–22. https://doi.org/10.1145/3586183.3606763
15. James W. Pennebaker and Sandra K. Beall. 1986. Confronting a Traumatic Event: Toward an Understanding of Inhibition and Disease. *Journal of Abnormal Psychology* 95, 3 (1986), 274–281. https://doi.org/10.1037/0021-843X.95.3.274
16. Abigail J. Sellen and Steve Whittaker. 2010. Beyond Total Capture: A Constructive Critique of Lifelogging. *Communications of the ACM* 53, 5 (2010), 70–77. https://doi.org/10.1145/1735223.1735243
17. Phoebe Sengers, Kirsten Boehner, Shay David, and Joseph 'Jofish' Kaye. 2005. Reflective Design. In *Proceedings of the 4th Decennial Conference on Critical Computing: Between Sense and Sensibility* (CC '05). ACM, New York, NY, USA, 49–58. https://doi.org/10.1145/1094562.1094569
18. Joseph Weizenbaum. 1966. ELIZA—A Computer Program for the Study of Natural Language Communication between Man and Machine. *Communications of the ACM* 9, 1 (1966), 36–45. https://doi.org/10.1145/365153.365168
19. John Zimmerman, Jodi Forlizzi, and Shelley Evenson. 2007. Research through Design as a Method for Interaction Design Research in HCI. In *Proceedings of the SIGCHI Conference on Human Factors in Computing Systems* (CHI '07). ACM, New York, NY, USA, 493–502. https://doi.org/10.1145/1240624.1240704
