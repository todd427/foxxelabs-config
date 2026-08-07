# <span style="color:#4a9eff">PRD — Suan: Sleep Weight Consolidation</span>

<span style="color:#888">Working title — "Suan" (deep sleep) not yet cleared through ainm. Version 0.3 — 2026-08-07. Status: draft.</span>

---

## <span style="color:#4a9eff">1. Problem</span>

The nightly sleep cycle (`nightly_consolidation.sh`, 3am cron) runs Léargas (slow-wave: GMM manifold rebuild) → Aislinge (REM: frontier seeds → dreams → bridges → beliefs → evaluation). Its output consolidates into the **manifold and Mnemos only**. The LLM that dreams remains frozen at deployment weights. Aislinge's stated purpose — turning experience into genuine learning — is currently true at the retrieval layer and false at the weight layer.

Suan closes the loop: evaluated dream output becomes training data; training data becomes an adapter; the adapter becomes a second, slower exit from the same dream.

## <span style="color:#4a9eff">2. Goals</span>

- <span style="color:#7bc96f">**G1**</span> — Compile evaluated Aislinge output (bridges + Phase 6 beliefs) into a QLoRA adapter on a scheduled cadence.
- <span style="color:#7bc96f">**G2**</span> — The adapter is a strict **overlay**: base weights untouched, on/off at serve time, alpha-scalable.
- <span style="color:#7bc96f">**G3**</span> — Bootstrap the founding corpus from historical runs (≈1,611 chunks, Mnemos `source='aislinge'`).
- <span style="color:#7bc96f">**G4**</span> — Multi-base portability via Route 3: corpus + recipe are the source of truth; adapters are per-base build artifacts (Qwen3-8B first; Mistral as a second build target).
- <span style="color:#7bc96f">**G5**</span> — Success is measured endogenously: **Léargas frontier() shrinkage** on identical intake, adapted vs unadapted.

## <span style="color:#4a9eff">3. Non-goals</span>

- No changes to the dream loop itself. The nightly manifold perturbation continues unmodified.
- No online / in-serving weight updates. Consolidation is offline batch only.
- No new scheduler or service. Cron + one appended stage + one weekly job.
- No literal cross-model weight transfer (LoRA-X / Cross-LoRA projection is a possible later fast-path for same-family upgrades, gated by Measure; out of scope for v0/v1).
- Not a solution to locality-under-load at scale (Taithí's open problem). Suan **contains** it (sparse updates, replay, eval gate, deep-sleep rebuild); it does not solve it.

## <span style="color:#4a9eff">4. Architecture</span>

Two consolidation timescales (complementary learning systems):

| Timescale | Mechanism | Store | Cadence |
|---|---|---|---|
| Fast | Dream → perturbation vector | Léargas manifold / Mnemos | Nightly (exists) |
| Slow | Corpus → QLoRA adapter | Model weights (overlay) | Weekly / threshold (new) |

### <span style="color:#e5c07b">4.1 Pipeline stages</span>

1. <span style="color:#e5c07b">**Emit**</span> (nightly, appended after Aislinge evaluation in `nightly_consolidation.sh`): surviving bridges + Phase 6 belief statements → JSONL increment. Seconds of work. Dreams themselves are never emitted — the bridge is kept, the dream discarded, same doctrine as embedding.
2. <span style="color:#e5c07b">**Accumulate**</span>: increments append to the cumulative sleep corpus (git-versioned; the corpus, not the adapter chain, is the source of truth).
3. <span style="color:#e5c07b">**Screen**</span> (at compile time): drop statements contradicted by current belief state (Taithí fact store / Phase 6). Revoked beliefs must never bake into weights.
4. <span style="color:#e5c07b">**Expand**</span>: each statement → multiple training forms (paraphrases, QA pairs, counterfactual probes). Duel-style generative recombination pointed at expansion. Solves low-volume overfit and pushes toward structural absorption over parroting.
5. <span style="color:#e5c07b">**Replay-mix**</span>: interleave new material with rehearsal samples from the cumulative corpus. Non-optional — Taithí M0 finding: swap survival requires replay; canonical-adapter approaches fail.
6. <span style="color:#e5c07b">**Compile**</span>: QLoRA train per target base. **Lineage decision: train on the Macalla voice-adapted base**, not raw Qwen — voice+sleep is one lineage; "off" means the voice-adapted model. Avoids two-adapter stacking interference (TIES/DARE merge is the fallback path if lineage proves wrong).
7. <span style="color:#e5c07b">**Gate**</span>: Measure — CounterFact-style reliability + locality, voice regression, domain suite. Fail → no promotion; material stays in the corpus for the next cycle. Rollback costs nothing.
8. <span style="color:#e5c07b">**Promote**</span>: adapter hot-swap in vLLM. Base and base+adapter served side by side for per-request A/B routing.

### <span style="color:#e5c07b">4.2 Cadence: naps vs deep sleep</span>

- **Nightly**: emit + accumulate only. No training — a handful of bridges per night overfits.
- **Weekly / threshold-N**: stages 3–8. Incremental compile.
- **Deep sleep** (monthly, or triggered by Measure locality decline): discard the increment stack, full rebuild from the cumulative corpus. This is the answer to "dense linear consolidation is a dead end" at the schedule level, and the escape hatch for drift.

### <span style="color:#e5c07b">4.3 Placement (Garden v2 roles)</span>

| Stage | Host | Rationale |
|---|---|---|
| Emit + accumulate | Wherever `nightly_consolidation.sh` runs | Host-agnostic: writes JSONL to the corpus git repo. No mesh dependency. |
| Corpus | Git repo | Source of truth; pulled at compile time; sidesteps Lily's pending Féith enrolment. |
| Compile (weekly + deep sleep) | **Lily, card 1** | Co-located with Macalla training — the sleep lineage trains on the voice-adapted base, so checkpoint, recipe, and adapter chain stay in one environment; jobs timeshare sequentially. 8B QLoRA fits in 16GB regardless of the pending per-card VRAM confirmation (nvidia-smi check outstanding). |
| Escalation | Iris (5090) | **Exception, logged, not drift.** Only if a rebuild outgrows card 1 (larger base, higher rank, long-context expansion). Iris stays the uncontended pretrain engine per Garden v2. |
| A/B eval serving | **Daisy, 5060 Ti** | Dormant under Garden v2, GPU idle despite the Imeall/Mnemos RAM load. vLLM, base + adapter side by side, per-request on/off routing. Bursty, latency-tolerant; Wi-Fi link is irrelevant at prompt/completion volumes. |
| Frontier-delta eval | Wherever Léargas runs | Manifold rebuild in place, querying the Daisy endpoint for the adapted arm. |
| Fly | Control plane / repo only | No GPU workloads; wrong cost profile with card 1 scheduled but unsaturated. |

Side effect worth capturing: the weekly compile is a recurring real workload with a natural €/run metric at Irish electricity rates — benchmark material for the Garden Stage 1 publication series at no extra cost.

## <span style="color:#4a9eff">5. Data</span>

- <span style="color:#e5c07b">**Unit**</span>: one evaluated statement (bridge or belief) with metadata: date, seed provenance (frontier node), evaluation scores, emotional layer, belief-consistency stamp.
- <span style="color:#e5c07b">**Format**</span>: JSONL. Training encoding is an **open experimental variable** (§8) — statement-as-completion vs QA vs paraphrase-cluster — expected to show up directly in the frontier delta.
- <span style="color:#e5c07b">**Bootstrap**</span>: extract Mnemos `source='aislinge'` (~1,611 chunks). Two mandatory filters: (a) retro-eval anything predating the current evaluation phase through the current evaluator — no free passes for early runs; (b) belief-staleness screen against current state. Survivors form the founding corpus; v0 trains on it as one order-free deep-sleep batch.

## <span style="color:#4a9eff">6. Evaluation</span>

- <span style="color:#7bc96f">**Primary (science)**</span>: frontier delta. Rebuild the Léargas manifold against base vs base+adapter on identical intake. Learned material should stop being frontier material. Shrinkage = structural absorption. No shrinkage + Measure pass = memorisation without absorption — a failure.
- <span style="color:#7bc96f">**Gate (safety)**</span>: Measure. Reliability ≥ and locality ≥ current Taithí M0 baselines (98% / 82.8% as reference points, thresholds TBD per suite); voice regression against Macalla suite; no domain-suite regressions.
- <span style="color:#7bc96f">**Dial**</span>: alpha sweep — find where consolidation stops informing and starts distorting.

## <span style="color:#4a9eff">7. Milestones</span>

- <span style="color:#7bc96f">**M0 — Founding corpus.**</span> Extract, retro-eval, screen, encode. Deliverable: corpus v0 + extraction/screen scripts.
- <span style="color:#7bc96f">**M1 — Adapter v0 + on/off.**</span> Expand, replay-mix, compile on voice-adapted Qwen3-8B (Lily, card 1 per §4.3). Deliverable: adapter v0, Measure report, frontier-delta report, alpha sweep.
- <span style="color:#7bc96f">**M2 — Automation.**</span> Emit stage in `nightly_consolidation.sh`; weekly compile job (threshold-N trigger); promotion/rollback wiring in vLLM. Deliverable: unattended weekly cycle.
- <span style="color:#7bc96f">**M3 — Second base.**</span> Mistral build target from the same corpus + recipe. Deliverable: build matrix proving Route 3 portability.

Go/no-go between M1 and M2: a real frontier delta at M1. If v0 shows none across encodings and alpha, stop and rework the encoding before automating anything.

## <span style="color:#4a9eff">8. Open questions</span>

1. Training encoding (statement / QA / paraphrase-cluster / mix) — treat as M1 experiment matrix, not a default.
2. Threshold N for the weekly compile trigger.
3. Deep-sleep trigger: fixed monthly vs Measure-locality-decline vs both.
4. Frontier-delta measurement protocol: which intake set, how many manifold rebuilds for a stable read.
5. Name: run "Suan" (and alternates) through ainm.
6. Whether Legion consumes the adapted model or the base — embodiment implications out of scope here but flagged.
7. M0 extraction path: `query_memory` caps at 12 results — bulk export of the ~1,611 `source='aislinge'` chunks needs either direct Qdrant/FTS5 access on the Mnemos host or a bulk-export-by-source endpoint added to Mnemos. Decide before the CC session starts.

## <span style="color:#4a9eff">9. Risks</span>

| Risk | Mitigation |
|---|---|
| Catastrophic forgetting | Replay-mix (stage 5), Measure locality gate |
| Stale/revoked beliefs baked into weights | Screen stage (3), deep-sleep rebuild |
| Low-volume overfit | No nightly training; expansion stage (4); threshold trigger |
| Adapter interference with Macalla voice | Lineage decision (train on voice-adapted base) |
| Increment-stack drift | Deep-sleep rebuild from cumulative corpus |
| Locality under load at scale | Contained, not solved — inherited open problem (Taithí) |
| Memorisation masquerading as learning | Frontier delta as primary readout, not Measure alone |
