#!/usr/bin/env bash
set -euo pipefail

# FoxxeLabs MCP server registration for Claude Code.
# Run once on a fresh node after: npm install -g @anthropic-ai/claude-code
# Idempotent: re-running reports "already exists" for existing entries.

SCOPE="--scope user"
TRANSPORT="--transport http"

# FoxxeLabs MCP servers
claude mcp add $TRANSPORT $SCOPE mnemos      https://mnemos.foxxelabs.ie/mcp
claude mcp add $TRANSPORT $SCOPE rialu       https://rialu.ie/mcp
claude mcp add $TRANSPORT $SCOPE taisce      https://taisce.fly.dev/mcp
claude mcp add $TRANSPORT $SCOPE eric        https://eric.foxxelabs.ie/mcp
claude mcp add $TRANSPORT $SCOPE flyer       https://fly-mcp-foxxelabs.fly.dev/mcp
claude mcp add $TRANSPORT $SCOPE sentinel    https://sentinel-foxxelabs.fly.dev/mcp
claude mcp add $TRANSPORT $SCOPE git-mcp     https://git-mcp-foxxelabs.fly.dev/mcp
claude mcp add $TRANSPORT $SCOPE fiosru      https://fiosru-foxxelabs.fly.dev/mcp

# Third-party MCP servers
claude mcp add $TRANSPORT $SCOPE huggingface https://huggingface.co/mcp
claude mcp add $TRANSPORT $SCOPE mermaid     https://chatgpt.mermaid.ai/anthropic/mcp

claude mcp list
