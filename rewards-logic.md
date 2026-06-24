# Rewards Logic — CivicResolve

## Design intent

CivicResolve rewards **verified, useful civic contribution** — not activity volume. The system combines:

1. **Intrinsic motivation** — milestones, badges, ladder recognition
2. **Public recognition** — neighborhood leaderboard (contribution score, not raw reports)
3. **Occasional partner perks** — catalog redemptions gated by trust + verified points

Tone: responsible, transparent, socially aligned — never slot-machine or gimmicky.

---

## Point values (verified only)

| Action | Points | Notes |
|--------|--------|-------|
| Verified report | 50 | After community/moderation verification |
| Corroboration (verify) | 25 | Confirming a neighbor's report |
| Support existing | 15 | Partial credit — prefer over duplicate filing |
| Resolution follow-through | 30 | Issue you tracked marked fixed |
| Submitted (pending) | 0 redeemable | Held until verified |

Youth support/verify actions are **capped at 10 points** per action.

---

## What earns nothing

| Condition | Result |
|-----------|--------|
| Duplicate submission (`duplicateRisk ≥ 70` or `isDuplicateSubmission`) | 0 points |
| Suspicious / flagged before validation | 0 until cleared |
| Unverified submission | Pending only — not redeemable |
| Repeat support by same user | No double credit (Phase 3 corroboration) |
| Rewards frozen (velocity abuse) | 0 new grants + redemption blocked |

---

## Redeemable vs pending

- **Redeemable** = `sum(verified reward events)`
- **Pending** = submitted reports awaiting verification — shown in UI but excluded from catalog eligibility

Implementation: `evaluateRewardGrant()` in `src/domain/reward-eligibility.ts`, `sumRedeemablePoints()`.

---

## Badges & ladder

- **Neighborhood badges** — unlock from verified reports, corroborations, streaks (`badge-unlocks.ts`)
- **Civic champion ladder** — tiers from contribution units (`civic-ladder.ts`)
- **Milestones** — progress markers, not loot boxes (`civic-milestones.ts`)

---

## Partner catalog

Items require **both**:

- Sufficient verified points (`pointsCost`)
- Minimum trust score (`minTrustScore`)

Lock reasons: `insufficient_points`, `trust_too_low`, `rewards_frozen`.

Redemption: `checkRedemptionEligibility()` + mock `redeemCatalogItem()`.

---

## Community challenges (optional shells)

School / ward / neighborhood opt-in challenges provide **recognition-only** progress — not a parallel points economy. See `community-challenges.ts`.

---

## Code map

| Module | Role |
|--------|------|
| `reward-eligibility.ts` | Grant evaluation |
| `reward-explanations.ts` | User-facing why earned / withheld copy |
| `contribution-score.ts` | Contribution units for ladder/leaderboard |
| `badge-unlocks.ts` | Badge thresholds |
| `reward-catalog.ts` | Lock/unlock evaluation |
| `redemption-eligibility.ts` | Redemption gates |
