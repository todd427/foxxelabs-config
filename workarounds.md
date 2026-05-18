# <span style="color:#a02020">FoxxeLabs — Active Workarounds</span>

Living log of code-level workarounds across the portfolio. Each entry exists to be deleted: when the upstream condition listed under **DELETE-WHEN** is met, the workaround should be removed and the entry struck through (kept for history, not erased).

Grep `DELETE-WHEN:` in the affected codebase to find the inline marker.

---

## <span style="color:#1e5a8a">Active</span>

### Mnemos — Chroma 1.5.2 boolean-predicate evaluator

**Added:** 2026-05-18
**Code:** `mnemos` master `349ef14` — `server/retrieval.py` `dense_query`
**Inline marker:** `DELETE-WHEN: Chroma upgraded past 1.5.2 (or migrated off Chroma)`
**Discovery brief:** `mnemos/docs/mnemos/cc_brief_chroma_workaround_as_built.md`
**Upstream bug report:** `mnemos/docs/mnemos/chroma_eq_false_bug_report.md` (drafted, not yet filed)

**What's broken upstream.** On the production 82k-chunk Mnemos collection, any Chroma `where` clause involving `is_fiction=False` (`$eq:False`, `$ne:True`, `$in:[False]`, `$nin:[True]`, `$in:[False,True]`) raises `InternalError('Error executing plan: Internal error: Error finding id')`. `$eq:True` works. Full-corpus scan ruled out heterogeneous metadata. Hypothesis: orphan ID in HNSW that the True-predicate's candidate set circumstantially avoids.

**What the workaround does.** For the `fiction` / `nonfiction` `TYPE_FILTERS` entries, `dense_query` strips the `is_fiction` predicate from the Chroma `where` clause, over-fetches candidates (`top_k × 8`, capped at 200), and post-filters in Python on returned metadata. Other extras (speaker, user_text_chars) remain in the where clause — they go through working code paths. FTS5 half of `hybrid_query` is unaffected.

**Cost.** ~1.14× per nonfiction query on average (88% nonfiction corpus → high post-filter pass rate). One info-level log line per invocation tagged `chroma-workaround` (visibility for "still firing?"). One WARN log line if post-filter result < top_k (signal that the multiplier needs to grow).

**Removal criteria.** Either: (a) upgrade Chroma past 1.5.2 and confirm the predicate matrix in the bug report passes against the live collection; or (b) migrate Mnemos off Chroma entirely (Qdrant evaluation is on the post-viva roadmap). After either, delete the `_CHROMA_WORKAROUND_*` constants, the `chroma_workaround` branch in `dense_query`, and this entry.

**Watch signal.** `fly logs --app mnemos | grep 'chroma-workaround under top_k'` — non-empty means the over-fetch multiplier needs tuning before removal is safe.

---

## <span style="color:#1e5a8a">Resolved (kept for history)</span>

*(none yet)*
