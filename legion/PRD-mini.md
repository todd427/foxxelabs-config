# <span style="color:#4fc3f7">Mini — Stage 1 PRD: Spatial Persistence</span>

<span style="color:#90a4ae">Version 0.1 · April 2026 · FoxxeLabs Limited</span>
<span style="color:#90a4ae">Parked here pending todd427/legion repo creation. Move to docs/PRD-mini.md on creation.</span>

---

## <span style="color:#4fc3f7">1. Purpose</span>

Define the minimum viable implementation of a spatially-aware Legion node: a situated agent that builds and maintains a persistent topological map of its local environment from onboard sensing alone, without external positioning, ground truth, or inter-node communication.

This is the hippocampal layer. Everything above it depends on it.

---

## <span style="color:#4fc3f7">2. Biological Reference Model</span>

**Target:** *Mus musculus* hippocampal navigation circuit.

| <span style="color:#80cbc4">Biological structure</span> | <span style="color:#80cbc4">Function</span> | <span style="color:#80cbc4">Implementation analogue</span> |
|---|---|---|
| Place cells (CA1/CA3) | Fire at specific locations | Topological node activation |
| Grid cells (entorhinal cortex) | Metric odometry | Dead-reckoning displacement estimator |
| Head direction cells | Bearing | IMU-derived heading |
| Boundary cells | Edge/wall detection | Proximity event triggers |
| Theta sequences | Temporal ordering of place cells | Node transition log with timestamps |

The mouse does not maintain a coordinate system. It maintains a **graph of traversable transitions** between recognisable states. That is the implementation target.

---

## <span style="color:#4fc3f7">3. Scope</span>

### <span style="color:#a5d6a7">In scope</span>

- Topological map construction from movement and proximity sensing
- Persistent map storage across power cycles
- Node re-localisation on return to known area
- Simulation-first on Isaac Sim; physical hardware is out of scope for this stage

### <span style="color:#ef9a9a">Out of scope</span>

- Inter-node map sharing or merging
- One-shot learning (Stage 2)
- Conspecific recognition (Stage 4)
- Any language or symbolic reasoning layer
- Metric SLAM or coordinate-based mapping

---

## <span style="color:#4fc3f7">4. Success Criteria</span>

A Stage 1 node passes when it can, **without external input or reset**:

1. **Explore** a novel environment and construct a topological map
2. **Persist** that map across a simulated power cycle
3. **Localise** itself within the existing map on re-entry to a known area (≥80% node-match accuracy on 10 test runs in a fixed environment)
4. **Return** to a designated origin node via the shortest known path
5. **Extend** an existing map when it encounters novel territory without corrupting the known portion

These are the mouse equivalents of: leaving the nest, sleeping, waking, foraging, returning.

---

## <span style="color:#4fc3f7">5. Architecture</span>

### <span style="color:#80cbc4">5.1 Sensing layer (brainstem)</span>

Event-driven, not polling. Sensors fire on threshold crossing, not on tick.

- **Proximity:** 8-point IR or ToF array, 180° forward arc + 2 rear
- **Contact:** binary wall/obstacle touch (simulated in Isaac Sim as collision events)
- **Odometry:** wheel encoder or IMU dead-reckoning for displacement between events
- **Heading:** IMU gyro integration, recalibrated on boundary contact

No cameras at this stage. The mouse navigates whisker-first.

### <span style="color:#80cbc4">5.2 Topological map (hippocampal layer)</span>

Data structure: **directed weighted graph**

```
Node {
  id: uuid
  signature: float[n]     // sensory fingerprint at this location
  created_at: timestamp
  visit_count: int
  edges: [{ target_id, heading, displacement, traversal_count }]
}
```

**Node creation:** a new node is created when the sensory fingerprint diverges beyond threshold *θ* from all known nodes within estimated proximity. *θ* is the place cell firing threshold analogue.

**Edge creation:** on transition between two nodes, a directed edge is written with heading and displacement magnitude.

**Signature:** low-dimensional vector derived from the proximity sensor array at the moment of node registration. Not a full map snapshot — a compressed sensory state. 16–32 floats is sufficient.

**Storage:** SQLite on local flash. Lightweight, persistent, queryable. No network dependency.

### <span style="color:#80cbc4">5.3 Localisation (re-entry)</span>

On power-up or map-load, the node enters a **localisation scan**:

1. Collect current sensory fingerprint
2. Query map for nodes with signature cosine similarity > *θ_match*
3. If match found: activate that node as current position
4. If no match: treat as novel territory, begin exploration mode

This is not loop closure in the SLAM sense. It is pattern-matched re-activation — the same mechanism a mouse uses when it re-enters a familiar room after sleeping.

### <span style="color:#80cbc4">5.4 Path planning</span>

Dijkstra over the topological graph, weighted by traversal count (higher count = lower cost = more reliable path). No A*, no metric heuristic. The graph *is* the map.

### <span style="color:#80cbc4">5.5 Idle behaviour</span>

Between events, the node runs a lightweight **consolidation pass**:
- Prune edges with traversal_count = 1 and age > *T_prune* (noise reduction)
- Merge nodes with signature similarity > *θ_merge* and bidirectional edges (loop closure analogue)
- Write consolidated graph to SQLite

This is the sleep cycle in miniature. It runs at low priority and is interruptible by any sensor event.

---

## <span style="color:#4fc3f7">6. Simulation Environment</span>

**Platform:** Isaac Sim (Iris, post-build; interim on Daisy GPU)

**Test environments (progressive):**

| <span style="color:#80cbc4">Environment</span> | <span style="color:#80cbc4">Complexity</span> | <span style="color:#80cbc4">Purpose</span> |
|---|---|---|
| Corridor (single path) | Trivial | Baseline node creation and edge recording |
| T-junction maze | Low | Path branching, heading fidelity |
| 4-room grid | Medium | Re-localisation, loop closure |
| Cluttered open space | High | Signature disambiguation, noise tolerance |
| Dynamic obstacles | Stress | Edge invalidation, map repair |

Each environment runs 10 trials: 5 with fresh map, 5 with persisted map loaded.

---

## <span style="color:#4fc3f7">7. Implementation Stack</span>

| <span style="color:#80cbc4">Component</span> | <span style="color:#80cbc4">Technology</span> | <span style="color:#80cbc4">Rationale</span> |
|---|---|---|
| Simulation | Isaac Sim | Physics-accurate, ROS2 bridge, GPU on Daisy/Iris |
| Agent runtime | Python 3.11 + asyncio | Event loop maps cleanly to event-driven sensing |
| Map store | SQLite (via aiosqlite) | Persistent, lightweight, no server dependency |
| HTM option | Numenta NuPIC / htm.core | If signature encoding needs temporal context |
| Visualisation | RViz2 or custom React viewer | Debug only; not part of agent runtime |
| Repo | todd427/legion | stage1/ subdirectory |

**Note on HTM:** Evaluate after Corridor environment passes. Don't over-engineer before that point.

---

## <span style="color:#4fc3f7">8. Hyperparameters (initial values)</span>

| <span style="color:#80cbc4">Parameter</span> | <span style="color:#80cbc4">Symbol</span> | <span style="color:#80cbc4">Initial value</span> | <span style="color:#80cbc4">Tuning range</span> |
|---|---|---|---|
| Node creation threshold | θ | 0.25 | 0.1 – 0.5 |
| Localisation match threshold | θ_match | 0.85 | 0.7 – 0.95 |
| Node merge threshold | θ_merge | 0.95 | 0.9 – 0.99 |
| Edge prune age | T_prune | 300s | 60s – 3600s |
| Signature dimensionality | n | 16 | 8 – 64 |

All are tunable per environment. Log every trial with full parameter set.

---

## <span style="color:#4fc3f7">9. Milestones</span>

| <span style="color:#80cbc4">#</span> | <span style="color:#80cbc4">Milestone</span> | <span style="color:#80cbc4">Exit condition</span> |
|---|---|---|
| M1 | Node creation | Agent traverses corridor, ≥3 nodes created, edges recorded |
| M2 | Persistence | Map survives simulated power cycle, loads correctly |
| M3 | Re-localisation | ≥80% match accuracy across 10 trials, 4-room environment |
| M4 | Return-to-origin | Agent navigates home via graph path, ≤20% longer than optimal |
| M5 | Map extension | Novel room added to existing map without corrupting known graph |

**M3 is the publishable milestone.** M1–M2 are internal. M4–M5 are required for Stage 2 handoff.

---

## <span style="color:#4fc3f7">10. Risks</span>

| <span style="color:#80cbc4">Risk</span> | <span style="color:#80cbc4">Likelihood</span> | <span style="color:#80cbc4">Mitigation</span> |
|---|---|---|
| Signature collision in cluttered environments | Medium | Increase *n*; add temporal context via HTM |
| Odometry drift corrupting edge displacement | High | Recalibrate on every boundary contact; weight edges by confidence |
| Graph bloat in long sessions | Low | Consolidation pass + node merge keeps graph bounded |
| Isaac Sim unavailable (pre-Iris) | Medium | Daisy GPU sufficient for Corridor through 4-room environments |

---

## <span style="color:#4fc3f7">11. What This Enables (Stage 2 Handoff)</span>

A node with reliable spatial persistence can now support:
- **Aversive one-shot learning:** bind a negative event to a specific map node; avoid that node and its neighbours
- **Resource mapping:** tag nodes with "food found here" valence
- **Threat propagation:** broadcast aversive node tags to peers (first inter-node communication)

Stage 1 is the substrate. None of the above is possible without it.

---

<span style="color:#90a4ae">FoxxeLabs Limited · todd@foxxelabs.ie · Letterkenny, Co. Donegal, Ireland</span>
