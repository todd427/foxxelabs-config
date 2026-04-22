# <span style="color:#1e40af">Comhoibrí — Coworker Substrate (PRD v0.1)</span>

<span style="color:#7c2d12">**Status:**</span> Spec. Build Phase 0 post-viva (June 2026+) — first post-viva build; all coworker roles depend on it.
<span style="color:#7c2d12">**Created:**</span> 2026-04-22
<span style="color:#7c2d12">**Name:**</span> Comhoibrí (Irish: collaborator, co-worker — literal match for the role)
<span style="color:#7c2d12">**Position:**</span> Foundation library for five coworker roles. Private-tier services; Féith mesh only.

---

## <span style="color:#0f766e">One-line framing</span>

A ~300-line Python library and SQLite substrate that turns the existing FoxxeLabs MCP tool servers from *tools Todd invokes* into *coworkers that own domains, maintain queues, write daily standups, and hand work to each other* — with Todd as principal reading the morning standups and granting or denying queued items.

## <span style="color:#0f766e">Non-obvious architectural insight</span>

The existing MCP stack (Eric, Flyer, git-mcp, Sentinel, Mnemos, Rialú, Taisce) provides *capabilities*. It does not provide *agency*. An MCP tool waits to be called; a coworker runs on its own schedule, observes its domain, and proposes work. The gap between "Claude orchestrates MCP tools when prompted" and "five coworkers own five domains and produce morning standups" is not more tools. It is four primitives: persistent queue, self-direction, reporting cadence, inter-coworker handoff. Comhoibrí is exactly those four primitives.

This is also why building yet another multi-agent framework (CrewAI, AutoGen, LangGraph) is the wrong move. Those are built for autonomous orchestration with human out of loop. Todd wants human-on-top-of-loop: coworkers propose, Todd disposes. ~300 lines of Python and SQLite is the right complexity level. Reaching for orchestration middleware means drifting into building a startup product instead of a personal coworker stack.

## <span style="color:#0f766e">Position in stack</span>

| Layer | Role |
|---|---|
| **Existing MCP servers** | Capability layer — what coworkers can *do* |
| **Comhoibrí** | Agency layer — queue, self-direction, standup, handoff |
| **Concrete coworkers** | Builder / Operator / Margú (Eric) / Díol / Scheduler — each subclasses Comhoibrí, wraps a subset of MCP tools, owns a domain |
| **Breith** | Decision log — each grant/deny creates a Breith decision record |
| **Todd** | Principal — reads standups, grants/denies queue items, handles escalations |

Comhoibrí is *below* Breith in dependency order (coworkers can run without Breith logging), but Breith is *above* Comhoibrí in value (decisions without outcome tracking are expensive automation).

## <span style="color:#0f766e">Four primitives</span>

### <span style="color:#0f766e">1. Persistent queue</span>

Each coworker owns a SQLite database (`/home/Projects/comhoibri/data/<role>.db`) with a `tasks` table. Tasks persist across sessions; coworker reads its own queue at the start of every tick.

### <span style="color:#0f766e">2. Self-direction</span>

A coworker has authority to add tasks to its own queue based on observation of its domain. Builder sees a failing test, files it. Operator sees Fly.io memory creep, queues a restart. This authority is **bounded**: the coworker can *add* tasks, but execution of non-trivial tasks requires Todd's grant. The bound is what keeps coworkers from drifting into autonomy.

### <span style="color:#0f766e">3. Reporting cadence</span>

Every coworker writes a daily standup markdown file to `/home/Projects/standups/<role>/<YYYY-MM-DD>.md`. Standup format is fixed (see below). Todd reads all standups in the morning; the coworker standup is the async interface between Todd and the coworker layer. Not chat. Not chat notifications. Persistent files, queryable, diffable, git-able.

### <span style="color:#0f766e">4. Inter-coworker handoff</span>

Researcher finishes a brief → Editor for shipping → Editor pushes deadline back to Scheduler. Handoffs travel through queues (source = `handoff:researcher`), not through Todd. Todd reads the standups; does not relay messages. If two coworkers need to coordinate on something neither can handle alone, the escalation surfaces to Todd via "Needs your attention" section of both standups.

## <span style="color:#0f766e">Schema</span>

SQLite per coworker, single primary table `tasks`:

| Field | Type | Notes |
|---|---|---|
| `task_id` | TEXT PK | ULID |
| `created_at` | INTEGER | Unix milliseconds UTC |
| `created_by` | TEXT | `todd` \| `self` \| `handoff:<role>` \| `event:<hook>` |
| `priority` | TEXT | `low` \| `med` \| `high` \| `urgent` |
| `status` | TEXT | `pending` \| `granted` \| `in_progress` \| `blocked` \| `done` \| `denied` \| `dropped` |
| `title` | TEXT | Short title (standup display) |
| `description` | TEXT | Full task description |
| `rationale` | TEXT NULL | Coworker's reasoning for adding (self-originated tasks only) |
| `dependencies` | TEXT (JSON) NULL | Array of task_ids |
| `blocker` | TEXT NULL | Current blocker description |
| `granted_at` | INTEGER NULL | Todd's grant timestamp |
| `granted_by` | TEXT NULL | Normally `todd`; could be another coworker for narrow delegations |
| `completed_at` | INTEGER NULL | |
| `completion_note` | TEXT NULL | Coworker's brief summary on completion |
| `breith_decision_id` | TEXT NULL | Link to Breith record created on grant/deny |

Indexes on `status`, `created_at`, `priority`.

A `handoffs` log (append-only) records every inter-coworker handoff for audit: `{from_role, to_role, task_id, ts, note}`.

## <span style="color:#0f766e">Standup format</span>

Fixed markdown template per role per day:

```markdown
# <Role> standup — YYYY-MM-DD

## Completed since last standup
- task_id: title — <completion_note>

## In progress
- task_id: title — <current status / blocker>

## Queued — awaiting your grant
- [ ] task_id: title [priority]
  rationale: <why I'm proposing this>
  ...

## Needs your attention (escalations)
- <anything outside my authority>

## Handed off today
- → <role>: task_id — <note>

## Received from other coworkers
- ← <role>: task_id — <note>
```

Todd's morning review is reading five of these files and replying with grants/denies/modifications via `comhoibri_grant` / `comhoibri_deny` / `comhoibri_modify` MCP tools, or via a thin CLI (`comhoibri grant <task_id>`) for vi-native workflow.

## <span style="color:#0f766e">Base class interface</span>

```python
class Coworker:
    role: str
    scope: dict          # domain boundaries — repos, apps, fields
    tools: list          # MCP tools this coworker can invoke
    db_path: str
    standup_dir: str

    def tick(self) -> None:
        """Called per cycle (cron'd or event-driven).
        Observe domain, add to queue as needed, execute granted tasks."""

    def observe(self) -> list[TaskProposal]:
        """Domain-specific observation. Override per role."""

    def execute(self, task: Task) -> TaskResult:
        """Execute a granted task. Override per role."""

    def standup(self, date: str) -> str:
        """Emit daily standup markdown. Base class implementation."""

    def handoff(self, to_role: str, task: Task, note: str) -> None:
        """Transfer task to another coworker's queue."""
```

Five concrete subclasses (`Builder`, `Operator`, `Margu`, `Diol`, `Scheduler`) override `observe` and `execute`, inherit the rest. Each runs as either a cron'd Python script (Builder, Operator, Margu, Diol) or an MCP server (Scheduler, because time-sensitive).

## <span style="color:#0f766e">MCP surface (Todd-facing)</span>

Coworker-agnostic tools, private-tier (Féith mesh only):

- **`comhoibri_standup`** — return today's standup for a role. `role` required; `date` optional (default today).
- **`comhoibri_grant`** — grant a queued task. `task_id` required. Creates a Breith decision record on success.
- **`comhoibri_deny`** — deny a queued task with optional reason. Creates a Breith decision record on success.
- **`comhoibri_modify`** — edit priority, scope, or description of a pending task before granting.
- **`comhoibri_add`** — Todd directly adds a task to a coworker's queue (`role`, `title`, `description`, `priority`).
- **`comhoibri_status`** — high-level status across all coworker roles: task counts by status, last-standup time, any blocked or escalated items.

CLI wrappers for vi-native use: `comhoibri grant <id>`, `comhoibri deny <id> [reason]`, `comhoibri status`, `comhoibri standup <role>`.

## <span style="color:#0f766e">Phased build</span>

- **Phase 0 — substrate (one weekend post-viva).** Base class, SQLite schema, standup markdown writer, handoff primitive, MCP server with the six Todd-facing tools, CLI. Target: ~300 lines Python + 60 lines of tests. Single dependency (Anthropic SDK for the concrete coworkers; base class is dependency-free).

- **Phase 1 — Builder (one week).** First concrete coworker. Wraps git-mcp. Domain: one repo (start with the most active — probably `anseo` or `foxxelabs-config`). Daily standup 08:00 Europe/Dublin. Success criterion: grant rate > 70% within two weeks, indicating queue judgment is calibrated.

- **Phase 2 — Operator (one week).** Wraps Flyer + Sentinel + Taisce. Scope: FoxxeLabs Fly.io org only. Authorities: restart unhealthy apps, rotate secrets on schedule, file Sentinel triage tasks. Escalations: billing, new-app creation, DNS, PAT rotations. First task: fix the Mnemos R2 backup SPOF.

- **Phase 2.5 — Eric upgrade to Margú (one week).** Wrap existing Eric MCP server in Comhoibrí base class. Eric becomes a coworker that *runs* on schedule rather than a tool that *waits* to be invoked (resolves the existing "Eric tools don't reliably surface across sessions" issue). Adds weekly content calendar ownership, Substack drafting handoff to future Editor role, attribution tracking back from Díol conversions.

- **Phase 2.75 — Díol from scratch (one week).** Sales coworker. Wraps Stór backend + BookFunnel API + a local SQLite CRM. First quarter focus: pure Foxxe Frey backlist optimisation. Daily revenue number in the standup, weekly pipeline review. Mandate explicitly scoped against dark-pattern funnel optimisation (see CONVENTIONS.md when this lands — or convention note here).

- **Phase 3 — Scheduler (one week).** Wraps Rialú + Calendar + notification surface. Authority: block calendar time, surface stale intentions, prompt deep-work blocks. Critical role because it defends the focus time needed to review other standups; without Scheduler the coworker stack becomes another inbox.

- **Phase 4 — Researcher + Editor (2-3 weeks each, optional).** Lower urgency. Researcher needs a curated source list and quality bar; Editor needs Substack/Litir integration and strong style prior (VOICE.md becomes operationally important). Build only after Phases 2.5 and 2.75 are stable and the minimum-viable team (Builder + Operator + Margú + Díol + Scheduler) is producing value.

## <span style="color:#0f766e">Evaluation checkpoints</span>

**End of Phase 2** (Builder + Operator running, six weeks in): evaluate before investing in three more roles.

Two failure modes to watch:

1. **Standup overhead exceeds capacity returned.** If Todd spends 45 min/day reviewing standups and recovers only two hours of avoided work, the math doesn't pay. Response: tune queue judgment, raise the auto-execute threshold for trivial tasks, narrow scope.
2. **Coworker scope creep.** Builder wants to make architectural decisions; Operator wants to provision new infrastructure. Discipline: keep authority narrow, expand only after sustained high grant rates indicate the existing scope is mastered. Temptation to broaden scope because the coworker is competent is the same temptation that ends with Todd not knowing what's running.

**End of Phase 3** (five roles live, three months in): evaluate whether the design-vs-build gap has actually closed. Proxy metric: FoxxeLabs project completion velocity vs creation velocity. If completion is catching up to creation (1.71/week), the thesis is validated. If not, the bottleneck is elsewhere and more coworkers won't help.

## <span style="color:#0f766e">Integrations</span>

- **Breith.** Every `comhoibri_grant` and `comhoibri_deny` call creates a Breith decision record. Comhoibrí provides `source=comhoibri`, `inputs[]` (domain observations), `assistant_io[]` (the coworker's proposing prompt + rationale). Todd provides `decision` (grant/deny + any modification), `reversibility`, `confidence`.
- **Mnemos.** Coworkers query Mnemos for context (Researcher and Margú most heavily). Coworkers do *not* ingest to Mnemos by default — ingestion is a separate explicit decision per the first-person-only corpus rule.
- **Rialú.** Scheduler owns Rialú state. Other coworkers read intentions as context for prioritisation.
- **Existing MCP servers.** Each coworker wraps a defined subset:
  - Builder: git-mcp
  - Operator: Flyer + Sentinel + Taisce
  - Margú: Eric + Mnemos + web search
  - Díol: Stór backend + BookFunnel + local CRM
  - Scheduler: Rialú + Calendar

## <span style="color:#0f766e">Trade-offs</span>

- **Daily-review dependency.** Coworkers without a principal are noise generators. The entire architecture is calibrated around Todd reading standups every morning. Miss three days in a row → queues drift, handoffs stall, system degrades to expensive automation. Discipline cost: 20-30 min/day every day for the indefinite future. If that's not a realistic commitment, build only Builder and stop.
- **Async over chat.** Standups are persistent markdown, not chat notifications. The trade-off: no real-time interactivity, but no notification fatigue either. For Todd's working style (vi, terminal, batch review) this is the right trade. For someone else it might not be.
- **Bounded scope forever.** Coworkers stay narrow by design; they will never become general assistants. If a task doesn't fit an existing role, it escalates to Todd. This is a feature, not a limitation — it's what keeps the stack legible and the trust model sound.
- **Per-role SQLite databases.** Simpler than one shared database, but inter-coworker queries require cross-database joins (rarely needed in practice — handoffs handle most cases). If analytics across coworkers becomes important, a read-only consolidated view can be generated nightly.
- **No coworker-to-coworker API.** All inter-coworker communication is via handoff through queues. No direct function calls. Simpler, more auditable, slower. Acceptable for the intended workload.

## <span style="color:#0f766e">Why not the alternatives</span>

- **Not CrewAI / AutoGen / LangGraph.** Optimised for autonomous orchestration with human out of loop. Abstractions leak. Overkill for five narrow-scope single-principal coworkers.
- **Not a single big agent with many tools.** That's just Claude with MCP, which is what exists today. The problem is agency, not capability.
- **Not a task manager (Todoist / Linear / Asana).** Those are human-to-human coordination tools. Comhoibrí is human-to-coworker coordination.
- **Not chat.** Chat optimises for real-time interaction, which is the opposite of async principal review. Standups are deliberate async.
- **Not a SaaS product — yet.** If the personal version works and produces sustained value, the team version (Phase-beyond) becomes the bankable Breith/Comhoibrí protocol product — but only after personal validation.

## <span style="color:#0f766e">Open decisions (for post-viva scoping)</span>

- Host: single Daisy-local process vs per-coworker Fly.io app. Leaning Daisy-local for Phase 0-1 (simpler), migrate specific coworkers to Fly.io as needed (Operator probably, for always-on monitoring).
- Cron cadence per coworker: Builder on-demand + morning, Operator every 30 min, Margú every 2 hours, Díol daily, Scheduler every 15 min. Tunable.
- Escalation channel: morning standup only vs SMS/email for urgent. Start standup-only; add urgent channel only if a concrete escalation is missed.
- Handoff protocol formality: simple `handoff(task, to_role)` vs explicit handoff ticket with accept/reject by receiving coworker. Start simple; formalise if handoff reliability becomes an issue.
- Test harness: dry-run mode where coworkers propose but never execute, for the first week of each new role. Mandatory for Operator given the production-blast-radius.
- Naming: `comhoibri` (library) vs `comhoibrí` (project) — fada in docs, stripped in Python package name for import compatibility.

## <span style="color:#0f766e">Success criteria</span>

Phase 0 ships successfully if the base class + MCP + CLI runs and produces valid standup files for a mocked coworker.

Phase 1 ships successfully if Builder runs unsupervised for a week, grant rate stays above 70% from week two onward, and at least one self-originated task (Builder adding its own work) completes successfully.

Phase 2 ships successfully if Operator fixes the Mnemos R2 backup SPOF without Todd writing a line of Fly.io code.

Phase 2.75 ships successfully if Díol reports positive month-over-month growth in Foxxe Frey direct-sales revenue within its first quarter.

Phase 3 ships successfully if calendar focus-block adherence increases measurably and Todd's morning standup review routine stabilises at < 30 min/day.

**Overall project success** (nine months in): the five-coworker team is live, FoxxeLabs project completion velocity has visibly closed the gap to creation velocity, and the morning standup review has become a habit rather than a chore. Secondary success: the Breith dataset accumulated via Comhoibrí-mediated decisions is the basis for Macalla's first judgment-trained adapter.

## <span style="color:#0f766e">Provenance</span>

Conversation with Claude, 2026-04-22. Coworker-stack architecture proposed during the ASI-vs-AGI-vs-plateau section of the AI-bubble / third-brain session; Todd explicitly chose the AGI-coworker bet over the ASI-mentor bet. Sales role decomposition added in the same session. Full transcript ingested to Mnemos (65 chunks). This PRD synthesised from that architecture discussion, expanded with schema, base class, phased build, and success criteria.

---

*FoxxeLabs Limited · 2026-04-22*
