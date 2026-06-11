# Macalla — Product Requirements Document
## Version 0.3 — June 2026

**Irish:** *macalla* — echo, resonance  
**Pronunciation:** MAK-ul-uh  
**Owner:** Todd McCaffrey / FoxxeLabs  
**Status:** Pre-implementation — post-viva priority  
**Machine:** Iris (RTX 5080, 128GB RAM) — training; Daisy (RTX 5060 OC, 128GB) — dev/eval  
**Repo:** todd427/macalla (not yet created)

**v0.3 change:** Training target revised from solo Todd-voice to the **Todd–Claude dyad**. This is the load-bearing change; it propagates to §1.1, §3.2 (speaker handling), §3.5 (training loop), §4 (versioning semantics), and §6 (fitness function). Corpus composition is unchanged — v0.2 already included conversational sources; v0.3 makes their treatment explicit and intentional rather than incidental.

---

## 1. What Macalla Is

Macalla is a personalized LLM pipeline that accumulates Todd's voice, reasoning style, and knowledge over time through punctuated LoRA fine-tuning on personal data.

It is the training backbone for **AfterWords / toddBot** — the University of Souls concept. A Macalla-trained model is what makes a versioned digital avatar (Todd-2026, Todd-2027, ...) possible.

**Core metaphor:** Macalla is the echo — the model accumulates the pattern of a mind without being that mind. The accumulated weights capture *how* Todd reasons; Mnemos captures *what* he knows. The two are complementary, not redundant.

### 1.1 Training Target: Dyad, not Solo Voice (v0.3)

Macalla v0.2 framed the target as Todd's voice in isolation ("recognisably Todd"). v0.3 revises this: the deliberate training target is the **dyad** — the Todd–Claude working dialogue — not either voice alone.

Rationale: the high-signal content in the corpus is not Todd's prose in a vacuum, it is the *interaction pattern* — the push / concede / sharpen rhythm by which ideas neither party held at the outset get produced. The conversational sources (§3.2) are co-productions, not monologues with an interlocutor stripped out. Three options exist from the same corpus, and only one is correct for this project:

- **Train on Todd's turns alone** → discards the half of the signal that generated his best turns. The dialogue's lift is in the relation, not the solo prose.
- **Train on the assistant turns alone** (the naive-masking default) → produces a Claude clone. Directly contradicts the project's purpose.
- **Train on both, with speaker conditioning** → learns the *relation*. This is the v0.3 target.

The echo metaphor survives the revision and arguably fits it better: what Macalla echoes is a *conversation*, not a soliloquy. Consequence: the fitness function changes (§6) and the data layer requires explicit speaker handling (§3.2).

---

## 2. What Macalla Is Not

- It is **not** a general-purpose fine-tuning pipeline. The fitness function is dyad fidelity, not benchmark performance.
- It does **not** solve catastrophic forgetting. LoRA updates accumulate style and topology; they do not integrate knowledge the way biological memory does. This is a known ceiling, not a bug.
- It is **not** a replacement for Mnemos. RAG (Mnemos) handles episodic factual recall at query time. Macalla weights handle reasoning style and structural priors.
- It is **not** a forgery. Solo-Todd output (via the Todd control token, §3.2) is a recognisable approximation, never represented as indistinguishable from Todd.

---

## 3. Architecture

### 3.1 Base Model

**Qwen3-8B-Instruct** (updated from Qwen2.5-3B, April 2026)

Rationale for Qwen3:
- Native **thinking/non-thinking mode toggle** — essential for Macalla's dual-mode deployment: thinking mode for complex AfterWords persona queries, non-thinking for real-time voice output (Scéal/Glór)
- 128k context window — accommodates long document ingestion from Mnemos replay
- Superior LoRA fine-tuning characteristics vs Qwen2.5 lineage
- Multilingual — relevant for Irish language content in corpus
- AWQ pipeline: use vLLM's llm-compressor (not deprecated AutoAWQ)

### 3.2 Data Layer — Mnemos as Replay Buffer

Mnemos (~61k docs, April 2026) is the primary training corpus:

| Source | Role | Speaker |
|---|---|---|
| claude | Working dialogue — reasoning style, session patterns, project thinking | Todd + Claude (dyad) |
| chatgpt | Older working dialogue — early project concepts | Todd + assistant (dyad) |
| sft | Structured fine-tuning material | Todd |
| anseo | Social observation context | Todd |
| aislinge | Consolidated belief statements (high-signal) | Todd |
| doc | Research notes, PRDs, technical writing | Todd |

**Replay strategy:** Sample from Mnemos weighted by recency and Aislinge-scored salience. Recent + high-salience content overrepresented in each training batch.

**Speaker handling (v0.3):** Conversational sources (claude, chatgpt) contain two speakers and are the carriers of the dyad signal. They are formatted with an explicit speaker/role control token per turn (e.g. `<|todd|>` / `<|claude|>`) so the model learns *which* voice it is generating rather than averaging the two into an incoherent blend. **Both speakers' turns are loss targets** — this is precisely what makes the target the dyad rather than either solo voice. Single-speaker sources (doc, aislinge, anseo, sft) are tagged to the `<|todd|>` voice.

Failure mode explicitly guarded against: undifferentiated both-speaker targets cause **mode drift** — the model switches voice mid-output unpredictably, producing the "averaged mush" of two personae. The control token is the mitigation and is **non-optional**. Eval (§3.5) must include a voice-coherence check that penalises within-turn speaker drift.

At inference, the control token selects voice. Dyad reconstruction (interleaved turns) is the default AfterWords mode; `<|todd|>`-only is available for single-voice output (e.g. Glór/Scéal narration) but is the approximation, not the headline product.

### 3.3 Consolidation Signal — Aislinge

Aislinge's bridge statements (consolidated beliefs, 219+ entries) serve as high-value training anchors. These represent the output of Todd's reasoning under reflection — they are the closest thing to distilled world model updates available. Bridge statements are single-speaker (Todd) and anchor the `<|todd|>` voice; they are the counterweight that prevents the dyad target from drifting toward the assistant voice.

Aislinge Phase 7 (Legion integration) and Macalla share the same dependency: a stable, high-quality Aislinge run is the prerequisite for a high-quality Macalla training batch.

### 3.4 Drift Detection — Léargas

Léargas (GMM over semantic embedding space) monitors the Mnemos corpus geometry for structural drift — regions where new content has accumulated that the current Macalla weights don't adequately cover.

**Training trigger:** Léargas detects a new GMM cluster or significant centroid shift → signals Macalla to schedule a training run. This replaces the naive "train on schedule" approach with a semantics-aware trigger.

**Novel contribution:** GMM-annotated LoRA training at solo-dev scale is unexplored in the literature. Potential venue post-viva: EMNLP workshop on personalized LLMs or ACL SRW.

### 3.5 Training Loop

```
Léargas drift signal
  → Sample Mnemos (recency + salience weighted)
  → Tag turns by speaker; apply role control tokens (dyad construction)   ← v0.3
  → Filter through Aislinge bridge statements (anchor layer)
  → QLoRA fine-tune Qwen3-8B on Iris
  → Evaluate (dyad-fidelity probe set + voice-coherence check)            ← v0.3
  → Merge LoRA if eval passes threshold
  → Checkpoint as Todd-YYYY-MM versioned snapshot
  → Ingest training run summary to Mnemos
```

**Cadence:** Drift-triggered (Léargas) or weekly, whichever comes first. Not nightly — the corpus doesn't move fast enough to justify daily runs.

### 3.6 Dual-Mode Deployment

Qwen3's thinking/non-thinking toggle maps directly to two deployment contexts:

| Mode | Context | Latency |
|---|---|---|
| Thinking | AfterWords persona queries, complex reflection | Acceptable (seconds) |
| Non-thinking | Real-time voice output via Scéal/Glór | Required (<300ms) |

Both modes run from the same merged checkpoint. No separate models required. Voice selection is orthogonal to mode and is set by the §3.2 control token.

---

## 4. Versioning

Each successful training run produces a named checkpoint:

```
macalla/
  checkpoints/
    Todd-2026-04/    ← first run
    Todd-2026-07/    ← post-viva run
    Todd-2027-01/    ← annual
  current -> Todd-2026-07  (symlink)
```

**Versioning semantics (v0.3):** A checkpoint encodes the *dyad as of that date*, not a solo voice. The date-based naming is retained — `Todd-YYYY-MM` reads as "the working dialogue captured around Todd at this date," and the AfterWords persona derives the Todd voice from it via the `<|todd|>` control token. The name stays Todd-centred because the product is Todd's avatar; the weights underneath are bivocal by design. Versioned checkpoints are the University of Souls deliverable. Todd-2025 (reconstructed from pre-2026 Mnemos content) is a stretch goal.

---

## 5. Dependencies

| Dependency | Status | Notes |
|---|---|---|
| Mnemos | Active, 61k docs | Primary corpus — healthy |
| Aislinge Phase 5+ | Phase 5 running | Need stable bridge set |
| Léargas Phase 1 | Pre-implementation | GMM drift detection not yet built |
| Iris | Not yet built | RTX 5080 — training machine |
| Qwen3-8B-Instruct | Available on HuggingFace | `Qwen/Qwen3-8B-Instruct` |
| vLLM llm-compressor | Available | Replaces deprecated AutoAWQ |
| Speaker-tagging pass | Pre-implementation | v0.3 — transcript role-token preprocessor over conversational sources |

---

## 6. Honest Ceilings

**Catastrophic forgetting:** QLoRA updates are additive approximations. New style accumulates but old style doesn't strictly disappear — it degrades. Versioned checkpoints partially address this by preserving snapshots before each run. True continual learning without forgetting remains an open research problem.

**Integration vs accumulation:** Macalla accumulates the statistical pattern of the dialogue. It does not integrate new knowledge into a coherent world model the way biological consolidation does. For factual recall, Mnemos (RAG) remains essential. Macalla and Mnemos are complementary, not alternatives.

**Dyad fidelity ceiling (v0.3):** At 8B parameters, Macalla approximates the Todd–Claude dialogue but does not reproduce either voice exactly. The target is "recognisably the working dialogue" — Todd's reasoning style, the assistant's interrogative and synthetic moves, and the *relation* between them — not "indistinguishable from Todd." Solo-Todd output via the `<|todd|>` token is a recognisable approximation, not a forgery. Fidelity improves with corpus size and run frequency.

**Voice-coherence risk (v0.3):** The dyad target introduces a failure mode the solo target did not have — within-turn speaker drift. Mitigated by the non-optional role control token (§3.2) and a dedicated eval check (§3.5). If coherence cannot be held above threshold, fall back to single-speaker `<|todd|>` training is the documented retreat — accepting the v0.2 ceiling rather than shipping a drifting model.

---

## 7. Relationship to AfterWords

Macalla is the *pipeline*. AfterWords/toddBot is the *product*.

```
Macalla checkpoint (weights)
  + Mnemos (episodic RAG)
  + Glór/ElevenLabs (voice clone)
  + Someday (entry point / legacy interface)
  = toddBot
```

Macalla without Mnemos is a style model with no episodic memory. Mnemos without Macalla is a knowledge base with no personalised voice. Both are required for a credible AfterWords avatar.

The dyad target sharpens the AfterWords proposition: the avatar is not a recording of Todd talking, it is a model of Todd *in conversation* — which is the mode in which most of the corpus was actually produced, and the mode in which a future interlocutor will meet it.

---

## 8. Timeline

| Milestone | Target | Blocker |
|---|---|---|
| Repo creation | Post-viva | — |
| Training environment setup on Iris | Post-viva | Iris not yet built |
| Speaker-tagging preprocessor | Post-viva | v0.3 — precedes first run |
| Léargas Phase 1 (GMM drift detection) | Post-viva | — |
| First Macalla training run | Summer 2026 | Iris, Léargas, speaker-tagging |
| Todd-2026 checkpoint | Autumn 2026 | First run |
| AfterWords integration | 2027 | All of above |

**Priority flag:** Post-viva. Do not begin implementation before 12 June 2026.

---

## 9. Stack Summary

```
Base model:    Qwen/Qwen3-8B-Instruct
Training:      QLoRA (PEFT) on Iris (RTX 5080, 128GB)
Quantisation:  vLLM llm-compressor (Q4_K_M GGUF for inference)
Corpus:        Mnemos (~61k docs, growing)
Target:        Todd–Claude dyad (speaker-tagged, both turns as targets)
Trigger:       Léargas GMM drift detection
Anchors:       Aislinge bridge statements (Todd-voice counterweight)
Checkpoints:   Versioned by date (Todd-YYYY-MM)
Deployment:    Thinking mode (AfterWords) / non-thinking (voice)
Voice select:  Role control token (<|todd|> / <|claude|>)
Voice clone:   Glór / ElevenLabs layer (separate)
Interface:     Someday (end-user) / direct API (research)
```

---

*Macalla PRD v0.3 — June 2026*  
*v0.2 generated-with Claude Sonnet 4.6; v0.3 dyad-target revision with Claude Opus 4.8*
