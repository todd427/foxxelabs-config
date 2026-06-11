# <span style="color:#2E86AB">CC Brief — flyer:deploy tool</span>

**Date:** 2026-06-11
**Target:** flyer MCP server (fly-mcp-foxxelabs.fly.dev)
**Status:** Post-viva queue
**Origin:** Eric monitor change (mark `ac88ff1`) committed via git-mcp but undeployable from chat — flyer has no deploy verb.

## <span style="color:#A23B72">Problem</span>

flyer currently exposes five tools: `deploy_status`, `app_restart`, `app_status`, `secrets_list`, `apps_list`. All read-only except restart — and restart boots the *existing* image, so code changes committed via git-mcp cannot reach production without Todd running `fly deploy` from a local checkout.

This breaks an otherwise fully chat-closeable loop: **commit via git-mcp → deploy via flyer → verify via deploy_status/app_logs**. Every Fly-hosted service (mnemos, eric/mark, fiosru, sentinel, taisce, git-mcp itself, flyer itself) hits this wall.

## <span style="color:#A23B72">Proposed tool</span>

```
flyer:deploy
  app: string          # Fly app name, e.g. "eric-foxxelabs"
  repo: string         # GitHub repo, e.g. "todd427/mark"
  ref: string = "main" # branch, tag, or commit SHA
```

### Behaviour

1. Shallow-clone `repo` at `ref` into a temp dir (`git clone --depth 1 --branch <ref>`; for a SHA, clone + `git checkout <sha>`).
2. Run `flyctl deploy --remote-only -a <app>` from the clone root (uses the repo's fly.toml/Dockerfile; remote builder means no Docker needed on the flyer machine).
3. Stream/capture flyctl output; return release version, image ref, and tail of build log.
4. Clean up the temp clone.

### Auth

- **Fly:** a deploy-scoped token (`fly tokens create deploy -a <app>` per app, or one org-scoped token) stored as a flyer secret `FLY_DEPLOY_TOKEN`, passed via `FLY_API_TOKEN` env to flyctl. Do NOT reuse a personal full-access token.
- **GitHub:** read-only PAT for private repos, stored in Taisce and mirrored as flyer secret `GH_READ_TOKEN`. Public repos need nothing.

### Safety rails

- **Allowlist** of deployable apps in flyer config (start with: eric/mark, fiosru, sentinel — exclude mnemos and taisce until trusted; a bad deploy to the memory store or secrets vault is the worst case).
- **Confirm-by-ref:** require an explicit `ref`; no implicit "whatever main is now" default would be safer, but `main` default is acceptable given the allowlist.
- **No secrets in output:** scrub flyctl output before returning (it can echo env summaries).
- **Timeout:** hard cap ~10 min; return the build log tail on timeout rather than hanging the MCP call.
- **One deploy at a time per app:** simple lock file or in-memory mutex to prevent concurrent deploys racing.

### Companion additions (cheap while in there)

- `flyer:app_logs` exists in the tool listing but verify it's wired and returns recent lines — needed to verify a deploy actually came up healthy.
- `flyer:deploy_rollback(app)` — `flyctl releases` + redeploy previous image ref. Optional but turns a bad deploy from an incident into a one-liner.

## <span style="color:#A23B72">Implementation notes</span>

- flyer's machine needs `flyctl` in its image (curl install in Dockerfile, pin a version) and `git`.
- `--remote-only` keeps the flyer machine small: no Docker daemon, builds happen on Fly's builders.
- Estimated effort: half a day including token setup and allowlist plumbing. The risky part is token scoping, not code.

## <span style="color:#A23B72">Acceptance test</span>

From a Claude chat session: commit a trivial change to mark via git-mcp, call `flyer:deploy(app="eric-foxxelabs", repo="todd427/mark", ref="main")`, confirm new release via `deploy_status`, confirm behaviour change via Eric's MCP. Zero terminal touches.
