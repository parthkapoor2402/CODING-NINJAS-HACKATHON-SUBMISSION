# Product Requirements Document — CivicResolve

> **Codename:** CivicResolve  
> **Type:** Mobile-first civic issue reporting & resolution platform  
> **Status:** Planning only — no implementation code in this phase

---

## 1. Product Thesis (5 bullets)

1. **Report in seconds, resolve with accountability** — Citizens capture real-world issues outdoors with photo/video + location in under 60 seconds; every report is traceable from submission to municipal resolution.
2. **Support before spam** — The product actively steers users toward existing nearby reports (duplicate detection + merge UX) so civic signal rises without noise.
3. **Trust is the product** — Verification, anti-abuse scoring, and community corroboration are first-class flows—not backend-only rules—visible in every report card and reward state.
4. **Responsible rewards, not point farming** — Gamification reinforces verified civic contribution (confirmations, unique reports, resolution follow-ups), with youth/family modes that cap incentives and require supervision.
5. **AI assists, humans decide** — Grok-powered categorization, severity hints, duplicate risk, and admin prioritization accelerate workflows but never block reporting when AI is unavailable or declined.

---

## 2. User Segments

| Segment | Primary need | Device context |
|--------|--------------|----------------|
| **Commuter / working professional** | Fast report while in transit; minimal friction | Mobile, one-handed, poor connectivity moments |
| **Neighborhood resident** | Hyperlocal awareness, recurring issues, community pride | Mobile + occasional tablet |
| **Student / youth civic contributor** | Learn civic responsibility, earn recognition safely | Mobile, social sharing appetite |
| **Family / supervised youth mode** | Parent-guided participation, safe boundaries | Shared device, parental controls |
| **Moderator / admin** | Triage, fraud review, SLA oversight, analytics | Desktop / tablet dashboard |
| **Field resolution worker** | Assigned jobs, status updates, proof of fix | Mobile in field + tablet dispatch |

---

## 3. User Trigger Moments (by segment)

### Commuter / working professional
- Hits pothole / sees water leak on daily route
- Notices broken streetlight during evening commute
- Wants to report without stopping workflow for 10+ minutes

### Neighborhood resident
- Sees same garbage dump for 3rd week
- Notices issue reported by neighbor—wants to confirm
- Checks map for “what’s happening near home”

### Student / youth civic contributor
- School/community cleanup drive
- Wants badge for first verified report
- Sees leaderboard / class challenge

### Family / supervised youth mode
- Parent enables youth account after onboarding
- Child spots park maintenance issue on walk
- Parent reviews and co-submits report

### Moderator / admin
- Spike in reports in one ward
- Duplicate cluster needs merge decision
- SLA breach alert on high-severity water leak

### Field resolution worker
- New assignment pushed to device
- Arrives on-site, needs before/after photos
- Marks job complete with proof

---

## 4. End-to-End User Journeys

### Citizen: First open → reward → return

```
App open → Splash / value prop
  → Onboarding (location explain, permissions primer, account)
  → Home (map + nearby issues feed)
  → Trigger: sees issue OR taps Report
  → Pre-report duplicate check (map + AI text/media similarity)
      ├─ Match found → Support existing report flow → +verification credit
      └─ No match → Capture media (camera/gallery/video)
  → AI-assisted category + severity (editable)
  → Pin location (auto GPS + manual adjust)
  → Submit → Pending verification state
  → Push/in-app: “3 neighbors confirmed your report”
  → Status updates: Acknowledged → In progress → Resolved
  → Reward unlock (verified contribution only)
  → Return loop: streak reminder, “issue near you resolved”, new hotspot alert
```

### Admin: Triage → resolution → impact

```
Dashboard login → Ops overview (volume, SLA, hotspots)
  → Queue: new / flagged / duplicate-risk
  → Open report → media, trust scores, corroborations
  → Actions: assign, merge, escalate, reject (with reason)
  → Field worker dispatched → tracks status
  → Resolution verified → citizen notified → impact metric updated
  → Analytics: ward trends, repeat issues, team performance
```

### Youth (supervised)

```
Parent creates family hub → invites youth profile
  → Youth browses (read-only map) → proposes report
  → Parent approval gate for submit
  → Reduced reward caps, no public leaderboard opt-in by default
  → Parent dashboard: activity summary
```

---

## 5. Core Jobs-to-be-Done

| Job | User | Success signal |
|-----|------|----------------|
| Report a problem quickly with proof | Citizen | <60s median submit time |
| Find if someone already reported this | Citizen | Duplicate redirect rate >40% on near-matches |
| Confirm or dispute a neighbor’s report | Citizen | Corroboration within 48h |
| Track what happened to my report | Citizen | Status clarity score in testing |
| Prioritize what matters today | Admin | Severity + SLA queue ranking |
| Stop fake/spam from wasting ops time | Admin | <5% false-positive rejections |
| Prove I fixed the issue | Field worker | Before/after media attached |
| Feel recognized for real civic help | Citizen | Reward tied to verified events only |

---

## 6. Problem Framing & What Existing Civic Apps Miss

### The problem
Communities face fragmented reporting (WhatsApp groups, Twitter, helplines). Citizens lack feedback loops. Municipalities drown in duplicates and low-quality submissions. Trust erodes when nothing appears to happen.

### What incumbents usually miss
- **Duplicate encouragement** — Most apps accept redundant reports and punish ops; few *reward* supporting an existing ticket.
- **Trust visible in UX** — Scores and verification states hidden in admin-only tools.
- **Real mobile capture** — Desktop-first forms with “attach file” instead of camera-native flows.
- **Responsible gamification** — Raw point leaderboards invite farming and unsafe youth competition.
- **AI with escape hatches** — Mandatory AI steps break demos and low-connectivity users.
- **Resolution closure** — Reports die in a black hole; no citizen-facing “fixed” moment.
- **Family-safe participation** — Binary 18+ gates instead of supervised contribution.

---

## 7. Information Architecture

```
CivicResolve
├── Citizen App (mobile-first)
│   ├── Home (Map + Feed hybrid)
│   ├── Report (create / support existing)
│   ├── Track (My reports + subscriptions)
│   ├── Community (verify, leaderboard, challenges)
│   ├── Rewards (badges, streaks, partners)
│   └── Profile (trust, settings, family/youth)
├── Admin Dashboard (desktop/tablet)
│   ├── Operations (queues, assignments)
│   ├── Moderation (trust, duplicates, abuse)
│   ├── Analytics (impact, hotspots, SLA)
│   ├── Users & roles
│   └── System config (categories, rewards rules)
└── Shared
    ├── Auth & identity
    ├── Notifications
    ├── Media pipeline
    └── AI / maps / backend adapters
```

---

## 8. Mobile Navigation Architecture

**Primary:** Bottom tab bar (5 items, 44px+ touch targets)

| Tab | Icon role | Notes |
|-----|-----------|-------|
| Home | Map pin / home | Default landing; map-first on mobile |
| Report | Camera + | FAB-style emphasis; opens report sheet |
| Track | List / timeline | My reports + followed issues |
| Community | People / shield | Verify, challenges, recognition |
| Profile | User | Trust summary, settings, family mode |

**Secondary navigation**
- Stack navigators per tab for drill-down (issue detail, settings sub-pages)
- Modal sheets for report flow (keeps context of map)
- Admin: left sidebar (collapsible) + top bar for global search/filters

**Responsive rules**
- `<768px`: bottom tabs only, full-screen map
- `768px–1024px`: split view optional (list + map)
- `≥1024px` admin: multi-column dashboard layout

---

## 9. Citizen Screen Inventory

| # | Screen | Purpose |
|---|--------|---------|
| 1 | Splash / cold start | Brand, session restore |
| 2 | Welcome carousel (skippable) | Value prop, trust promise |
| 3 | Sign up / login | Email, phone OTP, social (adapter) |
| 4 | Permission primer | Location, camera—context before OS prompt |
| 5 | Home — map view | Pins, clusters, user location |
| 6 | Home — feed view | Nearby issues cards toggle |
| 7 | Issue detail (public) | Media, status, corroborate CTA |
| 8 | Report — entry | “New issue” vs “support existing” |
| 9 | Report — duplicate suggestions | Nearby matches, similarity % |
| 10 | Report — media capture | Camera / gallery / video |
| 11 | Report — media review | Crop, retake, delete clip |
| 12 | Report — category & description | AI prefill, manual override |
| 13 | Report — location pin | Map drag, address search |
| 14 | Report — review & submit | Trust notice, submit |
| 15 | Report — success | Share, track, support another |
| 16 | Support existing — confirm | Add photo/comment to corroborate |
| 17 | Track — my reports list | Filters by status |
| 18 | Track — issue timeline | Status history, ETA |
| 19 | Notifications center | Verification, status, rewards |
| 20 | Community — verify queue | Nearby unverified reports |
| 21 | Community — challenges | Ward / school challenges |
| 22 | Community — recognition wall | Top contributors (opt-in) |
| 23 | Rewards — overview | Badges, streaks, level |
| 24 | Rewards — partner perks | Redeem verified-only |
| 25 | Profile — trust dashboard | Scores explained |
| 26 | Profile — settings | Notifications, privacy, language |
| 27 | Family hub — parent view | Linked youth, approvals |
| 28 | Youth — propose report | Pending parent gate |
| 29 | Empty / error states | No issues, offline, denied perms |
| 30 | Onboarding complete | First-report nudge |

---

## 10. Admin Screen Inventory

| # | Screen | Purpose |
|---|--------|---------|
| 1 | Admin login | Role-based access |
| 2 | Ops dashboard | KPI tiles, live map |
| 3 | Report queue | Sortable, filterable table |
| 4 | Report detail — moderation | Full evidence, scores, actions |
| 5 | Duplicate merge workspace | Side-by-side compare |
| 6 | Assignment board | Drag to field workers |
| 7 | Field worker mobile view | My assignments (responsive) |
| 8 | Resolution proof review | Before/after approval |
| 9 | Abuse / fraud review | Flagged users & reports |
| 10 | User management | Roles, suspensions |
| 11 | Analytics — impact | Resolved count, time-to-fix |
| 12 | Analytics — hotspots | Heatmap, predictions (Phase 2) |
| 13 | Analytics — SLA | Breaches, ward breakdown |
| 14 | Category & taxonomy config | Issue types, severity rules |
| 15 | Rewards & gamification config | Caps, partner catalog |
| 16 | Notification templates | Citizen comms |
| 17 | Audit log | Admin actions |
| 18 | System health | AI, maps, storage status (MVP mocked) |

---

## 11. State Model & Entity / Data Model

### Core entities

```
User
  id, role, displayName, avatarUrl, phone/email
  trustScore, contributionScore, verificationScore
  accountFlags[], youthProfileId?, familyHubId?
  createdAt, lastActiveAt

YouthProfile
  id, parentUserId, displayName, supervisedMode, rewardCap

FamilyHub
  id, ownerUserId, memberIds[], approvalRequired

Report (Issue)
  id, reporterUserId, category, description, severity
  status: draft|submitted|pending_verification|verified|acknowledged|in_progress|resolved|rejected|merged
  location: { lat, lng, address, accuracy, wardId? }
  mediaIds[], duplicateOfId?, mergedReportIds[]
  trustSnapshot: { duplicateRisk, spamFlags }
  aiMetadata: { categoryConfidence, severityHint, summary }  // optional
  corroborationCount, viewCount
  assignedWorkerId?, slaDueAt?
  createdAt, updatedAt, resolvedAt

MediaAsset
  id, reportId, type: photo|video, storageUrl, thumbnailUrl
  mimeType, sizeBytes, durationSec?, width, height
  captureSource: camera|gallery|upload
  exifStripped: boolean, perceptualHash?, gpsFromExif?
  createdAt

Corroboration
  id, reportId, userId, type: confirm|dispute|add_evidence
  comment?, mediaId?, createdAt

VerificationEvent
  id, reportId, verifierId (user|admin|system), outcome, reason

RewardEvent
  id, userId, type, points, badgeId?, reportId?, verified: boolean
  createdAt

DuplicateCluster
  id, canonicalReportId, candidateIds[], similarityScores, status

AdminAction
  id, actorId, targetType, targetId, action, metadata, createdAt

Ward / Zone (optional MVP mock)
  id, name, boundaryGeoJson
```

### Client state (Zustand slices)

- `authStore` — session, user, role
- `reportDraftStore` — ephemeral multi-step report wizard
- `mapStore` — viewport, selected pin, clusters
- `notificationStore` — inbox, unread
- `trustStore` — cached scores, explanations
- `offlineQueueStore` — pending uploads (Phase 2)

### Report status state machine

```
draft → submitted → pending_verification → verified → acknowledged → in_progress → resolved
                    ↘ rejected
                    ↘ merged (terminal, points to canonical)
```

---

## 12. AI Opportunities

| Capability | Input | Output | MVP | Fallback |
|------------|-------|--------|-----|----------|
| Issue categorization | Image + text + category list | Category + confidence | Yes (mock/Grok) | Manual pick |
| Severity estimation | Category + media + keywords | low/med/high hint | Yes | Default medium |
| Duplicate detection | Embeddings/hash + geo + text | Risk score + matches | Yes (rules + mock AI) | Geo-radius only |
| Summary generation | Report fields + media alt text | Citizen + admin summary | Yes | Template string |
| Spam detection | Text patterns + velocity + trust | Flag score | Yes (rules) | Manual mod |
| Hotspot prediction | Historical geo + category time series | Heatmap hints | Phase 2 | Static heatmap |
| Admin prioritization | SLA + severity + corroborations | Ranked queue | Yes (scoring fn) | FIFO |

**Principle:** AI enriches `aiMetadata` on Report; never required to submit.

---

## 13–18. Trust, Duplicates, Gamification, Rewards

> Detailed rules: see [trust-and-safety.md](./trust-and-safety.md)

**Summary**
- Five score dimensions: trust, contribution, verification, duplicate risk, abuse flags
- Rewards only on verified events: unique report verified, corroboration accepted, resolution confirmed
- Duplicates: proactive UX to support existing; merge in admin; reporter credit split to corroborators
- Youth: supervised submit, capped points, no sensitive leaderboards by default

---

## 19. MVP Scope Reference

> Full phasing: see [phased-plan.md](./phased-plan.md)

**MVP includes:** citizen report flow with real media, duplicate suggestions, community verify, tracking, basic rewards, admin queue + merge + analytics shell, mocked backend/AI/maps adapters.

**MVP excludes:** live municipal integrations, full predictive ML, offline sync, native apps.

---

## 20. Design & Metrics References

- Visual language: [design-direction.md](./design-direction.md)
- Media behavior: [media-capture-strategy.md](./media-capture-strategy.md)
- KPIs: [metrics-framework.md](./metrics-framework.md)
- Engineering: [architecture.md](./architecture.md)

---

## Appendix: Competition Demo Flows (scripted)

1. **Duplicate save** — User starts report; system finds 92% match 50m away; user corroborates instead.
2. **Fast capture** — Camera → AI category → submit in <45s.
3. **Trust transparency** — Profile shows why trust score moved.
4. **Admin merge** — Moderator merges 3 duplicates; citizens notified.
5. **Youth supervised** — Child proposes; parent approves; badge unlocked on verification.
6. **Resolution loop** — Field worker closes ticket; original reporter gets reward + push.
