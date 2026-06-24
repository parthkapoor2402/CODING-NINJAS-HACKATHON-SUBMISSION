# Product Gaps — CivicResolve Prototype vs Civic-Tech Brief

> **Purpose:** Map what the brief promises vs what the build delivers—separating acceptable MVP cuts from experience-breaking gaps.  
> **Audience:** Product, design, and engineering prior to Level 5 UX pass.  
> **Status:** Gap analysis only — no implementation

---

## Gap severity key

| Level | Meaning |
|-------|---------|
| 🟢 **Acceptable MVP** | Mocked or simplified; demo-credible; documented |
| 🟡 **Experience gap** | Feature exists but feels incomplete or disconnected |
| 🔴 **Loop breaker** | Breaks core product promise or return behavior |

---

## 1. Core civic loop gaps

### Report → Verify → Track → Resolve

| Brief expectation | Implementation | Gap | Severity |
|-------------------|----------------|-----|----------|
| Report in <60s with photo/video | 4-step wizard works; gallery/camera fallbacks | Location step shows raw lat/lng | 🟡 |
| Duplicate redirect >40% on near-matches | Geo + text duplicate check on review | Works; nudge is strong | 🟢 |
| Corroboration within 48h | Verify queue + corroborate API | No time pressure UI ("pending 2 days") | 🟡 |
| Push: "3 neighbors confirmed" | Not implemented | No notification layer | 🟡 |
| Status clarity through resolution | Track + issue detail timelines | Compact timeline hides step names | 🟡 |
| Resolution proof (before/after) | `ResolutionProofPlaceholder` | Awaiting crew upload copy only | 🟢 |
| Citizen reopen if not fixed | Reopen button on resolved | Strong; under-promoted on home | 🟢 |

### Return loop

| Brief expectation | Implementation | Gap | Severity |
|-------------------|----------------|-----|----------|
| Streak reminder | Streak computed on Rewards only | Not surfaced on home/profile after action | 🔴 |
| "Issue near you resolved" | Weekly resolved count on pulse | No event feed or notification | 🟡 |
| Hotspot alert | Admin hotspots page | Not citizen-facing | 🟡 |
| Reward unlock after verification | Domain rules exist | No live unlock moment | 🔴 |

---

## 2. Surface-by-surface gap matrix

### Home

| Capability | Brief | Built | Gap |
|------------|-------|-------|-----|
| Map + nearby feed | Combined awareness | Toggle hides feed OR map; map is decorative | 🔴 Interaction gap |
| Live neighborhood signal | Real ward data | Hardcoded Ward 12; fake distances | 🟡 |
| Inline verify | Quick corroboration | Only first of 3 preview cards | 🟡 |
| Pulse metrics drill-down | Actionable KPIs | Display-only strip | 🟡 |
| Persona-aware CTAs | Segment copy | Implemented via `HomeHero` | 🟢 |

### Report

| Capability | Brief | Built | Gap |
|------------|-------|-------|-----|
| Camera / video / gallery | Multi-path capture | Full implementation | 🟢 |
| AI category + severity | Grok or mock | Works with fallback | 🟢 |
| Manual pin adjust | Map drag | Text lat/lng inputs + static map card | 🟡 |
| Trust checks at submit | Duplicate + suspicious | Implemented on review | 🟢 |
| Post-submit reward eligibility | Computed | Shown in copy only; no event created | 🔴 |

### Verify

| Capability | Brief | Built | Gap |
|------------|-------|-------|-----|
| Confirm what you see | Ethical copy | Strong hero + card actions | 🟢 |
| One confirmation per user | `already_supported` handling | Works | 🟢 |
| Trust/points for verify | +5 pts copy, +3 trust code | Silent `applyTrustUpdate` | 🔴 |
| Reject / can't confirm | Dispute flow | Not implemented | 🟡 |
| Context (distance, age) | Prioritization | Missing per card | 🟡 |

### Track

| Capability | Brief | Built | Gap |
|------------|-------|-------|-----|
| My reports list | Filterable | All / Open / Resolved / Needs action | 🟡 Filter label bug |
| Timeline transparency | Step visibility | Compact mode hides labels | 🟡 |
| What this means | Plain language | `StateTransitionExplainer` every card | 🟡 Copy stack |
| Reopen | No penalty framing | Excellent copy | 🟢 |
| Contribution credit | Per-report impact | Not shown | 🔴 |

### Rewards

| Capability | Brief | Built | Gap |
|------------|-------|-------|-----|
| Verified impact only | Points gating | `sumRedeemablePoints` + pending chip | 🟢 |
| Partner redemption | Gated catalog | Mock redeem; no balance update | 🟢 |
| Civic ladder | Tier progression | UI exists; data from seed events | 🟡 |
| Leaderboard | Neighborhood recognition | Static seed scores | 🔴 |
| Badges | Unlock on behavior | Rules exist; no live unlocks | 🔴 |
| Milestones | Progress checklist | Frozen for new users | 🔴 |
| Community challenges | Opt-in collective goals | Static progress bars | 🔴 |
| Discoverability | Return motivation | Not in bottom nav | 🟡 |

### Profile

| Capability | Brief | Built | Gap |
|------------|-------|-------|-----|
| Trust ring | Visible reliability | `TrustScoreRing` | 🟢 |
| Trust breakdown | Contributions, verification | Static rows | 🟡 |
| Progression summary | Rank, streak, next badge | Missing | 🟡 |
| Family/youth entry | Supervised mode | Link to `/app/family` | 🟢 |
| Edit / settings | Account management | Not in scope | 🟢 |

---

## 3. Trust system gaps

| Domain capability | File | Wired to UI? | Gap |
|-------------------|------|--------------|-----|
| Verification trust bump | `trust-updates.ts` | Partial (`applyTrustUpdate`) | No visible delta |
| Duplicate trust penalty | `trust-updates.ts` | **No** | Penalty never applied |
| Abuse trust penalty | `trust-score.ts` | **No** | Flags displayed admin-only |
| Full recompute | `recomputeTrustScore()` | **No** | Only unit tests |
| Trust history | — | **No** | User can't see changes |
| Catalog gating | `reward-catalog.ts` | Yes | Works on profile trust score |

**Gap summary:** Trust **increases** silently on verify but **never decreases** on abuse/duplicate in live flows—undermining the "trust is the product" promise for bad actors while also failing to **reward** good actors visibly.

---

## 4. Gamification pipeline gaps

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│ Civic action│ ──X─│ Reward event │ ──► │ Rewards UI  │
│ report/     │     │ (missing)    │     │ (seed only) │
│ verify/     │     └──────────────┘     └─────────────┘
│ support     │
└─────────────┘
       │
       └──► applyTrustUpdate() ──► session user only (partial)
```

| Event type | Should trigger on | Actually triggers | Gap |
|------------|-------------------|-------------------|-----|
| `verified_report` | Report → community verified | Never appended | 🔴 |
| `corroboration` | Verify confirm | Never appended | 🔴 |
| `support_existing` | Duplicate support flow | Never appended | 🔴 |
| `resolution_follow` | Track reopen or resolve witness | Never appended | 🔴 |
| Redemption | Catalog redeem | Mock message only | 🟡 |

---

## 5. Scoring model inconsistency (product debt)

Three metrics compete for "your civic score":

| Metric | Source | Used by | User sees |
|--------|--------|---------|-----------|
| `trust.trustScore` | Session bumps + seed | Profile ring, catalog gate | 85 on parent demo |
| `trust.contributionScore` | Seed only | Leaderboard rank | 120 pts "(you)" |
| `contributionFromRewards(events)` | Seed events | Civic ladder % | 0% to Block Voice |
| `sumRedeemablePoints(events)` | Seed events | Catalog, hero card | 0 redeemable |

**Product gap:** No single source of truth. A user who verifies 10 issues sees trust rise on profile but **leaderboard rank, ladder, badges, and points unchanged**.

---

## 6. Mobile-product vs dashboard gaps

| Pattern | Brief intent | Current state | Gap |
|---------|--------------|---------------|-----|
| Thumb-zone primary action | Report outdoors | Report FAB ✅ | 🟢 |
| Progressive disclosure | Don't overwhelm | Rewards dumps 10 sections | 🟡 |
| Action feedback | Confirm every tap | Silent trust updates | 🔴 |
| Feed with media | Evidence-first | Color placeholder blocks | 🟡 |
| Bottom nav completeness | Core jobs | Rewards missing from nav | 🟡 |
| Story-style tracking | Emotional journey | Dashboard cards per report | 🟡 |

---

## 7. Copy & education gaps

| Issue | Impact | Severity |
|-------|--------|----------|
| Trust ethics repeated 7× | Lecture fatigue; screens feel static | 🟡 |
| Judge-optimized Rewards copy (`RewardsAtAGlance`) | Great for demo, poor for daily use | 🟡 |
| Success screen 3 edu cards before CTAs | Delays next action | 🟡 |
| Verify success message wordy | Dilutes moment | 🟡 |
| `needs_action` filter mislabel | Erodes trust in UI accuracy | 🟡 |

---

## 8. Technical MVP gaps (acceptable if labeled)

| Item | Status | Demo impact |
|------|--------|-------------|
| Mock backend/AI/maps | Default `VITE_USE_MOCKS=true` | 🟢 Honest in README |
| Mapbox live tiles | Stylized preview | 🟡 Map toggle over-promises |
| Supabase/Firebase | Stubs | 🟢 |
| Partner API redemption | UI-only | 🟢 |
| Analytics predictions | Seed/heuristic | 🟢 Admin only |
| Push notifications | Not built | 🟡 Return loop weaker |

---

## 9. Persona-specific gaps

| Persona | Brief trigger | Prototype support | Gap |
|---------|---------------|-------------------|-----|
| Commuter | Fast route report | Persona hero copy | 🟢 Copy only |
| Resident | Hyperlocal feed | Nearby cards | 🟡 No real distances |
| Student | Badge / challenge | Static challenges | 🔴 |
| Parent | Supervised youth | Family mode page | 🟢 |
| Admin | Triage + merge | Full admin shell | 🟢 |
| Field worker | Assignment updates | Seed timelines | 🟢 |

---

## 10. Gap prioritization for next sprint

### Fix first (loop breakers)

1. Reward event pipeline from verify/report/support  
2. Visible trust/points feedback after actions  
3. Unify scoring model for display  
4. Badge unlock celebration when criteria met  

### Fix second (experience lift)

5. Rewards page restructure (tabs, dedupe copy)  
6. Home activity feed + tappable pulse  
7. Photographic evidence on feed cards  
8. Success screen action-first layout  

### Fix third (polish)

9. Challenge join + live progress  
10. Leaderboard rank movement  
11. Track timeline label visibility  
12. `needs_action` filter semantics  

---

## 11. Brief alignment scorecard

| Brief pillar | Build score (1–5) | Notes |
|--------------|-------------------|-------|
| Report in seconds | 4 | Wizard strong; location UX weak |
| Support before spam | 5 | Best-in-class duplicate flow |
| Trust is the product | 3 | Visible but not reactive |
| Responsible rewards | 4 | Framing excellent; loops missing |
| AI assists, humans decide | 4 | Resilient fallback works |
| Community participation | 3 | Verify works; challenges static |
| Transparent tracking | 4 | Reopen is standout |
| Return engagement | 2 | No notifications; flat feedback |

**Overall:** ~3.6/5 on brief *values*; ~2.5/5 on brief *engagement loops*.

---

*Cross-reference: [`ux-audit-level5.md`](./ux-audit-level5.md) · [`top-10-upgrades.md`](./top-10-upgrades.md) · [`product-requirements.md`](./product-requirements.md)*
