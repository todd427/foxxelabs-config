# <span style="color:#2E75B6">Product Note</span>
## <span style="color:#2E75B6">[NAME TBD] — research-and-continuity tool for long-form writers</span>

<span style="color:#777777">FoxxeLabs Limited · v0.1 · 2026-04-26 · Owner: Todd Johnson McCaffrey · Status: parked until post-viva (≥ July 2026)</span>

<span style="color:#777777">Repo target on creation: `todd427/foxxelabs-config/products/<slug>/NOTE.md`</span>

---

## <span style="color:#2E75B6">1. The slot</span>

The FoxxeLabs stack currently covers preparation for one's own death (Someday), post-mortem identity continuation (AfterWords), and the architectural and personal-corpus layers underneath (Mnemos, Macalla). It does not cover **the alive-and-working layer** — a tool an outside user pays for, uses every day, and gets ongoing utility from. This product fills that slot.

## <span style="color:#2E75B6">2. The user</span>

Long-form writers with substantial accumulated corpora. Novelists with multi-book series, screenwriters with character bibles, RPG game-masters with world-building wikis, academics writing books, journalists with archive-heavy beats. Modal user has 5–50 finished works plus drafts, research notes, and correspondence accumulated across decades. Modal user is technically literate enough to install software but is not a developer. AI-hostile by default; the marketing must not lead with AI framing.

## <span style="color:#2E75B6">3. The pain</span>

*"Have I already written about this?"* and *"What did I say about X?"* across an entire body of work. Existing tools fail this badly. Scrivener's search is keyword-only and project-bounded. Word and Final Draft search the open document. Notion is structured for product specs. Obsidian works for some but requires the writer to also be a knowledge-management hobbyist. None index across an author's whole corpus, none surface forgotten paragraphs from eight years ago, none catch continuity errors before the editor does.

## <span style="color:#2E75B6">4. The product</span>

A local-first personal RAG with writer-tuned ingestion (Scrivener projects, Word, Markdown, Final Draft, Fountain, Substack archives, Drive folders), search and chat-with-corpus surfaces, and continuity-check tooling (named-entity tracking across drafts, e.g. eye colour assigned to character X in book 7). All processing local. The corpus rule travels: *your work stays on your machine, never sent to any AI training set.* Pricing band: €10–20/month subscription, OR €99–199 one-time-license model for the macOS / Windows installer; subscription likely correct because value compounds with corpus size and the engine improvements continue. [TODD: pricing decision deferred — collect three writer interviews before deciding.]

## <span style="color:#2E75B6">5. Relationship to the stack</span>

- **Mnemos** is the engine. This product is a different surface on the same retrieval, chunking, embedding, and storage layers. Validates Mnemos in production with paying users.
- **Macalla** is voice generation; this product is voice *retrieval*. They share corpus assumptions but not function. Macalla is the long-horizon vehicle; this is the near-horizon revenue tool.
- **Someday** (pre-mortem private vault) — independent quadrant; no overlap.
- **AfterWords** (post-mortem avatar) — independent quadrant; no overlap.
- **Stór** — separate channel; this product sells through the same direct-commerce infrastructure once Stór's payment plumbing is live.
- **Anseo** — eventually, a community for users of this tool sits inside Anseo; not in MVP.

## <span style="color:#2E75B6">6. Differentiation from competitors</span>

Khoj, Reor, Personal AI, Rewind, Apple Intelligence, Hoarder, NotebookLM all attempt versions of personal RAG. None ship with: (a) writer-specific ingestion plumbing; (b) the corpus rule defaulted on; (c) authority of a 70+-novel author as the operator and exemplar; (d) the FoxxeLabs sovereignty positioning visible in form (local execution, no cloud upload). The combined moat is small individually and substantial collectively.

## <span style="color:#2E75B6">7. Distribution</span>

- Foxxe Frey newsletter list — warm audience, near-zero CAC.
- writing.foxxelabs.ie — a long-form essay describing how Todd uses Mnemos across his own back-catalogue is its own sales surface.
- SF/F conventions and writers' conferences — live-demo circuit.
- Word of mouth among writers, who form unusually tight referral networks.
- No paid acquisition at MVP stage.

## <span style="color:#2E75B6">8. Support model</span>

Async only. Email + a public docs site. Modal ticket is OAuth or import-from-Scrivener. Tractable, fixable in a sentence, no 24/7 component, no emotional-support burden. Supportable by a one-person operation augmented by Claude Code. Hard rule: no live chat, no phone, no SLAs. If users want hand-holding they can hire a consultant.

## <span style="color:#2E75B6">9. MVP scope</span>

If built, the MVP is:
- macOS installer (single platform first; Windows and Linux follow)
- Ingestion adapters: Scrivener, Markdown / plain text, Word .docx, plain Drive folder, Substack export
- Local Chroma + sentence-transformer embedding
- Search UI + simple chat-with-corpus UI
- Per-corpus filters by date, source, project
- Export to Markdown of any retrieval result

Out of scope for MVP: the continuity-checker (named-entity tracking, character bible diffs), Final Draft / Fountain support, Word / Pages plugins, voice transcription, mobile.

Build target if green-lit: 2–3 months from start. Not before July 2026.

## <span style="color:#2E75B6">10. Gate</span>

This note is parked. **Do not start building.** Do not name it. Do not add it to the project ecosystem map. Revisit on the first Monday after the viva. Specifically check at that point:
1. Is the slot still empty in the FoxxeLabs stack?
2. Has anyone shipped a writer-targeted version of this in the intervening months?
3. Are three writers prepared to be paid alpha users?
4. Does Todd still want to do consumer support, even of the async kind?

If three of four are yes, build the MVP. If fewer, leave the note in place and revisit at six-month intervals.

## <span style="color:#2E75B6">11. Naming</span>

Deferred. Irish-language register consistent with the rest of the FoxxeLabs stack. Candidates Claude offered in passing: *Léar*, *Foinse*, *Eochair*. Todd to pick when build is green-lit, not before. Naming before building is a known time-sink and a known way to commit prematurely.

---

<span style="color:#777777">End of note. No further action required until July 2026.</span>
