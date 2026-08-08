# <span style="color:#2E86AB">CC Brief — flyer machine-sizing tools</span>

**Date:** 2026-08-08 (rev 2, same day — code location confirmed)
**Target:** flyer MCP server (fly-mcp-foxxelabs.fly.dev)
**Code:** `todd427/mnemos` → `mcp-servers/fly-mcp/mcp_server.py` (flyer has no standalone repo; it ships inside the mnemos monorepo)
**Status:** Ready
**Origin:** July 2026 Fly bill review (receipt #2546-8527, $156.97). One always-on performance-2x machine in lhr is $96.15/mo — 61% of the bill — and flyer cannot say which app owns it. `app_status` returns id/state/region/image but not guest sizing, so the spend analysis dead-ended at "run `fly scale show` by hand across 19 apps."

## <span style="color:#A23B72">Problem</span>

flyer exposes nine tools; none reports machine *size*. Any cost question ("what's eating the bill?", "which apps are performance-class?", "how much RAM is provisioned org-wide?") currently requires terminal access. The bill's biggest line items are pure sizing facts, and the fleet is exactly the kind of thing Claude should sweep in one pass.

**The data is already in hand.** `app_status` (mcp_server.py) calls `_machines_get(f"/apps/{app}/machines")` and receives the full machine objects — including `config.guest` — then projects only id/state/region/image. This brief is a projection change plus one aggregation loop, not new API plumbing.

## <span style="color:#A23B72">Proposed tools</span>

### 1. `flyer:machines_list`

```
flyer:machines_list
  app: string   # Fly app name, e.g. "mnemos"
```

Same `_machines_get(f"/apps/{app}/machines")` call `app_status` already makes; richer projection. For each machine return:

- `id`, `state`, `region`, `created_at`, `updated_at`
- from `config.guest`: `cpu_kind` (shared/performance), `cpus`, `memory_mb`
- `config.auto_destroy` and, from `config.services`, whether `auto_stop_machines` / `min_machines_running` are set (the scale-to-zero signals)
- attached volume ids + sizes if present in the response

**Implementer note:** `config.guest.{cpu_kind,cpus,memory_mb}` is stable, but the services/autostop nesting has shifted between Machines API versions — dump one live machine object first and project from what's actually there.

### 2. `flyer:fleet_sizes`

```
flyer:fleet_sizes
  include_suspended: bool = false
```

Org-wide sweep: app names from the existing `apps_list` GraphQL query → `_machines_get` per app, aggregated into one JSON result:

```
app            machines  cpu_kind      cpus  mem_mb  region  autostop  est_$/mo
mnemos         1         performance   2     8192    lhr     no        96.15
taithi         1         shared        1     512     lhr     no        3.10
...
TOTAL                                                                  ~157
```

`est_$/mo` computed from Fly's published per-second rates for an always-on machine of that size (autostop machines flagged, not estimated — actual runtime unknowable from config). Rates live in a small dated dict in mcp_server.py next to the other config constants, so a pricing change is a one-line edit.

Return JSON (rows + totals), not preformatted text — let the caller render.

### Safety rails

- **Read-only.** Both tools GET only. No scale mutations in this brief — `flyer:machine_scale` is deliberately out of scope until the deploy brief's allowlist machinery exists (a mis-scale on mnemos or taisce is the same worst case as a bad deploy).
- **Token:** `FLY_API_TOKEN` already authorises this exact endpoint for `app_status`. No new scope.
- **Rate limiting:** `fleet_sizes` fans out ~29 GETs through the existing `_machines_get` (15s timeout each); serialize or cap concurrency at 4 and aggregate server-side.
- **Timeout:** cap the sweep at 60s; return partial rows + a `missing: [...]` list rather than failing whole.

## <span style="color:#A23B72">Implementation notes</span>

- Everything needed exists in mcp_server.py: `_machines_get`, `_graphql`, the org query from `apps_list`, `FLY_API_TOKEN`. No flyctl involvement (unlike the secrets tools).
- Version bump `VERSION = "1.2.0"` → `"1.3.0"`; add the two tools to the module docstring's tool list.
- Tests follow the existing pattern in `tests/test_tools.py`.
- Estimated effort: about an hour, most of it the rates dict and a live `fleet_sizes` check.
- Companion cleanup while in there: add the `config.guest` fields to `app_status`'s line output (same response object, three more fields) — do it, but keep `machines_list` for the volume/autostop detail.

## <span style="color:#A23B72">Acceptance test</span>

From a Claude chat session: call `flyer:fleet_sizes()`, identify the app owning the performance-2x lhr machine in one call, and confirm the estimated total is within ~10% of the July receipt's $156.97 machine-cost lines. Zero terminal touches.

## <span style="color:#A23B72">Why now</span>

The August spend decision (move the performance-2x workload to Daisy via Féith, scale-to-zero the MCP fleet) is blocked on knowing which app is which. This tool makes every future bill review a one-call diagnosis instead of a receipt archaeology session.
