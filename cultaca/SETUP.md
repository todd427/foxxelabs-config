# <span style="color:#7c3aed">Cúltaca — Setup Runbook</span>

Three-domain coding floor: local Iris for spec-bounded work and 529 windows, Anthropic primary for hard agentic problems, OpenAI as uncorrelated failover. Same harness, three independent failure domains.

## <span style="color:#2563eb">1. Install location</span>

```
~/.config/opencode/opencode.json     # global
./opencode.json                       # per-project override (deep-merged)
```

## <span style="color:#2563eb">2. Serve the local model on Iris</span>

```bash
vllm serve Qwen/Qwen3-Coder-30B-A3B-Instruct \
  --enable-auto-tool-choice \
  --tool-call-parser hermes \
  --served-model-name qwen3-coder \
  --port 8000
```

`--served-model-name qwen3-coder` makes `iris/qwen3-coder` resolve. Tool-call flags are mandatory — without them the agentic loop silently degrades to chat.

vLLM over Ollama deliberately: Ollama defaults `num_ctx` to 4096 regardless of advertised context, breaking tool calls mid-loop in ways that read as model stupidity. If Ollama is ever the fallback, bake a context: `/set parameter num_ctx 16384` then `/save qwen3-coder:16k`.

## <span style="color:#2563eb">3. Credentials</span>

```bash
export ANTHROPIC_API_KEY="sk-ant-..."     # API key, NOT Pro/Max OAuth
export OPENAI_API_KEY="sk-..."
```

Pull from Taisce; do not paste keys into shell history.

## <span style="color:#2563eb">4. Daily switching</span>

```bash
opencode                                  # launches on default (Anthropic Opus)
/models                                   # live picker, switch mid-session
opencode -m iris/qwen3-coder "..."        # force local
opencode -m openai/gpt-5.5 "..."          # force failover frontier
```

On 529s: `/models` → Iris for bulk, or OpenAI if frontier-class is needed and Anthropic is the one down.

## <span style="color:#2563eb">5. Automatic failover</span>

OpenCode base config is manual-switch only. For auto-reroute:

**Path A — gateway (easy, less sovereign).** Vercel AI Gateway provider `order`:

```json
"vercel": {
  "models": {
    "anthropic/claude-opus-4-8": { "options": { "order": ["anthropic", "vertex"] } }
  }
}
```

Frontier tier only. Do not route the local tier through it.

**Path B — local proxy (sovereign, more setup).** Olla-style OpenAI-compatible proxy on the fleet, health-checked least-connections over own vLLM endpoints, cloud as last-resort. Keeps the local tier on own infrastructure. The version that matches the sovereignty argument.

## <span style="color:#2563eb">6. Verify before relying on it</span>

- Live model IDs via `/models` (`claude-opus-4-8`, `gpt-5.5` drift).
- Qwen3-Coder variant that fits VRAM headroom on the 5090.
- `--tool-call-parser` value for the specific Qwen build pulled.

---

*Todd McCaffrey · 2026-06-24*
