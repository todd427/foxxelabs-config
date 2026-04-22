# <span style="color:#1e40af">Breith — Decision-Outcome Loop (PRD v0.1)</span>

<span style="color:#7c2d12">**Status:**</span> Spec. Markdown logging today; build post-viva (June 2026+), after Comhoibrí Phase 0.
<span style="color:#7c2d12">**Created:**</span> 2026-04-22
<span style="color:#7c2d12">**Name:**</span> Breith (Irish: judgment, verdict, birth — the moment of commitment)
<span style="color:#7c2d12">**Position:**</span> Private-tier FoxxeLabs service. Never OAuth-exposed; Féith mesh only.

---

## <span style="color:#0f766e">One-line framing</span>

A local SQLite + MCP service that records every consequential decision Todd makes with AI assistance, pairs it with the actual outcome weeks to months later, and produces the preference signal Macalla needs to train on judgment rather than plausibility.

## <span style="color:#0f766e">Non-obvious architectural insight</span>

Breith is the missing evaluation layer for every other AI-assisted system in the FoxxeLabs stack. Macalla without Breith optimises for voice fidelity. Léargas without Breith optimises for semantic coverage. The Comhoibrí coworker stack without Breith optimises for queue throughput. None of those are decision quality. Breith is what turns *"the assistant said X"* into *"X was right / wrong / ambiguous, six months later."*

Without this loop, every other AI-facing project in the stack is evaluated on proxy metrics. With it, they share a common ground truth.

## <span style="color:#0f766e">Premise</span>

Current measurement across the FoxxeLabs AI stack is proxy-based: token counts, retrieval recall, standup grant rates, voice-fidelity discrimination, task completion. None of these measure whether the assistance actually improved the outcome of a decision. That is the only metric that matters for the 3rd-brain thesis, and it is the metric nobody in the broader AI industry instruments either (Bank of England: 9 of 10 senior managers report no measurable AI productivity impact — because nobody is measuring decisions, only outputs).

Breith instruments decisions. Everything else is subordinate.

## <span style="color:#0f766e">Position in stack</span>

| Layer | Role |
|---|---|
| **Rialú** | Intentions + working state (what I want to do) |
| **Comhoibrí standups** | Decision *moments* — coworker recommends, Todd grants / denies / modifies |
| **Breith** | Decisions + outcomes (what I decided, what happened) |
| **Aislinge** | Nightly consolidation — surfaces pending outcome attachments, detects drift |
| **Léargas** | Drift detection over decision quality across time |
| **Macalla adapter** | Trains on Breith decision→outcome pairs as DPO/ORPO preference signal |
| **Mnemos** | Episodic context retrieval into each decision |

Breith sits between Rialú and Aislinge. Rialú is prospective (intentions); Breith is retrospective (decisions + outcomes); Aislinge reconciles both nightly.

## <span style="color:#0f766e">Data sources</span>

A decision event can originate from any of:

1. **Comhoibrí standup grant/deny** — highest volume once coworker stack is live. Coworker provides `inputs[]` and `assistant_io[]`; Todd provides decision + reversibility + confidence.
2. **Direct Claude / ChatGPT conversation conclusion** — Todd tags the end of a substantive session with an explicit logged decision.
3. **Manual log** — Todd typing a decision into vi or calling the MCP tool directly. Strategic choices, personal decisions, purchases, commitments.
4. **Rialú intention closure** — when an intention is marked complete, Breith prompts for a decision record summarising how it was resolved.

Source 1 is the goal state — most decisions are logged as a byproduct of normal coworker operation, minimising friction. Source 3 is the bootstrap mode during Phase 0 markdown logging.

## <span style="color:#0f766e">Schema</span>

SQLite, single table `decisions`:

| Field | Type | Notes |
|---|---|---|
| `decision_id` | TEXT PK | ULID |
| `ts` | INTEGER | Unix milliseconds UTC |
| `source` | TEXT | `comhoibri` \| `claude` \| `manual` \| `rialu` |
| `context_ref` | TEXT NULL | Rialú intention id / Claude session id / commit hash / email id / freeform |
| `inputs` | TEXT (JSON) | Array of `{type, id, summary}` — Mnemos doc ids, URLs, people, prior conversations |
| `assistant_io` | TEXT (JSON) | Array of `{model, prompt_hash, response_hash, tokens, role}` — empty if no AI involved |
| `decision` | TEXT | What Todd actually decided. Required. |
| `rationale` | TEXT NULL | Why. Optional at log time; often filled in later. |
| `reversibility` | TEXT | `low` \| `med` \| `high` |
| `confidence` | REAL | 0.0 – 1.0 |
| `counterfactual` | TEXT NULL | What Todd would have done without AI input. Populated when AI involvement is significant. |
| `outcome_text` | TEXT NULL | Free text outcome description, attached later |
| `outcome_score` | INTEGER NULL | 1–5 (1 = bad, 3 = neutral, 5 = good) |
| `outcome_ts` | INTEGER NULL | Unix ms UTC when outcome was attached |
| `tags` | TEXT (JSON) NULL | Array of strings — domain tags (`anseo`, `mnemos`, `health`, `financial`, `personal`…) |

Indexes on `ts`, `source`, `outcome_score`, and a generated `outcome_attached` boolean column for the pending-decisions query.

## <span style="color:#0f766e">MCP surface</span>

Five tools, all private-tier (Féith mesh only):

- **`breith_log_decision`** — create a new decision record. All fields except `decision_id` and `ts` are optional at log time; minimum viable call is `{decision: "..."}`. Returns the new `decision_id`.
- **`breith_attach_outcome`** — attach `outcome_text`, `outcome_score`, and `outcome_ts` to an existing decision by id. Idempotent; overwrites prior outcome if present (with audit log entry).
- **`breith_pending`** — return decisions with `outcome_attached = false` older than N days (default 7). Used by Aislinge nightly pass to prompt outcome attachment.
- **`breith_query`** — flexible search: by tag, source, date range, outcome_score range, reversibility, free-text decision/rationale match. Returns decision records with inputs and assistant_io expanded.
- **`breith_metrics`** — rolling aggregates over a time window:
  - Decision volume / day
  - Outcome attachment rate (what % of decisions have closed the loop)
  - Mean outcome score, by source
  - Grant rate (Comhoibrí decisions only — how often Todd accepts coworker recommendations)
  - Surprise-and-correct rate (decisions where Todd noted a counterfactual *and* outcome_score ≥ 4 — the positive signal for AI value)
  - Time-to-outcome distribution

## <span style="color:#0f766e">Phased build</span>

- **Phase 0 — markdown logging (today through viva).** `/home/Projects/breith/log.md`, vi, one entry per decision in a fixed template (`## YYYY-MM-DD HH:MM — <short title>`, then fields as markdown list). Discipline precedes tooling. Target: 5-10 entries per week. Goal is behaviour change and template refinement, not data capture — the Phase 0 entries are unlikely to be imported into Phase 1 verbatim.

- **Phase 1 — SQLite + MCP core (one weekend post-viva).** FastAPI + MCP wrapper, SQLite on Daisy's local volume. `breith_log_decision`, `breith_attach_outcome`, `breith_pending` only. No UI. Deploy as MCP server accessible via Féith mesh. ~400 lines Python.

- **Phase 2 — Comhoibrí integration (one week after Phase 1).** Every grant/deny in a coworker standup review auto-creates a Breith record via `breith_log_decision`. Comhoibrí fills `source=comhoibri`, `inputs[]`, `assistant_io[]`; Todd adds `decision`, `reversibility`, `confidence` in one line of the standup reply. This is the volume driver — most decisions flow through here once coworker stack is live.

- **Phase 3 — Aislinge wiring (one week).** Aislinge nightly pass calls `breith_pending(days=7)`, surfaces overdue outcome attachments in the morning digest. Todd attaches outcomes via `breith_attach_outcome` during morning standup review.

- **Phase 4 — query + metrics (one weekend).** `breith_query` and `breith_metrics` added. First real dashboard — a 2-hour Recharts artifact rendered from `breith_metrics` JSON. Read-only, no UI state.

- **Phase 5 — Macalla training signal (when corpus ≥ 200 outcome-attached pairs, ~6-8 weeks after Phase 2 goes live).** Decision records with `outcome_score ≥ 4` become *chosen* samples, `outcome_score ≤ 2` become *rejected* samples, for DPO/ORPO preference training. `counterfactual` field provides the contrastive pair where present. This is the point at which Macalla stops being trained on voice alone and starts being trained on judgment.

- **Phase 6 — Léargas drift detection (TBD, post-Macalla-training).** Decision embeddings tracked over time; Léargas detects distributional drift in the kinds of decisions being made and their outcome profiles. Drift signal becomes a Macalla retrain trigger, alongside Mnemos-corpus drift.

## <span style="color:#0f766e">Integrations</span>

- **Mnemos.** `inputs[]` may reference Mnemos doc ids — Breith records which retrieved context shaped each decision. Reciprocally, Breith decisions are *not* ingested into Mnemos as documents (they live in their own store) but Mnemos `query_memory` can optionally include Breith decision summaries as a distinct source type in a later phase.
- **Rialú.** `context_ref` may point to a Rialú intention; closing an intention triggers a Breith prompt.
- **Comhoibrí.** Each coworker has a `breith_client` in its base class — writes a decision record per grant/deny automatically.
- **Aislinge.** Consumes `breith_pending` nightly; may eventually consume outcome-attached records as consolidation input.
- **Macalla.** Consumes outcome-attached records as preference training data.
- **Léargas.** Consumes decision embedding sequences for drift detection.

## <span style="color:#0f766e">Trade-offs</span>

- **Self-report bias.** Todd will log decisions he remembers; small aggregating-to-most-of-cognition decisions get missed. Comhoibrí integration (Phase 2) mitigates by making logging automatic for the coworker-mediated subset. Direct Claude logging remains manual and lossy; acceptable.
- **Outcome attribution lag.** Real outcomes surface in weeks to months. Metrics are slow. The alternative is gaming (short-horizon outcomes optimised for dopamine not truth). Live with the lag.
- **Confounding.** Multiple axes improving simultaneously — Macalla getting better, Todd getting better, coworker stack maturing, external conditions changing. Breith will not deliver causally clean attribution. Goal is joint trajectory: are decision outcomes trending up over months? That is the only question Breith needs to answer well.
- **Sycophantic AI agreement.** An AI assistant that agrees with Todd's pre-existing inclinations will show high concordance and apparent good outcomes without adding value. Mitigation: the `counterfactual` field, populated honestly, is the only guard. Surprise-and-correct rate is the real signal; plain agreement rate is noise.
- **Corpus sensitivity.** Decision records contain strategic, financial, and personal data. Private-tier only, never OAuth-exposed. Backup is encrypted. No third-party sharing under any circumstances.
- **Behaviour-change dependency.** Breith without Todd's discipline to attach outcomes is an expensive decision log. Phase 3 Aislinge integration is load-bearing — without nightly outcome-attachment prompts, the outcome field stays empty and the whole point is lost.

## <span style="color:#0f766e">Why not the alternatives</span>

- **Not "improve retrieval."** Mnemos and Léargas already exhaust that lever. Retrieval is not the bottleneck.
- **Not "more training data."** Training without an outcome signal optimises for plausibility — the slop trap. Voice fidelity without judgment fidelity is a parody generator.
- **Not "build a dashboard first."** Deferral disguised as work. Generate the data, visualise on demand.
- **Not a journal app.** Journalling captures reflection; Breith captures decisions. The schema enforces the distinction — a journal entry without a `decision` field is not a Breith record.
- **Not a commercial SaaS (yet).** See Bankable layers in session 2026-04-22 — personal version first, six months of data, methodology writeup, only then evaluate team-scale product. Building for others before building for self produces the wrong product.

## <span style="color:#0f766e">Open decisions (for post-viva scoping)</span>

- Host: Daisy local (private, tight latency) vs Fly.io `lhr` behind Féith gating (consistent with rest of stack, simpler backup). Leaning Fly.io.
- Backup cadence: daily to R2 once Mnemos R2 backup is solved (same infrastructure). Block Phase 1 ship on R2 existing? — probably not; SQLite file + local Daisy snapshot is adequate for a corpus of hundreds of records.
- Reversibility taxonomy: 3-level (low/med/high) is probably too coarse. Consider adding `time_horizon` (hours / days / weeks / months / years) as a separate axis.
- Does Breith ingest its own history into Mnemos for retrieval, or stay separate? Leaning separate — decisions are first-party Todd data with their own retrieval patterns; mixing with episodic Mnemos muddies both.
- Outcome score scale: 1–5 is standard but rarely used well. Consider 3-level (`bad` / `neutral` / `good`) plus optional free text. Simpler data, same signal.
- Counterfactual prompting: only ask when `assistant_io` is non-empty? Or always? Always is more honest but adds friction.
- Public methodology publication timing — after N months of personal use, before or after the Anseo user base justifies a team-scale version.

## <span style="color:#0f766e">Success criteria</span>

Phase 1 ships successfully if Todd logs ≥10 decisions in the first week without manual friction.

Phase 2 ships successfully if Comhoibrí-originated decisions exceed manual decisions in month two.

Phase 3 ships successfully if outcome attachment rate exceeds 60% by month three (i.e. most decisions have a closed loop within 60-90 days of logging).

Phase 5 ships successfully if the Macalla adapter trained on Breith pairs shows measurably different behaviour than the voice-only adapter on a held-out decision set — specifically, a disagreement-and-correct rate above zero on decisions where the outcome favoured a non-obvious choice.

Overall project success: by month twelve, Todd has the first personal dataset in the world pairing a specific individual's decisions with the AI inputs that shaped them, the Macalla adapter is measurably better because of it, and the methodology is publishable as evidence for or against the 3rd-brain thesis.

## <span style="color:#0f766e">Provenance</span>

Conversation with Claude, 2026-04-22. Decision-outcome loop proposed as `Breith` during the "actionable project" section of the AI-bubble / third-brain / coworker-stack session. Full transcript ingested to Mnemos (65 chunks). This PRD synthesised from the design discussion, expanded with schema detail, phased build, integration points, and success criteria.

---

*FoxxeLabs Limited · 2026-04-22*
