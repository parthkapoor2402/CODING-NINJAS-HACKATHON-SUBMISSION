# Phase 3 Test Cases — Community Feed, Verification & Tracking

## Scope

Nearby feed → issue detail → support/verify → trust updates → my reports tracking, filters, reopen, resolution proof.

---

## Principles

| Principle | Test expectation |
|-----------|------------------|
| Neighbors see actionable nearby issues | Feed renders with distance and status |
| Sorting helps triage | Distance and urgency sorts are deterministic |
| Support ≠ duplicate noise | Support existing increments corroboration once per user |
| Trust grows on verified contribution | Verification updates user trust scores |
| Citizens track their own reports | My reports list with filters and timeline |
| Suspicious issues are visible, not hidden | Notice shown where flagged |

---

## Unit tests

### `issue-sorting`

| ID | Case | Expected |
|----|------|----------|
| U37 | Sort by distance | Nearest issue first |
| U38 | Sort by urgency | High severity / pending verification prioritized |
| U39 | Urgency tie-breaker | Higher severity before lower at same status |
| U40 | Distance calculation | Haversine km between user and issue |

### `corroboration`

| ID | Case | Expected |
|----|------|----------|
| U41 | First support succeeds | `corroborationCount` increments |
| U42 | Repeat support same user | Rejected — no double credit |
| U43 | Support own report | Rejected |

### `trust-updates`

| ID | Case | Expected |
|----|------|----------|
| U44 | Apply verification bonus | `verificationScore` increases |
| U45 | Recompute trust score | `trustScore` reflects verification delta |

---

## Component tests

### Nearby feed (`NearbyIssuesPage`)

| ID | Case | Expected |
|----|------|----------|
| C51 | Renders nearby feed | `nearby-feed` with issue cards |
| C52 | Sort by distance / urgency | Sort controls update order |

### Issue detail (`IssueDetailPage`)

| ID | Case | Expected |
|----|------|----------|
| C53 | Detail page renders | `issue-detail-page` with description |
| C54 | Support existing action | `support-existing-btn` calls corroborate |
| C56 | Duplicate marker | `duplicate-issue-marker` when duplicate |
| C63 | Suspicious notice | `suspicious-issue-notice` when flagged |

### Community verification (`VerificationPage`)

| ID | Case | Expected |
|----|------|----------|
| C55 | Verify action | `verify-issue-btn` corroborates issue |

### Trust (`VerificationPage` + auth)

| ID | Case | Expected |
|----|------|----------|
| C57 | Trust after verification | User `verificationScore` increases |

### Tracking (`TrackingPage`)

| ID | Case | Expected |
|----|------|----------|
| C58 | Issue timeline | `issue-timeline` on report card |
| C59 | My reports list | `my-reports-list` renders user reports |
| C60 | Filters | `my-reports-filter-*` filters list |
| C61 | Reopen unresolved | `reopen-issue-btn` changes status |
| C62 | Resolution proof | `resolution-proof` on resolved reports |

---

## Test IDs contract

| Element | `data-testid` |
|---------|---------------|
| Nearby feed | `nearby-feed` |
| Sort distance | `sort-by-distance` |
| Sort urgency | `sort-by-urgency` |
| Issue detail page | `issue-detail-page` |
| Support existing | `support-existing-btn` |
| Verify issue | `verify-issue-btn` |
| Duplicate marker | `duplicate-issue-marker` |
| Suspicious notice | `suspicious-issue-notice` |
| Issue timeline | `issue-timeline` |
| My reports list | `my-reports-list` |
| Filter chips | `my-reports-filter-{all\|open\|resolved\|needs_action}` |
| Reopen issue | `reopen-issue-btn` |
| Resolution proof | `resolution-proof` |

---

## Out of scope

- Live map clustering
- Realtime push updates
- Admin merge UI
- E2E Playwright community flows
