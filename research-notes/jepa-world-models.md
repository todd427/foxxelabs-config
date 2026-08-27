# <span style="color:#1f6feb">JEPA World Models — Position and Experiment Brief</span>

**Status:** Research note — watch/build decision pending one experiment
**Date:** 27 August 2026
**Author:** Todd McCaffrey with Claude (scaffold)
**Related:** `colainn`, `lorg`, `sleep-consolidation` (Aislinge/Léargas/Radharc), `measure`

---

## <span style="color:#1f6feb">Claim under examination</span>

> JEPA-based world models could enable true reasoning and planning — the capability gap that pure language modeling never closes.

Verdict: the structural argument is sound, the "never closes" is overstated, and the thesis is strongest exactly where language is a poor sensor. That last point is the one that matters for this stack.

## <span style="color:#1f6feb">Architecture in one paragraph</span>

JEPA (LeCun 2022): encode x and y with (near-)shared encoders; train a predictor s_x → s_y, conditioned on an action and an optional latent z that absorbs whatever y contains that x cannot determine. Loss is in embedding space, never observation space. Two consequences: the encoder is free to discard unpredictable detail, so representation is pushed toward causally relevant features; and because nothing is reconstructed, collapse must be prevented explicitly (VCReg or EMA target encoder). The predictor is a learned transition function over latent state — roll it forward against a cost and you have model-predictive control. That is the whole "reasoning and planning" story.

## <span style="color:#1f6feb">Evidence, dated</span>

<span style="color:#8250df">**Verified against primary source (arXiv abstract/paper):**</span>

- arXiv 2601.00844 — value-guided action planning with JEPA world models. Planning is MPC over latent distance to goal, finite horizon. Authors describe prior JEPA planning results as promising but limited.
- arXiv 2607.06925 — compact JEPA world model (LeWM family, Maes et al. 2026) for spatial relations. Finding: feeding the language goal into the transition can backfire when the instruction names the relation being evaluated. Cost-side or critic-side language conditioning survives; predictor-side does not.
- arXiv 2603.25975 — wake-sleep compression rediscovering Schank primitives. Explicitly proposes JEPA for *what the states are* and wake-sleep library learning for *how states transform*. This is the Aislinge shape.

<span style="color:#8250df">**Secondary-source only — verify before citing outward:**</span>

- V-JEPA 2 (Meta FAIR, June 2025, arXiv 2506.09985): 1M hours video + 62 h robot data, ~80% zero-shot manipulation success. Strongest evidence for latent dynamics transferring to control with tiny action-labelled data.
- LeCun left Meta early 2026; AMI Labs, ~$1.03B. V-JEPA 2.1 released March 2026.
- LeJEPA (Balestriero & LeCun 2025): fewer heuristics, more stable. Causal-JEPA (Nam et al. 2026): object-level masking, latent interventions.
- arXiv 2606.27014 — "A Generalization Theory for JEPA-Based World Models". Not read.
- LeWorldModel (LeWM): ~15M parameters, single GPU, claimed 48× faster planning, collapse-free. **Directly runnable on Iris.**

## <span style="color:#1f6feb">Where the claim overreaches</span>

1. Demonstrated planning is short-horizon manipulation. Nothing JEPA-based has done multi-step abstract reasoning.
2. RL-on-LMs with test-time compute has closed much of the symbolic gap. LMs carry an implicit world model that is adequate for linguistically-encoded domains (maths, code, law) and inadequate where the relevant state was never written down (physical dynamics, continuous control, biometric streams).
3. The camps are converging. Generative world models (Genie, Dreamer, diffusion) plan too. The live question is where the LM sits relative to the latent dynamics model — cost function, goal encoder, or plan critic — not which one wins.

## <span style="color:#1f6feb">Fit with the stack</span>

The stack already has the JEPA-plus-symbolic shape with the JEPA missing.

| Layer | Role in a JEPA framing |
|---|---|
| Mnemos / Imeall / Taithí | Discrete, compositional side — the operators |
| Colainn, Lorg | Continuous non-linguistic time series — where a latent predictor earns its keep and an LM does not |
| Aislinge / Léargas / Radharc | Wake-sleep loop over what a JEPA would call encoder output |
| Mothú | Candidate cost signal for the MPC loop |
| Ceann | Where a plan critic would sit if an LM re-scores latent plans |

## <span style="color:#1f6feb">Proposed experiment</span>

**Goal:** decide build vs watch in one weekend on Iris.

1. Get LeWM running against its own toy environment. Confirm the collapse-free training and planning-speed claims reproduce.
2. Swap the environment for windowed Colainn and Lorg sequences (fixed window, stride, no actions initially — pure next-latent prediction).
3. Baseline: Kalman filter / simple AR model on the same windows.
4. Success criterion: LeWM predictor beats the baseline on held-out horizon-k latent error **and** the learned latent separates something the raw signal does not (e.g. clusters by activity or affective state without labels).
5. If (4) holds, add Mothú as cost and try a trivial MPC loop. If not, file as watched.

Register the run as an eval axis in Measure either way.

## <span style="color:#1f6feb">Open questions</span>

- Does the z latent do useful work on biometric data, or does it collapse to noise absorption?
- Window length vs decay horizon in Aislinge — the JEPA horizon and the consolidation horizon should probably be different clocks, as with the Anderson activation note.
- Whether LeWM's 1D formulation carries over to multivariate biometric channels or needs a per-channel encoder.

---

*FoxxeLabs · 27 August 2026*
