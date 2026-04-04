# Macalla — Product Requirements Document
## Version 0.2 — April 2026

**Irish:** *macalla* — echo, resonance  
**Pronunciation:** MAK-ul-uh  
**Owner:** Todd McCaffrey / FoxxeLabs  
**Status:** Pre-implementation — post-viva priority  
**Machine:** Iris (RTX 5080, 128GB RAM) — training; Daisy (RTX 5060 OC, 128GB) — dev/eval  
**Repo:** todd427/macalla (not yet created)

---

## 1. What Macalla Is

Macalla is a personalized LLM pipeline that accumulates Todd's voice, reasoning style, and knowledge over time through punctuated LoRA fine-tuning on personal data.

It is the training backbone for **AfterWords / toddBot** — the University of Souls concept. A Macalla-trained model is what makes a versioned digital avatar (Todd-2026, Todd-2027, ...) possible.

**Core metaphor:** Macalla is the echo — the model accumulates the pattern of a mind without being that mind. The accumulated weights capture *how* Todd reasons; Mnemos captures *what* he knows. The two are complementary, not redundant.

---

## 2. What Macalla Is Not

- It is **not** a general-purpose fine-tuning pipeline. The fitness function is personal voice fidelity, not benchmark performance.
- It does **not** solve catastrophic forgetting. LoRA updates accumulate style and topology; they do not integrate knowledge the way biological memory does. This is a known ceiling, not a bug.
- It is **not** a replacement for Mnemos. RAG (Mnemos) handles episodic factual recall at query time. Macalla weights handle reasoning style and structural priors.

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

| Source | Role |
|---|---|
| claude | Reasoning style, session patterns, project thinking |
| chatgpt | Older reasoning style, early project concepts |
| sft | Structured fine-tuning material |
| anseo | Social observation context |
| aislinge | Consolidated belief statements (high-signal) |
| doc | Research notes, PRDs, technical writing |

**Replay strategy:** Sample from Mnemos weighted by recency and Aislinge-scored salience. Recent + high-salience content overrepresented in each training batch.

### 3.3 Consolidation Signal — Aislinge

Aislinge's bridge statements (consolidated beliefs, 219+ entries) serve as high-value training anchors. These represent the output of Todd's reasoning under reflection — they are the closest thing to distilled world model updates available.

Aislinge Phase 7 (Legion integration) and Macalla share the same dependency: a stable, high-quality Aislinge run is the prerequisite for a high-quality Macalla training batch.

### 3.4 Drift Detection — Léargas

Léargas (GMM over semantic embedding space) monitors the Mnemos corpus geometry for structural drift — regions where new content has accumulated that the current Macalla weights don't adequately cover.

**Training trigger:** Léargas detects a new GMM cluster or significant centroid shift → signals Macalla to schedule a training run. This replaces the naive "train on schedule" approach with a semantics-aware trigger.

**Novel contribution:** GMM-annotated LoRA training at solo-dev scale is unexplored in the literature. Potential venue post-viva: EMNLP workshop on personalized LLMs or ACL SRW.

### 3.5 Training Loop

```
Léargas drift signal
  → Sample Mnemos (recency + salience weighted)
  → Filter through Aislinge bridge statements (anchor layer)
  → QLoRA fine-tune Qwen3-8B on Iris
  → Evaluate (voice fidelity probe set, held-out personal queries)
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

Both modes run from the same merged checkpoint. No separate models required.

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

Versioned checkpoints are the University of Souls deliverable. Todd-2025 (reconstructed from pre-2026 Mnemos content) is a stretch goal.

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

---

## 6. Honest Ceilings

**Catastrophic forgetting:** QLoRA updates are additive approximations. New style accumulates but old style doesn't strictly disappear — it degrades. Versioned checkpoints partially address this by preserving snapshots before each run. True continual learning without forgetting remains an open research problem.

**Integration vs accumulation:** Macalla accumulates the statistical pattern of Todd's reasoning. It does not integrate new knowledge into a coherent world model the way biological consolidation does. For factual recall, Mnemos (RAG) remains essential. Macalla and Mnemos are complementary, not alternatives.

**Voice fidelity ceiling:** At 8B parameters, Macalla will approximate Todd's voice but not reproduce it. The fidelity improves with corpus size and run frequency. The target is "recognisably Todd" not "indistinguishable from Todd."

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

---

## 8. Timeline

| Milestone | Target | Blocker |
|---|---|---|
| Repo creation | Post-viva | — |
| Training environment setup on Iris | Post-viva | Iris not yet built |
| Léargas Phase 1 (GMM drift detection) | Post-viva | — |
| First Macalla training run | Summer 2026 | Iris, Léargas |
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
Trigger:       Léargas GMM drift detection
Anchors:       Aislinge bridge statements
Checkpoints:   Versioned by date (Todd-YYYY-MM)
Deployment:    Thinking mode (AfterWords) / non-thinking (voice)
Voice:         Glór / ElevenLabs clone layer (separate)
Interface:     Someday (end-user) / direct API (research)
```

---

*Macalla PRD v0.2 — April 2026*  
*Generated-with: Claude Sonnet 4.6*
