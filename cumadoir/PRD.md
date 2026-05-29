# <span style="color:#a02020">Cumadóir</span>

> *cumadóir* /ˈkʊmˠəd̪ˠoːɾʲ/ — Irish: **composer, storyteller, maker, fabricator**. From *cumadh* (composition, invention, making-up) + agent suffix *-óir* (one who does). The root holds productive ambiguity between honest making and dishonest fabrication. That is the point.

**Tagline:** *The speculative surface of the cognitive stack.*

**PRD version:** v0.1 (draft)
**Date:** 15 May 2026
**Owner:** Todd McCaffrey / FoxxeLabs
**Status:** Pre-implementation. Light scaffold acknowledged in roadmap v2; no code yet.
**Implementation repo:** `todd427/cumadoir` (not yet created)

---

## <span style="color:#a02020">1. Vision</span>

Cumadóir is the fiction-facing layer of the FoxxeLabs cognitive stack. It sits parallel to Imeall — same substrate, completely different rules.

Where Imeall maps the edges of *knowledge* (with truth conditions, source credibility, age-based decay), Cumadóir maps the edges of *possibility* (with no truth conditions, with contradiction as feature, with deliberate latitude).

The architectural insight: Todd does two things that normally live in sealed mental compartments. He reads on the moving frontier of cyberpsychology, AI, biology, robotics, cognitive science. He writes speculative fiction — Pern continuations under his own name, paranormal romance and urban fantasy under the Foxxe Frey pen name, 70+ novels published. Most authors who do both keep these silos sealed by accident of cognitive architecture. **Cumadóir's premise is that they shouldn't be.**

The bridge between knowledge-frontier and authorial-work is the raw material speculative writers need. Hard SF, biological fiction, weird-tech paranormal — they all run on this bridge. Cumadóir builds the bridge as a tool rather than leaving it to chance encounter in the writer's head.

---

## <span style="color:#a02020">2. Position in the Stack</span>

```
[Tairseach]                  [Imeall]
 inflow                       edge-map
   │                            │
   │  cumadoir_flagged          │  high-salience clusters,
   │  items                     │  contradictions, frontier
   ▼                            ▼
   ┌──────────────────────────────────┐
   │           CUMADÓIR               │
   │   speculative bridge layer       │
   │                                  │
   │   • premise generation           │
   │   • cross-connection surfacing   │
   │   • voice-anchored seeds         │
   │   • universe-bound output        │
   └──────┬───────────────────────────┘
          │
   ┌──────┴────────┐
   ▼               ▼
[Mnemos]      [Macalla]
 fiction       voice layer
 corpus        (Foxxe / McCaffrey
 lookback      adapters)
          │
          ▼
   [Author's workflow]
   (vi, Word, Cló intake)
```

Cumadóir is downstream of Imeall and Tairseach; upstream of authorial workflow. It does not write the book. It produces the *seed* from which the book starts.

---

## <span style="color:#a02020">3. The Imeall / Cumadóir Symmetry</span>

The two layers share substrate and graph operations, but invert the intent of every operation. This symmetry is the design backbone.

| Aspect | Imeall | Cumadóir |
|---|---|---|
| Domain | What you know / don't know | What you could imagine |
| Truth conditions | Apply rigorously | Suspended |
| Confidence | Decays with age | Largely irrelevant — old ideas can be reanimated |
| Contradictions | Flagged for resolution (epistemic work) | Flagged for exploitation (narrative tension) |
| Source credibility | Weights claim trust | Weights *plausibility veneer*, not story value |
| Field velocity | Constrains relevance | Mostly ignored; cross-temporal recombination is the point |
| Frontier definition | Where you stop knowing | Where you could start imagining |
| Primary output | Read this next | Write this next |
| Consumer | The researcher in Todd | The author in Todd |
| Failure mode | Confirms intuition | Generic-LLM blandness |

The same `contradicts` edge surfaces differently in each. Imeall: *"you hold contradictory positions on X — resolving this is real epistemic work."* Cumadóir: *"you hold contradictory positions on X — there's a story in the tension."* Same edge, same graph, opposite handling.

---

## <span style="color:#a02020">4. Architecture</span>

### <span style="color:#1e5a8a">Inputs</span>

- **Tairseach cumadoir-flagged items.** Per [Tairseach PRD §4](../tairseach/PRD.md), the parallel scoring path tags items as speculative-relevant (mycelial networks, distributed cognition, alternative biology, long-term futures, weird neuroscience, biotech edge cases, anything that gestures at the genuinely strange). Cumadóir consumes the flagged queue.
- **Imeall edge-clusters.** Especially: open questions with high salience, contradictions, and frontier nodes that have just acquired new-inflow landings. Imeall does the structural work; Cumadóir consumes the structure.
- **Mnemos fiction subcorpus.** Todd's existing world-building notes, character work, established canon (Pern, Foxxe Frey universes). Tagged by source for compartmentalisation (see §6).
- **Macalla voice adapters.** Once trained: separate adapters for McCaffrey-Pern register and Foxxe-Frey register. Cumadóir output uses the adapter matching the target universe.
- **User intent signal.** "I'm working on a Foxxe Frey novel" / "I'm in McCaffrey-Pern mode" / "I'm just exploring" — a current-context flag that scopes retrieval and adapter selection.

### <span style="color:#1e5a8a">Operations</span>

1. **Premise generation.** Given a Tairseach item or Imeall cluster, produce 1–5 candidate premises framed in the active universe. *"This paper on quorum sensing in mycorrhizal networks suggests a Pern story where a watchwher colony shares affective state through their burrow microbiome — what changes when one watchwher gets sick?"*

2. **Cross-connection surfacing.** Take an Imeall concept cluster (e.g. "distributed cognition") and find non-obvious resonances in the fiction corpus. *"The way you've written Glass dragons in [novel] echoes the distributed-cognition framing in [arXiv paper]; here are three premise variations that exploit the rhyme."*

3. **Contradiction-as-story.** Find pairs of contradicting claims (in Imeall) whose tension could anchor a plot or character arc. *"Your notes hold two contradictory positions on Threadfall economics — the contradiction is itself the story; here's a premise where a Holder thrives on one position and a Lord Holder fails on the other."*

4. **Frontier-imagination.** Take a high-salience open question from Imeall and ask "what if?" in a way that the question's *answer* would matter to a character. Not exposition — stakes.

5. **Universe-bound recombination.** Given two Mnemos fiction-corpus items (a character, a setting, an artefact), propose ways the active Tairseach inflow could matter to their next interaction.

6. **Voice anchoring.** Every output passes through the appropriate Macalla adapter so prose reads as Todd's, not as generic LLM. Without this step, Cumadóir collapses to "ChatGPT brainstorm" — already commodity, already mediocre.

### <span style="color:#1e5a8a">Stack</span>

- **Language:** Python 3.12 + FastAPI (matches Tairseach / Mnemos for operational familiarity)
- **Storage:** PostgreSQL on Fly.io — premise drafts, archived outputs, user feedback signals
- **Deployment:** `cumadoir.foxxelabs.ie` Fly LHR, co-located with the rest of the stack
- **LLM:** Sonnet for ideation; Macalla adapters for voice. Opus for cross-domain or contradiction work where novelty matters and budget allows.
- **Auth:** Cloudflare Zero Trust — this is single-user infrastructure, not a product

---

## <span style="color:#a02020">5. Outputs</span>

Cumadóir's outputs are *seeds*, not manuscripts. The user-facing artefacts:

### <span style="color:#1e5a8a">Premise card</span>

A short structured artefact, one page maximum:

```yaml
PremiseCard:
  id: uuid
  created_at: timestamp
  universe: enum                # mccaffrey_pern | foxxe_paranormal | foxxe_urban_fantasy | original | uncategorised
  voice_adapter: string         # macalla adapter id used to draft prose passages
  trigger:                      # what produced this premise
    - type: enum                # tairseach_item | imeall_cluster | contradiction | manual
      ref_id: uuid
  premise: string               # 1-3 sentence elevator pitch in target voice
  stakes: string                # what's at risk; what would change if the premise resolves
  characters_implied: list[string]
  novelty_claim: string         # what's the angle that distinguishes this from existing canon
  contradiction_at_core: bool   # is this a contradiction-as-story premise?
  scientific_substrate: list[uuid]  # source nodes the premise leans on
  user_verdict: enum            # unrated | keep | shelf | discard | already_done
  followups: list[uuid]         # other premises that branch from this one
```

### <span style="color:#1e5a8a">Cross-connection note</span>

Shorter, single-paragraph artefact: *"X in your fiction × Y in your reading = consider Z."* No premise required; sometimes the connection itself is the value, the premise comes later.

### <span style="color:#1e5a8a">Weekly Cumadóir digest</span>

Mirrors Imeall's weekly Frontier Report. One curated batch of premise cards and cross-connection notes, sorted by:

- universe (current active universe first)
- novelty (premises that deviate sharply from existing canon)
- scientific substrate strength (premises with real frontier-science backing rank higher than generic ideation)

User triages: keep, shelf, discard, already-done. Triage data trains the scoring layer over time.

### <span style="color:#1e5a8a">Not produced by Cumadóir</span>

Outlines, chapter drafts, full manuscripts, dialogue scenes, character bios, world-building wikis, marketing copy, blurbs. Cumadóir hands seeds to the author. The author writes the book.

---

## <span style="color:#a02020">6. Universe Compartmentalisation</span>

The single most important user-facing decision Cumadóir must respect: **pen names are not interchangeable.**

McCaffrey-Pern operates in a long-established canon with strict continuity constraints. Foxxe Frey paranormal romance has a different prose register, different thematic concerns, different reader expectations. Original work (post-Pern, post-Foxxe) has yet other constraints. A premise that fits one universe destroys another.

### <span style="color:#1e5a8a">Universe contexts</span>

| Universe | Active corpus | Voice adapter | Canon constraints |
|---|---|---|---|
| `mccaffrey_pern` | Mnemos `pern_canon` subcorpus + Anne McCaffrey published novels + Todd's continuations | `macalla-mccaffrey-pern-vN` | Heavy — Pern has decades of established lore, character lineages, technological constraints |
| `foxxe_paranormal` | Mnemos `foxxe_paranormal` subcorpus | `macalla-foxxe-paranormal-vN` | Medium — Foxxe universe has shape but more latitude |
| `foxxe_urban_fantasy` | Mnemos `foxxe_urban` subcorpus | `macalla-foxxe-urban-vN` | Medium |
| `original` | New universe, in development | base Macalla adapter | None — exploration mode |
| `uncategorised` | All fiction | base adapter | None — for exploratory ideation |

The active universe is a per-session flag. Cross-universe ideation is possible but explicit: the user must opt in. By default, output stays in the named universe.

### <span style="color:#1e5a8a">Why this matters operationally</span>

Without this compartmentalisation, Cumadóir produces tonally wrong output most of the time. A Pern premise written in Foxxe paranormal voice is bad enough that no amount of premise quality recovers it. The universe flag is therefore a hard gate, not a suggestion.

---

## <span style="color:#a02020">7. Non-Goals</span>

- <span style="color:#cc6600">**Not** a writing tool.</span> [Cló](../../../cloh/) does book formatting and production. Writing happens in vi (Todd's preference) or whatever editor; Cumadóir does not own the manuscript surface.
- <span style="color:#cc6600">**Not** an outliner.</span> Premise → outline → draft is the author's craft work. Cumadóir stops at premise.
- <span style="color:#cc6600">**Not** a story generator.</span> "Generate a 3,000-word short story" is exactly what Cumadóir refuses. The seed is the deliverable.
- <span style="color:#cc6600">**Not** collaborative.</span> Single-user infrastructure. Universe-specific voice adapters are deeply personal; sharing them across users misrepresents authorship.
- <span style="color:#cc6600">**Not** a publishing platform.</span> Stór + Cló handle distribution and production. Cumadóir is upstream of writing, not downstream.
- <span style="color:#cc6600">**Not** a marketing engine.</span> Eric and the FoxxeLabs marketing layer handle commercial framing.
- <span style="color:#cc6600">**Not** a generic AI-ideation tool.</span> Cumadóir is anchored in Todd's specific corpus, Todd's specific reading frontier, Todd's specific voice. Generic ChatGPT-style ideation produces median fiction at scale; Cumadóir produces *Todd's* fiction.

---

## <span style="color:#a02020">8. MVP Scope</span>

Cumadóir's dependencies are stacked: Tairseach must be operational, Imeall must be operational, and Macalla must be trained (at least the base adapter). All three are post-viva work.

### <span style="color:#1e5a8a">MVP gating dependencies (firm)</span>

- **Tairseach** — at least P0 connectors operational, cumadoir_flagged tagging working
- **Imeall** — at least Phase 1 MVP gate cleared
- **Macalla** — at least one trained voice adapter (base Todd; pen-name adapters can be Phase 2)

If any of these is not in place, Cumadóir MVP cannot ship. Realistic earliest: late 2027.

### <span style="color:#1e5a8a">Deliverables</span>

1. **Service skeleton** — FastAPI + PostgreSQL on Fly.io; Cloudflare ZT auth
2. **Premise card schema** (per §5) and storage
3. **Universe context manager** — per-session universe flag, adapter selection logic, canon-constraint enforcement
4. **Premise generation pipeline** — consume Tairseach cumadoir_flagged item + Imeall context → produce 1–5 premise cards in active voice
5. **Cross-connection surfacing** — given Imeall cluster, find Mnemos fiction-corpus resonances
6. **Contradiction-as-story** — pull from Imeall's contradiction list, frame as narrative tension
7. **Weekly Cumadóir digest** — mirror Imeall Frontier Report cadence
8. **Triage UI** — keep/shelf/discard/already-done, trained scoring layer

### <span style="color:#1e5a8a">MVP success criteria</span>

The honest test isn't whether the system runs — it's whether output is *used*.

1. **Use signal.** Over 12 weeks of operation, at least 3 premise cards are marked `keep` and survive 4 weeks without being downgraded to `shelf` or `discard`
2. **Conversion signal.** At least 1 premise card produces actual writing (an outline, a scene, or notes that go into a working manuscript) within the 12-week window
3. **Voice fidelity.** Blind test: Todd reads 10 premise cards (5 Cumadóir-generated, 5 hand-written by Todd in the same universe); cannot reliably distinguish in target universe by voice alone (target: ≤70% accuracy, i.e. only mildly above chance)
4. **Universe compartmentalisation.** Zero universe-leak incidents (Foxxe content surfacing in Pern session or vice versa) across 12 weeks
5. **Contradiction-as-story works.** At least 2 of the 12 weekly digests include a contradiction-derived premise marked `keep`

Criterion 3 is the load-bearing test. Without voice fidelity, Cumadóir is generic ideation with extra steps.

### <span style="color:#1e5a8a">Out of MVP</span>

- Collaborative or multi-user features
- Manuscript-level operations (outlines, chapters, scenes)
- Marketing or publication operations
- Real-time integration with vi or any editor
- Mobile interface
- Cross-author universe exploration (consuming someone else's published canon as substrate)

---

## <span style="color:#a02020">9. Phasing</span>

| Phase | Scope | Effort estimate | Gate |
|---|---|---|---|
| **0** | This PRD; integration spec with Imeall and Tairseach | 1 week | PRD reviewed; interface contracts agreed |
| **1** | Service skeleton + premise card schema + universe context manager + base-voice premise generation (no pen-name adapters yet) | 4 weeks | One Tairseach item produces a `keep` premise in `original` or `uncategorised` mode |
| **2** | Pen-name voice adapters (Macalla-McCaffrey-Pern + Macalla-Foxxe-paranormal); universe compartmentalisation enforced | 6 weeks (gated on Macalla pen-name adapters) | Voice-fidelity criterion 3 measurable; universe-leak criterion 4 measurable |
| **3** | Cross-connection surfacing + contradiction-as-story + weekly digest + triage UI | 4 weeks | MVP success criteria 1, 2, 5 measurable |
| **4** | Calibration over 12 weeks; MVP gate evaluated | 12 weeks | All 5 criteria pass |

Total time-to-MVP-gate: **~26 weeks of build + 12 weeks of calibration**, starting only once Tairseach/Imeall/Macalla dependencies are in place.

Realistic timeline: build starts mid-2027 at earliest. MVP gate cleared late 2027 or early 2028.

---

## <span style="color:#a02020">10. Trade-offs, Stated Explicitly</span>

- **Personal tool vs commodifiable product.** Cumadóir is single-user infrastructure by design. There's no Tier B institutional market here; no SaaS path. The honest framing: this is Todd's tool, built because Todd happens to be the user. If others want it, they need their own corpora, their own voice adapters, their own universe canons. The plumbing is portable; the value isn't.
- **Light scaffold vs full tool.** Cumadóir could be built as a minimal "weekly digest only" tool in ~6 weeks instead of the full ~26 weeks. Trade-off: minimal version doesn't test the voice-anchoring thesis, which is the actual differentiator. Recommendation: full MVP or none.
- **Author's voice vs LLM voice.** The Macalla adapter dependency is non-negotiable. Without it, Cumadóir is ChatGPT for brainstorming — commodity, mediocre, blocks creative work rather than enabling it. With it, output should be a useful authorial proxy. The whole project lives or dies on Macalla quality.
- **Universe compartmentalisation cost.** Maintaining separate Pern / Foxxe adapters means separate training runs, separate fine-tunes, separate validation. Expensive in compute and curation. Alternative considered (single adapter with mode prompts) rejected — mode prompts leak across registers in testing.
- **Scientific substrate vs pure imagination.** Cumadóir is *grounded* speculation. Premises without scientific substrate score lower. Trade-off: this filters out pure fantasy / mythological work that doesn't need a frontier-science hook. Acceptable for Todd's current writing portfolio (heavy SF / urban-fantasy-with-magic-system-rigour). Re-evaluate if writing direction shifts.

---

## <span style="color:#a02020">11. The Single-User Reality</span>

Cumadóir is the most clearly *one-Todd* project in the stack. Unlike Imeall (potentially many users), Tairseach (potentially many users), or Macalla (in principle one adapter per user), Cumadóir's value sits at the intersection of:

- Substantial existing fiction corpus (Todd: 70+ novels) — most users have ≤5
- Active scientific reading habit on the moving frontier — most novelists don't read primary sources
- Established pen names with distinct voices — most novelists write under one name in one register
- Personal AI infrastructure to anchor against — most novelists don't operate cognitive stacks

The honest market for Cumadóir is **one person.** Acknowledge it. Build it anyway, because the cost of building is small once the rest of the stack exists, and the value to that one user is potentially large.

Do not pretend Cumadóir is a product. It is infrastructure for a specific author.

---

## <span style="color:#a02020">12. Open Questions</span>

1. **Universe taxonomy.** What does the user-defined universe vocabulary look like long-term? The list in §6 captures current state; Todd may add or branch universes (e.g. a new pen name). Schema needs to support universe addition without breaking existing premise cards.
2. **Canon-constraint enforcement.** How does Cumadóir know it's violating Pern continuity? Naive answer: similarity check against Pern corpus + LLM canon-check. Robust answer: hand-curated canon constraint list per universe (named characters, key technologies, established geography, timeline). Hand-curation cost is real.
3. **Triage feedback loop.** keep/shelf/discard/already-done signals should train the scoring layer over time. What's the model — RL from preferences, fine-tuned scorer, embedding similarity to past `keep` items? Decide before Phase 4 calibration.
4. **Macalla adapter cadence.** Pern adapter and Foxxe adapter are two separate fine-tunes. How often retrained? On what triggers? Aligned with Macalla's hot-adapter-pair concept or separate?
5. **Cumadóir → Cló handoff.** When a premise becomes a manuscript draft, what's the path from Cumadóir premise card to a Cló-managed working document? Loose coupling (export to markdown, paste into vi) or tight (premise card UUID linked to manuscript metadata in Cló)?
6. **Mnemos fiction-corpus tagging.** Currently the Mnemos corpus is first-person-only and not formally subdivided by universe. Cumadóir needs `pern_canon`, `foxxe_paranormal`, `foxxe_urban` subcorpus tags. Schema impact on Mnemos.
7. **Already-done detection.** If a premise card matches an already-written novel (Todd's own or Anne's), Cumadóir should flag this rather than embarrass the user. Mnemos similarity check against published-works subcorpus. Real implementation question.
8. **Pure-fantasy work.** If Todd writes something without frontier-science substrate (a pure secondary-world fantasy, or a Foxxe paranormal novel with no biotech angle), does Cumadóir have anything to contribute? Probably less. Acknowledge this rather than over-claim.

Decisions 2, 6, and 7 are the load-bearing ones. The rest can resolve during Phase 1 or 2.

---

## <span style="color:#a02020">13. Why Cumadóir, Why At All</span>

A blunt summary, because the project's economics don't justify it on conventional terms:

Cumadóir is the part of the FoxxeLabs stack that exists because **Todd happens to be Todd.** A novelist who reads primary scientific literature. A scientist who writes paranormal romance. The intersection is small enough that no commercial product will ever target it — and so the only way the tool gets built is if its potential user builds it.

The cost is bounded by reuse from the rest of the stack: Tairseach already filters, Imeall already structures, Macalla already speaks in voice. Cumadóir is mostly orchestration of existing capabilities, with universe-compartmentalisation logic as the meaningful new code.

The value, if it works, is that the bridge between Todd's reading and Todd's writing becomes infrastructure rather than chance. Most novelists who could benefit from this never get it because the cost of building exceeds the value to any one of them. Todd has already paid most of the cost (Mnemos, Imeall, Tairseach, Macalla); the marginal cost of Cumadóir is small. The marginal value, in books written that wouldn't have been, is potentially substantial.

Build it. Don't sell it.

---

*End of PRD v0.1.*

*Companion docs: [Imeall PRD v0.2](../../../imeall/docs/PRD.md), [Imeall Schema v0](../../../imeall/docs/schema/SCHEMA-V0.md), [Tairseach PRD v0.1](../tairseach/PRD.md), [Macalla PRD](../macalla/PRD.md), [FoxxeLabs Roadmap v2](../roadmap.md).*
