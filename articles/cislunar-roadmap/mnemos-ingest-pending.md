# Mnemos ingest payload — 2026-05-18 cislunar roadmap session

**Status:** Mnemos MCP transport was down at the end of the drafting
session (three calls failed with generic "Error occurred during tool
execution"; HTTPS endpoint returned 403 at root, suggesting the Fly app
was responding at network layer but the MCP-server side was not).

**Action required:** re-ingest this document when Mnemos transport is
back up. Run:

```python
mnemos:ingest_document(
    title="Claude – Cislunar roadmap workshop draft (The Long Bootstrap, 2026–2120) – 2026-05-18",
    text=<contents of this file below the marker line>,
    source="claude",
    tag="claude",
)
```

Investigation for post-viva: `flyctl logs -a mnemos` to see why MCP
transport failed on 2026-05-18 around 14:23 UTC. Could be the same
class of bug as the four-bug cycle from April 2026 (Mnemos 404 via HTTP
not proper MCP) but on the ingest path rather than the query path.

---

# Claude – Cislunar roadmap workshop draft (The Long Bootstrap, 2026–2120) – 2026-05-18

Extended workshop session drafting a long-form cislunar economics policy article authored by Todd McCaffrey under FoxxeLabs Limited. Conversation moved from informal Q&A on space-based compute / lunar economy / Heinlein's *The Man Who Sold the Moon* into a 13-section, ~18,370-word workshop draft committed to `articles/cislunar-roadmap/master-draft.md` in `todd427/foxxelabs-config`. Final commit `263c4cd` on `main`. To be read post-viva (dissertation due 12 June 2026).

## Repo location and conventions

`github.com/todd427/foxxelabs-config`, path `articles/cislunar-roadmap/master-draft.md`. New `articles/` namespace established for publication work. Footer per CONVENTIONS.md: "FoxxeLabs Limited · May 2026". Color palette per Todd's standing preference: navy #0f3a5f title, medium blue #1e5a8a H2, teal #2d7a8a H3, sienna #a0522d gating-question accent.

## Document arc, section by section

**§1 Argument in one paragraph.** Published cislunar roadmaps (DARPA LunA-10, NSS Roadmap, Aerospace Corp CSPS, AIAA ASCEND, CAST Queqiao) converge on the same phased architecture. What is not settled is which layer deserves capital now. Visible hardware draws investment; invisible infrastructure determines whether the architecture works. The bottleneck is inverted from where capital flows. Three structural problems the current orbital-DC boom has not priced in: chip-refresh, bottleneck-inversion, architectural displacement.

**§2 Why this document exists now.** Eighteen-month context: Starcloud $170M Series A at $1.1B valuation (fastest YC unicorn), NVIDIA Space-1 Vera Rubin module announcement, 200k+ satellites filed across SpaceX/Blue Origin/China/Starcloud, Anthropic-SpaceX deal signal in May 2026. Three things the document aims to do: integrate published roadmaps, identify structural problems, name leverage points. Intended readers: agency program managers, congressional/parliamentary staff, science advisers, multi-decade-horizon capital, founders willing to bet on unfashionable layers.

**§3 Geography of cislunar.** Five-node graph: LEO, GEO, L1, L2, lunar surface. Delta-v geometry around L1 specifically: 2.5 km/s to lunar surface, 1.7 km/s to GEO, 3.8 km/s to LEO (descending into Earth's gravity well from above), low to L2/deep space/TMI. L1 station-keeping ~10 m/s/year — two orders of magnitude cheaper than LEO. L1 is the keystone; no other point in cislunar shares its delta-v properties. University of Colorado 1989 published this architecture. NSS Roadmap Milestone 14 published it again in 2021. Neither funded. Gateway is at NRHO not L1. Three implications: cislunar economy is not lunar; L1 is the keystone; geography is destiny, politics contingent.

**§4 Layer 0 — Foundations 2026–2032.** Four invisible foundations: Starship cost curve, L1 depot, autonomous ISRU, federated cislunar SSA. Three of four underfunded relative to option value; fourth (launch cost) on track but fragile. Starship cadence-times-reuse-turn-time is the right metric, not stated prices. Single-vendor dependency is real structural risk. L1-depot funding anomaly is the central anomaly: every architecture identifies the same keystone, no national program funds it. Gateway captures the budget line. Right autonomous ISRU milestone: 100 kg/day, 90 days by 2032. Cislunar SSA standards work is the longest-payoff Layer 0 investment; venues ISO TC20/SC14, IADC, UN COPUOS LTS. Property-rights bifurcation (Artemis Accords vs ILRS) will likely settle into parallel governance not unified regime; European actors have leverage at the boundary.

**§5 Layer 1 — Propellant economy 2030–2040.** Depot is the market, not the regolith. Lunar polar ice the answer by elimination (extractable, convertible, shallow delta-v well). Chemistry undergraduate; integration at industrial scale hard. Throughput needed for first paying market modest: <1000 t/year raw water extracted. Customer is L1 not lunar surface (lander refuelling savings eaten by integration overhead). Aerospace, Charania & Olds 2006, NSS analyses converge on $2000–4000/kg central case at L1. GEO satellite servicing is the commercial bridge — first cislunar activity with commercial customer, $5–15B/year by 2040 central case. Asteroid water as complement not substitute (Planetary Resources generation failed on cadence not technical infeasibility; current AstroForge/TransAstra generation has better economics but unresolved cadence). Three unresolved gates: autonomous ISRU at scale, in-space cryogenic propellant transfer, propellant standards. Bear case: aggressive Starship outcome (sub-$200/kg LEO) compresses lunar propellant economics; Layer 1 robust against moderate Starship outcome, fragile against aggressive. Propellant is door-opener for Layer 2 materials, not endpoint.

**§6 Layer 2 — Bulk materials and structural manufacturing 2038–2050.** Marginal-cost cascade: once Layer 1 propellant operation exists, additional product lines charge only incremental capex against shared infrastructure. Railroads-vs-manufacturers investment analogy. Oxygen as waste-stream value capture; structural aluminium from anorthite (19% Al by mass) as first real export — production volume tens to hundreds of tonnes/year, customer base mixed but bulk at L1. Regolith-derived radiation shielding the underweighted Layer 2 product. Asteroid metals: capture-and-process at L1 wins over in-situ for first generation (cadence > fuel cost). First asteroid metal delivery to L1 plausibly 2045–2050. **Where the orbital-DC thesis actually becomes plausible**: multi-gigawatt L1 stations in 2040s/2050s, lunar-derived structure and shielding, chips shipped Earth via routine cislunar logistics, refresh on logistics cadence — none of this is what Starcloud generation is building. Anthropic-SpaceX deal honestly framed as 30-year option on Layer 2 infrastructure that doesn't exist yet; Colossus 1 (300 MW Memphis) is the real transaction.

**§7 Layer 3 — Cislunar manufacturing for cislunar customers 2045–2060.** First layer where cislunar economy is structurally circular. Satellite-bus inflection point: first bus manufactured from lunar-derived structural materials with Earth-shipped avionics, integrated at L1. Late 2040s plausible. Strategic significance: changes global satellite-industry structure (Lockheed/Northrop/Airbus/Chinese state primes face integrate-or-be-disintermediated choice by 2050). Orbital construction at scale: kilometre-class structures at L1 from lunar materials, mid-2050s. **What stays on Earth indefinitely** (the category is larger than optimists admit, smaller than protectionists assume): frontier semiconductors, specialty polymers and organic chemistry, biological consumables, specialty alloys, humans. By 2060 cumulative mass of lunar-manufactured orbital construction at Lagrange points plausibly exceeds cumulative Earth-launched structural mass in cislunar. Mars as customer not competitor — L1 to TMI ~0.8 km/s. Governance under load: Antarctic-Treaty-good-outcome vs South-China-Sea-bad-outcome.

**§8 Chip-refresh problem.** The single structural argument that kills the LEO-DC thesis on its own terms. Performance per watt doubles ~3 years; terrestrial DCs refresh on that cycle. LEO refresh requires return (impossible), in-orbit servicing (operationally expensive, infrastructure doesn't exist), or full replacement (every 3 years). Replacement-as-refresh arithmetic: LEO satellite ~$30–100M total, substantial fraction every 3 years; terrestrial pays only chips ($10–50M) and keeps building 30 years. Energy/cooling makes it worse. Three workarounds (longer cycles, orbital servicing, tolerate performance gap) all fail. Implication: current Starcloud/Axiom/NVIDIA-Space-1 pitches built around architecture chip-refresh rules out. Starcloud's Bitcoin hedging on Starcloud-2 consistent with technical staff understanding the problem perfectly well. L1 architecture survives because Layer 2 logistics infrastructure exists, data centre is modular (only compute modules refresh), energy economics durable. LEO-DC industry of late 2020s/early 2030s does not become orbital-DC industry of 2050s.

**§9 Bottleneck-inversion problem.** Generalisation of Layer 0 diagnostic finding. Capital flows to visible hardware (rockets, satellites, landers) away from invisible infrastructure (depots, autonomy, SSA federation, standards). Visible hardware has single-sentence story, discrete events, photographable; infrastructure has none of these. Historical analogues: railroad boom overfunded locomotives/underfunded signalling; aviation overfunded aircraft/underfunded navigation; internet overfunded routers/underfunded governance. State actors are the only realistic counter because VC's 7–10 year exit horizons can't fund 30-year-payoff infrastructure. Excellent business, bad VC. US heavy on visible, light on invisible; China heavy on integrated state planning; Europe light on both; India earlier stage; Japan autonomy + components. Cislunar policy entrepreneurship asymmetry: a few dozen well-placed individuals can move trajectory by years. Venues: ISO TC20/SC14, IADC, UN COPUOS LTS, bilateral agency forums.

**§10 Architectural displacement problem.** Geographic version of the other two. High-value activity does not happen where attention is focused — not LEO, not lunar surface as destination, not GEO — but at Earth-Moon Lagrange points particularly L1, in a buildout 20 years behind current discourse implications. Mining-region-vs-port-city analogy: port cities historically outgrow the mining regions that justified them. Four reasons displacement is invisible: L1 has nothing to look at; Artemis is structured around lunar surface; Chinese program is lunar-surface-and-L2-vicinity; commercial actors pitch destinations with current customers. Strategic positioning implications: state actors get structural advantage from L1 infrastructure investment 2026–2030; commercial actors should position for L1 services; European actors have leverage at boundary; deep-space mission planners should integrate L1 staging. Synthesis: actor that funds invisible Layer 0 now (L1 depot + SSA federation) captures structural advantage in eventual L1-based industry of 2040s+.

**§11 Six gating questions.** Q1 Starship sustained $500–1500/kg weekly cadence by 2030 (single largest variance). Q2 autonomous ISRU >100 kg/day 90 days by 2032. Q3 L1 depot funded by mid-2030s (currently no signal). Q4 property rights bifurcated or internationalised (bifurcation more likely). Q5 microgravity industrial processing demonstrated at meaningful scale. Q6 chip-refresh solved without lunar fabs (working assumption: yes, via Earth-shipped chips on routine cislunar logistics by late 2030s).

**§12 Where to put the leverage.** State actors priority order: (1) fund L1 depot, (2) fund ISRU integration to milestone, (3) fund SSA federation and standards, (4) fund heavy-lift redundancy, (5) participate in governance forums. Commercial actors: (1) invest in Layer 1 infrastructure operators not Layer 2 products, (2) structure capital for 30-year horizons (rules out VC), (3) position for L1 services pre-customers. Policy entrepreneurs: shape agency decisions, participate in standards, frame public discourse.

**§13 Conclusion.** Cislunar economy is going to happen — geography makes it inevitable. Question is timing and on whose terms. Fastest plausible trajectory delivers self-sustaining cislunar economy by late 2050s; slowest by 2080s. Forty-year spread, most of it determined by 2026–2032 window. The argument is not that cislunar is overhyped — it is correctly hyped in destination, profoundly underhyped in timing and architecture. Geography is destiny; politics is contingent; window for shaping the contingent part is the next decade.

## Original conversation arc

Started with informal Q&A on space-based compute plans (Starcloud, NVIDIA Space-1, Anthropic-SpaceX May 2026, FCC mega-constellation filings). Expanded through efficiency/cost dynamics (algorithmic 2–4x/yr, hardware 2x perf/watt per gen), lunar fab impossibility (regolith reduction, fab-as-ecosystem not machine, EUV transport problem), satellite manufacturing on Moon (40–60% of mass tractable, brains stay Earth-supplied), cislunar economy bootstrap, asteroids as complement not substitute (M-type metals, C-type water, microgravity processing unsolved), Heinlein's Future History as model for founder psychology. Todd pivoted to roadmap (not fiction). Synthesis delivered: five-layer cislunar architecture, L1 as keystone, gating questions, leverage points.

## Citation map

Closest precedents: DARPA LunA-10 Field Guide (4-stage model), NSS Roadmap Milestone 14 (explicit L1/L2 logistics bases), Aerospace Corp CSPS "Cislunar Development: What to Build—and Why", U Colorado Advanced Mission Design 1989 (NTRS), Chinese Queqiao constellation paper (Yang Mengfei 2024), AIAA ASCEND 2024 "Early Infrastructure Enablers for a Future Cislunar Economy", Chicago Society for Space Studies "Beyond Flags and Footprints" Jan 2026, Arkisys "The Port" (closest current L1-depot build). Adjacent: Casey Handmer, Phil Metzger (ISRU realism), Charania and Olds 2006 (propellant mass-balance).

## Publication strategy

Five tailored articles from one master synthesis, sequenced:

1. *Issues in Science and Technology* (policy architecture, ~5–6k words, Pamela Melroy reader)
2. TVIW / Interstellar Research Group conference paper (deep-time, ~6–8k, Les Johnson as gatekeeper/chair)
3. *Scientific American* (architectural narrative, ~4–5k, leverages "forthcoming in Issues")
4. *WIRED* (contrarian polemic, ~3k, leverages "author of forthcoming SciAm")
5. *New Scientist* or *FT* opinion (European policy, ~1.5–2.5k)

Substack rejected per Todd's standing exclusion. General-interest tech press avoided to protect technical content. Centauri Dreams (Paul Gilster) to be verified as IRG-adjacent venue. Melroy/Johnson consent re named-reader acknowledgment to be confirmed.

## Next-pass action items captured in draft footer

- Verify Charania and Olds 2006 propellant mass-balance citation (§5).
- Pressure-test chip-refresh arithmetic against current NVIDIA/AMD/Intel ASIC roadmaps with Johnson (§8).
- Pressure-test L1-depot funding anomaly and European-leverage claim with Melroy (§4, §9, §10).
- Tighten railroads/Standard Oil analogies — strong for SciAm/WIRED, possibly too cute for *Issues* (§5, §6).
- Fact-check Anthropic-SpaceX paragraph in §6 before any publication.
- Extract venue-tailored versions: `extracts/issues.md`, `extracts/sciam.md`, `extracts/wired.md`, `extracts/europe.md`, `extracts/irg-conference.md`.

## Process notes

Repo-only delivery confirmed post-compaction. Markdown source-of-truth in foxxelabs-config, docx as build artifact only if/when needed. Committer identity: Claude (git-mcp) <git-mcp@foxxelabs.ie>. No Co-Authored-By trailers. Footer format "FoxxeLabs Limited · May 2026" per foxxelabs-config CONVENTIONS.md. Color palette per Todd's standing preference. Reader plan: Melroy on policy version, Johnson on technical/IRG version (Johnson is IRG chair, not just reader). To be read by Todd post-viva (June 2026).

## Commits

- `b59f469` chunk 1 (lead + Sections 1–2)
- `71a6a2d` chunk 2 (Section 3, geography)
- `1b2de1c` chunk 3 (Section 4, Layer 0)
- `b853ef0` chunk 4 (Sections 5–6, Layer 1 + Layer 2)
- `a5533ab` intermediate commit (write+commit during compaction interruption)
- `263c4cd` final push — Sections 7–13 added, workshop draft complete
