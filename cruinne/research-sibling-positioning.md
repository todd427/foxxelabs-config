# <span style="color:#2c5f8d">Cruinne Research Sibling — Positioning Note (parked)</span>

> A second application of the Cruinne core (provenance-bearing typed-fact graph +
> deterministic reasoning + active checking + adjudication queue), pointed at
> academic/nonfiction research instead of fiction canon.

**Status:** <span style="color:#c44">PARKED — positioning only, no build, no name.</span> Revisit after the MSc viva (10:30, 19 June 2026). Dissertation due 12 June 2026 is the prior gate.
**Owner:** Todd McCaffrey
**Spec home:** foxxelabs-config/cruinne/ (sibling shares Cruinne's core; not the same product)
**Source:** Eric marketing read + architectural mapping, 2026-06-09.

---

## <span style="color:#2c5f8d">1. The idea in one line</span>

Take the Cruinne core and repoint the ontology: Character/Place/Event → **Source / Author / Claim / Construct / Method / Dataset / Theory**; the temporal engine → a **deterministic statistical/numeric engine** (effect sizes, CIs, sample sizes — code computes, never the LLM); continuity detection → **contradiction + citation-integrity detection**; arc tracking → **argument / evidence-chain tracking with retcon-impact**.

---

## <span style="color:#2c5f8d">2. Market read (Eric)</span>

Real and monetisable — but the *citation-integrity* slice crowded fast in early 2026, so the wedge is no longer the check.

### <span style="color:#1f8a4c">Segments</span>

| Segment | Pain | Budget | Verdict |
|---|---|---|---|
| Grad / doctoral candidates | Acute (submission terror) | Low, one-shot | Top-of-funnel only — no ARR |
| <span style="color:#c44">Active multi-paper researchers</span> | A retraction cascades through a body of work | Real | **Primary target — the persistent-canon story fits only here** |
| Think tanks / policy / science journalists | "Claim rests on a just-retracted paper" | Institutional | High-ACV secondary; best honesty narrative |
| Knowledge-work generally | Diffuse | — | Ignore for v1 (boil-the-ocean trap) |

---

## <span style="color:#2c5f8d">3. Incumbents and the genuine gap</span>

**Discovery / mapping cluster** — Litmaps, Research Rabbit, Connected Papers, Elicit, Scite, Consensus, Semantic Scholar. Pitch: *find and map the literature.* Scite is the nearest adjacency (supportive/opposing/mentioning citation classification) — but it reports how *the world* received a paper, not whether *your draft* faithfully represents *your* source.

**Citation-integrity cluster (the new crowd)** — CiteIntegrity, Citely, CiteTrue, Manusights, GPTZero. White space closed here. The research frontier has also published the check as open benchmarks (AutoVerifier for citation distortion; sciwrite-lint, ~22 integrity checks incl. retracted-cite, claim-support).

<span style="color:#c44">**Consequence: "we verify your citations match your sources" is now table stakes, not a wedge.** Do not lead there — that sentence is on five competitors' homepages.</span>

### <span style="color:#1f8a4c">The open, defensible ground</span>

1. **Persistence / statefulness.** Every incumbent is a one-shot screen on a finished document. None hold a typed canon that lives *between* papers across a research programme.
2. **Retcon-impact cascade.** Paper X is retracted → light up every downstream claim across all in-progress manuscripts that rest on it. <span style="color:#c44">Single most defensible feature</span> — maps directly to Cruinne's retcon-impact tracking; requires the persistent graph nobody else has.
3. **Deterministic numeric engine.** Effect sizes, CIs, sample-size arithmetic by code, never the LLM — a credibility wedge with the replication-crisis-aware crowd in a market doing LLM-over-abstract.
4. **Writing substrate, not checker.** The integrity tools screen *after* you write. This is the canon you write *from*.

---

## <span style="color:#2c5f8d">4. The wedge line</span>

Lead with persistence + cascade; demote the check to table stakes done deterministically and better.

> **"Citation checkers read your finished paper once. This holds the truth of your whole research programme — and tells you when it breaks."**

Alternates:
- "The anti-NotebookLM was canon above the prose. This is evidence above the draft — and it watches the literature change."
- "Code computes the numbers. The graph remembers the evidence. You get told when the ground moves."

---

## <span style="color:#2c5f8d">5. Sibling vs mode, and sequencing</span>

- **Sibling product on the shared core — not a Cruinne mode.** The truth-model inversion (single-author canon vs contested multi-source literature) is a different ontology, not a config flag. Separate schema/domain pack, separate brand and surface. "Cruinne for researchers" confuses the author audience and undersells the research one.
- **Walling-off precedent:** same discipline as Mnemos-vs-fiction-canon — reuse the hybrid-retrieval *pattern*, separate walled-off store.
- **Sequencing — Cruinne earns the first build.** It has a captive first user (Cody's War) and far less competition than research tooling. The research sibling lands second as platform-proof: *"we built the substrate, proved it in fiction, and the same core now serves academia."* That ordering also makes the better STEP/HPSU funding story — platform leverage is what those funders underwrite.

### <span style="color:#1f8a4c">Risk to name explicitly</span>

The research market moves faster, is more crowded, lower-loyalty, and has better-funded incumbents (GPTZero has scale) than fiction tooling — and the frontier is publishing the differentiators as open benchmarks. Fiction (Cruinne) has less competition and a captive user. So if a build order must be chosen, Cruinne wins it.

---

## <span style="color:#2c5f8d">6. Next action (post-12 June)</span>

- Revisit after viva. Choose a sibling name (Irish, distinct from Cruinne).
- Decide primary segment commitment (active researchers vs think-tank/journalist).
- Draft a domain-pack schema sketch (Source/Author/Claim/Construct/Method/Dataset/Theory + epistemic-status model: evidence graph vs author-position layer).
- Re-scan the citation-integrity competitor set before any positioning copy — it is moving monthly.
