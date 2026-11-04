# Inkling — research notes

[← Back to the README](../README.md)

> A working note about what the artifact argues, what it is likely to do to the
> people who use it, and what would count as evidence. It is not a technical
> spec; the build details are in [INK.md](INK.md).

| | |
|---|---|
| **Artifact** | A one-page diary that answers in handwriting and then clears |
| **Claim** | A guarantee of disappearance changes what people are willing to write |
| **Design position** | Memory is a choice with a cost, not an invisible default |
| **Expected outcome** | More disclosure, more rereading, a page read as a listener |
| **Evidence** | No formal study; the build works as designed |

**Contents:** [The provocation](#1-the-provocation) · [What it does to the exchange](#2-what-the-artifact-does-to-the-exchange) · [Design implications](#3-design-implications) · [Expected outcomes](#4-expected-outcomes) · [A study](#5-a-study-that-could-test-it) · [What the build shows](#6-what-the-build-already-shows) · [Contributions](#7-contributions) · [Limitations](#8-limitations) · [Guardrails](#9-what-would-make-it-a-betrayal) · [References](#10-references-acm-style)

---

## 1. The provocation

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

Five questions follow: three for the constraints, one for the ritual that joins them,
and one for the absence that remains:

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
question.

---

## 2. What the artifact does to the exchange

The constraints are not features. Each one removes something from the exchange and
makes room for something else.

| Constraint | What it removes | What it makes room for |
|---|---|---|
| **It forgets** | The archive, the future reader, continuity | Candor, present tense, release |
| **It is handwritten** | Uniform input, copy-paste, speed | Hesitation, pressure, presence |
| **It is slow** | Instant output, skimming | Rereading, anticipation, attention |
| **One hand at a time** | Multitasking, interruption | Ritual, turn-taking, a shared sheet |

### The archive is removed

The page clears before the reply and again after it. There is no history panel, no
export, no search. The implication is not privacy in the compliance sense; it is that
the writer has **no future audience to perform for**. A diary written to be reread is
a performance for the future self. A diary that clears is written for the present.

The cost is real: no continuity, no building on yesterday, no record to return to. The
artifact does not argue that this cost is always worth paying. It argues that the cost
should be **visible**.

### The body is put back in

Handwriting is slower, clumsier, and more revealing than typing. Hesitation is a
wobble; feeling is pressure. The page can misread you, and that vulnerability is part
of the exchange. Typing remains as an accommodation, not as the intended mode.

The design implication is that handwriting is not a theme applied to a chat app. It
changes the unit of expression from the message to the stroke, and the tempo of
thought from **send** to **compose**.

### Time is made visible

The reply is not pasted; it is written. The wait is not a loading state with a
progress bar. It is a gap in which the reader can reread what they wrote, and then a
reply that stays about as long as it takes to read before it fades.

The design implication is that **slowness has to be earned**. If the reply is not
worth waiting for, the wait is just latency. Brevity is part of the tempo, not a
separate constraint.

### The sheet belongs to one hand

Your ink goes before Riddle writes. The reply goes before the page comes back. There
is no shared sheet, no interruption, no multitasking.

The design implication is that conversation can be a **spatial object with one
occupant**, not a scrolling feed. Turn-taking becomes the unit of interaction. The
same constraint can read as respect or as control; **Not yet** and hold-to-keep give
the reader some control over the tempo.

---

## 3. Design implications

The artifact is a small machine for making a trade-off visible. These are the
implications we think travel beyond it.

| Implication | What it means | What it asks of a designer |
|---|---|---|
| **Memory is a choice, not a default.** | A system that remembers has a model of the person and a reason to use it. A system that forgets gives that up. | Say what is kept, why, for how long, and how to remove it. Make the absence visible too. |
| **Ephemerality needs an accessible layer.** | Disappearing content excludes anyone who reads slowly, looks away, or uses a screen reader. | Keep a persistent text layer outside the visual fade. Honour reduced motion. Let the reader stop the clock. |
| **Slowness must be earned.** | Waiting is a claim on the person's time. If nothing happens in the gap, it is latency. | Write less. Make the wait legible as writing. Do not offer a skip that turns the ritual back into loading. |
| **Handwriting is a mode, not a skin.** | A handwriting font over a chat box is a costume. The hand changes what can be expressed and what can go wrong. | Design for strokes, pressure, marks, and misreading. Keep typing as an accommodation. |
| **The interface should disclose the program.** | A page that answers is read as someone. That is a social response, not a bug. | Do not hide the model behind a persona. One honest sentence is enough. |
| **Engagement is not the only relationship.** | Retention, streaks, and memory are useful metrics, but they are not the only way to matter. | Measure attention and interpretation as well as return. |

### The trade-offs the artifact accepts

| Decision | What it buys | What it costs | The tension left open |
|---|---|---|---|
| No history | Candor, release | Continuity, safety | Safety vs. continuity |
| Hand input | Embodiment, presence | Effort, exclusion | Access vs. effort |
| Slow reveal | Attention, anticipation | Patience, friction | Reflection vs. friction |
| One hand at a time | Ritual, turn-taking | Control, interruption | Intimacy vs. autonomy |
| No persona | Honesty | Warmth, attachment | Presence vs. honesty |

The right-hand columns are the design. A product would try to resolve these tensions.
A provocation keeps them visible.

The strongest implication is not that every AI should forget. It is that **the cost of
memory is usually hidden**. A memory-first product shows what it remembers and calls
that personalization; it rarely shows what the person gave up to be remembered.
Inkling makes the cost visible by building the opposite, and by letting the reader
feel what is lost as well as what is gained.

---

## 4. Expected outcomes

These are predictions, not findings. They are written as signals so that a study can
confirm or complicate them.

### What we expect the person to do

- Write longer, more specifically, and more in the first person.
- Reread their own entry while the reply is being written.
- Test the fade: reload, screenshot, wait, try to catch it.
- Use **Not yet** or hold-to-keep when the page moves too fast.
- Choose handwriting at first; whether they stay is the real test.

### What we expect the page to be called

- "It listens," not "it generates."
- "Someone wrote this," not "a font."
- "A ritual," not "a bug."
- "A provocation," not "a trick."

Each of those descriptions is a design outcome. The artifact is trying to produce a
particular reading, and the reading is part of the evidence.

### What we expect design practice to take

- A **memory audit**: what is kept, why, for whom, and for how long.
- A **vocabulary for forgetting**: absorb, dwell, clear, hold, hand back.
- A **pattern for ephemerality with accessibility**, rather than treating the two as
  opposites.
- A reason to treat **slowness as a material**, not a delay.
- A way to talk about **handwriting as a mode**, not a visual theme.

### What we expect research to take

- A counter-case to memory-first AI that is concrete enough to argue with.
- A set of hypotheses about disclosure, tempo, embodiment, ritual, and memory.
- A method: build the refusal, measure the interpretation, keep the artifact.

### What success looks like, and what would count against it

| Expected outcome | Why we expect it | If it holds | If it does not |
|---|---|---|---|
| **More disclosure** | No record lowers the imagined audience | Longer, more specific, more first-person entries; "I would not have written that otherwise" | Shorter entries; requests for history; the fade makes them anxious |
| **The wait reads as writing** | The reply is revealed at a hand's pace, and the entry is gone | Readers reread their own sentence; they describe the page as being written to | "Too slow", "loading", "why isn't it instant"; skip requests |
| **Handwriting feels embodied** | The body is in the input, and the reply carries marks | Handwriting is chosen and stays chosen; marks and drawings are noticed | Readers switch to typing immediately; "it's just text" |
| **One hand creates ritual** | The sheet has one occupant, and the turn is enforced | **Not yet** and hold-to-keep are used; readers wait for the page | Readers try to interrupt; the rule feels like a bug |
| **No memory changes what is said** | There is no future audience and no profile | Readers mention the absence; they compare it with assistants that keep everything | Readers ask for memory; the page feels unsafe without it |
| **The page is read as someone** | Handwriting and tempo cue presence, and the page does not behave like a chat window | Participants describe it as listening, or as a presence | "A chat window with a handwriting font"; "a gimmick" |

### Rival explanations

- **Novelty.** The first sessions may produce longer entries because the page is new,
  not because it forgets. The two-week design and the free-choice day help; a longer
  study would help more.
- **Task demand.** Participants may write more because they are in a study. The
  no-prompt design reduces this but does not remove it.
- **Mode novelty.** Handwriting may be chosen because it is unfamiliar, not because it
  is embodied. Persistence after the first week is the better signal.
- **The designer in the room.** The page may be called "listening" because the
  interviewer is also the designer. Independent coding and neutral interview prompts
  help.

### If the result is negative

A negative result would not make the artifact useless. If blank mode produces *less*
disclosure, the design question becomes which part of forgetting felt unsafe. The
response is not to add memory by default. It is to design a ritual around the fear —
for example, keeping one sentence the reader chooses, rather than a transcript of the
exchange.

### What would surprise us

- No one asks for memory.
- The fade feels like relief, not loss.
- People write less, not more, because the page feels too intimate.
- The wait feels like care, not slowness.
- Handwriting is rejected as too effortful, but the slow tempo is kept.
- The page is described as a game rather than a diary.

Surprise is not failure. Each of these would sharpen the argument rather than end it.

---

## 5. A study that could test it

The app already contains the conditions a study needs: hand/type and blank/keep are
toggles. A small within-subject study would be enough to learn something without
pretending to be a trial.

### Design

Twelve participants. Over two weeks: eight condition days (four conditions, two days
each, Latin-square order), one free-choice day, and one exit interview.

| Condition | Input | Page | What it isolates |
|---|---|---|---|
| A | Hand | Blank | The intended experience |
| B | Type | Blank | The hand, without the page mode |
| C | Hand | Keep | The page mode, without the hand |
| D | Type | Keep | The conventional baseline |

One entry per day, at the end of the day, about anything. No prompts are supplied:
the question is what participants choose to write, not how they respond to a prompt.
Skipping a day is data, not a failure.

### Measures

| Construct | Operationalization | Source |
|---|---|---|
| Disclosure | Characters per entry; first-person rate; comfort after writing | Device-computed counts; post-entry survey |
| Tempo | Perceived duration vs. actual; forced choice "written" or "loaded" | Survey |
| Embodiment | Hand mode chosen on the free day; marks and drawings noticed | Mode log; interview |
| Ritual | Use of **Not yet** and hold-to-keep; gap before the next entry | Device-computed counts |
| Memory | What they remember writing; whether they wanted history or export | Exit interview |
| Interpretation | Listening, generating, trick, other | Exit interview |

The first-person count is a rough proxy: Korean drops pronouns more readily than
English, and character counts differ by script. Both are compared within participants,
not across languages.

### Expected patterns

- Blank mode should produce more disclosure than keep mode. If it produces less, RQ1
  is in trouble.
- Hand mode should be chosen on the free day more often than type. If it is abandoned,
  the embodiment claim weakens.
- The wait should be described as writing more often than loading. If it is described
  as loading, the tempo claim weakens.
- **Not yet** and hold-to-keep should be used, and described as agency rather than
  obstruction. If they are described as bugs, the ritual claim weakens.

### Data and ethics

No conversation content leaves the device. A study build adds a local-only panel that
computes counts and lets the participant export a CSV; nothing is sent to a server.
The post-entry survey is local. Interviews are recorded with consent, transcribed,
and pseudonymized.

Informed consent; the provocation is disclosed; participants know the model is a
program and the researcher is the designer; no deception; the right to withdraw and
delete data; crisis resources; compensation.

A study of a page that forgets must not become the archive the page refuses to be.
The consent form should say that the researcher will not retain the entries either.

### What it can and cannot show

**Can:** whether the constraints change entry length, self-reported comfort, mode
choice, and how participants describe the page in a small sample.

**Cannot:** clinical benefit, long-term effects, causality at scale, or generalization
beyond Korean/English web users with a stylus or a finger.

---

## 6. What the build already shows

The build works as designed; the tests establish mechanics, not meaning. Five lessons
from making it are design knowledge in their own right.

- **Resemblance is not an invariant.** Five drawings were redrawn after a contact
  sheet. Four of the first thirty passed every geometry test while being the wrong
  picture: a cloud that read as a mountain range, a crescent that read as a lens, a
  teardrop that read as a gem, an arch that read as a hammock. A design can satisfy
  every formal constraint and still not mean what it intends.
- **A gate must read the state, not the picture.** The one-hand gate first read a
  render snapshot. On the second turn it described the page as it was before the
  entry landed, decided the sheet was empty, and let the reply start early. An
  interface that hides its history has to be especially careful about what it thinks
  is true now.
- **Disappearing interfaces need their own memory of order.** A handwriting reading
  could arrive after the turn had faded. The fix was to remember the turn by id, not
  by what was on the page. Ephemerality does not remove the need for memory; it moves
  the memory out of the content and into the interaction.
- **The first mark carries the metaphor.** The first reveal had a leading mark; it
  read as a cursor. Removing it made the writing feel like a pen. The smallest mark
  decides whether the page is a text field or a hand.
- **A privacy promise includes provider defaults.** The model provider stores
  responses by default unless the request opts out. A promise that the page keeps
  nothing has to include the parts of the system the reader cannot see.

---

## 7. Contributions

| For | Contribution |
|---|---|
| **Design practice** | A constraint-first method: build the refusal, then look at what it does. |
| **HCI** | Ephemerality and accessibility as a paired pattern, not opposites. |
| **AI product design** | Memory as a visible choice with costs; the provider's retention default as part of the design. |
| **Interface design** | A handwriting mode with its own tempo, marks, and failure modes, not a font skin. |
| **Readers** | A small room with no record. |

### A vocabulary for designing forgetting

| Term | What it names |
|---|---|
| **absorb** | The entry sinks at hand-over, before the reply begins. |
| **dwell** | The reply stays for a reading estimate, not a fixed timer. |
| **clear** | The page returns empty; there is no history to reopen. |
| **hold** | Press and hold stops the clock, so reading is not a race. |
| **hand back** | The composer returns only after the reply has gone. |

Each term names a moment that can be observed, removed, or varied. That is what makes
the vocabulary useful to a study rather than only to a critique.

---

## 8. Limitations

1. **No formal study.** The central hypothesis is untested; the autoethnography is one
   designer.
2. **The reply is typographic, not synthesized.** It is a handwriting face revealed
   per grapheme. Marks and drawings are stroke-drawn, but the letters are not. The
   embodiment claim is weaker than the interface suggests.
3. **The reading is model-generated.** A handwritten entry can be misread, and an
   illegible entry may reach the model as an image with no reliable transcript. The
   page's understanding is not verified.
4. **Script and language coverage.** Korean and English only; four faces; sixty
   drawings. The diary form is culturally specific.
5. **Pressure is device-dependent.** Pen hardware reports pressure; finger and mouse
   infer it. The pressure in the stroke is partly simulated.
6. **Disappearance is not a security guarantee.** The page can be screenshotted,
   recorded, or captured by an extension. It prevents the app from keeping a record;
   it cannot prevent the person or the device from doing so.
7. **Provider retention is separate.** Opting out of application-state retention does
   not opt out of the provider's abuse-monitoring retention. The privacy claim is
   scoped to this server.
8. **The model is prompt-dependent.** Riddle can fail to listen, give advice, or
   perform a persona. The prompt is a design constraint, not a guarantee.
9. **Accessibility is designed, not validated.** The full text reaches an `aria-live`
   region, reduced motion is honored, and hold-to-keep works. But no study with
   disabled users has been run, and handwriting input itself may exclude some users;
   typing is the fallback.
10. **Novelty and designer bias.** A first encounter may be read as a trick; a
    two-week study may be read as a habit. The designer is also the developer, and the
    artifact encodes his values.
11. **The reading can overshoot.** A provocation against memory can be read as a claim
    that forgetting is always good. The artifact argues for designability, not for a
    universal rule.

---

## 9. What would make it a betrayal

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

## 10. References (ACM style)

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
