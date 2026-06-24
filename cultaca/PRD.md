# <span style="color:#7c3aed">Cúltaca — PRD v0.1</span>

*Irish: backup, reserve, backstop (KOOL-tah-kuh)*

## <span style="color:#2563eb">Problem</span>

The entire FoxxeLabs build practice runs through a single frontier provider via Claude Code. June 2026 demonstrated the failure mode: ~10 Anthropic outages in three weeks, 529 capacity-rejection errors during peak hours, and Claude Code mislabelling provider-side 529s as "check network" — laundering a capacity ceiling into a user-fault message. Anthropic has acknowledged demand outpacing infrastructure; the signed compute deals land in coming quarters, not today. A practice that stops when one provider rations is not a practice with a floor under it.

This is the sovereignty axis made operational: keep working when any single provider degrades, by not depending on any single provider's ceiling.

## <span style="color:#2563eb">What it is</span>

Cúltaca is a provider-agnostic coding harness configuration — OpenCode wired to three independent failure domains, so a degradation in one is a one-keystroke switch, not a work stoppage. It is the off-the-shelf resilience layer. Its in-house sibling is **Gléas** (the Macalla-serving agent harness); Cúltaca is the immediate, deployable floor while Gléas's coding faculty matures.

## <span style="color:#2563eb">Architecture — three tiers</span>

- **Local tier — Iris vLLM.** Qwen3-Coder-30B-class served on Iris (5090, 32GB) over Féith, OpenAI-compatible at :8000 with `--enable-auto-tool-choice --tool-call-parser hermes`. Covers spec-bounded work and every 529 window. Never returns a capacity error. Buys breadth and availability, not a frontier replacement.
- **Primary frontier — Anthropic.** API key only (Pro/Max subscription auth is prohibited through third-party harnesses). Default model for hard agentic problems.
- **Uncorrelated failover — OpenAI.** Different infrastructure, so not down when Anthropic is. Frontier-class fallback for hard problems during an Anthropic degradation.

## <span style="color:#2563eb">Failover model</span>

OpenCode does **manual** model switching out of the box (`/models`, or `-m provider/model`). Automatic rerouting needs a layer in front, two honest paths:

- **Path A — gateway** (Vercel/Cloudflare AI Gateway, provider `order` routing). Easy, but routes traffic through a third party. Acceptable for the frontier tiers; never put the local tier behind it.
- **Path B — local proxy** (Olla-style, health-checked least-connections over own endpoints). Sovereign, heavier. The only path that keeps the local tier entirely on own infrastructure — the version that matches the thesis.

## <span style="color:#2563eb">Discipline</span>

Same gate as the Gléas coding faculty: tests-first acceptance, trust eval numbers over narrative. The undersized-model failure mode is not visible errors — it is *plausible* mistakes that read as progress. The local tier ships only what passes pre-written tests.

## <span style="color:#2563eb">Status</span>

- v0.1: three-backend `opencode.json` and operational runbook committed (this directory).
- Config and setup: `cultaca/opencode.json`, `cultaca/SETUP.md`.

## <span style="color:#2563eb">Open items</span>

- Confirm live model IDs and the Qwen3-Coder variant that fits VRAM headroom alongside resident models on the 5090.
- Confirm `--tool-call-parser` value for the specific Qwen build.
- Decide failover path (A vs B). Path B is the sovereign choice; scope an Olla deployment on the fleet if pursued.
- Iris mesh address vs localhost in `baseURL`, depending on where OpenCode runs (Daisy/Rose over Féith vs on Iris).

---

*Todd McCaffrey · 2026-06-24*
