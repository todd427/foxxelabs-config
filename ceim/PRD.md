# <span style="color:#4E7E8E">Céim — PRD v0.1</span>

<span style="color:#8A93A0">*Irish: "step / rung" and "academic degree." One word for a ladder and a qualification — exact fit for a tool that ladders frontier findings into BA / MA / PhD work.*</span>

**Status:** parked until post-viva (dissertation due 12 June 2026). Scope + name now; build after.
**Spec:** `foxxelabs-config/ceim/PRD.md` (this file).
**Pronunciation:** KAYM (rhymes with *fame*; slender *c*/*m* glide). Add to ga-say words.js on build.

---

## <span style="color:#4E7E8E">Thesis</span>

SOTA outstrips books because understanding structurally lags capability, and books sit downstream of understanding. The fix is not faster books — it's deliberate derive-from-scratch reps on the load-bearing things, to keep the faculty that audits delegation from atrophying (the ratchet). Céim is the instrument: it reads the frontier and converts it into *leveled derivation work*, both as personal faculty-maintenance and as an assignable-project source for teaching.

Céim is a **sieve, not an oracle.** It surfaces candidates; the human owns the call. The rep-vs-currency sort and the difficulty leveling are model judgments exposed for audit, never trusted as verdicts. A tool that rates research difficulty *is borrowed authority in miniature* — so its reasoning must be contestable by construction, or it becomes the delegated supervisory judgment a teacher has to own.

---

## <span style="color:#4E7E8E">The unit: finding → seam → ladder</span>

The leveling does **not** tag the finding. It tags the *task derived from* the finding.

A single frontier item is a **seam** that can be mined at three depths:

- <span style="color:#C9A227">**BA**</span> — reproduce it. Well-posed, checkable, bounded.
- <span style="color:#C9A227">**MA**</span> — extend or stress it. Semi-open: adapt it where it wasn't built for, characterize where it breaks.
- <span style="color:#C9A227">**PhD**</span> — attack the open question it hand-waves. Ill-posed, no answer key.

So the data unit is `finding → seam → ladder of 1–3 leveled tasks`, not `finding → one difficulty label`. This is more correct *and* more useful: one paper yields a capstone and a thesis seam from the same mechanism.

---

## <span style="color:#4E7E8E">Leveling rubric (the core)</span>

Never ask the model "BA, MA, or PhD?" — that's a single-axis vibe and it drifts. Decompose into the axes that actually separate the levels, score each, and let the level *fall out* of the axes:

- <span style="color:#C9A227">**Posedness**</span> — well-posed (handed to you) vs ill-posed (framing it is part of the work).
- <span style="color:#C9A227">**Answer key**</span> — checkable known result vs no answer key.
- <span style="color:#C9A227">**Contribution stance**</span> — reproduce vs extend vs contribute.

| Level | Posedness | Answer key | Stance |
|---|---|---|---|
| BA | well-posed | known, checkable | reproduce |
| MA | semi-open | partial / characterizable | extend |
| PhD | ill-posed | none | contribute |

The model outputs **axis scores + a one-line justification per rung.** The level is derived, not asserted. The justification is mandatory and surfaced in the UI so the human can read *why* it called something PhD and overrule it. <span style="color:#B23A48">Legibility is the point, not polish</span> — trusting the bare label is the borrowed-authority failure.

---

## <span style="color:#4E7E8E">The prediction gate (move #3, instrumented)</span>

This is the load-bearing argument for a backend over client storage: **predict-before-reveal only works honestly server-side.** In the artifact you've already seen the card before you can predict anything.

Flow: for any task, the practitioner commits a one-line prediction → server writes it **write-once, timestamped** → only then does it unlock the full derivation / source. The delta between prediction and actual, logged over time, is the audit-faculty reading. Drift on a domain you thought you owned is the early warning. Without the log, the first signal is failure under load — too late.

---

## <span style="color:#4E7E8E">Architecture</span>

Standalone Fly service, region **lhr**, own Postgres. **Not** folded into Anseo — this isn't a community feature, and coupling bloats Anseo's domain. The fleet is already a row of small standalone Fly apps, so marginal ops cost is near zero. (If it ever goes multi-student, *that's* the moment to evaluate Anseo as identity provider via the backlog OAuth2 — not now.)

- Scheduled Fly machine runs the **weekly scan** (the protocol cadence). LLM calls move server-side.
- **Frontend repoints** at the service API instead of calling Anthropic directly — the existing paper/screen design survives intact, gains the ladder and the prediction gate.
- **Scan source:** MVP runs its own server-side `web_search` to stay decoupled. Future: consume **Tairseach** (id 46) — its aggressive-decay relevance filter is the natural upstream; tap its findings table, *not* Mnemos.
- **Focus domains are first-class config rows** edited in the UI — the manual version of the load-bearing set. <span style="color:#B23A48">Do NOT fish them from Mnemos</span>: a topic list wants exact config; RAG retrieval is fuzzy and is the wrong tool. Keep the boundary clean.

---

## <span style="color:#4E7E8E">Data model (sketch)</span>

- `finding` — raw firehose record; dedup on url/title hash.
- `seam` — a finding promoted because it holds a mechanism worth mining (else logged as currency).
- `task` — `{seam_id, level, framing, prerequisites, axis_scores, justification, predict_line, status}`.
- `prediction` — `{task_id, pre_reveal_line, actual, delta, server_ts}` (write-once on the pre-reveal line).
- `focus_domain` — config rows, user-edited.

Currency findings are logged and decayed, never promoted.

---

## <span style="color:#4E7E8E">Fleet relationships</span>

- **Tairseach** (46) — upstream scan source (future); Céim is a *consumer*, not a re-scanner.
- **aithint** — teaching context; Céim is a project-source sibling for the AI-literacy cohort and a future-teacher tool.
- **Mnemos** — corpus boundary intact: Céim reads first-person nothing and writes first-person nothing into Mnemos. Findings are third-party by definition.
- **Ainm** (35) — clear the **Céim** name before any public surface.

---

## <span style="color:#4E7E8E">MVP (M0) and acceptance</span>

Single-user (Todd), one focus domain, own web_search scan. Acceptance:

1. A scan produces a seam with a **3-rung ladder**, each rung carrying axis scores + justification.
2. The **prediction gate** works: a committed pre-reveal line is timestamped write-once and gates the derivation reveal; the delta is stored.
3. At least one rung is overruled by the human and the override persists — proving the sort is contestable, not authoritative.

No promotion, no second user, before M0.

---

## <span style="color:#4E7E8E">Trade-offs (stated)</span>

- <span style="color:#B23A48">Standalone vs Anseo</span> — chose bounded context over auth reuse. Revisit only at multi-student.
- <span style="color:#B23A48">Leveling is uncalibrated as an absolute</span> — mitigated by rubric-anchoring + forced per-rung justification, never by trusting the label.
- <span style="color:#B23A48">Ladder is more build than a flat score</span> — but dual-use with no fork: the rungs tell *you* how deep a rep goes and hand a *teacher* assignable projects.
- <span style="color:#B23A48">The synthesizer risk</span> — Céim must not become the thing the protocol says to cut out. The in-product footer says so; the sort stays a candidate, not a verdict.

---

## <span style="color:#4E7E8E">Horizon</span>

Scoped + named 2026-06-10. Build post-viva (after 19 June 2026 viva). Pre-viva action: this PRD + Rialú registration only. No code, no domain, no scan until the dissertation is in.
