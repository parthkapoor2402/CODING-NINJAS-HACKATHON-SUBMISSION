# Abuse Prevention Rules — CivicResolve

## Philosophy

Gamification must not incentivize spam, duplicates, or velocity farming. Abuse rules **reduce or freeze** reward eligibility while keeping citizens informed.

---

## Detection signals

| Signal | Threshold | Action |
|--------|-----------|--------|
| Velocity spike | ≥ 5 reports / hour | `velocity_spike` flag → **rewards frozen** |
| Duplicate abuse | ≥ 3 duplicate attempts | `duplicate_abuse` flag → 50% eligibility multiplier |
| High duplicate risk | `duplicateRisk ≥ 70` on submit | No points granted |
| Suspicious assessment | `assessSuspiciousReport()` flagged | No points until validated |

Implementation: `assessAbuseEligibility()` in `src/domain/abuse-eligibility.ts`.

---

## Reward grant blocks

`evaluateRewardGrant()` returns `grant: false` when:

- `abuseFrozen === true`
- `isDuplicateSubmission` or `duplicateRisk ≥ 70`
- `suspiciousFlagged && !verified`
- Action not yet verified (except pending submitted_record tracking)

---

## Trust impact

- `applyAbuseTrustPenalty()` — −5 trust per new abuse flag
- `applyDuplicateTrustPenalty()` — increases `duplicateRisk`, reduces trust
- Frozen accounts cannot redeem catalog items

---

## User-facing transparency

| State | Message |
|-------|---------|
| Frozen | “Rewards paused while unusual activity is reviewed.” |
| Duplicate | “No points — support the existing report instead.” |
| Suspicious pending | “Held until extra review clears.” |
| Repeat support | “You already supported this report.” |

Copy in `reward-explanations.ts` and `explainRedemptionBlock()`.

---

## What we do NOT do

- Shadow-ban without notice on citizen screens
- Permanent point deletion without review path (demo uses flags)
- Reward raw submission volume

---

## Code map

| File | Role |
|------|------|
| `abuse-eligibility.ts` | Freeze + multiplier |
| `reward-eligibility.ts` | Grant denial |
| `suspicious-report.ts` | Pre-submit assessment |
| `duplicate-detection.ts` | Nearby duplicate risk |
