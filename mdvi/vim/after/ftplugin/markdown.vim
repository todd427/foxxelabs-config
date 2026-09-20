" mdvi — buffer-local options for Markdown. ~/.vim/after/ftplugin/markdown.vim
" Everything here is setlocal / <buffer>; nothing leaks into other filetypes.

setlocal wrap linebreak breakindent
setlocal conceallevel=2 concealcursor=
if get(g:, 'mdvi_conceal', 1) == 0
  setlocal conceallevel=0
endif

" \c  — flip between styled view and full raw source
function! s:ToggleRaw() abort
  let &l:conceallevel = &l:conceallevel ? 0 : 2
  echo &l:conceallevel ? 'mdvi: styled' : 'mdvi: raw'
endfunction
nnoremap <buffer> <silent> <LocalLeader>c :call <SID>ToggleRaw()<CR>
command! -buffer MdRaw call <SID>ToggleRaw()

" :Outline — headings of this file in the location list; <CR> jumps
function! s:Outline() abort
  let l:items = []
  let l:fence = 0
  for l:n in range(1, line('$'))
    let l:t = getline(l:n)
    if l:t =~# '^\s*\(```\|\~\~\~\)' | let l:fence = !l:fence | continue | endif
    if l:fence || l:t !~# '^ \{,3}#\{1,6}\s' | continue | endif
    let l:lvl = len(matchstr(l:t, '#\+'))
    let l:txt = substitute(l:t, '^\s*#\+\s*', '', '')
    let l:txt = substitute(l:txt, '<[^>]*>', '', 'g')
    let l:txt = substitute(l:txt, '\s*#*\s*$', '', '')
    call add(l:items, {'bufnr': bufnr('%'), 'lnum': l:n, 'text': repeat('  ', l:lvl - 1) . l:txt})
  endfor
  call setloclist(0, l:items)
  lopen
  setlocal nowrap
endfunction
command! -buffer Outline call <SID>Outline()
nnoremap <buffer> <silent> <LocalLeader>o :Outline<CR>

" ]] / [[ — next / previous heading
nnoremap <buffer> <silent> ]] :call search('^ \{,3}#\{1,6}\s', 'W')<CR>
nnoremap <buffer> <silent> [[ :call search('^ \{,3}#\{1,6}\s', 'bW')<CR>

let b:undo_ftplugin = get(b:, 'undo_ftplugin', 'exe')
      \ . ' | setl wrap< linebreak< breakindent< conceallevel< concealcursor<'
      \ . ' | silent! nunmap <buffer> <LocalLeader>c'
      \ . ' | silent! nunmap <buffer> <LocalLeader>o'
      \ . ' | silent! nunmap <buffer> ]]'
      \ . ' | silent! nunmap <buffer> [['
      \ . ' | silent! delcommand -buffer MdRaw'
      \ . ' | silent! delcommand -buffer Outline'
