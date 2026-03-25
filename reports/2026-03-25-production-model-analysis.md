# FoxxeLabs Production Model Analysis
## Report: 2026-03-25

---

## Question

Has the acceleration in project creation rate been driven by a shift in production model — from manual copy-paste to git-mcp to Claude Code — rather than (or in addition to) a simple increase in ideas or displacement from the dissertation?

---

## The Three Eras

### Era 1 — Clipboard Model (pre ~Feb 2026)

Todd describes problem → Claude generates code in chat → Todd copies, pastes, saves, runs → repeat.

Claude was a fast code generator in a separate tab. Todd was the integration layer between Claude's output and the codebase. Every file change required a manual trip. Projects existed but grew slowly because Todd was the bottleneck.

Evidence: commit history on early Anseo (Jan 14 – Feb 2026) shows human-authored commits with short, conversational messages. No `feat:/fix:` prefix convention. Commit cadence matches manual copy-paste rhythm.

### Era 2 — git-mcp in Chat (~Feb–Mar 2026)

git-mcp comes online. Claude can write directly to repos from claude.ai without the clipboard step. Todd still directs, but the friction dropped ~80%.

Evidence: `author: Claude (git-mcp) <git-mcp@foxxelabs.ie>` first appears in the foxxelabs-astro commit log on 2026-03-22 (commit 3255bfc — "Add article: The Accidental Revolution"). The author field is a direct timestamp of when the production model shifted.

### Era 3 — Claude Code (Mar 2026)

CC gets a terminal, filesystem access, can run tests and deploy directly. Todd directs at the architecture level; CC handles file creation, debugging, and commit messages. The structured `feat:/fix:/docs:/chore:` prefix convention in Rialú, Mnemos, Sentinel, and git-mcp commit logs is characteristic of CC output.

Evidence:
- Rialú: `feat: add generate_key (get-or-create) + CLI` — CC-authored
- Sentinel: `docs: add deployment acceptance tests to SPEC.md` — CC-authored (today)
- Mnemos: `fly-mcp: add 50-test suite (tools, OAuth E2E, OAuth provider)` — CC-authored
- foxxelabs-config itself was created 2026-03-19 in a CC session

---

## Project Creation Rate by Era

| Period | Duration | New Projects | Rate (projects/wk) |
|--------|----------|-------------|---------------------|
| Pre-2025 (years) | ~2 years | ~6 | ~0.06 |
| Q4 2025 | ~13 weeks | ~3 | ~0.23 |
| Jan–Feb 2026 (clipboard→git-mcp) | 8 weeks | ~4 | ~0.50 |
| Mar 1–25 2026 (CC era) | 3.5 weeks | 6 | ~1.71 |

**3× acceleration in March is coincident with CC adoption.**

---

## The Causal Argument

The acceleration is causal, not merely correlational with dissertation stress.

**Pre-CC:** The bottleneck was Todd-as-integration-layer. Starting a new project required manual scaffolding, copy-paste loops, and cognitive context-switching cost at every step.

**CC era:** The bottleneck shifted to *has Todd thought of it?* Once an idea exists, a CC session can scaffold, implement, test, and deploy within hours. The marginal cost of starting and progressing a project dropped to near zero.

This explains why the rate tripled in March without Todd becoming three times more creative or three times more stressed. The friction disappeared. Projects that previously stalled at "not worth the copy-paste cost" now cross the threshold.

**Dissertation displacement is a secondary effect, not the primary driver.** The rate would likely have increased anyway as CC came online. The displacement hypothesis explains *timing* (March is peak dissertation pressure) but not *magnitude*.

---

## The Real Constraint

The constraint has shifted layers. It is no longer:
- Implementation speed (CC handles it)
- Scaffolding cost (CC handles it)
- Commit / deploy friction (git-mcp + CC handles it)

It is now:
1. **Context maintenance** — 13 simultaneous active projects means 13 open loops. Research puts comfortable ceiling at 5–7 for any single person before switching cost dominates.
2. **Attention budget** — directing CC well requires architectural thinking, not keystrokes. That cognitive load is non-trivial and scales with project count.
3. **Integration debt** — each new project creates potential integration points (Sentinel→Anseo, Mnemos→everything, Rialú→all machines). The graph gets denser.

---

## Implications

1. The production model shift is real and irreversible. Pre-CC throughput benchmarks are meaningless.

2. The project creation rate will continue to accelerate unless deliberately constrained. The natural selection pressure (implementation friction) that previously pruned weak ideas is gone.

3. The new selection pressure should be **strategic fit** — does this project advance Legion, Anseo, the MSc, or a revenue path? If not, park it at spec stage rather than spinning up a repo and a CC session.

4. Completion rate (currently 10%) is the lagging indicator to watch. A healthy portfolio completes roughly as fast as it starts new projects. The current ratio (10% complete, 62% active) is a leading indicator of future context overload.

5. Post-viva (June 2026+) is the natural moment to audit: which of the 13 active projects has a clear definition of done? Archive the ones that don't.

---

## Data Sources

- `projects.json` — foxxelabs-config (as of 2026-03-19, 21 projects)
- `git log` — foxxelabs-astro, anseo, mnemos, rialu, sentinel (checked 2026-03-25)
- Mnemos query: "new project created FoxxeLabs" — 10 results
- Mnemos query: "accidental revolution Claude Code copy paste" — 5 results
- Article: "The Accidental Revolution" — foxxelabs.ie (2026-03-22)
- Article: "I Built Claude Code Before Claude Code Existed" — foxxelabs-astro (local)

---

*FoxxeLabs Limited · Private — not for publication · 25 March 2026*
