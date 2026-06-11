# <span style="color:#2d7a8a">Streamed-Grain Construction at Earth–Moon L1 — A Radiation-Pressure Bound</span>

<span style="color:#666">Working note for the cislunar roadmap. Companion to the mass-driver complement (master draft §5). Status: negative result with derived design rule. Pre-Les-Johnson; numbers reproducible via `model.py`.</span>

## <span style="color:#2d7a8a">The proposition tested</span>

A lunar-surface mass driver throws a *fine regolith stream* onto the stable manifold of Earth–Moon L1; grains arrive cold, accrete cohesively onto a station-kept seed, and are sintered in place into structure. The appeal: no per-grain propulsion, ambient solar radiation pressure (RP) and Lorentz forces as free terminal actuators, cohesion (not gravity) as the binding force at grain scale.

The question that decides paper-vs-concept: **does the arrival dispersion stay below a buildable collector scale, and is the escaping (uncaptured) fraction a tolerable cislunar contamination source?**

## <span style="color:#2d7a8a">Verdict</span>

For the lunar-surface → L1 baseline, **no.** The concept is radiation-pressure-limited and does not close. It survives only by retreating to short baselines or coarse sorted slugs — at which point it converges onto two existing concepts from opposite directions.

## <span style="color:#2d7a8a">Why it fails: the transit-time × differential-RP integral</span>

**Geometry.** Earth–Moon L1 is 58,010 km from the Moon (0.151 a_EM); in-line unstable e-folding ~31 hr. A lunar throw cannot be fast — the grain decelerates up the lunar well for the whole arc.

<span style="color:#b5651d">Transit is multi-day.</span> Gentle arrival (~18 m/s, wanted for cohesive capture) → 112 hr. Even a hard 100 m/s arrival → 62 hr.

<span style="color:#b5651d">Differential RP is the dominant dispersion term.</span> RP drift scales as 1/r, so a grain-size *spread* produces an irreducible arrival smear (the mean drift is a correctable aim-off; the spread is not). Over 112 hr at 500 µm:

| size spread | 1σ arrival smear |
|---|---|
| 5% | 9 km |
| 20% | 37 km |
| 50% | 91 km |

Pointing is negligible by comparison: 10″ over the 58,000 km lever arm is only 2.8 km/axis. The arrival pattern is RP-smeared, not pointing-smeared — and it worsens as grains get finer (larger 1/r) and arrivals get gentler (longer transit, drift ∝ t²).

<span style="color:#b5651d">Collector scale forced (η = 0.999, 1 kg/s):</span>

| grain | spread | collector radius |
|---|---|---|
| 500 µm | 20% | 150 km |
| 500 µm | 5% | 31 km |
| 1 mm | 5% | 16 km |
| 2 mm | 2% (sorted slugs) | 3.2 km |

<span style="color:#b5651d">Contamination.</span> Even η = 0.999 sheds 0.1% of 1 kg/s = **32 t/yr** of escaping dust. The escapes are the fine tail (largest drift) with blowout β ≈ 4×10⁻⁴ — far below the β > 0.5 self-clean threshold, so the dust *persists* in cislunar space. This is the O'Neill/SSI "sandblast" contamination, reproduced and made worse by fineness. Driving escape below ~1 kg/day needs η > 0.99999, pushing collectors larger still.

## <span style="color:#2d7a8a">The design rule</span>

> A streamed-grain construction architecture is viable iff
> **½ · (differential-RP acceleration) · (transit time)² ≪ collector radius**,
> i.e. transit-time × differential-RP must stay below the collector scale.

Three levers satisfy it; each dissolves the concept's identity:

1. <span style="color:#b5651d">Coarsen + tightly sort</span> — 2 mm at 2% spread → 3 km collector, but sorted slugs arriving at speed need real deceleration and are no longer a "stream." → **O'Neill (1977) guided-canister catcher.**
2. <span style="color:#b5651d">Shorten the baseline</span> — driver staged near the point (2,000–10,000 km) → 3–6 hr transit, RP smear ~tens of metres, collector ~10 km (now pointing-limited). But this presupposes the cislunar logistics the scheme was meant to bootstrap.
3. <span style="color:#b5651d">Active confinement at the collector</span> — abandon ballistic precision; herd a loose cloud with fields at the catcher. → **Quadrelli (2014, NIAC Orbiting Rainbows).**

The "fine ballistic stream, cold accretion, sinter-in-place" middle ground evaporates under the RP integral.

## <span style="color:#2d7a8a">Prior art (what this is bounded against)</span>

- <span style="color:#444">**O'Neill / Space Studies Institute (1977–)**</span> — mass driver → mass catcher at an Earth–Moon Lagrange point, electrostatic deflection-plate terminal guidance. The dust-cloud-at-catcher critique is already documented in the SSI/Lunarpedia lineage.
- <span style="color:#444">**Quadrelli & Swartzlander, NIAC "Orbiting Rainbows" (Phase I 2012, Phase II 2014)**</span> — granular spacecraft: a loose grain cloud optically trapped/shaped into an aperture. Explicitly studied Lagrange-point operation and flagged grain charging + lack of natural damping as the hard problems. Keeps the cloud loose/disposable; never sintered rigid.
- <span style="color:#444">**Regolith sintering (solar/laser/microwave)**</span> — mature; supplies the forming step but assumes a surface powder bed, not free-space accretion.
- <span style="color:#444">**Grain dynamics (Burns et al. 1979; debris-disk β, dusty-plasma)**</span> — supplies the RP/Lorentz physics, only ever applied to *natural* dust, never as a construction actuator outside Orbiting Rainbows.

## <span style="color:#2d7a8a">IRG framing</span>

Pitch as the **quantitative bound**, not a novel architecture: the design rule above, plus the demonstration that both viable limits land back on O'Neill and Quadrelli from opposite ends. A rigorously bounded negative result is the honest counterweight to the mass-driver optimism in §5, and is far more defensible in Q&A than the positive pitch (which any reviewer who knows the NIAC work dismantles).

## <span style="color:#2d7a8a">Open refinements (do not change the verdict)</span>

- Full planar CR3BP arc + manifold-tube width at the collector (replaces lunar two-body).
- Time-varying Sun-line: ~40° rotation over a 3-day transit adds smear not yet modelled (worsens result).
- Impact-speed dispersion → splash-back as a second contamination channel (energy tolerance maps to arrival-speed spread).
- Lorentz steering budget for photo-charged grains (candidate fourth lever; charge/mass spread likely re-introduces the same dispersion problem).
