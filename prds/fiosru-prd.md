# Fiosrú — Asynchronous Investigator MCP Service

**Version:** 0.1 — initial PRD
**Date:** 23 April 2026
**Owner:** Todd McCaffrey / FoxxeLabs Limited
**Status:** Design stage — not yet implemented
**Working name:** *Fiosrú* (Old Irish: to investigate, enquire)

---

## 1. Purpose

An MCP-exposed service that lets a Claude conversation spawn an asynchronous investigation task, return a job ID immediately, and collect results later. Solves the concrete problem: *"research this question elsewhere and get back to me, without me leaving this conversation."*

Not a tool pool. Not a multi-agent coordinator. One thing: single-task async fork-and-collect, with observable status.

## 2. What this replaces

Currently Todd achieves parallelism by duplicating Chrome tabs in Claude.ai. This works but incurs a large context-switch cost for each tab. The pattern Todd actually wants is *fire-and-forget-then-collect* from within the primary conversation.

Eric is not the right substrate because Eric is a domain-specialised marketing agent with hardcoded prompt templates. Fiosrú is a general-purpose investigator with no domain.

Claude Code's `Task` tool is the reference implementation pattern, but `Task` is not exposed to Claude.ai. Fiosrú is the claude.ai equivalent: MCP-accessible from any Claude conversation that has the connector enabled.

## 3. Scope

### In scope

- Accept arbitrary task prompts via MCP tool call
- Spawn an asynchronous Claude API call to execute the task
- Return a job ID immediately (non-blocking from caller perspective)
- Persist task state in SQLite
- Allow status polling and result collection via MCP tool call
- Support model selection per task (Opus, Sonnet, Haiku)
- Support web search as a worker tool (built into Anthropic Messages API)
- Enforce per-task timeout and cost cap
- Log all tasks for later review and cost accounting

### Out of scope (v1)

- Worker access to other MCP servers (Mnemos, git-mcp, etc.) — tool federation deferred to v2
- Multi-worker coordination — that's Legion, not Fiosrú
- Streaming partial results — v1 is poll-based only
- Web UI — v1 is MCP-only; add UI in v2 if pattern proves useful
- Authentication beyond MCP connector auth — single-user service
- Task dependencies / DAGs — each task is independent

## 4. Architecture

### Components

```
┌─────────────────────────────────────────────────────────────┐
│  Claude.ai conversation                                     │
│    ↓ fiosru:fork_task(prompt, model, tools)                 │
│    ↓ returns job_id immediately                             │
└─────────────────────────────────────────────────────────────┘
                          │
                          ↓ MCP over HTTPS
┌─────────────────────────────────────────────────────────────┐
│  Fiosrú service (Fly.io)                                    │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  MCP server (FastAPI + mcp-python)                  │    │
│  │    fork_task, fork_result, fork_list, fork_cancel   │    │
│  └─────────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Task queue (asyncio.create_task)                   │    │
│  │    spawns worker for each new task                  │    │
│  └─────────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Worker (async)                                     │    │
│  │    calls Anthropic Messages API with agent loop     │    │
│  │    streams result to DB as it completes             │    │
│  └─────────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  SQLite (/data/fiosru.db)                           │    │
│  │    tasks table with status, result, metadata        │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                          │
                          ↓ HTTPS
              https://api.anthropic.com/v1/messages
```

### Tech stack

- **Language:** Python 3.12
- **Web framework:** FastAPI
- **MCP library:** `mcp` (official Python SDK)
- **Async runtime:** asyncio
- **Storage:** SQLite with aiosqlite
- **Claude client:** `anthropic` Python SDK (async)
- **Deployment:** Fly.io with persistent volume for SQLite
- **Pattern match:** Same substrate as Eric, Sentinel, Mnemos, Taca

## 5. Data model

### SQLite schema

```sql
CREATE TABLE tasks (
    id              TEXT PRIMARY KEY,  -- short UUID, 8 chars
    created_at      TIMESTAMP NOT NULL,
    started_at      TIMESTAMP,
    completed_at    TIMESTAMP,
    status          TEXT NOT NULL,     -- queued|running|done|failed|cancelled|timeout
    prompt          TEXT NOT NULL,
    model           TEXT NOT NULL,     -- claude-opus-4-7, etc.
    max_tokens      INTEGER NOT NULL DEFAULT 4096,
    enable_web      BOOLEAN NOT NULL DEFAULT 1,
    result          TEXT,              -- final assistant message
    error           TEXT,              -- error message if failed
    input_tokens    INTEGER,
    output_tokens   INTEGER,
    cost_usd        REAL,              -- computed from token counts and model
    metadata        TEXT               -- JSON blob for arbitrary context
);

CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_created ON tasks(created_at DESC);
```

### Job ID

Short UUID, 8 hex characters. Example: `a3f9c021`. Small enough to paste conversationally; large enough to avoid collisions for expected volume.

## 6. MCP tool surface

### fork_task

**Description:** Spawn an asynchronous investigation task. Returns immediately with a job ID.

**Parameters:**
- `prompt` (string, required): The task description. What the worker should investigate and return.
- `model` (string, optional, default `claude-opus-4-7`): Anthropic model identifier.
- `max_tokens` (integer, optional, default 4096): Maximum output tokens.
- `enable_web` (boolean, optional, default `true`): Whether worker can use web_search.
- `context` (string, optional): Additional context material to prepend to the prompt (e.g., a paste from Mnemos query, a document excerpt).

**Returns:**
```json
{
  "job_id": "a3f9c021",
  "status": "queued",
  "created_at": "2026-04-23T10:45:00Z",
  "estimated_completion_s": 90
}
```

### fork_result

**Description:** Poll or collect the result of a forked task.

**Parameters:**
- `job_id` (string, required)
- `wait_seconds` (integer, optional, default 0): If provided, block up to this many seconds waiting for completion. Maximum 60.

**Returns:**
```json
{
  "job_id": "a3f9c021",
  "status": "done",
  "result": "The full assistant response...",
  "created_at": "2026-04-23T10:45:00Z",
  "completed_at": "2026-04-23T10:46:34Z",
  "elapsed_s": 94,
  "input_tokens": 412,
  "output_tokens": 1847,
  "cost_usd": 0.028
}
```

Status values: `queued`, `running`, `done`, `failed`, `cancelled`, `timeout`.

If status is still `running` or `queued`, `result` is `null` and `completed_at`, `output_tokens`, `cost_usd` are absent.

### fork_list

**Description:** List recent forked tasks.

**Parameters:**
- `status` (string, optional): Filter by status. `"active"` returns queued+running; default returns all.
- `limit` (integer, optional, default 20): Maximum results.

**Returns:**
```json
{
  "tasks": [
    {
      "job_id": "a3f9c021",
      "status": "done",
      "prompt_preview": "Investigate Barrett's regulatory scaffold...",
      "created_at": "2026-04-23T10:45:00Z",
      "completed_at": "2026-04-23T10:46:34Z",
      "cost_usd": 0.028
    }
  ],
  "count": 1
}
```

### fork_cancel

**Description:** Cancel a running task.

**Parameters:**
- `job_id` (string, required)

**Returns:**
```json
{"job_id": "a3f9c021", "status": "cancelled"}
```

## 7. Worker behaviour

### Lifecycle

1. Task inserted with status `queued`
2. `asyncio.create_task` spawns worker coroutine
3. Worker sets status to `running`, records `started_at`
4. Worker calls Anthropic Messages API with:
   - System prompt: "You are an investigator. Complete the task described and return your findings directly. Be thorough but concise."
   - User message: `context` (if provided) + prompt
   - Tools: `web_search` if `enable_web=true`, otherwise no tools
5. Worker handles agent loop automatically (Anthropic SDK does this)
6. On completion: result written to DB, status set to `done`, `completed_at` recorded, token counts recorded
7. On error: error recorded, status set to `failed`
8. On timeout (default 5 minutes): status set to `timeout`, partial result recorded if available

### Cost controls

- Per-task token cap via `max_tokens` parameter
- Hard timeout at 300 seconds (5 minutes)
- Daily spend cap (configurable env var, default USD 5.00) — service refuses new tasks if daily spend exceeded
- All token counts and computed cost stored per task for auditing

### Error handling

- API errors: retry once after 5 seconds, then fail
- Rate limit errors: retry with exponential backoff up to 3 attempts
- Timeout: record current state, return partial if available

## 8. Deployment

### Fly.io config

- App name: `fiosru-foxxelabs`
- Region: `lhr` (London, same as Eric)
- Machine: 1 × shared-cpu-1x, 512 MB RAM (plenty)
- Volume: `/data` (1 GB, for SQLite)
- Secrets: `ANTHROPIC_API_KEY`, `MCP_OAUTH_CLIENT_ID` (if using OAuth), `DAILY_SPEND_CAP_USD`
- Health check: `GET /health` returns 200 if service up and DB accessible

### MCP connector URL

`https://fiosru-foxxelabs.fly.dev/mcp` — add to Claude.ai MCP connectors once deployed.

## 9. Implementation plan

### Phase 1 — core service (half a day)

1. Initialise Python project, install `anthropic`, `fastapi`, `mcp`, `aiosqlite`
2. Write SQLite schema and basic DB access layer (`db.py`)
3. Write worker coroutine that calls Anthropic API and writes result (`worker.py`)
4. Write FastAPI app with four MCP tools (`server.py`)
5. Write `fly.toml` and `Dockerfile`
6. Deploy to Fly with secrets
7. Add MCP connector in Claude.ai
8. Test: fork a task, check status, collect result

### Phase 2 — polish (rest of the day)

1. Add daily spend cap enforcement
2. Add task cancellation
3. Add `fork_list` filtering
4. Add structured logging to Fly logs
5. Write README with example invocations

### Phase 3 — tool federation (v2, deferred)

Worker gets access to Mnemos, git-mcp, etc. via MCP-over-MCP proxy. This is the hard part. Deferred until v1 proves the pattern useful enough to justify the complexity.

## 10. Usage examples

### Example 1: Research a question in parallel with dissertation drafting

In the middle of drafting Chapter 2 section 2.1, Todd says:

> Fork a worker to investigate Barrett's (2020) regulatory scaffold argument, specifically whether the argument predicts that AI interaction could produce partial scaffolding effects in affect regulation. 600 words, cite primary sources.

Claude calls:
```
fiosru:fork_task(
  prompt="Investigate Barrett's (2020) regulatory scaffold argument, specifically whether the argument predicts that AI interaction could produce partial scaffolding effects in affect regulation. 600 words, cite primary sources.",
  model="claude-opus-4-7",
  max_tokens=2000,
  enable_web=true
)
→ {"job_id": "a3f9c021", "status": "queued", "estimated_completion_s": 90}
```

Conversation continues on 2.1 drafting. Ten minutes later Todd asks:

> How's the Barrett fork coming along?

Claude calls:
```
fiosru:fork_result(job_id="a3f9c021")
→ {"status": "done", "result": "Barrett's constructed emotion framework...", ...}
```

Claude presents the result. Todd decides whether to use it.

### Example 2: Overnight research batch

Before bed Todd forks three tasks on related questions, wakes up, asks Claude to collect all three. Useful for genuinely deep investigations that shouldn't block working-hours flow.

### Example 3: Cost-sensitive lightweight queries

```
fiosru:fork_task(
  prompt="Find the current DOI and page range for Bussu et al. 2025 systematic review on cyberbullying",
  model="claude-haiku-4-5-20251001",
  max_tokens=500,
  enable_web=true
)
```

Cheap and fast. Use Haiku for lookups, Opus for substantive investigation.

## 11. Risks and mitigations

**Risk:** Runaway costs from misbehaving workers.
**Mitigation:** Daily spend cap, per-task max_tokens, hard timeout.

**Risk:** Task queue fills up and service hangs.
**Mitigation:** Workers run independently via asyncio.create_task; no shared queue state to block.

**Risk:** SQLite corruption from concurrent writes.
**Mitigation:** aiosqlite serialises writes; WAL mode enabled.

**Risk:** MCP connector auth / session issues.
**Mitigation:** Same OAuth pattern as other FoxxeLabs MCPs; battle-tested.

**Risk:** Worker loses tool-federation advantage that duplicate-tab has.
**Mitigation:** Acknowledged limitation; v1 ships with web_search only; v2 adds Mnemos access.

## 12. Success criteria

Fiosrú v1 succeeds if, during a dissertation drafting session, Todd can:

1. Fork a substantive research task (e.g., "investigate X concept") without leaving the current Claude conversation.
2. Continue working on the main task without waiting.
3. Collect the result later in the same conversation.
4. Use the result to inform subsequent work.

The measure is whether the asynchronous pattern produces a net reduction in context-switch cost compared to tab duplication — not whether the worker outperforms a synchronous Claude call, which it will not.

## 13. Prior art and references

- **Claude Code `Task` tool.** The reference implementation of this pattern. Worker agents with tool access, programmatic result return. Not exposed to claude.ai; Fiosrú is the claude.ai-equivalent.
- **Anthropic Agent SDK (2025).** Provides the primitives — agent loops, tool use, streaming. Fiosrú wraps the SDK as an MCP service.
- **Eric (eric.foxxelabs.ie).** Demonstrates that Claude-API-as-a-service is workable and that MCP-over-Fly deployment is clean. Fiosrú is roughly "Eric without the marketing specialisation."

## 14. Decisions deferred

- Whether to expose Fiosrú under `fiosru.foxxelabs.ie` or keep at `fiosru-foxxelabs.fly.dev`. Probably the former, for brand coherence.
- Whether to add a minimal web UI for browsing past tasks. Not v1; possibly v2 if the historical log proves useful enough.
- Whether to add streaming partial results. Not v1; would require server-sent events and more complex MCP tool design. Defer.

## 15. Next actions

1. Review this PRD and decide on name (*Fiosrú* vs. alternative).
2. Create repo `todd427/fiosru` with scaffold (README, pyproject.toml, empty module layout).
3. Implement Phase 1 in Claude Code or locally.
4. Deploy to Fly.
5. Add to `projects.json` with status `implementation`.
6. Test in a real dissertation drafting session within 48 hours of deployment.
