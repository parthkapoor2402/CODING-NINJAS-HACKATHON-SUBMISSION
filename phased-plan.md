# Phased Delivery Plan — CivicResolve

> Competition-grade MVP first, then trust hardening, then platform scale.

---

## Phase Overview

| Phase | Timeline (indicative) | Goal |
|-------|----------------------|------|
| **MVP** | Hackathon / Sprint 1–2 | Demoable end-to-end civic loop with mocks |
| **Phase 2** | +4–6 weeks | Live backend, realtime, predictive insights |
| **Phase 3** | +8–12 weeks | Municipal integrations, offline, native polish |

---

## MVP (Competition Demo)

### Citizen app
- [ ] Onboarding with permission primers (location, camera)
- [ ] Home: interactive map + feed toggle with seeded issues
- [ ] Full report wizard: camera, gallery, short video upload
- [ ] Duplicate detection UX with “support existing” path
- [ ] AI-assisted category/severity (mock + optional Grok)
- [ ] Community verification (confirm / add evidence)
- [ ] Track tab: my reports + status timeline
- [ ] Basic rewards: badges, streaks, points on verified events only
- [ ] Profile trust dashboard (scores explained)
- [ ] Family/youth supervised mode (approve gate, caps)
- [ ] Polished empty, error, offline messaging

### Admin dashboard
- [ ] Ops overview dashboard (KPI tiles + map)
- [ ] Report queue with trust/duplicate risk columns
- [ ] Report detail moderation actions
- [ ] Duplicate merge workspace
- [ ] Assignment to field worker (mock user)
- [ ] Resolution proof review (before/after)
- [ ] Basic analytics: volume, resolution time, category breakdown
- [ ] Abuse review queue (flagged items)

### Platform / engineering
- [ ] Vite + React + TS + Tailwind + shadcn scaffold
- [ ] Zustand stores + React Router role layouts
- [ ] Adapter layer: mock default for auth, DB, AI, maps, media
- [ ] Domain modules: trust, duplicates, rewards, state machine
- [ ] Vitest unit tests on domain
- [ ] RTL component tests on report stepper + trust badges
- [ ] Playwright E2E: mobile report + admin merge demo scripts
- [ ] Seeded demo data (50 reports, duplicate clusters)

### MVP explicitly out of scope
- Live municipal ERP / 311 integrations
- Full predictive ML pipeline
- Push notifications (FCM/APNs)
- Offline report sync
- Native iOS/Android wrappers
- Multi-language (English only MVP)
- Public API for third parties

### MVP demo scripts (must pass)
1. New unique report with camera capture → verified → reward
2. Duplicate intercepted → user corroborates → verification credit
3. Admin merges cluster → citizens see canonical report
4. Youth proposes → parent approves → submit
5. Field worker resolves with after photo → reporter notified

---

## Phase 2 — Trust Hardening & Live Services

### Product
- [ ] Hotspot prediction heatmap (historical + AI hints)
- [ ] Partner rewards catalog with redemption codes
- [ ] Ward/school challenges with leaderboards (opt-in)
- [ ] Public recognition wall with privacy controls
- [ ] SMS/email notification adapters
- [ ] Improved dispute flow on corroborations
- [ ] Reporter feedback on resolution quality

### Engineering
- [ ] Supabase **or** Firebase live adapter (auth, DB, storage)
- [ ] Realtime subscriptions on report status
- [ ] Grok API live with circuit breaker + caching
- [ ] Mapbox/Google live geocoding + clustering at scale
- [ ] Perceptual hash pipeline for duplicate images
- [ ] PWA manifest + install prompt
- [ ] Image CDN + video transcoding (short clips)
- [ ] Expanded Playwright: permission denied, file limits

### Admin
- [ ] SLA engine with breach alerts
- [ ] Bulk actions on queue
- [ ] Export CSV/PDF for municipal reporting
- [ ] Configurable category taxonomy UI

---

## Phase 3 — Platform Scale

### Product
- [ ] Municipal multi-tenant (city workspaces)
- [ ] Open API for partner integrations
- [ ] Advanced predictive maintenance insights
- [ ] Citizen subscription to issue types / zones
- [ ] AR pin placement (experimental)
- [ ] Multi-language + RTL layout support
- [ ] Accessibility audit certification path

### Engineering
- [ ] Offline-first report drafts + background sync
- [ ] Edge functions for trust scoring
- [ ] Rate limiting + WAF patterns
- [ ] Observability: Sentry, analytics pipeline
- [ ] Load testing on media uploads
- [ ] Optional React Native shell sharing adapters

### Operations
- [ ] Role hierarchy: super-admin, city-admin, moderator, worker
- [ ] Compliance: data retention policies, GDPR export
- [ ] Incident response playbooks for abuse spikes

---

## Sprint Breakdown (MVP — 10 working days)

| Day | Focus | Deliverable |
|-----|-------|-------------|
| 1 | Scaffold, routing, design tokens, mock registry | Runnable shell, citizen + admin layouts |
| 2 | Domain models, trust/duplicate pure functions, seeds | Unit tests green |
| 3 | Map home + issue detail | Pins, clusters, card feed |
| 4 | Report wizard steps 1–3 (media + perms) | Camera/gallery/video flows |
| 5 | Report wizard 4–6 (AI, location, submit) | Duplicate suggestion UX |
| 6 | Track + community verify | Timelines, corroborate |
| 7 | Rewards + profile trust | Badges, streaks, youth gate |
| 8 | Admin queue + detail + merge | Moderation actions |
| 9 | Analytics dashboard + demo polish | Impact tiles, charts |
| 10 | E2E hardening, demo rehearsal | Playwright scripts, bug bash |

---

## Risk Register

| Risk | Mitigation |
|------|------------|
| Camera APIs fail on judge device | `<input capture>` + gallery fallback always visible |
| Grok API down during demo | `VITE_AI_PROVIDER=mock` flag, pre-recorded responses |
| Map token quota | Static map fallback component |
| Scope creep | MVP checklist gate; Phase 2 parking lot |
| Trust logic bugs | Domain unit tests + manual abuse scenarios |

---

## Definition of Done (MVP)

- [ ] All MVP demo scripts pass on mobile viewport
- [ ] No critical a11y violations on report + home (axe)
- [ ] TypeScript strict, no `any` in domain layer
- [ ] README with env setup + demo accounts
- [ ] Planning docs reflect shipped scope delta (if any)

---

## Related Documents

- [product-requirements.md](./product-requirements.md)
- [architecture.md](./architecture.md)
- [trust-and-safety.md](./trust-and-safety.md)
- [media-capture-strategy.md](./media-capture-strategy.md)
