# <span style="color:#1f6feb">Taifêddán: decision record</span>

*Irish: recorder (the device). Téarma.ie glosses* taifeadán eitilte *as "flight recorder" and* taifead iniúchóireachta *as "audit log". Pronunciation not verified; check with ga-say.*

**Status: shelved 2026-09-30. Decided by Todd. No code was written.**

## <span style="color:#1f6feb">What it was</span>

A proposed open-source PyPI library giving any FoxxeLabs component a durable, tamper-evident, encrypted record of what it did, with a tested backup and restore path. It grew out of the "AI Flight Recorder" question: what should an AI system's Article 12 event log contain, beyond the biometric-identification minimum the EU AI Act sets.

## <span style="color:#1f6feb">Why it was shelved</span>

- The recorder layer is already covered publicly. Three preprints dated 1 to 6 September 2026 (arXiv 2609.01931, 2609.04017, 2609.06445), a draft European logging standard and several open-source tools all address it. The reference implementation for the first (github.com/mpi-dsg/agent-flight-recorder, MIT, commit 28ddcde) is installable today.
- It is not on the six-month build list, and nothing in the portfolio earns money. The Aibosca M0 brief has no audit or compliance requirement.
- Article 12 is deferred to 2 December 2027 for stand-alone high-risk systems (Regulation (EU) 2026/1744), so there is no forcing date.
- A solo-maintained security-adjacent library carries a liability that a plain internal log does not.
- Repo search found no tamper-evident logging in any fleet repo, but many hand-rolled append-only logs (Aigne RunLog, Ceann records, Aislinge metrics, Colainn baselines, Fáire agent_events, Fíosrú audit rows).

## <span style="color:#1f6feb">Options considered</span>

| Option | Cost | Outcome |
|---|---|---|
| A. Shelve; keep the research | Zero | **Chosen** |
| B. Upstream a crash-safe store to `afr` | About 2 to 3 days | Optional cheap probe of appetite |
| C. Private module inside Aigne | Moderate | Rejected: breaks Aigne's charter (routing, telemetry, power policy only) |
| D. Public general-purpose library | 10 to 13 days plus upkeep | Rejected for now |

## <span style="color:#1f6feb">Revisit if</span>

- A named customer, regulator or partner asks for tamper-evident agent records.
- Todd wants a public artifact for credibility (then option B beats D).
- 2027 approaches and the draft standards (prEN 18229-1, ISO/IEC 24970) become readable and leave a custody or retention gap this could fill.

## <span style="color:#1f6feb">Things to reconcile before reusing the PRD</span>

- The PRD's cold tier is Backblaze B2 with Object Lock. `projects.json` records a tiered resilience plan for Mnemos using Cloudflare R2 ("R2 backup unresolved", as of 2026-04-03). Decide which; Object Lock support on R2 was not checked.
- Daisy's manifests list `rclone`, `rsync` and the `b2` snap, which suggests B2 tooling, but no backup configuration was found in the repos searched (search covered cached repos only and was truncated).
- The Oidhreacht hardware register (`inventory/hardware.md`) asks what off-box backups exist and points at Cúltaca, but Cúltaca is provider failover for coding, not data backup.

## <span style="color:#1f6feb">Files</span>

- `RESEARCH-BRIEF.md`: the research, with verification labels.
- `PRD.md`: the full design for the library, including the storage and backup architecture. Not built.
- Follow-up article: `src/content/resources/who-reads-the-black-box.md` in `foxxelabs-astro` (draft).

---

*FoxxeLabs Limited · 2026-09-30*
