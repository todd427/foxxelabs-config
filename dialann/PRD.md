# <span style="color:#a02020">Dialann</span>

> *dialann* /ˈdʲiəl̪ˠən̪ˠ/ — Irish: **a diary, a journal, a log**. The written record of what happened and what was promised.

**Tagline:** *The handwritten log, made queryable — and impossible to lose a job in.*

**PRD version:** v0.1 (draft)
**Date:** 6 June 2026
**Owner:** Todd McCaffrey / FoxxeLabs
**Status:** Pre-implementation. **Parked until post-viva** (dissertation due 12 June 2026).
**Implementation repo:** `todd427/dialann` (not yet created)
**Siblings:** [Coinne](../coinne/PRD.md) (intake), [Geall](../geall/PRD.md) (watchdog)

---

## <span style="color:#a02020">1. Vision</span>

Dialann is the **system of record** for the talk-to-record operator system — the explicit, timestamped, queryable truth that replaces the operator's head, the radio, and the paper log. Every job/booking is a state machine:

```
received → assigned → en route → on scene → POB → dropped → closed
```

…with each transition timestamped. Dialann is what makes a missed pickup *structurally detectable* rather than discovered via an angry phone call — and it is therefore what Geall watches. The operator's anxiety is the cost of holding all of this in one head; Dialann is the head, externalised and queryable.

---

## <span style="color:#a02020">2. The build-vs-adapt fork (the core decision)</span>

Dialann is an **adapter over a system of record**, not necessarily the store itself. The fork is decided per vertical by one question: *does a dominant system-of-record incumbent already exist?*

| Branch | When | Dialann's role | Capture |
|---|---|---|---|
| **A — adapt** | Incumbent exists (taxis → iCabbi) | Thin adapter writing through the incumbent's booking API via the `DispatchCore` interface. **Rent the core.** | You see what the incumbent exposes. |
| **B — own** | No incumbent (small trades, care rotas) | Delegates to **Comhordú** as the system of record — its Principal × Resource × Commitment × Constraint substrate *is* a job/commitment store. **Own the stack.** | You own all of it. |

The dispatch core is a saturated, mature commercial space — too good to rebuild, good enough to integrate against. Rebuilding it fails the "is-this-mine" test. Branch A is the fast, low-capture entry; Branch B is where no incumbent exists and owning the core is therefore worth the reliability burden.

```python
class DispatchCore(Protocol):
    def create_booking(self, b: Booking) -> str: ...   # returns booking_id
    def update_state(self, booking_id: str, state: JobState) -> None: ...
    def snapshot(self) -> list[Booking]: ...            # for Geall to watch
# ICabbiCore(DispatchCore)   — Branch A
# ComhorduCore(DispatchCore) — Branch B
# StubCore(DispatchCore)     — demo / prototype (no real backend)
```

The `StubCore` is the demo strategy: prove the end-to-end experience (Coinne → Dialann → board lights up) with **no real dispatch core and no incumbent keys**. The iCabbi adapter is then a ~1-day wiring job *after* the sale.

---

## <span style="color:#a02020">3. Position in the stack</span>

- Receives structured bookings from **Coinne**.
- Exposes job/booking state to **Geall** (the watchdog reads Dialann; it does not poll the incumbent directly).
- Adapter seam to an **incumbent** (Branch A) or **Comhordú** (Branch B).
- Demand history feeds **Léargas** (via Geall) for the demand-drift layer.
- Runs on the **Anseo multi-tenant pattern** — the proven Stór-on-Anseo precedent: one codebase, many product skins.

---

## <span style="color:#a02020">4. Data isolation (non-negotiable)</span>

Customer PII is a **per-tenant, GDPR-bound, isolated store**. It uses the *Mnemos pattern* (hybrid FTS + vector retrieval for customer history / prior addresses) but **never the personal Mnemos instance** — Todd's first-person corpus rule stays intact and is walled off by construction. The locale gazetteer (place-name → coordinates) is shared reference data and is fine to share across tenants. This isolation is load-bearing for the home-care vertical, which carries special-category health data.

---

## <span style="color:#a02020">5. Non-goals</span>

- <span style="color:#cc6600">**Not** the intake.</span> Dialann does not talk to callers; that is Coinne.
- <span style="color:#cc6600">**Not** the watchdog.</span> Dialann holds state; Geall interprets and escalates it.
- <span style="color:#cc6600">**Not** a calendar.</span> Anseo/Comhordú hold calendar data; Dialann holds the *operational job lifecycle*.
- <span style="color:#cc6600">**Not** the optimiser.</span> "Which resource, what order" is a deterministic assignment solver behind the adapter — not an LLM, not Dialann's concern.

---

## <span style="color:#a02020">6. Trade-offs, stated explicitly</span>

- **Adapt vs own.** Branch A caps data capture at whatever the incumbent's API exposes; Branch B captures everything but you own the reliability burden.
- **Reliability bar is brutal.** This runs at night, for someone's livelihood, with real people waiting. A dropped or silently-lost job is *worse than paper*, because paper does not inspire false trust. Dialann must fail loud and degrade to human, every time.
- **Schema generality vs vertical fit.** Keep the *lifecycle* generic (the state machine above); push vertical-specific fields into the per-vertical shell. Resist a god-schema.

---

## <span style="color:#a02020">7. Open questions</span>

1. Multi-tenant isolation model on the Anseo substrate — row-level vs per-tenant schema vs per-tenant DB.
2. Comhordú readiness (PRD-stage, post-viva) — Branch B is gated on it.
3. State-machine extensibility — how much vertical variation in the lifecycle (care visits, multi-leg jobs, account work) before the generic core breaks.
4. Reconciliation when Branch A incumbent and Dialann disagree (source-of-truth precedence).

---

## <span style="color:#a02020">8. Status & sequencing</span>

PRD v0.1, pre-implementation, parked until post-viva. First build target: `StubCore` + the generic lifecycle, to back the Coinne demo with no incumbent dependency. Branch A (iCabbi adapter) and Branch B (Comhordú) follow the first sale / Comhordú readiness respectively.

---

*End of PRD v0.1. Companion docs: [Coinne](../coinne/PRD.md), [Geall](../geall/PRD.md), [Comhordú], [FoxxeLabs Roadmap](../roadmap.md).*
