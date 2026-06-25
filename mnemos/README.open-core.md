# Mnemos — Open-Core Retrieval Shell

A generic hybrid-retrieval shell: dense vectors (Qdrant) + lexical full-text
(SQLite FTS5), fused at query time and exposed over an MCP server and a small
REST surface. This is the open layer extracted from Mnemos, FoxxeLabs' production
memory system. It is the commodity substrate, not the product.

## What this is

Mnemos in production is a retrieval-augmented persistent memory system. The
open-core shell is the part of that system with no proprietary advantage: the
retrieval primitives. You point it at a Qdrant collection and an FTS5 index,
ingest text, and query it. It returns ranked, deduped passages with scores. That
is the whole contract.

It exists so you can embed retrieval into your own agent or application without
reimplementing hybrid search, score fusion, and an MCP toolface from scratch.

## What's open

- **Hybrid retrieval core** — Qdrant dense search + FTS5 lexical search, fused
  (reciprocal-rank by default; weights configurable).
- **MCP server** — FastMCP. Tools: `query_memory`, `ingest_document`,
  `get_doc_count`, `list_filters`. Stable tool signatures.
- **REST API shape** — `POST /query`, `POST /ingest`, `GET /stats`,
  `GET /filters`. Documented request/response schemas.
- **Embedding adapter interface** — bring your own embedding endpoint;
  reference adapter included.
- **Chunking** — sentence-aware splitter with configurable window/overlap.

## What's not open

The open shell is deliberately single-tenant and stateless about *who* owns
what. The following are closed and licensed separately (see `SCOPE-SPLIT.md`):

- Per-tenant isolation and namespacing
- Production ingest/dedup pipeline (provenance, idempotency, backfill)
- Connector framework (source adapters, scheduled sync)
- Any enrichment beyond plain text (this is research IP and is never released)

If you need multi-tenant isolation or managed ingest, you want the commercial
tier, not a fork of this.

## Use

```bash
# Requires a reachable Qdrant instance and an embedding endpoint.
cp .env.example .env        # set QDRANT_URL, EMBED_URL, FTS_DB_PATH
docker compose up           # or run the FastMCP/REST process directly

# REST
curl -s localhost:8080/stats
curl -s -X POST localhost:8080/ingest \
  -H 'content-type: application/json' \
  -d '{"id":"doc-1","text":"...","metadata":{"source":"notes"}}'
curl -s -X POST localhost:8080/query \
  -H 'content-type: application/json' \
  -d '{"q":"what did I decide about X","k":6}'
```

MCP: register the server in your client config and call `query_memory` /
`ingest_document`. Tool signatures match the REST schemas one-to-one.

Region note: FoxxeLabs services run `lhr`. The shell is region-agnostic — deploy
where your Qdrant lives to keep query latency down.

## Versioning

The open shell tracks the production retrieval core but is released
independently. Tool signatures and REST schemas are treated as a stable
contract; breaking changes are majored. Internal pipeline changes upstream do
not break this surface.

## Licence

Open-core. The retrieval shell is released under a permissive licence (see
`LICENSE`). The closed and research tiers are not covered by it and are not
included in this repository.

## Commercial / white-label

The shell seeds the funnel; the value most builders actually need —
per-tenant isolation, managed ingest/dedup, and the connector framework — is the
licensed white-label tier. If you're building a product on top of this and need
that, contact **hello@foxxelabs.ie** with "Mnemos white-label" in the subject.

---
FoxxeLabs Limited · 2026-06-25
