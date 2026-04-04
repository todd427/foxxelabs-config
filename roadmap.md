# FoxxeLabs — Project Roadmap
## As of 4 April 2026

**Author:** Todd McCaffrey / FoxxeLabs
**Maintained by:** Claude (Anthropic Sonnet 4.6) on instruction

---

## The Stack

Everything FoxxeLabs builds fits into one of three layers:

```
INFRASTRUCTURE
  Mnemos          — personal RAG memory system (episodic store)
  git-mcp         — git tools exposed to Claude via MCP
  foxxelabs-config — project registry and session rituals

RESEARCH PIPELINE
  Radharc         — geometry mapping (UMAP/adjacency over Mnemos)
  Aislinge        — dream consolidation (offline learning layer)
  Leargas         — visual intelligence / GMM semantic field
  Macalla         — personalized LLM pipeline (AfterWords backbone)
  Legion          — distributed AI swarm (embodied mind, end target)

PRODUCTS & PLATFORMS
  Anseo           — community platform (social observation env for Legion; standalone)
  Rialú           — personal command centre (ops, deployments, machines, budget)
  Scéal           — multi-voice audiobook pipeline
  Glór            — voice creator / TTS routing abstraction layer
  ga-say          — Irish pronunciation tool
  foghlaim        — Irish language learning tool
  Colainn         — biometric time-series store (medulla layer)
  Lorg            — personal health telemetry platform
  George          — vision-language memory service
  Mothu           — emotional AI layer
  Someday         — end-of-life digital companion (AfterWords entry point)
  Sionnach        — browser-based historical persona engine (complete)
  ucahub          — UCA dissertation public hub
  CyberSafer      — cybersecurity awareness training
  AfterWords      — digital legacy avatars (parked, depends on Macalla)
  tionol          — publication platform (placeholder)
  Agora           — multi-persona debate engine (pre-development)
```

---

## Priority Framework

From `projects.json` weightings:

| Factor | Weight |
|---|---|
| Deadline pressure | High |
| Strategic value | High |
| Funding potential | Medium |
| Personal interest | Medium |

Derived priority ranking:
1. **UCA Dissertation** — hard deadline 12 June 2026, non-negotiable
2. **Aislinge/Radharc** — Phase 5 running now; research pipeline feeding Legion
3. **Rialú** — deployed, needs DNS + Railway token to be fully operational
4. **Anseo** — live platform, active development
5. **Scéal** — active pipeline work, PRD and Anseo post endpoint next
6. **Legion** — slow-burn by design; feeds everything, SFI horizon 2026–2027
7. **ga-say / foghlaim** — deployed, word list expansion ongoing
8. **Mnemos** — infrastructure, Google Drive ingestion still pending
9. **git-mcp** — OAuth 2.1 and git_pull --rebase outstanding
10. **Macalla** — post-viva; blocked on Iris + Léargas Phase 1

---

## Project Roadmaps

---

### UCA Dissertation (`todd427/ucahub`)
**Status:** Active — awaiting supervisor feedback
**Deadline:** 12 June 2026 (hard)
**Current word count:** ~8,400 / 15,000

#### Done
- Chapter 1 — Introduction ✅
- Chapter 2 — Literature review ✅
- Interactive D3 mindmap (mindmap.html, 9 theory sections) ✅
- Section 2.9 — Research gaps ✅
- Sent mindmap to supervisor 19 March 2026

#### Next
1. **Wait for supervisor response** to mindmap (currently blocked)
2. **Chapter 3 — Cyberpsychology framework** (active when unblocked)
3. **Chapter 4 — Methodology** (April target)
4. **Chapter 5 — Analysis & Results** (May target)
5. **Final submission** — 12 June 2026

#### Satellite work (ucahub.ie)
- Site is noindex/nofollow while dissertation is active
- Flip to public after viva
- Survey response count at 164 — continue promoting for more data

---

### Aislinge (`todd427/aislinge`) + Radharc (`todd427/radharc`)
**Status:** Phase 5 running on Daisy (29% at end of 19 March)
**Depends on:** Mnemos

#### Done
- Phase 1 — Consolidation loop (12 clusters, Phi-3.5-mini, 17 March 2026) ✅
- Phase 2 — Generative replay (37 bridge statements, 5,201-doc corpus) ✅
- Phase 3 — Mnemos ingestion (219 bridges, 15 beliefs, source=aislinge) ✅
- Phase 4 — Evaluation (cyberpsych 1.0, ai_crash 0.97) ✅
- Phase B — chatgpt↔claude run launched ✅
- Phase 5 — chatgpt+claude+anseo run launched (Daisy, 29%) 🔄

#### Next immediate
1. **Wait for Phase 5 to complete** on Daisy
2. **Run evaluation** — `python evaluate.py` against 29 queries × 2 filters
3. **Ingest Phase 5 bridges** into Mnemos if scores improve on gap topics (legion, digital_legacy, mnemos, sleep)
4. **Phase 6 — Second-order consolidation** — run Aislinge on the `aislinge` source itself (consolidating the consolidations)
5. **Phase 7 — Legion integration** — initialise Legion swarm with consolidated belief layer as prior world model

#### Macalla dependency
Aislinge bridge statements are the **anchor layer** for Macalla training batches. A stable Phase 5+ bridge set is prerequisite for the first Macalla training run. High-quality Aislinge output = high-quality Macalla anchors.

#### Re-run triggers
- `claude` source grows by ~1,000 chunks
- Significant new Anseo content lands
- After any major life event worth consolidating

---

### Rialú (`todd427/rialu`)
**Status:** Deployed at rialu.fly.dev — Phase 1 complete
**Domain:** rialu.ie (secured, not yet wired)

#### Done (Phase 1)
- FastAPI + SQLite WAL + APScheduler ✅
- Projects, milestones, work log, deployments (cached), budget + API registry ✅
- Fly.io + Railway GraphQL pollers (60s each) ✅
- Full SPA (5 tabs, 4 themes) ✅
- 42/42 tests passing ✅
- Deployed and seeded ✅

#### Next immediate
1. **Set `RAILWAY_API_TOKEN`** — account-level from `railway.com/account/tokens`
2. **CNAME `rialu.ie` → `rialu.fly.dev`** in Cloudflare DNS (proxied: on)
3. **Cloudflare Zero Trust Access** — Self-hosted app for rialu.ie, Google OAuth, policy: `todd@foxxelabs.ie`

#### Phase 2 — Machine agents
1. `rialu-agent.py` — Python daemon on Rose, Iris, Daisy
2. Wire `routers/machines.py`
3. Machines tab in SPA
4. Action proxy — hub → agent for `git pull`, restart, kill
5. `systemd` unit file per machine

#### Phase 3 — Intelligence
1. Anthropic usage API poller (daily)
2. Budget tab: per-project breakdown
3. Timeline + Kanban views in Projects tab

---

### Anseo (`todd427/anseo`)
**Status:** Live at anseo.irish — active development
**Branch:** dev → Railway auto-deploy

#### Sprint sequence

**Sprint 3a — Visual white-label (10–14 hrs)**
- Theme editor UI
- 5 new layouts (expand from 9 to 14)
- Community-level layout assignment
- 3 mid-tone themes: Ink & Paper, Dusk, Mist
- Gradient background support

**Sprint 3b — Operational white-label (12–17 hrs)**
- Logo + favicon via env var or admin
- Database-driven content pages
- Landing page customisation
- Email template audit
- Deployment playbook

**Sprint 4 — Boards & Views (20–24 hrs)**
- Multiple view modes (list, card, board, timeline)
- Lightweight quick-post from board view
- Padlet import/export

**Sprint 5+ — Monitoring, Calendar, Major features**
- Redis caching, LLM moderation, API analytics
- Event model, RSVP, calendar view
- Folláine (wellbeing module)
- Promotions/SumUp, Book App, Marketplace, Chat

---

### Scéal (`todd427/sceal`)
**Status:** Active — v0.6.0 on Daisy/Rose

#### Next
1. **PRD** — write Scéal PRD v1.0
2. **Anseo post endpoint** — needs `POST /api/v1/post/create/` in Anseo
3. **`foxxe_publish.py`** — local wrapper: ingest to Mnemos + POST to Anseo
4. **TheInterview demo** — full end-to-end render
5. **Karaoke engine** — sync generated audio with text
6. **Glór migration** — render.py backend swap to Glór API (gate: Glór Phase 2)

---

### Macalla (`todd427/macalla`)
**Irish:** *macalla* — echo, resonance (MAK-ul-uh)
**Status:** Pre-development — post-viva priority
**PRD:** `foxxelabs-config/macalla/PRD.md` (v0.2, April 2026)
**Machine:** Iris (RTX 5080, 128GB) — training; Daisy — dev/eval

#### What it is
Personalized LLM pipeline that accumulates Todd's voice and reasoning style through punctuated QLoRA fine-tuning on personal data. The training backbone for **AfterWords / toddBot / University of Souls**.

**Core split:**
- **Macalla weights** = *how* Todd reasons (style, topology, structural priors)
- **Mnemos RAG** = *what* Todd knows (episodic facts, specific history)
Both are required for a credible AfterWords avatar. Neither replaces the other.

#### Stack
| Component | Choice | Notes |
|---|---|---|
| Base model | `Qwen/Qwen3-8B-Instruct` | Native thinking/non-thinking toggle; 128k ctx; superior LoRA characteristics |
| Training method | QLoRA (PEFT) | Memory-efficient; merge on eval pass |
| Quantisation | vLLM llm-compressor | Replaces deprecated AutoAWQ |
| Corpus | Mnemos (~61k docs) | Weighted by recency + Aislinge salience |
| Consolidation signal | Aislinge bridge statements | High-signal anchors for each training batch |
| Training trigger | Léargas GMM drift detection | Semantics-aware — not naive schedule |
| Training machine | Iris (RTX 5080, 128GB) | Not yet built |
| Checkpoints | Todd-YYYY-MM versioned | Snapshot before each run |

#### Dual deployment modes (Qwen3 native)
| Mode | Use case | Latency |
|---|---|---|
| Thinking | AfterWords persona queries, complex reflection | Seconds — acceptable |
| Non-thinking | Real-time voice output via Scéal/Glór | <300ms — required |

Both modes from the same merged checkpoint.

#### Training loop
```
Léargas drift signal
  → Sample Mnemos (recency + salience weighted)
  → Filter through Aislinge bridge statements (anchor layer)
  → QLoRA fine-tune Qwen3-8B on Iris
  → Evaluate (voice fidelity probe set)
  → Merge LoRA if eval passes threshold
  → Checkpoint as Todd-YYYY-MM
  → Ingest training run summary to Mnemos
```

**Cadence:** Drift-triggered (Léargas) or weekly — not nightly.

#### Versioned checkpoints
```
macalla/
  checkpoints/
    Todd-2026-04/    ← first run (post-viva)
    Todd-2026-07/    ← second run
    Todd-2027-01/    ← annual
  current -> Todd-2026-07  (symlink)
```

#### Honest ceilings
- **Catastrophic forgetting:** QLoRA mitigates, doesn't solve. Versioned snapshots are the workaround.
- **Integration vs accumulation:** Macalla accumulates statistical pattern, not integrated world model. Mnemos handles episodic recall.
- **Voice fidelity:** Target is "recognisably Todd" at 8B parameters — not indistinguishable.

#### Novel contribution
GMM-annotated LoRA training at solo-dev scale is unexplored territory. Potential paper post-viva: EMNLP workshop on personalized LLMs or ACL SRW.

#### Milestone plan
| Milestone | Target | Blocker |
|---|---|---|
| Repo creation | Post-viva | — |
| Training environment on Iris | Post-viva | Iris not yet built |
| Léargas Phase 1 (GMM drift) | Post-viva | — |
| First training run | Summer 2026 | Iris, Léargas |
| Todd-2026 checkpoint | Autumn 2026 | First run |
| AfterWords integration | 2027 | All of above |

**Do not begin implementation before 12 June 2026.**

---

### Léargas (`todd427/leargas`)
**Status:** Active — PRD v1.2 committed
**Depends on:** Mnemos, Radharc

#### What it is
GMM over semantic embedding space — cognitive field ("neocortex") layer distinct from Mnemos ("hippocampus"). Detects structural drift in the knowledge corpus. Phase 1 GMM output feeds Macalla training trigger.

#### Next
1. **Phase 1 implementation** per PRD v1.2
2. **Drift detection API** — expose GMM cluster deltas for Macalla to poll
3. **Phase 2** — temporal manifold (poc/temporal_manifold.py validated)

---

### Glór (`todd427/glor`)
**Status:** Active — routing abstraction layer

#### Routing logic
- `voice_id` in `cloned_voices` → XTTS v2 (identity-critical: Todd's voice, AfterWords, toddBot)
- `batch` flag or long text → StyleTTS2 (speed-critical: audiobook rendering)
- default → XTTS v2

#### Next
1. **voices.json integration** with Sionnach/Agora
2. **Phase 2 — Prosody normalisation** (beat tags → silence injection; gate for Scéal migration)
3. **Scéal migration** (render.py backend swap; gate: Glór Phase 2)
4. **Macalla/AfterWords integration** (todd-primary clone for toddBot)

---

### Legion
**Status:** Slow-burn research
**Machine:** Iris (RTX 5080, 128GB)
**SFI funding horizon:** 2026–2027

#### Architecture
```
Legion = distributed somatic mind
  — drone swarm: n bodies, one mind (distributed proprioception)
  — Unitree manipulator: tool used by Legion
  — Peekaboo experiment: social cognition milestone
```

#### Neurosymbolic layer (under consideration)
SNN (spiking neural network) stage via Intel Lava framework — simulation on Daisy/Iris now, Loihi 3 hardware when commercially available (expected late 2026). Event-driven, on-chip plasticity — aligns with Legion's developmental architecture.

#### Stack position
`Mnemos → Radharc → Aislinge → Legion (embodied)`

#### Next
1. **Agent-to-agent messaging** — peekaboo milestone
2. **Swarm coordination protocol**
3. **SFI funding letter** — cost breakdown Q2 2026
4. **Aislinge Phase 7 integration**
5. **Peekaboo experiment** — social cognition demonstration (target 2028–2029)

---

### Mnemos (`todd427/mnemos`)
**Status:** Operational — ~61,607 documents (April 2026)
**URL:** mnemos.foxxelabs.ie

#### Next
1. **R2 backup cron** — single point of failure, unresolved
2. **OneDrive ingestion** — academic material not yet indexed
3. **Google Drive ingestion** — status unclear from prior session
4. **Volume expansion monitoring** — 200k chunks (~Jan 2027) is performance-2x pressure point

#### Macalla dependency
Mnemos is the primary training corpus for Macalla. Corpus health, source diversity, and ingestion freshness directly affect Macalla output quality.

---

### Colainn (`todd427/colainn`)
**Status:** Active — created 28 March 2026
**URL:** colainn.com

#### What it is
Structured time-series biometric store. "Medulla" layer — homeostatic, schema-bound, fast. Parallel to Mnemos ("cerebrum"). 15-minute hippocampus snapshots tag Mnemos docs at ingest with contemporaneous physiological state.

#### Next
1. `fly launch` + volume create
2. `app/withings.py` OAuth2 pipeline (BPM Core)
3. `app/baseline.py` nightly job
4. Wire George → `visual_novelty` into `/readings` endpoint

---

### Lorg / George / Mothu
**Status:** All active — biometric/sensor layer

- **Lorg** — GPS/health telemetry, Garmin + Withings, nightly Mnemos ingest
- **George** — vision-language (moondream2), visual novelty scoring → Colainn
- **Mothu** — emotional AI (VADER/NRC/HuggingFace), Phase 1 complete; Phase 2 correlates with Colainn biometric ground truth

---

### ga-say + foghlaim
**Status:** Both deployed — sionnach.ie

#### Next
- Word list expansion + dialect tagging (ga-say)
- localStorage SRS persistence + lesson structure (foghlaim)
- ABAIR.ie partnership pitch (both)
- Check if *fís* now indexed in Mnemos → update words.js description

---

### Someday (`todd427/someday`)
**Status:** Active — someday.irish
**Role:** AfterWords entry point

Web-first (Vite + React + TypeScript, Web Crypto API + OPFS, Cloudflare Pages). VOICE.md v0.1: word "death" never appears in product. Three-session onboarding. AfterWords/Macalla connection invisible to users.

---

### AfterWords / toddBot
**Status:** Parked — post-dissertation

**The full stack:**
```
Macalla checkpoint (weights — how Todd reasons)
  + Mnemos (episodic RAG — what Todd knows)
  + Glór/ElevenLabs (voice clone)
  + Someday (entry point / legacy interface)
  = toddBot
```

Macalla is the enabling technology. Without it, toddBot is a RAG chatbot with no personal voice. With it, versioned checkpoints (Todd-2026, Todd-2027) become possible — the University of Souls concept.

---

### CyberSafer / Sionnach / Agora / tionol / dirs / Park
- **CyberSafer** — stable, paused; ICO registration decision pending
- **Sionnach** — complete; maintenance only; foundation for Agora
- **Agora** — pre-development; Summer 2026 target; post-viva
- **tionol** — placeholder; post-viva
- **dirs** — complete; deploy on Iris when built
- **Park** — active; EAS build pending

---

## Dependency Graph

```
Mnemos
  ├── Radharc
  │     └── Aislinge
  │           ├── Legion (Phase 7)
  │           └── Macalla (anchor layer)
  ├── Léargas
  │     └── Macalla (drift trigger)
  ├── Macalla (corpus)
  │     └── AfterWords / toddBot
  ├── Scéal (indirect — session ingestion)
  └── Rialú (Phase 4 — session summaries)

Sionnach
  ├── ga-say (theme system)
  ├── foghlaim (TTS proxy via ga-say)
  └── Agora (post-viva)

Anseo
  ├── Legion (social observation environment)
  ├── Mnemos (Anseo → Mnemos pull pipeline)
  └── foghlaim (potential integration — decision pending)

Glór
  ├── Scéal (routing layer — gate: Phase 2)
  ├── Sionnach (voices.json schema)
  └── AfterWords / Macalla (todd-primary voice clone)

Colainn
  ├── Lorg (telemetry source)
  ├── George (visual_novelty source)
  └── Mothu (sentiment metrics source)

Someday
  └── AfterWords (entry point)
```

---

## Horizon Summary

### Immediate (April 2026)
- Rialú: RAILWAY_API_TOKEN + DNS + Cloudflare Access
- Aislinge Phase 5: wait for Daisy run, evaluate, ingest
- UCA: await supervisor feedback, begin Chapter 3
- Colainn: Fly.io deploy + Withings OAuth2
- Glór Phase 2: prosody normalisation (gate for Scéal migration)

### Short term (April–June 2026)
- UCA Dissertation: Chapters 3–5, submission 12 June
- Rialú Phase 2: rialu-agent daemon
- Anseo Sprint 3a: visual white-label
- Scéal: PRD + Anseo post endpoint + TheInterview demo
- Léargas Phase 1: GMM implementation

### Medium term (post-viva, Summer 2026)
- **Macalla:** repo creation, Iris training environment, first training run
- Agora: multi-persona debate engine
- AfterWords: revisit with Macalla in place
- Legion: swarm coordination protocol, SFI letter
- Aislinge Phase 6: second-order consolidation

### Long term (2027+)
- **Macalla:** Todd-2026 checkpoint → AfterWords integration
- Legion: Peekaboo experiment (target 2028–2029)
- tionol: publication platform
- Aislinge Phase 7: Legion integration with consolidated belief prior
- **Paper:** GMM-annotated LoRA at solo-dev scale (post-viva venue TBD)

---

## Session-Start Ritual

1. Call `mnemos:get_doc_count` — verify Mnemos is alive
2. Call `git_list_repos` — get ground truth on active repos
3. Read `foxxelabs-config/projects.json` — current intent
4. Query Mnemos: `"project status active FoxxeLabs"` — surface surprises
5. Check Daisy if any long-running jobs were left overnight (Aislinge, Scéal render, Radharc)

---

*FoxxeLabs Roadmap — 4 April 2026*
*Generated-with: Claude Sonnet 4.6*
