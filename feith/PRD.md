# <span style="color:#1e40af">Féith — Private Mesh Network (ARCH v0.1)</span>

<span style="color:#7c2d12">**Status:**</span> Operational. Documentation retrospective. Iris integration and hardening phases forward-looking.
<span style="color:#7c2d12">**Created:**</span> 2026-04-22
<span style="color:#7c2d12">**Name:**</span> Féith (FAY, Irish: sinew, vein, strand, seam — a recurring figure of connection and flow)
<span style="color:#7c2d12">**Coordinator:**</span> `feith.foxxelabs.ie` (Headscale on Fly.io, `lhr`)
<span style="color:#7c2d12">**Exit node:**</span> Daisy (primary)

---

## <span style="color:#0f766e">One-line framing</span>

A private WireGuard mesh, coordinated by self-hosted Headscale, that provides any-to-any connectivity across Todd's personal devices and the subset of FoxxeLabs services that should never be reachable from the public internet. It is the trust boundary that separates the OAuth-exposed public tier (Mnemos, Taisce, Rialú, Eric, Git-mcp, Sentinel, Flyer) from the private tier (Faire, Macalla, Legion nodes, Comhoibrí, Breith, hardware nodes).

## <span style="color:#0f766e">Non-obvious architectural insight</span>

The Féith/OAuth split is not "paranoia" or "defence in depth" — it is a *capability* gate that enables a specific architectural pattern: some systems can be built with the assumption that every caller is Todd, and therefore without the auth, rate-limit, audit, abuse, and multi-tenant scaffolding that a public service requires. That's an enormous simplification, and it shows up directly in the Comhoibrí and Breith PRDs: 300 lines of substrate instead of 3,000.

Two tiers means two implementation complexity budgets. Féith is what lets the private-tier budget stay small.

## <span style="color:#0f766e">Two-tier access model</span>

| Tier | Trust assumption | Auth | Examples |
|---|---|---|---|
| **Public** | Any caller may be hostile | OAuth 2.1 + PKCE + DCR; Bearer; rate limits; audit log | Mnemos, Taisce, Rialú, Eric, Git-mcp, Sentinel, Flyer |
| **Private (Féith)** | Every caller is Todd (or a device Todd controls) | Mesh membership (WireGuard keypair) | Faire, Macalla, Comhoibrí, Breith, Legion node control plane, hardware nodes |

A service on the private tier is not merely "harder to reach"; it is architecturally different — simpler code, fewer primitives, no tenant abstraction, no public threat model. The cost is that it cannot be called from a browser, a phone without the mesh client, or a SaaS LLM (Claude.ai, ChatGPT web) that does not route through a mesh-connected host.

## <span style="color:#0f766e">Topology</span>

### <span style="color:#0f766e">Nodes (operational)</span>

| Node | Role | Notes |
|---|---|---|
| **Rose** | Primary workstation (Windows/WSL2, RTX 5070, 64GB) | Daily-use host |
| **Daisy** | Primary exit node, Ubuntu server (RTX 5060 OC, 128GB) | Development host; exit node for mobile and any node that needs a stable egress |
| **Lava** | Laptop (ASUS ProArt P16, Ryzen AI 9 HX 370, 64GB, WSL2, Windows) | Mobile workstation, joined March 2026 |
| **Mobile** | Phone | WireGuard client; private-tier services reachable when VPN is active |

### <span style="color:#0f766e">Nodes (planned)</span>

| Node | Role | Status |
|---|---|---|
| **Iris** | AI workstation (RTX 5080, 128GB DDR5) | Build in progress; PSU swap (be quiet! 1000W → ROG Strix 1200W) pending bench test. Joins Féith when online. Becomes primary Macalla training host and secondary Glór backend. |

### <span style="color:#0f766e">Coordinator</span>

Headscale runs on Fly.io (`lhr`) at `feith.foxxelabs.ie`. Single instance; not currently redundant (acceptable for a personal mesh — an outage makes new-node joins impossible but does not disrupt already-established tunnels). Node registration via pre-auth keys stored in Taisce.

### <span style="color:#0f766e">DERP relays</span>

Using Tailscale's public DERP fleet by default. Self-hosting a DERP relay is an open decision (see below); not required at current usage.

## <span style="color:#0f766e">Services on the private tier</span>

- **Faire** — Tauri v2 desktop app (Phase 4 on Daisy), FoxxeLabs project control centre. Mesh-only for the multi-project observability dashboard it exposes.
- **Macalla** — training pipeline (Iris when online); adapter hot-swap and inference endpoints are mesh-only. The model itself holds Todd's personal corpus and must not be reachable from the public internet.
- **Comhoibrí** — coworker substrate. MCP server and CLI are mesh-only.
- **Breith** — decision-outcome loop. MCP server is mesh-only; the decision corpus is sensitive personal data.
- **Legion** — distributed AI swarm; node control plane is mesh-only. Public surface (research page, demos) lives separately on the public tier.
- **Hardware nodes** — future embodied Legion nodes, Colainn sensors, Lorg local services; any hardware running at home that should only be reachable from Todd's devices.

## <span style="color:#0f766e">Services explicitly on the public tier</span>

All of these are OAuth-exposed because they need to be callable from SaaS LLM clients (Claude.ai, ChatGPT) as MCP servers. Moving any of them to the private tier would break that integration:

- **Mnemos** (`mnemos.foxxelabs.ie`) — OAuth 2.1 with PKCE and Dynamic Client Registration.
- **Taisce** (`taisce.irish`) — secrets vault; public tier but every secret is encrypted at rest and reveal calls are audited.
- **Rialú** (`rialu.ie`) — project registry and working state.
- **Eric** (`eric.foxxelabs.ie`) — marketing intelligence.
- **Git-mcp** (`git-mcp-foxxelabs.fly.dev`) — 18 git tools.
- **Sentinel** (`sentinel-foxxelabs.fly.dev`) — IP reputation.
- **Flyer** (`fly-mcp-foxxelabs.fly.dev`) — Fly.io management.

## <span style="color:#0f766e">Phased roadmap</span>

### <span style="color:#0f766e">Phase 0 — current state (operational)</span>

Four nodes live (Rose, Daisy, Lava, mobile). Headscale on Fly.io. Daisy as primary exit node. Working ACLs implicitly (any-to-any within the mesh).

### <span style="color:#0f766e">Phase 1 — Iris join (post-PSU, post-build)</span>

Iris joins Féith as its fifth node. Macalla training endpoint bound to Iris-Féith address only. Adapter artefacts stored on Iris; inference served over mesh to Rose and Daisy.

### <span style="color:#0f766e">Phase 2 — explicit ACL policy (post-viva, when Comhoibrí and Breith land)</span>

Replace implicit any-to-any with a declared policy in Headscale:

- Todd's personal devices (Rose, Daisy, Lava, Iris, mobile) → any service node.
- Coworker nodes (when individual coworkers run as their own hosts) → only the MCP servers they need (Builder → git-mcp host, Operator → Flyer/Sentinel/Taisce hosts, etc.).
- Hardware nodes → Colainn, Lorg, George only. No internet egress for Colainn sensors.
- Exit-node rights restricted to mobile → Daisy by default.

### <span style="color:#0f766e">Phase 3 — hardening</span>

- Self-hosted DERP relay on Fly.io (`lhr`) if public DERP latency becomes an issue.
- Key rotation policy for pre-auth keys (currently long-lived; should be 30-day max once automated provisioning exists).
- Headscale upgrade cadence documented (currently ad-hoc; should be scheduled monthly).
- Redundant coordinator or clear "coordinator-down" runbook (acceptable risk today, not at 2× nodes).

### <span style="color:#0f766e">Phase 4 — audit surface</span>

- Connection log shipped to Sentinel for anomaly detection on the private tier itself.
- Periodic mesh-health report into the Scheduler coworker's standup.

## <span style="color:#0f766e">Trust model in practice</span>

A private-tier service must, at minimum:

1. Bind its listener to the Féith interface only (never `0.0.0.0`).
2. Document its trust assumption in its README / PRD ("assumes caller is Todd").
3. Still encrypt secrets at rest — mesh membership is not a licence to store plaintext credentials.
4. Still log meaningfully — "Todd did it" is not sufficient attribution for future debugging.

A private-tier service may skip:

- OAuth / Bearer auth.
- Rate limiting.
- Tenant scoping.
- Public abuse surface (CSRF, clickjacking, etc.).

The mesh is a *capability* boundary, not an *identity* boundary — it does not prove which human is at the keyboard of a mesh node. High-value operations (secret reveal, adapter promotion, financial actions in Díol) should still require explicit confirmation even over the mesh.

## <span style="color:#0f766e">Trade-offs</span>

- **Single coordinator.** Headscale down → no new joins, but existing tunnels persist. Acceptable for a personal mesh; revisit if team members or hardware nodes multiply.
- **Tailscale DERP dependency.** Relying on public DERP is operationally simple but introduces a third-party dependency. No practical downside at current scale; easy to self-host later.
- **Browser-unfriendly.** Private-tier services cannot be reached from a browser on a non-mesh device. Mitigation: everything that needs browser access (Faire dashboard, Anseo, Stór) either runs on the public tier or requires the mesh client on the browsing device.
- **SaaS LLM invisibility.** Claude.ai, ChatGPT web clients cannot call mesh-only MCP servers. This is the whole point — but it means every new MCP server requires an explicit tier decision. The default should be *public unless there is a specific reason for mesh-only*, because most MCP value comes from SaaS-client reachability.
- **Mesh latency.** Low, but not zero — a mesh hop adds ~20-80 ms depending on geography and relay path. Matters for any interactive service; does not matter for batch or async.

## <span style="color:#0f766e">Open decisions</span>

- Self-host DERP on Fly.io `lhr`, or continue on public DERP? Leaning public DERP until latency becomes a measurable issue.
- Formal ACL policy in Headscale vs continuing with implicit any-to-any. Leaning formal once node count exceeds five (Iris makes five).
- Exit-node redundancy: Daisy only today. Iris could be a secondary exit node when online, especially for mobile when Daisy is offline for maintenance.
- Mobile mesh posture: always-on VPN vs on-demand. Currently on-demand; always-on removes the cognitive overhead of "is the VPN up right now" but burns battery.
- Sovereignty posture: does Féith coordinator move off Fly.io onto self-owned hardware at some point? The argument for Fly.io is operational simplicity; the argument against is that a third-party hoster could theoretically see metadata about mesh topology. Not urgent.

## <span style="color:#0f766e">What needs documenting next</span>

This PRD covers the conceptual architecture. The following operational details live outside this doc and should be captured in a Féith runbook (sibling to this PRD, probably `feith/RUNBOOK.md`):

- Exact Headscale configuration (tailnet range, magic DNS settings).
- Node onboarding procedure (pre-auth key flow, routing approval).
- Recovery procedure if Headscale is down.
- Periodic key rotation ritual.
- How to verify a service is correctly bound to the Féith interface before shipping.

## <span style="color:#0f766e">Provenance</span>

Retrospective architecture doc written 2026-04-22 during the AI-bubble / third-brain / coworker-stack session with Claude, triggered by repeated references to "private-tier, Féith mesh only" in the Breith and Comhoibrí PRDs without Féith itself being documented in `foxxelabs-config`. Full session transcript ingested to Mnemos (65 chunks).

The architecture described here is substantially pre-existing; this document retroactively captures it in the same registry as the post-viva forward-looking PRDs. Phase 0 reflects current state; Phases 1-4 are forward-looking.

---

*FoxxeLabs Limited · 2026-04-22*
