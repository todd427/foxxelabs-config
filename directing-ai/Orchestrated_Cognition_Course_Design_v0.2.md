# <span style="color:#1B4F72">Orchestrated Cognition</span>
### <span style="color:#16A085">A Pattern Language for Working With AI Under Genuine Uncertainty</span>

<span style="color:#7F8C8D">**Course design draft v0.2 — May 2026**</span>
<span style="color:#7F8C8D">**Author:** Todd McCaffrey</span>
<span style="color:#7F8C8D">**Proposed level:** NFQ Level 9, 10 ECTS, 12-week studio</span>
<span style="color:#7F8C8D">**Cohort:** 12–16 max, single intake</span>
<span style="color:#7F8C8D">**Prerequisites:** working AI tool fluency *and* working competence in a domain. Not entry-level.</span>
<span style="color:#7F8C8D">**Supersedes:** v0.1 (May 2026). Schema-first frame abandoned; example-first frame adopted.</span>
<span style="color:#7F8C8D">**Note:** This document retains the original *Orchestrated Cognition* naming throughout. The framework name is current; the discipline / programme name has subsequently been promoted to *Directing AI* with *Orchestrated Cognition* retained as the framework. A consolidation pass renaming module/programme references within this document is outstanding work. See `directing-ai/NAMING.md`.</span>

---

## <span style="color:#1B4F72">1. Premise</span>

Most professional work that matters happens under genuine uncertainty — fuzzy goals, incomplete information, contested criteria for success, irreversible consequences, or all of these at once. AI tools are now embedded throughout this work, and they introduce a new failure mode: they produce confident, fluent output that *sounds like an answer* whether or not the situation can support one.

The skill the course teaches is the direction of AI components, human specialists, and the orchestrator's own judgement toward outcomes that the orchestrator never executes themselves, *under conditions where the goal itself is fuzzy*. This skill is older than AI — good editors, surgical attendings, senior counsel, and documentary directors have always practised it. AI changes the substrate and raises the stakes; it does not change the substance.

The course's pedagogical model is taken from Christopher Alexander: orchestrated cognition is treated as a *pattern language* — a vocabulary of recurring solutions to recurring problems, with a grammar for combining them, learned by building rather than reading, and judged by a felt quality that resists full reduction to rules. Patterns are *responses to forces*. The forces in this domain are kinds of fuzz. Patterns that resolve real fuzz endure across framework changes; patterns that encode this month's tooling rot.

Three commitments follow:

<span style="color:#C0392B">**Rejected:**</span> *"Learn this month's framework."* Frameworks are studied as instances of patterns, not as the subject.

<span style="color:#C0392B">**Rejected:**</span> *"AI replaces domain expertise."* You cannot direct what you cannot judge. Orchestration sits on top of domain literacy.

<span style="color:#C0392B">**Rejected:**</span> *"Lecture-and-quiz."* Orchestration is a practice skill. Format is studio: live projects, real stakes, master critique.

---

## <span style="color:#1B4F72">2. The Central Move: Read the Fuzz Before Responding to It</span>

The course's load-bearing claim is that fuzzy goals are not all the same kind of fuzzy, and that the appropriate orchestration response *depends on which kind of fuzz you are in*. Running the wrong playbook against the wrong fuzz makes things worse. The recognition skill — *which kind of fuzz is this?* — is therefore prior to every other skill in the course.

Six anchor cases form the typology. They are introduced in Week 1 and referenced throughout. Learners are expected to internalise them as recognition templates, the way medical students internalise classic presentations.

### <span style="color:#16A085">The Six Kinds of Fuzz</span>

<span style="color:#34495E">**1. Niamh — under-specified fuzz with discoverable structure.**</span> A policy analyst given "we need a position paper on Ireland's AI regulatory posture by Friday." The goal sharpens as she works; there is a real out-there answer she is converging on; the work is mostly synthesis under time. Reversible drafts. Days of time. Failure mode: premature sharpening, plausible mediocre output.

<span style="color:#34495E">**2. Cormac — time-pressured fuzz with irreversible action.**</span> A consultant cardiologist on a phone call about a deteriorating post-MI patient. The goal is clear; the information is incomplete; the actions cannot be undone. Minutes-to-hours. Stakes are someone else's life. Failure mode: under-decision (missed deterioration) or over-decision (radiation, antibiotics, intervention damage).

<span style="color:#34495E">**3. Saoirse — generative fuzz with no out-there answer.**</span> A documentary director with 40 hours of footage and no film yet. The goal does not exist until she creates it; the tools can help her see but cannot decide what to make. Months. Stakes are aesthetic and ethical. Failure mode: collapse to the obvious version, the film anyone could have made.

<span style="color:#34495E">**4. Aoife — adversarial fuzz with a moving counterparty.**</span> A senior counsel preparing cross-examination from 4,000 pages of disclosure against a witness who has been prepped. The goal is found in the residue: the line of questioning the other side has *not* anticipated. Weeks. Failure mode: relying on tools whose confident outputs are exactly what opposing counsel has also seen.

<span style="color:#34495E">**5. Ronan — collective fuzz with self-implicating choice.**</span> A startup founder asking "what are we actually building?" Part discovery, part choice; the answer must be collectively held by co-founders, team, investors, customers. The decision affects who Ronan is. Failure mode: outsourcing the decision to a confident-sounding system instead of having the conversation he and his co-founder need to have.

<span style="color:#34495E">**6. Méabh — personal-stakes fuzz where tools shape the question.**</span> The 47-year-old daughter of an 81-year-old father after a possible TIA, sitting at the kitchen table at half-eleven on a Sunday. Tools are not neutral: each one quietly chooses which question she is answering. Failure mode: letting the framing arrive before the thinking does.

### <span style="color:#16A085">Why this typology is load-bearing</span>

Every kind of fuzz rewards different orchestration moves and punishes the others' moves:

- Cormac running Niamh's playbook → patient deteriorates while he is still exploring
- Saoirse running Cormac's playbook → makes the obvious film
- Niamh running Aoife's playbook → produces a defensive document instead of a position
- Aoife running Ronan's playbook → negotiates the cross instead of executing it
- Ronan running Saoirse's playbook → never commits, runs out of runway
- Méabh running anyone else's playbook → answers the wrong question with confidence

Real situations are usually hybrids — a dominant fuzz with one or two secondary fuzzes layered in. A founder triangulating product-market fit is Ronan-with-Niamh-underneath. A barrister preparing under deadline is Aoife-with-Cormac. Lit-review work for a dissertation is Niamh with a slug of Saoirse. Recognition is the practical skill of identifying the dominant fuzz *and* attending to the secondary fuzzes without letting them dictate the response.

---

## <span style="color:#1B4F72">3. Through-Line Anti-Pattern: Borrowed Authority</span>

A single anti-pattern surfaces in every one of the six examples, in different costumes. The course names it explicitly and returns to it at every level: *Borrowed Authority* — letting a tool's confident, fluent output substitute for a judgement that only the orchestrator can make.

Borrowed Authority is the deepest failure mode in orchestrated cognition. It is the failure mode AI tools make easy and frictionless. It is the failure mode professional discipline historically guarded against (footnotes, peer review, second opinions, witness preparation, board minutes) and that current AI tooling actively undermines by producing outputs that *sound* authoritative without bearing the responsibility that authority is supposed to carry.

The course's discipline against Borrowed Authority is the spine of every Movement. Learners who cannot resist Borrowed Authority cannot orchestrate; they can only *be* orchestrated by their tools.

---

## <span style="color:#1B4F72">4. Learning Outcomes</span>

On successful completion of this module, a learner will be able to:

<span style="color:#34495E">**LO1.**</span> Recognise which kind of fuzz a situation primarily presents, articulate any secondary fuzzes layered in, and identify when a situation is mis-framed (the question form is wrong before any answer is sought).

<span style="color:#34495E">**LO2.**</span> Articulate a fuzzy goal precisely enough that orchestration can begin *without prematurely collapsing it into a false specification*. Hold the fuzz openly while still producing useful work.

<span style="color:#34495E">**LO3.**</span> Identify and resist Borrowed Authority — recognising the moments when a tool's confident output is shaping the orchestrator's judgement rather than informing it.

<span style="color:#34495E">**LO4.**</span> Apply patterns appropriate to the dominant fuzz, drawn from a versioned catalogue, with explicit awareness of why each pattern is load-bearing for that kind of work.

<span style="color:#34495E">**LO5.**</span> Compose primitive AI capabilities (generation, retrieval, extraction, structured output, tool use) into systems that produce judgeable outputs against fuzzy goals.

<span style="color:#34495E">**LO6.**</span> Judge the output of a system the learner did not personally execute — assessing correctness, completeness, and appropriateness against an articulated but fuzzy goal.

<span style="color:#34495E">**LO7.**</span> Critique the orchestration designs of peers using the language of fuzz types, patterns, forces, and aliveness — and accept the same critique applied to their own work.

<span style="color:#34495E">**LO8.**</span> Document a pattern in the Alexandrian template (Name / Context / Forces / Solution / Consequences / Related Patterns) of sufficient quality that another practitioner could apply it.

---

## <span style="color:#1B4F72">5. Structure</span>

Twelve weeks. Three movements of four weeks each. The movements compose: recognition → response → integration.

### <span style="color:#16A085">Movement I — Reading the Fuzz (Weeks 1–4)</span>

The recognition skill. By the end of Movement I, learners can identify which kind of fuzz they are in, articulate it precisely, and notice when their tools are shaping the question.

<span style="color:#34495E">**Week 1 — The Six.**</span> Introduction to the typology through the six anchor cases. Each case is studied in full: the situation, the tools available, the naive move, the orchestration question. Learners place their own current work against the typology and present their placement to the cohort. Critique focuses on whether the placement is honest or evasive. Reading: Alexander, *The Timeless Way of Building*, selected chapters on the structure of patterns; the six anchor cases as the course's working text.

<span style="color:#34495E">**Week 2 — Hybrids and Dominants.**</span> Real situations are rarely pure. Learners work with cases that present mixed fuzz — Niamh-with-Saoirse, Aoife-with-Cormac — and learn to identify the dominant kind without dismissing the secondaries. The skill is *reading the situation as a profile, not a single label*. Exercises: take a real situation from each learner's domain; produce a fuzz profile (one dominant, one or two secondaries); predict which of the dominant's failure modes are amplified by the secondaries.

<span style="color:#34495E">**Week 3 — Articulating the Fuzz.**</span> The skill of *naming what is unclear so it can be worked on, rather than papered over*. Learners practise articulating fuzz openly — writing it down in language precise enough that another orchestrator could engage it, without prematurely collapsing it into a specification. Exercises: rewrite three vague briefs from the cohort's own work into articulated-fuzz statements; identify what each statement now makes workable that the original did not. Pattern introduced: *Articulate the Fuzz*. Anti-pattern introduced: *Premature Sharpening*.

<span style="color:#34495E">**Week 4 — Borrowed Authority.**</span> The course's spine anti-pattern, taught explicitly. Learners deliberately use AI tools on situations of varying fuzz and observe the moments when the tool's confident output begins to shape their question, their criteria, or their commitment. The exercise is to *catch yourself* deferring to the tool when you should be judging it. Pattern introduced: *Question the Question*. Anti-patterns introduced: *Borrowed Authority*, *Framing Capture* (the framing arriving before the thinking).

<span style="color:#34495E">**Movement I assessment.**</span> A *fuzz portfolio*: four worked artefacts showing recognition (placement against the typology), articulation (a workable statement of fuzz), and detection (one documented Borrowed Authority moment the learner caught in their own work). Critique session at the end of Week 4. The portfolio is graded; the critique participation is graded separately.

### <span style="color:#16A085">Movement II — Patterns of Response (Weeks 5–8)</span>

Composition and pattern application. By the end of Movement II, learners can deploy patterns appropriate to the fuzz they have recognised, build small composed systems against fuzzy goals, and critique compositions in the cohort's shared vocabulary.

<span style="color:#34495E">**Week 5 — Patterns for Synthesis Fuzz (Niamh-shaped work).**</span> Patterns load-bearing for under-specified fuzz with discoverable structure: *Parallel Exploration Before Commitment*, *Convergence as Signal*, *Diverse Generators, Single Judge*, *Verify-Before-Cite* (the synthesis-domain version of Verify-Before-Commit). Anti-patterns: *Telephone Game*, *Plausible Mediocrity*. Exercises: build a small synthesis system that produces a defensible position from contradictory sources, with explicit citation integrity.

<span style="color:#34495E">**Week 6 — Patterns for Time-Pressured Fuzz (Cormac-shaped work).**</span> Patterns load-bearing for irreversible action under time pressure: *Bounded Sub-Orchestration*, *Reversibility-First Decomposition* (do the reversible things while the irreversible ones get more thinking), *Tripwire Verification*, *Defensible Trail*. Anti-patterns: *Analysis Paralysis*, *Confidence Without Audit*. Exercises: build a decision-support system that produces an action recommendation with an explicit reversibility map and a defensible audit trail.

<span style="color:#34495E">**Week 7 — Patterns for Generative and Adversarial Fuzz (Saoirse and Aoife).**</span> Two related families. Generative: *Tool as Lens, Not Oracle*; *Resist Premature Closure*; *Material Talks Back*. Adversarial: *Read Against the Obvious*; *Diverse Generators, Single Judge* (re-applied with adversarial flavour); *Residue is Where the Truth Lives*. Anti-patterns shared across both: *Pattern-Match to Genre* (Saoirse failure), *Confident-Output-as-Strategy* (Aoife failure). Exercises: a paired exercise where each learner builds for one fuzz and critiques another learner's build for the other.

<span style="color:#34495E">**Week 8 — Patterns for Collective and Personal-Stakes Fuzz (Ronan and Méabh).**</span> The hardest fuzzes, partly because the orchestrator is not separate from the situation. Collective: *Triangulate Across Positions*, *Negotiation as Part of the Work*. Personal-stakes: *Question the Question* (re-applied at maximum stakes), *Tools as Thinking Partners, Not Judges*. Through-line anti-pattern reinforced at maximum strength: *Borrowed Authority* in personal-stakes work as the deepest failure mode the course teaches against. Exercises: case-based critique only — learners work with documented failures (anonymised) and design what an orchestrated response should have looked like.

<span style="color:#34495E">**Movement II assessment.**</span> *Composition system + composition critique*: each learner submits a working composed system addressing a fuzzy goal from their own domain (any fuzz type), and produces formal written critiques of two peer compositions. The critique is graded as heavily as the system. Critique vocabulary is the cohort's developing shared language: fuzz types, patterns, forces, aliveness, Borrowed Authority detection.

### <span style="color:#16A085">Movement III — Studio (Weeks 9–12)</span>

The integration project. Each learner orchestrates a real, non-trivial system in their own domain, against a real problem, with a real stakeholder (not the lecturer). Master-apprentice studio model: weekly in-person reviews; cohort and lecturer critique progress.

<span style="color:#34495E">**Week 9 — Fuzz Reading and Decomposition.**</span> Learner produces a fuzz profile of their chosen problem (dominant + secondaries), an articulated-fuzz statement, and a decomposition into orchestratable components. Critique: is the fuzz read honestly? Does the decomposition respect what is genuinely fuzzy, or does it collapse fuzz into false specification?

<span style="color:#34495E">**Week 10 — First Build.**</span> Walking skeleton. End-to-end, ugly, failing in interesting ways. Critique: where does the system lie? Where does it produce confident output that masks a Borrowed Authority moment? What is the most informative failure mode currently present?

<span style="color:#34495E">**Week 11 — Second Build.**</span> Refactored toward the patterns. The learner is required to name, in writing, three patterns they applied (with reference to the catalogue), one anti-pattern they removed, and one Borrowed Authority moment they detected and disarmed. Critique: did the refactor make the system more *alive* — does it now respect the fuzz it sits in, or has it merely been tidied?

<span style="color:#34495E">**Week 12 — Final Defence.**</span> Public presentation to cohort plus invited external critics (industry, academic, domain practitioner). Forty-minute defence per learner: ten minutes presenting the orchestration, ten minutes demonstrating it on live input, twenty minutes of critique. The defence is the assessment.

---

## <span style="color:#1B4F72">6. Pedagogical Method</span>

Three principles govern delivery:

<span style="color:#34495E">**Build first, name second.**</span> Patterns and anti-patterns are introduced *after* learners have stumbled into the problem the pattern resolves. The lecturer does not tell learners about *Borrowed Authority* in Week 1; learners experience the pull of confident-sounding output throughout Movement I and the pattern is named in Week 4 as a generalisation of what they already feel.

<span style="color:#34495E">**Critique is the curriculum.**</span> A learner who cannot critique another learner's orchestration is not orchestrating, only producing. Every assessment includes a critique component. The cohort's vocabulary — fuzz types, patterns, Borrowed Authority — is the discipline's vocabulary.

<span style="color:#34495E">**Failure is graded, not punished.**</span> A walking skeleton that fails informatively in Week 10 is worth more than a polished demo that hides its failures. Learners who hide their failure modes are penalised. The course explicitly inverts the demo-day incentive structure that makes most current AI work dishonest.

---

## <span style="color:#1B4F72">7. Target Audience</span>

The course commits explicitly to one audience for Cohort 1.

<span style="color:#34495E">**Cohort 1 is for mid-career professionals with domain depth and working AI tool fluency.**</span> Analysts, researchers, project leads, senior individual contributors, professionals in regulated fields (legal, clinical, financial, policy). They have hit the ceiling of "I use ChatGPT for stuff" and need to learn to direct systems against fuzzy goals in their own domain. They are not coders; the course makes no software-engineering prerequisite. They *can* decompose problems in their domain and *cannot* yet decompose into AI-shaped primitives. They are paying — themselves or via professional development — for an accredited Level 9 credential and the orchestration discipline that turns AI tools from confident-sounding distractions into directable instruments.

The course is *not* for:
- Beginners without AI tool fluency (Beginning with AI is upstream)
- Senior software engineers seeking AI-augmented shipping discipline (Builder is the right vehicle)
- Pure-research postgrads needing methodology depth (academic CPD is the right vehicle)

Future cohorts may anchor differently — software shipping, academic research synthesis, organisational analysis. The patterns are domain-invariant. The blocks and the studio work are domain-specific.

---

## <span style="color:#1B4F72">8. Assessment</span>

| Component | Weight | Movement |
|---|---:|---|
| Fuzz Portfolio (recognition, articulation, Borrowed Authority detection) | 15% | I |
| Movement I Critique Session (oral) | 5% | I |
| Composition System (working composed orchestration against fuzzy goal) | 15% | II |
| Composition Critique (written, two peer systems) | 15% | II |
| Studio Project — Fuzz Profile and Decomposition | 5% | III |
| Studio Project — Final Defence | 25% | III |
| Studio Project — Pattern Documentation (one pattern, Alexandrian template) | 10% | III |
| Cohort Catalogue Contribution (revision or new pattern, peer-reviewed) | 10% | III |

No examinations. No quizzes. The course is assessed entirely on produced work and critique.

---

## <span style="color:#1B4F72">9. The Pattern Catalogue</span>

The course maintains a living, versioned catalogue. Cohort 1 works from a starter catalogue of approximately 25 patterns and 12 anti-patterns, organised by fuzz type and by cross-cutting concerns. The catalogue is the closest thing the course has to a textbook; graduates contribute revisions and new patterns; the catalogue is published as a living document under the course's name.

Selected starter patterns (illustrative, not exhaustive):

<span style="color:#34495E">**Cross-cutting:**</span> *Articulate the Fuzz*, *Question the Question*, *Tool as Lens, Not Oracle*, *Diverse Generators, Single Judge*, *Failure as Signal*.

<span style="color:#34495E">**Synthesis fuzz:**</span> *Parallel Exploration Before Commitment*, *Convergence as Signal*, *Verify-Before-Cite*.

<span style="color:#34495E">**Time-pressured fuzz:**</span> *Bounded Sub-Orchestration*, *Reversibility-First Decomposition*, *Tripwire Verification*, *Defensible Trail*.

<span style="color:#34495E">**Generative fuzz:**</span> *Resist Premature Closure*, *Material Talks Back*.

<span style="color:#34495E">**Adversarial fuzz:**</span> *Read Against the Obvious*, *Residue is Where the Truth Lives*.

<span style="color:#34495E">**Collective fuzz:**</span> *Triangulate Across Positions*, *Negotiation as Part of the Work*.

<span style="color:#34495E">**Personal-stakes fuzz:**</span> *Tools as Thinking Partners, Not Judges*.

Selected starter anti-patterns:

<span style="color:#C0392B">**Through-line:**</span> *Borrowed Authority*, *Framing Capture*, *Confidence Without Audit*.

<span style="color:#C0392B">**Per fuzz type:**</span> *Premature Sharpening* (synthesis), *Analysis Paralysis* (time-pressured), *Pattern-Match to Genre* (generative), *Confident-Output-as-Strategy* (adversarial), *Outsourcing the Decision* (collective), *Borrowed Authority at Maximum Stakes* (personal).

---

## <span style="color:#1B4F72">10. Risks and Open Questions</span>

<span style="color:#C0392B">**Risk: pattern catalogue ages.**</span> Some patterns will turn out to encode accidental complexity. Mitigation: catalogue is versioned; graduates contribute revisions; lecturer publishes a state-of-the-catalogue note each cohort.

<span style="color:#C0392B">**Risk: cohort heterogeneity.**</span> Mid-career professionals from different fields may struggle to critique each other's compositions. Mitigation: applications screened for some shared vocabulary; cohort capped at 16; pairing in Movement II crosses domains deliberately to stress-test the patterns' domain-invariance.

<span style="color:#C0392B">**Risk: assessment of critique is subjective.**</span> Mitigation: rubrics anchored on pattern vocabulary; second marker on critique components; critique-of-critique discussed openly in studio.

<span style="color:#C0392B">**Risk: typology hardens into checklist.**</span> The six fuzz types are a recognition tool, not categories. Learners may try to label rather than read. Mitigation: Week 2 explicitly attacks this through hybrid cases; the typology is presented as a *map*, not a *taxonomy*.

<span style="color:#C0392B">**Open question: external critics for Week 12.**</span> Identifying genuinely qualified external critics — practitioners who can critique orchestration, not framework users — is harder than it looks. Build the panel over multiple cohorts.

<span style="color:#C0392B">**Open question: anchor-case maintenance.**</span> The six anchor cases are pedagogically load-bearing and need to remain credible to practitioners in those fields. Periodic review by domain practitioners is required to keep them honest.

<span style="color:#C0392B">**Open question: relationship to existing micro-credentials.**</span> Position relative to *Beginning with AI*, *Builder*, and any planned *AI Ethics* offering. Resolved through portfolio decision, not curriculum design.

---

## <span style="color:#1B4F72">11. Provenance</span>

Three sources, named explicitly:

<span style="color:#34495E">**Christopher Alexander**</span> — *A Pattern Language* (1977), *The Timeless Way of Building* (1979), *The Nature of Order* vols. I–IV (2002–2004). Pattern-language structure, master-apprentice studio model, *quality without a name* as the criterion of design quality, the insistence that patterns are discovered rather than invented.

<span style="color:#34495E">**Donald Schön**</span> — *The Reflective Practitioner* (1983), *Educating the Reflective Practitioner* (1987). Reflection-in-action as the practitioner thinking with the work as it unfolds; the studio tradition as the natural pedagogical home for problems where the goal and the solution co-evolve.

<span style="color:#34495E">**The studio tradition**</span> — architectural studio pedagogy; surgical residency; the writers' workshop. Real work, master critique, judgement cultivated through repeated exposure to one's own and others' failures.

The course applies these traditions to a domain — orchestrated AI systems against fuzzy goals — that is currently being taught badly elsewhere. The wager is that the traditions are right and the current AI pedagogy is wrong.

---

## <span style="color:#1B4F72">12. Changelog</span>

<span style="color:#7F8C8D">**v0.2 — May 2026.**</span> Schema-first frame abandoned; example-first frame adopted. Six anchor cases (Niamh, Cormac, Saoirse, Aoife, Ronan, Méabh) introduced as the course's typological spine. Movement I restructured around recognition (reading the fuzz). Movement II restructured around patterns-as-responses-to-fuzz-types rather than generic composition. *Borrowed Authority* surfaced as the through-line anti-pattern. Audience committed: mid-career professionals with domain depth, no coding prerequisite. Assessment weightings adjusted to reflect critique and catalogue-contribution work.

<span style="color:#7F8C8D">**v0.1 — May 2026.**</span> Initial draft. Schema-first frame (subsequently rejected as inappropriate to fuzzy-knowledge work). Block library / composition grammar / studio structure established.

---

<span style="color:#7F8C8D">*Document v0.2 — May 2026. Curriculum design draft. Conversion to a formal ATU micro-credential proposal is a separate piece of work and follows the ATU quality assurance template.*</span>
