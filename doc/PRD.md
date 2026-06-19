# Doc — Project Brief

**Persona:** *Doc* — the health counterpart to Eric (M. Eric Ting). Eric watches the market; Doc watches the body.
**Owner:** Todd McCaffrey
**Status:** <span style="color:#C00000">Pre-implementation — post-viva</span>
**Machine:** Fly.io `lhr` (service, Eric pattern); dev on Daisy
**Repo:** todd427/doc (not yet created)
**Depends on:** Colainn (built, deployed), Mnemos (active)

---

## <span style="color:#2E75B6">1. What Doc Is</span>

A persistent MCP agent whose domain is Todd's physiology. Same shape as Eric — a long-running service with a query verb, scheduled background work, mood/state, and its own memory — pointed at Colainn instead of the market.

Doc does **not** collect data and does **not** store time-series. <span style="color:#595959">Colainn is the medulla (homeostatic store + anomaly engine); Doc is the voice over it.</span> Doc reads `homeostatic_snapshots`, `anomalies`, and `readings`, adds two small tables of its own (§3), and reasons across them.

The value proposition is **grounded** suggestion, not generic advice. A complaint is answered against the record — "logged during a 9-night sub-6h sleep run, same physiological signature as the March flare" — never with context-free boilerplate. "Consult a doctor" as a blanket reply is explicitly out of scope; a *data-triggered* escalation (§5) is explicitly in.

## <span style="color:#2E75B6">2. Substrate — Colainn (already built)</span>

Confirmed state of `colainn` repo (deployed `colainn-foxxelabs`, Fly lhr):

- <span style="color:#595959">`readings`</span> — raw time-series, all sources; indexed for circadian / time-of-day / daily queries
- <span style="color:#595959">`baselines`</span> — nightly rolling per-metric stats (mean, stddev, percentiles)
- <span style="color:#595959">`anomalies`</span> — z-score deviations with `direction` + `severity` (mild/moderate/severe)
- <span style="color:#595959">`homeostatic_snapshots`</span> — 15-min state buckets; already enrich Mnemos ingests

**Implication:** the escalation primitive Doc needs already exists — it is the `anomalies.severity` tier. Doc surfaces it; it does not recompute it.

**Ingestion gap (load-bearing):** `devices.source_type` is `withings | internal | gps | manual`, and only Withings has a live poller. The **Garmin Venu 4** stream (sleep, HRV, resting HR, stress, training load) is the richest signal for symptom correlation and is not flowing. A Garmin poller landing into `readings` is the real first task — Doc's reasoning is only as good as the data underneath it.

## <span style="color:#2E75B6">3. Schema Additions</span>

Meds and complaints are not metrics; they do not belong in `readings`. Two new Colainn tables (snake_case, Unix ms UTC, to match `colainn.sql`):

```sql
-- Current stack + proposed additions. A proposal is status='proposed'.
CREATE TABLE IF NOT EXISTS medications (
    id          INTEGER PRIMARY KEY,
    name        TEXT    NOT NULL,
    dose        TEXT,                            -- "1g", "600mg NAC + 1.8g glycine"
    cadence     TEXT,                            -- "daily", "1g AM"
    indication  TEXT,
    status      TEXT    NOT NULL CHECK (status IN ('active','proposed','discontinued')),
    started_at  INTEGER,                         -- Unix ms; NULL while proposed
    stopped_at  INTEGER,
    notes       TEXT,
    created_at  INTEGER NOT NULL DEFAULT (unixepoch() * 1000)
);

-- Moans, complaints, groans. Keyed by ts so it joins to the snapshot at that moment.
CREATE TABLE IF NOT EXISTS symptoms (
    id          INTEGER PRIMARY KEY,
    ts          INTEGER NOT NULL,                -- Unix ms UTC
    text        TEXT    NOT NULL,                -- free text, as spoken
    region      TEXT,                            -- optional: "left knee", "head"
    severity    INTEGER CHECK (severity BETWEEN 1 AND 10),  -- self-rated, optional
    snapshot_ts INTEGER REFERENCES homeostatic_snapshots(ts),  -- 15-min bucket join
    created_at  INTEGER NOT NULL DEFAULT (unixepoch() * 1000)
);
CREATE INDEX IF NOT EXISTS idx_symptoms_ts ON symptoms (ts DESC);
```

The `symptoms.snapshot_ts` join is the whole point: it converts a groan into a physiologically-situated event. A symptom with no snapshot attached is a diary entry, not a signal.

## <span style="color:#2E75B6">4. Agent Surface (Eric template)</span>

| Tool | Role |
|---|---|
| <span style="color:#595959">`ask_doc`</span> | Free-text query; reads across symptoms × medications × anomalies × snapshots |
| <span style="color:#595959">`log_symptom`</span> | Capture a moan; auto-attach current snapshot |
| <span style="color:#595959">`log_med`</span> | Add/activate/discontinue a med, or file a `proposed` addition |
| <span style="color:#595959">`get_digest`</span> | Weekly state-of-Todd rollup (trends, anomalies, med changes) |
| <span style="color:#595959">`run_monitor`</span> | Largely the existing nightly baseline/anomaly job — Doc narrates it |
| <span style="color:#595959">`get_mood`/`set_mood`</span> | Eric-parity persona state |

## <span style="color:#2E75B6">5. The One Hard Line</span>

On a `proposed` med, Doc may surface Todd's own data freely. Any **interaction claim** ("X is safe with Y") must come from a real interaction dataset, not model priors. Stacking supplements at 70, a hallucinated all-clear is the single failure mode that actually causes harm. Doc either grounds the lookup against a real source or marks the claim <span style="color:#C00000">unverified</span> and routes to a pharmacist. This is not boilerplate avoidance — it is the one place freelancing is unsafe.

## <span style="color:#2E75B6">6. Sequence</span>

1. <span style="color:#595959">Garmin → Colainn poller</span> (land sleep/HRV/RHR/stress into `readings`)
2. <span style="color:#595959">`medications` + `symptoms` tables</span> in Colainn schema
3. <span style="color:#595959">Doc MCP service</span> on the Eric template, reading Colainn
4. <span style="color:#595959">Interaction-data grounding</span> for §5 before any proposed-med reasoning ships

Steps 2–3 are a weekend once step 1 is flowing. Step 1 is the work.

---

*Doc PRD brief · 2026-06-19*
*Generated-with Claude Opus 4.8*
*Note: repo CONVENTIONS.md still stamps the retired FoxxeLabs entity in footers/owner lines; left untouched here pending the company-name decision.*
