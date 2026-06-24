# Moderation Rules — Admin Operations

Rules governing suspicious reports, abuse review, duplicates, and resolution proof.

---

## Queue partition

| Queue | Includes | Excludes |
|-------|----------|----------|
| **Suspicious reports** | Report-linked cases: duplicate risk, low media | Account velocity, reward farming |
| **Abuse review** | Velocity spikes, reward farming, account-level flags | Report-only media issues |

Partition logic: `admin-moderation-queues.ts` — `kind` field + `reportId` presence.

---

## Case kinds

| Kind | Trigger | Default action |
|------|---------|----------------|
| `duplicate` | Near-identical geo + category | Merge into canonical; zero reward on duplicate |
| `media_quality` | Low-quality or missing evidence | Manual review before verify |
| `velocity` | Too many reports per hour | Freeze redeemable points |
| `reward_farming` | Corroboration ring / cluster farming | Abuse queue + trust penalty |

---

## Case lifecycle

```
open → reviewing → resolved | dismissed
```

| Action | Effect |
|--------|--------|
| **Review** | `status → reviewing`; holds rewards if applicable |
| **Dismiss** | False positive; restore eligibility |
| **Resolve** | Action taken (merge, reject, freeze confirmed) |
| **Merge** | Duplicate `status → merged`; canonical keeps rewards |

---

## Duplicate handling

1. System flags duplicate risk score on queue (>70% = highlight).
2. Moderator reviews in suspicious queue.
3. **Merge tool** sets duplicate `merged` + `duplicateOfId`.
4. Linked suspicious case auto-resolves.
5. Activity log records moderation event on canonical report.

**Reward rule:** Only canonical verified reports earn full points (see Phase 4 `reward-eligibility`).

---

## Assignment rules

| Condition | Result |
|-----------|--------|
| Report not terminal | Assignment allowed |
| Status `verified` / `acknowledged` / `pending_verification` | → `in_progress` on assign |
| Already `in_progress` | Worker swap allowed |
| `resolved` / `merged` / `rejected` | Assignment blocked |

---

## Resolution proof (admin-safe)

| Status | Citizen visibility | Admin action |
|--------|-------------------|--------------|
| `pending_review` | “Awaiting crew upload” / hidden closure | Approve or reject |
| `approved` | Full resolution proof on tracking + detail | Audit trail with `reviewedByAdminId` |
| `rejected` | Issue stays open; crew notified | Request re-upload |

Approving proof on `in_progress` report → `resolved`.

---

## Override policy

Admins may override status to `verified`, `acknowledged`, or `rejected` with moderation activity log entry.

**Use sparingly:** Edge cases (false duplicate, emergency verify) — every override is logged in issue updates (`kind: moderation`).

---

## Abuse consequences

| Signal | User impact |
|--------|-------------|
| Velocity flag | Points frozen until case resolved |
| Reward farming | Catalog locked; leaderboard held |
| Duplicate abuse | Trust score penalty; merge only |

Cross-reference: `abuse-prevention-rules.md`, Phase 4 abuse eligibility.
