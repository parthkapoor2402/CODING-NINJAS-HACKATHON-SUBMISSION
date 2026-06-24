# Supervised Youth Mode — CivicResolve

## Goals

- Let youth participate in civic life **safely**
- Prevent unsupervised reporting and reward farming
- Give parents visibility without exposing sensitive metadata

---

## Account model

| Role | Capabilities |
|------|----------------|
| `youth` | Propose reports; capped earn on support/verify; **no redemption** |
| `parent` | Approve proposals; full family hub; can redeem |
| `citizen` | Standard rewards flow |

Demo accounts: `demo-youth@local.dev`, `demo-parent@local.dev`.

---

## Reporting flow

1. Youth drafts a **proposal** (not directly submitted)
2. Parent reviews in Family hub (`/app/family`)
3. On approval, report enters normal verification pipeline

---

## Rewards restrictions

| Rule | Implementation |
|------|----------------|
| No partner redemption | `canYouthRedeem('youth') === false` |
| Capped support credit | `YOUTH_MAX_CORROBORATION_POINTS = 10` |
| No double credit | Shared corroboration store (Phase 3) |
| Family-safe labels | `toFamilySafeContributions()` hides report IDs |

UI: `youth-rewards-restricted` notice on YouthModePage.

---

## Family contributions view

Parents see:

- Plain-language activity labels (“Helped confirm an issue”)
- Verified vs pending status
- Point amounts (verified only)

They do **not** see raw report IDs or sensitive metadata in the youth-safe view.

`data-testid="family-contributions"` on YouthModePage.

---

## School / community challenges

Optional supervised challenge shells (`scope: 'school'`) appear on the family page — opt-in, recognition-focused, not required for core rewards.

---

## Code map

| File | Role |
|------|------|
| `src/domain/youth-restrictions.ts` | Caps, redemption block, safe labels |
| `src/features/youth-mode/YouthModePage.tsx` | Family hub UI |
| `src/domain/reward-eligibility.ts` | Youth point cap on grant |
