# <span style="color:#5B8DBE">PRD: mdvi</span>

> <span style="color:#C97B5C">**IMPLEMENTED AS A VIM OVERLAY 2026-09-20.**</span> The styling pass (§3, §5 layer 3) ships as two files for stock vim — see [README.md](README.md). The TUI host and editor core (§5 layers 1–2) were not built and are not needed: stock vim is the vi. The Rust binary below remains unbuilt; body retained as the spec the overlay was written against.
>
> <span style="color:#888">History: marked superseded by Cló's manuscript editor on 2026-06-03. That held for rendered-while-editing in a browser; it never covered a terminal-based editor, which is the requirement that reopened this on 2026-09-20.</span>

<span style="color:#888">A vi-shaped markdown editor with live styling.</span>

<span style="color:#888">**Status:** Styling pass implemented as a vim overlay, 2026-09-20. Standalone binary not built.</span>
<span style="color:#888">**Owner:** Todd. **Date:** 2026-06-03.</span>
<span style="color:#888">**Working name:** `mdvi`. Final name TBD — see §10.</span>

---

## <span style="color:#5B8DBE">1. One-line summary</span>

A single-binary CLI markdown editor with vi keybindings and live styling of markdown source — no plugin manager, no glyph substitution, no Lua config, no concealment.

## <span style="color:#5B8DBE">2. Problem</span>

The "vi for markdown" niche is unoccupied. The realistic options are:

- **vi/vim** — source view with syntax colours. Editable. Not rendered.
- **glow / bat** — rendered (or syntax-coloured) reading. Not editors.
- **nvim + render-markdown.nvim / markview.nvim** — rendered + editable, but the neovim plugin ecosystem is fragile (treesitter branch churn, Nerd Font dependency, lazy.nvim bootstrap surface). Brittle for an everyday tool.

The category gap is a small standalone binary that does *only* this, with vi gestures, no surprise breakage from upstream plugin churn.

## <span style="color:#5B8DBE">3. Goal</span>

`mdvi file.md` opens a markdown file in a vi-modal editor. Markdown elements are *styled in place* — colour, weight, italic, background — without hiding or replacing source characters. Edit, save, quit with standard vi commands.

## <span style="color:#5B8DBE">4. Non-goals</span>

- General-purpose editing. Markdown only.
- Full vi feature parity. Core motions, operators, ex commands, search. No macros (v1), no registers beyond default, no folding, no LSP.
- WYSIWYG / concealment. The buffer shows markdown source. Styling paints over source, never replaces it. This is the explicit divergence from render-markdown.nvim's conceal model — concealment was the failure mode that justified building.
- Plugin ecosystem. No init file that can break a launch.

## <span style="color:#5B8DBE">5. Architecture</span>

Three layers:

**TUI host** — Rust + `ratatui`. Owns terminal: raw mode, resize, alternate screen, cursor, render loop.

**Editor core** — `ropey` rope buffer. Modal state machine (Normal / Insert / Command / Visual). Motions: `h j k l w b e 0 $ gg G { } %`. Operators: `d c y p` with motion composition (`dw`, `c$`, `yy`). Ex: `:w :q :wq :q! :s/foo/bar/g :e`. Search: `/ ? n N`. Undo tree.

**Styling pass** — `pulldown-cmark` parse on idle (50ms debounce post-edit). Produces a `Vec<(byte_range, Style)>` overlay. Styles: heading levels 1–6, emphasis, strong, code span, code block, list marker, blockquote, link. Applied at render time over source characters.

Critically: **no glyph substitution.** No icons. No bullet replacement. No Unicode magic. Colour, weight, italic, background only. Works in any 256-colour terminal. Sidesteps the Nerd Font dependency entirely.

## <span style="color:#5B8DBE">6. Data flow</span>

```
keystroke → modal state → buffer op →
dirty flag → 50ms debounce → reparse →
new span list → render frame with styling overlay
```

Reparse on a 100KB file with pulldown-cmark is sub-millisecond. Debounce is insurance for >1MB files.

## <span style="color:#5B8DBE">7. Config</span>

Single `~/.config/mdvi/config.toml`. Theme, tab width, line numbers, search flavour. No Lua. No plugins. Bad config falls back to defaults with a status-line warning — never blocks launch.

## <span style="color:#5B8DBE">8. Scope</span>

**MVP (v0.1):** §5 layers 1–3, core motions/operators/ex, default light + dark themes. Single file only. No splits, no buffers. Save / quit / edit.

**v1.0:** config file, themes, multiple buffers, splits, `:e` file switching, undo tree polish.

**v2.0 — Mnemos integration:** `:m query terms` opens top-5 Mnemos results in a popup. `Enter` inserts a link to the chunk. This is the one feature that justifies building over forking — Mnemos hook is novel and slots directly into Todd's stack.

**v2 stretch:** `gf` follows `[text](path.md)` links. `:Outline` sidebar of headers. Soft wrap on paragraph boundaries. YAML frontmatter folded as summary.

## <span style="color:#5B8DBE">9. Cost</span>

Solo Rust dev. **Honest estimates, not floor latency:**

- **MVP**: <span style="color:#C97B5C">4–6 weeks full time, or 3–5 months at evening pace.</span> Vi keybindings are the time sink — operators × motions × text objects × counts is a combinatorial mess.
- **v1.0**: <span style="color:#C97B5C">+3 weeks.</span>
- **v2.0 (Mnemos hook)**: <span style="color:#C97B5C">+1 week.</span> Trivial given Mnemos MCP interface and existing client patterns.

Binary size target: <span style="color:#5B8DBE">~3MB stripped, static</span>. Distribution: `cargo install`.

## <span style="color:#5B8DBE">10. Open questions</span>

**Build vs fork.** Helix is Rust + tree-sitter native and already has modal keybindings. Forking Helix and stripping to markdown-only might land MVP faster than greenfield. Trade-off: smaller surface to own vs larger codebase to learn. Decision deferred until pickup.

**Name.** `mdvi` is a working codename. Irish-stack candidates:

- **Eagar** (m): arrangement, editing. Short, root word for "edit". Leading candidate.
- **Pinn** (f): pen. Shorter than `vi` itself.
- **Léitheoir** (m): reader. Less accurate — it's an editor, not just a reader.

Decision deferred. The PRD references `mdvi` throughout for tractability.

**Concealment escape hatch.** Should there be a `:set conceal` toggle that *does* hide markup, for users who change their mind? Default off. Decision deferred until first dogfooding.

<span style="color:#888">Overlay note, 2026-09-20: the overlay inverts this default. Conceal is on, because hiding `<span>` tags is what makes Todd's own documents readable; the cursor line always shows raw source, `\c` flips the whole buffer, and `g:markdown_syntax_conceal = 0` keeps Markdown markers visible. No glyphs are substituted in either mode. Revisit after dogfooding.</span>

## <span style="color:#5B8DBE">11. Trigger to revisit</span>

<span style="color:#C97B5C">Reopened and closed 2026-09-20</span> by the vim overlay. Build the standalone binary only if the overlay proves inadequate in daily use for a reason vim cannot fix — not for the styling, which is done.

Original trigger (2026-06-03, now moot): Post-viva, conditional on viva passing, no higher-priority Macalla / Anseo / Stór blockers, and continued willingness to commit 4–6 weeks against ~30 years of adequate vim-on-source as the baseline.
