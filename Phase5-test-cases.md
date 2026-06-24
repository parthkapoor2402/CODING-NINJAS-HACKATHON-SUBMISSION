# Phase 5 Test Cases — Admin Operations Dashboard

## Scope

Admin issue queue with filters, moderation queues (suspicious + abuse), hotspot map, issue moderation panel, assignment actions, dashboard KPIs, analytics (response time, category trends, hotspot trends, reward abuse flags, predictive insights), and manual review / override flows.

---

## Principles

| Principle | Test expectation |
|-----------|------------------|
| Queue is actionable | Admins see prioritized open issues with filter controls |
| Moderation is split | Report-level suspicious cases vs account/reward abuse cases |
| Assignment is explicit | Assigning a worker updates report state predictably |
| Analytics are visible | KPI and trend surfaces render with stable test IDs |
| Overrides are auditable | Manual review and status override actions are available |

---

## Unit tests

### `admin-queue-filters`

| ID | Case | Expected |
|----|------|----------|
| U67 | Filter by category | Only matching category items remain |
| U68 | Filter by severity | Only matching severity items remain |
| U69 | Filter by status | Only matching status items remain |

### `admin-assignment`

| ID | Case | Expected |
|----|------|----------|
| U70 | Assign worker to open report | Sets `assignedWorkerId`, moves eligible status to `in_progress` |
| U71 | Cannot assign terminal report | Resolved/merged/rejected reports rejected |

### `admin-moderation-queues`

| ID | Case | Expected |
|----|------|----------|
| U72 | Partition cases | Report-linked → suspicious; velocity/account → abuse |

---

## Component tests

### Admin queue (`AdminQueuePage`)

| ID | Case | Expected |
|----|------|----------|
| C69 | Issue queue renders | `admin-issue-queue` lists queue items |
| C70 | Filter by category | Category filter narrows visible items |
| C71 | Filter by severity | Severity filter narrows visible items |
| C72 | Filter by status | Status filter narrows visible items |

### Moderation (`AdminModerationPage`)

| ID | Case | Expected |
|----|------|----------|
| C73 | Suspicious reports queue | `suspicious-reports-queue` shows report-linked cases |
| C74 | Abuse review queue | `abuse-review-queue` shows velocity/account cases |

### Hotspots (`AdminHotspotPage`)

| ID | Case | Expected |
|----|------|----------|
| C75 | Hotspot map renders | `hotspot-map` visible |
| C81 | Hotspot trend cards | `hotspot-trend-cards` with ward trend cards |

### Issue moderation (`AdminIssueDetailPage`)

| ID | Case | Expected |
|----|------|----------|
| C76 | Moderation panel renders | `issue-moderation-panel` for selected issue |
| C77 | Assignment action | `assign-issue-btn` assigns worker and updates UI |
| C84 | Manual review / override | `manual-review-btn` and `override-status-btn` trigger actions |

### Dashboard (`AdminDashboardPage`)

| ID | Case | Expected |
|----|------|----------|
| C78 | KPI cards render | `admin-dashboard-kpis` with open queue, SLA, suspicious, resolved metrics |

### Analytics (`AdminAnalyticsPage`)

| ID | Case | Expected |
|----|------|----------|
| C79 | Response-time metrics | `response-time-metrics` section renders |
| C80 | Category trend | `category-trend-chart` section renders |
| C82 | Reward abuse flags | `reward-abuse-flags` section renders |
| C83 | Predictive insights | `predictive-insights-cards` section renders |

---

## Test IDs contract

| Element | `data-testid` |
|---------|---------------|
| Admin issue queue | `admin-issue-queue` |
| Queue item | `admin-queue-item-{reportId}` |
| Category filter | `admin-filter-category` |
| Severity filter | `admin-filter-severity` |
| Status filter | `admin-filter-status` |
| Suspicious queue | `suspicious-reports-queue` |
| Abuse review queue | `abuse-review-queue` |
| Hotspot map | `hotspot-map` |
| Hotspot trend cards | `hotspot-trend-cards` |
| Hotspot trend card | `hotspot-trend-card-{wardSlug}` |
| Issue moderation panel | `issue-moderation-panel` |
| Assign issue | `assign-issue-btn` |
| Dashboard KPIs | `admin-dashboard-kpis` |
| Response time metrics | `response-time-metrics` |
| Category trend | `category-trend-chart` |
| Reward abuse flags | `reward-abuse-flags` |
| Predictive insights | `predictive-insights-cards` |
| Manual review | `manual-review-btn` |
| Override status | `override-status-btn` |

---

## Out of scope

- Live GIS / Mapbox heatmap tiles
- Multi-tenant admin RBAC beyond demo admin
- Export / CSV download
- Real-time websocket queue updates
