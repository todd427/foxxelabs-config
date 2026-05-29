# <span style="color:#a02020">FoxxeLabs — Project Roadmap</span>

## <span style="color:#1e5a8a">As of 15 May 2026 (v2.1)</span>

**Author:** Todd McCaffrey / FoxxeLabs
**Maintained by:** Claude (Anthropic Opus 4.7) on instruction
**Supersedes:** v2 (15 May 2026) — minor corrections; v1 (4 April 2026) — major rewrite

---

## <span style="color:#a02020">The Stack</span>

```
INFRASTRUCTURE
  Mnemos          — episodic store / hippocampus (75,937 docs)
  Tairseach       — inflow / skim, sibling to Mnemos (NEW since v1)
  git-mcp         — git tools exposed to Claude via MCP
  Fiosru          — parallel agentic worker system (NEW since v1)
  Féith           — WireGuard/Headscale private mesh (NEW since v1)
  Sentinel        — IP threat intelligence (NEW since v1)
  foxxelabs-config — project registry and session rituals

COGNITIVE STACK (RESEARCH PIPELINE)
  Radharc         — geometry mapping (UMAP/adjacency over Mnemos)
  Léargas         — GMM manifold / neocortex (PoC complete, scaling)
  Aislinge        — sleep consolidation / REM (Phase 5 complete; Phase 8 PRD committed)
  Mothú           — affective signal / emotion library
  Colainn         — homeostatic / somatic store (medulla)
  Imeall          — structural edge-map of personal understanding (NEW, today)
  Cumadóir        — speculative fiction surface (NEW since v1, light scaffold)
  Macalla         — personalised LLM (PRD v0.2, post-viva build)
  Legion          — distributed AI swarm (slow-burn, SFI horizon 2027)

PRODUCTS & PLATFORMS
  Anseo           — community platform (anseo.irish, live)
  Stór            — direct-sales bookstore (stor.irish, shares Anseo codebase, NEW since v1)
  Rialú           — personal command centre
  Cló             — book formatting / multilingual publishing platform (NEW since v1, PRD complete)
  Scéal           — multi-voice audiobook pipeline
  Glór            — voice creator / TTS (PRD v4)
  ga-say          — Irish pronunciation tool
  foghlaim        — Irish language learning tool
  Lorg            — personal health telemetry
  George          — vision-language memory service
  Someday         — end-of-life digital companion (AfterWords entry)
  Sionnach        — browser historical persona engine (complete)
  Agora           — multi-persona debate engine (deployed private, NEW since v1)
  Taca            — GDPR venting research demonstrator (NEW since v1)
  ucahub          — UCA dissertation public hub (+ stats.ucahub.ie)
  slambridge      — bridge bidding trainer (slambridge.ie, public good)
  AfterWords      — digital legacy avatars (parked; depends on Macalla)

RESEARCH PROGRAMMES
  Miteo           — proto-mitochondrial reconstruction (parked behind viva, NEW since v1)
  MIRM paper      — dissertation companion (early 2027 target)
  BFT paper       — historical-pattern companion (2027 target)
  Reasons for Discord — trade book, long arc (post-submission)
```

---

## <span style="color:#a02020">Priority Framework</span>

| Factor | Weight |
|---|---|
| Deadline pressure | High |
| Strategic value | High |
| Funding potential | Medium |
| Personal interest | Medium |

Derived ranking (May 2026):

1. **UCA Dissertation** — submission 12 June 2026, viva June (date unconfirmed)
2. **Anseo + Stór** — Stór pre-launch checklist clearing for Foxxe Frey direct sales
3. **Cognitive Stack maintenance** — Mnemos health, Aislinge phase progression
4. **Cló MVP** — La Witch: Birthday EPUB import → German translation → epubcheck-clean export
5. **Glór Phase 2** — prosody normalisation (gates Scéal migration)
6. **Féith hardening** — Macalla prerequisite; see dedicated section below
7. **Macalla** — post-viva, gated on Féith hardening + Aislinge Phase 6+ stability
8. **Imeall** — Phase 0 schema agreement; post-viva build
9. **Miteo** — parked until viva + lit-review chapter + one of (BFT draft / Cló MVP)
10. **Legion** — slow-burn, SFI letter Q3 2026
11. **Articles + papers pipeline** — MIRM paper drafting begins post-viva

---

## <span style="color:#a02020">Project Roadmaps</span>

---

### <span style="color:#1e5a8a">UCA Dissertation</span> (`todd427/ucahub`)
**Status:** Active — quantitative analysis complete, Chapter 2 lit review in active gen-writing
**Deadline:** 12 June 2026 (hard); results release 15 June 2026
**Viva:** Sometime June 2026; date still unconfirmed as of 11 May class

#### Quantitative findings (locked)
- N = 164 adult sample, cross-sectional
- PLS-SEM + hierarchical regression converge
- **Retaliatory justification β = .472** — dominant predictor of cybercommunications aggression intent
- **AI block ΔR² = .007** — AI use, AI trust, online disinhibition contribute negligible variance
- **Venting** — independent secondary predictor
- Methodology and reporting checklist follow Hair et al. (2019) + HTMT discriminant validity

#### Theoretical framework
- **MIRM** = dissertation-level synthesis framework (cross-sectional empirical layer)
- **BFT** (Babel Fish Theory) = post-dissertation companion paper (structural/historical theoretical layer)
- VCM and NBH retired — both subsumed
- Both papers share the regulatory-prosthetic / new-node-type claim

#### Done
- Chapter 1 — Introduction ✅
- Chapter 2 — Literature review: §§1–4 generated via fiosru parallel workers (Apr 23, 2026: 4 sections, ~7,200 words, 2m 39s wall time, $17.28 total cost); calibration / integration pass ongoing
- Interactive D3 mindmap (mindmap.html) ✅
- Section 2.9 — Research gaps ✅
- Survey data collection complete (164 responses) ✅
- Full quantitative analysis ✅

#### Next
1. **Chapter 1 full draft before late May** — examiners read it first; sets frame
2. **Chapter 2 final integration** — merge fiosru sections, calibrate against VOICE.md, supervisor pass
3. **Chapters 3–5** — methodology, analysis, discussion
4. **Final submission** — 12 June 2026
5. **Viva preparation** — defend MIRM framing; ΔR²=.007 framed as calibration result, not null failure

#### Satellite work (ucahub.ie + stats.ucahub.ie)
- ucahub.ie: noindex/nofollow until viva; flip public after
- **stats.ucahub.ie** (NEW) — Statistics 101 for Cyberpsychologists deployed at `todd427/stats-course`; synthetic N=167 dataset, R analysis script, textbook HTML

---

### <span style="color:#1e5a8a">FoxxeLabs Cognitive Stack</span>

The cognitive stack is now a coherent multi-layer architecture documented in *The Cognitive Stack — Train of Thought* (foxxelabs-config, 29 March 2026). Two channels (cognitive + somatic) meet at Léargas; Aislinge consolidates; Legion eventually acts.

```
COGNITIVE CHANNEL              SOMATIC CHANNEL
  conversations · docs           biometric · GPS · vision · affect
        │                              │
        ▼                              ▼
    [Mnemos]                       [Colainn] ← [Mothú]
   hippocampus                      medulla    limbic
        │      homeostatic metadata ┘
        │  ◄──────────────────────────
        ▼
    [Léargas]
    neocortex (GMM manifold)
        │
        ▼
    [Aislinge]
    consolidation (NREM + REM)
        │
        ▼
    [Legion]
    embodied action
```

Imeall and Cumadóir branch off this trunk — Imeall as a structural layer above Mnemos, Cumadóir as a fiction-facing consumer of edge-map output.

#### <span style="color:#1e5a8a">Mnemos</span> (`todd427/mnemos`)
**Status:** Operational — **75,937 documents** (live as of 15 May 2026)
**URL:** mnemos.foxxelabs.ie · LHR · always-on

#### Done since v1
- April 8 Anthropic Managed Agents update broke session handling — fixed by removing `stateless_http=True` flag
- Starlette path-stripping bug fixed with ASGI wrapper in `get_asgi_app()`
- Ingestion connectors: email IMAP, Anseo pull, foxxelabs news, APScheduler-driven

#### Next
1. R2 backup cron — still unresolved single point of failure
2. OneDrive + Google Drive ingest gaps — academic material backlog
3. 200k chunk pressure point — ~Jan 2027 at current growth rate
4. Mnemos may need a prod-tier instance before next bulk ingest (cold-start latency)
5. **Qdrant migration evaluation** — post-viva technical spike Jun–Jul 2026 (ChromaDB fine to ~300k; beyond that Qdrant's on-disk HNSW is materially more RAM-efficient)

#### Corpus rules (firm)
- **First-person only** — ingest Todd's words, never other people's words
- Macalla treats Mnemos as its primary training corpus

---

#### <span style="color:#1e5a8a">Tairseach</span> (NEW — inflow / skim service)
**Status:** PRD v0.1 committed (`foxxelabs-config/tairseach/PRD.md`); pre-implementation
**Role:** ArXiv / RSS / PDF watch-folder as v0 sources. Filters and lightly summarises before Mnemos sees the material. **Phase 1 parallel-track to Imeall** per Imeall PRD v0.2.

Distinct from Mnemos because:
- Different ingest velocity (continuous vs episodic)
- Different retention policy (most items decay quickly)
- Different downstream consumers (Imeall edge-extraction, Cumadóir fiction-prompting)

---

#### <span style="color:#1e5a8a">Léargas</span> (`todd427/leargas`)
**Status:** PoC complete (20 March 2026, 1,998 docs); scaling to full corpus
**PRD:** v1.1 committed

#### What it is
GMM (50 components, BayesianGaussianMixture) over 384-dim semantic embedding space. The topology change *is* the memory. Theoretical pillars: Shannon entropy as ingest signal, Wiener negative feedback for homeostasis, Fisher-Rao geometry for distant connections, Collins-Loftus spreading activation.

#### Next
1. **Scale to full corpus** — 75,937 documents; targets include ChatGPT/Claude history, SFT, Anseo, git commits, GDrive hierarchy, writing tracker
2. **Phase 1 GMM drift detection API** — exposes cluster deltas; consumed by Macalla as training trigger
3. **Phase 2** — temporal manifold (poc/temporal_manifold.py validated)
4. **Phase 3** — Fly API service (5 endpoints: probe, reconstruct, diff, frontier, decay_alerts)
5. **CLIP photo embedding** with `spatial_anchor: {lat, lng, timestamp}` (also Legion sensory architecture)

---

#### <span style="color:#1e5a8a">Aislinge</span> (`todd427/aislinge`)
**Status:** Phase 5 cross-corpus complete; **Phase 8 PRD committed** (was Phase 6 future in v1)

Aislinge *is* the sleep process — not a tool that runs on the manifold. NREM extracts beliefs; REM produces deformation vectors that nudge the Léargas manifold.

#### Done
- Phase 1 — Consolidation loop (12 clusters, 17 March) ✅
- Phase 2 — Generative replay (37 bridge statements) ✅
- Phase 3 — Mnemos ingestion (219 bridges, 15 beliefs, source=aislinge) ✅
- Phase 4 — Evaluation (cyberpsych 1.0, ai_crash 0.97) ✅
- Phase 5 — Cross-corpus (chatgpt↔claude↔anseo, Daisy) ✅
- 15 belief clusters rendered in `aislinge.html` (29 March 2026) — system found anxiety/intellectual-engagement separation without prompting

#### Next
1. **Phase 6 — Second-order consolidation** — run Aislinge on `aislinge` source itself (consolidating the consolidations)
2. **Phase 7 — Legion integration** — initialise swarm with consolidated belief layer as prior world model
3. **Phase 8 (PRD committed)** — REM `rem_pass.py` dual-model nightly perturbation on Léargas `frontier()` components

---

#### <span style="color:#1e5a8a">Mothú</span> (emotional state detection / de-escalation)
**Status:** Phase 1–2 complete; local library, not a deployable service
**Role:** Affective signal feed for Colainn (event-driven metrics) and Léargas (experiential axis of GMM). Live baseline-aware prompt injection.

The affective reframe was load-bearing: **affective_salience(doc) = |affect(doc) − baseline(doc.time_window)|**. Deviation, not effort, marks documents as consolidation-worthy.

---

#### <span style="color:#1e5a8a">Colainn</span> (`todd427/colainn`)
**Status:** Repo + domain (colainn.com); March 2026 build
**Role:** Structured time-series biometric store — medulla layer. 15-minute homeostatic snapshots tag Mnemos documents at ingest.

#### Devices
Withings BPM Core (grey, integrated into George), Withings Body Smart, George visual_novelty, Mothú sentiment, GPS speed. **Pixel Watch 3 returned** (band mechanism unusable); **Garmin Venu 4 41mm** ordered as replacement.

#### Next
1. `fly launch` + volume create
2. `app/withings.py` OAuth2 pipeline
3. `app/baseline.py` nightly job
4. Wire George → `visual_novelty` into `/readings` endpoint

---

#### <span style="color:#1e5a8a">Imeall</span> (`todd427/imeall`) — **NEW (15 May 2026)**
**Status:** PRD v0.2 + Schema v0 + Business Plan v0.1 committed; pre-MVP
**Tagline:** *The edge-map of human understanding.*

Three layers — Personal edge-map / Translation between maps / Collective edge-map (federated). Built atop Mnemos as substrate; LLM as commodity infrastructure.

Phase 0 gate: **schema v0 frozen** ✅. Tairseach promoted to Phase 1 parallel-track. MVP gate strengthened to include frontier-overlap test, multi-field validation, second-user requirement, 16-week time-box.

Post-viva build target. Sits in priority queue alongside Macalla and Miteo (see Sequencing below).

---

#### <span style="color:#1e5a8a">Cumadóir</span> — **NEW since v1**
**Status:** PRD v0.1 committed (`foxxelabs-config/cumadoir/PRD.md`); pre-implementation
**Role:** Speculative fiction surface. Separate from knowledge work. Connects incoming scientific literature (via Tairseach) to fiction-in-progress in Todd's authorial voice (via Macalla once trained).

Edge-cluster output from Imeall is one of Cumadóir's input streams.

Gated on Tairseach P0 + Imeall Phase 1 MVP + at least one trained Macalla adapter. Realistic earliest build: mid-2027.

---

#### <span style="color:#1e5a8a">Macalla</span> (`todd427/macalla`)
**Status:** Pre-development; PRD v0.2 + VOICE.md committed to `foxxelabs-config/macalla/`
**Machine:** **Iris (operational since 25 April 2026)** — RTX 5080, 128GB DDR5, Core Ultra 9 285K, Strix 1200W Platinum, Arctic Liquid Freezer III Pro 360
**Build target:** Summer 2026 (post-viva)
**Gating:** Féith hardening must complete first — see dedicated section below.

#### Status correction
v1 listed Iris as "not yet built." Iris is now production-ready following PSU burn-in (2-hour combined CPU+RAM+GPU soak, zero anomalies). The original be Quiet! 1000W died on first power-on; Strix 1200W replacement validated.

#### Key design points
- Base: `Qwen3-8B-Instruct` (native thinking/non-thinking toggle, 128k ctx, Hermes-style function calling native)
- QLoRA via PEFT; vLLM llm-compressor for quantisation
- Corpus: Mnemos (75,937+ docs) weighted by recency + Aislinge salience
- **Hot adapter pair** (yesterday/today) for drift detection and rollback
- **ACD** (Adversarial Contrastive Distillation) flagged for QLoRA data pipeline
- Foxxe Frey backlist (70+ novels) for monologue-mode prose calibration
- Léargas GMM drift detection as training trigger
- Versioned checkpoints: Todd-YYYY-MM
- Training endpoint binds to **Iris-Féith address only** — Féith hardening prerequisite is not optional.

#### Do not begin implementation before 12 June 2026.

---

#### <span style="color:#1e5a8a">Legion</span>
**Status:** Slow-burn research
**Machine:** Iris (now built)
**SFI funding horizon:** 2027

#### Architecture
Drone swarm: n bodies, one mind (distributed proprioception). Unitree manipulator as tool. Peekaboo experiment as social cognition milestone (target 2028–2029).

#### Neurosymbolic layer
SNN via Intel Lava framework — simulation on Daisy/Iris now, Loihi 3 hardware when commercially available (expected late 2026). Intel INRC affiliate membership application recommended post-viva.

#### Non-embodied homeostasis thesis
Mothú + Léargas + Colainn + Aislinge form a *disembodied* homeostasis case. Legion is the *embodied* comparison. Theoretical contribution candidate for eventual Anthropic engagement.

#### Next
1. Agent-to-agent messaging — peekaboo milestone
2. Swarm coordination protocol
3. SFI funding letter — Q3 2026
4. Aislinge Phase 7 integration
5. Stage 1 SNN code in Lava on Daisy GPU

---

### <span style="color:#1e5a8a">Anseo + Stór</span> (`todd427/anseo`)
**Status:** Both live — anseo.irish (community), stor.irish (bookstore). Same Django codebase + Railway infrastructure.
**Branch:** dev → Railway auto-deploy
**Plan:** Railway Pro ($20/mo) for multi-domain

#### Stór (NEW since v1)
- PRD v1.2 committed: `docs/stor_prd.md` on anseo beta branch
- 40+ Foxxe Frey titles, BookFunnel integration (Bestseller plan), Stripe Connect Phase 2
- Phase 1 estimate: 16–20h; Phase 2 white-label: 6–8h
- Revenue model: Phase 1 FoxxeLabs full margin; Phase 2 white-label ~€50–100K/year @ 20–30 indie author clients
- BookFunnel API key stored in Rialú

#### Anseo near-term backlog
- Feed pills, post polish, communities, mod queue, EasyMDE, translation, themes, OAuth2/Kindle/MS, BugTracker P2, civics quiz, daily digest, JOIN_HOSTNAME per-env
- **Django admin IP allowlist middleware** — half-day; uses Féith Daisy exit IP as auth channel. Real security debt with Stór launch pending.

#### Anseo longer-term
- Community wiki, code embeds, chat (Redis), performance, LLM moderation, learning communities, promotions/SumUp, book app
- **Discourse as deliberation layer** (forum.anseo.irish via DiscourseConnect SSO) — deferred until ~50–200 active Anseo users; keep in architectural diagram as "deliberation layer (future)"
- **Anseo → Fly.io migration** (Féith Phase 3) — large, post-viva; unblocks full private networking

---

### <span style="color:#1e5a8a">Cló</span> — **NEW since v1**
**Status:** PRD complete (406 lines), JSON Schema (30 type definitions), worked example committed to `/home/Projects/saothar/`
**Domain:** cloh.ie

#### What it is
Book formatting / multilingual publishing platform. Importable EPUBs → side-by-side translation editor → epubcheck-clean exports.

#### MVP scope (firm)
Import La Witch: Birthday EPUB → translate chapter 1 to German via editor → export two epubcheck-clean EPUBs.

#### Firm rule
**No marketing/promotion before MVP ships.**

---

### <span style="color:#1e5a8a">Glór</span> (`todd427/glor`)
**Status:** PRD v4 committed
**Backend:** Coqui XTTS v2 (MPL 2.0) — StyleTTS2 removed; ElevenLabs ruled out at production volume

#### Tiered backend
- Daisy primary
- Iris secondary (now available)
- Cloud GPU (Modal / RunPod) as authorised-only fallback

#### Next
1. voices.json integration with Sionnach / Agora
2. **Phase 2 — Prosody normalisation** (beat tags → silence injection; gate for Scéal migration)
3. Scéal backend swap (render.py)
4. Macalla / AfterWords integration (todd-primary clone for toddBot)

#### Scéal consumes Glór — not the reverse.

---

### <span style="color:#1e5a8a">Scéal</span> (`todd427/sceal`)
**Status:** Active — v0.6.0; 24/24 unit tests green; 25/25 render baseline clean
**Backend:** Currently dual-engine; awaiting Glór Phase 2 for full migration

#### Done since v1
- Proxy MOS scorer implemented
- Prosody from punctuation (ellipsis, em-dash → beat tags)

#### Next
1. PRD v1.0
2. Anseo post endpoint — `POST /api/v1/post/create/`
3. `foxxe_publish.py` — local wrapper: ingest to Mnemos + POST to Anseo
4. TheInterview demo — full end-to-end render
5. Karaoke engine — sync generated audio with text
6. Glór backend swap (gate: Glór Phase 2 ✅ confirmed)

---

### <span style="color:#1e5a8a">Rialú</span> (`todd427/rialu`)
**Status:** Deployed at rialu.ie · Phase 1 complete
**Auth:** Cloudflare Zero Trust + Google OAuth, `todd@foxxelabs.ie`
**Known issue:** MCP connector broken (May 2026) — diagnosis pending; debugging playbook from April Cloudflare-fronted FastMCP issues may apply

#### Next
0. **Tier 0 acute:** diagnose and fix MCP connector failure
1. Phase 2 — Machine agents (Daisy, Iris, Lava, Synology). Rose excluded (unreliable; pending Féith removal).
2. Anthropic usage API poller (daily) — budget tab per-project
3. Timeline + Kanban views in Projects tab

---

### <span style="color:#1e5a8a">Fiosru</span> — **NEW since v1**
**Status:** Last confirmed working 23 April 2026 (Chapter 2 lit review run, 4 sections, ~7,200 words, 2m 39s, $17.28). **Currently broken per session 15 May; diagnosis pending.**
**Role:** Spawn multiple Claude workers in parallel for research / drafting / synthesis

#### Four bugs found and fixed in April 2026
1. Mnemos unreachable (HTTP 404) — fixed via proper MCP federation
2. Daily spend cap was per-invocation, not cumulative — fixed
3. Default model was Opus 4.7; now Sonnet 4.6 default with explicit Opus override for novelty / cross-domain / prior-art sweeps
4. Schema migration gap — CC federation commit added `mcp_servers` column but `CREATE TABLE IF NOT EXISTS` didn't alter existing table; fixed

#### Fork rule (firm)
**Never call `fork_result` with `wait_seconds` in same turn as `fork_task`.** Fork for cognitive-flow preservation; collect result on Todd's next message.

#### Tier 0 acute
Diagnose current failure. Whatever broke since 23 April needs investigation, not assumption. ~half-day to diagnose; another half to fix once identified.

---

### <span style="color:#1e5a8a">Sentinel</span> — **NEW since v1**
**Status:** Live IP threat intelligence on Fly.io
**Known issue:** SQLite persistence bug — Fly.io ephemeral storage; dedicated CC sentinel instance planned

---

### <span style="color:#1e5a8a">Féith</span> — **NEW since v1**
**Status:** Operational at Phase 0 — feith.foxxelabs.ie
**Topology:** Headscale on Fly.io LHR · any-to-any mesh (implicit ACLs) · Daisy primary exit node
**Operational nodes:** Daisy, Lava, mobile
**Pending Phase 1:** Iris join, Synology join
**Pending decision:** Rose removal (untrusted — overnight crashes; see Féith Hardening section)
**PRD:** `foxxelabs-config/feith/PRD.md` (note: PRD node table needs Rose+Synology update)

**Critical architectural role:** trust boundary separating OAuth-exposed public tier (Mnemos, Taisce, Rialú, Eric, Git-mcp, Sentinel, Flyer) from private tier (Faire, Macalla, Comhoibrí, Breith, Legion control plane, hardware nodes). Private-tier services skip OAuth/rate-limit/audit/tenant scaffolding because they assume caller-is-Todd — that simplification (~300 lines vs ~3,000) only holds while the boundary itself is healthy. **Féith health is a hard prerequisite for any private-tier service shipping safely**, including Macalla.

---

### <span style="color:#1e5a8a">Eric</span> — **NEW since v1**
**Status:** Live at eric.foxxelabs.ie · repo `todd427/mark`
**Known issues:** Trust deficit not resolved by April hallucination-guard patch (6675a20); UI bug pending; scope review likely more productive than further patches

Eric exposes 10 tools (`ask_eric`, `generate_ad_pack`, `get_digest`, `get_mood`, `get_pipeline`, `get_ranking`, `get_signals`, `get_terra_brief`, `run_monitor`, `set_mood`). Surface area may be the actual problem.

#### Tier 0 acute
Scope review before another patch: which tools are actually used? Could surface be cut by half? Trust restoration is a structural question, not a single-bug fix.

---

### <span style="color:#1e5a8a">Taca</span> — **NEW since v1**
**Status:** GDPR-compliant venting research demonstrator
**Requirements:** WCAG AAA · GDPR consent splash · privacy/about pages · soft turn cap (MAX_TURNS=6, SOFT_WARN=4)
**Stack:** WebNN for ML inference
**Open:** completion status unclear — feeds dissertation citation or independent paper? Decide post-viva.

---

### <span style="color:#1e5a8a">Agora</span>
**Status:** Deployed (private) — duel.foxxelabs.ie via Cloudflare Zero Trust; public directed to GitHub
**Update since v1:** Was "pre-development." Now operational.

18 personas · 6 collections · WCAG AAA · Duel (dual-Claude interface) identified as structural REM-sleep implementation

---

### <span style="color:#1e5a8a">slambridge</span> (`todd427/slam-auction-interactive`)
**Status:** Live at slambridge.ie · Railway · public good
**Stack:** Python Flask + Claude API (Haiku), static HTML frontend
**Costs:** ~$1.50/month
**Activity:** Low-touch maintenance; scenario additions as feedback arrives; no active promotion or stats collection

Bridge bidding trainer: 30+ scenarios, two modes (Single Decision + Full Auction with AI opponents), Bridge 101 tutorial. Anseo community at "Slambridge" exists for player discussion.

---

### <span style="color:#1e5a8a">Lorg / George / Mothú</span>
- **Lorg** — GPS/health telemetry, Garmin (Venu 4 41mm incoming) + Withings, nightly Mnemos ingest
- **George** — vision-language (moondream2), `/look/json` endpoint added (base64 + context + ts + lat/lng), now on Railway auto-deploy
- **Mothú** — see Cognitive Stack section

---

### <span style="color:#1e5a8a">ga-say + foghlaim</span> (sionnach.ie)
Azure Neural TTS (foxxespeech, North Europe, free F0 tier). Word list expansion + dialect tagging ongoing.

**Reminder:** After next Mnemos update, check if *fís* (entrepreneur incubator, on hold) is now indexed — update ga-say `words.js` description if found.

---

### <span style="color:#1e5a8a">Someday / AfterWords</span>
**Status:** Web-first pivot confirmed — Vite + React + TypeScript, Web Crypto API + OPFS, Cloudflare Pages
**Domain:** someday.irish
**VOICE.md v0.1** — three-session onboarding; word "death" never appears in product; AfterWords/Macalla connection invisible to users

AfterWords parked behind Macalla. The full stack:
```
Macalla checkpoint + Mnemos + Glór + Someday = toddBot
```

---

### <span style="color:#1e5a8a">Miteo</span> (`todd427/miteo`) — **NEW since v1**
**Status:** Parked behind viva. Repo + scaffolding created 2 May 2026.

#### What it is
Proto-mitochondrial reconstruction via endosymbiotic back-extrapolation. AI-assisted research programme. Now framed as a *Directing AI* discipline case study — a worked example of the discipline applied to a real scientific question in real time.

#### Phase map
- Phase 0 — Primer (~$40–80)
- Phase 1 — Lit corpus (~$300–500)
- Phase 2 — Sub-investigations (~$200–400)
- Phase 3 — Synthesis (~$100–200)

#### Gate
Unparking requires **all three**:
- Lit review chapter drafted
- Viva passed
- At least one of: BFT paper drafted OR Cló MVP shipped

---

### <span style="color:#1e5a8a">CyberSafer / Sionnach / dirs / Park / tionol</span>
- **CyberSafer** — **live** (public good); not actively collecting stats; not promoted; **ICO registration outstanding** (Tier 0 acute admin item)
- **Sionnach** — complete; maintenance only; foundation for Agora
- **dirs** — complete; deploy on Iris (now available)
- **Park** — active; EAS build pending. Decision needed: continue or formally close
- **tionol** — placeholder; post-viva

---

### <span style="color:#1e5a8a">Articles + Papers Pipeline</span>

#### Done / submitted
- *We Have Met the AI, and He Is Us* — submitted to Irish Times opinion desk 25 March 2026 (no reply confirmed)
- *Warp Speed / Architect and Coder* — published to foxxelabs.ie (no longer use Substack)
- AI timeline page — live at foxxelabs.ie

#### Planned (post-viva)
- **MIRM paper** — dissertation companion — early 2027 target
- **BFT paper** — historical-pattern + Crockett 2017 supply-side / Ecclesiastes-Tocqueville-Gurr demand-side — 2027 target
- **McCaffrey 2026b** historical-pattern companion — 2028+
- **Reasons for Discord** trade book — long arc, post-submission focus

---

## <span style="color:#a02020">Machines (current)</span>

| Machine | Status | Spec | Role |
|---|---|---|---|
| **Daisy** | Daily driver (as of May 2026) | Ubuntu, RTX 5060 OC, 128GB RAM | Development, Aislinge runs, GPU work |
| **Iris** | Operational (PSU validated 25 Apr 2026), currently powered off | Ubuntu 24.04, RTX 5080, 128GB DDR5, Core Ultra 9 285K, Strix 1200W Platinum, Arctic Liquid Freezer III Pro 360 | Macalla training, Léargas scaling, Legion sim |
| **Lava** | Active (new March 2026) | ASUS ProArt P16, AMD Ryzen AI 9 HX 370, Radeon 890M, 64GB RAM, 3.73TB, WSL2/Windows | Laptop / travel |
| **Rose** | **Active but unreliable** — overnight crashes suggest end-of-life | Windows + WSL2, RTX 5070, 64GB | Untrusted; Féith mesh removal pending (see Féith Hardening) |
| **Synology** | To be onboarded to Féith | NAS | Backups, archives, working-data store |

---

## <span style="color:#a02020">Dependency Graph</span>

```
Mnemos
  ├── Radharc → Aislinge → {Legion P7, Macalla anchors}
  ├── Léargas → Macalla (drift trigger)
  ├── Macalla → AfterWords / toddBot
  ├── Imeall → Cumadóir
  ├── Scéal (session ingestion)
  └── Rialú (Phase 4 session summaries)

Tairseach (inflow)
  ├── Mnemos (filtered hand-off)
  ├── Imeall (edge-extraction)
  └── Cumadóir (fiction prompts)

Féith (trust boundary)
  ├── gates Macalla deployment
  ├── gates Comhoibrí MCP
  ├── gates Breith MCP
  ├── gates Faire dashboard
  └── gates Legion control plane

Sionnach
  ├── ga-say (theme system)
  ├── foghlaim (TTS proxy via ga-say)
  └── Agora (DEPLOYED)

Anseo
  ├── Stór (same codebase, stor.irish)
  ├── Legion (social observation environment)
  ├── Mnemos (pull pipeline)
  └── foghlaim (potential — pending decision)

Glór
  ├── Scéal (routing layer — gate: Phase 2)
  ├── Sionnach (voices.json schema)
  └── AfterWords / Macalla (todd-primary voice clone)

Colainn
  ├── Lorg (telemetry source)
  ├── George (visual_novelty source)
  └── Mothú (sentiment metrics source)

Someday
  └── AfterWords (entry point)

Cló
  └── Stór (long-term: Cló-produced EPUBs feed Stór)
```

---

## <span style="color:#a02020">Féith Hardening — Macalla Prerequisite</span>

Féith is the trust boundary that lets private-tier services skip the OAuth / rate-limit / audit / tenant scaffolding a public service requires. Macalla, Comhoibrí, Breith, Faire, and Legion control plane all assume Féith is healthy. **Féith hardening therefore precedes Macalla deployment, not parallels it.**

| Task | Effort | Why it gates Macalla |
|---|---|---|
| **Rose removal decision** | Hours | Untrusted node + overnight crashes inside the trust boundary is an active gap. Three options: take Rose off Féith (recommended), replace Rose, or document accepted risk (worst — explicitly built a trust boundary then placed an untrusted node inside it). |
| **Iris joins Féith** | ~10 min once powered on | Macalla training endpoint binds to Iris-Féith address only. Without this, Macalla either delays or ships less safely. |
| **Synology joins Féith** | ~15 min + PRD update | Backup/archive store reachable from mesh nodes. PRD currently does not include Synology — topology section needs update. |
| **Féith RUNBOOK** | ~1 day | Headscale config, node onboarding, coordinator-down recovery, key rotation, service-binding verification. Becomes urgent the first time something breaks at 11pm. PRD itself flags this gap. |
| **Phase 2 ACL policy** | ~half day | Replace implicit any-to-any with declared groups (personal devices / coworker nodes / hardware nodes). Recommended once node count ≥5 (Iris + Synology takes us there). |

**Total effort: 2–4 days of focused work.** Not large in hours, but cannot be skipped before Macalla training begins. Slots into the late-May or immediate-post-viva window.

The Anseo admin IP allowlist middleware (under Anseo + Stór above) is a separate small task that uses Féith as the auth channel but is not a Féith project itself.

---

## <span style="color:#a02020">Tier 0 Acute Infrastructure Debt</span>

Items that are degraded and should be addressed before they compound. None alone is a project; collectively they are 2–4 days of focused work that removes silent tail risks before they compound into post-viva blockers.

| Item | Effort | Risk if deferred |
|---|---|---|
| **fiosru diagnose + fix** | ~1 day | No parallel-worker support for MIRM/BFT paper drafting; Imeall MVP cannot run multi-stream extraction |
| **Rialú MCP connector** | ~half day | Manual MCP management during Macalla buildout when MCP work will be intensive |
| **Mnemos R2 backup cron** | ~1–2 days | Single point of failure on most load-bearing infrastructure; compounds with corpus growth |
| **Eric scope review + UI bug** | ~half day review, work TBD | Untrustworthy marketing pipeline during Stór launch |
| **CyberSafer ICO registration** | ~half day admin | Compliance gap on a live public service |
| **Rose decision** | Hours | Untrusted node inside Féith trust boundary (see Féith Hardening) |

---

## <span style="color:#a02020">Post-Viva Sequencing (Open)</span>

Three large post-viva projects compete for the same slot. **All three assume Féith hardening is complete** (see preceding section) since each ships into the private tier.

| Project | Effort | Trigger | Strategic value |
|---|---|---|---|
| **Macalla** | Months | Féith hardened ✅; Iris available ✅; Aislinge Phase 6 stable | Enables AfterWords; voice-anchored output for Cumadóir; unblocks several downstream items |
| **Imeall** | Months (Phase 1 alone is 4 months per PRD v0.2 with Tairseach parallel) | Schema v0 frozen ✅ | Personal frontier visibility; eventually federation |
| **Miteo** | Phases 0–3 over months | All three gates (lit review + viva + BFT/Cló) | Directing AI case study; publishable research |

<span style="color:#cc6600">**Decision deferred.**</span> Worth being explicit with yourself before mid-June — running all three in parallel will fragment attention. Recommendation: Macalla primary (largest downstream unblock + Iris sunk cost); Imeall secondary (PRD work done, build is mechanical); Miteo parked per its own gating until lit review + (BFT/Cló) clears.

---

## <span style="color:#a02020">Horizon Summary</span>

### <span style="color:#1e5a8a">Immediate (May 2026)</span>
- **UCA:** Chapter 1 full draft by late May; Chapter 2 fiosru-section integration; Chapters 3–5
- **Stór:** clear pre-launch checklist; BookFunnel page IDs for all 40 titles
- **Cló:** MVP — La Witch: Birthday EPUB → German chapter 1 → epubcheck-clean export
- **Mnemos:** R2 backup cron; OneDrive + Google Drive ingest gaps
- **Glór:** Phase 2 prosody normalisation
- **Aislinge:** Phase 6 second-order consolidation (if Phase 5 evaluation passes gap-topic threshold)
- **Tier 0 acute infrastructure:** fiosru, Rialú MCP, Mnemos R2, Eric scope review, CyberSafer ICO, Rose decision
- **Féith hardening:** Iris join, Synology join, RUNBOOK, Phase 2 ACLs — before Macalla training begins

### <span style="color:#1e5a8a">Short term (May–June 2026)</span>
- **Submit dissertation** 12 June 2026
- **Viva** sometime June (date pending)
- Anseo Sprint 3a — visual white-label
- Anseo admin IP allowlist middleware (Féith Daisy exit IP as auth channel)
- Scéal — PRD + Anseo post endpoint + TheInterview demo
- Léargas Phase 1 — GMM drift detection API

### <span style="color:#1e5a8a">Medium term (post-viva, Summer 2026)</span>
- **Féith hardening complete** (if not done pre-viva)
- **Mnemos Qdrant migration evaluation** — Jun–Jul technical spike
- **Macalla / Imeall / Miteo** — primary/background/parked decision
- Agora — already deployed; continue persona expansion
- Legion — swarm coordination protocol, SFI letter Q3 2026
- Aislinge Phase 7 — Legion integration
- MIRM paper — begin drafting
- Intel INRC affiliate membership application

### <span style="color:#1e5a8a">Long term (2027+)</span>
- **MIRM paper** — early 2027 submission
- **BFT paper** — 2027 submission
- **Macalla:** Todd-2026 → Todd-2027 → AfterWords integration
- Legion: Peekaboo experiment (target 2028–2029)
- Imeall Layer 2 (translation) → Layer 3 (federation, alpha)
- Cumadóir build (post-Macalla pen-name adapters)
- Cló: Phase 2 white-label
- **Reasons for Discord** trade book — ongoing
- Anseo → Fly.io migration (Féith Phase 3)
- *Paper:* GMM-annotated LoRA at solo-dev scale (post-viva venue TBD)

---

## <span style="color:#a02020">Legal / Brand</span>

- **FoxxeLabs** remains the brand
- Legal entity name in flux: user reports "FoxxeLabs Limited" was rejected by CRO and "Toddsailab" is pending. <span style="color:#cc6600">**Not yet confirmed in Mnemos** — verify CRO status before any contractual work.</span>
- Domain assets and brand assets transfer agreements drafted earlier in 2026 referenced *FOXXELABS LIMITED* — review against current legal entity status

---

## <span style="color:#a02020">Session-Start Ritual</span>

1. `mnemos:get_doc_count` — verify Mnemos alive (current baseline: 75,937)
2. `git_list_repos` — ground truth on active repos
3. Read `foxxelabs-config/projects.json` — current intent
4. Mnemos query: `"project status active FoxxeLabs"` — surface surprises since last session
5. Check Daisy for overnight long-running jobs (Aislinge, Scéal render, Radharc)
6. Iris currently powered off — power-up if Macalla training or Léargas scaling work is on deck
7. Féith node health — `tailscale status` from a mesh node before any private-tier work

---

*FoxxeLabs Roadmap v2.1 — 15 May 2026*
*Generated-with: Claude Opus 4.7*
*Diff vs v2: Rose status corrected (alive but unreliable, Féith removal pending); Synology added to machine inventory and Féith Phase 1; Féith Hardening tier added as explicit Macalla prerequisite; Tier 0 Acute Infrastructure Debt section added (fiosru / Rialú MCP / Mnemos R2 / Eric / CyberSafer ICO / Rose); Rialú and Fiosru and Eric current-status updates; slambridge added to inventory; CyberSafer status corrected (live, not paused); Mnemos Qdrant migration line added; Tairseach and Cumadóir PRDs noted as committed; Imeall PRD bumped to v0.2 reference.*
*Diff vs v1: 11 new projects added, 4 status corrections, 1 framework rename (BFT → MIRM as dissertation theory), Iris operational, Féith hardening tier added as Macalla prerequisite, post-viva sequencing decision flagged as open.*
