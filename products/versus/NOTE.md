# Versus

**See how the AIs actually differ.** A free, browse-first showcase that puts the
same prompt to several AIs side by side so a person can *feel* the difference —
tone, usefulness, where they hedge, where they're confidently wrong — and decide
which to use. "Try before you buy." Sibling to Duel; a FoxxeLabs experiment.

- **Repo:** https://github.com/todd427/versus (private until real captures land)
- **Planned host:** Cloudflare Pages → versus.foxxelabs.ie (static; auto-deploy from repo)
- **Lineup:** big 3 by default (ChatGPT, Claude, Gemini); show-more for Perplexity, Copilot, Grok, DeepSeek, Meta AI.

## How it works (and why)

Static site, **no backend, no API calls.** The big consumer apps (ChatGPT,
Claude) have no free API, so the honest, ToS-clean way to compare their *free
tiers* is to capture real answers by hand and present them as dated, comparative
snapshots. All content lives in `data.js` (paste captures keyed by model id).
Flagship prompt: *"Pickup lines that work in the real world"* — splits the models
on personality, safety calibration, and real usefulness in one shot.

## Capitalisation

Neutrality is the moat — **no paid placement.** Value capture is indirect:

1. **Top-of-funnel for the Directing AI / Reading the Fuzz (aithint) education** —
   it demonstrates the exact thesis the courses teach (models diverge; you must judge).
2. **Audience capture** (email / "monthly head-to-head") → funnel to FoxxeLabs.
3. **"Which AI for you?" recommender** — the CTA slot already stubbed in the page.
4. **Aggregate preference data** → publishable insight (ties to the MSc dissertation
   on AI tool usage/trust) → authority/consulting.

Note: the big AI labs don't run consumer affiliate programmes, so direct "Get
Plus/Pro" referral mostly earns nothing — funnel + audience is the play.

## Relationship to other projects

- **Duel** — sibling; shares the engine/look. Duel = deep two-Claude power tool; Versus = broad N-AI consumer showcase.
- **aithint** — distinct. aithint is the *course* ("Reading the Fuzz" pilot in the Directing AI programme); Versus is a consumer literacy/decision tool. Versus can feed aithint, but is not part of it.
