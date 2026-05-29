# <span style="color:#a02020">Tairseach</span>

> *tairseach* /ˈt̪ˠaɾʲʃəx/ — Irish: **threshold, doorstep, sill**. The physical edge where one space ends and another begins.

**Tagline:** *The threshold between outside and Mnemos.*

**PRD version:** v0.1 (draft)
**Date:** 15 May 2026
**Owner:** Todd McCaffrey / FoxxeLabs
**Status:** Pre-implementation. **Phase 1 parallel-track per [Imeall PRD v0.2 §7](../../../imeall/docs/PRD.md).**
**Implementation repo:** `todd427/tairseach` (not yet created)

---

## <span style="color:#a02020">1. Vision</span>

Tairseach is the inflow service for the FoxxeLabs cognitive stack. It watches a defined set of external sources (preprint servers, RSS, PDF folders), filters and lightly summarises what arrives, and hands the result over to Mnemos for episodic storage and to Imeall for structural extraction.

It is a **threshold**, not a library. Items live in Tairseach briefly — long enough to be evaluated, lightly summarised, and handed off (or dropped). Persistence is downstream's job, not Tairseach's.

The architectural separation from Mnemos is deliberate:

- **Different ingest velocity.** Mnemos ingests episodic content at Todd's working pace. Tairseach handles continuous high-volume inflow from external feeds.
- **Different retention policy.** Mnemos retains effectively forever (first-person corpus). Tairseach decays aggressively — most arXiv papers Todd glances at should not enter the permanent record.
- **Different downstream consumers.** Mnemos serves retrieval. Tairseach serves Imeall edge-extraction and Cumadóir fiction-prompting in addition to feeding Mnemos selectively.
- **Different failure mode tolerance.** If Mnemos goes down, Todd loses memory. If Tairseach goes down, Todd loses *yesterday's* arXiv feed — recoverable.

Without Tairseach operational, the Imeall frontier map can only reflect what was already in Mnemos at Phase 1 start. Peer review lags 12–24 months; arXiv `cs.AI` doubles every ~2 years. Yesterday's frontier is the wrong frontier.

---

## <span style="color:#a02020">2. Position in the Stack</span>

```
EXTERNAL WORLD
   arXiv · bioRxiv · RSS · PDF watch folder · (later) GitHub · talks
        │
        ▼
   ┌─────────────────────────┐
   │      TAIRSEACH          │
   │  threshold / skim       │
   │                         │
   │  filter → score →       │
   │  summarise → decide:    │
   │   • promote to Mnemos   │
   │   • notify Imeall       │
   │   • flag Cumadóir       │
   │   • or expire           │
   └─────────┬───────────────┘
             │
        ┌────┴──────────┐
        ▼               ▼
    [Mnemos]        [Imeall]
   (selective)    (extraction
                   trigger)
                      │
                      ▼
                  [Cumadóir]
                  (fiction
                   prompts)
```

Tairseach is upstream of Mnemos for external sources. Mnemos remains the primary ingest path for first-person material (Todd's own writing, conversations, notes).

**Rule:** Tairseach never bypasses Mnemos for material that's promoted to permanent record. Promotion path is always Tairseach → Mnemos → downstream. Imeall and Cumadóir receive *notifications* from Tairseach about new high-signal items, but they read from Mnemos.

---

## <span style="color:#a02020">3. v0 Sources</span>

| Source | Mechanism | Volume estimate | Priority |
|---|---|---|---|
| **arXiv `cs.AI` / `cs.LG` / `cs.CL`** | OAI-PMH API or arXiv API | ~150–200 papers/day combined | P0 — MVP |
| **arXiv `cs.CR` / `cs.HC` / `cs.CY`** | OAI-PMH API | ~50 papers/day | P0 — MVP (cyberpsych adjacency) |
| **bioRxiv / medRxiv** | RSS / API | ~150 papers/day combined | P1 — Phase 1 late |
| **RSS feeds (user-curated)** | Standard RSS/Atom | Highly variable | P0 — MVP |
| **PDF watch folder** | Local filesystem watch | User-driven | P0 — MVP |
| **arXiv `cs.NE` / `cs.RO`** | API | ~30 papers/day | P1 — Legion-relevant |
| **AlignmentForum / LessWrong** | RSS | ~10 posts/day high-signal | P2 |
| **GitHub trending in tracked topics** | GitHub API | Variable | P2 |
| **Conference proceedings (NeurIPS / ICML / ACL / CHI)** | Manual or API where available | Bursty | P2 |
| **YouTube talks (specific channels)** | YouTube RSS + transcript extraction | Bursty | P3 |

P0 ships in Tairseach MVP. P1 ships in Phase 1 of Imeall (parallel-track). P2/P3 deferred to later phases.

---

## <span style="color:#a02020">4. Architecture</span>

### <span style="color:#1e5a8a">Service shape</span>

- **Stack:** Python 3.12 + FastAPI + APScheduler (matches Mnemos for operational familiarity)
- **Database:** PostgreSQL on Fly.io (queue + dedup state + scoring state)
- **Storage:** Fly volumes for PDF cache; OCR results cached
- **Deployment:** `tairseach.foxxelabs.ie` on Fly LHR (co-located with Mnemos for low-latency hand-off)
- **Workers:** background poller + scoring worker + promotion worker; each independent

### <span style="color:#1e5a8a">Connectors (per source type)</span>

Each source is a connector implementing a small interface:

```python
class Connector(Protocol):
    source_type: SourceType            # 'arxiv', 'biorxiv', 'rss', 'pdf_watch', ...
    def poll(self) -> list[RawItem]: ...
    def fetch_full(self, item: RawItem) -> FullItem: ...
    def credibility_prior(self) -> float:  # default by source_type
```

Connectors are rate-limited individually (arXiv has clear API etiquette: ≤1 req/3s on the API, sleeping enforced). Failures don't cascade — one connector down does not stop others.

### <span style="color:#1e5a8a">Pipeline</span>

1. **Poll** — each connector polls on its own schedule (arXiv daily, RSS hourly, PDF watch continuously)
2. **Dedup** — content hash against previously seen items; abstract-level similarity for arXiv revisions
3. **Score** — relevance to user's active fields (lightweight embedding similarity against a small set of field vectors, derived from Léargas)
4. **Summarise** — for items above score threshold: LLM-driven brief summary (~150 words). Sonnet by default; cheap. **Not deep extraction — that's Imeall's job.**
5. **Decide** —
   - High score + above promotion threshold → promote to Mnemos with full metadata, notify Imeall
   - Medium score → hold in Tairseach for review; expire if not promoted within N days
   - Low score → drop with audit log entry (so the user can see what was filtered)
6. **Hand-off** — promoted items posted to Mnemos via existing ingest API with `source=tairseach` and full provenance metadata

### <span style="color:#1e5a8a">Cumadóir flagging</span>

A parallel scoring path tags items that look fiction-relevant (concept clusters near "speculative biology," "alternative cognition," "long-term futures," etc., derived from user-defined Cumadóir interest seeds). Tagged items get noted in a separate Cumadóir queue; not auto-promoted to Mnemos, surfaced for review.

---

## <span style="color:#a02020">5. Metadata Contract with Mnemos and Imeall</span>

This is the critical interface — Tairseach is the source of source-credibility metadata that feeds Imeall's confidence calculations (per [Schema v0](../../../imeall/docs/schema/SCHEMA-V0.md)).

Every item promoted to Mnemos carries:

```yaml
tairseach_metadata:
  tairseach_id: uuid                # opaque
  source_type: enum                 # arxiv | biorxiv | rss | pdf_watch | github | proceedings | blog | forum | other
  source_uri: string                # canonical URL
  source_title: string              # paper title / post title / filename
  authors: list[string]             # where available
  published_at: timestamp           # original publication date
  ingested_at: timestamp            # when Tairseach saw it
  promoted_at: timestamp            # when handed to Mnemos
  field: string                     # primary field (from Imeall field vocab)
  fields_secondary: list[string]
  relevance_score: float            # [0,1], how Tairseach scored it
  credibility_prior: float          # [0,1], from source_type (per Imeall Schema v0)
  tairseach_summary: string         # 150-word brief
  user_credibility_override: float  # optional, propagates if user set one
  cumadoir_flagged: bool
```

Imeall's extraction pipeline reads this metadata when building Source nodes — Imeall doesn't have to re-derive credibility, field, or provenance from raw text.

---

## <span style="color:#a02020">6. Decay Policy</span>

Tairseach's defining behaviour. Most items are noise; the policy must aggressively drop them while preserving the rare high-signal item until Todd has had a chance to evaluate.

### <span style="color:#1e5a8a">States</span>

| State | TTL | Notes |
|---|---|---|
| `pending` | 24 hours | Newly polled, not yet scored |
| `scored_high` | Indefinite | Auto-promoted to Mnemos on next worker tick; state is transient |
| `scored_medium` | 14 days | Held for user review; surfaces in daily/weekly digest |
| `scored_low` | 7 days then dropped | Logged for audit; not surfaced |
| `promoted` | N/A | Lives in Mnemos now; Tairseach record is metadata-only reference |
| `expired` | Audit log only | Was held, not promoted, now gone |
| `cumadoir_queued` | 30 days | Parallel state; user reviews from Cumadóir UI |

### <span style="color:#1e5a8a">Promotion thresholds (v0 seeds, calibrate over time)</span>

- `relevance_score >= 0.75` → auto-promote
- `0.50 <= relevance_score < 0.75` → scored_medium, surface in digest
- `relevance_score < 0.50` → scored_low, drop after 7 days

Thresholds are per-source-type adjustable. arXiv `cs.AI` may need a higher threshold than bioRxiv because of volume.

### <span style="color:#1e5a8a">User overrides</span>

- "Always promote from this RSS feed" — bypasses scoring
- "Never promote from this source" — drop on poll
- "Manual review queue" — never auto-promote, always go to medium queue
- Per-item: "promote now" / "drop" / "send to Cumadóir"

---

## <span style="color:#a02020">7. Non-Goals</span>

- <span style="color:#cc6600">**Not** deep extraction.</span> Tairseach summarises lightly (~150 words). Concept/claim/question extraction is Imeall's job, done against Mnemos-stored content.
- <span style="color:#cc6600">**Not** a reader app.</span> No reading UI, no annotations, no highlights. Tairseach hands off; reading happens in whatever tool Todd prefers.
- <span style="color:#cc6600">**Not** a citation manager.</span> Zotero / Mendeley / Paperpile exist. Tairseach's metadata is sufficient for citation downstream but it doesn't manage bibliographies.
- <span style="color:#cc6600">**Not** a search engine.</span> Search is Mnemos's job, against permanent content.
- <span style="color:#cc6600">**Not** social.</span> No sharing, no following, no recommendations from other users. Each Tairseach instance is per-user.
- <span style="color:#cc6600">**Not** persistent storage.</span> Items expire by default. The threshold lets things through; it does not hold them.

---

## <span style="color:#a02020">8. MVP Scope</span>

### <span style="color:#1e5a8a">Deliverables</span>

1. **Service skeleton** — FastAPI + APScheduler + PostgreSQL on Fly.io
2. **P0 connectors only:**
   - arXiv (`cs.AI`, `cs.LG`, `cs.CL`, `cs.CR`, `cs.HC`, `cs.CY`)
   - RSS (user-curated feed list)
   - PDF watch folder (Fly volume + local sync)
3. **Scoring layer** — relevance score against a small set of field vectors (Léargas-derived if available, hand-tuned if not)
4. **LLM summarisation** — Sonnet-by-default, ~150 words, with caching
5. **Mnemos hand-off** — full metadata contract per §5; integration tested against current Mnemos prod
6. **Imeall notification** — webhook or queue entry per promoted item (Imeall consumes when ready in Phase 1)
7. **Daily digest** — single email or in-Anseo post with scored_medium items for review
8. **Audit log** — what got dropped, what got promoted, with reasons. Important for trust calibration in Phase 1.
9. **Decay worker** — TTL enforcement per §6

### <span style="color:#1e5a8a">MVP success criteria</span>

1. **Operational stability** — runs for 4 consecutive weeks with no manual intervention beyond config tweaks
2. **Volume sanity** — across all P0 connectors, ≤20 items/day reach scored_medium for user review (otherwise user is overwhelmed)
3. **Recall** — across a 4-week period, ≤2 items that the user later wishes had been promoted were dropped to scored_low (this requires the audit log to be checkable)
4. **Precision** — of items auto-promoted to Mnemos, ≥80% are judged by the user "worth keeping" on weekly retrospective
5. **Field coverage** — items promoted span at least 3 distinct fields per week (otherwise scoring is field-collapsing)
6. **Mnemos hand-off correctness** — every promoted item appears in Mnemos with complete tairseach_metadata block; Imeall can construct a Source node from it without re-derivation

Criteria 3 and 4 are the precision/recall pair. Both must hold — otherwise the filter is either too aggressive (dropping good stuff) or too permissive (drowning the user).

### <span style="color:#1e5a8a">Out of MVP</span>

- P1/P2/P3 connectors
- GitHub repository monitoring
- YouTube transcript extraction
- Multi-user (Tairseach is single-instance per user in MVP)
- Cumadóir flagging (parallel queue exists in schema; UI deferred)
- Adaptive scoring (thresholds are static in MVP)

---

## <span style="color:#a02020">9. Phasing</span>

| Phase | Scope | Effort estimate | Gate |
|---|---|---|---|
| **0** | This PRD; service skeleton scoped | 1 week | PRD reviewed |
| **1a** | Service skeleton + arXiv connector + Mnemos hand-off | 3 weeks | One arXiv paper successfully promoted to Mnemos with full metadata, retrievable by Imeall extraction |
| **1b** | RSS + PDF watch folder + scoring + summarisation | 4 weeks | All P0 connectors running; daily digest works |
| **1c** | Decay worker + audit log + threshold calibration | 2 weeks | MVP success criteria 1–4 measured over 4 weeks |
| **2** | Cumadóir flagging UI; bioRxiv / medRxiv; user override controls | 3 weeks (post-MVP) | Cumadóir review queue working; second-user test |
| **3** | P2 connectors (AlignmentForum, GitHub trending, proceedings) | Phased | Each connector standalone |

Total Phase 1 (a + b + c): **~9 weeks** in parallel with Imeall MVP. Aligns with Imeall PRD v0.2's 16-week Phase 1 time-box; Tairseach should be functional by Imeall MVP week 12 so that Imeall criterion 2 (reading priority change from Tairseach inflow) can be measured for 4 weeks.

---

## <span style="color:#a02020">10. Trade-offs, Stated Explicitly</span>

- **Aggressive decay vs FOMO.** Default-decay means Todd will sometimes wish a dropped item had been kept. Mitigation: audit log is queryable; user can override threshold per source; recall test in MVP criteria.
- **Light summary vs deep extraction.** Tairseach summaries are deliberately shallow (~150 words). Risk: user reads summary, doesn't open full paper, misses nuance. Mitigation: summary always linked to source URI; Imeall's deep extraction (once it runs) reads the full text from Mnemos.
- **Volume vs signal.** P0 alone could push ~200+ items/day across arXiv. MVP criterion 2 caps user-review queue at ≤20/day. The scoring threshold does the work; failure mode is scoring-too-strict (low recall). Calibrate.
- **Mnemos write amplification.** Every promotion is a Mnemos write. Mnemos at 75K+ docs already has growth concerns. Tairseach's promote-rate target: ≤10/day average → ~3,650/year → still within current Mnemos capacity. But the calculus changes if multiple Tairseach instances exist later.
- **Source diversity vs scoring bias.** If scoring uses Léargas field vectors, items in fields where Todd already has corpus density get scored higher. Tairseach risks reinforcing existing knowledge clusters rather than expanding them. Mitigation: include a "novelty bonus" in scoring for items in low-density fields. Genuine concern — flagged for Phase 2 calibration.

---

## <span style="color:#a02020">11. Open Questions</span>

1. **Scoring model.** Léargas-derived field vectors require Léargas at scale (currently PoC). Fallback: hand-tuned keyword/embedding sets. Decision before Phase 1b.
2. **PDF OCR.** PDFs from watch folder need OCR for image-only scans. Tesseract local? GPT-4o vision API? Anthropic vision API? Cost trade-off. Decision before Phase 1b.
3. **arXiv revisions.** When a paper is replaced with a new version, what happens to the Mnemos copy of the prior version? Likely: keep both, link them. Schema implication for Mnemos.
4. **User-defined fields vs Imeall vocabulary.** Tairseach assigns `field` per item. If user creates a new field in Imeall (v1 feature), Tairseach needs to learn it. Synchronisation question.
5. **Federation (long-term).** If multiple Tairseach instances eventually exist (multi-user Imeall), can they share filtered feeds? Probably not — single-user filtering is the point. But worth noting.
6. **Cumadóir interface.** Schema reserves `cumadoir_flagged: bool` but Cumadóir doesn't exist yet. What's the actual consumption pattern? Defer until Cumadóir PRD is written.
7. **Hosting.** `tairseach.foxxelabs.ie` subdomain — confirm with Cloudflare DNS / Fly.io deployment plan.

Decisions 1 and 2 are blocking for Phase 1b. The rest can resolve during Phase 1 or 2.

---

## <span style="color:#a02020">12. Why Tairseach, Why Phase 1</span>

The Imeall PRD v0.2 promoted Tairseach to a Phase 1 parallel-track because the alternative was building a frontier map of yesterday's frontier. arXiv `cs.AI` doubles every two years. Peer review lags 12–24 months. Without fresh inflow, the Imeall MVP would measure whether the schema works against static Mnemos content — useful but not the actual test.

Tairseach is also load-bearing for the Imeall MVP's reading-priority-change criterion: "at least 3 weeks out of 8, a Tairseach inflow item produces a node that connects to an existing high-salience cluster and changes the user's reading priority." Without Tairseach operational, that criterion cannot be measured at all.

Total Phase 1 effort across both projects: ~16 weeks (Imeall) + ~9 weeks (Tairseach) in parallel. Solo-developer bandwidth is the binding constraint, not the architecture. The 16-week Imeall time-box (per Imeall PRD §12 M4) acts as Tairseach's deadline too: if Tairseach isn't functional by Imeall MVP week 12, the MVP gate cannot be cleared and the time-box forces a Phase 2 transition regardless.

---

*End of PRD v0.1.*

*Companion docs: [Imeall PRD v0.2](../../../imeall/docs/PRD.md), [Imeall Schema v0](../../../imeall/docs/schema/SCHEMA-V0.md), [Imeall Business Plan v0.1](../../../imeall/docs/BUSINESS-PLAN.md), [FoxxeLabs Roadmap v2](../roadmap.md).*
