# Mnemos — Scope Split

Authoritative split of Mnemos across three tiers: what ships open, what is
closed and licensed, and what is research IP and never leaves the building.
This document governs what may be committed to a public repository.

## Tiers at a glance

| Tier | Name | Disposition | Where it lives |
|------|------|-------------|----------------|
| 1 | Open-core retrieval shell | Open source / freeware | `foxxelabs-config/mnemos/` (public) |
| 2 | Application layer | Closed, licensed (white-label B2B) | Private |
| 3 | Research / IP | Closed, never released | Private |

## Tier 1 — Open-core retrieval shell

The commodity layer. No proprietary advantage; releasing it costs little and
seeds the developer funnel.

| Component | In scope | Notes |
|-----------|----------|-------|
| Hybrid retrieval | ✅ | Qdrant dense + FTS5 lexical, fused at query time |
| Score fusion | ✅ | Reciprocal-rank default; weights configurable |
| MCP server | ✅ | FastMCP; `query_memory`, `ingest_document`, `get_doc_count`, `list_filters` |
| REST API shape | ✅ | `/query`, `/ingest`, `/stats`, `/filters` — schemas documented as a stable contract |
| Embedding adapter | ✅ | Interface + reference adapter; bring your own endpoint |
| Chunking | ✅ | Sentence-aware splitter, configurable window/overlap |
| Tenancy | ❌ | Single-tenant only — see Tier 2 |
| Enrichment | ❌ | Plain text only — see Tier 3 |

## Tier 2 — Application layer (closed, licensed)

This is what application builders actually pay for. Closed; licensed as the
white-label B2B SKU.

| Component | Disposition | Notes |
|-----------|-------------|-------|
| Per-tenant isolation | Closed | Namespacing, collection partitioning, per-tenant filter enforcement and access boundaries |
| Ingest / dedup pipeline | Closed | Provenance tracking, idempotent ingest, content dedup, backfill/re-index, offsite backup (daily full + weekly JSONL to B2) |
| Connector framework | Closed | Source adapters, scheduled sync, incremental update, source-specific normalisation |
| Operational hardening | Closed | Rate limiting, auth, quota, multi-tenant observability |

Licensing contact: **hello@foxxelabs.ie** ("Mnemos white-label").

## Tier 3 — Research / IP (closed, never released)

Genuine research IP and the Horizon / HPSU differentiator. Not licensed, not
white-labelled, not committed to any repository that could become public. No
exceptions.

| Component | Disposition | Notes |
|-----------|-------------|-------|
| Colainn biometric enrichment | Never released | Physiological-state snapshots attached to documents at ingest time; the embodied-grounding signal |
| Dyad-corpus ingest | Never released | The Todd–LLM dyad stream method (both speakers ingested; agent-generated content included by design; third-party human content excluded per the Litir rule) |
| Affective/cognitive-state gating | Never released | Salience signals (Léargas / Mothú) that bias retrieval and consolidation |

## Rule for committing

Default to closed. A component may be committed to the public `mnemos/`
directory only if it appears in the Tier 1 table above. Anything in Tier 2 or
Tier 3 — including any code path that *touches* enrichment or tenant boundaries —
stays private. If in doubt, it does not ship.

---
FoxxeLabs Limited · 2026-06-25
