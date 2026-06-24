# Gamification Principles v2 — CivicResolve

> **Position:** Gamification is a **trust instrument**, not an engagement hack.  
> **Version:** 2.0 · Aligned with [`interaction-philosophy-v2.md`](./interaction-philosophy-v2.md)  
> **Status:** Principles only — no implementation

---

## 1. Why gamification exists in CivicResolve

Civic reporting fails when:

- Good actors get no feedback
- Bad actors flood the system
- Communities don't coordinate
- Residents don't return

Gamification exists to **reinforce verified civic behavior**—reporting real issues, confirming what you witness, supporting existing reports, tracking outcomes—not to maximize session time.

**If a mechanic increases volume without increasing verified impact, it does not ship.**

---

## 2. The civic integrity model

```
                    ┌─────────────────────┐
                    │   Civic action      │
                    │ report · verify ·   │
                    │ support · track     │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │  Verification layer  │
                    │ community + admin    │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
     ┌────────▼────────┐ ┌─────▼─────┐ ┌───────▼───────┐
     │ Trust score       │ │ Verified  │ │ Recognition   │
     │ (reliability)     │ │ contrib.  │ │ badges · rank │
     └────────┬──────────┘ └─────┬─────┘ └───────┬───────┘
              │                │                │
              └────────────────┼────────────────┘
                               │
                    ┌──────────▼──────────┐
                    │ Partner perks       │
                    │ (optional, gated)     │
                    └─────────────────────┘
```

Nothing skips the verification layer for redeemable value.

---

## 3. Two-score system (canonical)

### Trust score (0–100)

**What it measures:** Reliability as a participant—accuracy, fair play, absence of abuse signals.

**Goes up when:**
- Corroboration on issues you did not file
- Verified report reaches community threshold
- Consistent responsible participation over time

**Goes down when:**
- Duplicate filing attempts (after warning)
- Abuse flags (velocity, suspicious patterns)
- Admin moderation outcomes

**Gates:**
- Partner catalog tiers (70+, 80+)
- "Trusted" badge on profile (70+)
- Future: priority review (admin-side)

**UI treatment:** Ring on profile; small chip when crossing threshold; **never** primary hero number on Rewards.

### Verified contribution (integer)

**What it measures:** Cumulative **confirmed** civic impact units.

**Goes up when:**
- Your report becomes verified
- You corroborate another report (verified)
- You support an existing report (verified corroboration)
- You complete mission/challenge contributions

**Does not go up when:**
- Report pending verification
- Duplicate filing
- Opening app / passive browsing

**Powers:**
- Civic champion ladder tiers
- Leaderboard rank
- Badge unlock thresholds
- Partner perk point requirements

**UI treatment:** Primary progression number on Rewards and profile summary.

### Pending contribution (labeled separately)

**What it measures:** Logged actions awaiting verification.

**UI treatment:** Muted chip—*"12 pending — not redeemable"*. Never animated. Never confusable with verified.

---

## 4. Event-driven architecture (required for v2)

Every gamification surface derives from **`RewardEvent`** records—not static seed alone.

| Event type | Trigger | Initial state | Becomes verified when |
|------------|---------|---------------|------------------------|
| `report_submitted` | Submit wizard | Pending | Community/admin verification |
| `verified_report` | Status → verified | Verified | — |
| `corroboration` | Confirm on verify/home/nearby | Verified* | Immediate if rules allow |
| `support_existing` | Duplicate support flow | Verified* | Same as corroboration |
| `resolution_witness` | User reopens or confirms fix | Pending/verified | Admin/crew closure |

*Rules configurable; MVP may verify corroboration immediately with fair-play caps.

### Propagation rule

```
Action → Event append → Recompute contribution + badges + rank → UI feedback
```

**Surfaces that must update:**
- Action toast (immediate)
- Profile summary (on visit)
- Rewards Progress tab (on visit or realtime)
- Leaderboard (deferred ok, max 1 session delay)
- Home activity stream (for neighborhood-visible events)

---

## 5. Mechanics catalog

### 5.1 Civic champion ladder

**Purpose:** Personal progression narrative without RPG leveling.

| Tier | Threshold (verified contribution units) | Narrative |
|------|----------------------------------------|-----------|
| Neighbor | 0+ | Getting started |
| Block Voice | 40+ | Regular contributor |
| Ward Helper | 100+ | Sustained impact |
| Civic Champion | 200+ | Exemplary participation |

**Principles:**
- Show **next tier + % progress**, not just current title
- Tier name appears on profile as honorific, not cartoon rank
- No tier demotion (contribution doesn't decrease; trust may)

### 5.2 Badges

**Purpose:** Memorable milestones for specific ethical behaviors.

| Badge | Unlock rule | Ethical intent |
|-------|-------------|----------------|
| First Verified Report | ≥1 verified report | Onboard to impact |
| Duplicate Defender | ≥5 support-existing/corroborations | Anti-noise |
| Streak Keeper | ≥7-day participation streak | Return habit |
| Ward Patrol | ≥3 verified reports | Sustained reporting |
| Neighborhood Verifier | ≥10 corroborations | Community validator |

**Unlock moment:**
- Single modal or bottom sheet: badge name + one line + dismiss
- No confetti; optional subtle scale-in
- Render seed `icon` field (shield, flame, etc.)
- Locked state shows **actionable gap**: *"2 more corroborations"*

### 5.3 Streaks

**Purpose:** Gentle return habit—not daily login farming.

**Counts:** Days with at least one qualifying civic action (verify, verified report, support).

**Principles:**
- Show streak on profile + Rewards Progress tab
- **No streak for app open alone**
- Optional calm nudge: *"Keep your 3-day streak — one confirm nearby"* (max 1/day)
- Breaking streak: informative, not punishing—*"Streak reset — welcome back"*

### 5.4 Leaderboard

**Purpose:** Social recognition for verified contribution in scope.

**Scope filters (v2):**
- Ward (default)
- School (youth mode)
- Block (future)

**Principles:**
- Label: **"Verified contribution"** not ambiguous "pts"
- Show user's rank even if not top 10: *"You're #14 in Ward 12"*
- Animate rank change modestly on climb
- No leaderboard for trust score (privacy + wrong incentive)
- Youth default: opt-in visibility

### 5.5 Milestones (personal checklist)

**Purpose:** Clear next actions for new users.

Examples:
- First verified impact (0/1)
- Five neighbor confirmations (0/5)
- Three-day participation streak (0/3)
- Track issue through resolution (0/1)

**Principles:**
- Each milestone links to **where to complete it**
- Checkbox fill animation on complete
- Completed milestones collapse to "Achieved" section

### 5.6 Community challenges (missions)

**Purpose:** Collective opt-in goals.

**Principles:**
- Explicit **Join** CTA
- Show personal + collective progress
- Deep link: Verify / Support / Report as appropriate
- **Recognition only**—no lottery
- Progress increments only on verified qualifying actions
- End state: "Completed — thanks to participants" archive card

### 5.7 Partner perk catalog

**Purpose:** Optional real-world redemption for sustained verified impact.

**Gates:**
- Verified contribution points threshold
- Trust score threshold
- Abuse freeze check

**Principles:**
- Locked state explains **both** requirements
- Redeem button disabled with reason—not hidden
- Redemption decrements verified points (v2)
- `partnerRewards` feature flag respected in UI
- Youth: no redemption; recognition only

---

## 6. Fair play and abuse prevention (visible)

Gamification must **punish gaming visibly** or it invites gaming.

| Signal | User-visible effect | Copy tone |
|--------|---------------------|-----------|
| Duplicate attempt after nudge | No contribution; trust penalty | Calm, helpful |
| Velocity spike | Rewards frozen | Informative |
| Suspicious report flag | Pending review; no points | Protective |
| Admin abuse flag | Catalog locked | Factual |

**Trust score decreases** must appear in profile trust history (v2): *"Duplicate filing attempt · −2 trust"*.

Domain functions `applyDuplicateTrustPenalty`, `recomputeTrustScore` must wire to flows—not just unit tests.

---

## 7. Surface placement matrix

Where mechanics appear (not all on Rewards):

| Mechanic | Home | Verify | Track | Success | Profile | Rewards |
|----------|------|--------|-------|---------|---------|---------|
| Action toast | ✓ | ✓ | — | ✓ | — | — |
| Activity stream | ✓ | — | — | — | — | — |
| Pulse → verify CTA | ✓ | — | — | — | — | — |
| Pending vs verified | — | — | ✓ | ✓ | chip | hero |
| Ladder | chip | — | — | — | summary | tab |
| Badges | — | gap hint | — | — | next unlock | tab |
| Leaderboard | — | — | — | — | rank | tab |
| Milestones | — | — | link | — | — | tab |
| Challenges | — | deep link | — | — | — | tab |
| Catalog | — | — | — | — | — | tab |
| Trust ring | — | — | — | — | ✓ | gate only |

**Rule:** Gamification **surfaces at the moment of action**; Rewards is the **reflection**, not the only stage.

---

## 8. Youth and family modifiers

| Rule | Implementation |
|------|----------------|
| Reduced point caps | Domain `youth-restrictions.ts` |
| No partner redemption | Catalog hidden or disabled |
| Leaderboard opt-in | Default off |
| School-scoped challenges | Youth page filter |
| Parent visibility | Family page activity summary |
| Supervised report proposals | Future gate |

Gamification for youth emphasizes **learning and recognition**, not commercial perks.

---

## 9. What we will not ship

| Mechanic | Why banned |
|----------|------------|
| Points per app open | Login farming |
| Points per unverified report | Noise incentive |
| Random loot boxes | Wrong tone |
| Pay-to-skip verification | Integrity violation |
| Leaderboard for report count | Volume over quality |
| Public shaming for low trust | Harassment risk |
| Time-limited FOMO flash sales | Commercial gimmick |
| Competing streaks with push spam | Anxiety |

---

## 10. Metrics that matter (product analytics)

| Metric | Healthy direction |
|--------|-------------------|
| Verify-to-report ratio | ↑ (community participation) |
| Support-existing vs duplicate submit | ↑ support |
| Verified contribution per active user | ↑ |
| Pending-to-verified conversion time | ↓ |
| Return within 7 days after first verify | ↑ |
| Redemption rate | moderate (not goal alone) |
| Abuse flag rate | ↓ |
| Trust score distribution | stable, not inflated |

**Vanity metrics to deprioritize:** DAU without verified actions, total reports without verification rate.

---

## 11. Implementation guardrails

1. **Single derivation path** — `contributionFromRewards(events)` everywhere for contribution display.
2. **Feature flags honored** — `partnerRewards`, `youthMode` gate UI.
3. **Optimistic UI with rollback** — Toast on action; revert on failure with explanation.
4. **Reduced motion** — Badge modal respects `prefers-reduced-motion`.
5. **Test coverage** — Event append → badge unlock → leaderboard shift integration tests.

---

## 12. v1 → v2 gamification summary

| v1 state | v2 target |
|----------|-----------|
| Seed-only reward events | Event pipeline from actions |
| Three competing numbers | Trust + verified contribution |
| Rewards dashboard scroll | Tabbed Progress / Recognition / Perks |
| Silent trust bumps | Visible deltas + history |
| Static challenges | Join + contribute + deep link |
| Badges never unlock live | Unlock modal on threshold |
| Leaderboard frozen | Rank updates on contribution |
| Philosophy copy ×3 | One dismissible line |

---

*Gamification Principles v2 · CivicResolve · Companion to interaction philosophy and redesign blueprint.*
