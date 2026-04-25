# Claude Code MCP Bootstrap

Bootstrap script for registering FoxxeLabs MCP servers in Claude Code on a new node. Eliminates the manual 13-server `claude mcp add` dance every time a machine comes online.

## Usage

After `npm install -g @anthropic-ai/claude-code` on a fresh node:

```bash
bash claude/bootstrap-mcp.sh
```

Authenticate each server on first invocation (OAuth 2.1 PKCE flow handled by Claude Code).

## Servers registered

| Name | Purpose | URL |
|---|---|---|
| `mnemos` | RAG / episodic memory | mnemos.foxxelabs.ie/mcp |
| `rialu` | Project registry + secrets | rialu.ie/mcp |
| `taisce` | Credentials vault | taisce.fly.dev/mcp |
| `eric` | Marketing intelligence | eric.foxxelabs.ie/mcp |
| `flyer` | Fly.io operations | fly-mcp-foxxelabs.fly.dev/mcp |
| `sentinel` | IP threat intelligence | sentinel-foxxelabs.fly.dev/mcp |
| `git-mcp` | Git operations | git-mcp-foxxelabs.fly.dev/mcp |
| `fiosru` | Async investigation tasks | fiosru-foxxelabs.fly.dev/mcp |
| `huggingface` | Model/space search | huggingface.co/mcp |
| `mermaid` | Diagram rendering | chatgpt.mermaid.ai/anthropic/mcp |

## Google Workspace connectors

Gmail, Calendar, and Drive connector URLs in the system context (e.g. `gmailmcp.googleapis.com/mcp/v1`) are claude.ai-internal endpoints and do not register cleanly via `claude mcp add`. Configure these through Claude Code's connector flow (`/connectors` or equivalent) when needed, not via this script.

## Scope

All servers registered with `--scope user` — available across every project on the machine. Per-project overrides (`.mcp.json` at project root) still take precedence per Claude Code's standard precedence rules.

## Maintenance

When a new MCP server comes online:

1. Add a `claude mcp add` line to `bootstrap-mcp.sh`
2. Add a row to the table above
3. Commit

This script is the canonical answer to "how do I get MCP working on a new node" — keep it accurate.
