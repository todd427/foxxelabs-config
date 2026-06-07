# IRG Venice 2026 — conference deck

Source for the talk **"Export Momentum, Not Mass: the lunar mass driver as the keystone of cislunar — and interstellar — logistics."**

Target venue: 2nd IRG/IAA European Interstellar Symposium, Venice, 2–4 Dec 2026.
Companion to `../master-draft.md` ("The Long Bootstrap") and `../mass-driver-proposal.md`.

## Build

`build.js` is the source of truth. The `.pptx` is a build artifact — regenerate it, don't hand-edit:

```
npm install pptxgenjs
node build.js          # writes irg-venice-mass-driver.pptx in cwd
```

16 slides, 16:9 (13.333×7.5"). Palette: deep navy + regolith copper + guidance cyan. Header Georgia / body Calibri.

## Argument spine

Thesis → cislunar-as-precursor bridge → stock vs flow → Heinlein/TANSTAAFL → no proven reserves → ground-truth timeline → throw-the-rock energy case → O'Neill (solved launcher, unsolved catch) → one problem in three costumes → why-now GNC unlock → three architecture moves → keystone demonstrator + phasing → interstellar payoff → risks & dual-use → close + ask.

The interstellar framing (slides 3 and 14) is load-bearing for this audience; without it the talk reads as LEO logistics.
