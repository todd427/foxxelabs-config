# <span style="color:#268bd2">Gréasán — CC Brief 0001 · One Safe Door to the Web</span>

**Repo:** todd427/greasan (to be created, public) · **Package:** `greasan` on PyPI · **Status:** ready
**Date:** 2026-09-23 · **Relation:** new package. Consumers: Tuiscint (first, source of the code), Gléas (Gléas CC-BRIEF-004), Cuardach (foxxelabs-config/cuardach/BRIEF-0001.md). This brief lives in foxxelabs-config until the repo exists; move it to `docs/BRIEF-0001.md` in the new repo as the first commit.

*Gréasán* (/ˈɟɾʲeːsˠaːnˠ/, "GRAY-sawn") is Irish for *web*.

## <span style="color:#268bd2">0. Why this exists</span>

The fleet has two copies of the same web search + fetch code, and they have
already drifted apart in the direction that matters:

- <span style="color:#2aa198">`tuiscint/src/tuiscint/serve/webfetch.py`</span> — the hardened copy.
  Its docstring records five deliberate departures from the original, plus the
  multicast/reserved check and `safesearch="on"` added after the 2026-09-11
  incident.
- <span style="color:#2aa198">`gleas/gleas/tools.py`</span> — the original. It still follows redirects
  and checks the address only afterwards, never pins the resolved IP, reads the
  body before capping it, allows any port, skips the multicast test, and runs
  `ddgs` at default safesearch. Gléas's own docstring notes `:8080` has no
  app-layer auth by default.

A third consumer is coming (Cuardach, the shared search server for Versus). A
third copy would drift the way the second did. The security logic gets one
home, one test suite, and a version number.

## <span style="color:#268bd2">1. Scope</span>

<span style="color:#2aa198">In:</span> the SSRF-guarded page fetch, HTML text extraction, the
swappable search seam with a DuckDuckGo backend, and the caches (TTL, disk,
single-flight) — all moved from Tuiscint, not rewritten.

<span style="color:#2aa198">Out:</span> chunking, embedding and ranking (`web_retriever.py`) stay
in Tuiscint — they exist to feed a small reader text in its trained shape, and
no other consumer wants that. No MCP code: Cuardach wraps this package, the
package never imports an MCP SDK. No paid search backends in 0.1; the seam is
where one lands later.

## <span style="color:#268bd2">2. Layout</span>

```
greasan/
  pyproject.toml
  LICENSE                  # Apache-2.0, matching Cuimhin
  README.md
  src/greasan/
    __init__.py            # __version__, FetchError, fetch_text, search re-exported
    fetch.py               # from webfetch.py: resolve_public, check_url, _pinned_url, extract, fetch_text
    search.py              # from webfetch.py: search(), ddg() backend factory
    cache.py               # from serve/cache.py: key_of, norm_query, TTLCache, DiskCache, SingleFlight
    aio.py                 # async wrappers over fetch_text and search
  tests/
    test_fetch.py          # from tuiscint tests/test_webfetch.py
    test_search.py         # search tests split out of test_webfetch.py
    test_cache.py          # from tuiscint tests/test_cache.py
    test_aio.py            # new
```

## <span style="color:#268bd2">3. API — what changes on the way out of Tuiscint</span>

Move the code verbatim, docstrings included (they are the security record),
then make exactly these changes:

<span style="color:#2aa198">`fetch.fetch_text(url, *, user_agent, max_bytes=2_000_000, timeout=8.0, max_redirects=3, client=None) -> tuple[str, str]`</span>

- `user_agent` becomes a **required keyword**, no default. Tuiscint's
  `USER_AGENT` names tuiscint.uk; a library default would make Gléas and
  Cuardach introduce themselves as Tuiscint. Each consumer states who it is.
- `max_redirects` becomes a parameter (Tuiscint's module constant was 3).
- Return shape unchanged: `(final_url, readable_text)`. Tuiscint's
  `web_retriever.py` unpacks it as a tuple today.
- `ALLOWED_PORTS`, `ALLOWED_TYPES`, `_STRIP` stay module constants. They are
  policy, not tuning; a consumer that wants port 8443 should have to fork the
  argument, not pass a flag.

<span style="color:#2aa198">`search.search(query, max_results=5, *, backend=None, hard_cap=8) -> list[dict]`</span>

- `hard_cap` becomes a parameter. Tuiscint's cap is 8, Gléas's is 10; each
  passes its own.
- `backend=None` means `ddg()`. Result shape unchanged: `[{title, href, body}]`
  — the `ddgs` shape, which `web_retriever.py` reads `href` from.
- New: `ddg(safesearch="on")` returns a backend callable. `"on"` is the default
  and the only value any fleet consumer passes; the 2026-09-11 comment in
  Tuiscint's `search()` explains why, and moves with the code.
- `ddgs` stays a lazy import. If it is not installed, raise
  `FetchError("search backend not installed: pip install 'greasan[ddg]'")`
  rather than an `ImportError` from deep inside a request.

<span style="color:#2aa198">`cache` — moved unchanged.</span> `key_of`, `norm_query`, `TTLCache`,
`DiskCache`, `SingleFlight`. Pure stdlib; no API change.

<span style="color:#2aa198">`aio` — new, thin.</span>

```python
async def fetch_text(url, **kw):  return await asyncio.to_thread(_fetch.fetch_text, url, **kw)
async def search(query, max_results=5, **kw):  return await asyncio.to_thread(_search.search, query, max_results, **kw)
```

One synchronous implementation, async by delegation. Two implementations of an
SSRF guard is how the Gléas and Tuiscint copies came apart; the thread hop
costs nothing at this volume.

## <span style="color:#268bd2">4. Dependencies and packaging</span>

```toml
[project]
name = "greasan"
version = "0.1.0"
description = "SSRF-guarded web fetch and swappable web search for Python services."
requires-python = ">=3.12"          # Tuiscint's floor; the first consumer sets it
license = "Apache-2.0"
dependencies = ["httpx", "lxml"]

[project.optional-dependencies]
ddg = ["ddgs"]
dev = ["pytest", "ruff"]
```

Lower bounds for `httpx`, `lxml` and `ddgs`: take the versions currently
installed where Tuiscint serves (`pip show httpx lxml ddgs` on Daisy) and pin
`>=` those. Those are the versions the SSRF tests have actually passed against.

Publish to PyPI with the scoped `pypi` profile in `load_keys.sh`, the route
foxxe-mcp uses. The name `greasan` returned 404 from
`https://pypi.org/pypi/greasan/json` on 2026-09-23 — free. Re-check immediately
before the first upload.

## <span style="color:#268bd2">5. Tuiscint switch-over (same piece of work)</span>

The package is not done until its source repo runs on it.

1. `pyproject.toml`: add an extra `web = ["greasan[ddg]~=0.1"]`. Tuiscint
   today declares none of `httpx`, `lxml`, `ddgs` — they are lazily imported
   and installed by hand on the serving box. The extra makes that explicit.
2. `serve/web_retriever.py`: `from . import webfetch` →
   `from greasan import fetch as webfetch_fetch, search as webfetch_search` (or
   equivalent), passing `user_agent=USER_AGENT` where `USER_AGENT` stays
   Tuiscint's own string, `"tuiscint.uk/0.1 (+https://tuiscint.uk; grounded-reader demo)"`.
   `webfetch.FetchError` → `greasan.FetchError`.
3. `serve/cache.py`: keep the module path so nothing else in Tuiscint moves;
   its body becomes `from greasan.cache import *` plus `__all__`.
4. Delete `serve/webfetch.py`. Move `tests/test_webfetch.py` and
   `tests/test_cache.py` to greasan; `tests/test_web_retriever.py` stays and
   must pass unchanged.

## <span style="color:#268bd2">6. Tests that must move with the code</span>

Every SSRF case in `test_webfetch.py` moves, none are dropped:
per-hop redirect verification, DNS-rebind pinning, streaming byte cap, port
allowlist, IPv4-mapped IPv6 normalisation, multicast, reserved, CGNAT
(100.64.0.0/10 — the Tailscale case), and ULA. Add one new case for ULA
explicitly: Fly's private 6PN network is IPv6 ULA, and Cuardach will run on Fly.

New tests: `test_aio.py` (wrappers return what the sync functions return and
propagate `FetchError`); `ddg()` raising the install hint when `ddgs` is absent;
`fetch_text` refusing a call without `user_agent`.

## <span style="color:#268bd2">7. Acceptance</span>

- `pytest` green in greasan with no network (the injectable `client` and
  `backend` seams already make that possible).
- Tuiscint's full suite green on greasan; the public reader on Daisy answers a
  live question with web retrieval after redeploy.
- `pip install greasan` in a clean venv imports without `ddgs`; `search()` then
  fails with the install hint, not an `ImportError`.
- 0.1.0 on PyPI; Rialú project registered with the repo URL.
