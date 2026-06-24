# Redesign Blueprint — CivicResolve Level 5

> **Basis:** [`ux-audit-level5.md`](./ux-audit-level5.md) · [`interaction-philosophy-v2.md`](./interaction-philosophy-v2.md) · [`gamification-principles-v2.md`](./gamification-principles-v2.md)  
> **Status:** Prioritized redesign spec — no code implementation  
> **Priority key:** P0 (ship first) · P1 (high) · P2 (polish)

---

## Blueprint overview

```
Phase A — Alive (P0)     Feedback + activity + photography
Phase B — Loops (P0–P1)  Event pipeline + unified scoring
Phase C — Structure (P1) Tabbed rewards + home pulse + success trim
Phase D — Depth (P2)     Challenges + leaderboard motion + trust history
```

Estimated relative effort: **A < C < B < D**

---

## 1. Home — Neighborhood pulse

**Current problem:** Static poster—decorative map, dead pulse metrics, only first feed card actionable, color-block placeholders, hardcoded ward.

**Target feeling:** *"My block is moving—and I know what to do next."*

### Information architecture (top → bottom)

| Zone | v2 content | Priority |
|------|------------|----------|
| Header | Ward name + optional location chip | P1 |
| Persona hero | Keep—primary report CTA | ✅ Keep |
| Progress chip | `12 verified · 3-day streak` → Rewards | P0 |
| Civic pulse (tappable) | 3 metrics → deep link | P0 |
| Activity stream | 3–5 "Happening nearby" items | P0 |
| Nearby issues | Photo cards, **all** confirmable | P1 |
| Map | Pin sheet OR remove toggle | P1 |
| Education | Remove after first dismiss; never repeat | P0 |

### Interaction changes

| Element | Redesign | Priority |
|---------|----------|----------|
| `CivicPulseStrip` | Each cell tappable: Open → Nearby, Need confirmation → Verify, Resolved → Track filter | P0 |
| `FirstSessionEducationCard` | Show once per account; never on home again after dismiss | P0 |
| Nearby feed | `showActions` on **all** cards within 500m, not just index 0 | P1 |
| `IssueCard` media | Photographic seed assets; severity subtle left border | P0 |
| Map/Feed toggle | **Option A:** Map with report pins + bottom sheet list. **Option B:** Remove toggle; list-first with "View map" link | P1 |
| Weekly resolved | Tap → filtered resolved feed or modal | P2 |
| Insight strip | Remove or merge into activity stream | P0 |

### Copy changes

| Remove | Replace with |
|--------|--------------|
| Long insight strip ethics | Activity stream verbs |
| "Live neighborhood signal" (hardcoded) | Real ward from seed user or geolocation mock |

### Success metrics

- Pulse tap-through rate > 15%
- Home → Verify conversion from "Need confirmation" metric
- Time-to-first-action < 10s for returning users

### Do not break

- Persona `HomeHero` variants
- Report FAB prominence
- Guest mode banner

---

## 2. Verify — Community confirm queue

**Current problem:** Redundant education, silent success, no card context, binary confirm only, no loading state.

**Target feeling:** *"I can help my neighbors in 5 seconds—and it mattered."*

### Information architecture

| Zone | v2 content | Priority |
|------|------------|----------|
| Compact header | "Confirm what you see nearby" + queue count | P0 |
| Optional filter | Nearest first / Pending longest | P2 |
| Issue cards | Photo, distance, time pending, corroboration count | P0 |
| Card actions | Confirm · Details · Can't confirm (optional) | P1 |
| Footer | Link to full nearby browse | ✅ Keep |

### Interaction changes

| Element | Redesign | Priority |
|---------|----------|----------|
| Hero education block | **Remove** — replace with 1-line under header | P0 |
| `TrustParticipationCard` compact | **Remove from verify** — points shown in post-action toast only | P0 |
| Post-confirm | Toast: `Confirmed · +5 contribution · +3 trust` + card slides out | P0 |
| Corroboration count | Optimistic +1 on card before removal | P1 |
| Loading | Disable button + spinner during `corroborate` | P0 |
| No session | Redirect to auth, don't silent-fail | P0 |
| "Can't confirm" | Optional tertiary action → dismiss card without credit | P2 |

### Gamification hooks

- Append `corroboration` reward event on success
- If challenge joined, increment challenge progress
- Milestone progress: "Community voice" 2/5

### Copy changes

| Remove | Replace with |
|--------|--------------|
| "Confirmation recorded — you helped crews trust…" (long) | `Confirmed · neighbors: 3 → 4` |
| Duplicate trust card on same page | Toast only |

### Success metrics

- Median time per confirm < 8s
- Confirms per session ≥ 1.5 (repeat behavior)
- Verify return within 7 days ↑

---

## 3. Rewards — Progress hub (restructured)

**Current problem:** 10-section dashboard scroll, triple ethics copy, static seed data, buried in Profile nav.

**Target feeling:** *"I can see my civic impact growing—and what's next to unlock."*

### Information architecture — tabbed

```
┌─────────────────────────────────────┐
│  [ Progress ] [ Recognition ] [ Perks ]  │
├─────────────────────────────────────┤
│  TAB CONTENT                         │
└─────────────────────────────────────┘
```

#### Tab 1 — Progress (default)

| Section | Content | Priority |
|---------|---------|----------|
| Hero | Verified contribution (large) + pending chip (muted) | P0 |
| Streak | Days active streak | P1 |
| Ladder | Civic champion tier + % to next | P0 |
| Milestones | Checklist with deep links | P1 |

#### Tab 2 — Recognition

| Section | Content | Priority |
|---------|---------|----------|
| Badges | Grid with unlock modal + gap hints | P0 |
| Leaderboard | Ward-scoped, verified contribution label | P1 |

#### Tab 3 — Perks

| Section | Content | Priority |
|---------|---------|----------|
| Catalog | Gated partner perks | ✅ Keep |
| Challenges | Join + contribute missions | P1 |
| Activity | Recent reward events feed | P1 |

### Interaction changes

| Element | Redesign | Priority |
|---------|----------|----------|
| `RewardsAtAGlance` + `RewardsPhilosophyCard` + hero card | **Merge** to hero + collapsible "How rewards work" | P0 |
| Static challenge bars | Join CTA + live progress on user actions | P1 |
| Badge unlock | Modal on threshold cross | P0 |
| Redeem | Decrement points; refresh catalog state | P1 |
| Discoverability | Profile preview card + home progress chip | P0 |

### Copy changes

| Remove | Replace with |
|--------|--------------|
| "Judges should grok in 10 seconds" energy | User-facing: "Verified impact only" |
| Repeated "+5 verification pts" in static cards | Contextual toasts at action time |

### Success metrics

- Rewards visit rate after verify ↑
- Tab engagement: Progress tab default, Recognition 2nd
- Scroll depth reduced 40%

---

## 4. Track — My reports accountability

**Current problem:** Per-card stack (timeline + explainer + proof + reopen), compact timeline hides labels, `needs_action` mislabeled, no contribution credit.

**Target feeling:** *"I know exactly where my reports stand—and I can hold crews accountable."*

### Information architecture

| Zone | v2 content | Priority |
|------|------------|----------|
| Header | Filter chips (fix labels) | P0 |
| Report cards (collapsed) | Title, status, date, mini timeline dots | P0 |
| Expanded card | Full timeline, proof, reopen | P1 |
| Contribution | Per-report verified credit line | P1 |

### Interaction changes

| Element | Redesign | Priority |
|---------|----------|----------|
| `StateTransitionExplainer` | **Remove from list** — move to expanded detail only | P0 |
| `IssueTimeline compact` | Show all step **labels** under dots OR use 2-line summary | P0 |
| `needs_action` filter | Rename to **"Resolved"** or implement real needs-action (reopen candidate, pending proof) | P0 |
| `TrustParticipationCard` | Remove from track list | P0 |
| Resolution proof | Seed before/after images for `report-004` resolved demo | P1 |
| Empty filter state | EmptyState when filter returns 0 | P1 |
| Card expand | Tap chevron → expand in place | P1 |

### Copy changes

| Keep | Why |
|------|-----|
| Reopen copy | Best civic tone in app |

### Gamification hooks

- Show `+X verified contribution` when report flips to verified
- Milestone: "Fix followed through" links here

### Success metrics

- Reopen discovery (tap rate on resolved cards)
- Issue detail navigation from track
- Reduced card height at rest ↑ scan speed

---

## 5. Report success state — Pride + next step

**Current problem:** Three edu cards before CTAs; no feedback delta; delays momentum.

**Target feeling:** *"I did something that matters—here's what happens next."*

### Information architecture (minimal)

```
┌─────────────────────────────┐
│  ✓  You spoke up for your block   │
│  Ref: report-xxx [copy]           │
│  Pending neighbor confirmation    │
├─────────────────────────────┤
│  [ Track my report      ]  primary │
│  [ Help verify nearby   ]  outline │
│  [ Back to home         ]  ghost   │
├─────────────────────────────┤
│  ▸ How verification works (accord) │
└─────────────────────────────┘
```

### Interaction changes

| Element | Redesign | Priority |
|---------|----------|----------|
| Three `SuccessStep` info cards | **Remove** — single pending status line | P0 |
| Reference ID | Monospace + copy button | P1 |
| Pending contribution | Toast or inline: `Contribution logged — pending verification` | P0 |
| CTAs | Track primary, Verify secondary (order keep) | ✅ Keep |
| Accordion | Collapsed ethics: verification, tracking, rewards | P1 |

### Temperature

- **Rewarding:** Headline + check icon (subtle scale-in)
- **Informative:** Pending line, accordion
- **Calm:** No points animation until verified (or muted pending chip)

### Success metrics

- Time to first CTA tap < 5s
- Track vs Verify click ratio tracked
- Bounce to home without action ↓

---

## 6. Profile / Trust — Identity + progression summary

**Current problem:** Trust ring without history; no progression summary; Rewards buried; contribution numbers disagree with Rewards.

**Target feeling:** *"This is my civic identity—and I'm building a reputation on my block."*

### Information architecture

```
┌─────────────────────────────┐
│  Avatar · Name · Trusted badge │
│  Trust ring (85)               │
├─────────────────────────────┤
│  Progress summary card         │
│  · 12 verified contribution    │
│  · #14 in Ward 12              │
│  · Next: Duplicate Defender    │
│    (2 corroborations to go)    │
├─────────────────────────────┤
│  Trust breakdown               │
│  · Trust score 85              │
│  · Verified contributions 12   │
│  · Corroborations 8            │
├─────────────────────────────┤
│  ▸ Trust history (accord)      │
├─────────────────────────────┤
│  Rewards & badges        →     │
│  Family & youth mode     →     │
│  Admin (if role)         →     │
├─────────────────────────────┤
│  Sign out                      │
└─────────────────────────────┘
```

### Interaction changes

| Element | Redesign | Priority |
|---------|----------|----------|
| Trust ring | Count-up animation on trust change | P1 |
| Progress summary card | New — unified metrics from reward events | P0 |
| Trust breakdown | Align labels with gamification v2 | P0 |
| Trust history accordion | List recent deltas with reason | P1 |
| Rewards link | Promote to rich preview card with contribution + streak | P0 |
| Duplicate/abuse flags | If present, calm info row (not hidden) | P2 |

### Trust history examples

```
+3 trust · Corroboration on Park Lane streetlight · today
+5 contribution · School pothole verified · Jun 20
−2 trust · Duplicate attempt redirected · Jun 18
```

### Copy changes

| Remove | Replace with |
|--------|--------------|
| Static seed mismatch | Live-derived numbers |

### Success metrics

- Profile → Rewards click-through ↑
- Trust history opens (engagement with transparency)
- User can articulate trust vs contribution (usability test)

---

## 7. Cross-cutting components (new or shared)

| Component | Used on | Purpose | Priority |
|-----------|---------|---------|----------|
| `ActionFeedbackToast` | Verify, Home confirm, Support, Success | Immediate delta | P0 |
| `NeighborhoodActivityStrip` | Home | Momentum | P0 |
| `ProgressSummaryChip` | Home header, Profile | Unified contribution | P0 |
| `RewardEventService` | All civic actions | Event pipeline | P0 |
| `BadgeUnlockModal` | Rewards, post-action | Recognition moment | P1 |
| `TrustHistoryList` | Profile | Transparency | P1 |
| `CollapsibleEthics` | Success, Rewards | Reduce clutter | P1 |

---

## 8. Priority matrix (all screens)

| Item | Screen | P | Effort |
|------|--------|---|--------|
| Action feedback toast | Cross | P0 | S |
| Reward event pipeline | Cross | P0 | M |
| Unified scoring display | Cross | P0 | M |
| Remove redundant edu cards | Verify, Track, Success | P0 | S |
| Tappable pulse strip | Home | P0 | S |
| Activity stream | Home | P0 | M |
| Photographic feed cards | Home, Verify | P0 | S |
| Success screen trim | Report | P0 | S |
| Profile progress summary | Profile | P0 | M |
| Rewards tab restructure | Rewards | P1 | M |
| All cards confirmable | Home | P1 | S |
| Track timeline labels | Track | P1 | S |
| Badge unlock modal | Rewards | P1 | S |
| Challenge join + progress | Rewards | P1 | M |
| Trust history | Profile | P1 | M |
| Map pins or remove toggle | Home | P1 | M |
| Track card collapse | Track | P1 | M |
| Leaderboard rank motion | Rewards | P2 | S |
| Can't confirm action | Verify | P2 | S |

---

## 9. Implementation sequence (recommended)

### Sprint 1 — Feel alive (P0, low risk)
1. `ActionFeedbackToast` + wire to verify/home/support
2. Remove redundant edu blocks (verify hero, track explainer, success cards)
3. Success screen layout v2
4. Seed photography on `IssueCard`
5. Tappable `CivicPulseStrip`

### Sprint 2 — Close the loop (P0, medium risk)
6. `RewardEventService` — append on actions
7. Unified scoring derivation
8. Profile progress summary card
9. Home progress chip
10. `NeighborhoodActivityStrip`

### Sprint 3 — Restructure (P1)
11. Rewards tabs (Progress / Recognition / Perks)
12. Track timeline + filter fix + collapse
13. Badge unlock modal
14. Challenge join flow

### Sprint 4 — Depth (P1–P2)
15. Trust history accordion
16. Leaderboard rank updates
17. Map pins or honest removal
18. Resolution proof imagery

---

## 10. Acceptance checklist (definition of done)

- [ ] Verify shows toast with contribution + trust delta within 500ms
- [ ] Home pulse cells navigate to correct destinations
- [ ] Activity stream shows ≥3 item types (confirm, assign, resolve)
- [ ] Rewards numbers match profile after 3 test actions
- [ ] Success screen has 1 pending line, 0 edu cards, 2+ CTAs above fold
- [ ] Rewards fits in 1.5 viewports per tab (not 10 sections)
- [ ] Track card at rest shows status + labeled timeline summary
- [ ] Badge unlock fires once in demo script after corroborations
- [ ] No screen repeats full trust ethics block (accordion only)
- [ ] Screenshots suitable for GitHub README and judge demo

---

## 11. Related documents

| Document | Role |
|----------|------|
| [`interaction-philosophy-v2.md`](./interaction-philosophy-v2.md) | Why we redesign this way |
| [`gamification-principles-v2.md`](./gamification-principles-v2.md) | Mechanics rules |
| [`top-10-upgrades.md`](./top-10-upgrades.md) | Engineering upgrade list |
| [`product-gaps.md`](./product-gaps.md) | Gap severity reference |
| [`design-direction.md`](./design-direction.md) | Visual tokens (unchanged) |

---

*Redesign Blueprint · CivicResolve Level 5 · Ready for implementation approval.*
