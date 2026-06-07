<h1><span style="color:#1a5276">Forge Migration &amp; Cloudflare Deploy — Parked</span></h1>

<p><strong><span style="color:#7d3c98">Date:</span></strong> 2026-06-07 &nbsp;|&nbsp; <strong><span style="color:#7d3c98">Status:</span></strong> <span style="color:#b9770e">PARKED — no action taken</span></p>

<h2><span style="color:#1a5276">Question</span></h2>

What to use instead of GitHub, and what happens to Cloudflare deploy workflows/integrations if we move.

<h2><span style="color:#1a5276">Findings — forge alternatives</span></h2>

- <strong>Correct primary:</strong> self-host <strong>Forgejo</strong> (Codeberg-backed Gitea hard fork, AGPL). Single Go binary, Postgres/SQLite, Forgejo Actions (GH-Actions-compatible), packages + releases. Drop onto Daisy (dev box, on mesh) or a Fly machine with a volume. git-mcp speaks plain git, so agentic tooling is unaffected — just repoint remotes.
- <strong>Hosted, non-Microsoft:</strong> Codeberg (Forgejo instance, public-oriented, no AI training on code — good as public mirror); GitLab SaaS (heavyweight, full CI/CD); SourceHut (email/patch workflow, minimal).
- <strong>Chosen split:</strong> Forgejo on own infra = source of truth; Codeberg or thin GitHub mirror for public-facing repos (aithint, Foxxe-facing). Canon stays private + self-owned.

<h2><span style="color:#1a5276">Findings — Cloudflare deploy</span></h2>

- Cloudflare native git integration (<strong>Pages</strong> AND newer <strong>Workers Builds</strong>) only connects to <strong>GitHub + GitLab SaaS</strong>. Self-hosted GH/GitLab explicitly unsupported; Forgejo/Gitea/Codeberg/Bitbucket not supported at all.
- Leaving GitHub = push-to-deploy git hook is gone (unless GitLab SaaS).
- <strong>Cloudflare's documented path for our case:</strong> Direct Upload project + deploy via CI with Wrangler CLI. This is the architecturally correct decoupling regardless.

<h3><span style="color:#117864">Decoupled pipeline</span></h3>

<pre>
Forgejo Actions runner (Daisy/Iris)
  -> build (astro build / vite build)
  -> wrangler pages deploy ./dist     # Pages
  -> wrangler deploy                  # Workers
  auth: CLOUDFLARE_API_TOKEN (scoped) + CLOUDFLARE_ACCOUNT_ID as secrets
</pre>

- Forgejo Actions = GH-Actions-compatible YAML; <code>cloudflare/wrangler-action</code> runs ~unmodified on a Forgejo runner.
- <strong>Workers unaffected</strong> — always Wrangler-deployed. Only Pages projects (foxxelabs-astro, Anseo front) lose the auto-deploy hook.
- <strong>Trade:</strong> lose zero-config preview-per-PR + build-on-push (rebuild explicitly; <code>wrangler pages deploy --branch=&lt;name&gt;</code> still mints preview URLs). Gain reproducible, host-agnostic builds on owned hardware.

<h2><span style="color:#1a5276">Forward note</span></h2>

Cloudflare is converging Pages into Workers (Workers Builds + static-asset Workers = steered path; Pages in slow-sunset). Durable target for Astro/static sites = <strong>Worker with static assets</strong>, deployed by Wrangler — not a new Pages project. Same Wrangler-in-CI spine, not built on the deprecating primitive.

<h2><span style="color:#1a5276">Next action (when unparked)</span></h2>

Forgejo Actions workflow file for the Astro -> Workers-assets path.
