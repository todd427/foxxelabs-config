# <span style="color:#16A085">Deploying The Forge</span>

The site is a Vite + React app that builds to a **single self-contained `dist/index.html`** (everything inlined — no external JS/CSS). Verified building clean (1499 modules, ~182 KB / ~59 KB gzipped). Drop that one file on any static host.

All commands run from `the-forge/site/`.

## <span style="color:#34495E">Build</span>

```sh
npm install
npm run build      # -> dist/index.html (single file)
npm run preview    # local check at http://localhost:4173
```

## <span style="color:#34495E">Deploy — Cloudflare Pages (primary; matches the Sionnach setup)</span>

CLI, one shot:

```sh
npm run build
npx wrangler pages deploy dist --project-name the-forge
```

Or connect the repo in the Pages dashboard:
- Root directory: `the-forge/site`
- Build command: `npm run build`
- Output directory: `dist`

Then point `forge.foxxelabs.ie` at the Pages project (CNAME).

## <span style="color:#34495E">Deploy — Fly.io (fallback; static nginx)</span>

`Dockerfile` and `fly.toml` are included.

```sh
npm run build      # dist/ must exist before deploy
fly launch --no-deploy --copy-config --name the-forge   # first time only
fly deploy
```

## <span style="color:#34495E">60-second option</span>

Drag the `dist/` folder onto <https://app.netlify.com/drop> for an instant throwaway URL — useful for sharing a preview before wiring DNS.

## <span style="color:#C0392B">Known gaps before this is "launch" rather than "live"</span>

- **Share button is a stub** (`alert`). The real share loop is a server-rendered spec-card image + OpenGraph meta per build URL so the link unfurls as the card. Static single-file can't do per-build OG images — that step needs either build-time pre-rendering of one card per archetype, or a tiny edge function.
- **Doorways must land somewhere.** Don't drive traffic until at least one of Macalla / Cló / Anseo has a real page on the other side. Anseo is closest to live.
- **Brand string** "a FoxxeLabs destination" may need a rename once the company name resolves (CRO rejected FoxxeLabs).
