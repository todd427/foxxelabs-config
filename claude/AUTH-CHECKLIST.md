# <span style="color:#5EAEFC">MCP Authentication Verification</span>

For Claude Code to walk after running `bootstrap-mcp.sh` on a fresh node. Confirms each FoxxeLabs MCP server is reachable and authenticated.

---

## <span style="color:#5EAEFC">Workflow</span>

For each server in the list below:

1. Call the **verify** tool listed.
2. If the call returns a sensible payload → **authenticated**, mark `OK`.
3. If the call returns an OAuth/auth error → server **needs OAuth flow**. Mention it to Todd; do not loop.
4. If the call returns a connection/transport error → server is **down or misconfigured**. Capture the error and report.
5. After walking the whole list, print a single status table.

Stop the moment Todd asks you to. Do not retry failed servers more than once per run.

---

## <span style="color:#5EAEFC">Servers</span>

### <span style="color:#7DD3A0">mnemos</span>
- **URL:** `https://mnemos.foxxelabs.ie/mcp`
- **Verify:** `mnemos.get_doc_count`
- **Success:** integer document count returned (~70k+ as of 2026-04)
- **Purpose:** RAG / episodic memory

### <span style="color:#7DD3A0">rialu</span>
- **URL:** `https://rialu.ie/mcp`
- **Verify:** `rialu.list_projects`
- **Success:** array of projects with `name`, `status`, `phase`, `platform`
- **Purpose:** Project registry + secrets vault
- **Known issue (2026-04-25):** OAuth issuer URL bug fixed in commit `aa46cb6`; requires `fly deploy -a rialu` before this server is reachable. If `Failed to connect`, deploy is pending.

### <span style="color:#7DD3A0">taisce</span>
- **URL:** `https://taisce.fly.dev/mcp`
- **Verify:** `taisce.vault_status`
- **Success:** dict with key/login/card/note counts
- **Purpose:** Credentials vault (encrypted)

### <span style="color:#7DD3A0">eric</span>
- **URL:** `https://eric.foxxelabs.ie/mcp`
- **Verify:** `eric.get_mood`
- **Success:** mood string (`default`, `hyped`, `focused`, etc.)
- **Purpose:** Marketing intelligence

### <span style="color:#7DD3A0">flyer</span>
- **URL:** `https://fly-mcp-foxxelabs.fly.dev/mcp`
- **Verify:** `flyer.apps_list`
- **Success:** array of FoxxeLabs Fly.io app names
- **Purpose:** Fly.io operations

### <span style="color:#7DD3A0">sentinel</span>
- **URL:** `https://sentinel-foxxelabs.fly.dev/mcp`
- **Verify:** `sentinel.sentinel_stats`
- **Success:** dict with `events_24h`, `events_7d`, `events_30d`, `reports_sent`, `top_offenders`
- **Purpose:** IP threat intelligence
- **Known issue:** SQLite persistence on ephemeral storage — counts may reset after redeploys. Non-zero counts confirm auth; zero counts may be auth OK + recently restarted.

### <span style="color:#7DD3A0">git-mcp</span>
- **URL:** `https://git-mcp-foxxelabs.fly.dev/mcp`
- **Verify:** `git-mcp.git_list_repos`
- **Success:** array of locally cached repo names (anseo, mnemos, rialu, foxxelabs-config, etc.)
- **Purpose:** Git operations
- **Recurring issue:** stale GitHub PAT baked into HTTPS remote URL of cached clones. If `git_push` fails with `could not read Password`, fix is `git_reclone` after confirming no unpushed commits. Current valid PAT lives in Taisce as `github-pat-allaccess`.

### <span style="color:#7DD3A0">fiosru</span>
- **URL:** `https://fiosru-foxxelabs.fly.dev/mcp`
- **Verify:** `fiosru.fork_list`
- **Success:** array of investigation tasks (may be empty — empty array is OK)
- **Purpose:** Async investigation tasks

---

## <span style="color:#5EAEFC">Output format</span>

After the walk, print one table:

| Server | Status | Notes |
|---|---|---|
| mnemos | OK / NEEDS_AUTH / DOWN | `<error or count>` |
| rialu | ... | ... |
| ... | ... | ... |

`OK` = verify call returned a real payload.
`NEEDS_AUTH` = OAuth challenge or 401/403.
`DOWN` = connection error, 5xx, or DNS failure.

---

## <span style="color:#5EAEFC">Public servers (FYI, not in this checklist)</span>

These connect anonymously and need no verification:

- `huggingface` — `https://huggingface.co/mcp`
- `mermaid` — `https://chatgpt.mermaid.ai/anthropic/mcp`

Google Workspace connectors (Gmail, Calendar, Drive) are configured separately via Claude Code's connector flow, not via `bootstrap-mcp.sh`.

---

## <span style="color:#5EAEFC">Maintenance</span>

When a new FoxxeLabs MCP server ships:

1. Add a `claude mcp add` line to `bootstrap-mcp.sh`
2. Add a row to the table in `README.md`
3. Add a section here with verify tool + success criterion
4. Commit all three together — they should never drift apart
