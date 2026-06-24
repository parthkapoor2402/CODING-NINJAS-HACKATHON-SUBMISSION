# Duplicate Detection Logic

## Goal

Surface likely duplicates **before submit** so citizens support existing issues instead of creating noise. Duplicates are **not reward-eligible**.

## Signals (weighted)

| Signal | Weight | Source |
|--------|--------|--------|
| Same category | up to 35 | Draft vs nearby open reports |
| Text token overlap | up to 45 | Title + description Jaccard-style |
| Distance | up to 20 | Haversine within **250m** radius |
| AI risk hint | merged max | Grok + mock geo hotspot |

## Implementation

- `src/domain/duplicate-detection.ts`
  - `findLocalDuplicateMatches()` — queries `services.reports.findNearby`
  - `checkDuplicateRisk()` — merges local scores with `services.ai.detectDuplicateRisk`
  - `isHighDuplicateRisk()` — threshold **≥ 70**

## Mock demo hotspot

`mockAI.detectDuplicateRisk` returns high risk near **12.9736, 77.5956** (MG Road) → match `report-001`.

## UX contract

**Banner copy:**  
“This issue may already be reported nearby. Support the existing report or continue if this is meaningfully different.”

- `data-testid="duplicate-warning"`
- CTA: `support-existing-report` → community feed
- Submit remains enabled (no dead end)

## Runs when

1. **Location step** — after GPS / pin set
2. **Review step** — pre-submit refresh
