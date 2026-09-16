# <span style="color:#1e40af">CC Brief — extract_sessions.py (Directing AI session-coding study)</span>

<span style="color:#7c2d12">**Created:**</span> 2026-09-16
<span style="color:#7c2d12">**Parent:**</span> directing-ai/Empirical_Grounding_Session_Coding_Study.md
<span style="color:#7c2d12">**Target:**</span> new repo, working dir `/home/Projects/<name>` — Todd names it before first push; until then work in `/home/Projects/session-coding` and rename.
<span style="color:#7c2d12">**Runs on:**</span> Daisy. Claude Code logs from Rose are copied in as a second input directory.
<span style="color:#7c2d12">**Licence:**</span> Apache-2.0. The repo will be public; it must never contain transcripts, exports, or the feature table with real names.

---

## <span style="color:#0f766e">Goal</span>

One Python package that reads three export formats into a common per-session record, computes a fixed feature set per session, writes a feature table, and provides a labelling harness that (a) takes hand codes, (b) fits threshold rules, (c) labels the clear band, (d) emits the ambiguous band for a local-model pass. Chunks are never counted; the session is the only unit.

## <span style="color:#0f766e">Inputs</span>

Three formats. The field names below are from working knowledge of each export as of mid-2026 — **inference, not verified**. First task in Phase 0 is to open one real file of each kind and confirm or correct the schema before writing a parser. Record what was actually found in `docs/SCHEMAS.md`.

1. **claude.ai export** — `conversations.json`, a list of conversations. Expected: `uuid`, `name`, `created_at`, `updated_at`, `chat_messages[]` with `sender` (`human` | `assistant`), `text`, `created_at`, and a `content[]` block list whose `type` may be `text`, `tool_use`, `tool_result`. Use `text` for prose; drop tool blocks from word counts but record their count.
2. **ChatGPT export** — `conversations.json`, a list. Expected: `title`, `create_time`, `mapping` (dict of nodes: `id`, `parent`, `children[]`, `message{author{role}, content{content_type, parts[]}, create_time}`) and `current_node`. Reconstruct the active branch by walking `current_node` → `parent` to the root, then reverse. Ignore abandoned branches. Roles: `user`, `assistant`, `system`, `tool`; keep user and assistant only.
3. **Claude Code logs** — `~/.claude/projects/<encoded-cwd>/<session-uuid>.jsonl`, one JSON object per line. Expected line `type` values include `user`, `assistant`, `summary`, possibly `system`; each carries `timestamp`, `sessionId`, `uuid`, `parentUuid`, `cwd`, `isSidechain`, and `message{role, content}` where `content` is a string or a list of blocks (`text` | `tool_use` | `tool_result`). Rules: `isSidechain: true` lines are subagent traffic — exclude from prose counts, count separately. `tool_result` blocks are pasted output by definition — they feed the paste fraction, never the authored-prose count. `summary` lines are not turns. One JSONL file = one session; `cwd` gives the project.

## <span style="color:#0f766e">Common session record</span>

```python
@dataclass
class Turn:
    role: str            # "user" | "assistant"
    ts_ms: int | None    # Unix ms UTC
    text: str            # prose only, tool blocks removed
    tool_use_n: int
    tool_result_n: int
    code_block_n: int    # fenced blocks in text

@dataclass
class Session:
    session_id: str      # source uuid, or sha1(title+create_time) for chatgpt if uuid absent
    source: str          # "chatgpt" | "claude-chat" | "claude-code"
    surface: str         # "chat" | "cc"
    project: str | None  # cc cwd basename; None for chat
    title: str | None
    started_ms: int
    ended_ms: int
    turns: list[Turn]
```

Serialised to `data/sessions/<source>/<session_id>.json`. `data/` is gitignored.

## <span style="color:#0f766e">Paste detection</span>

Applied to user turns only. A user turn is split into lines; a line is *paste* if it matches any of:

- shell prompt: `^\s*(\(\S+\)\s*)?[\w.@~/-]*[$#%]\s`
- traceback: `^Traceback \(most recent call last\)` and every following line until a blank line; also `^\s+File ".*", line \d+`
- log line: `^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}` or `^(INFO|WARN|WARNING|ERROR|DEBUG)\b`
- JSON/dict dump: line begins with `{`, `[`, `"key":`, or is `}`/`]` alone; runs of ≥3 such lines
- diff header: `^(diff --git|index [0-9a-f]+\.\.|---\s|\+\+\+\s|@@ )`
- progress bar: contains `|█` or `\d+%\|` or `\d+/\d+ \[`
- code fence contents: everything between ``` markers
- file listing run: ≥4 consecutive lines matching `^[\w./-]+(\.\w+)?$`
- browser console: `^\S+\.js:\d+:\d+` at line end

`authored_chars` = characters in non-paste lines. `paste_fraction` = paste chars / total chars. Ship the rules in `paste_rules.py` as an ordered list so they can be tuned without touching the extractor; ship unit tests with one fixture per rule taken from a real (anonymised) turn.

## <span style="color:#0f766e">Correction detection</span>

Applied to user turns, first 120 characters after stripping paste, case-insensitive:

- opens with `no`, `nope`, `wrong`, `not quite`, `that's not`, `that is not`, `actually`, `incorrect`, `you're wrong`, `please.` (with full stop), `sigh`
- contains `I said`, `I told you`, `as I said`, `you missed`, `you forgot`, `that's a fabrication`, `made up`, `hallucinat`
- a bare imperative restating a prior claim is out of scope for v0 — it needs the model pass

Each hit is a `correction_event` with the turn index. Count per session and per 100 assistant turns.

## <span style="color:#0f766e">Feature set (per session)</span>

Written to `data/features.csv`, one row per session:

| column | definition |
|---|---|
| session_id, source, surface, project, started_ms, ended_ms | from record |
| turns_user, turns_assistant | counts |
| words_user_authored, words_user_paste, words_assistant | word counts after split |
| ratio_user_assistant | words_user_authored / words_assistant |
| paste_fraction | as above |
| q_user, q_assistant | question-mark counts in prose |
| q_direction | q_user / (q_user + q_assistant), 0.5 when both zero |
| code_blocks_assistant_per_turn | mean fenced blocks per assistant turn |
| tool_use_n, tool_result_n, sidechain_turns | cc only; zero elsewhere |
| corrections, corrections_per_100 | as above |
| terminal_event | `commit` \| `brief` \| `decision` \| `answer` \| `none` — see below |
| duration_min | (ended − started) / 60000 |
| tomhas_peak, tomhas_band | joined; null where no match |

Terminal event, from the last three assistant turns and last user turn: `commit` if any of `git commit`, `pushed`, `committed`, a 7-hex sha in brackets; `brief` if `CC brief`, `brief written`, `handoff`; `decision` if user's last authored turn contains `go with`, `decided`, `let's do`, `agreed`, `option \d`, `yes, do that`; `answer` if the session is ≤4 turns and ends on an assistant turn with no question; else `none`. Precedence in that order.

## <span style="color:#0f766e">Tomhas join</span>

`tomhas_export.py` calls the Tomhas `history` MCP tool (or reads a JSON dump Todd provides) and writes `data/tomhas_sessions.json` with `session_id, started_ms, ended_ms, peak_score, peak_band, turns`. Join to chat-plane sessions on overlap of `[started_ms, ended_ms]` with a 10-minute tolerance; where two Tomhas sessions overlap one chat session, take the higher peak and flag `tomhas_ambiguous=1`. Claude Code sessions will not match — leave null; do not force.

## <span style="color:#0f766e">Labelling harness</span>

- `sample.py --n 60 --seed 20260916` — stratified draw: 20 sessions from 2023–24 (chatgpt), 20 from 2025 (chatgpt + claude-chat), 20 from 2026 (claude-chat + claude-code, at least 6 cc). Writes `data/hand_codes.csv` with columns `session_id, mode_primary, mode_secondary, coder, notes` and a `render.py` that prints a session as readable Markdown for coding in vi.
- `fit.py` — reads hand codes, fits one-rule-per-mode thresholds by grid search on the features (max accuracy against `mode_primary`), reports confusion matrix and kappa, writes `rules.json`.
- `label.py` — applies `rules.json`; a session whose top two rule scores are within 0.15 of each other goes to `data/ambiguous.jsonl` with its rendered text; everything else gets `mode_auto`.
- `model_label.py` — sends `ambiguous.jsonl` to a local OpenAI-compatible endpoint (Iris vLLM, Qwen3-8B) with the rubric from the parent document as the system prompt; expects strict JSON `{"mode_primary": ..., "mode_secondary": ..., "confidence": ...}`; writes `mode_model`. Endpoint and model name are config, not code.
- Final `mode` column: hand code if present, else model label if present, else auto.

Second-coder support: `hand_codes.csv` accepts multiple rows per session with different `coder`; `agreement.py` reports Cohen's kappa on the overlap.

## <span style="color:#0f766e">Anonymisation for release</span>

`release.py` writes `release/features.csv` with `session_id` replaced by a salted hash, `project` mapped through a lookup table to `project_01…`, and `title` dropped. Nothing else in `release/` — no text, no rendered sessions. The salt lives in `.env`, never committed.

## <span style="color:#0f766e">CLI</span>

```
sc extract --claude-chat PATH --chatgpt PATH --claude-code DIR [--claude-code DIR ...]
sc features
sc tomhas --from-mcp | --from-json PATH
sc sample --n 60
sc render SESSION_ID
sc fit
sc label
sc model-label --endpoint URL --model NAME
sc agreement
sc release
sc report          # monthly mode distribution, correction rate by mode, tomhas by mode — as CSVs plus matplotlib PNGs in report/
```

Python 3.12, `uv`, single package `session_coding/`, pandas for tables, no ML dependencies beyond scikit-learn for kappa. Tests under `tests/` with fixtures built from anonymised real turns.

## <span style="color:#0f766e">Phases</span>

- **Phase 0 — schemas.** Open one real file of each format, write `docs/SCHEMAS.md` with what was actually found, correct the parser plan above. Do not write parsers from the assumptions in this brief.
- **Phase 1 — extract + features.** All three parsers, paste and correction rules with tests, `features.csv` for the full corpus. Acceptance: every session in every export produces exactly one row; row count reported per source; no exceptions swallowed.
- **Phase 2 — sample + render.** Todd hand-codes 60.
- **Phase 3 — fit + label + Tomhas join.** Acceptance: rules reach ≥85% coverage of the corpus at kappa ≥0.8 against hand codes on the held-in 60; ambiguous band ≤15%.
- **Phase 4 — model pass + agreement + release + report.**

## <span style="color:#0f766e">Non-goals</span>

- No Mnemos ingestion. Mnemos consumes the released table later, by a separate decision.
- No web UI. vi and CSV.
- No attempt to classify individual turns. Session only.
- No sentiment. Mothú owns that.

## <span style="color:#0f766e">Acceptance for the whole brief</span>

`sc report` produces the four planned figures from the parent document on the full 2023–2026 corpus, with the Claude Code sessions present in figure 1 and correctly absent from figure 3.

---

*FoxxeLabs Limited · 2026-09-16*
