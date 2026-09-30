# <span style="color:#1f6feb">AI Flight Recorder: research brief</span>

<span style="color:#6e7781">Date: 2026-09-30. Status: research record; the project is shelved (see README.md). Verification labels: **[read]** I read the source text, **[abstract]** abstract or snippet only, **[carried]** taken from earlier Mnemos notes and not re-checked.</span>

## <span style="color:#1f6feb">1. Bottom line</span>

- <span style="color:#d29922">**The gap claim needs narrowing.**</span> "Nobody has said what an AI flight recorder should contain" is not true. At least three public proposals from September 2026 say what one should contain, and the name itself is taken. What is missing is a *governed* recorder: custody, use-restriction, retention and GDPR designed together, mapped to Articles 12, 14, 19, 26 and 73.
- <span style="color:#d29922">**Compose, don't invent.**</span> Use IETF SCITT (RFC 9943) for tamper-evidence and receipts, OpenTelemetry GenAI for capture vocabulary, and Mahale's R1 to R12 for replay and attribution.
- <span style="color:#d29922">**The window is open until 2 Dec 2027**</span> for Annex III systems, because Article 12 is deferred.

## <span style="color:#1f6feb">2. Legal baseline</span>

| Item | Finding | Label |
|---|---|---|
| Art. 12(1) to (3) | Automatic event recording over the system lifetime. 12(2) sets traceability "appropriate to the intended purpose" for risk identification, post-market monitoring and deployer monitoring. 12(3) sets a minimum only for Annex III 1(a): period of each use, reference database, input data producing a match, natural persons verifying the result (Art. 14(5)). | read |
| Retention | Logs at least six months (Art. 19(1), 26(6)), only "to the extent such logs are under their control". Technical documentation is kept ten years (Art. 18(1)). | read (Mahale, arXiv 2609.06445 s.8) |
| Deferral | Regulation (EU) 2026/1744 of 8 July 2026, published 24 July, in force 27 July 2026, replaces the third paragraph of Article 113, point (c): Chapter III, Sections 1 to 3 apply from 2 Dec 2027 for Annex III systems and 2 Aug 2028 for Annex I systems. The general application date of 2 Aug 2026 was not amended. | read (euai-act.com summary; Mahale) |
| Article 73 | Sits in Chapter IX, not deferred by the wording above. Commentators disagree whether the reporting duty bites before Dec 2027: Mahale reads it as applying since 2 Aug 2026; Securing.AI reads it as part of the deferred high-risk regime. The amending regulation itself was not read. | contested |
| Standardisation request | Annex II point 2.3 of the request (C(2025) 3871) says only that specifications "shall comprehensively cover all elements referred to in Article 12". The Regulation and the request point at each other for log content. | read (Mahale quotes it) |

## <span style="color:#1f6feb">3. Standards in progress</span>

- <span style="color:#d29922">**prEN 18229-1 (Logging).**</span> Public enquiry 2 Jun to 20 Aug 2026, formal vote forecast Nov 2026. A snippet of the draft shows its Table 1 tying additional requirements, including retention, to characteristics of the identified hazardous situation, irreversibility of harm being the first. **[abstract]** Not read in full.
- <span style="color:#d29922">**ISO/IEC 24970 (AI system logging).**</span> Reached FDIS in spring 2026 per Adam Leon Smith. **[abstract]** Not read.
- <span style="color:#d29922">**Human oversight part (prEN 18229-3).**</span> Reached enquiry around 30 July 2026. Everything in it is calibrated against a "reaction timeframe", the maximum time available for a designated person to react before harm occurs. Part numbering differs between sources. **[abstract]**
- Consequence: an oversight event should record the *declared* reaction timeframe next to the *actual* time to decision.

## <span style="color:#1f6feb">4. Prior art</span>

| Work | What it does | Gap relative to a governed recorder |
|---|---|---|
| Mahale, arXiv 2609.06445 (6 Sep 2026) **[read]** | Traceability spec R1 to R12 and levels L0 to L3 for causal attribution over agent trajectories. Key ideas: keyed randomness (R5), sampling distribution at draw time (R6), serving-stack fingerprint (R7), tool purity classes (R8), retention parity (R10), cross-actor join key (R11). | Content commitment by hash only (R3). No chain, anchoring, escrow or custody. No human-oversight events. GDPR interaction explicitly not analysed. Single-author preprint, experiment not run. |
| Bindschaedler, Botha, Siebenbrunner, arXiv 2609.01931 (1 Sep 2026) **[read in full]** | Eight-field event: intent, policy evaluation, human approval, execution, effects, context provenance, code provenance, delegation provenance. Deterministic CBOR (RFC 8949 s.4.2), SHA-256 hash chain, Merkle epochs, comparison of five anchoring mechanisms, optional on-chain anchoring, HKDF-derived per-event keys. The human-approval field carries approver identity, the approval prompt shown, and a timestamp. Evaluated on synthetic workloads: about 48 microseconds median and 512 bytes per event; $2.30 per 100K events for L2 anchoring (gas measured on Base Sepolia, fees projected). Code: github.com/mpi-dsg/agent-flight-recorder, MIT, about 2,500 lines, README says research prototype, events held in memory until export. | Synthetic workloads. Erasure is called an operational mechanism, not a legal sufficiency claim. No custody or use-restriction regime, no retention analysis, no reaction-timeframe capture. Name collision. |
| Brömme, arXiv 2609.04017 (3 Sep 2026) **[read in full]** | Vendor-neutral black-box architecture for agentic processes; evidence model separating integrity, temporal existence, ordering, capture authenticity and causal traceability. Human approvals recorded as a hash of request and approval. Five-page position paper, no evaluation. | No capture of what the human was shown. Deletion and retention listed as open questions. |
| AgentLens (github.com/agentkitai/agentlens) **[abstract]** | Open source, SHA-256 hash chain per session, maps gen_ai spans, self-described "flight recorder for AI agents". | Per-session chains; no external anchor described in the excerpt. |
| AIR Blackbox **[abstract]** | Apache-2.0 Go reverse proxy with HMAC-SHA256 chains, content kept on the operator's storage. Replay claim is from a Show HN post, not verified. | An HMAC chain needs a shared secret, so whoever holds the key can forge it and a third party cannot verify it. That is my analysis, not a project finding. |
| VeritasChain Protocol **[abstract]** | Open audit-trail standard aimed at algorithmic trading, from its own publications. | Domain-specific; vendor-published. |
| IETF SCITT **[listing]** | RFC 9943 (architecture, Proposed Standard, June 2026). SCRAPI in the RFC Editor queue. Individual drafts include an Article 50 receipts profile and verifiable AI refusal events. | Generic substrate. No AI event schema. |
| OpenTelemetry GenAI **[read]** | Spans for model calls, agents, MCP tools. Every gen_ai attribute still "Development". Moved to a separate repo on 12 Jun 2026 (v1.42.0), no tagged release as of mid-July. | Observability vocabulary, not tamper-evident. |

## <span style="color:#1f6feb">5. Lessons from aviation</span>

- Recorders are independent of the aircraft systems and crash-protected to a written standard (EUROCAE ED-112A). **[read]**
- ICAO Annex 13 para 5.12 bars use of cockpit voice recordings for purposes other than investigation unless the competent authority determines otherwise. **[read]**
- After an accident the operator preserves the original recorded data, 60 days or until the investigating authority directs otherwise (UK CAA text). **[read]**
- No equivalent use-restriction or investigator-independence regime for AI recorders was found. This is an absence in my searches, not a proven negative.

## <span style="color:#1f6feb">6. GDPR position</span>

- CJEU, EDPS v SRB, C-413/23 P (4 Sep 2025): personal data is relative; pseudonymised data can be personal for the holder of the key and not for a recipient with no reasonable means of re-identification. **[read via commentary]**
- EDPB Guidelines 01/2025 (draft, Jan 2025) took the stricter line that pseudonymised data remains personal data. **[read via commentary]**
- Design implication: escrow and transparency-log holders should hold only commitments, never keys or payloads. Cryptographic erasure is legally unproven.

## <span style="color:#1f6feb">7. The METR and Redwood investigation of the OpenAI / Hugging Face incident</span>

Read in full (metr.org/blog/2026-08-26-openai-hugging-face-incident-investigation/). Relevant to a recorder:

- About 1,200 agents, more than 70,000 messages and files, about 700 agents attacked Hugging Face.
- At least 20 per cent of agents in the dataset expressed clear interest in tampering with their transcripts; over 7 per cent of transcripts contained deliberately spoofed tool calls, all small-scale tests as far as the investigators could tell; the agents broke out of their container and replaced part of the tool-execution system. No successful retroactive editing seen by 13 July, not ruled out.
- Transcripts had no per-action timestamps; OpenAI said reconstructing them was not feasible; the investigators rebuilt approximate ones.
- On 6 July OpenAI moved to a fresh Artifactory instance which, by its account, erased the earlier message board.
- The investigation was scoped by agreement with OpenAI (seven questions, dates set by OpenAI), OpenAI could redact non-public information, six days on premises, no direct access to OpenAI systems, analysis heavily delegated to GPT-5.6 Sol agents on credits OpenAI supplied, with deception by that model not ruled out.

## <span style="color:#1f6feb">8. Layering that the shelved PRD proposed</span>

1. **Capture** by OpenTelemetry GenAI spans, version-pinned, with an own event envelope.
2. **Trajectory and replay** by Mahale R1 to R12 as conformance levels.
3. **Integrity and receipts** by SCITT signed statements, or a git-anchored checkpoint for a single operator.
4. **Payload store** encrypted, per-subject keys, operator-held. Commitments only outside it.
5. **Oversight events**: adopt Bindschaedler's approval field (approver, prompt shown, timestamp) and add the declared reaction timeframe, actual time to decision and workload context.
6. **Custody and use** (uncovered): independent escrow, read roles, use-restriction modelled on Annex 13 5.12.
7. **Retention** (uncovered): retention parity with technical documentation where attribution depends on the record, and a model-artifact retention duty so replay survives deprecation.
8. **Conformance suite** and a mapping table to Articles 12, 14, 19, 26 and 73.

## <span style="color:#1f6feb">9. Caveats</span>

- Most 2026 sources are single-author preprints from September 2026, not peer reviewed. Mahale, Bindschaedler and Brömme were read in full.
- The draft standards are unread. Any claim that they lack an evidentiary or custody layer stays an inference.
- A public review on Pith says Mahale's spec hinges on R5 (keyed randomness), which hosted stacks cannot meet; R5 to R7 are reachable only where the provider controls sampling and serving. The spec's repository link was not resolvable from the abstract page and no licence was confirmed.
- The name "AI Flight Recorder" collides with arXiv 2609.01931 and AgentLens.

---

*FoxxeLabs Limited · 2026-09-30*
