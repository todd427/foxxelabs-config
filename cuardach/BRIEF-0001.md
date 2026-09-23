# <span style="color:#268bd2">Cuardach — CC Brief 0001 · One Search, Both Panes</span>

**Repo:** todd427/cuardach (to be created, private) · **Target:** Fly app `cuardach-foxxelabs`, region `ams`, `https://cuardach.foxxelabs.ie/mcp` · **Status:** ready
**Date:** 2026-09-23 · **Relation:** depends on Gréasán 0.1 (foxxelabs-config/greasan/BRIEF-0001.md) and foxxe-mcp. Consumed by Versus (Beirt BRIEF-0004, Shared search mode) and Féirín (BRIEF-0003, voucher search). Move this file to `docs/BRIEF-0001.md` in the new repo as its first commit.

*Cuardach* is Irish for *search*.

## <span style="color:#268bd2">0. Why this exists</span>

Versus puts a Claude model and a GPT model side by side. With each provider's
hosted search switched on, the two panes search different indexes through
different tools, so a difference in the answers is partly a difference in
search backends. Web search is the feature Versus is judged on, so that
confound has to be removable.

Cuardach is one MCP server with two tools. Both providers can call a remote MCP
server: Anthropic through the Messages API MCP connector (Beirt already does),
OpenAI through the Responses API `mcp` tool. Point both panes at Cuardach and
they search the same backend and read byte-identical pages. What differs is
what each model does with them.

It also gives Féirín vouchers web search for the first time. Hosted search
bills per search on top of tokens; DuckDuckGo through Gréasán costs nothing per
query.

## <span style="color:#268bd2">1. Tools</span>

Two tools, neutral descriptions, no behavioural instructions. The descriptions
are part of what both models see; a directive (Gléas's "these are SNIPPETS,
not an answer" line is right for an 8B, and wrong here) would be Cuardach
coaching the contestants.

```python
@mcp.tool()
async def search(query: str, max_results: int = 5) -> str:
    """Search the public web. Returns up to max_results results (1 to 8),
    each with a title, a URL and a short snippet."""

@mcp.tool()
async def fetch(url: str, max_chars: int = 8000) -> str:
    """Fetch one public web page and return its readable text. max_chars is
    clamped to 1000-20000."""
```

<span style="color:#2aa198">search output</span> — plain text, numbered, one block per result:

```
1. <title>
   <url>
   <snippet>

2. ...
```

No results: `No results for "<query>".` Backend failure (a `greasan.FetchError`
from search, which is what a DuckDuckGo CAPTCHA surfaces as): raise, so the MCP
result carries `isError` and both models see the same failure text:
`Search is unavailable right now (<reason>).`

<span style="color:#2aa198">fetch output</span>:

```
URL: <final url after redirects>

<readable text, cut at max_chars>

[truncated at <max_chars> characters]      ← only when it was
```

A fetch refusal (non-public address, bad port, unsupported content type, dead
link) raises with Gréasán's own message, which is written to be safe to show.

<span style="color:#2aa198">Limits</span>: `max_results` clamped 1..8 via Gréasán's `hard_cap=8`;
`max_chars` clamped 1000..20000, default 8000 (about 2k tokens). The default
matters to Féirín: fetched text is *input* tokens, which `max_tokens` does not
bound, so this is the dial that bounds what a searching voucher costs.

## <span style="color:#268bd2">2. Identical bytes for both panes</span>

Both panes of a comparison fire at once, and usually search similar queries and
open the same top result within a second of each other. Without coordination
both miss the cache and fetch separately, and a page that changed between the
two fetches (a live score, a rotating headline) puts the confound straight back.

- <span style="color:#2aa198">Page cache:</span> `greasan.cache.TTLCache(maxsize=512, ttl=1800)`, keyed
  `key_of("page", url)`, storing the *full* `(final_url, text)`. Truncation to
  `max_chars` is applied after the cache, so two panes asking for different
  lengths still read the same page.
- <span style="color:#2aa198">Single-flight:</span> `greasan.cache.SingleFlight` around both fetch
  and search, so two simultaneous requests for one URL make one network fetch
  and both get its result. Call `flight.do(key, fn, lookup)` inside
  `asyncio.to_thread` — `SingleFlight` is thread-based.
- <span style="color:#2aa198">Search cache:</span> `TTLCache(maxsize=2048, ttl=6*3600)`, keyed
  `key_of("search", norm_query(q), n)` — Tuiscint's settings, for Tuiscint's
  reason: repeated queries must not re-scrape DuckDuckGo.
- <span style="color:#2aa198">Negative cache:</span> a failed fetch is cached for 900 s with its
  error, as Tuiscint's `_fetch_cached` does, so a dead link is not refetched by
  every pane that finds it.

In-process caches mean one machine: `min_machines_running = 1`,
`auto_stop_machines = "off"`, same as Féirín and for the same reason — a
second machine would quietly break the identical-bytes guarantee.

## <span style="color:#268bd2">3. Protecting the backend</span>

DuckDuckGo via `ddgs` is a scraper; Gréasán's and Tuiscint's docstrings both
name CAPTCHAs under burst traffic as the likeliest failure. Cuardach adds a
global budget in front of it:

- 30 uncached searches per rolling 60 s, process-wide. Over budget: raise
  `Search is rate-limited; try again in a minute.` Cache hits do not count.
- Fetches are not rate-limited beyond Gréasán's own timeout and byte cap; they
  hit arbitrary sites, not one backend.

If CAPTCHAs become routine, the remedy is a paid backend behind
`greasan.search`'s `backend=` seam — a Cuardach config change, not a rewrite.

## <span style="color:#268bd2">4. Security</span>

- <span style="color:#2aa198">SSRF:</span> all fetching goes through `greasan.fetch_text`. On Fly the
  thing worth protecting is the private 6PN network (IPv6 ULA, not global) and
  every other fleet app on it; Gréasán's `not is_global` test refuses it, and
  Gréasán BRIEF-0001 §6 adds an explicit ULA test for this deployment.
- <span style="color:#2aa198">Auth:</span> static bearer tokens via foxxe-mcp's `MCP_BEARER_TOKENS`
  (comma-separated; presence enables auth). Both clients send a fixed bearer:
  Anthropic's connector as `authorization_token`, OpenAI's `mcp` tool as
  `headers.Authorization`. Two tokens, minted with Taisce `generate_key` so
  neither is ever printed: `cuardach-todd` (Todd's own Versus and Beirt use)
  and `cuardach-feirin` (Féirín's proxy). Separate so either can be rotated
  without breaking the other.
- <span style="color:#2aa198">Privacy:</span> queries and URLs are user content. Log tool name,
  latency, cache hit/miss and outcome — never the query text or the URL. This
  keeps Féirín's published promise ("not your prompts") true one hop further.
- <span style="color:#2aa198">User agent:</span> `cuardach/0.1 (+https://foxxelabs.ie)`, passed to
  Gréasán's required `user_agent`.

## <span style="color:#268bd2">5. Build</span>

```
cuardach/
  pyproject.toml     # foxxe-mcp~=0.5.3, greasan[ddg]~=0.1 — never mcp or fastmcp directly
  server.py          # MCPServer("cuardach"), the two tools, caches, budget; serve(mcp)
  Dockerfile
  fly.toml           # app cuardach-foxxelabs, primary_region ams, internal_port 8080,
                     # min_machines_running 1, auto_stop_machines off, check GET /health
  tests/test_server.py
```

Shape 1 in foxxe-mcp's README ("the MCP app *is* the app"): `serve(mcp)`
supplies transport, `/health`, `/version`, logging and shutdown. Environment:
`ALLOWED_HOST=cuardach.foxxelabs.ie`, `MCP_BEARER_TOKENS` from Taisce via
`flyer secrets_set_from_taisce`. Custom domain via Fly certs on
`cuardach.foxxelabs.ie` (a first-level subdomain — covered by Cloudflare's
Universal SSL if proxied, and by Fly's own certificate otherwise).

Add `cuardach = "cuardach-foxxelabs"` to foxxe-mcp's `fleet.toml` so
`foxxe-herd status` sees it, and register it in Rialú.

## <span style="color:#268bd2">6. Tests</span>

No network in the suite: inject Gréasán's `backend=` and a fake fetch.

- Two concurrent `fetch` calls for one URL make exactly one upstream fetch and
  return identical text.
- Two `fetch` calls with different `max_chars` read the same cached page.
- The 31st uncached search inside 60 s raises the rate-limit error; a cached
  repeat does not count.
- A failed fetch is served from the negative cache on the second call.
- `max_results` 0 and 50 clamp to 1 and 8; `max_chars` 10 and 99999 clamp to
  1000 and 20000.
- No log line contains the query string or the URL (capture the log and grep).
- Unauthenticated `/mcp` request is refused when `MCP_BEARER_TOKENS` is set.

## <span style="color:#268bd2">7. Acceptance</span>

The rule from the foxxe-mcp migration: a server is not verified until an
**authenticated** tool call succeeds — `/health` stays green on a broken MCP
path.

1. Beirt (BYOK, Claude pane) with Cuardach added in Settings → MCP, allow-list
   `search, fetch`: a current-events question produces `search` then `fetch`
   tool chips and a sourced answer.
2. The same from a raw Responses API call with a GPT model and
   `{"type": "mcp", "server_label": "cuardach", "server_url": "https://cuardach.foxxelabs.ie/mcp", "headers": {"Authorization": "Bearer …"}, "allowed_tools": ["search", "fetch"], "require_approval": "never"}`.
3. Both at once on one question: the server log shows the shared URL fetched
   once and served twice.
