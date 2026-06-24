# Phase 4 Test Cases — Rewards, Trust & Family Safety

## Scope

Qualifying actions → points → badges → streaks → catalog/redemption → youth/family guardrails → abuse freezes.

---

## Principles

| Principle | Test expectation |
|-----------|------------------|
| Points follow verified civic value | Only qualifying, validated actions grant redeemable points |
| Duplicates do not farm rewards | Duplicate submissions earn zero |
| Suspicious reports held back | Flagged reports earn no points until cleared |
| Trust reflects real contribution | Contribution and trust scores use verified signal |
| Youth participation is supervised | Redemption blocked; capped earning; family-safe visibility |
| Abuse has consequences | Velocity/duplicate abuse freezes or reduces eligibility |

---

## Unit tests

### `reward-eligibility`

| ID | Case | Expected |
|----|------|----------|
| U46 | Qualifying verified action | Points granted when `verified: true` |
| U47 | Duplicate submission | Zero points, not verified |
| U48 | Suspicious before validation | Zero points while flagged |
| U49 | Pending submission | Points withheld until verified |
| U50 | Support existing report | Partial corroboration credit, not full report points |

### `contribution-score`

| ID | Case | Expected |
|----|------|----------|
| U51 | Verified contributions count | Sum verified reward weights |
| U52 | Blocked actions excluded | Duplicates/suspicious add nothing |

### `trust-score`

| ID | Case | Expected |
|----|------|----------|
| U53 | Recompute from signals | Trust reflects verification + contribution |
| U54 | Abuse penalty | Trust reduced on abuse flags |

### `badge-unlocks`

| ID | Case | Expected |
|----|------|----------|
| U55 | First verified report badge | Unlocks at 1 verified report |
| U56 | Streak badge threshold | Unlocks at 7-day streak |

### `streaks`

| ID | Case | Expected |
|----|------|----------|
| U57 | Consecutive days | Streak increments |
| U58 | Missed day | Streak resets to 1 |

### `reward-catalog`

| ID | Case | Expected |
|----|------|----------|
| U59 | Catalog locked | Below points or trust → locked |
| U60 | Catalog unlocked | Meets points and trust → unlocked |

### `redemption-eligibility`

| ID | Case | Expected |
|----|------|----------|
| U61 | Redemption blocked | Frozen or below thresholds → ineligible |

### `youth-restrictions`

| ID | Case | Expected |
|----|------|----------|
| U62 | Youth cannot redeem | Parent/citizen only |
| U63 | Youth support credit cap | Partial capped corroboration points |

### `abuse-eligibility`

| ID | Case | Expected |
|----|------|----------|
| U64 | Velocity freeze | High velocity freezes rewards |
| U65 | Duplicate abuse | Reduces eligibility / applies penalty |

### `family-visibility`

| ID | Case | Expected |
|----|------|----------|
| U66 | Family-safe filter | Youth view hides sensitive reward metadata |

---

## Component tests

### Rewards (`RewardsPage`)

| ID | Case | Expected |
|----|------|----------|
| C64 | Leaderboard renders | `rewards-leaderboard` with ranked users |
| C65 | Reward catalog lock/unlock | `reward-catalog` shows locked/unlocked items |
| C66 | Redemption eligibility | `redeem-reward-btn` disabled when ineligible |

### Youth / family (`YouthModePage`)

| ID | Case | Expected |
|----|------|----------|
| C67 | Youth restrictions | `youth-rewards-restricted` notice |
| C68 | Family contributions | `family-contributions` safe list |

---

## Test IDs contract

| Element | `data-testid` |
|---------|---------------|
| Leaderboard | `rewards-leaderboard` |
| Reward catalog | `reward-catalog` |
| Catalog item | `reward-catalog-item-{id}` |
| Locked item | `reward-catalog-locked` |
| Unlocked item | `reward-catalog-unlocked` |
| Redeem button | `redeem-reward-btn` |
| Youth restricted | `youth-rewards-restricted` |
| Family contributions | `family-contributions` |
| Verified points total | `verified-points-total` |
| Streak display | `rewards-streak` |

---

## Out of scope

- Live partner payment APIs
- Cross-city leaderboards
- Push notifications for badge unlocks
