# <span style="color:#0f3a5f">The Long Bootstrap</span>
## <span style="color:#1e5a8a">A Cislunar Roadmap, 2026–2120</span>

*Workshop draft — circulating to Pamela Melroy and Les Johnson for technical and policy read. Not for distribution.*

*Author: Todd McCaffrey, FoxxeLabs Limited. Draft date: May 2026.*

---

## <span style="color:#1e5a8a">1. The argument in one paragraph</span>

The published cislunar roadmaps converge on the same architecture. DARPA's LunA-10 Field Guide, the National Space Society's Roadmap to Space Settlement, the Aerospace Corporation's CSPS analyses, the AIAA ASCEND infrastructure papers, and the Chinese Academy of Space Technology's Queqiao constellation plan describe substantially the same future: a phased buildout from government-anchored exploration, through propellant-economy bootstrap, to cislunar manufacturing for cislunar customers, with Lagrange-point depots as connective tissue and lunar surface industry as the population and manufacturing anchor. The architecture is settled. What isn't settled — and what the current commercial discourse is getting wrong — is *which layer of the architecture deserves capital now*. The visible hardware draws investment. The invisible infrastructure determines whether the architecture works. The bottleneck is inverted from where the capital flows. This document argues the case, names the gating technical and policy milestones, and identifies three structural problems that the current orbital-data-centre boom has not priced in. The piece is a synthesis, not a forecast. The components are in the literature. The integration, and the corrections, are mine.

## <span style="color:#1e5a8a">2. Why this document exists now</span>

Three things changed in the eighteen months ending May 2026. Starcloud raised $170M Series A at a $1.1B valuation, becoming the fastest unicorn in Y Combinator history. NVIDIA announced the Space-1 Vera Rubin module, designed for orbital data centres at twenty-five times H100 compute density. SpaceX, Blue Origin, China, and Starcloud filed for FCC and orbital-slot allocations totalling more than two hundred thousand satellites between them, with Anthropic publicly expressing interest in multi-gigawatt orbital compute as part of a SpaceX deal in early May. Capital is flowing into orbital compute at a velocity the sector has not seen.

The capital is mostly flowing to the wrong layer. The orbital-data-centre thesis as currently pitched — frontier training compute in low Earth orbit, mega-constellations of compute satellites, terrestrial-replacement timelines under ten years — has three structural problems that the published roadmaps already imply but don't state plainly. The chip-refresh problem, which I'll develop in Section 8, kills the frontier-training thesis on its own. The bottleneck-inversion problem, in Section 9, explains why the capital is allocated wrong even when the technical case works. The architectural displacement problem, in Section 10, explains why the *correct* version of the orbital-DC story isn't in low Earth orbit at all but at the Earth-Moon Lagrange points, twenty years later than the current decks suggest, and supplied by lunar industry that doesn't yet exist.

This document aims to do three things. First, integrate the published roadmaps into a single layered architecture and show what they agree on. Second, identify the structural problems the commercial discourse is missing. Third, name the actual leverage points for state and private actors who want this future to happen on the faster end of the plausible range. The intended readers are agency program managers, congressional and parliamentary staff, science advisers, capital allocators with multi-decade horizons, and the small number of founders willing to bet on the layers of the architecture that aren't currently fashionable.

## <span style="color:#1e5a8a">3. The geography of cislunar</span>

Cislunar space is not a region. It's a graph. Five nodes carry essentially all the traffic that matters for the next century, and the topology of that graph determines what's economically possible.

### <span style="color:#2d7a8a">Low Earth Orbit (~400–2000 km)</span>

LEO is where today's space economy lives. Roughly ten thousand active satellites as of mid-2026, dominated by Starlink, Chinese Guowang, OneWeb, Earth-observation constellations, and a long tail of science and government missions. LEO is congested, jurisdictionally contested, and structurally unsuitable for large-scale data centres because of debris density, atmospheric drag (which forces propellant expenditure for station-keeping and limits useful lifetime), and the ground-track problem: a LEO satellite spends most of its orbit out of contact with any given ground station, which forces either a globe-spanning ground network or laser intersatellite links of the sort Starlink and Kepler are deploying.

LEO's role in the cislunar economy is the staging layer. Earth-launched mass arrives in LEO, gets aggregated, refuelled at LEO depots, and dispatches outward. LEO is the harbour, not the destination. The current orbital-DC thesis treats LEO as the destination, which is the first architectural mistake.

### <span style="color:#2d7a8a">Geostationary Orbit (~36,000 km)</span>

GEO carries about five hundred operational satellites, mostly comms and weather, with a fleet value north of fifteen billion dollars and an aging average vintage. GEO satellites don't move relative to the ground, which makes them ideal for fixed-pointing services (broadcast comms, weather imaging) and useless for many newer applications that LEO handles better. The interesting GEO question for cislunar economics is the satellite-servicing market — life-extension, refuelling, repositioning, eventually full repair. Northrop Grumman's Mission Extension Vehicle docked with Intelsat-901 in 2020 and proved the technical case. What's missing is propellant cheap enough to make servicing routinely profitable, which is what the propellant economy of the 2030s is supposed to deliver.

GEO's role is the first paying commercial customer for cislunar logistics. Every economic analysis that closes runs through GEO servicing as the bridge between government-anchored Stage 1 and self-sustaining Stage 2. If GEO servicing fails to scale, the bootstrap stalls.

### <span style="color:#2d7a8a">Earth-Moon L1 (~326,000 km)</span>

L1 sits between Earth and the Moon, at the gravitationally balanced point where the Earth's and Moon's pulls cancel along the line connecting them. Strictly, stable infrastructure parks in a halo orbit around L1 rather than at the point itself, but the operational logic is the same: a piece of hardware at L1 holds station for roughly ten metres per second of delta-v per year, two orders of magnitude cheaper than LEO station-keeping.

The delta-v geometry around L1 is what makes it the most important node in the entire architecture. From L1 to the lunar surface costs about 2.5 km/s. From L1 to GEO, about 1.7 km/s. From L1 to LEO, about 3.8 km/s — higher than the others because you're descending into Earth's gravity well from above. From L1 outbound to L2, deep space, or trans-Mars injection, the delta-v costs are also low. L1 is, in delta-v terms, simultaneously close to everywhere that matters and cheap to maintain. No other point in cislunar shares this property.

L1 has continuous line of sight to Earth and to the lunar near side. It receives essentially uninterrupted solar power. It sits outside the LEO debris environment and outside the radiation belts. For a propellant depot, a satellite-servicing hub, an aggregation node where Earth-launched cargo meets lunar-launched cargo, an assembly yard for structures too large to launch monolithically — L1 is the answer to all of these. The University of Colorado published this architecture in 1989. The National Space Society's Roadmap Milestone 14 published it again in 2021. Neither received the funding that would have moved an L1 depot from concept to construction.

The Lunar Gateway, currently under construction by NASA and partners as part of the Artemis program, is in a Near-Rectilinear Halo Orbit around the Moon, not at L1. NRHO has its own advantages — easier access from Earth using Orion, good lunar polar coverage — but it's not the same node, and a Gateway-class facility at NRHO does not substitute for an L1 depot. Both will eventually exist; only one is currently funded.

### <span style="color:#2d7a8a">Earth-Moon L2 (~449,000 km)</span>

L2 sits beyond the Moon as seen from Earth. China's Queqiao-1 (2018) and Queqiao-2 (2024) operate near L2 in halo orbits, providing communications relay for Chinese far-side lunar missions including Chang'e-4 and Chang'e-6. The planned Lunar Gateway will operate in a near-L2-equivalent halo orbit. L2 has unique advantages for radio astronomy (the Moon shields it from Earth's electromagnetic noise, making it the best radio-quiet location in cislunar) and for deep-space mission staging (lower delta-v to outer solar system trajectories than from L1 or LEO).

L2's economic role is narrower than L1's. It's a science and strategic-comms node more than a commercial logistics node. But the shared infrastructure with L1 — comms relays, autonomous logistics, depot operations — means the L1 buildout effectively subsidises L2 operations. Once L1 exists, L2 follows for marginal cost.

### <span style="color:#2d7a8a">Lunar surface</span>

The lunar surface has its own gravity well, but a shallow one. Reaching lunar orbit from the surface costs about 1.6 km/s of delta-v, less than half what's needed to reach LEO from Earth's surface. The Moon's economic role is the population, manufacturing, and ISRU anchor for the entire cislunar system.

The interesting fact about lunar surface delta-v geometry is that the Moon is *not* a cheap place to launch missions back to Earth orbit. Lunar surface to LEO costs roughly 6 km/s (you have to fight Earth's gravity well from the wrong direction); lunar surface to GEO is about 2.5 km/s. So the Moon is a good base for serving cislunar and outbound traffic, and a poor base for serving Earth-orbit traffic. This asymmetry is why the right mental model for lunar industry is *supplying itself and points outward*, not *supplying Earth or Earth's orbits*.

Permanent shadow regions at the lunar south pole contain water ice. The most reliable estimates put the recoverable inventory in the hundreds of millions of tonnes, plausibly more, though extraction at industrial rates remains undemonstrated. Polar peaks of near-eternal sunlight provide continuous solar power for surface operations. The combination — accessible water plus continuous power plus the gravity-well asymmetry favouring outbound supply — makes the lunar south pole the unique location for cislunar industrial bootstrap. Every serious roadmap converges on this. So does every serious national program currently funded.

### <span style="color:#2d7a8a">What the geography implies</span>

Three things follow from the topology, and they structure everything in Sections 4 through 7.

First, *the cislunar economy is not lunar*. It's a five-node network in which the lunar surface is one node among several. Roadmaps that focus only on lunar surface infrastructure miss the connecting structure that makes lunar industry economically meaningful. Roadmaps that focus only on Earth-orbit infrastructure miss the resource base that makes the connecting structure affordable. Both failures are common in the published literature. The integration in this document is the correction.

Second, *L1 is the keystone*. Without an L1 depot, the cislunar economy is a collection of point-to-point missions, each carrying its own propellant from Earth, each amortising its launch cost over a single trajectory. With an L1 depot, missions become routes, propellant becomes a commodity, and the network effect compounds. The single highest-leverage piece of public infrastructure available in the 2026–2035 window is an L1 depot that doesn't currently exist on any funded program of any space agency. This is the central anomaly the roadmap analysis exposes.

Third, *the geography is fixed but the timing is not*. The five-node topology, the delta-v costs, the location of lunar polar ice — none of this is going to change. What changes is when each node comes online, who funds it, and which side of the emerging Artemis-Accords-vs-Sino-Russian governance split captures the standards and the precedents. The geography is destiny; the politics is contingent. The window for shaping the contingent part is roughly the next decade.

The remainder of this document works through the layered buildout the geography implies, the gating questions that determine timing, the structural problems the current commercial discourse is missing, and the leverage points for actors who want the architecture built on the faster timeline rather than the slower one.

---

*[End of chunk 1. Next: Section 4, Layer 0 — Foundations 2026–2032, including the Starship cost-curve dependency, the L1-depot anomaly developed in detail, and the autonomous-ISRU gating milestone.]*
