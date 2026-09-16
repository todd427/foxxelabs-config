# <span style="color:#1e40af">Directing AI — Empirical Grounding: The Session-Coding Study</span>

<span style="color:#7c2d12">**Status:**</span> Paper plan and instrument spec. First empirical paper of the *Directing AI* discipline; candidate first submission for the ATU research PhD.
<span style="color:#7c2d12">**Created:**</span> 2026-09-16
<span style="color:#7c2d12">**Position:**</span> Evidence base under *Orchestrated Cognition*. The extraction-and-coding tool becomes the week-one instrument for *Reading the Fuzz*.
<span style="color:#7c2d12">**Naming:**</span> No new project name. Filed under *Directing AI* per NAMING.md (2026-05-11). "Comhar" was considered and rejected on 2026-09-16 — collides with Comhoibrí in speech and would fragment the existing three-tier naming.

---

## <span style="color:#0f766e">Origin</span>

Todd asserted (2026-09-16) that his interactions with Claude are predominantly conversation and collaboration rather than the model "telling him the truth" — oracle use. A Mnemos probe could not answer this directly (no mode label on chunks; semantic retrieval is not a census), but neutral-query month-window samples produced a usable picture and two structural findings:

1. **Two corpus regimes.** Jan–Mar 2026 Claude material is raw exported transcript, dominated by build sessions (Anseo, SLAM bridge trainer, Mnemos ingest) — hundreds of chunks each, mostly pasted tracebacks and shell output. From April 2026 the raw export stops; everything Claude-sourced is Claude-authored end-of-session Markdown. The Aug 15–Sep 15 window returned 12 hits from ~10 sessions: PhD supervisor triage, PSI/BPS membership, the Onofrei/Carty meeting outcome, the low-humiliation-error hypothesis, the Tuiscint reflection, the trust-lecture act structure. Roughly 2 lookup, 0 pure build, 10 conversation/collaboration.
2. **Claude Code sessions are absent from Mnemos** unless a summary is filed, so the build work of Apr–Sep is largely invisible in the store. Any chat-only measurement flatters the "conversation" side.

Working conclusion: early 2026 was mostly building; mid-2026 onward the chat surface became the management layer of the relationship (deciding what Claude Code does); oracle use was never the dominant mode in either regime. This document specifies how to turn that impression into a measurement.

Mnemos bug found in passing: `user_text_min` / `user_text_max` on `query_memory` are ignored server-side (a 400-char cap returned full tracebacks). Filed for the Mnemos backlog; not a blocker here because the study runs on raw exports, not on Mnemos.

## <span style="color:#0f766e">Working title</span>

*Build, Think, Ask: Three years of one human–AI working relationship, coded session by session.*

## <span style="color:#0f766e">Claim</span>

Interaction mode with a general-purpose LLM is not fixed by the tool; it drifts with the user's tooling and expertise. In one longitudinal case (2023–2026, three assistants), building gave way to thinking as agentic tooling absorbed the build work, and user corrections of the model concentrated in the thinking mode. Contributions: a four-mode session coding scheme, an open classifier, a per-session feature table, and the first per-session link between interaction mode and a runtime fabrication-risk gauge (Tomhas).

## <span style="color:#0f766e">Research questions</span>

1. How does the distribution of build / think / lookup / admin sessions change over three years, and what events explain the breakpoints?
2. Where do user corrections of the model occur, by mode?
3. Does the Tomhas context-risk score differ by mode, and does risk predict errors later corrected in the record?
4. What proportion of sessions produce an artefact, a decision, or a fact?

## <span style="color:#0f766e">Mapping to Orchestrated Cognition</span>

The study operationalises the framework. Each layer of the practice corresponds to one course and one measurable.

| Layer | What the practitioner does | Course | Measurable in this study |
|---|---|---|---|
| **Measure** | Export own history; obtain own mode split and correction rate | *Reading the Fuzz* | Mode distribution; correction rate (RQ1, RQ2) |
| **Scaffold** | Verify-before-assert with inference/verified flag; externalised memory (Mnemos); consulted risk gauge (Tomhas); handoff briefs separating deciding from doing; side-by-side comparison (Beirt) | *Orchestrating Under Fuzz* | Tomhas band by mode; risk vs later-corrected error (RQ3) |
| **Register** | Earned peer mode: push back, be pushed back on, delegate build and review it; coworkers (Comhoibrí) | *Orchestrating at Scale* | Output type by mode; build-to-think shift as agentic tooling arrives (RQ1, RQ4) |

*Borrowed Authority* made measurable: oracle use with a correction rate near zero is the anti-pattern in its resting state. The framework's falsification test is that adopting the Scaffold layer must move a practitioner's correction rate off zero within a month; if it does not, the framework has failed for that person.

Ordering is part of the framework, not decoration: Register is a graduation criterion reached when Measure shows corrections appearing, never a starting stance. The gate is what makes the practice safe to teach to people without a fifty-year expertise floor.

## <span style="color:#0f766e">Data</span>

- ChatGPT export, 2023–2025 (baseline, pre-Directing-AI practice).
- claude.ai export (`conversations.json`), 2025–2026.
- Claude Code logs (`~/.claude/projects/*.jsonl`) on Daisy and Rose, 2026. Never ingested to Mnemos; must be read from disk.
- Tomhas session rollups (`history`, `patterns`) for 2026 chat-plane sessions.
- Ground truth, all timestamped: repositories under todd427, deployed services (Fly.io, Cloudflare Pages), the MSc dissertation and viva (2026-06-19), published articles on foxxelabs.ie.

Unit of analysis is the session. Chunks are never counted — chunk counts are dominated by paste volume in long build sessions.

## <span style="color:#0f766e">Coding scheme</span>

Four modes, defined by what leaves the session, plus a mixed tag.

| Mode | Definition | Terminal event |
|---|---|---|
| **build** | An artefact leaves: code, config, document, deployment | commit, file written, brief handed to CC |
| **think** | A position or decision leaves | stated decision, revised plan, held hypothesis |
| **lookup** | A fact leaves; user asks, assistant answers, no revision | answer accepted without follow-up |
| **admin** | Housekeeping: ingests, resets, tool checks, memory writes | none of the above |
| **mixed** | Two modes with neither above 60% of turns | tagged with both, primary first |

## <span style="color:#0f766e">Features per session</span>

- User/assistant word ratio.
- Fraction of user turns that are authored prose vs pasted output (shell prompts, tracebacks, JSON, logs, diff headers).
- Question direction: count of question marks in user turns vs assistant turns.
- Assistant code-block density (fenced blocks per assistant turn).
- Correction events in user turns: leading "no", "wrong", "actually", "that's not", "please" used as rebuke, explicit restatement after an assistant claim.
- Terminal event class: commit / brief / decision / answer / none.
- Session length in turns and in authored user words.
- Source and surface: chatgpt / claude-chat / claude-code.
- Tomhas peak score and band where available.

## <span style="color:#0f766e">Method</span>

1. **Extraction.** One script (`extract_sessions.py`) reads all three export formats into a common session record: `session_id, source, surface, started_at, turns[], features{}`. Claude Code JSONL requires its own parser (tool-use blocks are neither user nor assistant prose and are excluded from word counts).
2. **Hand coding.** 60 sessions, stratified by year and source, coded by Todd against the scheme above. A second coder (candidate: Anthony Carty; fallback: a supervisor) codes 30 of the 60; Cohen's kappa reported.
3. **Heuristic labeller.** Rules fitted on the 60 to label the clear band (target: ≥85% of sessions with kappa ≥0.8 against hand codes).
4. **Model labeller.** Ambiguous band sent to a local model (Qwen3-8B on Iris) with the same rubric as a prompt; agreement with hand codes reported on the overlap.
5. **Join.** Tomhas rollups joined on session start time for 2026 chat sessions.
6. **Analysis.** Monthly mode distribution with breakpoints; correction rate per mode with bootstrap CIs; Tomhas band by mode; output type by mode.

## <span style="color:#0f766e">Planned figures</span>

1. Stacked monthly mode distribution, 2023–2026, breakpoints annotated: Django learning (May 2025), Mnemos live (Mar 2026), Claude Code adoption (spring 2026), PhD planning (Aug 2026).
2. Correction rate per mode with confidence intervals.
3. Tomhas band vs mode; band vs errors later corrected in the record.
4. Output type (artefact / decision / fact) by mode.

## <span style="color:#0f766e">Discussion points to carry</span>

- The chat surface became the management layer once agentic tooling took the build work; the record of a relationship moves up a level as the tools change.
- Corrections are the operational signature of collaboration versus oracle use. Ties directly to the held Paper 5 hypothesis (2026-09-14): AI as a low-humiliation error environment.
- The expertise-floor confound, stated plainly: the correction rate is high because the user can catch the model. The paper describes one relationship and does not prescribe a register. What generalises is the Scaffold layer, not the tone.
- Limits: N=1; self-coded by a participant, mitigated by the second coder; summary-era chat data is model-authored and filtered toward decisions; Claude Code sessions lack Tomhas coverage.

## <span style="color:#0f766e">Release</span>

Classifier, rubric, extraction script and per-session feature/label table under Apache-2.0 in a public repo. No transcripts: Todd's prose and IP, and named third parties, stay home. Named individuals pseudonymised in the released table.

## <span style="color:#0f766e">Ethics</span>

ATU ethics approval required even as self-study, because the record contains third parties. Todd is author and subject and says so in the paper.

## <span style="color:#0f766e">Venue</span>

Method note: CSCW or CHI late-breaking work. Full paper: *Computers in Human Behavior: Artificial Humans* or *Cyberpsychology, Behavior, and Social Networking*; HHAI for the human–AI-teaming audience. Scope and deadlines not yet verified — verify before committing.

## <span style="color:#0f766e">Timeline</span>

- Extraction script and hand coding: two weekends.
- Second-coder pass and agreement: one week, in parallel with the ethics application.
- Figures and first draft: two weeks after coding closes.
- Submission-ready inside six weeks if ethics turnaround cooperates.

## <span style="color:#0f766e">Next actions</span>

1. CC brief for `extract_sessions.py` covering all three export formats and the feature set above.
2. Ethics application to ATU, self-study with third-party mentions.
3. Ask Anthony Carty whether he will act as second coder.
4. Verify venue scope and deadlines.
5. Add *Directing AI* to `projects.json` (done 2026-09-16 alongside this document).

## <span style="color:#0f766e">Provenance</span>

Conversation with Claude, 2026-09-16, starting from a Mnemos census question. Mnemos probes, foxxelabs-config check (Comhoibrí PRD, NAMING.md, projects.json), outline and framework mapping all in that session. Full transcript ingested to Mnemos at session end.

---

*FoxxeLabs Limited · 2026-09-16*
