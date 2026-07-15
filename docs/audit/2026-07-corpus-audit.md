# FoxxeLabs Full-Corpus Audit — July 2026

**Date started:** 2026-07-15
**Scope:** the whole `todd427` GitHub corpus + Rialú registry + deployed MCP stack
**Brief:** `CC-brief-corpus-audit.md` (repo root)
**Method discipline:** every count enumerated, not eyeballed; every status claim to be checked against `git_log`/`git_read_file`; unverifiable claims marked `UNVERIFIED`.

**Status:** Complete (Tasks 1–4).

---

## Task 1 — Reconcile the three counts

### 1.1 The three counts

| Source | Count | Method | Verdict |
|---|---|---|---|
| GitHub | **129** | `git_list_remote_repos(include_archived=true)` — enumerated | Matches brief. 0 archived; all 129 are live repos. |
| Rialú registry (tool) | **76** | `list_projects` — enumerated from returned JSON (`.result | length`) | **Matches the UI.** No under-report observed this session. |
| Rialú UI (`rialu.ie`) | 76 | Per brief (dashboard render) | Agrees with tool. |

The brief's headline discrepancy (UI 76 vs tool ~57) **did not reproduce** — the tool returned all 76 this session.

### 1.2 Root cause of the earlier `list_projects` under-report

**Not a server-side bug.** The tool's query (`todd427/rialu` → `mcp_server.py`, `list_projects`) is:

```sql
SELECT id, name, slug, phase, status, platform, repo_url, site_url, machine, notes, updated_at
FROM projects ORDER BY updated_at DESC
```

No `LIMIT`, no `WHERE`, no pagination — it returns **every** row. Verified: it returned all 76.

The earlier "~57" is **client-side truncation of an oversized response**. The payload is **101,606 characters** — the free-text `notes` column is returned in full for all 76 projects. A response that large can be cut off mid-stream in a chat render; counting the truncated render yields a number like ~57. This is precisely the "never trust a rendered view as the source" failure the brief was written to prevent. Corroboration: this audit's own harness could not inline the result either — it exceeded the token limit and had to be spilled to a file — independently confirming the size-truncation mechanism.

**Rialú ticket (to file — root cause + fix):**
> `list_projects` returns full `notes` free-text for all rows, producing a ~100 KB payload that truncates in downstream clients and silently under-reports the project count (observed 76 → ~57). No query bug — the SQL has no LIMIT/filter. **Fix:** return a lean projection from `list_projects` (drop or clip `notes`; keep id/name/slug/status/phase/repo_url/site_url) and rely on the existing `get_project` for detail; optionally add `limit`/`offset`. Every programmatic consumer (Eric, future CC runs, this audit) currently risks a truncated, wrong count.

### 1.3 Registry composition (the 76)

- **73** entries carry a `repo_url` → **67 unique repos**. Six collapse because two monorepos are shared:
  - `anseo` ← **Stór, Litir, Anseo**
  - `foxxelabs-config` ← **Coinne, Dialann, Geall, Tairseach, foxxelabs-config**
- **3** entries have **no `repo_url`**: UCA Dissertation, Foxxe Frey backlist, AfterWords.

### 1.4 Three-way diff

| Set | Count | Meaning |
|---|---|---|
| Intersection | **66** | Registered *and* live on GitHub |
| Rialú ∖ GitHub | **1** | Registry `repo_url` with no live GitHub repo → **Legion** (`todd427/legion` absent; consistent with `projects.json` `repo: None`) |
| GitHub ∖ Rialú (ghosts) | **63** | Repo exists on GitHub, not linked from any registry entry |

`66 intersection + 1 Rialú-only = 67 unique registry repos.` `129 GitHub − 66 intersection = 63 ghosts.` Reconciled.

**63 ghosts, split by last push:**

- **18 pushed in 2026** — real-work candidates, Task 2 priority:
  `aibi`, `faidh`, `Taith-`, `uire-site` (Jul) · `autotest`, `doc`, `foxxelabs-step`, `stargame`, `versus` (Jun) · `dramatis`, `foxxe-covers`, `foxxelabs`, `glor-studio`, `sionach`, `tionol` (Mar) · `anseo.start`, `foxxeeye`, `personality-quiz` (Jan)
- **45 pushed in 2025** — pre-reboot scratch layer, historical, almost certainly leave:
  `slam`, `cybersafe`, `emotions-labs`, `firstai`, `twilio`, `utils`, `viewer`, `chatter`, `spidey`, `toddric_v2`, `training`, `amc_bundles`, `toddric-rag`, `fabams`, `toddric-extract`, `zephram`, `ages-stages-trainer`, `app_qotd`, `awords`, `bookmarks`, `copy_images_app`, `DJ_book`, `educa`, `epub`, `lander`, `mistral_training`, `myshop`, `pics`, `PQuiz-front`, `question-editor-todd`, `shore`, `surveyhub`, `weread`, `weread_utils`, `lunarLander`, `MeU`, `meu_writer`, `min`, `moderationproject`, `mysite`, `openai_moderation_demo`, `pdfer`, `PQuiz-back`, `programmer-questionnaire`, `testy`

### 1.5 Data-quality flags surfaced (for Task 2)

- **`ucahub` is a false ghost** — the **UCA Dissertation** registry entry is missing its `repo_url`; the repo is registered, just unlinked. Backfill the link, don't classify as ghost.
- **`awords`** likely maps to **AfterWords** (also no `repo_url`) — verify in Task 2 (note: `awords` last pushed 2025-06, so it may instead be dead scratch).
- **`Foxxe Frey backlist`** (status `live`, no repo) — a non-repo registry entry; confirm whether it should carry a repo link at all.

### 1.6 Task 1 acceptance

- ✅ Registry count matches 76.
- ✅ Tool under-report explained with a named cause (client-side truncation of a no-LIMIT, notes-heavy ~100 KB payload — not a query bug).
- ✅ All 129 repos classified at the coarse level (66 registered-live / 63 ghost = 18 2026-candidate + 45 2025-scratch).
- ✅ Three-way diff built and arithmetically reconciled.

---

## Task 2 — Resolve artifacts and ghosts

### 2.1 The í-fada slug artifact (`Taith-`)

**Confirmed ARTIFACT.** `todd427/Taith-` has zero commits and an empty tree (`git_log` → "does not have any commits yet"; `git_list_files` → empty). It is a creation artifact of **Taithí**: the trailing accented `í` was stripped to `-` at repo creation instead of folded to `i`. The live project is `todd427/taithi` (active, pushed 2026-07-15). **Recommend deletion** — it holds nothing unique.

**Generalised across all 129 repos: `Taith-` is the only í-fada casualty.** Every other accented project folded cleanly to ASCII: Léargas→`leargas`, Céim→`ceim`, Comhordú→`comhordu`, Fiosrú→`fiosru`, Úire→`uire`, Áit→`ait`, Mothú→`mothu`, Gléas→`gleas`, Féith→`feith`, Cló→`clo`. No other trailing-dash or mangled slug exists. (A separate, non-accent mangle also surfaced: `sionach`, an empty misspelling of registered `sionnach` — see 2.3.)

**Slug-convention recommendation (stop recurrence):** ASCII-**fold** diacritics at creation (í→i), never strip-to-dash; store the diacritic display name in Rialú's `name` field while the repo slug stays folded. The lone failure was a trailing í → `-`; folding rather than stripping eliminates the class.

### 2.2 The 18 2026-pushed ghosts — classified

Each verified by reading README + `git_log` (read-only). Tally: **9 BACKFILL · 3 SCRATCH · 4 ARTIFACT · 2 SUPERSEDED**.

| Repo | Class | Activity | What it is | Action |
|---|---|---|---|---|
| `aibi` | BACKFILL | 2026-07-15, very active | Aibí — agentic generator over E-DATA's SMEDRA instrument; SME digital-readiness report + roadmap; swappable LLM backends | Register; cross-link Cúltaca + Gléas |
| `versus` | BACKFILL | 2026-06-08, shipped | Versus — static side-by-side AI-comparison micro-site (versus.foxxelabs.ie); sibling of Duel | Register; cross-link Duel |
| `foxxelabs` | BACKFILL | 2026-03-22, active | Static foxxelabs.ie marketing/landing site — **distinct** from `foxxelabs-astro` (news system) and `foxxelabs-config` | Register; do not conflate the 3 siblings |
| `personality-quiz` | BACKFILL | 2026-01-02, real (tests, PRs) | Flask "Feynman-Drummelburg" quiz; the quiz embedded in foxxelabs.ie | Register (link to `foxxelabs`); clean stray merge-conflict markers in README |
| `foxxeeye` | BACKFILL | 2026-01-21, real | Foxxeeye "Cybersafe Inspector" — FastAPI browser-fingerprinting demo for cyberpsychology workshops | Register; check overlap with `cybersafer` |
| `foxxe-covers` | BACKFILL | 2026-03-27, active | Work-repo fixing expired KDP cover URLs for the Foxxe Frey catalogue | Register as subsidiary of `foxxe-frey-backlist` |
| `foxxelabs-step` | BACKFILL ⚠️ | 2026-06-25, private | Private working repo for the STEP/HPSU Enterprise Ireland application (proposal, financials, R&D-credit) | Register **flagged private/sensitive**; do not surface publicly |
| `uire-site` | BACKFILL (satellite) | 2026-07-15, nightly | Generated deploy/output for uire.foxxelabs.ie — nightly frontier reports pushed from `uire`, served by CF Pages | Register as **satellite of `uire`**, not standalone (no own source) |
| `tionol` | BACKFILL (placeholder) | 2026-03-19, 1 commit | Reserved placeholder for tionol.irish — planned AI long-form publication platform (Anseo ecosystem) | Add placeholder row; genuinely absent from registry |
| `faidh` | SCRATCH | 2026-07-08, shelved | fáidh — retrospective LLM-claim calibration ledger; v0 marked a shelved negative result | Leave; depends on `tomhas` if deps are tracked |
| `autotest` | SCRATCH | 2026-06-30 | TDD scaffold + a safety-bypass classifier tripwire | Leave; no project role |
| `stargame` | SCRATCH | 2026-06-04, PRD only | v0.1 PRD for a browser space-empire game ("front door"); name is an explicit placeholder, no code | Leave parked; will be re-created under real name if built |
| `Taith-` | ARTIFACT | never (empty) | í-fada slug artifact of Taithí | **Delete** (live = `taithi`) |
| `doc` | ARTIFACT | never (empty) | Empty generic "doc" stub | **Delete** |
| `dramatis` | ARTIFACT | never (empty) | Empty repo, never initialized | **Delete** |
| `sionach` | ARTIFACT | never (empty) | Empty misspelling of `sionnach` ("fox") | **Delete** (naming-mangle casualty) |
| `glor-studio` | SUPERSEDED | 2026-03-27 | Browser React formant-synth voice-creator; last commit is a PRD folding it into a service | Fold into registered `glór`; **verify `glór` before deleting** (studio may still be live front-end) |
| `anseo.start` | SUPERSEDED | 2026-01-19 | One-file placeholder landing for anseo.irish | Superseded by deployed `anseo`; delete or leave |

### 2.3 Cross-repo notes

- **Naming-mangle casualties (all empty, safe deletes):** `Taith-` (í-fada of Taithí), `sionach` (misspelling of sionnach), plus empty stubs `doc` and `dramatis`.
- **Three `foxxelabs*` siblings are distinct, not duplicates:** `foxxelabs` (static landing site) · `foxxelabs-astro` (registered/deployed AI-security news system) · `foxxelabs-config` (this registry repo). Branding-deep similarity only.
- **`personality-quiz` ↔ `foxxelabs`:** the quiz is the backend/embed for the landing site's quiz feature — register linked.
- **`glor-studio` → `glór`:** studio's final commit proposes migrating the browser prototype into the `glór` service. Verify `glór` repo contents before deleting the studio.
- **`uire-site` → `uire`:** pure machine-generated deploy output; a satellite, not an independent project.
- **`aibi`/`versus` cross-links:** `aibi` → Cúltaca + Gléas; `versus` → Duel. Backfill should link these.

### 2.4 Disposition summary (report only — Todd disposes; nothing deleted this pass)

- **Delete (4 empty artifacts):** `Taith-`, `doc`, `dramatis`, `sionach`.
- **Backfill registry entries (9):** `aibi`, `versus`, `foxxelabs`, `personality-quiz`, `foxxeeye`, `foxxe-covers`, `foxxelabs-step` (private), `uire-site` (satellite of `uire`), `tionol` (placeholder).
- **Fix registry links (data-quality, from Task 1.5):** UCA Dissertation → `ucahub`; verify AfterWords ↔ `awords`; Foxxe Frey backlist repo link.
- **Superseded (2):** `glor-studio` (→ `glór`, verify first), `anseo.start` (→ `anseo`).
- **Leave as scratch (3):** `faidh`, `autotest`, `stargame`.
- **45 2025-pushed ghosts:** pre-reboot scratch layer — leave; not itemised here (listed in 1.4).

### 2.5 Task 2 acceptance

- ✅ `Taith-` confirmed empty artifact; deletion recommended (reported, not executed).
- ✅ í-fada class generalised — sole casualty identified; slug convention recommended.
- ✅ All 18 2026-ghosts classified (README + `git_log` verified); dispositions listed.
- ✅ 2025 scratch layer distinguished from 2026-active (Task 1.4).

---

## Task 3 — Verify the load-bearing claims (git-true)

Each repo verified against committed code / eval artifacts — **not** STATE/status prose. Two of the brief's own premises were overturned (Taithí's numbers, Gléas's build state); flagged below.

### 3.1 `taithi` — ⚠️ THE headline verification: numbers UNVERIFIED

The eval **engineering** is real, committed, and unusually honest. The eval **results** are not committed at all. `runs/` (all `--out` targets) and `data/` (the benchmark) are **both gitignored**, so every headline number exists only as author-typed prose in README/DESIGN/docstrings.

| Claim | Evidence | Verdict |
|---|---|---|
| M1 reliability 98 / generalization 97 / locality 82.8 / composite 92.1 (50 CounterFact, frozen Qwen2.5-3B) | `eval/harness.py` + `metrics.py` compute these correctly (composite = harmonic_mean(98,97,82.8)=92.05, self-consistent); no committed run — `runs/` gitignored | **UNVERIFIED** (method committed, result not) |
| Beats RAG 77.2 / in-context oracle 69.4 | `eval/baselines.py` — genuine `RAGSystem` (BAAI/bge-m3, swept threshold) + oracle `InContextSystem`; numbers are README table only | **UNVERIFIED** (baselines real, numbers unbacked) |
| Prompting caps at 78% reliability | `baselines.py InContextSystem` is the mechanism; no committed run output | **UNVERIFIED** (architecturally load-bearing, unbacked) |
| Continual BWT = 0.000, 8×25 | `scripts/continual.py` computes BWT correctly → writes `runs/continual.json` (gitignored) | **UNVERIFIED** |
| M2 swap==replay, adapter retired | Commits `8247281`/`6a0d29e`/`e2f40f6`, `scripts/swap.py` | **VERIFIED (state)**; swap numbers UNVERIFIED |
| M3 consolidation BLOCKED | `scripts/consolidate_swap.py` + commit narrative ("the fold is a dead end") | **VERIFIED (state)** |
| M4 salience 100%prec/50%rec, n=26 INDICATIVE | Fixture committed: `eval/benchmarks/utterances.py` = exactly 26 items; INDICATIVE flag in-repo | Fixture + flag **VERIFIED**; result **UNVERIFIED** |
| M5 logit-bias serve | `taithi/serve.py` + `cli.py cmd_serve` + commit `92c6887` | **VERIFIED (implemented)** |
| Ceilings: multi-hop ~33% / negation ~25% / subject-absent ~69% fail | `scripts/scope_test.py` docstring numbers; failures argued mechanically certain but figures are prose over a 2-item fixture | Limitation **VERIFIED as mechanism**; figures **UNVERIFIED** |

**Harness runnability: RUNNABLE-WITH-CAVEATS.** Real entrypoint (`taithi eval --config configs/m0.yaml --limit 50`), but a clean checkout cannot reproduce: CounterFact data is `curl`-fetched not committed; **zsRE is prose-only ("500/500"); MQuAKE is absent entirely** (multi-hop = 2-item hardcoded fixture, not MQuAKE); needs ~6GB Qwen2.5-3B weights + bge-m3 + GPU; no run outputs archived.

**Bottom line:** trust Taithí's *architecture and its self-stated limits*; treat every specific benchmark figure — including the "which benchmarks we beat" table Task 4 depends on — as **UNVERIFIED pending committed eval outputs**. Last commit 2026-07-15 (active).

### 3.2 `tuiscint` — all claims VERIFIED

| Claim | Evidence | Verdict |
|---|---|---|
| Gold eval locked at 959 | `data/grounded/eval_manifest.json` total 959 (300+200+150+209+100), `eval.jsonl` committed, decontam manifest says "LOCKED, 959" | **VERIFIED** |
| Decontam 38.052B tokens / 72,580 steps | `decontam_manifest.json` total_tokens 38,052,396,477 + steps 72,580; matches `configs/tuiscint_500m.yaml` exactly | **VERIFIED** |
| Data programme complete | Full SFT/eval/decontam manifests + data files committed, leakage_after all-zero | **VERIFIED** |
| From-scratch run NOT launched (awaiting 5090) | No `checkpoints/`/`runs/`/weights anywhere in tree; train code present, no output | **VERIFIED** |

Last commit 2026-07-15 (active). Strong: claims backed by committed artifacts, not prose.

### 3.3 `aigne` — VERIFIED PRD-only

Two files only (`PRD.md`, `tenstorrent-probe.md`), **zero code** — VERIFIED. Interface contract, from the committed PRD: an **OpenAI-compatible `/v1/chat/completions` gateway** that owns exactly three things — (1) routing (cheapest-sufficient across tiers Granite→Nemotron→Frontier, escalate on demand), (2) tokens-per-joule telemetry as a hard gate (joules-per-token/task from `nvidia-smi`), (3) power policy (wake/sleep of the burst core). Fallback contract: clients must degrade-function when Aigne is unreachable. Static since 2026-06-20. **This is the unbuilt spine** — confirmed no code exists.

### 3.4 `mnemos` — VERIFIED (with one stale docstring)

| Claim | Evidence | Verdict |
|---|---|---|
| Retrieval = Qdrant + FTS5 + RRF | `server/vectorstore.py QdrantStore`; `retrieval.py _rrf_score` (`_RRF_K=60`) + FTS5; commits `8bdbf9b`/`6ce9e78` "decommission Chroma (Qdrant sole store)" | **VERIFIED** |
| Qdrant, not Chroma (code truth) | Chroma is **dead code** — `dense_query()` retained only for `store=None` unit tests; production always passes a Qdrant store. (One stale module docstring still names "ChromaDB" — cosmetic) | **VERIFIED (Qdrant)** |
| Frozen baseline nDCG@10 = 0.547 | In `cc_brief_phase3..._results.md` as the acceptance gate, but **no run file in `server/eval/runs/` reproduces 0.547** — committed baselines there read 0.590–0.596 (pre-corrected GT) and 0.525 (corrected GT) | **VERIFIED in doc; UNVERIFIED as run artifact** |
| Phase 3 embedder brief (2026-07-10) actioned | Fully executed → **REJECTED**: commit `a550367` "bge-m3 FAILS acceptance" (−0.19 nDCG, ~19× RAM); committed candidate/control run artifacts; **MiniLM-L6-v2 retained**, no swap implemented | **VERIFIED (actioned → rejected)** |

Last commit 2026-07-15 (active).

### 3.5 `gleas` — ⚠️ brief premise overturned: build is NOT "not started"

| Claim | Evidence | Verdict |
|---|---|---|
| PRD + Phase-1 brief committed | `docs/PRD.md`, `notes/CC-BRIEF-001.md` | **VERIFIED** |
| Build NOT started | **CONTRADICTED** — full phased impl present: `serve.py` (real vLLM multi-LoRA launcher), `agent.py`/`router.py`/`cot.py`/`rag.py`/`api.py` + `evals/`. Log: Phase 1 "GO", Phase 2, Phase 3 "suite PASS", router 22/22, bench TTFT ~65ms/~57 tok/s, `3549e1b` "Phase 4: scope deploy" | **CONTRADICTED** |
| Blackwell sm_120 + 4-bit long-pole risk documented | `PRD.md §11` + `CC-BRIEF-001` verbatim; **and CLEARED** per `notes/DECISIONS.md` 2026-06-23 "vLLM serves Qwen3-8B 4-bit on Iris (sm_120)" | **VERIFIED (+ risk cleared)** |

**Correction for Task 4:** Gléas is not a PRD-stage project — Phases 1–3 are complete, the serving long-pole is cleared, Phase 4 (deploy) is scoped. It is a **built-but-not-yet-composed serving faculty**, not a future build. Last commit 2026-06-26.

### 3.6 `macalla` — VERIFIED (one brief-framing correction)

QLoRA voice/dialogue layer on **Qwen3-8B** (`configs/qwen3-8b-sft-prototype-v4.yaml`: base Qwen3-8B, 4-bit nf4, qlora, r32/α64) — **VERIFIED**. v1 trained + promoted + published to HF `toddie314/macalla-v1` (`DECISIONS.md` 2026-06-21); v2 trained, **not** promoted (alternate register only) — **VERIFIED**. **Correction:** the in-repo boundary marker is Macalla ↔ **Tuiscint** (documents the 2026-06-21 conflation that had to be unwound), *not* Macalla↔Taithí — the string "Taithí" appears nowhere in the repo. So "not a Taithí backbone" is true but the documented separation is against Tuiscint. Last commit 2026-06-26.

### 3.7 `mothu` — VERIFIED source, not gate

**SOURCE, not gate — confirmed in code.** Produces VADER (`inject/incremental.py`), NRC/Plutchik, and an HF/Ekman pass (`analysis/score_hf.py`); baseline anomaly = 1.5σ deviation scoring, not admission. **No `admit()`, no `should_consolidate()`, no consolidation decision anywhere.** The only decision fn is `build_prompt()` (live de-escalation prompt-prepend). **No stale "gate" framing survives** — README/CLAUDE.md/CC-BRIEF-001 consistently say "salience signal / affective source." Corrected prose matches code. Last commit 2026-06-23.

### 3.8 Cognitive-stack one-liners (git-true)

- **`leargas`** (2026-07-12, most-recent in set): affective-distinctiveness manifold + salience — **PoC + deployed service** (`poc/affect_salience/` eval harness, `server/server.py` + fly.toml).
- **`aislinge`** (2026-06-22): dream/REM belief-consolidation (Phi-3.5) — **operational pipeline** (`rem_pass.py`, `nightly_consolidation.sh`, tests), runnable not spec.
- **`colainn`** (2026-06-23): biometric/physio store — **deployed service** (`colainn-foxxelabs.fly.dev`, Withings ingest, tests); consumes Mothú/George.
- **`george`** (2026-06-18): Legion/George agent loop — **deployed service** (`app/loop.py`, integrations to mnemos/mothu/colainn/lorg, auth, tests).

### 3.9 Task 3 acceptance

- ✅ Every load-bearing claim checked against committed code, verdict recorded (VERIFIED / UNVERIFIED / CONTRADICTED).
- ⚠️ **Taithí's benchmark numbers are all UNVERIFIED** (no committed run outputs; data + runs gitignored) — the single most important finding; it gates Task 4's benchmark claims.
- ⚠️ **Gléas "build-not-started" CONTRADICTED** — Phases 1–3 complete, long-pole cleared; reclassify as built-but-not-composed.
- ✅ Mothú confirmed source-not-gate in code; Macalla boundary correction noted (Tuiscint, not Taithí).

---

## Task 4 — The analysis

Grounded strictly in Tasks 1–3. **Framing constraint honoured:** this is an efficiency/composition thesis ("smarter, not more"). Where a conclusion would point at "train/hold a bigger model," it is flagged as in tension with that direction.

### 4.1 What runs today (verified-live surface)

Genuinely usable *right now*, confirmed deployed (not "development"):

- **MCP command stack** — mnemos, rialu, taisce, eric, flyer, sentinel, git-mcp, fiosru, tomhas, taithi (capture). All reachable, OAuth/bearer-authed. This audit ran on it.
- **Mnemos** — deployed memory service, Qdrant+FTS5+RRF retrieval, MiniLM embedder (verified 3.4).
- **Anseo / Stór** — live community platform + bookstore (anseo.irish; shared codebase).
- **Deployed cognitive services** — Léargas (salience manifold + server), Colainn (`colainn-foxxelabs.fly.dev`), George (agent loop), Aislinge (operational nightly REM pipeline). Verified 3.7–3.8.
- **Gléas** — vLLM multi-LoRA serving **running on Iris** (sm_120, Qwen3-8B 4-bit); long-pole cleared (verified 3.5). Serves Macalla v1.
- **WebGPU / static micro-sites** — Versus (versus.foxxelabs.ie), Duel.
- **Macalla v1** — trained, promoted, published (HF `toddie314/macalla-v1`); servable via Gléas.

### 4.2 The multi-nodal system, as it actually is

The hypothesis (multi-nodal cognition, not a monolith) is **supported by the verified state** — the faculties exist as separate, mostly-live services. Mapped by real status:

| Faculty | Project | Status (git-true) |
|---|---|---|
| Memory | **Mnemos** | **LIVE** — deployed, retrieval verified |
| Salience | **Léargas + Mothú** | **LIVE** — Léargas deployed; Mothú source (not gate) verified |
| Consolidation | **Aislinge** | **LIVE** — operational pipeline |
| Somatic / affect store | **Colainn** | **LIVE** — deployed service |
| Agent loop | **George** | **LIVE** — deployed service |
| Serving | **Gléas** | **BUILT, running on Iris** — not yet a routing target |
| Learned-fact correction | **Taithí** | **BUILT** (M5 logit-bias serve exists) — but **eval numbers UNVERIFIED** |
| Reasoning backbone | **Tuiscint** | **DATA-READY, MODEL UNBUILT** — training awaits a 5090 GPU |
| **Gateway / spine** | **Aigne** | **PRD-ONLY, UNBUILT** — the missing spine |

**The system is a set of live faculties with no spine.** Memory, salience, consolidation, somatic, serving, and correction are all built and mostly deployed — but nothing routes across them. Aigne, the one component that would compose them into a single addressable surface, is the only pure-PRD item in the core set. **The code confirms it: the spine is missing.**

### 4.3 What to build to move the target

**Highest-leverage next build: Aigne — but preceded by one cheap unblock.**

The brief's candidate hypothesis was: Aigne routes to cheapest-sufficient backbone and injects Taithí-correction + Mnemos-RAG, justified because Taithí (98% reliability) beats the RAG-injection step Aigne's PRD planned (78% cap). **The audit both confirms the shape and exposes a dependency the hypothesis rests on:**

- **Confirmed:** Aigne is the smallest addition that composes *existing live faculties* into more than their sum. Gléas already serves, Mnemos already retrieves, Taithí already has logit-bias serve — the only missing piece is the router that fronts them with one OpenAI-compatible endpoint. This is pure composition, low energy cost, no new model. **Fully aligned with "smarter, not more."**
- **The catch:** the "Taithí beats the 78% RAG cap" argument is the load-bearing justification, and **that 98% is UNVERIFIED** (3.1) — no committed eval output backs it. So the single highest-value action is *cheaper than Aigne itself*: **commit Taithí's eval run artifacts** (un-gitignore `runs/`, archive a CounterFact run + the RAG/oracle baselines) to convert the correction-advantage claim from prose to fact. That one act either green-lights Aigne's injection design or refutes it before a line of gateway code is written.

**Recommended order:** (1) commit Taithí eval outputs → verify the 98% vs 78% delta is real; (2) build Aigne as the spine composing Gléas (serve) + Taithí (logit-bias correction) + Mnemos (RAG); (3) route Tuiscint in as a backbone tier *if/when* its from-scratch run lands (the one item that involves "a bigger model" — orthogonal to this build, gated on hardware, correctly deferred).

**Nothing in this recommendation points at scaling up.** The leverage is entirely in composition + measurement (Aigne's tokens-per-joule gate), consistent with the stated direction.

### 4.4 Which benchmarks, and why — stated honestly

Taithí's harness targets the right axes: **knowledge editing** (CounterFact / zsRE / MQuAKE — reliability / generalization / **locality**) and **continual learning** (BWT / FWT). The *mechanism* for "why we'd beat them" is architecturally credible: a frozen basis + logit-bias serve, versus prompt-based baselines that decline their own in-context fact ~22% of the time.

**But per the brief's own rule — no benchmark claim without a committed eval output — the benchmark story is currently unbacked:**

- Every number (98/97/82.8/92.1, RAG 77.2, oracle 69.4, 78% cap, BWT 0.000) is **UNVERIFIED prose** (3.1).
- **zsRE** is a prose claim; **MQuAKE is not wired up at all** (multi-hop = a 2-item hardcoded fixture). So of the three named editing benchmarks, only CounterFact has a runnable path, and even that has no archived run.
- **Honest ceiling (self-flagged, mechanically sound):** Taithí is single-hop, positively-stated, cued-recall only. It does **not** touch multi-hop composition (fails ~33%), subject-absent recall (~69%), or negation (~25%). Benchmarks requiring those — full MQuAKE multi-hop, negation suites — are out of scope by construction, not by tuning.

**Bottom line for benchmarks:** the claim to make externally is *conditional* — "on CounterFact single-hop editing, a frozen-basis logit-bias method should beat prompt-injection baselines that decline their own context" — and it becomes assertable the moment the run outputs are committed. Until then it is UNVERIFIED. Do not publish the numbers table as fact.

### 4.5 Task 4 acceptance

- ✅ What-runs-today enumerated from verified-deployed state.
- ✅ Multi-nodal system mapped (live / built-not-composed / model-pending / PRD-only) — spine (Aigne) confirmed missing in code.
- ✅ Highest-leverage build identified (Aigne), with the Taithí-eval-commit unblock that its justification depends on.
- ✅ Benchmark axes named with honest ceilings and the UNVERIFIED gate applied; no unbacked number asserted.
- ✅ Efficiency/composition framing held throughout; the one "bigger model" item (Tuiscint) flagged and deferred.

---

## Appendix A — Rialú ticket (drafted; not filed)

> **Title:** `list_projects` MCP tool under-reports project count via response truncation
> **Severity:** medium (silently corrupts every programmatic registry read)
> **Root cause:** `mcp_server.py::list_projects` runs `SELECT ... FROM projects ORDER BY updated_at DESC` with no LIMIT/filter — correct at the source (returns all 76). The failure is response *size*: full free-text `notes` for all rows produces a ~100 KB payload that truncates in downstream clients, yielding an eyeballed under-count (~57 observed vs 76 actual).
> **Fix:** return a lean projection from `list_projects` (drop/clip `notes`; keep id/name/slug/status/phase/repo_url/site_url); rely on existing `get_project` for detail; optionally add `limit`/`offset`. Add a test asserting `len(list_projects()) == COUNT(*)`.
> **Impact if unfixed:** Eric, future CC audits, and any registry consumer silently get a partial view.

## Appendix B — Slug-convention recommendation (í-fada artifact class)

ASCII-**fold** diacritics at repo creation (í→i, á→a, …), never strip-to-dash. Store the diacritic display name in Rialú's `name` field; keep the repo slug folded. Sole casualty to date: `Taith-` (trailing í → `-`). Adopting fold-not-strip eliminates the class.

## Appendix C — Dispositions requiring Todd (report-only; nothing executed)

- **Delete (4 empty artifacts):** `Taith-`, `doc`, `dramatis`, `sionach`.
- **Backfill registry (9):** `aibi`, `versus`, `foxxelabs`, `personality-quiz`, `foxxeeye`, `foxxe-covers`, `foxxelabs-step` (private), `uire-site` (satellite of `uire`), `tionol` (placeholder).
- **Fix registry links:** UCA Dissertation→`ucahub`; verify AfterWords↔`awords`; Foxxe Frey backlist.
- **Superseded (2):** `glor-studio`→`glór` (verify first), `anseo.start`→`anseo`.
- **Commit Taithí eval artifacts** — converts the whole benchmark story from UNVERIFIED to assertable; highest value-per-effort action in this audit.
- **Update stale prose:** Mnemos `retrieval.py` module docstring still says "ChromaDB" (code is Qdrant); Gléas registry status should move off "build-not-started."

---

*FoxxeLabs Limited · 2026-07-15*
