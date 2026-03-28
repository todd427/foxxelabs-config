# FoxxeLabs Production Model Analysis — v2
## Report: 2026-03-28 (revision of 2026-03-25)

---

## Corrections to v1

The original report used `status: complete` as the completion metric — yielding 10% (2/21). This was wrong. Todd's definition of completion is **deployed**: a project running in production, accessible, doing its job. By that measure the rate is **52% (16/31)** as of 2026-03-28.

The v1 framing created a false alarm about completion rate. The real concern is different and described below.

---

## Current Portfolio (2026-03-28)

31 projects total across two registries (projects.json + Rialú). Status per Rialú as authoritative source:

| Status | Count | Projects |
|--------|-------|---------|
| Deployed | 14 | Anseo, Mnemos, Rialú, git-mcp, Sentinel, CyberSafer, Sionnach, foxxelabs.ie, ga-say, Duel, Eric, George, Lorg, Léargas API |
| Running (local/Tauri) | 2 | Aislinge (Rose), Faire (Daisy) |
| Development | 9 | Scéal, foghlaim, Glór, Dissertation, Radharc, Mothu, Colainn, Legion, foxxelabs-config |
| Paused | 2 | Taisce, Park |
| Research / Pre-dev | 4 | Someday, AfterWords, Agora, tionol |

**Deployed + Running: 16/31 = 52%**

Since v1 (9 days ago): +10 projects registered, +3 deployed. Net portfolio growth: ~1.1 projects/day.

---

## The Three Eras — Revised

| Period | Duration | New Projects | Rate (projects/wk) |
|--------|----------|-------------|---------------------|
| Pre-2025 (clipboard) | ~2 years | ~6 | ~0.06 |
| Q4 2025 (clipboard) | ~13 weeks | ~3 | ~0.23 |
| Jan–Feb 2026 (git-mcp) | 8 weeks | ~4 | ~0.50 |
| Mar 1–19 2026 (CC era) | 2.7 weeks | 6 | ~1.71 (as documented in v1) |
| Mar 19–28 2026 (CC accelerated) | 9 days | ~9 | ~7.0 |

The Mar 19–28 spike partially reflects catch-up registration of existing projects into Rialú/projects.json rather than pure new creation. True new project creation rate in the CC era is likely 2–3/wk rather than 7/wk. The acceleration is real; the magnitude of the final data point is inflated.

---

## The Real Constraint: Operational Load

The v1 report identified context maintenance and attention budget as the binding constraints. Both remain true. But the deployment rate adds a third: **operational load accumulates**.

Each deployed project carries ongoing cost:

**Direct costs (€/month estimate as of Mar 2026):**
- Fly.io machines: Mnemos (performance-2x), Rialú, git-mcp, Sentinel, Léargas, Lorg, Eric — ~€40–60/mo
- Railway: Anseo, George — ~€15–20/mo
- Cloudflare: Pages, DNS, Zero Trust, R2 — ~€10–15/mo
- Azure: Neural TTS (foxxespeech) — ~€5–10/mo
- Total recurring: ~€70–105/mo (Faire dashboard shows €71/mo at last snapshot)

**Indirect costs (time/attention per deployed project per week):**
- Monitoring: is it up, any anomalies?
- Incident response: Sentinel flagged a persistence bug; Mnemos nightly ingest broke (Fly secrets missing)
- Dependency updates, security patches
- Feature pressure: deployed = real users = real requests

At 16 deployed projects, even 30 minutes/week per project = 8 hours/week of pure operations, before any new development.

**The acceleration curve intersects the operations ceiling.** As creation rate accelerates, each new deployment adds to the operational tax. The ceiling is not a hard stop — it's a slow squeeze: less time for new work as more time goes to keeping existing work alive.

---

## The Structural Solution: Faire

The operational load problem already has a purpose-built answer: **Faire** (`todd427/faire`, currently phase-4 on Daisy).

Faire is a Tauri v2 desktop application whose explicit design goal is to collapse the per-project monitoring overhead to near-zero. Its PRD framing: *"Rialú controls. Faire watches."* Rather than visiting Railway dashboards, Fly.io logs, and terminal windows separately for each project, Faire surfaces everything through a single always-available interface driven by Rialú's WebSocket hub.

**What Faire directly addresses from the operational load list:**

| Operational task | Without Faire | With Faire (Phase 3+) |
|-----------------|---------------|----------------------|
| Is it up? | Check each Fly.io / Railway dashboard | Live card grid, aggregate status in system tray |
| Cost tracking | Manual calculation | Per-project cost metrics live in card, €/mo total on dashboard |
| Incident response | Terminal + logs for each service | Faire surfaces errors as OS-level decision popups; rialu-agent emits structured events |
| CC session visibility | Separate terminal per session | Phase 4: PTY wrapper streams structured CC events into Faire context pane |
| Context retrieval | Manual Mnemos query | Phase 5: auto-query on project card open, context pane pre-loaded |
| Machine health | SSH to each machine | Phase 3: rialu-agent heartbeat, GPU utilisation, resource metrics per machine |

The realistic reduction in ops overhead once Faire Phase 3–5 is complete: from ~30 min/project/wk to ~5 min/project/wk for well-behaved services. At 16 deployed projects that is the difference between 8 hrs/wk and 1.5 hrs/wk in pure monitoring.

**Faire is not a post-viva architectural project — it already exists at Phase 4.** The remaining phases (Phase 5: Mnemos context proxy; Phase 6: polish + packaging) are the incremental work that delivers the full operational leverage.

### Colainn–Faire integration (Phase 5 enhancement)

Once Colainn is live and feeding homeostatic snapshots into Mnemos metadata, Faire's Phase 5 context pane becomes significantly more powerful. The auto-query on project open would surface not just episodic memory (what was discussed) but physiological context (what Todd's biometric state was during the last session on this project). This is the Mnemos hippocampus integration made visible at the point of decision — directly in the tool used to make decisions.

This integration requires no new Faire architecture. The Colainn `/snapshot?ts=` endpoint enriches the Mnemos document metadata at ingest time; Faire's Mnemos proxy retrieves that enriched context automatically. It is a zero-cost addition to Phase 5.

**Recommended sequencing:**
1. Complete Faire Phase 5 (Mnemos proxy) — natural next phase after current Phase 4 CC work
2. Launch Colainn on Fly.io (BPM Core arriving 1 April 2026, OAuth2 pipeline to follow)
3. Verify Colainn homeostatic snapshots are appearing in Mnemos document metadata
4. Faire context pane will then automatically show physiological state alongside project history

---

## Sustainability Analysis

Three scenarios for the next 12 months:

**Scenario A — Unconstrained (current trajectory)**
Creation continues at 2–3/wk. Deployment rate follows at ~50%. By Mar 2027: ~130–160 projects, ~65–80 deployed. Operations overhead without Faire: 30–40 hrs/wk. With Faire Phase 5 complete: ~10–12 hrs/wk. Still unsustainable.

**Scenario B — Natural throttle (post-viva)**
Dissertation completes June 2026. Creation rate drops to ~1/wk. By Mar 2027: ~45 deployed. Operations overhead without Faire: ~20 hrs/wk. With Faire: ~4–5 hrs/wk. Manageable.

**Scenario C — Deliberate constraint**
Post-viva audit + archive pass. Portfolio stabilises at 35–40. Operations overhead without Faire: ~15 hrs/wk. With Faire: ~3 hrs/wk. Healthy.

**Faire is load-bearing in every scenario.** Without it, even Scenario C requires 15 hrs/wk in ops. With it, the ceiling lifts substantially and Scenario B becomes genuinely comfortable.

---

## The Right Metric Going Forward

Not completion rate (too strict). Not deployed rate alone (doesn't capture operational debt). The useful compound metric is:

**Deployment health = (deployed + running) / total, with operational cost per deployed project tracked monthly**

Secondary indicator: **archive rate** — how many projects get deliberately wound down or consolidated per quarter. Currently zero. This is the missing half of the portfolio lifecycle.

Faire should surface both metrics on its dashboard as first-class data points, not buried in Rialú's API.

---

## Recommendations (revised from v1)

1. **Complete Faire Phase 5 (Mnemos proxy).** This is the single highest-leverage action available. It directly reduces monitoring overhead and makes Colainn integration free.

2. **Post-viva audit is still the right moment for portfolio pruning.** June 2026. Faire makes the audit easier — cost and health data will be immediately visible per project.

3. **Introduce an archive status to Rialú.** Projects that are done, superseded, or abandoned should be archived, not left as `paused`. Faire's card grid should not show archived projects by default.

4. **Fionn (BI agent) should track operational cost per project.** €71/mo is the current headline. As it crosses €150, €250, each threshold should trigger a review. Faire dashboard is the natural home for this signal.

5. **The acceleration is not inherently bad.** 52% deployment rate is genuinely good. The concern is that the operational floor rises with each deployment. Faire is the structural answer to that floor — it does not eliminate the cost but it compresses the time required to manage it by ~6×.

---

## Mnemos Capacity Projection

### Current state (2026-03-28)

- **57,827 document chunks** indexed
- Source mix: 57% one-time batch imports (gdrive_hierarchy, sft, gdrive); 43% organic live sources (claude, chatgpt, git, george, lorg, anseo, aislinge, mothu)
- Ingest rate this week: ~241 chunks/day (~15/active project/day)
- Deployed on Fly.io `performance-2x` (4GB RAM), ChromaDB with HNSW index

### Storage math

These are **document counts (chunks), not bytes**. The byte implications per threshold:

| Threshold | Chunks | Embedding vectors | HNSW index (est.) | Text + metadata | Total RAM needed |
|-----------|--------|-------------------|-------------------|-----------------|-----------------|
| Now | 57,827 | ~89MB | ~200MB | ~46MB | ~335MB |
| 200k | 200,000 | ~293MB | ~650MB | ~160MB | **~1.1GB** |
| 500k | 500,000 | ~732MB | ~1.6GB | ~400MB | **~2.75GB** |
| 1M | 1,000,000 | ~1.46GB | ~3.2GB | ~800MB | **~5.5GB** |

Calculation basis: sentence-transformers all-MiniLM-L6-v2 (384 dims × float32 = 1,536 bytes/vector). HNSW index ~2.2× raw embedding size (empirical ChromaDB). Text/metadata ~800 bytes/chunk average.

**The binding constraint is RAM, not disk.** Fly.io volumes are cheap and expandable. The 4GB `performance-2x` machine loads the full HNSW index into memory at startup.

- At **200k chunks**: ~1.1GB for Mnemos, leaving ~2.9GB for OS + app. Comfortable but approaching pressure territory during large query spikes.
- At **500k chunks**: ~2.75GB for Mnemos alone. The 4GB machine becomes marginal. Upgrade to `performance-4x` (8GB, ~€35/mo more) required before this point.
- At **1M chunks**: requires `performance-4x` minimum, or migration to Qdrant (significantly more memory-efficient HNSW, typically 3–4× less RAM for same index).

### Velocity-linked projection

Mnemos ingest rate scales with active project count. Each deployed project contributes ~15 chunks/day via Claude conversations, git commit ingestion, and operational feeds (George, Lorg, Mothu).

| Scenario | Deployed projects (Mar 2027) | Est. daily rate | 200k reached | 500k reached |
|----------|------------------------------|-----------------|-------------|-------------|
| A — unconstrained | ~65 | ~975/day | **Sep 2026** | **Jan 2027** |
| B — natural throttle | ~35 | ~525/day | **Jan 2027** | **Sep 2027** |
| C — deliberate constraint | ~22 | ~330/day | **Apr 2027** | **2028+** |

Current trajectory (Scenario B) hits the 200k RAM pressure point around January 2027 — approximately 9 months away.

### The live fraction problem

The 57% batch import fraction (gdrive_hierarchy, sft) masks the true organic growth rate. Stripping those out:

- Organic corpus now: ~24,900 chunks
- Organic ingest rate: ~241/day (all current ingest is organic — batch imports are complete)
- Organic corpus doubles in: ~103 days (~July 2026)

By mid-2026, organic sources will be the dominant fraction and the growth curve will be purely velocity-driven. Faire's ingest rate monitoring (Phase 5) makes this visible as a live metric.

### Action items

1. **R2 backup cron** — implement before 200k, not after. The safety net for any migration. Currently unresolved and flagged as single point of failure.
2. **performance-4x upgrade planning** — budget ~€35/mo additional from approximately Q4 2026 on Scenario B.
3. **Qdrant migration evaluation** — post-viva technical spike (Jun–Jul 2026). ChromaDB is excellent to ~300k chunks; beyond that Qdrant's on-disk HNSW and lower RAM footprint become attractive.
4. **Ingest rate monitoring in Faire** — chunks/day as a standing metric on the Faire dashboard. A bulk import spike (e.g. 70+ novel backlist, ~7k chunks) should be a conscious decision, not an accident.

---

## Data Sources

- `projects.json` — foxxelabs-config (updated 2026-03-28, 31 projects)
- Rialú `list_projects` — 20 projects with platform/status/phase (2026-03-28)
- Mnemos `get_stats` — 57,827 docs, composition and recent activity (2026-03-28)
- Faire PRD — `todd427/faire/docs/faire-prd.md` (v0.1, 2026-03-23)
- Faire dashboard screenshot — €71/mo, 17 projects (2026-03-27)
- Prior report: `reports/2026-03-25-production-model-analysis.md`

---

*FoxxeLabs Limited · Private — not for publication · 28 March 2026*
