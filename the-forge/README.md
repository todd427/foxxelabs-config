# The Forge

A FoxxeLabs destination. A computer-builder site where the hook is **"What do you want it to *do*?"** — every archetype is both a build path and a doorway into a FoxxeLabs world.

Status: **experience prototype** (single-file React artifact). Not yet the shippable site.

## The shape (settled 2026-06-04)

Not a generalist PC configurator — that's a commodity and a maintenance treadmill, late to a knife fight against PCPartPicker / LTT / Gamers Nexus. Instead a *destination*:

- Hook: "What do you want it to do?" — five archetype doorways, not a budget box.
- Each archetype maps to a named machine class and ends on an on-ramp into a real world.
- The named machines (Iris, Rose, Daisy, Lava) are the cast, not "Gaming Build — €1,500".
- Flow is a hero's journey: pick → opinionated recipe (war-story copy) → parts assemble one by one → boot screen lights up → named, shareable spec card + doorway.

## Archetype → class → doorway

| Verb | Class | Doorway |
|------|-------|---------|
| Think | Iris-class (Core Ultra 9 285K, RTX 5080, 128GB, 1200W ATX 3.1) | Macalla |
| Make | Daisy-class writer's rig | Cló |
| Serve | Anseo-class home-lab | Anseo + Fly stack |
| Play | Rose-class daily driver (WSL2) | the whole cast |
| Explore | Lava-class portable (laptop) | the field |

## Design decisions & trade-offs

- **No live parts DB.** Hardcoded opinionated recipes. The universal config is PCPartPicker's moat; opinionated is the deliberate niche. All build data lives in the `BUILDS` object, separate from rendering — copy is editable without touching layout.
- **Animated annotated assembly, not WebGL 3D.** 80/20. If 3D is later judged the differentiator, it's a swap of the `Assemble` component only.
- **Part info is evergreen, not spec-sheet.** Each part has a witty `note` (closed row) and a substantive `info` (expanded) plus a `q` search term. Info teaches the *why* (e.g. "VRAM is the wall, not FLOPS") rather than live numbers that rot.
- **Cases included per desktop** (Fractal Meshify 2 / North / Node 304, Lian Li Lancool 216). Laptop has no case — chassis is the laptop. Think-build case note carries the real Meshify-2-Compact / 240-radiator clearance lesson.
- **PSUs on all desktops**; laptop uses a 100W USB-C PD charger.

## Monetization seam

`const pp = (q) => https://pcpartpicker.com/search/?q=...` — single helper at top of file. Swap its body for an Amazon.de affiliate search or a PCPartPicker affiliate wrapper and every part link across all builds becomes a revenue link. No other change.

## Stubs / not-yet-built (the real shippable-site work)

- Share button is an `alert` stub. Production needs spec-card image generation + OG-card route = the actual share loop.
- This is the experience prototype, not the site. Production: static-site shell (reuse the Sionnach Cloudflare Pages pattern) with these as components, plus per-machine build-log pages (Iris/Rose/Daisy/Lava) with real photos and real war stories — that content is the moat.

## Deployment recommendation (2026-06-04)

`forge.foxxelabs.ie` subdomain, standalone Cloudflare Pages deploy (Sionnach pattern). **Not** inside the anseo.irish Django/Postgres app (wrong coupling, wrong audience — only the Serve doorway touches Anseo). Discoverable from foxxelabs.ie via nav/CTA, but its own deployable so it can be shared as a standalone link and iterate independently. Brand wrapper ("a FoxxeLabs destination") may shift if/when the company name resolves; architecture is independent of that.
