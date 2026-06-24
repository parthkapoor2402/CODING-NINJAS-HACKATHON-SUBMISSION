# Trust Score Logic — CivicResolve

## Purpose

Trust score answers: *“How much should we rely on this citizen’s signal and reward eligibility?”*

It is **not** a popularity score. It reflects verified contribution, verification participation, and abuse risk.

---

## Components (`TrustSnapshot`)

| Field | Meaning |
|-------|---------|
| `trustScore` | 0–100 composite used for perk eligibility |
| `contributionScore` | Cumulative civic contribution weight |
| `verificationScore` | Points from neighbor confirmations |
| `duplicateRisk` | Elevated by duplicate attempts |
| `abuseFlags` | e.g. `velocity_spike`, `duplicate_abuse` |

---

## Updates

### Verification support (+3 trust, +5 verification score)

When a user corroborates/supports an issue they did not report:

- `applyVerificationTrust()` — Phase 3 auth store update
- `applyVerificationToTrust()` — `trust-score.ts`

### Recompute formula

`recomputeTrustScore(trust, verifiedContributionUnits)`:

```
base 50
+ verificationScore × 0.3
+ contributionUnits × 0.1
− abuseFlags.length × 5
− floor(duplicateRisk / 20)
→ clamp 0–100
```

### Penalties

- `applyAbuseTrustPenalty()` — adds flag, reduces trust
- `applyDuplicateTrustPenalty()` — duplicate filing risk (`trust-updates.ts`)

---

## Effect on rewards

| Trust level | Effect |
|-------------|--------|
| Below catalog `minTrustScore` | Partner perks locked |
| Abuse flags / freeze | Redemption blocked |
| High trust + verified points | Catalog unlock + redeem |

UI copy: `explainTrustForRewards()` in `reward-explanations.ts`.

---

## What trust is NOT

- Not increased by raw submission count
- Not increased by duplicate filings
- Not increased while suspicious review is pending

---

## Code map

| File | Role |
|------|------|
| `src/domain/trust-score.ts` | Recompute + abuse penalty |
| `src/domain/trust-updates.ts` | Live session updates on verify |
| `src/domain/reward-catalog.ts` | Trust threshold for perks |
