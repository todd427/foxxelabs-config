# Security Audit — git-mcp

**For:** Claude Code (CC)
**Date:** 22 March 2026
**Priority:** High — this service has read/write access to all FoxxeLabs GitHub repositories

---

## Context

`git-mcp` is a FastMCP StreamableHTTP server deployed on Fly.io at
`https://git-mcp-foxxelabs.fly.dev`. Connected to Claude.ai as an MCP connector,
authenticated via `MCP_API_KEY`. Uses a GitHub PAT (`GITHUB_PAT`) with write
access to all repos under the `todd427` GitHub account.

A credential exposure incident on 2026-03-22 (API key leaked in an uploaded HTML
file) and multiple honeypot hits on anseo.irish prompted a full security review
of all FoxxeLabs MCP services.

---

## Audit Scope

Read `server.py` in full. Audit for:

### 1. Authentication
- Is `MCP_API_KEY` verified on **every** tool call, or only at connection time?
- Is there any unauthenticated endpoint that exposes info or triggers actions?
- Is the key comparison timing-safe (`secrets.compare_digest` or equivalent)?
- Could a malformed/missing key cause an unhandled exception returning a 500
  with stack trace?

### 2. Path Traversal
- `git_read_file`, `git_write_file`, `git_delete_file`, `git_list_files` all
  take a `path` parameter. Can a crafted path escape the repo working directory?
  e.g. `../../etc/passwd`, `../../../app/secrets`
- `repo_path()` uses `repo.split('/')[-1]` — can a repo name like
  `../../sensitive` escape `WORK_DIR`?
- All path parameters must be resolved and verified to be under `WORK_DIR`
  before any file operation.

### 3. Command Injection
- `run()` uses `subprocess.run()` with list args — good. Verify no tool
  constructs shell strings anywhere, especially with user-supplied `branch`,
  `message`, or `path` values.
- Verify `git_commit` message cannot inject shell commands if subprocess
  ever switches to `shell=True`.

### 4. Information Leakage
- Do error messages from `run()` return raw git output containing `GITHUB_PAT`
  in remote URLs?
- `remote_url()` embeds `GITHUB_PAT` in the URL. If this appears in any error
  message or log it leaks the PAT.
- Sanitise all error output: replace `https://<PAT>@github.com/...` with
  `https://github.com/...` before returning to the caller.

### 5. Repo Scope Restriction
- Can a tool be called with `repo` pointing outside the `todd427` GitHub account?
  e.g. `repo="anthropics/claude-code"` triggering a clone of an arbitrary repo.
- Enforce that the resolved repo name matches `^[a-zA-Z0-9_.-]+$` with no path
  separators. Consider an explicit allowlist.

### 6. Destructive Operations Without Safeguards
- `git_write_file` can overwrite any file in any repo silently.
- `git_delete_file` can delete any file silently.
- `git_push` can push to any branch including `main`/`master`.
- Ensure tool descriptions clearly document these as irreversible.

### 7. Rate Limiting
- Any rate limiting on tool calls? A compromised session could exhaust GitHub
  API limits or fill disk with cloned repos.
- Consider per-session or per-IP rate limits.

### 8. Disk Hygiene
- Cloned repos accumulate in `WORK_DIR`. Is there a cleanup mechanism?
  Disk-full conditions will crash the service silently.
- Consider maximum cached repos with LRU eviction.

### 9. Dependencies
- Review `requirements.txt` for known-vulnerable pinned versions.

---

## Fix Priorities

| Priority | Issue |
|----------|-------|
| Critical | PAT exposure in error messages |
| Critical | Path traversal in file operations |
| High | Repo scope not restricted to todd427 |
| High | Auth not timing-safe |
| Medium | No rate limiting |
| Medium | No disk cleanup |

---

## Deliverables

1. Fix all Critical and High issues in `server.py`
2. Add a `SECURITY.md` documenting the auth model and known limitations
3. Commit: `security: path traversal fix, PAT sanitisation, repo scope restriction`
4. Do not change tool signatures — Claude.ai connector must continue working
   without reconfiguration

---

# Security Audit — flyer (fly-mcp-foxxelabs)

**For:** Claude Code (CC)
**Date:** 22 March 2026
**Priority:** High — this service can restart, deploy, and set secrets on all FoxxeLabs Fly.io apps

---

## Context

`flyer` is a FastMCP server deployed at `https://fly-mcp-foxxelabs.fly.dev`.
Connected to Claude.ai as an MCP connector. It wraps the Fly.io Machines API,
exposing app status, logs, restarts, deployments, and secret management.

The flyer source is not in a git repo accessible to CC. The audit must be
performed by reading the deployed source directly on Fly.io (via `flyctl ssh`
or by examining the Dockerfile and any accessible source).

---

## Audit Scope

### 1. Authentication
- Is `MCP_API_KEY` or equivalent verified on every tool call?
- Is there a `/health` or other unauthenticated endpoint that leaks info?
- Timing-safe key comparison?

### 2. Secrets Management
- `secrets_set` can write arbitrary secrets to any Fly app. This is the highest-risk
  operation — it can rotate API keys, inject malicious values, or trigger restarts.
- Should `secrets_set` require a confirmation token or be restricted to a list
  of permitted apps?
- Does `secrets_list` return secret *values* or only key names? Values must never
  be returned.

### 3. App Scope Restriction
- Can tools be called against apps outside the FoxxeLabs Fly.io organisation?
- Enforce an allowlist of permitted app names, or at minimum verify the app
  belongs to the configured organisation before any operation.

### 4. Destructive Operations
- `app_restart` restarts a live service — no confirmation.
- Deployment operations can push arbitrary images.
- Document all irreversible operations clearly in tool descriptions.

### 5. Log Access
- `app_logs` returns raw log output. Logs may contain secrets, PATs, API keys
  printed during startup. Redact any line matching common secret patterns before
  returning.

### 6. Rate Limiting
- Fly Machines API has rate limits. Repeated restarts or log fetches could
  hit these limits or destabilise running services.

### 7. Error Handling
- Do Fly API errors return raw HTTP responses that might contain auth tokens
  or internal infrastructure details?

---

## Fix Priorities

| Priority | Issue |
|----------|-------|
| Critical | secrets_set unrestricted — can overwrite any app secret |
| Critical | Log output may contain secrets |
| High | App scope not restricted to FoxxeLabs org |
| High | Auth not timing-safe |
| Medium | No rate limiting on destructive ops |

---

## Deliverables

1. Fix all Critical and High issues
2. Add `SECURITY.md` documenting the auth model, permitted apps, and limitations
3. Commit: `security: secrets_set app allowlist, log redaction, scope restriction`
4. Do not change tool signatures

---

*FoxxeLabs Limited · Confidential · 22 March 2026*
