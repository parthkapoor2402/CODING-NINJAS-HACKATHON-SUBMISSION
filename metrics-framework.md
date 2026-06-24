# Metrics Framework — CivicResolve

> Measure civic impact and product health—not vanity installs or raw report volume.

---

## 1. North Star Metric

### **Verified Issues on Path to Resolution (VIPR)**

**Definition:** Count of unique reports that reach `verified` status and subsequently reach `acknowledged`, `in_progress`, or `resolved` within 30 days.

**Why:** Captures the full civic loop—real issues, community trust, and municipal action—not spam submissions or abandoned drafts.

```
VIPR = verified reports with downstream ops engagement (30d window)
```

**MVP proxy (demo):** Seeded + user-generated reports hitting `verified` → `resolved` in demo script.

---

## 2. Leading Indicators

*Predict VIPR movement within 1–2 weeks.*

| Metric | Definition | Target (MVP pilot) |
|--------|------------|-------------------|
| **Median report submit time** | Tap Report → submit | < 60 seconds |
| **Duplicate redirect rate** | Users choosing support-existing when high match | > 40% |
| **Verification velocity** | Median hours to `verified` | < 48h |
| **Corroboration participation rate** | DAU who corroborate / DAU who view issues | > 15% |
| **First-report completion rate** | New users who complete 1 submit in session 1 | > 50% |
| **Media attach rate** | Reports with ≥1 photo or video | > 85% |
| **AI assist acceptance rate** | Users keeping AI category vs changing | Track (no gate) |
| **Permission grant rate** | Camera + location granted after primer | > 70% |
| **Trust dashboard views** | Profile trust section opens / WAU | Engagement signal |

---

## 3. Lagging Indicators

*Confirm sustained impact over 4–12 weeks.*

| Metric | Definition |
|--------|------------|
| **Median time-to-resolution** | `submitted` → `resolved` |
| **Resolution rate** | % verified reports eventually resolved |
| **Repeat reporter retention** | % users with 2+ verified reports in 90d |
| **Ward coverage** | % grid cells with ≥1 verified report |
| **Ops cost per resolution** | Admin minutes / resolved issue (Phase 2) |
| **Citizen satisfaction (CSAT)** | Post-resolution 1-tap rating |
| **Partner reward redemption rate** | Redemptions / eligible users |
| **Youth supervised completion** | Approved youth reports / proposed |

---

## 4. Guardrail Metrics

*Must not degrade while growing VIPR.*

| Guardrail | Threshold | Action if breached |
|-----------|-----------|-------------------|
| **Duplicate submit rate** | < 15% of all submits | Strengthen intercept UX |
| **Fake/spam rejection rate** | < 8% of submits | Review trust rules |
| **False reject rate** | < 5% of rejections appealed successfully | Moderator training |
| **Corroboration dispute overturn rate** | < 10% | Review verifier quality |
| **Reward clawback rate** | < 3% of issued points | Tighten eligibility |
| **Youth policy violations** | 0 critical | Disable feature |
| **Report abandon rate** | < 35% draft → submit | Wizard UX fix |
| **Camera fallback failure rate** | < 5% sessions with no media | Media pipeline fix |
| **Admin SLA breach rate** | < 10% high-severity | Staffing / priority algo |

---

## 5. Segment-Level Metrics

| Segment | Key metric |
|---------|------------|
| Commuter | Submit time, duplicate redirect |
| Resident | Corroborations given, return visits |
| Student | Verified reports, badge completion |
| Family/youth | Parent approval rate, cap adherence |
| Moderator | Queue clearance time, merge accuracy |
| Field worker | On-site update latency, proof attachment rate |

---

## 6. Funnel Metrics (Citizen)

```
App open
  → Onboarding complete
  → Permission granted
  → Report started
  → Media attached
  → Duplicate check passed / redirected
  → Submitted
  → Verified
  → Resolved
  → Reward claimed
  → Return D7
```

Track drop-off at each step; **biggest MVP focus:** duplicate check → support-existing branch.

---

## 7. Admin / Ops Metrics

| Metric | Purpose |
|--------|---------|
| Queue depth by severity | Staffing |
| Mean time in `pending_verification` | Community health |
| Merge rate | Duplicate system efficacy |
| AI vs manual category agreement | Model quality |
| Reports per moderator hour | Efficiency |

---

## 8. Event Taxonomy (Analytics Implementation)

### Core events (snake_case)

```
app_opened
onboarding_completed
permission_requested { type: camera|location|library }
permission_result { type, granted: boolean }
report_started
report_media_attached { source: camera|gallery|video, size_kb, duration_sec }
duplicate_suggested { match_count, top_score }
duplicate_redirect_accepted
duplicate_override { reason }
report_submitted { category, severity, has_ai_category }
report_verified
report_resolved
corroboration_submitted { type: confirm|dispute|evidence }
reward_earned { type, points, verified: boolean }
trust_score_viewed
youth_report_proposed
youth_report_approved
admin_merge_completed
admin_reject { reason_code }
```

### Privacy
- No raw GPS in analytics events—bucket to ward/grid
- No media URLs in events—boolean flags only

---

## 9. Dashboard Views

### Citizen (profile)
- Personal VIPR contribution: verified + resolved count
- Neighborhood impact: issues resolved near home (30d)

### Admin
- VIPR trend (daily)
- Funnel drop-off chart
- Guardrail traffic lights
- Heatmap of verification latency

---

## 10. MVP Measurement Approach

| Approach | Detail |
|----------|--------|
| Analytics adapter | `console` + local JSON in MVP; PostHog/Amplitude Phase 2 |
| Seeded benchmarks | Pre-load 50 reports with known VIPR for demo charts |
| Demo KPI slide | VIPR, median submit time, duplicate redirect %, resolution rate |
| Manual QA | Script timers on 6 demo flows |

---

## 11. Success Criteria (Hackathon / Pilot)

| Criteria | Target |
|----------|--------|
| End-to-end demo flows | 6/6 pass |
| Median submit time (scripted) | < 45s |
| Duplicate intercept demonstrated | Yes |
| Trust scores visible + explained | Yes |
| Admin merge + resolve shown | Yes |
| Youth supervised flow shown | Yes |
| Guardrails documented | Yes |

---

## Related Documents

- [product-requirements.md](./product-requirements.md)
- [trust-and-safety.md](./trust-and-safety.md)
- [phased-plan.md](./phased-plan.md)
