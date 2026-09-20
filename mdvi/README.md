# <span style="color:#5B8DBE">mdvi — Markdown styled in place, in stock vim</span>

<span style="color:#888">Two files under `~/.vim/after/`. No plugins, no plugin manager, no treesitter, no Lua, no Nerd Font, no glyph substitution.</span>

<span style="color:#888">**Built:** 2026-09-20. **Tested against:** Vim 9.1 (patches 1-16), the Ubuntu 24.04 package. **Spec:** [PRD.md](PRD.md) §3–§5, styling pass only.</span>

---

## <span style="color:#5B8DBE">Why this and not the Rust binary</span>

The PRD's goal is a styling pass over Markdown source. Its whole 4–6 week cost was re-implementing vi. Stock vim already is vi, so the styling pass is all that needed writing, and it fits in one syntax file that upstream plugin churn cannot break.

## <span style="color:#5B8DBE">Install</span>

```sh
cd /home/Projects/foxxelabs-config/mdvi
sh install.sh
vi some.md
```

`install.sh` checks that vim has `+syntax +conceal +linebreak`, warns if `vi` resolves to `vim.tiny`, backs up any existing `~/.vim/after/{syntax,ftplugin}/markdown.vim` that differs, copies the two files, and appends `vimrc.snippet` to `~/.vimrc` once. If there is no `~/.vimrc` it creates one that sources `defaults.vim`, so vim's behaviour elsewhere does not change. Safe to re-run.

<span style="color:#C97B5C">**Uninstall:**</span> `rm ~/.vim/after/syntax/markdown.vim ~/.vim/after/ftplugin/markdown.vim` and delete the `>>> mdvi` block from `~/.vimrc`.

## <span style="color:#5B8DBE">What it styles</span>

| Element | Treatment |
|---|---|
| Headings H1–H6 | colour by level; H1/H2 bold underline, H3/H4 bold, H5/H6 italic; `#` dimmed |
| Bold, italic, strikethrough | real terminal attributes; markers dimmed and hidden off the cursor line |
| Inline code, code blocks | tinted background |
| Blockquotes | bold marker, italic dim body |
| Lists, tasks | bold markers; `[ ]` and `[x]` coloured |
| Tables | bold header row, dim pipes and separator row |
| Links | underlined text; `(url)` hidden off the cursor line |
| YAML front matter | dimmed |
| `<span style="color:#hex">` | text drawn in that colour, tags hidden; bold/italic inside keep the colour; heading weight kept |

The cursor line always shows full raw source (`concealcursor=` is empty), so what is being edited is what is in the file.

Every highlight carries both a truecolour value and its nearest xterm-256 index, so it works with or without `termguicolors` and sets no global option.

## <span style="color:#5B8DBE">Keys and commands</span>

| Key | Command | Action |
|---|---|---|
| `\c` | `:MdRaw` | toggle styled view / full raw source for the buffer |
| `\o` | `:Outline` | headings into the location list; Enter jumps |
| `]]` `[[` | | next / previous heading |

`\` is `<LocalLeader>`; if that is remapped, the keys follow it.

## <span style="color:#5B8DBE">Options (set in ~/.vimrc, all commented out in the snippet)</span>

| Setting | Effect |
|---|---|
| `set background=dark` | if vim misreads the terminal and draws pale boxes behind code |
| `let g:markdown_syntax_conceal = 0` | keep `**` and `_` markers visible; span tags and URLs still hidden |
| `let g:mdvi_conceal_urls = 0` | never hide link URLs |
| `let g:mdvi_conceal = 0` | open every file in raw view |
| `let g:markdown_fenced_languages = [...]` | per-language highlighting inside fences; stock vim then hides the fence lines and the block loses its uniform background |

## <span style="color:#5B8DBE">Known limits</span>

- Vim computes line wrap on raw text, so a line with a long hidden URL wraps earlier than it appears it should.
- Highlight groups do not combine in vim syntax, so a span inside inline code, or code inside a heading, takes the inner group's colours only.
- Span colours are picked up on load, on write, and on leaving insert mode; a colour typed for the first time appears after `Esc`.
- An unclosed `<span>` colours text to the next blank line, not to end of file.
- Italic and strikethrough depend on the terminal's terminfo entry.
- <span style="color:#C97B5C">Not yet verified on Daisy, or from Lava over SSH.</span> Tested in a sandbox by probing highlight and conceal state per cell and by rasterising vim's screen from a real pty.

## <span style="color:#5B8DBE">Not built</span>

PRD v2's Mnemos hook (`:m query terms`). As a vim command over this overlay it is a small job, not a week of Rust.
