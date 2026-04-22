# <span style="color:#1e40af">Learning Companion — PRD Stub</span>

<span style="color:#7c2d12">**Status:**</span> Parked, post-viva (June 2026+)
<span style="color:#7c2d12">**Created:**</span> 2026-04-20
<span style="color:#7c2d12">**Last amended:**</span> 2026-04-20 (bidirectional interaction)
<span style="color:#7c2d12">**Name:**</span> TBD (Irish, short — candidates: *Oide* [tutor/mentor], *Treoraí* [guide], *Dalta* [pupil], *Comrádaí* [companion/comrade])

---

## <span style="color:#0f766e">One-line framing</span>

A self-directed adult learning companion architecturally identical to Macalla, with the target-of-modelling flipped from user to subject matter — and with the interaction **bidirectional**: either party may teach or learn at any time.

## <span style="color:#0f766e">Non-obvious architectural insight</span>

This is not an elearning system. It is a **Macalla sibling**. Léargas inverted: instead of modelling the user's cognitive field, model the domain's concept field and the user's trajectory through it. Every other piece of the FoxxeLabs stack applies without modification.

## <span style="color:#0f766e">Bidirectional interaction — teach and learn</span>

The companion is not a one-way pipe. Either party may occupy the teaching or learning role at any time. Three distinct reasons this matters:

1. **Protégé effect.** Learners retain more when they teach. Betty's Brain (Vanderbilt / Biswas et al.) established this for ITS; the Feynman technique is the adult-education folk version. The companion must be able to plausibly play a naive student — which, with an LLM base, is suddenly cheap.
2. **Epistemic humility as design, not failure.** A companion that says *"I don't know — teach me"* inverts the sycophancy failure mode. Instead of confirming wrong answers, it genuinely defers. Requires calibrated uncertainty per concept, not global confidence.
3. **Co-authored corpus.** The content layer is not pre-built. It grows from learner contributions, vetted and reconciled by Aislinge-style consolidation. The companion is a corpus-builder, not just a consumer. Contradictions become training signal, not bugs.

### <span style="color:#0f766e">Implications across the four models</span>

- **Domain model** — mutable from the learner side. Requires confidence-weighting on propositions; conflict detection when learner contributions disagree with canon or with prior learner contributions.
- **Learner model** — must represent not just what the learner knows, but what the learner *believes they can teach*. The two are not identical, and the gap is itself diagnostic.
- **Pedagogical model** — gains a new scheduling axis: when should the companion be novice, peer, or expert relative to the learner on a given concept? Asymmetric epistemic roles over time is a new problem on top of SM-2 / Bayesian mastery / dialogue-evidence calibration.
- **Content layer** — learner-contributed propositions flow through the same Aislinge consolidation pipeline as curriculum. Vetted by cross-reference, then promoted or quarantined.

## <span style="color:#0f766e">Four-model architecture</span>

Standard ITS taxonomy (learner / domain / pedagogical / content), mapped onto existing substrate:

| Model | Role | Substrate |
|---|---|---|
| **Learner** | Current knowledge state, misconceptions, pace, teachable claims | Léargas-inverted |
| **Domain** | Concept graph, prerequisites, dependencies — **mutable, confidence-weighted** | New build, narrow per domain |
| **Pedagogical** | Decide when to introduce / review / challenge / withdraw / **defer / be-taught** | Research layer — open |
| **Content** | RAG-grounded canon + generated scaffolding + **learner-contributed propositions** | Mnemos-shaped, per-domain corpora |

- Interaction memory = **Mnemos**
- Consolidation / spaced review / contradiction reconciliation = **Aislinge** (SM-2 is a degenerate case)
- Tutor / student voice = **Macalla-class QLoRA adapter**

## <span style="color:#0f766e">Target learner</span>

Self-directed adults — the least-served cell in the existing landscape (Khanmigo, Duolingo, corporate LMS all target different constraints). Variable self-assessment accuracy is the dominant design challenge, and is directly mitigated by the teach-to-learn loop: if the learner can articulate it well enough to teach, that itself is a mastery signal.

## <span style="color:#0f766e">Research angles (publishable)</span>

1. **Sycophancy as pedagogical failure.** LLMs confirm wrong answers to be polite; catastrophic for assessment. Mechanism is adjacent to moral disengagement (diffusion of responsibility when the model "agrees"). Direct tie to UCA dissertation finding.
2. **Strategic unhelpfulness / desirable difficulty.** LLMs are trained to reduce friction; learning requires productive struggle. RLHF against the grain — largely unsolved.
3. **Dialogue-based readiness calibration.** SM-2 by time; Bayesian ITS by mastery estimates; LLMs can plausibly schedule by *dialogue evidence*. Which wins, when, for whom — empirically unknown.
4. **Metacognitive scaffolding for adults.** Teaching learners to notice their own confusion is probably more valuable than teaching the content.
5. **Asymmetric epistemic roles over time.** When should the system teach, be taught, or collaborate as peer? No ITS literature exists because no pre-LLM system could plausibly play novice. Now tractable, and wide open.
6. **Protégé-driven corpus growth.** Does a companion whose corpus is co-authored by its learners outperform one with a fixed canon, over a horizon of months? Probable yes; nobody has measured it because nobody had the substrate.

## <span style="color:#0f766e">Tradeoffs to acknowledge up front</span>

- **Cold-start.** Adaptive systems are worse than static courses for the first several hours of interaction.
- **Depth vs coverage.** Adaptive systems drift toward breadth because generation is easy; adults typically want depth.
- **Ground truth.** Anything summative needs tools or humans. RAG alone is insufficient; LLM-generated assessments are a hallucination vector.
- **Corpus pollution.** Bidirectional corpus growth is a poisoning attack surface. Vetting layer (cross-reference, contradiction flagging, human-in-loop for high-stakes domains) is mandatory, not optional.
- **Credentialing.** Without an institution, "you learned this" has no external referent. Lever: existing ATU micro-credential pathway.

## <span style="color:#0f766e">Open decisions (for post-viva scoping)</span>

- Name
- Pilot domain — narrow. Strong candidate: something Todd is actively learning, to dogfood from day one.
- Single-user (Todd only) or multi-user from v0
- Learner-contribution vetting policy — cross-reference threshold, human-in-loop triggers, how quarantined claims surface back to the learner
- Relationship to Tionól (publication platform) and Anseo (community) — consumed by, built on top of, or independent
- Open-source or FoxxeLabs-internal

## <span style="color:#0f766e">Provenance</span>

Conversation with Claude, 2026-04-20. Full transcript ingested to Mnemos. Bidirectional interaction added same-day as an architectural amendment, not a feature addition.
