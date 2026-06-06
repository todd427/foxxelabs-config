# <span style="color:#a02020">Coinne</span>

> *coinne* /ˈkɪnʲə/ — Irish: **appointment, engagement, tryst, expectation**. A thing arranged between people; the meeting that was promised.

**Tagline:** *Turns a phone call into a booking — in the caller's own accent.*

**PRD version:** v0.1 (draft)
**Date:** 6 June 2026
**Owner:** Todd McCaffrey / FoxxeLabs
**Status:** Pre-implementation. **Parked until post-viva** (dissertation due 12 June 2026).
**Implementation repo:** `todd427/coinne` (not yet created)
**Siblings:** [Dialann](../dialann/PRD.md) (system of record), [Geall](../geall/PRD.md) (watchdog) · **cross-channel sibling:** [Litir](https://github.com/todd427/anseo/blob/master/docs/litir_prd.md) (the same boundary-translator on the *email* channel — see §1)

---

## <span style="color:#a02020">1. Vision</span>

Coinne is the conversational front door of the talk-to-record operator system. It answers inbound voice and message, holds a directed slot-filling conversation **in the caller's own dialect**, grounds messy human input (townlands, landmarks, "out the Ramelton road past the GAA pitch") against a locale gazetteer, confirms aloud, and emits a structured booking into Dialann.

It is the **boundary-translator** — the seam where unstructured human talk becomes machine state. It exists because the live truth of a small operation currently lives only in one person's head, on the radio, and on paper; Coinne is the point at which talk first becomes record.

Coinne is the **voice-channel** deployment of this primitive. **Litir** (the Anseo mail client, `todd427/anseo` → `docs/litir_prd.md`, Part 5A) is its **email-channel sibling**: the same `extract → ground → propose → write to the record` engine, with inbound email instead of inbound voice, writing into the Anseo `Event` model / Comhordú instead of Dialann. The channels and extraction schemas differ; the primitive is shared. Treat an improvement to one as a candidate for the other.

The role is deliberately narrow: Coinne *captures and confirms*. It does not store (Dialann's job), it does not watch (Geall's job), it does not optimise assignment (a deterministic solver behind Dialann's adapter). One hat, done well.

---

## <span style="color:#a02020">2. The moat</span>

Coinne is the **entry moat** for the whole system. Generic IVR — iCabbi's BookVoice, CAB-X's Voice AI — is tuned for RP and generic US English and chokes on exactly the inputs that matter here: Hiberno-English, Irish-language place-names, townland addresses, pub-as-landmark pickups. Coinne is tuned for precisely the inputs the incumbents ignore.

This is the *get-in* differentiator. It is not where the system *wins* — that is Geall, the watchdog (see [Geall PRD §2](../geall/PRD.md)). Positioning rule inherited from Eric's brief: **voice is the wedge, the watchdog is the hero.** Coinne is how the data gets in; it is not the headline.

---

## <span style="color:#a02020">3. Position in the stack</span>

```
INBOUND
  voice → [ COINNE ]   (this PRD)
  email → [ LITIR  ]   (Anseo repo, litir_prd.md Part 5A)
              │
              │ structured booking / event  (extract → ground → propose)
              ▼
     [ DIALANN ]  ──watched by──▶ [ GEALL ]
   (system of record)            (watchdog)
   ↑ Coinne writes here;  Litir writes to Anseo Event model / Comhordú
```

- **Chassis:** built on the **Taca** harness (GDPR consent flow, turn-cap, WebNN inference target, WCAG AAA). Taca's role *inverts* — non-directive listening becomes directed extraction — but the consent/turn/accessibility scaffolding is shared.
- **Model:** the dialect/extraction model is trained via the **Macalla method** (QLoRA + gated-staircase eval + fingerprint-distance go/kill), pointed at a *locale-dialect extraction corpus* — **not** Macalla's first-person voice weights. Coinne must sound like a neutral local agent; the value lives on the input/extraction side, not on voice preservation.
- **Plumbing:** taisce (per-tenant telephony/model keys), Féith (self-hosted inference on Daisy/Iris where used), rialu (registry).

---

## <span style="color:#a02020">4. Architecture</span>

Pipeline:

1. **Inbound** — SIP/voice on a standard Irish long number (sidesteps the ComReg SMS Sender ID Registry entirely; see [workarounds.md] / Geall §5 for the SMS path). Telephony on Telnyx or Plivo, **not** Twilio by default.
2. **STT** — streaming (Deepgram).
3. **Extraction** — LLM with an `extract_booking` tool: `{pickup, destination, time, name, phone, passengers, notes}`. Schema is vertical-specific (the disposable shell, see §6).
4. **Grounding** — resolve addresses against a locale gazetteer (place-name → coordinates); **always confirm the resolved address aloud.**
5. **Confirm** — single confirmation turn; read back time + pickup.
6. **Emit** — POST structured booking to Dialann via its `DispatchCore` interface.
7. **Readback** — TTS (Cartesia / Deepgram Aura — cheap, neutral).

Unit economics: ~€0.15–0.35 per completed booking on a cheap BYOK stack (short 1–2 min calls). One recovered fare (€8–25) pays for 30–100+ calls; gross margin per call ~99%. COGS is not the constraint — CAC and sales cycle are.

---

## <span style="color:#a02020">5. Non-goals</span>

- <span style="color:#cc6600">**Not** the system of record.</span> Coinne emits and forgets; persistence is Dialann.
- <span style="color:#cc6600">**Not** the watchdog.</span> Coinne does not monitor or escalate; that is Geall.
- <span style="color:#cc6600">**Not** the dispatcher.</span> "Which car/resource" is a deterministic solver behind Dialann's adapter — an LLM is the wrong tool for it.
- <span style="color:#cc6600">**Not** vertical-general.</span> The extraction schema, the gazetteer, the dialect corpus, and the confirmation copy are the **per-vertical shell** and are rebuilt per vertical/locale.

---

## <span style="color:#a02020">6. What stays per-vertical (the disposable shell)</span>

Coinne is the reusable engine; the following are NOT reusable and are expected to be rebuilt for each vertical and locale: extraction schema (taxi pickup/dropoff ≠ care-visit client/task ≠ clinic appointment-type), locale gazetteer + dialect tuning corpus, confirmation copy, failure modes, regulatory surface. Win one vertical at a time, locale-first, reusing the engine underneath. Do **not** build the horizontal "voice booking for any vertical" platform — the technology abstracts, the product does not.

---

## <span style="color:#a02020">7. Trade-offs, stated explicitly</span>

- **Dialect tuning is per-locale work.** A Donegal corpus does not transfer to Cork or Glasgow. This is the moat *and* the cost.
- **Wrong address = worse than paper.** A confidently mis-grounded pickup destroys trust faster than a dropped paper note. Mitigation: always confirm resolved address aloud; fail loud to a human fallback on low confidence; never silently guess.
- **Voice as wedge, not hero.** Resist the temptation to market Coinne as "AI answers your calls" — that is a commodity race against Big Tech voice. Lead with Geall.

---

## <span style="color:#a02020">8. Open questions</span>

1. STT accuracy on strong Donegal/Ulster accents — needs a held-out eval set before any pilot.
2. Gazetteer source — OSi townland data? Crowd-built per fleet? Hybrid?
3. Human-handoff UX — when confidence is low, how does Coinne hand to the operator without dropping the caller?
4. Which TTS voice reads as *local, neutral, trustworthy* (not uncanny, not call-centre).
5. Go/kill: VOICE-style fingerprint-distance threshold on *extraction accuracy* as the operationalised gate before scaling.

---

## <span style="color:#a02020">9. Go-to-market</span>

Per Eric's brief: **land in trades** (plumbers/electricians/breakdown — competing with *nothing*, so easiest and stickiest; cheapest place to harden the engine), then **grow into home-care as the flagship** (deepest pain, no incumbent, regulated audit trail as a second product — but longer, scrutinised sale and special-category health data, where the per-tenant isolation discipline earns its keep). Taxis are the *origin* example and the cleanest incumbent-adapt case (iCabbi), not necessarily the first sale.

---

*End of PRD v0.1. Companion docs: [Dialann](../dialann/PRD.md), [Geall](../geall/PRD.md), [Litir](https://github.com/todd427/anseo/blob/master/docs/litir_prd.md) (email-channel sibling), [Taca], [Macalla PRD](../macalla/PRD.md), [Comhordú], [FoxxeLabs Roadmap](../roadmap.md).*
