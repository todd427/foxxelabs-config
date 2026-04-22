# Anderson Activation Layer for Léargas

**Status:** Research note — not yet a committed PRD amendment
**Date:** 22 April 2026
**Author:** Todd McCaffrey with Claude (scaffold)
**Related:** `leargas/docs/PRD.md` v1.1 §4.4 (Collins-Loftus pillar)

---

## Motivation

Léargas PRD v1.1 cites Collins & Loftus (1975) as the theoretical pillar for spreading activation (§4.4). This captures the *conceptual* move — probe a seed, activation propagates to nearby components — but not the quantitative machinery developed by Anderson (1983) and formalised in the ACT-R cognitive architecture.

The current implementation treats proximity on the Fisher-Rao manifold as the sole retrieval signal. This is geometrically clean but cognitively thin. It cannot represent:

- **Transient activation state** — what was recently probed is not currently distinguished from what has never been probed. There is no short-term memory layer over the long-term manifold.
- **Priming decay dynamics** — if component A was probed five minutes ago and component B was probed five hours ago, both appear equally "cold" to the next probe.
- **Multi-source summation** — if a session probes several related concepts in sequence, Léargas has no mechanism to accumulate activation at their shared neighbours.
- **Asymmetric associations** — Fisher-Rao distance is symmetric; real associative strength is not. "Surgeon" primes "scalpel" more strongly than "scalpel" primes "surgeon."

Anderson's contribution was to specify activation as a *scalar quantity with explicit dynamics*: rises on input, sums across sources, decays over time. Bringing this into Léargas gives the architecture a working-memory layer analogous to hippocampal-prefrontal gating — without disturbing the GMM manifold that does the long-term consolidation work.

## Theoretical Pillar (proposed §4.5)

**Anderson (1983) spreading activation with decay.** Each GMM component carries a transient activation level, updated by probes and decaying between them. Retrieval ranking combines long-term manifold proximity (Fisher-Rao geodesic) with short-term activation state (currently excited components rank higher). Session-level state is preserved; the manifold itself remains stable.

## Formal Specification

### Activation state

Each component *k* has:

| Field | Description | Update frequency |
|---|---|---|
| `base_activation` | Long-term log-weight of the component | Sleep consolidation |
| `transient_activation` | Momentary excitation, scalar ≥ 0 | Every probe |
| `last_update_t` | Timestamp of most recent activation change | Every probe |

`base_activation` is already present in the current GMM as log(weight). `transient_activation` is new.

### Update rule

On probe with seed *s*, spreading activation from *s* deposits excitation at component *k* as:

```
ΔA_k = α · exp(-β · d_geodesic(s, k))
```

Where:
- `α` is the probe strength (default 1.0)
- `β` controls spread sharpness (default 1.0 — tune on validation)
- `d_geodesic` is Fisher-Rao distance between seed embedding and component *k*'s centroid

Multiple probes in a session sum:

```
A_k(t) = Σ_probes ΔA_k,i · decay(t - t_i)
```

### Decay function

Short-term decay is power-law, matching Anderson's ACT-R formulation:

```
decay(Δt) = (1 + Δt / τ)^(-d)
```

Where:
- `τ` is the decay time constant (default 15 minutes — tune)
- `d` is the decay exponent (default 0.5 — Anderson's standard value)

This is distinct from the Ebbinghaus decay on component *weights* (days-to-months). Activation decay is session-scoped. A component with high activation five minutes ago is still warm; after two hours it has returned to baseline.

### Retrieval ranking

The `probe(seed, hops)` endpoint returns components ranked by combined score:

```
score_k = w_base · base_activation_k + w_trans · transient_activation_k
```

Default weights: `w_base = 0.6`, `w_trans = 0.4`. Tune on retrieval feedback.

When `transient_activation` is uniformly zero (cold start, long session gap), ranking reduces to pure manifold proximity — current behaviour. When recent probes have excited neighbouring components, those excited components rank higher than their geodesic distance alone would place them. This is the priming effect.

## API changes

### `probe(seed, hops)` — modified

Existing behaviour preserved as fallback. Additional returned fields per component:

```json
{
  "component_id": 23,
  "label": "Legion somatic unity",
  "geodesic_distance": 0.47,
  "transient_activation": 0.31,
  "combined_score": 0.58,
  "last_activated": "2026-04-22T15:12:03Z"
}
```

### `working_memory()` — new

Returns all components with `transient_activation > threshold` (default 0.1). Sorted by activation descending. Represents the current session's active thought context.

### `clear_working_memory()` — new

Resets all `transient_activation` to zero. For session boundaries or manual reset. Sleep consolidation (Aislinge) also clears at cycle start.

### `reconstruct(fragment)` — modified

Fragment now deposits partial activation at multiple components simultaneously; the reconstruction is the equilibrium activation pattern after spreading. Replaces current single-seed behaviour with proper pattern-completion dynamics.

## Integration with Aislinge

Activation layer is **waking-state only**. Sleep consolidation (Aislinge REM pass, Ebbinghaus decay on weights) operates on the long-term manifold; transient activation is cleared at sleep cycle start.

Rationale: short-term priming should not survive sleep. This matches the neuroscience — hippocampal replay during sleep consolidates long-term structure but clears working-memory state. It also avoids a subtle bug: if transient activation persisted across sleep cycles, Aislinge's REM pass would see components as "warm" that were only warm because of yesterday's probes, distorting consolidation.

## Integration with Léargas v0.4 (experiential axis)

If the experiential axis (affective + spatial + relational) is implemented per v0.4, the activation layer operates on *both* axes independently. A probe can excite semantic neighbours, experiential neighbours, or both — depending on the probe mode.

The `now_point` becomes a continuous standing probe: current affective state deposits low-level activation at experiential-axis components matching the current mode. This means the "active working memory" at any moment is biased toward components resonant with the present experiential state — which is exactly what the v0.4 PRD describes as the resonance mechanism, now given a proper mechanism.

## Open questions

**Time constant τ.** 15 minutes is a guess. Real value should be tuned against retrieval quality — how long does a probe usefully prime subsequent probes before the activation stops helping and starts adding noise? Answerable empirically once the layer is built.

**Asymmetric connection strengths.** Anderson's full formulation has `S_ij ≠ S_ji`. The current spec uses symmetric geodesic distance. Introducing asymmetry would require either a learned connection-strength matrix (training signal unclear) or a proxy — e.g. information-theoretic asymmetry derived from conditional probability on the manifold. Defer to Phase 2.

**Baseline activation as log-weight.** Anderson's base-level activation is computed from a power-law decay over past retrievals. Léargas's component weights are already a good proxy — components that have absorbed many documents have high weight, and weight decays under Ebbinghaus. But the mapping is not exact. Worth validating whether `log(weight)` behaves like Anderson's base-level activation in practice.

**Fan effect in continuous space.** Anderson's fan effect divides activation among a node's connections. On a continuous manifold, "number of connections" is ill-defined — every component has non-zero distance to every other. A sensible discretisation is k-nearest-neighbour graph on components, with spreading activation flowing only along graph edges. This also speeds up the computation from O(N²) per probe to O(Nk).

**Integration with Lórg.** If Lórg (embodied agent layer) generates probes from real-world sensor input, those probes should deposit activation the same way any other probe does. No architectural change needed, but worth flagging that activation state then reflects not just deliberate queries but ambient environmental input. Design decision: does Lórg probe continuously or only on salience events?

## Implementation notes

- `transient_activation` added as new field on existing component records. No migration needed — defaults to 0.
- k-NN graph on components computed at GMM fit time and cached. Rebuild on manifold changes (Aislinge sleep cycle).
- Spreading activation computation is vectorised matrix-vector multiply; fits comfortably in the existing CUDA path on Daisy.
- Working-memory endpoint is a simple filter query; no new storage layer required.
- Session state lives in Fly.io memory (process-local); no persistence needed. Restart clears activation, which is correct.

## Phase

Propose as **Phase 3** or **Phase 4** in the v1.1 roadmap — after full-corpus scaling, before Lórg integration. Core manifold work must be stable before adding a dynamics layer on top.

## Theoretical lineage

The proposed amendment brings Léargas into alignment with the cognitive architecture tradition:

- Quillian (1968) — semantic memory as network of nodes and links
- Collins & Loftus (1975) — spreading activation theory of semantic processing
- Anderson (1983) — spreading activation formalised with explicit decay dynamics
- Anderson (1993, 1996) — ACT-R architecture; activation as the central retrieval signal
- Berkowitz (1989) — CNA as the social-psychological application (tangentially relevant via UCA dissertation)

Léargas as currently specified sits at Collins & Loftus (1975). This note moves it to Anderson (1983). The natural next step — ACT-R-style production rules operating over activated components — is out of scope for this amendment and would be a separate architectural move if ever pursued.
