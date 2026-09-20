#!/bin/sh
# mdvi-in-vim: copy the two overlay files from this repo into ~/.vim/after.
# Uninstall: rm ~/.vim/after/syntax/markdown.vim ~/.vim/after/ftplugin/markdown.vim
set -eu
HERE=$(cd "$(dirname "$0")" && pwd)

command -v vim >/dev/null 2>&1 || { echo "no vim on PATH — sudo apt install vim" >&2; exit 1; }
for f in +syntax +conceal +linebreak; do
  vim --version | grep -q -- "$f" || { echo "this vim lacks $f (vim.tiny?) — sudo apt install vim" >&2; exit 1; }
done
case "$(readlink -f "$(command -v vi)")" in
  *tiny*) echo "note: 'vi' resolves to vim.tiny; use 'vim', or: sudo update-alternatives --set vi /usr/bin/vim.basic" >&2 ;;
esac

for sub in syntax ftplugin; do
  src="$HERE/vim/after/$sub/markdown.vim"
  dst="$HOME/.vim/after/$sub/markdown.vim"
  mkdir -p "$(dirname "$dst")"
  if [ -e "$dst" ] && ! cmp -s "$src" "$dst"; then
    cp -p "$dst" "$dst.bak.$(date +%Y%m%d%H%M%S)"; echo "backed up $dst"
  fi
  cp "$src" "$dst"
done

# The overlay only loads if syntax + filetype plugins are on.
RC="$HOME/.vimrc"
if [ ! -e "$RC" ]; then
  # No vimrc means vim was running on defaults.vim; keep that behaviour.
  printf '%s\n' 'source $VIMRUNTIME/defaults.vim' > "$RC"
  echo "created $RC (sources defaults.vim, as before)"
fi
if ! grep -q '>>> mdvi' "$RC"; then
  cat "$HERE/vimrc.snippet" >> "$RC"
  echo "appended mdvi block to $RC"
fi
printf '%s\n' 'done: vi some.md   (\c raw/styled, \o outline, ]] [[ headings)'
