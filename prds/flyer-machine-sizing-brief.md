# <span style="color:#2E86AB">CC Brief — flyer machine-sizing tools</span>

**Date:** 2026-08-08
**Target:** flyer MCP server (fly-mcp-foxxelabs.fly.dev)
**Status:** Ready
**Origin:** July 2026 Fly bill review (receipt #2546-8527, $156.97). One always-on performance-2x machine in lhr is $96.15/mo — 61% of the bill — and flyer cannot say which app owns it. `app_status` returns id/state/region/image but not guest sizing, so the spend analysis dead-ended at "run `fly scale show` by hand across 19 apps."

## <span style="color:#A23B72">Problem</span>

flyer exposes nine tools; none reports machine *size*. Any cost question ("what's eating the bill?", "which apps are performance-class?", "how much RAM is provisioned org-wide?") currently requires terminal access. The bill's biggest line items are pure sizing facts, and the fleet is exactly the kind of thing Claude should sweep in one pass.

## <span style="color:#A23B72">Proposed tools</span>

### 1. `flyer:machines_list`

```
flyer:machines_list
  app: string   # Fly app name, e.g. "mnemos"
```

Wraps `GET /v1/apps/{app_name}/machines` on the Machines API (api.machines.dev). For each machine return:

- `id`, `state`, `region`, `created_at`, `updated_at`
- from `config.guest`: `cpu_kind` (shared/performance), `cpus`, `memory_mb`
- `config.auto_destroy` and, from `config.services`, whether `auto_stop_machines` / `min_machines_running` are set (the scale-to-zero signals)
- attached volume ids + sizes if present in the response

**Implementer note:** field paths above are from the documented Machines API shape; confirm against current api.machines.dev docs at build time rather than trusting this brief — the guest block is stable but the services/autostop nesting has shifted between API versions before.

### 2. `flyer:fleet_sizes`

```
flyer:fleet_sizes
  include_suspended: bool = false
```

Org-wide sweep: `apps_list` → `machines_list` per app, aggregated into one table:

```
app            machines  cpu_kind      cpus  mem_mb  region  autostop  est_$/mo
mnemos         1         performance   2     8192    lhr     no        96.15
taithi         1         shared        1     512     lhr     no        3.10
...
TOTAL                                                                  ~157
```

`est_$/mo` computed from Fly's published per-second rates for an always-on machine of that size (autostop machines flagged, not estimated — actual runtime unknowable from config). Rates live in a small table in flyer's config, dated, so a pricing change is a one-line edit, not a code change.

Return JSON (rows + totals), not preformatted text — let the caller render.

### Safety rails

- **Read-only.** Both tools GET only. No scale mutations in this brief — `flyer:machine_scale` is deliberately out of scope until the deploy brief's allowlist machinery exists (a mis-scale on mnemos or taisce is the same worst case as a bad deploy).
- **Token:** the existing flyer token already reads machine state for `app_status`; the Machines API list endpoint needs no additional scope. Verify, don't assume.
- **Rate limiting:** `fleet_sizes` fans out ~29 API calls; serialize with a small delay or cap concurrency at 4. The MCP call budget is one response, so aggregate server-side.
- **Timeout:** cap the sweep at 60s; return partial rows + a `missing: [...]` list rather than failing whole.

## <span style="color:#A23B72">Implementation notes</span>

- The Machines API is a plain REST surface on `api.machines.dev` using the same bearer token flyctl uses — no flyctl dependency needed for this brief, unlike the deploy brief.
- ~20 lines per tool plus the rates table. Estimated effort: 1–2 hours including the rates table and a `fleet_sizes` test against the live org.
- Companion cleanup while in there: `app_status` could simply gain the `config.guest` fields (same API call, richer projection) — do it, but keep `machines_list` anyway for the volume/autostop detail.

## <span style="color:#A23B72">Acceptance test</span>

From a Claude chat session: call `flyer:fleet_sizes()`, identify the app owning the performance-2x lhr machine in one call, and confirm the estimated total is within ~10% of the July receipt's $156.97 machine-cost lines. Zero terminal touches.

## <span style="color:#A23B72">Why now</span>

The August spend decision (move the performance-2x workload to Daisy via Féith, scale-to-zero the MCP fleet) is blocked on knowing which app is which. This tool makes every future bill review a one-call diagnosis instead of a receipt archaeology session.
