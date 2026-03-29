# FoxxeLabs Development Conventions

## AI tooling attribution

Claude (Anthropic) is used throughout FoxxeLabs development as a tool — for code generation, architecture, documentation, commit authorship via git-mcp, and session work. Todd McCaffrey is the architect, director, and owner of all work produced.

### Commit messages

**Do NOT use `Co-Authored-By:` trailers in commit messages.**

The `Co-Authored-By` convention imports authorship implications that create copyright ambiguity. Copyright in AI-assisted work belongs to the human directing the work. Using authorship-framed attribution for a tool creates an unnecessary legal grey area.

If tooling attribution is desired, use a neutral descriptor:

```
Generated-with: Claude Sonnet 4.6 <https://anthropic.com>
```

Or omit entirely. The presence of CLAUDE.md in a repo, and the committer identity `Claude (git-mcp) <git-mcp@foxxelabs.ie>`, is sufficient record that Claude was used as a development tool.

### Documents and reports

Documents, reports, and PRDs produced with Claude assistance are owned by Todd McCaffrey / FoxxeLabs Limited. Attribution in document footers should read:

```
FoxxeLabs Limited · [date]
```

Not "Prepared by Claude" or any equivalent. Claude is the instrument; Todd is the author.

### Copyright position

Todd McCaffrey retains full copyright over all FoxxeLabs work product. Claude is a contracted tool. The work-for-hire principle applies: commissioned output, directed by Todd, paid for by Todd, owned by Todd.

This position is consistent with Anthropic's current Terms of Service, which assign output ownership to the user.

---

## Repository conventions

- All timestamps: Unix milliseconds UTC unless otherwise specified
- Fly.io region: `lhr` for all FoxxeLabs services. `dub` does not exist.
- Python: snake_case (FastAPI convention). Todd uses camelCase on solo non-Python projects.
- Editor: vi. Never reference nano.
- No hand-holding comments in code.

---

*FoxxeLabs Limited · Letterkenny, Co. Donegal, Ireland*
