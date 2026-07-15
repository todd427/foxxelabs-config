# <span style="color:#1a5276">CC Brief — Full-corpus audit, reconciliation, and capabilities analysis</span>

<span style="color:#2874a6">**Date:**</span> 2026-07-15
<span style="color:#2874a6">**Author:**</span> Claude (spec), for Claude Code execution
<span style="color:#2874a6">**Scope:**</span> the whole `todd427` GitHub corpus + Rialú registry + the deployed MCP stack
<span style="color:#2874a6">**Deliverable:**</span> a single written report (`docs/audit/2026-07-corpus-audit.md` in `foxxelabs-config`), plus one Rialú ticket and any registry corrections found.

---

## <span style="color:#2874a6">Why this brief exists</span>

A chat session tried to answer "what can the stack do today, what do we build to move the target, which benchmarks do we beat" and could not, because the ground truth was not trustable from chat tools alone. Three sources gave three different counts of the same thing:

- **Rialú UI (`rialu.ie`):** **76 projects** (authoritative registry count, read off the dashboard).
- **`rialu:list_projects` MCP tool:** returned **~57** — it under-reports against its own UI. **This is a suspected tool bug and is Task 1.**
- **GitHub (`git_list_remote_repos`):** **129 repos** — the superset, including scratch, pre-reboot, and ghost repos.

No analysis is trustworthy until those three numbers are reconciled and the registry is confirmed complete. That reconciliation is the first job; the capabilities analysis is built **on top of** a verified corpus, not alongside guesses.

**Standing discipline for this brief (learned the hard way this session):** never trust a *returned* or *rendered* view as if it were the *source*. `list_projects` truncated/under-reported and a dashboard render was eyeballed — both produced wrong counts. Verify every count by enumeration, every status claim against `git_log`/`git_read_file` on implementation files, and treat any assistant-written STATE/status prose in a repo or registry as a **claim to check**, not a fact. Where a claim cannot be verified from code, mark it `UNVERIFIED` rather than repeating it.

---

## <span style="color:#2874a6">Task 1 — Reconcile the three counts (do this first, block on it)</span>

1. Enumerate all GitHub repos (`git_list_remote_repos`) — expect ~129. Record name, private/archived, `pushed_at`, default branch.
2. Enumerate the full Rialú registry — **not** via a single `list_projects` call (it under-reports). Page it, or pull directly from Rialú's own storage/API, until the count matches the UI's 76. Record what the tool returns vs the UI.
3. **Diagnose the `list_projects` discrepancy.** 76 (UI) vs ~57 (tool) — is it pagination (a default `limit`/page size), a status/constellation filter, an archived-exclusion, or a genuine bug? Read the Rialú repo (`todd427/rialu`) to find the tool's query. **Output: a Rialú ticket** with the root cause and the fix — because anything querying the registry programmatically (Eric, future CC runs, this audit) is silently getting a partial view.
4. Build the **three-way diff**: GitHub ∖ Rialú (ghost repos — real on GitHub, absent from registry), Rialú ∖ GitHub (registry entries whose repo is missing/renamed), and the intersection. This diff is the map for Tasks 2–3.

**Acceptance for Task 1:** a table where the registry count matches 76, the tool's under-report is explained with a named cause, and every one of the ~129 repos is classified (active-stack / scratch-2025 / ghost / superseded / artifact).

---

## <span style="color:#2874a6">Task 2 — Resolve the known artifacts and ghosts</span>

### `Taith-` (root cause known — confirm, don't re-investigate)

`Taith-` is a **repo-creation artifact of the í-fada (á/é/í/ó/ú)**: the accented slug for **Taithí** was transliterated/stripped at creation and the accented character became a `-`. The live project is `todd427/taithi` (pushed today, 26 commits, ~90 tests). **Confirm** `Taith-` is an empty or stub ghost (`git_log`, `git_list_files`) — if it holds no unique commits, recommend deletion; if it holds anything real, report what and why before touching it. **Do not delete without reporting first.**

**Generalise it:** grep the whole GitHub list for other í-fada / accented-name casualties (Taithí, Léargas, Cło, Céim, Comhordú, Fiosrú, Úire, Áit, Mothú, Gléas, Féith, etc. all carry diacritics). Any repo whose name is a mangled/ASCII-stripped version of an accented project name is the same bug class. Produce the list; recommend a slug convention (ASCII-fold at creation, store the display name with diacritics in Rialú) so it stops recurring.

### The other ghosts

For each repo in **GitHub ∖ Rialú** with a 2026 push (candidates seen this session include `aibi`, `faidh`, `doc`, `autotest`, `versus`, `stargame`, `foxxelabs-step`, `dramatis`, `foxxeeye`, `tionol` — verify the full set from Task 1's diff): read README + `git_log`, classify as (a) real active project missing from Rialú → **backfill entry proposed**, (b) scratch/experiment → leave, (c) superseded → note successor. Distinguish 2026-active from 2025-pre-reboot scratch (`ages-stages-trainer`, `lunarLander`, `PQuiz-*`, `toddric-*`, `weread*`, `mistral_training`, etc. — the pre-reboot layer, historical, not current stack).

---

## <span style="color:#2874a6">Task 3 — Verify the load-bearing claims (the ones the analysis rests on)</span>

For each repo below, verify the specific claim against code/commits — not against its own STATE prose. These are the projects the "what can we do today / what benchmarks" question actually depends on, so their status must be **git-true**, not registry-true.

- **`taithi`** — verify the headline eval numbers are real and reproducible, not a status doc. Claims to check against `eval/` + committed run outputs: M1 reliability 98 / generalization 97 / locality ~82.8 / composite 92.1 on 50 CounterFact edits over frozen Qwen2.5-3B; BWT exactly 0.000 across 8 tasks×25 edits; beats best RAG (77.2) and in-context oracle (69.4); prompting caps at 78% reliability. Confirm M2 (swap=replay, adapter retired), M3 (consolidation **BLOCKED**, not "in progress"), M4 (salience judge, 100%precision/50%recall on a 26-item fixture — flagged INDICATIVE), M5 (logit-bias serve). **Is the eval harness runnable from a clean checkout?** This is the single most important verification in the brief — the whole "which benchmarks do we beat" answer is Taithí's CounterFact/zsRE/MQuAKE numbers.
- **`tuiscint`** — verify: data programme complete, gold eval **locked** at 959 examples, pretrain corpus decontaminated (38.052B tokens, 72,580 steps), from-scratch run **not yet launched** (awaiting 5090). Confirm the eval-lock and decontam gates from committed artifacts, not notes.
- **`aigne`** — verify it is **PRD-only, no code** (registry says so). This is the named architectural home for Taithí/Mnemos/Macalla composition — confirm nothing is built yet, and extract the PRD's actual interface contract (OpenAI-compatible gateway, route-to-cheapest-sufficient, tokens-per-joule metric).
- **`mnemos`** — current retrieval path (Qdrant + FTS5/RRF), doc count (get_doc_count), the frozen-baseline eval numbers (nDCG@10 0.547 etc.), and whether the Phase 3 embedder brief pushed 2026-07-10 (`docs/mnemos/cc_brief_phase3_embedder_candidate_eval.md`, commit 02e3421) has been actioned.
- **`macalla`** — verify v1 trained+promoted (HF `toddie314/macalla-v1`, merged), v2 trained-not-promoted, adapter forms. Confirm it's a QLoRA voice layer on Qwen3-8B, **not** a candidate Taithí backbone (the docs flag the historical Tuiscint↔Macalla conflation — check the boundary markers are in both repos).
- **`gleas`** — verify PRD + phase-1 brief committed, build-not-started, and the vLLM-on-Blackwell-sm_120 + 4-bit "long pole" risk is documented.
- **`leargas`, `mothu`, `aislinge`, `colainn`, `george`** — for each, one-line git-true status. **Especially `mothu`:** confirm in code that it is the **affective salience *source*** (VADER+NRC+HF), **not a gate** — the DESIGN.md correction ("Earlier drafts called Mothú 'the salience gate'... corrected 2026-07") should be reflected in the actual code, no admit()/should_consolidate() exposed. Report if any stale "gate" framing survives anywhere.

---

## <span style="color:#2874a6">Task 4 — The analysis (only after 1–3 are done and verified)</span>

Write, grounded in what Tasks 1–3 established, in this order:

1. **What runs today.** The deployed/live surface (MCP stack, Anseo/Stór, the WebGPU apps, Mnemos, Taithí capture) — what is genuinely usable *right now*, verified deployed, not "development".
2. **The multi-nodal system, as it actually is.** Todd's hypothesis is that this is a multi-nodal cognition system, not a monolith. Map the real one from verified state: the faculty set (Mnemos=memory, Tuiscint=reasoning [pending 5090], Aislinge=consolidation, Léargas+Mothú=salience, Taithí=learned-facts correction, Gléas=serving, Aigne=gateway [unbuilt]). Show which faculties are **live**, which are **built-but-not-composed**, and which are **PRD-only**. The gateway (Aigne) is the missing spine — say so if the code confirms it.
3. **What to build to move the target.** The smallest addition that composes existing live faculties into something more than their sum. Candidate hypothesis to test against the verified state: **Aigne as the spine that routes to cheapest-sufficient backbone and injects Taithí-correction + Mnemos-RAG** — because Taithí (98% reliability, verified) already beats the RAG-injection step Aigne's PRD planned (78% cap). Confirm or refute that this is the highest-leverage next build from the actual code, don't assume it.
4. **Which benchmarks, and why we'd beat them.** From Taithí's verified harness: CounterFact / zsRE / MQuAKE (knowledge editing — reliability/generalization/**locality**), and the continual-learning axis (BWT/FWT). State the honest ceiling too: Taithí is single-hop, positively-stated, cued-recall only (multi-hop fails ~33%, subject-absent ~69%, negation ~25%) — so name the benchmarks it does **not** touch. The "why we beat them" is the frozen-basis + logit-bias mechanism vs. prompt-based baselines that decline their own context 22% of the time. No benchmark claim without a committed eval output behind it.

**Framing constraint:** this is an efficiency/composition thesis, not a scale thesis. Todd has explicitly moved toward "smarter, not more" — the analysis should evaluate builds by *what they compose from existing faculties at low energy cost*, not by parameter count or VRAM pooled. If a conclusion points at "train/hold a bigger model," flag it as being in tension with the stated direction.

---

## <span style="color:#2874a6">Do NOT</span>

- Do not trust any STATE/status prose (registry notes or in-repo) without a `git_log`/`git_read_file` confirmation. Assistant-written status has been wrong before (the registry itself flags this pattern).
- Do not delete `Taith-` or any ghost repo in this pass — **report and recommend**, Todd disposes.
- Do not write to Mnemos or Taithí from this audit. Taithí's store is for Todd-asserted facts only; the audit's findings are inferences and go in the report. (One fact — "Rialú has 76 projects" — was already taught to Taithí this session by Todd's assertion; do not duplicate it, `taithi_facts` to check.)
- Do not repeat a count you have not enumerated yourself. Three different wrong numbers came from exactly that.
- Do not let the capabilities analysis (Task 4) start before the reconciliation (Task 1) is green — a capabilities map built on a partial project list is the failure this brief exists to prevent.

---

## <span style="color:#2874a6">Acceptance</span>

- `docs/audit/2026-07-corpus-audit.md` committed to `foxxelabs-config`, with: the three-way reconciliation table (76/API/129 all explained), every repo classified, the ghost/artifact dispositions, the Task-3 verification table (claim → git evidence → verified/unverified), and the Task-4 analysis.
- One **Rialú ticket** for the `list_projects` under-report, with root cause.
- A **slug-convention recommendation** to stop the í-fada artifact class recurring.
- Every benchmark/status claim in the analysis traces to a committed file or is marked UNVERIFIED. No exceptions.
