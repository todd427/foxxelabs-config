" mdvi — Markdown styled in place, in real vim.
" ~/.vim/after/syntax/markdown.vim
" Loads after the stock runtime markdown syntax. No plugins, no treesitter,
" no glyph substitution, no Nerd Font. Works in 256-colour; exact hex colours
" if 'termguicolors' is already set. Does not change any global option.

" ── helpers ──────────────────────────────────────────────────────────────
function! s:Hex2Cterm(hex) abort
  let l:r = str2nr(a:hex[0:1], 16)
  let l:g = str2nr(a:hex[2:3], 16)
  let l:b = str2nr(a:hex[4:5], 16)
  let l:lv = [0, 95, 135, 175, 215, 255]
  let l:best = 16 | let l:bestd = 1.0e12
  for l:i in range(6)
    for l:j in range(6)
      for l:k in range(6)
        let l:d = pow(l:lv[l:i]-l:r,2) + pow(l:lv[l:j]-l:g,2) + pow(l:lv[l:k]-l:b,2)
        if l:d < l:bestd | let l:bestd = l:d | let l:best = 16 + 36*l:i + 6*l:j + l:k | endif
      endfor
    endfor
  endfor
  for l:i in range(24)
    let l:v = 8 + 10*l:i
    let l:d = pow(l:v-l:r,2) + pow(l:v-l:g,2) + pow(l:v-l:b,2)
    if l:d < l:bestd | let l:bestd = l:d | let l:best = 232 + l:i | endif
  endfor
  return l:best
endfunction

function! s:Norm(hex) abort
  let l:h = toupper(a:hex)
  return len(l:h) == 3 ? l:h[0].l:h[0].l:h[1].l:h[1].l:h[2].l:h[2] : l:h
endfunction

" hi with matching gui + cterm from one hex. attr '' = none.
function! s:Hi(group, fg, bg, attr) abort
  let l:cmd = 'hi ' . a:group
  let l:cmd .= ' guifg='   . (a:fg ==# '' ? 'NONE' : '#'.a:fg)
  let l:cmd .= ' ctermfg=' . (a:fg ==# '' ? 'NONE' : s:Hex2Cterm(a:fg))
  let l:cmd .= ' guibg='   . (a:bg ==# '' ? 'NONE' : '#'.a:bg)
  let l:cmd .= ' ctermbg=' . (a:bg ==# '' ? 'NONE' : s:Hex2Cterm(a:bg))
  let l:a = a:attr ==# '' ? 'NONE' : a:attr
  exe l:cmd . ' gui=' . l:a . ' cterm=' . l:a . ' term=' . l:a
endfunction

" ── extra syntax the stock file lacks ────────────────────────────────────
" Tables: header row (row directly above a |---| row), separator, pipes
syn match mdTableRow  /^\s*|.*|\s*$/ contains=mdTablePipe,@markdownInline
syn match mdTableHead /^\s*|.*|\s*\n\%(\%(.*-\)\@=\s*[-:| ]*|[-:| ]*$\)\@=/ contains=mdTablePipe,@markdownInline
syn match mdTableSep  /^\%(.*-\)\@=\s*[-:| ]*|[-:| ]*$/
syn match mdTablePipe /|/ contained

" Task list boxes
syn match mdTaskOpen /\%(^\s*[-*+]\s\+\)\@<=\[ \]/
syn match mdTaskDone /\%(^\s*[-*+]\s\+\)\@<=\[[xX]\]/

" Blockquote body (stock only colours the '>')
syn match mdQuoteText /\%(^\s*>\s\?\)\@<=[^>[:space:]].*$/ contains=@markdownInline

" Links: hide the (url) part when conceal is on; cursor line shows it
if get(g:, 'mdvi_conceal_urls', 1)
  syn region markdownLink matchgroup=markdownLinkDelimiter start="(" end=")" contains=markdownUrl keepend contained conceal
endif

syn sync minlines=300

" ── <span style="color:#hex"> … </span> ──────────────────────────────────
" One region per colour found in the buffer. Tags dim (hidden when conceal
" is on), body in the real colour, **bold**/*italic* inside keep the colour.
function! MdviSpans() abort
  let l:found = []
  call substitute(join(getline(1, '$'), "\n"),
        \ '\c\%(background-\)\@<!color\s*:\s*#\(\x\{6}\|\x\{3}\)\>',
        \ '\=add(l:found, submatch(1))', 'g')
  let b:mdvi_seen = get(b:, 'mdvi_seen', {})
  for l:raw in l:found
    if has_key(b:mdvi_seen, toupper(l:raw)) | continue | endif
    let b:mdvi_seen[toupper(l:raw)] = 1
    let l:H = s:Norm(l:raw)
    let l:tag = 'MS' . toupper(l:raw)
    let l:start = 'start=+\c<span\s[^>]*\%(background-\)\@<!color\s*:\s*#' . l:raw . '\>[^>]*>+'
    let l:end   = 'end=+\c</span>+ end=+^\s*$+'
    let l:inner = 'contains=' . l:tag . 'B,' . l:tag . 'I,markdownCode,markdownLinkText,markdownEscape'
    " body text
    exe 'syn region ' . l:tag . ' matchgroup=mdSpanTag ' . l:start . ' ' . l:end . ' concealends ' . l:inner
    " same, inside headings: keep heading weight
    exe 'syn region ' . l:tag . 'H matchgroup=mdSpanTag ' . l:start . ' ' . l:end
          \ . ' concealends contained containedin=markdownH3,markdownH4,markdownH5,markdownH6 ' . l:inner
    exe 'syn region ' . l:tag . 'U matchgroup=mdSpanTag ' . l:start . ' ' . l:end
          \ . ' concealends contained containedin=markdownH1,markdownH2 ' . l:inner
    " emphasis inside a span
    exe 'syn region ' . l:tag . 'B matchgroup=mdDelim start=+\*\*\ze\S+ end=+\S\zs\*\*+ contained concealends oneline'
    exe 'syn region ' . l:tag . 'B matchgroup=mdDelim start=+\<__\ze\S+ end=+\S\zs__\>+ contained concealends oneline'
    exe 'syn region ' . l:tag . 'I matchgroup=mdDelim start=+\*\@<!\*\ze[^*[:space:]]+ end=+[^*[:space:]]\zs\*\*\@!+ contained concealends oneline'
    exe 'syn cluster markdownInline add=' . l:tag
    call s:Hi(l:tag,       l:H, '', '')
    call s:Hi(l:tag . 'H', l:H, '', 'bold')
    call s:Hi(l:tag . 'U', l:H, '', 'bold,underline')
    call s:Hi(l:tag . 'B', l:H, '', 'bold')
    call s:Hi(l:tag . 'I', l:H, '', 'italic')
  endfor
endfunction

" ── palette ──────────────────────────────────────────────────────────────
function! MdviColours() abort
  let l:dark = &background ==# 'dark'
  let l:blue   = l:dark ? '6CA6D9' : '2F6F9F'
  let l:blue2  = l:dark ? '8FC1EA' : '3F82B5'
  let l:terra  = l:dark ? 'D98A68' : 'A8552F'
  let l:dim    = l:dark ? '6C6C6C' : '9A9A9A'
  let l:code   = l:dark ? 'E5C07B' : '8A5A00'
  let l:codebg = l:dark ? '2A2A2A' : 'ECECEC'
  let l:green  = l:dark ? '98C379' : '3D7A2A'
  let l:link   = l:dark ? '61AFEF' : '1F5FBF'

  call s:Hi('markdownH1', l:blue,  '', 'bold,underline')
  call s:Hi('markdownH2', l:blue,  '', 'bold,underline')
  call s:Hi('markdownH3', l:blue2, '', 'bold')
  call s:Hi('markdownH4', l:terra, '', 'bold')
  call s:Hi('markdownH5', l:terra, '', 'italic')
  call s:Hi('markdownH6', l:dim,   '', 'italic')
  call s:Hi('markdownHeadingDelimiter', l:dim, '', '')
  call s:Hi('markdownHeadingRule',      l:dim, '', '')

  call s:Hi('markdownBold',       '', '', 'bold')
  call s:Hi('markdownItalic',     '', '', 'italic')
  call s:Hi('markdownBoldItalic', '', '', 'bold,italic')
  call s:Hi('markdownStrike',     l:dim, '', 'strikethrough')
  call s:Hi('mdDelim',            l:dim, '', '')
  hi! link markdownBoldDelimiter       mdDelim
  hi! link markdownItalicDelimiter     mdDelim
  hi! link markdownBoldItalicDelimiter mdDelim
  hi! link markdownStrikeDelimiter     mdDelim

  call s:Hi('markdownCode',          l:code, l:codebg, '')
  call s:Hi('markdownCodeBlock',     l:code, l:codebg, '')
  call s:Hi('markdownCodeDelimiter', l:dim,  l:codebg, '')

  call s:Hi('markdownBlockquote', l:terra, '', 'bold')
  call s:Hi('mdQuoteText',        l:dim,   '', 'italic')
  call s:Hi('markdownListMarker',        l:terra, '', 'bold')
  call s:Hi('markdownOrderedListMarker', l:terra, '', 'bold')
  call s:Hi('markdownRule',       l:dim,   '', 'bold')

  call s:Hi('markdownLinkText',          l:link, '', 'underline')
  call s:Hi('markdownLinkTextDelimiter', l:dim,  '', '')
  call s:Hi('markdownLinkDelimiter',     l:dim,  '', '')
  call s:Hi('markdownUrl',               l:dim,  '', '')
  call s:Hi('markdownAutomaticLink',     l:link, '', 'underline')
  call s:Hi('markdownFootnote',          l:link, '', '')
  call s:Hi('markdownFootnoteDefinition', l:link, '', 'bold')

  call s:Hi('mdTableHead', '',    '', 'bold')
  call s:Hi('mdTablePipe', l:dim, '', '')
  call s:Hi('mdTableSep',  l:dim, '', '')
  call s:Hi('mdTaskOpen',  l:terra, '', 'bold')
  call s:Hi('mdTaskDone',  l:green, '', 'bold')
  call s:Hi('mdFrontMatter', l:dim, '', '')
  call s:Hi('mdSpanTag',   l:dim, '', '')
  " an underscore inside a word is not an error worth a red block
  hi! link markdownError NONE

  " span colours are highlight groups too; a :colorscheme wipes them
  if exists('b:mdvi_seen')
    unlet b:mdvi_seen
    call MdviSpans()
  endif
endfunction

" YAML front matter — defined last so it outranks rule / setext-H2 on line 1
syn region mdFrontMatter start=/\%^---\s*$/ end=/^\%(---\|\.\.\.\)\s*$/ keepend

call MdviSpans()
call MdviColours()

augroup mdvi_syntax
  autocmd! * <buffer>
  autocmd BufWritePost,InsertLeave <buffer> call MdviSpans()
  autocmd ColorScheme <buffer> call MdviColours()
augroup END
