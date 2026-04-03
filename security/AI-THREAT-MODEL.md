# FoxxeLabs — AI Attack Threat Model
**Version:** 0.2
**Date:** 2026-04-03
**Author:** Todd McCaffrey / FoxxeLabs Limited
**Status:** Draft — updated with Mnemos context (Stór/Stripe, multi-tenant, slopsquatting, static sites)

---

## 1. Scope

This threat model covers AI-specific attack surfaces across the FoxxeLabs production and near-production stack. It does not replace a general security audit; it focuses specifically on risks introduced by or against AI/LLM components.

**In scope:**
Anseo · Stór · Mnemos · George · Glór · Scéal · Eric · Duel · Agora · Sionnach · Sentinel · Taisce · Colainn · foxxelabs.ie · ucahub.ie

**Out of scope (this version):**
Network-layer DDoS, standard web application vulnerabilities (SQLi, XSS, CSRF), physical security.

**Note:** Sentinel (IP threat intelligence, `sentinel-foxxelabs.fly.dev`) is already deployed and covers network-layer T7 threats (bot traffic, IP reputation). It does not cover AI-content-layer threats.

---

## 2. Threat Taxonomy

| ID | Class | Vector | Target |
|----|-------|--------|--------|
| T1 | Prompt Injection | User input → LLM | Anseo/Stór, Eric, Duel |
| T2 | RAG Poisoning | Adversarial ingest | Mnemos |
| T3 | Data Extraction | Repeated queries | George, Glór |
| T4 | Adversarial Input | Crafted audio/text | Scéal, Glór |
| T5 | Indirect Injection | External content fetched by agent | Eric, Litir |
| T6 | Persona Manipulation | Crafted conversation | Agora, Sionnach |
| T7 | AI-Assisted Attack | LLM-accelerated fuzzing/social engineering | Anseo/Stór users |
| T8 | Secrets Exfiltration | Injection via MCP chain | Taisce, Rialú |
| T9 | Webhook Forgery | Unsigned/poorly validated Stripe events | Stór |
| T10 | Supply Chain (Slopsquatting) | LLM hallucinates package name → malicious install | Any CI/dev machine |

---

## 3. Surface-by-Surface Analysis

---

### 3.1 Anseo / Stór (Django · PostgreSQL · Railway)

**Risk Level: HIGH** — Stór runs on top of Anseo; any AI-layer compromise also affects live payment and ebook delivery flows (Stripe + BookFunnel). Stór is also being generalised into a multi-tenant retail platform (Yellow Brick Road pilot), meaning untrusted third-party catalogue content at scale.

| Threat | Attack Path | Current Mitigation | Gap |
|--------|-------------|--------------------|-----|
| T1 Prompt Injection | User post/comment → LLM moderation (planned) | None yet | No input sanitisation or system prompt hardening planned |
| T1 Prompt Injection | Seller/tenant product descriptions → LLM | None | Seller-supplied content is a classic indirect injection vector; multi-tenant makes this worse |
| T7 AI-Assisted Attack | LLM-generated spam accounts, fake reviews, coordinated inauthentic behaviour | Sentinel (IP layer only) | No bot-score or AI-content detection on registration or content submission |
| T9 Webhook Forgery | Attacker crafts fake Stripe webhook → triggers BookFunnel download URL generation without payment | Stripe signature validation (if implemented correctly) | Must confirm `stripe.Webhook.construct_event()` is used — if bypassed, free book downloads at scale |
| T8 Secrets Exfiltration | `BOOKFUNNEL_API_KEY` stored in Stór DB admin — reachable if LLM injection reaches admin context | None | API key in DB is a lateral escalation path |

**Immediate actions:**
- **Verify** `stripe.Webhook.construct_event()` is in place and signature validation is not skipped in test/staging branches that share prod secrets
- Treat LLM moderation input as untrusted; strip/escape before templating into system prompt
- Validate all seller/tenant-submitted content before any LLM processing — length caps, character class filtering, instruction-pattern blocking
- Move `BOOKFUNNEL_API_KEY` out of DB and into Railway env secrets; never let it appear in LLM context
- Add registration rate limiting and disposable-email detection before Stór goes live
- Log all LLM moderation decisions with input hash for audit trail

---

### 3.2 Mnemos (RAG · Vector Store · Fly.io)

**Risk Level: MEDIUM** — Internal use, no public ingest path today. Risk escalates as ingest sources multiply (Colainn, Litir, email).

| Threat | Attack Path | Current Mitigation | Gap |
|--------|-------------|--------------------|-----|
| T2 RAG Poisoning | Crafted email ingested via Litir → steers future retrieval | None | No content validation at ingest boundary |
| T2 RAG Poisoning | Adversarial Claude/ChatGPT conversation archived and ingested | None | History ingest is undiscriminating |
| T3 Data Extraction | Repeated queries reconstruct private documents from embedding neighbourhood | None | No query rate limiting or anomaly detection |

**Immediate actions:**
- Tag every document at ingest with `provenance` and `trust_level` (e.g. `internal`, `external`, `public`)
- Apply Mothú-style sentiment/anomaly scoring at ingest — flag documents with instruction-like language (`ignore previous`, `as an AI`, `your new instructions`) for review queue
- Rate-limit the `/query` endpoint; alert on high-frequency identical-vector queries (extraction probing pattern)

---

### 3.3 George (Vision-Language Memory · Railway)

**Risk Level: MEDIUM** — Holds biometric data (Withings BPM Core, Body Smart, Garmin wearable data). Cloudflare Zero Trust gated but no model-level guardrails.

| Threat | Attack Path | Current Mitigation | Gap |
|--------|-------------|--------------------|-----|
| T3 Data Extraction | Repeated vision queries reconstruct stored health images | Cloudflare ZT | No output rate limiting; no query diversity monitoring |
| T4 Adversarial Input | Crafted image causes VLM to produce unintended output or misclassify biometric event | None | No input validation on image uploads |

**Immediate actions:**
- Add per-session query budget (e.g. max 50 queries/hour behind ZT)
- Validate image content type and dimensions before VLM submission; reject anything outside expected ranges
- Log all queries and responses; add periodic manual review

---

### 3.4 Glór (Voice Cloning · XTTS v2 · Tiered: Daisy → Iris → Cloud)

**Risk Level: HIGH** — Voice cloning of a living person (your voice profile) is directly misusable for fraud, deepfake audio, social engineering.

| Threat | Attack Path | Current Mitigation | Gap |
|--------|-------------|--------------------|-----|
| T3 Data Extraction | Repeated TTS calls harvest voice model outputs → reconstruct speaker model | None | No output fingerprinting; no synthesis rate limiting |
| T4 Adversarial Input | Crafted text input exploits XTTS to produce artefacts or crash inference | None | No input sanitisation before XTTS |
| T3 Model Inversion | Fine-tuned voice profile on Daisy/Iris extractable if compute is accessible | None | Model weights are not encrypted at rest |

**Immediate actions:**
- Rate-limit synthesis API; add per-caller synthesis budget
- Watermark or fingerprint all synthesised audio output (passive deterrent)
- Restrict voice clone endpoint to authenticated internal callers only — never expose raw cloning API publicly
- Encrypt XTTS voice profile weights at rest on Daisy/Iris

---

### 3.5 Eric (Marketing MCP Agent · Fly.io)

**Risk Level: MEDIUM-HIGH** — MCP agent with tool-use capabilities. Indirect injection is the primary concern.

| Threat | Attack Path | Current Mitigation | Gap |
|--------|-------------|--------------------|-----|
| T5 Indirect Injection | Eric fetches external content (web, email, RSS) → adversarial payload hijacks tool calls | None | No sandboxing of fetched content before LLM sees it |
| T8 Secrets Exfiltration | Injected instruction in fetched content → Eric calls Taisce/Rialú with exfil payload | None | MCP chain has no per-tool permission gate |

**Immediate actions:**
- Treat all externally fetched content as untrusted; HTML-strip and truncate before inclusion in Eric's context window
- Add a tool-call allowlist per session type — Eric should not be able to call Taisce `reveal_*` tools in an open-ended research session
- Log all tool calls Eric makes; alert on anomalous call sequences

---

### 3.6 Scéal (Audiobook Pipeline · StyleTTS2 · Daisy)

**Risk Level: LOW** (internal, not public-facing)

| Threat | Attack Path | Current Mitigation | Gap |
|--------|-------------|--------------------|-----|
| T4 Adversarial Input | Crafted SSML or text causes StyleTTS2 crash or unexpected output | None | Low priority while internal |

**Action:** Validate SSML/text input structure at pipeline entry; cap input length.

---

### 3.7 foxxelabs.ie (Astro v4.5 · Cloudflare Pages · Static)

**Risk Level: NEGLIGIBLE** — Pure static site. No server-side compute, no database, no LLM components. Cloudflare provides DDoS and bot protection at the edge.

No AI attack surface exists at runtime. The only exposure is the **build pipeline**: if an LLM suggests a malicious or typosquatted npm package during development and it gets installed, the build artefact is compromised (T10). This is a dev-time risk, not a runtime risk.

**Action:** Pin all npm dependencies to exact versions in `package-lock.json`; audit any LLM-suggested package names before installing.

---

### 3.8 ucahub.ie (Static · Cloudflare Pages)

**Risk Level: NEGLIGIBLE** — Static site mirroring dissertation status. No compute, no AI components, no database. Same build-time T10 risk as foxxelabs.ie if a build pipeline exists.

No action required beyond standard Cloudflare security settings (already in place).

---

### 3.9 Supply Chain — Slopsquatting (T10)

**Risk Level: MEDIUM** — All FoxxeLabs dev machines (Rose, Daisy, Lava, Iris) use LLM-assisted coding. When an LLM hallucinates a package name that doesn't exist, adversaries who register that name first can deliver malicious code into your environment. Affects npm (foxxelabs-astro, Anseo frontend), pip (Mnemos, Colainn, Sentinel, Scéal, Glór).

| Threat | Attack Path | Current Mitigation | Gap |
|--------|-------------|--------------------|-----|
| T10 Slopsquatting | LLM suggests `foxxelabs-utils` → attacker registered it → `pip install` compromises Daisy | None | No pre-install verification step |
| T10 Slopsquatting | CI pipeline installs from requirements.txt containing hallucinated package | None | No lockfile integrity checking |

**Immediate actions:**
- Verify every LLM-suggested package name exists on PyPI/npm **before** installing
- Use `pip install --dry-run` + manual review for any new package not previously used
- Pin all production dependencies to exact versions with hash verification (`pip install --require-hashes`)
- For npm: `npm audit` on every install; use `package-lock.json` with integrity hashes

---

### 3.10 Taisce (Secrets Vault) / Rialú (MCP · Project/Secrets Server)

**Risk Level: HIGH** — These hold actual credentials. The MCP chain is the attack surface.

| Threat | Attack Path | Current Mitigation | Gap |
|--------|-------------|--------------------|-----|
| T8 Secrets Exfiltration | Injection in any MCP-consuming context (Eric, Duel, Claude sessions) → `reveal_*` called | None | No context-aware tool permission scoping |
| T8 Secrets Exfiltration | Malicious PRD/doc ingested to Mnemos → retrieved in a session → used to craft injection → Taisce called | None | Multi-hop injection path, currently undetected |

**Immediate actions:**
- Implement a `reveal` operation confirmation step that requires explicit human confirmation (not AI-autoapprovable)
- Scope `reveal_*` tools out of any session that has access to external content or untrusted Mnemos results
- Audit log every `reveal_*` call with caller identity and timestamp

---

## 4. Risk Register (Priority Order)

| Priority | ID | Surface | Class | Effort | Impact |
|----------|----|---------|-------|--------|--------|
| 🔴 1 | T8 | Taisce + Rialú | Secrets Exfiltration | Low | Critical |
| 🔴 2 | T9 | Stór | Stripe Webhook Forgery | Low | Critical |
| 🔴 3 | T3 | Glór | Voice Extraction | Low | High |
| 🔴 4 | T1 | Anseo/Stór | Prompt Injection | Medium | High |
| 🟠 5 | T5 | Eric | Indirect Injection | Medium | High |
| 🟠 6 | T2 | Mnemos | RAG Poisoning | Medium | Medium |
| 🟠 7 | T10 | All dev machines | Slopsquatting | Low | Medium |
| 🟠 8 | T3 | George | Data Extraction | Low | Medium |
| 🟡 9 | T7 | Anseo/Stór | AI-Assisted Attack | High | Medium |
| 🟡 10 | T6 | Agora/Sionnach | Persona Manipulation | Low | Low |
| 🟢 11 | T4 | Scéal | Adversarial Input | Low | Low |
| ✅ — | — | foxxelabs.ie / ucahub.ie | Static, no AI surface | — | Negligible |

---

## 5. Architectural Recommendations

### 5.1 Short-term (pre-Stór launch)

1. **Stripe webhook signature validation** — verify `stripe.Webhook.construct_event()` is in place in all environments including staging; one-line audit, Critical impact.
2. **Prompt injection harness** — shared Django middleware stripping instruction-pattern text from any user input before it enters an LLM context.
3. **Taisce `reveal_*` human gate** — TOTP or explicit UI confirmation before any `reveal` call executes.
4. **Glór rate limiting** — synthesis budget enforced at API gateway level, not application level.
5. **BookFunnel API key** — move from DB to Railway env secret; confirm it never appears in LLM context.

### 5.2 Medium-term (post-viva)

6. **Mnemos provenance tagging + anomaly filter at ingest** — Mothú pipeline already scores sentiment; extend to flag instruction-pattern language.
7. **MCP session permission scoping** — define session profiles (`research`, `write`, `ops`) with explicit tool allowlists. Eric in `research` mode cannot call Taisce.
8. **Eric indirect injection sandbox** — all externally fetched content passes through a stripping layer before entering Eric's context.

### 5.3 Long-term (when Anseo has meaningful volume)

9. **AI content detection on Anseo registration + post submission** — bot-score new accounts; flag AI-generated content in posts/reviews.
10. **Synthesised audio watermarking** — embed imperceptible fingerprint in all Glór output for provenance tracing.
11. **Formal red-team exercise** — dedicate a sprint post-viva to adversarial testing of the full MCP chain.

---

## 6. Where This Document Lives and How It Gets Updated

**Location:** `foxxelabs-config/security/AI-THREAT-MODEL.md`

This is a portfolio-wide document. Individual repos may add a `docs/SECURITY.md` linking back here for project-specific notes.

### Maintenance Triggers

| Trigger | Action |
|---------|--------|
| New AI/LLM component added to any project | Add a surface-by-surface entry; update risk register |
| New external data source added to Mnemos ingest | Review T2 section |
| New MCP tool added to Eric, Taisce, or Rialú | Review T5 and T8 sections |
| Stór goes live with Stripe | Confirm T9 is resolved; mark as mitigated |
| New tenant added to Stór (e.g. Yellow Brick Road) | Re-assess T1 indirect injection scope |
| Post-viva: Fionn (BI agent) built | Add new surface entry |
| Post-viva: Anseo reaches meaningful user volume | Elevate T7 to 🔴 |
| Any security incident or near-miss | Immediate update + incident note appended |

### Review Cadence

- **Before each major launch** (Stór, any new public-facing service): full review
- **Quarterly** once Anseo has live users
- **Ad hoc** on any new AI component or MCP tool addition

---

## 7. What This Document Is Not

- Not a GDPR/DPA compliance review (separate concern, separate doc)
- Not a general pen test scope
- Not a replacement for external security audit before Stór handles live payments

---

*Version: 0.2 | Date: 2026-04-03 | Owner: Todd McCaffrey | foxxelabs-config/security/AI-THREAT-MODEL.md*
