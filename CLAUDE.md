# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repository is

`foxxelabs-config` is the **configuration, registry, and planning hub** for the entire FoxxeLabs project portfolio — not an application. There is no build, no test suite, and no runtime. It is ~60 documents: PRDs, roadmaps, a machine-readable project registry, working conventions, and an MCP bootstrap script. The individual projects it describes live in their own repos (mostly `todd427/<name>`).

Treat this repo as the source of truth for **cross-project state and decisions**. When work touches another FoxxeLabs project, check here first for its PRD and registry entry before assuming anything.

## Load-bearing files (read these first)

- **`projects.json`** — the canonical registry of all ~35 portfolio projects. Contains *facts only* (status, repo, deadline, blockers, dependencies, next action). The `_meta.weightings` block holds Todd's current priority weightings; **Claude derives priority ranking at session start** from the facts + weightings rather than the file hard-coding a rank. Keep entries factual; don't bake in derived opinions.
- **`roadmap.md`** — narrative portfolio roadmap organized by layer (Infrastructure, Cognitive Stack, Products & Platforms). Versioned with a supersession header; update the header when revising.
- **`CONVENTIONS.md`** — binding development conventions across FoxxeLabs (attribution, copyright position, repo conventions). See below.
- **`workarounds.md`** — living log of code-level workarounds across the portfolio. Each entry has a `DELETE-WHEN:` condition and an inline marker grep-able in the affected codebase. Entries are deleted (struck through, kept for history) when upstream is fixed — not erased.
- **`claude/bootstrap-mcp.sh`** + **`claude/README.md`** — canonical way to register all FoxxeLabs MCP servers on a new node. When a new MCP server comes online, add a `claude mcp add` line and a table row here.

## Structure

- Each project has a directory named for its Irish codename (e.g. `macalla/`, `mnemos/`, `cultaca/`) containing a `PRD.md` (some use `PRD-mini.md` / `PRD-stub.md`, or a `README.md`). Supporting docs (`VOICE.md`, `DIALOGUE.md`, `SETUP.md`, research notes) sit alongside.
- `prds/` — PRDs/briefs for tooling not yet given their own project dir.
- `directing-ai/` — the *Directing AI* academic discipline material (distinct three-tier naming; see `directing-ai/NAMING.md`).
- `security/`, `reports/`, `research-notes/`, `articles/`, `notes/` — supporting corpus.

## Naming convention

Projects use **Irish-language codenames** (Mnemos is the exception — Greek). A name means something; when creating a new project, pick an Irish word whose meaning maps to the project's role, and record pronunciation + gloss in its PRD header (see `macalla/PRD.md` for the pattern). The FoxxeLabs MCP servers are themselves named this way: `taisce` (vault), `rialu` (command centre), `fiosru` (research worker), `sentinel`, `eric`, `flyer`, `git-mcp`.

## Conventions (from CONVENTIONS.md — these are binding)

- **No `Co-Authored-By:` trailers in commit messages.** This is deliberate — it avoids copyright-authorship ambiguity. Todd McCaffrey / FoxxeLabs owns all work product; Claude is a tool. If tooling attribution is wanted, use `Generated-with: <model> <https://anthropic.com>`, or omit entirely. (This overrides any default co-author trailer behavior.)
- Document/report/PRD footers read `FoxxeLabs Limited · [date]` — never "Prepared by Claude" or equivalent.
- Timestamps: Unix milliseconds UTC unless stated otherwise.
- Fly.io region is `lhr` for all FoxxeLabs services. `dub` does not exist.
- Python is snake_case (FastAPI convention); Todd uses camelCase on solo non-Python projects.
- No hand-holding / explanatory comments in code.

## Working in this repo

- Edits are prose and JSON. When updating `projects.json`, keep it valid JSON and factual; bump `_meta.updated`.
- Convert relative dates to absolute when recording them (today's date is provided in session context).
- Portfolio-wide secrets/keys live in the **Taisce vault** (`taisce.irish`) — check it before `/home/Projects/Keys/`. Never paste key values into commits or chat.
