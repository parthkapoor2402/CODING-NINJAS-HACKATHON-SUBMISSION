# Fake / Low-Quality Report Handling

## Tone

Respectful and factual — **never accusatory**. Flags inform verification policy; they do not block submit.

## Checks (`src/domain/suspicious-report.ts`)

| Check | Trigger | User message |
|-------|---------|--------------|
| Low-resolution media | Image &lt; 10KB | Evidence may be too low-resolution |
| Text-only report | `textOnlyFallback` | Neighbors rely on description alone |
| Category mismatch | Keywords vs selected category | Double-check category |
| Thin description | &lt; 20 chars, no media | Very little detail for crews |
| Rapid resubmission | ≥ 3 reports same day | Extra verification may apply |
| High duplicate risk | score ≥ 70 | Rewards only for unique verified issues |

## Outcomes

```typescript
{
  flagged: boolean,
  reasons: string[],
  requiresVerification: boolean,
  rewardEligible: boolean
}
```

## UI

- `low-quality-warning` — media validation flag
- `suspicious-warning` — combined respectful notice on review step
- Success step explains reward eligibility

## Policy

- Suspicious / duplicate → **community verification or admin review** before rewards
- Submit always allowed when form valid
- Admin queue can use same flags in Phase 3
