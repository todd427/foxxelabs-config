# <span style="color:#1f6feb">Taifêddán: PRD v0.1 (shelved, not built)</span>

*Irish: recorder (the device). The Irish government terminology database gives* taifeadán eitilte *for "flight recorder" and* taifead iniúchóireachta *for "audit log".*

<span style="color:#6e7781">Date: 2026-09-30. Status: shelved the same day by Todd; see README.md for the decision and RESEARCH-BRIEF.md for the research. Kept as a design record. PyPI names `taifeadan` and `taifead` were both unregistered when checked on 2026-09-30. The names `afr` and `agent-flight-recorder` are taken by unrelated projects, and `flightrec` by an eval harness. Note: the fleet-specific defaults below (Taisce, Féith, Aigne) were meant to live in adapters behind key-source, storage-target and anchor protocols, so the core would be general purpose.</span>

## <span style="color:#1f6feb">1. Purpose</span>

A small, dependency-light Python library that gives any component (Aigne, Gléas, Tuiscint, Claude Code hooks) a durable, tamper-evident, encrypted record of what it did, with a tested backup and restore path. It is the storage and custody layer that the published agent-recorder papers leave as "future work".

**Non-goals.** It is not a new event standard, an observability dashboard, an anchoring blockchain client, or a compliance engine. It does not decide what is reportable under the EU AI Act.

## <span style="color:#1f6feb">2. Decisions</span>

| # | Decision | Reason |
|---|---|---|
| D1 | A library, not an Aigne feature. | Aigne's charter is routing, telemetry and power policy, and it must not become load-bearing. A library lets Aigne, Gléas and Tuiscint share one recorder, as they share `giul`. |
| D2 | Vendor the core of Bindschaedler et al.'s MIT-licensed `afr` (schema, chain, Merkle, verifier, disclosure: about 1,040 of its 2,531 lines) and replace its in-memory recorder. | Their README states events stay in memory until export and that it is not a crash-safe logging service. Everything else is reusable. |
| D3 | Keep `afr`'s eight event fields and its hash construction, and put our extensions inside the eight dict fields. | `afr`'s loader drops unknown top-level keys, so extensions inside the dicts keep archives verifiable by the upstream verifier. This is an acceptance test (M0), not yet verified. |
| D4 | No `web3` dependency in the core. Anchors are a plugin protocol. | `afr` imports `web3` at package load. A single-operator fleet does not need on-chain anchoring; the paper itself says a hash chain on write-once storage suffices for internal audit. |
| D5 | Epoch keys are random and wrapped under a master key, not derived from it. | Erasure by key destruction only works if the epoch key cannot be re-derived. This deviates from `afr`'s HKDF-from-master scheme. Payload encryption is off-chain, so verification is unaffected. |
| D6 | Fail open by default, fail closed by option. | Matches Aigne's rule that an observer never takes the request path down. Every drop is recorded as a gap event once the writer recovers. |
| D7 | Apache-2.0 for our code, with the MIT notice for vendored modules kept in `THIRD_PARTY.md`. | Consistent with Cuimhin and Úire. MIT permits this. |

## <span style="color:#1f6feb">3. Event model</span>

Identity fields as in `afr`: `event_id`, `timestamp_ms`, `sequence_number`, `session_id`, then `prev_hash`, `logical_clock`, `concurrency_group`. The eight semantic fields are `intent`, `policy_eval`, `approval`, `execution`, `effects`, `context_provenance`, `code_provenance`, `delegation`. All are optional dicts, so an emitter fills only what it can see.

**Event kinds** (a `kind` key inside `intent`, or inside `execution` for lifecycle events): `model_call`, `tool_action`, `approval`, `lifecycle`, `gap`, `recovery`.

**Extensions carried inside the dicts:**

- `delegation.trajectory_id`, `delegation.parent_event_hash`: the cross-emitter join key. Aigne emits `model_call` events and the harness emits `tool_action` events, and the verifier can link them (Mahale R11).
- `approval.presented_view_hash`, `approval.declared_reaction_timeframe_s`, `approval.decision_latency_ms`, `approval.workload_context`: the oversight-timing extension.
- `code_provenance.serving_stack`, `intent.sampling_key`, `intent.sampling_dist_ref`: optional replay fields (Mahale R5 to R7), meaningful only for self-hosted models.

## <span style="color:#1f6feb">4. On-disk layout</span>

```
<root>/
  MANIFEST.json           store id, schema version, epoch_size, key_id (never the key)
  LOCK                    flock, one writer per store
  segments/
    seg-00000001.cbor     frames: [u32 length][canonical CBOR event record][u32 crc32c]
    seg-00000001.seal     written at seal: first/last sequence, epoch roots, sha256 of the segment
  payloads/
    epoch-000001/<event_id>.enc      AES-256-GCM ciphertext (zstd before encrypt)
  keys/
    epoch-000001.key      epoch key wrapped under the master key
  checkpoints/
    cp-000001.json        epoch number, root R_t, timestamp, anchor receipts
  index.sqlite            optional query index, rebuildable from segments
```

**Integrity structures** are exactly `afr`'s: SHA-256 hash chain over events, Merkle tree per epoch (default 100 events), epoch roots chained `R_t = H(M_t || R_{t-1})`. Chain and Merkle operate on event records that hold payload hashes, never payloads.

**Write path.** One writer task owns the store. `record()` puts the event on a bounded queue and returns; the writer assigns the sequence number, hashes, appends the frame, and fsyncs according to `durability`:

- `always`: fsync per event. RPO zero, highest latency.
- `batch` (default): group commit every 50 ms or 32 events.
- `epoch`: fsync at epoch seal only. Lowest cost, loses up to one epoch on power failure.

**Sealing.** At each epoch boundary, or after 10 minutes idle, the writer computes the Merkle root, writes the checkpoint, and rotates the segment when it reaches 64 MiB or on an epoch boundary after 24 hours. A sealed segment is never modified again.

**Crash recovery.** On open the writer scans the last segment, validates each frame's CRC, truncates a torn tail, and appends a `recovery` event stating the truncated byte count and last good sequence number. History is never silently shortened.

## <span style="color:#1f6feb">5. Keys, payloads and erasure</span>

- **Master key.** 32 random bytes, obtained through a `KeySource` callable. Built-in sources: Taisce (the fleet vault), environment variable for tests, file with mode 0600.
- **Epoch keys.** Random 32 bytes per epoch, wrapped under the master with AES-GCM, stored in `keys/`. Per-event payload keys are `HKDF(K_t, event_id)`, as in `afr`, so selective disclosure of one event does not reveal the epoch.
- **Erasure.** `shred(epoch)` deletes the wrapped epoch key from the store and every replica. Payloads become unreadable, and the chain, roots and payload hashes still verify. Whether this satisfies GDPR is legally unproven, and the authors of `afr` say the same of their scheme.
- **Master key loss** makes every payload unrecoverable. The master is backed up separately (section 7) and never appears in any backup set that holds ciphertext.

## <span style="color:#1f6feb">6. Public API</span>

```python
from taifeadan import Store, Recorder, KeySource, GitAnchor

store = Store.open("/home/Projects/data/taifeadan/aigne", epoch_size=100, durability="batch")
rec = Recorder(
    store,
    keys=KeySource.taisce("taifeadan/aigne-master"),
    anchors=[GitAnchor("/home/Projects/taifeadan-checkpoints")],
    on_overflow="drop_and_mark",          # or "block" for fail-closed
)
ev = rec.record(
    kind="model_call",
    intent={"tool_calls": tool_calls},
    context_provenance={"messages_hash": messages_hash, "tier": "granite", "node": "iris"},
    code_provenance={"config_hash": cfg_hash, "aigne": "0.1.0"},
    delegation={"trajectory_id": tid, "parent_event_hash": parent},
    payload={"messages": messages, "completion": text},   # encrypted, stored off-chain
)
rec.close()
```

CLI: `taifeadan verify STORE [--checkpoint cp.json] [--afr-compat]`, `taifeadan seal`, `taifeadan shred STORE --epoch N`, `taifeadan backup STORE --target NAME`, `taifeadan backup-verify`, `taifeadan restore --from TARGET --to DIR`, `taifeadan export STORE --afr out.cbor`.

## <span style="color:#1f6feb">7. Backup and retention</span>

**Why append-only makes backup easy.** Sealed segments, seal files, checkpoints and encrypted payload directories never change, so each is uploaded once. Only the open segment and open epoch are live.

**Three copies, two media, one immutable.**

| Tier | Where | What | Cadence |
|---|---|---|---|
| Hot | The recording host's local disk | Everything | Live |
| Warm | A second fleet node over the Féith mesh, by rsync over SSH | Sealed segments, payloads, checkpoints, wrapped epoch keys | Every 5 minutes for sealed files; open segment tail every 60 seconds |
| Cold, immutable | S3-compatible bucket with Object Lock in compliance mode (Backblaze B2 verified to support it) | Sealed segments, seal files, checkpoints, encrypted payloads | On each seal |

**Keys travel separately.** Wrapped epoch keys go to the warm tier and to a second bucket without Object Lock, so `shred` can delete them. Locked objects cannot be deleted before retention expires, which is why only ciphertext and hashes are ever locked. The master key lives in Taisce and in the printed envelope that the Oidhreacht register already calls for. It is in no backup set that contains ciphertext.

**Object Lock facts verified against Backblaze's documentation:**

- It works through the S3-compatible API and the native API.
- In compliance mode no user, including the account root, can remove or shorten the retention, though it can be extended.
- Retention is 1 to 3,000 days (about 8.2 years).
- Files are not immutable until a default retention is set on the bucket.
- Enabling it is permanent.

The 3,000-day ceiling is shorter than a ten-year retention target, so the library ships a `relock` job that extends retention on objects nearing expiry.

**Open point:** `projects.json` records a tiered resilience plan for Mnemos on Cloudflare R2. Reconcile the cold tier with that plan before building; Object Lock support on R2 was not checked.

**Trusted checkpoint.** Verification needs a head checkpoint stored where the operator and the agents cannot rewrite it, or a valid prefix cannot be told from a complete log (the `afr` README says so). v0.1 anchors each checkpoint by committing it to a separate private git repository and pushing it (`GitAnchor`), and by copying it to the warm node (`FileAnchor`). RFC 3161 timestamping, OpenTimestamps and a SCITT transparency service (RFC 9943) are later anchors.

**Restore drill.** `taifeadan restore-check` pulls the latest backup into a scratch directory, verifies chain, epochs and checkpoint, decrypts a random sample of payloads with the escrowed master key, and reports the wall-clock time. It exits non-zero on any failure and is designed to run from a systemd timer monthly. An untested backup is not counted as a backup.

**Retention policy** (`retention:` in the store config): `min_days` (default 183, the six-month floor of Articles 19 and 26(6)), `target_days` (default 3650, parity with the ten-year documentation period), and `shred_after_days` (optional). Backup lifecycle rules must be set to match; the library refuses to `backup` to a target whose declared retention is shorter than `min_days`.

**Sizing.** Stored bytes per event are about 512 for the integrity record plus the compressed payload. Payload dominates. Illustrative, not measured: with an 8,192-token context (Gléas's `max_model_len`) a full prompt is at most about 32 KB of text, so 1,000 requests a day is at most about 32 MB a day raw, about 11.7 GB a year, and roughly a third of that after zstd if text compresses about 3 to 1. `taifeadan stats` reports actual figures from a live store so the real numbers replace this estimate after a week of traffic.

## <span style="color:#1f6feb">8. Packaging</span>

- Name `taifeadan`, import `taifeadan`, Python 3.11 or later, venv at `/home/Projects/venvs/taifeadanEnv`, repo `/home/Projects/taifeadan`.
- Core dependencies: `cbor2`, `cryptography`, `zstandard`. Extras: `[s3]` (boto3 for B2 and other S3 targets), `[otel]` (OpenTelemetry span processor), `[ots]`.
- Quality gates: pytest with an 80 percent coverage gate, ruff, mypy, pip-audit, matching the upstream repo's own gates.
- Publishing through PyPI trusted publishing from GitHub Actions; the first release is 0.1.0 at the end of M3.
- Aigne, Gléas and the OTel adapter live in their own repos and import `taifeadan`. The library contains no fleet-specific code.

## <span style="color:#1f6feb">9. Milestones and acceptance tests</span>

Effort figures are my estimates for a Claude Code build against this PRD, not measurements.

| M | Scope | Acceptance | Estimate |
|---|---|---|---|
| M0 | Scaffold, vendor `afr` modules pinned to commit 28ddcde, `THIRD_PARTY.md`, event dataclass with extensions. | A taifeadan export verifies under upstream `afr verify`; edit, delete, reorder and fork tampering are detected as in the paper's tables. | 1 to 2 days |
| M1 | Durable store: framed segments, single writer, fsync modes, seal, recovery, gap and recovery events. | A kill -9 loop of at least 500 crashes at random points leaves every store verifiable, with no acknowledged `always`-mode event lost. | 2 to 3 days |
| M2 | Vault: payload encryption, wrapped epoch keys, disclosure, `shred`, Taisce `KeySource`. | After `shred(epoch)`, payloads for that epoch fail to decrypt and the store still verifies; disclosure of one event key opens only that event. | 2 days |
| M3 | Checkpoints, `GitAnchor`, `FileAnchor`, backup targets (local dir, rsync, S3 with Object Lock), `backup-verify`, `restore-check`, `relock`. | A full restore from the cold tier onto a clean host verifies and decrypts a sample; the drill runs unattended from a timer. | 3 days |
| M4 | Adapters: Aigne sink, OTel GenAI span processor (pinned to the Development-status conventions), Gléas hook example. | Aigne emits `model_call` events with zero added failures under a 10,000-request soak; recorder cost stays outside Aigne's energy-meter window. | 2 to 3 days |

## <span style="color:#1f6feb">10. Risks</span>

- **Upstream prototype quality.** `afr` is at 0.1.0 with two commits. We vendor and test it rather than trust it, and the M0 compat test is the tripwire if either side drifts.
- **Completeness.** The recorder proves integrity of what reaches it, not that everything reaches it. Calls that bypass the tap are invisible. Document the taps in each adapter.
- **Key loss and legal exposure.** Master key loss destroys payloads; retained personal data is a GDPR controller matter for the operator. Both are documented in the README, not solved.
- **Scope creep toward a standard.** Nothing here proposes a new event standard. Contributions that would (custody profile, oversight timing) go upstream or into a separate short note.

## <span style="color:#1f6feb">11. Sources checked</span>

- Bindschaedler, Botha, Siebenbrunner, "Agent Flight Recorder", arXiv 2609.01931 (https://arxiv.org/html/2609.01931v1) and reference code (https://github.com/mpi-dsg/agent-flight-recorder, MIT).
- Mahale, arXiv 2609.06445 (https://arxiv.org/abs/2609.06445), requirements R1 to R12.
- Backblaze Object Lock documentation (https://www.backblaze.com/docs/cloud-storage-object-lock, https://www.backblaze.com/docs/cloud-storage-enable-and-manage-lock-features).
- RFC 9943 (https://www.rfc-editor.org/info/rfc9943/).
- Irish terminology (https://super.tearma.ie/q/record).

---

*FoxxeLabs Limited · 2026-09-30*
