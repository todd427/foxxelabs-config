# Mnemos — Retrieval Quality Programme

**Version:** 0.1 — initial PRD
**Date:** 6 May 2026
**Owner:** Todd McCaffrey / FoxxeLabs Limited
**Status:** Design — Phase 0 not started
**Related repo:** `todd427/mnemos`
**Implementation briefs:** `mnemos/docs/mnemos/cc_brief_cross_encoder_reranker.md` (Phases 0+1)

---

## 1. Purpose

Lift Mnemos retrieval quality on the tail queries — partial-recall, semantic-near-miss, multilingual, and queries phrased in terms the relevant document does not contain.

Hybrid retrieval (SQLite FTS5 + ChromaDB + RRF, k=60) is deployed and shipping. Headline eval scores (cyberpsych 1.0, ai_crash 0.97) are good but the eval set is narrow, hand-picked, and prone to overfit. Lived experience with the corpus suggests material headroom — particularly on conversation-history queries, fiction-corpus queries, and queries where the user knows roughly what they remember but not what the document actually says.

This document specifies the four-phase upgrade programme. Each phase is independently shippable, gated by measurement, and reversible behind an env-var flag.

---

## 2. Current state

| Component | Implementation | Notes |
|---|---|---|
| Embedder | `sentence-transformers/all-MiniLM-L6-v2` | 384 dims, 22M params, 2020-vintage, English-only |
| Vector store | ChromaDB + HNSW | ~70k chunks, ~335 MB RAM at present |
| Sparse index | SQLite FTS5 | BM25 by default, `unicode61 remove_diacritics 1` tokenizer |
| Fusion | Reciprocal Rank Fusion (k=60) | Implemented in `server/retrieval.py:hybrid_query()` |
| Reranker | None | Designed in Kanerva clean-up doc, not built |
| Query expansion | None | No HyDE, no synonym expansion, no LLM rewrite |
| Eval harness | Ad-hoc `evaluate.py` | Limited query set; no nDCG/recall/MRR computation |

The embedding space is shared with Aislinge, Radharc, Léargas, and any future Macalla training pipeline. Migrating the embedder is therefore a stack-wide decision, not a Mnemos-internal one.

---

## 3. Goal

A retrieval pipeline where:

1. Quality is measurable — eval harness produces nDCG@10, recall@10, MRR over a stable, version-controlled query set with known-good ground truth.
2. Tail-query quality is materially better than the current hybrid baseline — target is +10% nDCG@10, with stretch goal of +20% on semantic-near-miss queries specifically.
3. Multilingual queries (Irish, German) work — driven by Cló's German EPUB MVP, foghlaim, ga-say, and any Foxxe Frey translation work.
4. The pipeline degrades gracefully — every new stage has a kill switch, latency is monitored, RAM headroom on Fly is preserved.

---

## 4. Phases

### Phase 0 — Eval harness and baseline

**Deliverable:** `server/eval/` package with stable query set, ground-truth annotations, and a `run_eval.py` script that computes nDCG@10, recall@10, MRR for the current hybrid pipeline.

**Why first:** Every later phase claims a quality lift. Without a baseline, those claims are vibes. Without a stable query set, comparison across phases is incoherent.

**Scope:**
- 30–50 queries spanning cyberpsychology, AI crash, books/fiction, projects, conversation history (claude/chatgpt), and recent vs historical date-bucketed material.
- Ground truth as known-good doc IDs per query, captured in a JSON file. Bootstrapped by running queries, surfacing top-20 hits, and flagging relevant ones manually. Roughly 5 known-good per query.
- `run_eval.py` writes a Markdown report and a JSON snapshot. JSON snapshots accumulate in `server/eval/runs/` so progress over time is auditable.

**Cost:** ~half a day to build the harness; ~2–3 hours to seed ground truth.

**Acceptance:** Baseline numbers committed to repo. Re-running the harness produces deterministic results (within RRF tie-breaking noise) on the same DB snapshot.

---

### Phase 1 — Cross-encoder reranking

**Deliverable:** Third-stage reranker in `server/retrieval.py:hybrid_query()`. RRF fusion now produces a candidate set of ~30 (configurable), which a cross-encoder reranks and trims to top-K.

**Model:** `BAAI/bge-reranker-base` as default (278 MB loaded, English+limited multilingual). `BAAI/bge-reranker-v2-m3` (~2 GB loaded, full multilingual) selectable via `MNEMOS_RERANKER_MODEL` env var. Default is conservative because of recent Fly OOM events; `v2-m3` is the upgrade once RAM headroom is confirmed or `performance-4x` is in place.

**Deployment:** Lazy-loaded in-process. Adds ~280 MB to Mnemos RSS once a query hits the reranker; zero before that. Latency cost ~50–200 ms on Fly's CPU for 30 candidates. Disable flag: `MNEMOS_RERANKER_ENABLED=false` falls back to RRF-only.

**Why this is the highest-leverage move:** Bi-encoders score query and document independently in vector space. Cross-encoders score them jointly through a transformer's attention layers — they catch the semantic-near-miss cases bi-encoders systematically lose. Industry-standard lift is +10–20% nDCG@10. No corpus rebuild required. Composes cleanly with the existing hybrid pipeline.

**Cost:** One implementation brief. ~1 day of focused work including tests.

**Acceptance:** Eval harness shows ≥+10% nDCG@10 over Phase 0 baseline on the full query set, with no regression worse than -2% on any single category. RAM headroom maintained on Fly performance-2x. Latency p95 increase < 250 ms.

**Implementation brief:** `mnemos/docs/mnemos/cc_brief_cross_encoder_reranker.md`.

---

### Phase 2 — HyDE query expansion

**Deliverable:** Optional query-expansion stage at the MCP layer. For a given query, call a small LLM to generate a hypothetical document that *would* answer it, embed that document, and retrieve with it. Original query still feeds the FTS path.

**Why:** Embedding spaces are shaped by document-style text. A well-formed pseudo-answer is closer in vector space to real answer documents than the question is. Particularly helps "I sort of remember what it was about" queries where the user's literal vocabulary doesn't match the document's literal vocabulary.

**Trade-off:** Adds an LLM call to the query path — latency cost depends on which model. Haiku 4.5 keeps it under ~500 ms; Sonnet pushes it to ~1–2 s. Cost per query becomes non-zero (cents-fractional, but real). Disable flag: `MNEMOS_HYDE_ENABLED=false` (default) keeps current behaviour.

**Why optional, not default:** Most queries don't need it. Worth wiring as a per-call flag (`use_hyde=true` in `query_memory`) before flipping it on globally. Measure first.

**Cost:** ~half a day. Wraps `query_memory`, no schema changes, no re-ingest.

**Acceptance:** Eval harness shows measurable lift on the "semantic-near-miss" query category specifically, with no regression on lexical-recall queries (where HyDE can hurt by paraphrasing away the keyword that actually matters).

**Implementation brief:** TBD post-Phase-1.

---

### Phase 3 — Embedder migration (bge-m3)

**Deliverable:** Re-embed the entire Mnemos corpus with `BAAI/bge-m3` (1024 dims, multilingual including Irish and German). Rebuild HNSW. Cut over.

**Why:** all-MiniLM-L6-v2 is 2020-vintage, 384 dims, English-only. bge-m3 is a strict upgrade on retrieval quality and adds first-class multilingual coverage which the FoxxeLabs stack now needs (Cló German MVP, Glór Irish, foghlaim, ga-say, Foxxe Frey translations).

**Trade-offs and complications:**

- **Stack-wide change.** Aislinge, Radharc, Léargas all assume 384-dim space. Migration must be coordinated across all four systems, or the stack runs two embedding spaces in transition.
- **RAM footprint.** 1024 dims × float32 = 4× the bytes per vector. ~70k chunks goes from ~335 MB to ~900 MB just for embeddings. Still inside `performance-2x` (4 GB), but headroom shrinks.
- **Re-embedding cost.** A few hours on Daisy's RTX 5060. Not free, but bounded.
- **HNSW rebuild required.** Pair this with the Qdrant evaluation already on the Mnemos action-items list — Qdrant's on-disk HNSW is more RAM-efficient at scale, and you're rebuilding the index either way.
- **Aislinge bridge statements** were generated against the old embedding space. They may need re-embedding as plain documents under the new model; semantic content is unchanged but the vectors change.

**Cost:** ~2–3 days of focused work, including the cross-component coordination. Best done as a post-viva spike paired with the Qdrant evaluation.

**Acceptance:** Eval harness shows ≥+5% nDCG@10 over the Phase 1+2 baseline. Multilingual eval queries (Irish, German) succeed where the old model fails. Aislinge / Radharc / Léargas still produce coherent output post-migration.

**Implementation brief:** TBD post-viva. Likely two briefs — one for the embedder swap, one for the Qdrant evaluation.

---

## 5. Cross-component implications

The all-MiniLM-L6-v2 embedding space is currently shared by:

- **Mnemos** — primary store
- **Radharc** — UMAP/adjacency geometry built from Mnemos vectors
- **Aislinge** — bridge statements stored back into Mnemos as `source='aislinge'`
- **Léargas** — GMM cognitive field over the same vector space
- **Macalla (planned)** — Aislinge bridges as anchor layer for QLoRA training; corpus quality affects training quality directly

Phases 0, 1, and 2 leave the embedding space untouched. They are Mnemos-internal and have no cross-component effect.

Phase 3 changes the embedding space. Before kicking off Phase 3:
- Confirm Léargas Phase 1 is complete (post-viva milestone).
- Confirm Macalla has not begun training (Macalla anchors will be re-embedded with the new model).
- Decide whether Aislinge bridges need regeneration or just re-embedding (likely just re-embedding — content is stable).

---

## 6. Sequencing rationale

The order matters and is non-obvious in places.

**Phase 0 first** is non-negotiable. Without a baseline, every subsequent claim is rhetoric.

**Phase 1 before Phase 2** because the reranker is a strict-dominance move (bigger lift, no per-query cost, no LLM dependency in the retrieval path). HyDE is optional and per-query, so it benefits from being layered onto an already-reranked baseline rather than a vanilla one.

**Phase 1 before Phase 3** because reranking masks bi-encoder weaknesses. If the reranker on top of MiniLM is good enough, Phase 3 may be deferable indefinitely or scoped down. If reranking fails to close the gap, that's the signal that the embedder itself is the bottleneck and Phase 3 is justified.

**Phase 3 post-viva** because the cross-component coordination is real engineering work and the dissertation is the binding constraint until 12 June 2026. Pair it with the Qdrant evaluation that's already scoped for June–July.

---

## 7. Trade-offs at the programme level

**More layers = more failure surface.** Each new stage is a place latency can spike, RAM can leak, and bugs can hide. Mitigation: every stage has a kill switch, every stage has tests, every stage's contribution is measured.

**Mnemos RAM is finite on Fly.** Performance-2x is 4 GB. Current usage is ~335 MB embeddings + ChromaDB overhead + SBERT in memory + service runtime. Reranker adds ~280 MB lazy-loaded. bge-m3 takes embeddings to ~900 MB. Cumulative trajectory pushes toward `performance-4x` (€35/mo more) before end of programme. This is forecast in the existing Mnemos capacity projection and is not a surprise, but should be acknowledged.

**The R2 backup SPOF outranks all of this.** Mnemos is currently a single point of failure with no off-site backup. If a Fly volume incident destroys the DB before R2 backup is in place, all of this work is rebuildable but the corpus is not. The R2 cron should ship before Phase 1 starts.

---

## 8. Decisions deferred

- **ColBERT-style multi-vector retrieval.** bge-m3 produces multi-vector representations as a side effect of the same forward pass. Whether to actually use them (vs. just the dense vector) is a Phase 3+ decision. Multi-vector adds storage, query-time complexity, and only sometimes helps. Default to dense-only; revisit if Phase 3 quality is disappointing.
- **Late chunking.** Current SOTA for chunking is "embed the whole document, then split into chunk-vectors after the fact." Better quality, requires architectural change in the chunker and the embedder pipeline. Defer to a hypothetical Phase 4.
- **Learned sparse retrieval (SPLADE etc.).** Replaces FTS5 with a learned sparse model. Theoretically better than BM25; practically more ops surface. Not in this programme.
- **Per-source retrieval tuning.** Conversation chunks, fiction chunks, and document chunks have different retrieval characteristics. A future programme might tune the pipeline per-source. Out of scope here.

---

## 9. Open questions

1. Where does the eval ground truth live? Inline in the eval JSON (simple, version-controlled, readable) or in a separate side-channel (cleaner separation, harder to audit)? Recommendation: inline.
2. Does the eval harness run in CI, or only manually? CI is correct but adds Fly-deployment dependency to test runs. Recommendation: manual for v1, CI as a stretch.
3. Is the reranker ever called from outside `query_memory` (e.g., a future REST endpoint)? If yes, factor it into a callable function early. Recommendation: factor it now; cost is trivial.
4. When should the foxxelabs-config `roadmap.md` Mnemos section be updated to reference this PRD? Recommendation: when Phase 0 starts, not before — avoid roadmap entries for design-stage work.

---

## 10. Implementation pointers

| Phase | Brief | Status |
|---|---|---|
| 0 + 1 | `mnemos/docs/mnemos/cc_brief_cross_encoder_reranker.md` | Drafted |
| 2 | TBD | Not yet drafted |
| 3a (embedder) | TBD post-viva | Not yet drafted |
| 3b (Qdrant) | TBD post-viva | Not yet drafted |

---

## 11. Next actions

1. Review this PRD; sign off or request revisions.
2. Confirm reranker model default (`bge-reranker-base` vs `bge-reranker-v2-m3`).
3. Confirm Phase 0 + Phase 1 implementation brief location and contents.
4. Hold Phase 1 kickoff until R2 backup cron is committed.
5. Add one-line pointer in `roadmap.md` Mnemos section once Phase 0 starts.
