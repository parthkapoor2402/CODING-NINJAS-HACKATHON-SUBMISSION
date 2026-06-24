# Admin Demo Scenarios — CivicResolve

Walk through these flows as `demo-admin@local.dev` to show operational value.

---

## 1. Morning ops pulse (Dashboard)

**Route:** `/admin/dashboard`

**What to show**
- **Open queue** — live count from prioritized mock reports (efficiency: what needs triage today).
- **Avg. time to verify** — computed from report lifecycle (transparency: neighbors see timely confirmation).
- **Suspicious cases** — open moderation items (accountability: trust signals before rewards).
- **Resolved (7d)** — recent verified closures (accountability: proof-backed fixes).
- **SLA alert** — high-severity items without crew assignment (efficiency: prevent breach).
- **Duplicate signals** — link to moderation (transparency: no double ticketing).

---

## 2. Triage the ward queue

**Route:** `/admin/queue`

**Demo steps**
1. Filter **category → Water leak** — only `report-002` remains (crew already assigned).
2. Filter **severity → Medium** — `report-003` (streetlight) and `report-006` (sanitation).
3. Filter **status → In progress** — active crew work on `report-002`.
4. Open **report-001** — high priority pothole, verified, awaiting assignment.

**Talking point:** Priority score = severity × corroboration; duplicate risk visible before routing rewards.

---

## 3. Assign field crew

**Route:** `/admin/queue/report-001`

**Demo steps**
1. Select **Field Crew Lead** or **Road Maintenance Unit**.
2. Click **Assign field worker** — status moves to `in_progress`, activity log + field timeline update.
3. Show **Field crew updates** on `report-002` — realistic mock progression (on site → patch → proof submitted).

**Talking point:** Assignment is explicit and auditable; citizens see crew activity on their timeline.

---

## 4. Suspicious vs abuse moderation

**Route:** `/admin/moderation`

**Suspicious reports queue**
- `suspicious-001` — duplicate cluster on `report-005` (reviewing).
- `suspicious-003` — low media on `report-003` (open).

**Abuse / reward-farming queue**
- `suspicious-002` — velocity spike (account-level).
- `suspicious-004` — reward farming pattern (points held).

**Demo steps**
1. Click **Review** on a suspicious report — status → `reviewing`.
2. Use **Merge tool** — canonical `report-001`, duplicate `report-005` — merges duplicate, resolves case.
3. **Dismiss** or **Resolve** abuse flags after review.

**Talking point:** Split queues keep report-quality issues separate from account-level farming.

---

## 5. Hotspot map & ward insights

**Route:** `/admin/hotspots`

**Demo steps**
1. Toggle **Water** filter — map pin count and ward cards reflect category filter.
2. Open **Ward 12** card — rising trend, MG Road locality, top category pothole.
3. Link to queue for ward triage.

**Talking point:** Insights computed from open reports — proactive crew staging, not decorative pins.

---

## 6. Analytics for council reporting

**Route:** `/admin/analytics`

**Demo steps**
1. **Response time trends** — verify, resolution, SLA breach rate.
2. **Category trends** — bar chart with % change vs prior period.
3. **Reward abuse flags** — tied to moderation outcomes.
4. **Predictive insights** — Ward 12 pothole cluster, water leak seasonality.

**Talking point:** Every metric maps to transparency (VIPR, contributors), accountability (SLA, abuse), or efficiency (duplicates, predictions).

---

## 7. Resolution proof (admin-safe)

**Routes:** `/admin/queue/report-002` (pending), `/admin/queue/report-004` (approved)

**Demo steps**
1. On **report-002** — crew submitted proof **pending_review**; admin approves or rejects before public closure.
2. On **report-004** — approved proof; citizen tracking shows resolution proof.

**Talking point:** Citizens only see verified closure after admin approves crew evidence.

---

## Demo accounts

| Email | Role |
|-------|------|
| `demo-admin@local.dev` | Admin ops |
| `demo-worker@local.dev` | Field crew (seed updates) |
| `demo-citizen@local.dev` | Reporter / abuse-flag demo user |
