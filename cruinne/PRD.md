# <span style="color:#2c5f8d">Cruinne — Product Requirements Document (v0.1)</span>

> Structured story-world canon + deterministic reasoning layer + production substrate.
> **Thesis: a structured canon with a deterministic reasoning layer over it — NOT a vector pile with a chat box.**
> The anti-NotebookLM. The LLM proposes, the author disposes, code computes.

**Status:** Architectural spec. **No code.** Awaiting agent pickup for MVP build.
**Owner:** Todd McCaffrey
**Name:** Cruinne (Irish: the world / cosmos / universe — the world base itself, not merely "canon")
**Spec home:** foxxelabs-config/cruinne/ (no standalone repo yet)
**Horizon:** post-viva — scope + name now, build after 12 June 2026.
**MVP corpus:** the **Cody's War** series — ingest books 1–7 (finished), drive production on the half-finished book 8.

---

## <span style="color:#2c5f8d">1. What this is</span>

A structured, queryable, *computable* model of a fictional world, built from an author's
existing books and materials, that (a) auto-extracts a series bible from a backlist,
(b) detects continuity errors deterministically, and (c) becomes the writing substrate
for the next book — grounding drafts in canon, linting continuity live, and writing new
facts back.

**What it is NOT:** a formatter (that's Cło), a cover tool (Clúdach), a RAG chatbot over a
source pile (that's the thing we're beating), or part of personal Mnemos (fiction canon is
not Todd's first-person corpus).

### <span style="color:#1f8a4c">Why NotebookLM is the poor version (the design foil)</span>

NotebookLM is RAG over an unstructured pile: no schema, no canonical truth, no temporal
model, and it is *passive* — it retrieves and summarises, it never computes or enforces.
It cannot subtract a birthdate from a story-date to get an age, cannot notice a character
is in two cities on one afternoon, and conflates "what the documents say" with "what is
true." Worldbuilding needs the opposite: a **canon layer above the prose**, a **clock**,
and **active checking**. Cruinne inverts every one of those properties.

---

## <span style="color:#2c5f8d">2. The four core layers</span>

### <span style="color:#1f8a4c">Layer 1 — Typed canon (a graph, not a pile)</span>

Entities: **Character, Place, Thing/Artifact, Organization, Event** — each with typed
attributes and typed relationships (parent/child, ally/enemy, owner/owned, located-in,
member-of, succeeds/precedes). Stored as a relational graph (entities + typed edges),
authoritative.

Every assertion is a **Fact** carrying: value, **provenance** (book / chapter / offset),
**confidence**, and **status** ∈ `{proposed, canon, contradicted, retconned}`. Nothing is
"true" because a document said it; it is true because it is `canon`. This is the load-bearing
distinction.

### <span style="color:#1f8a4c">Layer 2 — Temporal engine (the thing NotebookLM categorically cannot do)</span>

- A timeline plus a **pluggable calendar system** — essential for SF/fantasy; the world's
  calendar is not assumed Gregorian.
- **Dates, ages, durations, "days-since", "who was alive when" are DERIVED, never stored** —
  computed from canon on demand so they cannot drift.
- All arithmetic is **deterministic code. No LLM in the temporal/numeric path, ever.** An
  LLM guessing numbers is the defect we exist to prevent.

This layer is the sharpest wedge and the clearest demo.

### <span style="color:#1f8a4c">Layer 3 — Continuity detection (active, not passive)</span>

Because there is a canon and a clock, the system *checks* and emits a **continuity report**,
not a chat answer:

- timeline impossibilities (character present before birth / after death; two-places-at-once)
- attribute drift (eye colour changes between books; age that doesn't add up across years)
- prose-vs-canon divergence (manuscript asserts X, canon holds Y)

Deterministic checks (timeline, arithmetic, attribute equality) run as rules over the graph.
Only **fuzzy semantic conflict** ("this characterisation contradicts established voice") may
call an LLM — and never in the live-linting hot path.

### <span style="color:#1f8a4c">Layer 4 — Arc layer + provenance</span>

Story arcs and threads as **first-class objects spanning books**: setup→payoff,
foreshadowing, open "Chekhov's guns" ("what is promised and unpaid going into book N").
Full provenance + status on every fact gives **version control for fiction facts**, with
**retcon-impact tracking** (change a `canon` fact → see every downstream fact and arc it
touches). This rhymes with Cło's "every Title is a repo" — here, the canon is the repo.

---

## <span style="color:#2c5f8d">3. Ingestion — corpus → canon</span>

**Reuse Cło's import pipeline** (Pandoc + EPUB/Scrivener/DOCX handlers) — do not rebuild
format conversion. Then:

1. **Normalise + segment** into scenes, each tagged with provenance (book/chapter/offset).
2. **Extract** candidate entities, attributes, relationships (Claude Haiku cheap pass;
   Opus for hard cases).
3. **Cross-book entity resolution (coreference)** — "Cass" / "Cassidy" / "Ms. Quinn" /
   "the witch" → one canonical Character across the series. *This is the genuinely hard part
   and it is imperfect.*
4. **Assert as Facts** at status `proposed`, with provenance + confidence.
5. **Adjudication queue** — author confirms / merges / rejects; high-confidence facts may
   auto-confirm above a floor (audited).

<span style="color:#c44">**The adjudication loop is load-bearing.**</span> If confirming and merging
extracted facts is not fast and ergonomic, the canon rots and the product fails. The MVP must
prove this loop on real material, not the extraction recall number.

---

## <span style="color:#2c5f8d">4. Production — canon as the writing substrate</span>

This is where Cruinne stops being a reference and becomes the front of the writing line:

- **Canon-grounded drafting context** for the next book (structured retrieval, not vibes).
- **Live continuity linting while writing** (the v1 hero) — deterministic timeline/arithmetic/
  attribute checks, **no LLM in the hot path** (the Geall discipline: rules + light stats).
- **Arc-aware scaffolding** off open threads ("unpaid setups going into book N").
- **Canon write-back** — new books advance the world; events/ages/deaths flow back as
  `proposed` canon with the new book as provenance. **Branch-per-WIP, merge-to-canon on
  publication.**
- **Handoff to Cło** — finished manuscript → bundle; canon supplies the per-language name
  glossary to Cło's `TranslationSet` so series translations stay consistent automatically
  (a second translation moat).

---

## <span style="color:#2c5f8d">5. Architectural decisions log</span>

These are settled. Re-opening requires explicit re-decision, not drift.

| # | Decision | Rationale |
|---|----------|-----------|
| 1 | Canon is a typed graph, authoritative; RAG is demoted to a secondary index | The whole difference from NotebookLM. Embeddings serve "find the scene where…" and *extraction*; they are never the source of truth. |
| 2 | Every fact carries provenance + confidence + status | Drafts contradict each other. Truth is `canon`, not "a document said so." Enables retcon-impact and continuity. |
| 3 | LLM proposes, author disposes, code computes | Extraction/coreference/semantic-conflict = LLM (proposal). Confirmation = human. Dates/ages/timeline = deterministic code. No LLM ever computes a number. |
| 4 | Temporal values are derived, never stored | Stored ages drift; derived ages can't. Pluggable calendar so non-Gregorian worlds work. |
| 5 | Continuity is active (a report), not passive (a query) | The product *checks*; it doesn't wait to be asked. |
| 6 | Reuse Cło's import pipeline; do not rebuild format conversion | Pandoc + EPUB/Scrivener/DOCX already solved in Cło. |
| 7 | Separate store from personal Mnemos; reuse the hybrid-retrieval *pattern*, walled off | Fiction canon ≠ Todd's first-person corpus (Mnemos rule). Dialann precedent: use the pattern, never the personal instance. |
| 8 | Canon is versioned like a repo; branch-per-WIP, merge-on-publish | Cło's git-as-substrate decision applied to fiction facts. A WIP book is a branch on the world. |
| 9 | Federates upstream of Cło via `title_id` | Same federation pattern as Saothar↔Clúdach. Cruinne feeds glossary + series membership; Cło typesets/translates. |
| 10 | MVP is backlist-extraction-first, single-user, one series | The defensible demo is "auto-built bible + N continuity errors" on a real series. Todd is the ideal first user and owns the corpus. |

---

## <span style="color:#2c5f8d">6. Scope — MVP vs v1</span>

### <span style="color:#1f8a4c">M0 (MVP) — single-user, the Cody's War slice</span>

The thinnest slice that proves both halves end-to-end on real material.

**Acceptance criterion:** ingest **Cody's War 1–7** into a typed canon via the adjudication
loop; open the **half-finished book 8**; the system (a) surfaces at least one *genuine*
continuity finding in book 8 against established canon (timeline/age/attribute), (b) lists the
open arc threads carried into book 8, and (c) writes a new book-8 fact back as `proposed`
canon with correct provenance — **without manual graph editing**.

**MVP IN scope:**

- Entities: Character, Place, Event (Thing/Org deferred unless trivial)
- Typed attributes + a minimal relationship set (located-in, member-of, parent/child, ally/enemy)
- Fact model with provenance + confidence + status
- Temporal engine: timeline + **the Cody's War calendar**, derived ages/durations, deterministic checks
- Ingestion: Cło importer → segment → extract (Haiku + Opus) → coreference → `proposed` facts
- **Adjudication queue UI** (confirm/merge/reject) — the make-or-break surface
- Continuity report (timeline + age + attribute drift) across books 1–7 and into book 8
- Arc threads: open/unpaid setup detection (list, not yet linting)
- Canon write-back of book-8 facts as `proposed`
- Single-user (hardcoded — Todd only), Fly.io single instance, Postgres, R2

**MVP OUT of scope (defer to v1):**

- Live in-editor continuity linting (MVP runs the report on demand)
- Thing/Artifact + Organization entities beyond trivial cases
- Retcon-impact propagation UI
- Cło glossary handoff
- Multi-tenant / auth / OAuth
- Branch/merge UX (MVP = single working canon)
- Greenfield authoring from an empty canon

### <span style="color:#1f8a4c">v1 — post-MVP</span>

- **Live continuity linting while writing** (the hero; deterministic hot path)
- Full entity + relationship set; Thing/Artifact + Organization
- Retcon-impact tracking + propagation UI
- Branch-per-WIP, merge-to-canon on publication
- **Cło handoff:** canonical names + per-language forms → `TranslationSet` glossary
- Arc-aware drafting scaffolding
- Multi-tenant + Anseo OAuth (only if going to product — see Open Q1)
- Greenfield authoring (free fallout of the model)

---

## <span style="color:#2c5f8d">7. Stack</span>

- **Backend:** FastAPI (Python 3.12+) on Fly.io; PostgreSQL (entities + typed edges — relational
  edge table first; evaluate a graph extension only if traversal demands it); Cloudflare R2 for
  source assets; Redis (Fly Upstash) for the extraction job queue.
- **Extraction:** Claude Haiku (cheap first pass) + Opus (hard coreference / semantic conflict).
  **Temporal + arithmetic engine: pure deterministic Python — no model calls.**
- **Retrieval (secondary):** the Mnemos hybrid pattern (FTS + vector), a **separate walled-off
  store**, for "find the scene where…" and extraction grounding only.
- **Versioning:** libgit2/pygit2 — the canon is a repo; branch-per-WIP (v1).
- **Frontend:** Vite + React + TypeScript + Tailwind (Cło/Someday/Sionnach stack). The
  **adjudication queue** is the priority surface — build it first, make it fast.

---

## <span style="color:#2c5f8d">8. Acceptance criteria (M0)</span>

- [ ] Cody's War 1–7 ingested; canon graph populated via the adjudication loop
- [ ] Coreference resolves the principal cast to single canonical Characters across 7 books
- [ ] Temporal engine computes character ages at arbitrary story-dates on the Cody's War calendar
- [ ] Continuity report flags ≥1 *genuine* timeline/age/attribute issue (real, not synthetic)
- [ ] Half-finished book 8 opens against established canon
- [ ] Open arc threads carried into book 8 are listed
- [ ] A new book-8 fact writes back as `proposed` with correct provenance
- [ ] Adjudication queue: confirm/merge/reject works and is fast enough to clear a book's extractions in one sitting
- [ ] No step requires hand-editing the graph or patching data

---

## <span style="color:#2c5f8d">9. Open questions</span>

| # | Question | Blocker level |
|---|----------|---------------|
| 1 | Personal tool first, or product from the start? **Recommendation: personal-first** (dogfood Cody's War), multi-tenant deferred — decides auth + Eric ranking | Soft — MVP is single-user regardless |
| 2 | **Cody's War calendar** — what calendar system does the series run on? Needed to build the temporal engine for the MVP | **Hard blocker on temporal engine** |
| 3 | Coreference auto-confirm threshold — confidence floor above which facts skip the queue | Soft — start conservative, everything queued |
| 4 | Canon store — relational edge table vs graph extension (Apache AGE / pgRouting-style) | Soft — relational first per Decision 7→stack |
| 5 | Book-8 ingestion — live re-scan of the WIP draft vs snapshot-on-demand | Soft — snapshot acceptable for MVP |
| 6 | Cody's War source files — clean EPUBs / Scrivener projects dropped into `test-corpus/` before M0 | **Hard blocker on M0 start** |

---

## <span style="color:#2c5f8d">10. References to Todd's stack</span>

- **Cło / Saothar** (todd427/clo) — federated downstream; Cruinne feeds its `TranslationSet`
  glossary + series membership via `title_id`. Reuse its import pipeline.
- **Mnemos** — pattern reused (hybrid FTS+vector), **separate walled-off store**; personal
  first-person corpus is never mixed with fiction canon.
- **Geall** — precedent for the deterministic, no-LLM-in-hot-path checking discipline.
- **Dialann** — precedent for "use the Mnemos pattern, never the personal instance."
- **Rialú** (rialu.ie) — registered as a project; stores API keys.
- **Taisce** — production secrets.
- **Eric** — marketing (post-MVP only); horizon-gated long-finger until the build lands.
- **git-mcp** — schema/spec/docs commits during build.

**Conventions:** working dir `/home/Projects/cruinne`; editor `vi`; expert user, no hand-holding;
state trade-offs explicitly, lead with the correct architecture; API-dependent estimates assume
3–4× floor-latency throughput.

---

## <span style="color:#2c5f8d">11. First milestone framing</span>

Build the **adjudication queue + Fact model first** — it is the surface everything else depends
on. Then ingestion into `proposed` facts, then the temporal engine (blocked on the Cody's War
calendar, Open Q2), then the continuity report, then book-8 write-back. Resist building live
linting in M0; the on-demand report proves the value, and linting is the v1 hero once the canon
is trustworthy.
