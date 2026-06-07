# <span style="color:#1e5a8a">Proposal: Closed-Loop Cislunar Mass Delivery</span>
### <span style="color:#2d7a8a">A guided-freighter / active-catcher demonstrator as the keystone of a solar-powered lunar mass driver</span>

<span style="color:#666">Working title — name to be assigned. Draft 0.1, 2026-06-07. Companion to "The Long Bootstrap" (foxxelabs-config, articles/cislunar-roadmap). This proposal supersedes the Layer 1 propellant-depot framing as the *first* thing to build.</span>

---

## <span style="color:#1e5a8a">1. Thesis</span>

The lunar mass driver is the correct Layer 1 primitive — it exports the Moon's one genuine flow surplus (regolith) instead of its irreplaceable stock (water), which is the only export architecture that survives a TANSTAAFL audit. O'Neill had the launcher right in 1977 and proved the linear-motor hardware by 1980. The half he could never close was the **catch**: placing thrown mass at a useful cislunar node with enough precision that launch dispersion over ~64,000 km didn't scatter the stream.

That problem was hard because it had to be *open-loop*. It is not open-loop anymore. **The deliverable that unlocks the entire cislunar logistics stack is a closed-loop, guided delivery-and-catch capability — and it is demonstrable now, at cubesat scale, without a lunar mass driver in existence.** That capability is what this proposal builds.

## <span style="color:#1e5a8a">2. The binding constraint, correctly identified</span>

Three separate problems we have circled — laser-beam pointing across cislunar distance, mass-driver slug dispersion, and depot rendezvous — are one problem wearing three costumes:

> <span style="color:#b03a2e">**Deterministic delivery of mass or energy across cislunar distance.**</span>

Solve it once and the catapult, the power beam, and the depot logistics all fall out of it. The launcher is not the risk. The track is short, the linear synchronous motor is retired hardware, and the energy is solar. The risk is everything downstream of release.

## <span style="color:#1e5a8a">3. Why now — the unlock O'Neill didn't have</span>

In 1977, guidance/navigation/control that could ride a thousand-g projectile did not exist at any mass, cost, or radiation budget that closed. So the slug flew ballistic and uncorrected, dispersion integrated unbounded, and the catcher had to be enormous and lucky.

That constraint is the most thoroughly retired technical risk of the last two decades:

- <span style="color:#2d7a8a">**Cheap autonomous GNC**</span> — cubesat-class avionics, grams and dollars.
- <span style="color:#2d7a8a">**Optical + radar tracking**</span> — terminal sensing of a cooperative target is routine.
- <span style="color:#2d7a8a">**Propulsive terminal guidance**</span> — the same closed-loop sensing-and-actuation that turned rocket landing from "impossible" into "Tuesday."
- <span style="color:#2d7a8a">**Autonomous rendezvous and docking**</span> — flown operationally, repeatedly.

The catapult was always buildable. The catch became buildable when guidance got cheap and small. We are on the right side of that line; O'Neill wasn't.

## <span style="color:#1e5a8a">4. Architecture — three moves</span>

### <span style="color:#2d7a8a">4.1 Throw guided freighters of dumb mass, not guided pellets</span>

Do not put guidance on every slug. Package *N* tonnes of sintered regolith into a freighter round carrying **one** minimal GNC unit — cold-gas or small electric trim thruster, transponder, retroreflector. The payload stays dumb, inert, and cheap; the guidance rides once per round and amortises over the entire mass.

This converts "impossible open-loop ballistic precision over 64,000 km" into "ordinary launch precision plus a few cm/s of mid-course correction" — trivially within reach.

<span style="color:#666">Trade: a guidance package per round, and some reintroduced value-per-tonne. Negligible against tonnes of regolith.</span>

### <span style="color:#2d7a8a">4.2 Catch in lunar orbit, not at L2</span>

Dispersion scales with range and transit time, and L2 is the worst case — escape velocity, a multi-day climb, errors integrating the whole way. Instead throw **sub-escape**, ~1.7–1.8 km/s, into a low circular catch orbit. This cuts velocity, distance, and integration time simultaneously, and puts the catch in a regime where rendezvous is already solved.

Accumulate bulk in low lunar orbit; ferry to L1/L4/L5 with a slow solar-electric tug on its own schedule.

> This splits O'Neill's one never-solved problem (precise ballistic catch at a libration point) into **two already-solved problems**: a sub-escape throw to orbit, and routine autonomous orbital rendezvous plus a patient electric ferry. Swapping one elegant-but-open problem for two ugly-but-closed ones is the correct trade.

### <span style="color:#2d7a8a">4.3 Make the catcher active and autonomous</span>

A manoeuvring catcher: wide aperture, optical + transponder tracking of the incoming stream, enough delta-v to null whatever residual the freighter's own trim couldn't. The freighter closes most of the gap; the catcher closes the last metres. Both ends cooperating is what O'Neill's passive net could never do.

## <span style="color:#1e5a8a">5. The demonstrator — what to build first</span>

**A closed-loop precise-delivery-and-catch demonstrator, cubesat scale, in LEO or LLO.** A guided freighter and an autonomous catcher, demonstrating *deterministic mass transfer across a meaningful gap.* A few hundred kilograms of smallsat and a competent GNC team. The guidance layer is the real product — the one blank O'Neill had to leave that we can now fill in.

### <span style="color:#2d7a8a">Suggested phasing</span>

| <span style="color:#1e5a8a">Phase</span> | <span style="color:#1e5a8a">Objective</span> | <span style="color:#1e5a8a">Retires</span> |
|---|---|---|
| **0 — Bench** | Sintered-regolith-simulant round; structural + thermal cycling; GNC unit integration into a representative slug | Materials risk (§7) on the round itself |
| **1 — LEO closed-loop** | Freighter released at known dispersion; active catcher acquires, tracks, nulls residual, captures | The core capability: deterministic cooperative catch |
| **2 — LEO stream** | Multiple freighters, cadence + thermal load on catcher, accumulation logic | Throughput, queueing, catcher saturation |
| **3 — LLO** | Repeat Phase 1 in lunar orbit; sub-escape catch geometry; tug hand-off | The operational environment; ferry integration |

Phase 1 is the keystone. Everything before it is enabling; everything after is scaling.

## <span style="color:#1e5a8a">6. What this does and doesn't rescue</span>

The **bulk** logistics case stands free of the lunar-water reserve question entirely. Regolith is a flow surplus — effectively infinite, available equatorially with no prospecting, zero life-support option-value. This is the TANSTAAFL-compliant export the whole analysis was hunting for, and the architecture lives or dies on the catch capability, not on a reserve we can't yet measure.

The **propellant** residual does not get rescued. Crew transfers and high-thrust burns that genuinely need stored chemical energy still ride on polar water and its still-inferred reserve. The catapult *routes around* the depot thesis rather than saving it, and leaves real propellant as the smaller, still-uncertain market. That's a feature — it shrinks the part of the economy exposed to the prospecting gamble — but it must be named, not buried.

## <span style="color:#1e5a8a">7. Open risks, stated plainly</span>

- <span style="color:#b03a2e">**Sintered-round survivability.**</span> Thermal and structural integrity of a sintered-regolith round over a multi-day transit is genuinely unknown — undemonstrated even on a bench, unlike the linear motor. This is the real materials risk and is why Phase 0 exists before any flight.
- <span style="color:#b03a2e">**Catcher saturation.**</span> A stream, not a shot. Catcher delta-v budget, aperture, and thermal load under sustained cadence are unmodelled here and gate throughput.
- <span style="color:#b03a2e">**Propellant exposure.**</span> Per §6 — the residual market still rides unmeasured ice. VIPER (now late-2027, Blue Origin / Blue Moon MK1) and Chang'e-7 (2026, Shackleton rim) are the first assays. No resource-grade data before then.
- <span style="color:#b03a2e">**Tug economics.**</span> The solar-electric ferry from LLO to libration point is assumed, not costed. Slow is fine for dumb mass; the delta-v and trip-time arithmetic still has to close.

## <span style="color:#1e5a8a">8. Dual-use and governance — from day one, not as an afterthought</span>

A guided freighter that can deterministically place tonnes of mass at a chosen cislunar point is, *by construction,* a precision kinetic delivery system. The catch problem and the targeting problem are the same problem; refining the guidance sharpens both edges identically. A real lunar mass driver is therefore a treaty question, not merely an engineering one — Heinlein understood the export catapult and the bombardment catapult were one machine, and a guidance package welds them tighter rather than separating them.

This is intrinsic to the architecture and has to ride alongside the engineering from the first phase: governance framing, cooperative-only catch protocols, transparency of cadence and trajectory, and explicit non-applicability of the guidance stack to uncooperative terminal targets. The logistics work is open; the targeting work is not, and the proposal is bounded accordingly.

## <span style="color:#1e5a8a">9. The ask</span>

A decision on whether to scope **Phase 0 (bench)** as a funded work item: sintered-regolith-simulant round fabrication, thermal/structural cycling, and GNC-unit integration into a representative slug. It's the cheapest phase, it retires the one undemonstrated materials risk, and it produces a tangible artifact that makes Phase 1 fundable. Everything in this proposal stands on whether a sintered round survives the trip — so test that first, on a bench, before anything flies.

---

<span style="color:#666">**One-line summary:** stop exporting a refined liquid, export raw momentum — and build the closed-loop guided delivery-and-catch capability first, because it's the one piece O'Neill had to leave blank and the one piece that's now trivially within reach.</span>
