# FoxxeLabs — Project Roadmap
## As of 19 March 2026

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
  Legion          — distributed AI swarm (embodied mind, end target)

PRODUCTS & PLATFORMS
  Anseo           — community platform (social observation env for Legion; standalone)
  Rialú           — personal command centre (ops, deployments, machines, budget)
  Scéal           — multi-voice audiobook pipeline
  Glór            — voice creator (formant + Vocos neural vocoder)
  ga-say          — Irish pronunciation tool
  foghlaim        — Irish language learning tool
  Sionnach        — browser-based historical persona engine (complete)
  ucahub          — UCA dissertation public hub
  CyberSafer      — cybersecurity awareness training
  AfterWords      — digital legacy avatars (parked)
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

#### Re-run triggers
- `claude` source grows by ~1,000 chunks
- Significant new Anseo content lands
- After any major life event worth consolidating

#### Architecture note
The pipeline is fully scriptable: `Radharc → aislinge_phase2.py → ingest_bridges.py`. Automation candidate once Phase 7 is stable.

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

#### Next immediate (to make Phase 1 fully operational)
1. **Set `RAILWAY_API_TOKEN`** — account-level from `railway.com/account/tokens`
2. **CNAME `rialu.ie` → `rialu.fly.dev`** in Cloudflare DNS (proxied: on)
3. **Cloudflare Zero Trust Access** — Self-hosted app for rialu.ie, Google OAuth, policy: `todd@foxxelabs.ie`

#### Phase 2 — Machine agents
1. `rialu-agent.py` — Python daemon on Rose, Iris, Daisy
   - 30s heartbeat: process list (filtered to known projects), git repo states for `/home/Projects/`, resource stats (CPU/RAM/GPU)
   - HMAC-SHA256 auth via `RIALU_AGENT_SECRET` env var
2. Wire `routers/machines.py` — currently a stub returning `[]`
3. Machines tab in SPA — card grid, resource bars, process list, repo state table
4. Action proxy — hub → agent for `git pull`, restart, kill
5. `systemd` unit file + screen fallback per machine
6. `rialu-agent.service` systemd unit

#### Phase 3 — Intelligence
1. Anthropic usage API poller (daily)
2. API cost attribution per project via session token estimates
3. Budget tab: per-project breakdown, manual → auto
4. Timeline + Kanban views in Projects tab (currently stub)
5. Cloudflare Pages + GitHub pollers
6. Milestone due-date alerts

#### Phase 4 — Polish
1. Export: work log CSV, budget CSV
2. Mnemos integration — session summaries auto-ingested on save
3. `rialu-agent` upgrade to OAuth 2.1 (same pattern as `mnemos/server/oauth_provider.py`)

---

### Anseo (`todd427/anseo`)
**Status:** Live at anseo.irish — active development
**Branch:** dev → Railway auto-deploy

#### Done (selected highlights)
- Communities (full stack), moderation queue, themes, layouts ✅
- Civic Engine (planning applications, bills, Oireachtas) ✅
- Feed pills, post interactions, markdown, translation (14 languages) ✅
- Bug tracker ✅
- OAuth2 plumbing ✅
- Microsoft @atu.ie login ✅
- Daily digest (GitHub Actions) ✅

#### Sprint sequence

**Sprint 3a — Visual white-label (10–14 hrs)**
- Theme editor UI (users create/edit custom themes)
- 5 new layouts (expand from 9 to 14)
- Community-level layout assignment
- 3 mid-tone themes: Ink & Paper, Dusk, Mist
- Gradient background support

**Sprint 3b — Operational white-label (12–17 hrs)**
- Logo + favicon via env var or admin (`SITE_LOGO_URL`, `SITE_FAVICON_URL`)
- Database-driven content pages (About, Terms, Rules, Getting Started — editable via admin)
- Landing page customisation (hero text, features, CTA all configurable)
- Email template audit (purge hardcoded "Anseo" / "ATU Letterkenny")
- Configurable seed data (seed_categories accepts config file per instance)
- Deployment playbook — tested runbook someone else can follow

**Sprint 4 — Boards & Views (20–24 hrs)**
- Multiple view modes (list, card, board, timeline) — the "Padlet competitor" moment
- Lightweight quick-post from board view
- Padlet import/export

**Sprint 5 — Monitoring & Intelligence (10–15 hrs)**
- Redis caching, query optimisation
- LLM moderation (contextual content review replacing keyword blocklist)
- API analytics

**Sprint 6 — Calendar & Events (13–19 hrs)**
- Event model, RSVP, calendar view
- Community event feeds

**Sprint 7+ — Major features**
- Folláine (wellbeing module, 30–42 hrs)
- Promotions/SumUp (revenue — after sufficient user base)
- Book App (long-form publishing — Kindle already wired)
- Marketplace (60–83 hrs — needs user base first)
- Chat (Django Channels + Redis)
- Code embeds

#### Cúpla Focal / Foghlaim integration
The foghlaim project (standalone Irish learning tool) overlaps significantly with the Anseo "Learn" module scope. Decision pending: build the full Learn platform in Anseo, or keep foghlaim standalone and link from Anseo. The standalone approach is simpler and deployed; the Anseo-integrated approach unlocks community features and the multilingual instruction angle (Irish taught in any L1 via Google Translate + Azure TTS).

#### Generic POST endpoint (pending — needed for Scéal PRD)
`POST /api/v1/post/create/` — authenticated post creation, community + content, returns post URL. Enables `foxxe_publish.py` wrapper (ingest to Mnemos + post to Anseo in one call).

---

### Scéal (`todd427/sceal`)
**Status:** Active — HEAD clean after 10 commits today
**Machine:** Daisy (RTX 5060 OC, Ubuntu) / Rose (RTX 5070)

#### Done (as of 19 March 2026)
- Full multi-voice pipeline: RTF/TXT → segment → textprep → prosody → TTS → QA → ffmpeg → MP3 ✅
- MOS scorer (quality.py, v0.6.0) ✅
- Automatic prosody from punctuation ✅
- QA retry loop with best-of-N selection ✅
- JOBS_DIR/latest symlink ✅
- Render log persistence ✅
- Full web UI (server/ui.html) ✅
- Five character voices: Narrator, Simon, Elveth, Golden, Erayshin ✅

#### Next
1. **PRD** — write Scéal PRD v1.0 (was started today, not completed)
2. **Anseo post endpoint** — needs `POST /api/v1/post/create/` in Anseo before PRD can be posted
3. **`foxxe_publish.py`** — local wrapper: `ingest_document` to Mnemos + POST to Anseo in one call
4. **TheInterview demo** — full end-to-end render of the sample story
5. **Karaoke engine** — sync generated audio with text for karaoke-style display
6. **Character voice expansion** — additional reference voices, more phoneme rules
7. **Batch quality metrics** — per-project MOS history, trend charts in UI
8. **ABAIR.ie integration** — Irish dialect voices (Ulster/Connacht/Munster); contact TCD Phonetics lab

---

### Legion
**Status:** Slow-burn research, active on Iris
**Machine:** Iris (RTX 5080, 128GB)
**SFI funding horizon:** 2026–2027

#### Architecture
```
Legion = distributed somatic mind
  — drone swarm: n bodies, one mind (distributed proprioception)
  — Unitree manipulator: tool used by Legion (not part of body, but can be incorporated)
  — Peekaboo experiment: social cognition milestone
    — drone swarm does aerial "boo"
    — Unitree does face-level cover-and-reveal
    — Legion orchestrates both, staging one social moment across two physical forms
```

#### Stack position
`Mnemos (episodic) → Radharc (geometry) → Aislinge (consolidation) → Legion (embodied)`

Legion initialises with the consolidated belief layer from Aislinge as its prior world model. This is Phase 7 of Aislinge.

#### Done
- Conceptual architecture complete ✅
- PRD written ✅
- FoxxeLabs Research Ltd vehicle established ✅
- IRC scaffold (peekaboo milestone) ✅
- Isaac Sim 5.1.0 on Iris — simulation environment ✅

#### Next
1. **Agent-to-agent messaging** — peekaboo milestone (active)
2. **Swarm coordination protocol** — first two agents wired
3. **SFI funding letter** — cost breakdown needed by Q2 2026
4. **Aislinge Phase 7 integration** — initialise with consolidated belief layer
5. **Peekaboo experiment** — first successful social cognition demonstration
6. **Target milestone:** Peekaboo 2028–2029 (deliberately slow-burn)

#### Open questions
- Agent transport for Rialú integration: plain uvicorn or FastMCP StreamableHTTP? FastMCP adds MCP accessibility (Claude could query Legion state directly)
- Does the Sionnach personality layer serve as Legion's deliberative voice? The connection is real and unexplored.

---

### Mnemos (`todd427/mnemos`)
**Status:** Operational — 33,989 documents
**URL:** mnemos.foxxelabs.ie

#### Done (as of 19 March 2026)
- Hybrid retrieval (FTS5 + ChromaDB + RRF k=60) ✅
- Template extraction (server/templates/) ✅
- Date metadata on all chunks ✅
- Automated ingestion: email IMAP, Anseo pull, FoxxeLabs news ✅
- `get_doc_count` MCP tool ✅
- `get_stats` MCP tool ✅

#### Next
1. **Google Drive ingestion** (`ingest_gdrive.py`) — was started with OAuth2, interactive folder browser, dedup detection, dry-run mode; status unclear, may be incomplete
2. **`get_doc_count` as session-start health check** — should be called at start of every session to verify MCP connectivity
3. **Hybrid retrieval via MCP** — confirm `query_memory` is using the new FTS5+RRF layer end-to-end (not just dense)
4. **Mnemos `repost_document`** — concept for future: wrapper that calls `ingest_document` AND posts to Anseo via `foxxe_publish.py`
5. **OneDrive ingestion** — academic material on OneDrive, not yet indexed
6. **Volume expansion** — current ChromaDB volume is 3GB (`vol_rk12z3wnjd1y6624`); monitor growth

#### Document composition (19 March 2026)
| Source | Count | % |
|---|---|---|
| chatgpt | 15,552 | 46% |
| sft | 12,820 | 38% |
| claude | 4,940 | 15% |
| anseo | 359 | 1% |
| aislinge | 234 | 1% |
| doc | 84 | 0% |

---

### ga-say (`todd427/ga-say`)
**Status:** Deployed — ga-say.sionnach.ie / gaeltacht.sionnach.ie

#### Done
- Full app: 70+ words, 7 categories, 4 themes ✅
- Azure Neural TTS via CF Pages Function token proxy ✅
- gaeltacht.sionnach.ie as alternate domain ✅

#### Next
1. **Word list expansion** — more categories, more words (especially Gaeltacht vocabulary)
2. **Dialect tagging** — Ulster/Connacht/Munster variants where applicable
3. **ABAIR.ie voices** — if TCD API access granted, add authentic dialect voices alongside Azure
4. **Link from foghlaim** — cross-navigation between the two sionnach.ie tools

---

### foghlaim (`todd427/foghlaim`)
**Status:** Deployed — foghlaim.sionnach.ie (created today)

#### Done
- Flashcards (Irish↔English both directions) ✅
- Quiz mode (multiple choice) ✅
- SM-2 spaced repetition ✅
- Streak counter ✅
- Orla/Colm Azure Neural voice toggle via ga-say proxy ✅

#### Next
1. **Word list expansion** — more words, more categories
2. **Progress persistence** — SRS state currently in memory only; localStorage persistence
3. **Lesson structure** — group words into themed lessons (greetings lesson, numbers lesson etc.)
4. **Anseo integration decision** — standalone tool vs integrated into Anseo Learn module; currently leaning standalone with link-from-Anseo
5. **ABAIR.ie voices** — same as ga-say, when available

---

### Glór (`todd427/glor`)
**Status:** Active — formant + Vocos neural vocoder working

#### Done
- Complete formant synthesis engine (22050Hz, 3-resonator IIR, Rosenberg glottal pulse) ✅
- Vocos ONNX neural vocoder (BSC-LT/vocos-mel-22khz) — silent output fixed today ✅
- WAV export ✅
- WAV analyser → auto-apply sliders ✅
- Recording panel ✅
- voices.json export (Agora/Sionnach compatible) ✅

#### Next
1. **voices.json integration testing** — confirm Sionnach and Agora can consume the exported format
2. **Scéal integration** — can Glór-designed voices feed into Scéal's character voice system?
3. **Voice library** — pre-designed character archetypes as shareable voices.json
4. **Prosody controls** — integrate `<beat>` and emphasis markers from Scéal's prosody.py

---

### git-mcp (`todd427/git-mcp`)
**Status:** Deployed — git-mcp-foxxelabs.fly.dev

#### Done
- 13 git tools over StreamableHTTP ✅
- `git_branch`, `git_checkout` deployed ✅

#### Next
1. **`git_pull --rebase` support** — currently chokes on diverged branches
2. **OAuth 2.1 upgrade** — same pattern as `mnemos/server/oauth_provider.py`

---

### CyberSafer (`todd427/cybersafer`)
**Status:** Stable, paused — cybersafer.uk (noindex/nofollow)

#### Done
- v2 deployed: 21 scenarios, 6 categories, 764 test checks ✅
- Workflow: edit JSON → `python _build.py` → `python test_scenarios.py --offline` → git push → auto-deploy ✅

#### Decisions pending
1. **ICO registration** (~£40/year) — required before public launch
2. **WHOIS verification** — should show FoxxeLabs, not personal details
3. **Go public decision** — no timeline set

---

### Sionnach
**Status:** Complete — sionnach.ie

#### Done
- 18 personas across 6 collections ✅
- WebLLM/WebGPU, fully on-device ✅
- Deployed ✅

#### Next
- Maintenance only
- Foundation for Agora (post-viva)

---

### Agora
**Status:** Pre-development — blocked on post-viva slot

#### Concept
Multi-persona debate engine. Sionnach personas argue with each other. Single HTML file, Cloudflare Pages. Summer 2026 target.

#### Dependencies
- Sionnach complete ✅
- Post-viva slot (June 2026+)

---

### AfterWords / toddBot
**Status:** Parked

#### Concept
Digital legacy avatar project. University of Souls framing. toddBot = AI avatar trained on personal history and writings. Versioned checkpoints (Todd-2025, Todd-2026 etc.) with watermarked voice and video.

#### Depends on
- Dissertation complete
- ElevenLabs voice cloning
- Mnemos as the knowledge base

---

### tionol (`todd427/tionol`)
**Status:** Placeholder — tionol.irish

#### Concept
Academic and creative publication platform. Post-viva. Irish: *tionól* — assembly, gathering. No development timeline set.

---

### foxxelabs.ie (`todd427/foxxelabs-astro`)
**Status:** Active — auto-deploys on push

#### Next
- Continue publishing research articles as projects produce results
- Rialú wireframe at `/ops-dashboard/` stays current with Phase 1 completion
- Add Scéal page when PRD is published
- Add foghlaim/ga-say pages under Irish language tools section

---

## Dependency Graph

```
Mnemos
  ├── Radharc
  │     └── Aislinge
  │           └── Legion
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
  └── Scéal (potential voice feed — not yet integrated)
  └── Sionnach (voices.json schema compatibility)
```

---

## Horizon Summary

### Immediate (this week)
- Rialú: RAILWAY_API_TOKEN + DNS + Cloudflare Access
- Aislinge Phase 5: wait for Daisy run, evaluate, ingest
- UCA: await supervisor feedback on mindmap

### Short term (March–April 2026)
- Rialú Phase 2: rialu-agent daemon on Rose/Iris/Daisy
- Anseo Sprint 3a: visual white-label (themes, layouts)
- Scéal: PRD + Anseo post endpoint + TheInterview demo
- Mnemos: Google Drive ingestion completion
- git-mcp: git_pull --rebase

### Medium term (April–June 2026)
- UCA Dissertation: Chapters 3–5, submission 12 June
- Aislinge Phase 6: second-order consolidation
- Anseo Sprints 3b–5: operational white-label, boards, monitoring
- Legion: swarm coordination protocol, SFI letter

### Long term (post-viva, Summer 2026+)
- Agora: multi-persona debate engine
- Legion: Peekaboo experiment
- AfterWords: revisit when bandwidth allows
- tionol: publication platform
- Aislinge Phase 7: Legion integration with consolidated belief prior

---

## Session-Start Ritual

1. Call `mnemos:get_doc_count` — verify Mnemos is alive
2. Call `git_list_repos` — get ground truth on active repos
3. Read `foxxelabs-config/projects.json` — current intent
4. Query Mnemos: `"project status active FoxxeLabs"` — surface surprises
5. Check Daisy if any long-running jobs were left overnight (Aislinge, Scéal render, Radharc)

---

*FoxxeLabs Roadmap — 2026-03-19*
*Prepared by Claude (Anthropic Sonnet 4.6) on instruction from Todd McCaffrey*
