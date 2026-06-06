# <span style="color:#a02020">Geall</span>

> *geall* /ɟal̪ˠ/ — Irish: **a promise, a pledge, a wager**. Something given that must be honoured.

**Tagline:** *Never break a promise you didn't know you'd made.*

**PRD version:** v0.1 (draft)
**Date:** 6 June 2026
**Owner:** Todd McCaffrey / FoxxeLabs
**Status:** Pre-implementation. **Parked until post-viva** (dissertation due 12 June 2026).
**Implementation repo:** `todd427/geall` (not yet created)
**Siblings:** [Coinne](../coinne/PRD.md) (intake), [Dialann](../dialann/PRD.md) (system of record)

---

## <span style="color:#a02020">1. Vision</span>

Geall is the **watchdog**, and it is the product's hero. It watches Dialann and flags any commitment about to be broken — *before* the customer finds out. It is the cure for the 3am gut-check: the operator lying awake wondering *did I forget someone*.

Concretely, Geall surfaces things like:

- pickup due in 10 minutes with no resource assigned;
- a job stuck `en route` well past its expected duration;
- a quote sent three days ago, never actioned;
- (home-care) a scheduled visit whose window is closing with no check-in.

The operator's whole anxiety is the fear of the dropped item. Geall is the part of the system that makes dropping one structurally hard.

---

## <span style="color:#a02020">2. Why Geall is the hero (positioning)</span>

Everyone in this space leads with "AI answers your calls." That is a commodity race against Big Tech voice, and it is a losing one. **Nobody leads with "and it tells you what you're about to drop."**

Geall is the defensible core precisely because it requires *persistent operational memory* — Dialann plus history — which is the platform IP. A competitor can bolt on a voice agent in a weekend; they cannot replicate the watchdog without the system of record underneath it.

Marketing rule (Eric's brief): **Geall is the hero of every page; Coinne (voice intake) is just how the data gets in.** Sell the relief of the dread, not the novelty of the automation.

---

## <span style="color:#a02020">3. Position in the stack</span>

```
[ DIALANN ] ──state + timers──▶ ┌──────────┐
                                │   GEALL   │
[ LÉARGAS ] ──demand drift────▶ │ watchdog  │──escalations──▶ operator
   (optional)                   └──────────┘   (via Coinne channels:
                                                SMS / voice / push)
```

- **fiosru** orchestrates the checks: timer-threshold evaluations and TTL alarms against Dialann state. Async; one check failing does not cascade.
- **Léargas** (GMM drift) feeds the *demand-pattern* layer only — "this evening is behaving abnormally, reposition" — **not** "job overdue", which is just a timer. Do not reach for Léargas where a rule does the job.
- Escalations go out through Coinne's channels (long-number SMS / voice / push).

---

## <span style="color:#a02020">4. Architecture</span>

1. **Watch** — subscribe to Dialann state transitions + register TTL timers per commitment.
2. **Evaluate** — rule engine on fiosru: per-vertical thresholds (configurable; conservative by default).
3. **Escalate** — escalation ladder: notify operator → re-notify on no-ack → flag for human. Never silent.
4. **Log** — audit trail of every flag (raised, acknowledged, resolved). This serves trust calibration **and** doubles as the home-care compliance artefact (the "audit trail you didn't have to write" — a second product hiding inside the first).
5. **(Optional) Anticipate** — Léargas demand-anomaly feed suggests proactive repositioning.

This is rules + light statistics, **not** an LLM. An LLM is the wrong tool for "is this overdue."

---

## <span style="color:#a02020">5. SMS / escalation channel note</span>

Escalations and customer-facing confirmations go out on a **standard Irish long/mobile number**, which is exempt from the ComReg SMS Sender ID Registry (unregistered alphanumeric Sender IDs are flagged "Likely Scam" from 3 Jul 2025 and blocked from 3 Oct 2025 — provider-agnostic, so switching providers does not avoid it). Long-number two-way SMS sidesteps the registry entirely and lets the customer reply CONFIRM/CANCEL. Provider: Telnyx or Plivo; Bird/Sinch only if EU data-residency heft is later required. Branded alphanumeric is the exception, registered by the *fleet* (their CRO), not by us.

---

## <span style="color:#a02020">6. Non-goals</span>

- <span style="color:#cc6600">**Not** a reasoner.</span> Rules + thresholds + optional drift stats. No LLM in the hot path.
- <span style="color:#cc6600">**Not** the intake.</span> Geall does not take bookings (Coinne).
- <span style="color:#cc6600">**Not** the record.</span> Geall reads Dialann; it does not own state.

---

## <span style="color:#a02020">7. Trade-offs, stated explicitly</span>

- **False positives erode trust fast.** A watchdog that cries wolf gets muted, and a muted watchdog is worse than none. Thresholds must be tunable and conservative by default; tune toward precision early.
- **A silent watchdog is the worst failure.** Geall must fail loud — a missed escalation is the exact failure the product exists to prevent. Health-check the watchdog itself.
- **Rules vs drift.** Most value is in dumb timers. Léargas is the upgrade for demand patterns only; do not over-engineer the common case.

---

## <span style="color:#a02020">8. Open questions</span>

1. Escalation ladder timing defaults per vertical (taxi minutes vs care-visit windows vs trades-quote days).
2. Acknowledgement UX — how the operator acks a flag without friction mid-shift.
3. Léargas readiness for the demand layer (currently PoC) — graceful degradation to rules-only.
4. Audit-trail retention + access model for the home-care compliance second-product.

---

## <span style="color:#a02020">9. Status</span>

PRD v0.1, pre-implementation, parked until post-viva. Build sequence: rules + timers on fiosru against Dialann first (the hero MVP); Léargas demand layer second; compliance-reporting product third (home-care).

---

*End of PRD v0.1. Companion docs: [Coinne](../coinne/PRD.md), [Dialann](../dialann/PRD.md), [Léargas], [fiosru PRD](../prds/fiosru-prd.md), [FoxxeLabs Roadmap](../roadmap.md).*
