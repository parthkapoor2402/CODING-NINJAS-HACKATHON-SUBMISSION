# Analytics Definitions — Admin Dashboard

Each admin metric ties to **transparency**, **accountability**, or **efficiency**.

---

## Dashboard KPIs

| Metric | Definition | Civic pillar |
|--------|------------|--------------|
| **Open queue** | Non-terminal reports (`!resolved/merged/rejected`) sorted by priority score | Efficiency — triage workload |
| **Avg. time to verify** | Median hours from `createdAt` to first verified/in-progress transition | Transparency — neighbor confirmation speed |
| **Suspicious cases** | Moderation cases with `status: open` | Accountability — trust before rewards |
| **Resolved (7d)** | Reports with `resolvedAt` in last 7 days | Accountability — verified outcomes |
| **SLA at risk** | High severity + no `assignedWorkerId` in open queue | Efficiency — prevent breach |
| **Duplicate clusters** | Reports merged or flagged duplicate risk | Efficiency — single ticket per issue |
| **Crew active** | Reports in `in_progress` | Efficiency — field throughput |

---

## Response time metrics

| Metric | Definition | Target direction |
|--------|------------|------------------|
| **Median verify time** | Time to community + system verification | ↓ faster |
| **Median resolution** | Time from report to `resolved` | ↓ faster |
| **SLA breach rate** | % high-severity past due without assignment | ↓ lower |

Source: `getResponseTimeMetrics()` — verify time derived from live queue snapshot; resolution/breach from seed baselines adjusted at runtime.

---

## Category trends

| Field | Definition |
|-------|------------|
| `count` | Open + active reports per category (seed-weighted for demo density) |
| `changePct` | % change vs prior-period baseline in `admin-analytics-compute.ts` |

**Use:** Crew staging, budget transparency, council reporting.

---

## Duplicate redirect rate

```
(merged reports + reports with duplicateOfId) / all non-draft reports × 100
```

**Pillar:** Efficiency — citizens redirected to existing issues instead of spawning duplicates.

---

## Reward abuse flags

Account-level signals from velocity, duplicate farming, corroboration rings.

| Severity | Meaning |
|----------|---------|
| high | Points frozen; requires abuse queue resolution |
| medium | Manual review; partial point hold |
| low | Monitor only |

**Pillar:** Accountability — protects reward program integrity.

---

## Predictive insights

| Field | Definition |
|-------|------------|
| `confidence` | Model confidence 0–100 (mock) |
| `summary` | Expected issue volume / category by ward |

**Pillar:** Efficiency — proactive crew positioning before spikes.

---

## Ward hotspot insights

Computed by `computeWardHotspots()` from open report geo:

| Field | Definition |
|-------|------------|
| `openIssues` | Count per `wardId` |
| `trend` | `rising` / `stable` / `cooling` vs ward baseline |
| `topCategory` | Dominant issue type in ward |
| `localityHint` | Address or ward label |
| `changePct` | % vs baseline open count |

**Pillar:** Transparency — where problems cluster; accountability — ward-level performance.

---

## VIPR & contributors (analytics header)

| Metric | Definition |
|--------|------------|
| **VIPR (30d)** | Verified Issues Per 1k Residents — demo static 28 |
| **Active contributors** | Unique reporters + corroborators (demo static 156) |

**Pillar:** Transparency — civic participation visibility for elected oversight.
