# Technical Architecture — CivicResolve

> Mobile-first React + TypeScript + Vite monorepo for citizen app and admin dashboard.

---

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client (Vite SPA)                        │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐ │
│  │ Citizen routes   │  │ Admin routes     │  │ Shared UI    │ │
│  │ (mobile-first)   │  │ (tablet/desktop) │  │ shadcn/ui    │ │
│  └────────┬─────────┘  └────────┬─────────┘  └──────────────┘ │
│           │                     │                               │
│  ┌────────▼─────────────────────▼─────────────────────────────┐ │
│  │ Zustand stores + React Query (server state cache)          │ │
│  └────────┬───────────────────────────────────────────────────┘ │
│           │                                                     │
│  ┌────────▼───────────────────────────────────────────────────┐ │
│  │ Service Adapters (interfaces + mock + live implementations)  │ │
│  │  • AuthBackend    • ReportRepository   • MediaStorage        │ │
│  │  • MapsProvider   • AIService (Grok)   • NotificationService │ │
│  └────────┬───────────────────────────────────────────────────┘ │
└───────────┼─────────────────────────────────────────────────────┘
            │
┌───────────▼─────────────────────────────────────────────────────┐
│ MVP: Mock layer + local JSON / IndexedDB / Supabase (optional)  │
│ Phase 2+: Firebase or Supabase live, edge functions, webhooks   │
└─────────────────────────────────────────────────────────────────┘
```

### Design principles

1. **Adapter pattern everywhere external** — Swap Mapbox ↔ Google, Supabase ↔ Firebase, Grok ↔ mock without route changes.
2. **Mobile-first responsive** — Citizen routes default to single column; admin uses CSS grid breakpoints.
3. **Progressive enhancement** — Media capture degrades: `ImageCapture` API → `getUserMedia` → `<input capture>` → gallery upload.
4. **Trust logic in domain layer** — Pure TypeScript modules for scoring; UI only displays outcomes.
5. **Demo reliability** — Feature flags for mock AI latency, seeded data, and deterministic duplicate scenarios.

---

## 2. Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | React 18+ | Ecosystem, hiring, RTL/Vitest fit |
| Language | TypeScript strict | Safer domain models for trust logic |
| Build | Vite | Fast HMR for hackathon iteration |
| Styling | Tailwind CSS | Rapid mobile layouts, design tokens |
| Components | shadcn/ui | Accessible primitives, customizable |
| State | Zustand | Lightweight wizard + UI state |
| Server state | TanStack Query (recommended) | Cache, retries, optimistic updates |
| Routing | React Router v6 | Role-based citizen vs admin layouts |
| Maps | Mapbox GL JS (default adapter) | Strong mobile WebGL performance |
| Backend | Supabase **or** Firebase via adapter | Auth, storage, realtime optional |
| AI | Grok API via `AIService` adapter | Categorization, summaries, duplicate hints |
| Unit/Component | Vitest + React Testing Library | Fast CI |
| E2E | Playwright | Mobile viewport profiles, permission mocks |

---

## 3. Application Layers

### Presentation (`src/apps/`, `src/components/`)
- Route-level pages, feature components, layout shells
- No direct fetch calls — uses hooks that call services

### Application / hooks (`src/hooks/`, `src/features/*/hooks/`)
- `useReportDraft`, `useDuplicateCheck`, `useMediaCapture`
- Orchestrate stores + services

### Domain (`src/domain/`)
- Pure functions: `calculateTrustScore`, `rankAdminQueue`, `evaluateDuplicateRisk`
- Entity types, status machines, reward eligibility rules

### Infrastructure (`src/services/`, `src/adapters/`)
- Interface definitions + mock + live implementations
- Environment-driven provider selection (`VITE_*`)

### Shared UI (`src/components/ui/` — shadcn)

---

## 4. Routing Structure

```
/                     → redirect by role
/onboarding/*         → citizen onboarding
/app/*                → citizen shell (bottom tabs)
  /app/home
  /app/report/*
  /app/track
  /app/community
  /app/profile/*
/admin/*              → admin shell (sidebar)
  /admin/dashboard
  /admin/queue
  /admin/reports/:id
  /admin/duplicates
  /admin/analytics
  /admin/users
/auth/*               → login, signup
```

**Route guards:** `RequireAuth`, `RequireRole(['admin','moderator'])`, `RequireSupervisedApproval` (youth drafts).

---

## 5. Adapter Interfaces (sketch)

```typescript
// src/services/types.ts — illustrative only

interface AuthBackend {
  signIn(credentials): Promise<Session>;
  signOut(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
}

interface ReportRepository {
  create(report: CreateReportDTO): Promise<Report>;
  findNearby(lat: number, lng: number, radiusM: number): Promise<Report[]>;
  updateStatus(id: string, status: ReportStatus): Promise<Report>;
  merge(canonicalId: string, duplicateIds: string[]): Promise<void>;
}

interface MediaStorage {
  upload(file: Blob, meta: MediaMeta): Promise<MediaAsset>;
  getSignedUrl(id: string): Promise<string>;
}

interface MapsProvider {
  init(container: HTMLElement, options: MapOptions): MapInstance;
  reverseGeocode(lat: number, lng: number): Promise<string>;
}

interface AIService {
  categorize(input: AIReportInput): Promise<CategorizationResult>;
  estimateSeverity(input: AIReportInput): Promise<SeverityHint>;
  detectDuplicateRisk(input: DuplicateCheckInput): Promise<DuplicateRiskResult>;
  summarize(report: Report): Promise<string>;
  // All methods must support timeout + graceful degradation
}

interface NotificationService {
  subscribe(topic: string): Promise<void>;
  sendLocal(notification: LocalNotification): void;
}
```

**MVP default:** `import.meta.env.VITE_USE_MOCKS === 'true'` → register mock adapters in `src/services/registry.ts`.

---

## 6. Recommended Folder Structure

```
civic-resolve/
├── public/
│   ├── manifest.webmanifest          # PWA shell (Phase 2)
│   └── seeded-media/                 # Demo assets
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── apps/
│   │   ├── citizen/
│   │   │   ├── layouts/CitizenShell.tsx
│   │   │   └── routes.tsx
│   │   └── admin/
│   │       ├── layouts/AdminShell.tsx
│   │       └── routes.tsx
│   ├── components/
│   │   ├── ui/                       # shadcn
│   │   ├── map/
│   │   ├── media/
│   │   ├── trust/
│   │   └── rewards/
│   ├── domain/
│   │   ├── entities/
│   │   ├── trust/
│   │   ├── duplicates/
│   │   ├── rewards/
│   │   └── reportStateMachine.ts
│   ├── features/
│   │   ├── onboarding/
│   │   ├── report/
│   │   ├── track/
│   │   ├── community/
│   │   ├── rewards/
│   │   ├── family/
│   │   └── admin/
│   ├── hooks/
│   ├── lib/
│   │   ├── utils.ts
│   │   ├── constants.ts
│   │   └── featureFlags.ts
│   ├── services/
│   │   ├── types.ts
│   │   ├── registry.ts
│   │   ├── mocks/
│   │   │   ├── mockReports.ts
│   │   │   ├── mockAI.ts
│   │   │   └── mockMaps.ts
│   │   ├── supabase/
│   │   └── firebase/
│   ├── stores/
│   │   ├── authStore.ts
│   │   ├── reportDraftStore.ts
│   │   └── mapStore.ts
│   ├── styles/
│   │   └── globals.css
│   └── types/
├── tests/
│   ├── unit/domain/
│   ├── component/
│   ├── integration/
│   └── e2e/playwright/
├── docs/                             # planning docs (this repo)
├── .env.example
├── vite.config.ts
├── tailwind.config.ts
├── playwright.config.ts
└── package.json
```

---

## 7. Data Flow: Report Submission

```
1. User captures media → client validates size/duration
2. Optional client compression → blob in reportDraftStore
3. Geolocation hook → coordinates + accuracy
4. duplicateCheckService (domain + AI adapter) → suggestions
5. User confirms → AI categorize (parallel, non-blocking UI)
6. mediaStorage.upload (mock: object URL / IndexedDB)
7. reportRepository.create → status: submitted
8. trustEngine.evaluate → scores persisted on report
9. Query invalidation → Track tab + map pin appear
10. Admin queue receives ranked item
```

---

## 8. Security & Privacy (MVP)

- Strip EXIF GPS on upload unless user consents to location from photo
- HTTPS required for `getUserMedia` (Vite dev OK on localhost)
- Role-based admin routes; audit log for moderation actions
- Youth PII minimized; parent owns account linkage
- Media URLs signed / time-limited when on live backend

---

## 9. Testing Strategy by Phase

### Phase 0 — Foundation (MVP week 1)
| Type | Focus |
|------|-------|
| Unit | Domain: trust scores, duplicate risk, reward eligibility, state machine |
| Component | shadcn forms, trust badges, report stepper with RTL |
| Integration | Mock adapters + hooks: full draft → submit |

### Phase 1 — MVP demo (week 2)
| Type | Focus |
|------|-------|
| Component | Media capture fallbacks (mocked `mediaDevices`) |
| Integration | Duplicate redirect flow, admin merge |
| E2E | Playwright: report flow mobile viewport 390×844 |
| E2E | Admin: queue → merge → resolved |

### Phase 2 — Hardening
| Type | Focus |
|------|-------|
| Unit | AI adapter timeout/fallback paths |
| E2E | Permission denied UX, oversized file rejection |
| E2E | Youth supervised approval gate |
| Visual regression | Optional Chromatic on core cards |

### Phase 3 — Production readiness
| Type | Focus |
|------|-------|
| Load | Media upload concurrency |
| Contract | Adapter interface tests against live Supabase/Firebase |
| A11y | axe in CI on citizen critical paths |

**CI pipeline:** `lint → typecheck → vitest → playwright (chromium, mobile profile)` on PR.

---

## 10. Mocked Systems & MVP Assumptions

| System | MVP behavior | Assumption |
|--------|--------------|------------|
| Auth | Mock login buttons (citizen/admin/youth/parent) | Real OAuth in Phase 2 |
| Database | In-memory + `localStorage` seed / JSON fixtures | Supabase optional stretch |
| Media storage | Blob URLs + IndexedDB | Max 25MB per video demo |
| Maps | Mapbox with demo token **or** static map fallback | India-centric seed coordinates |
| AI (Grok) | Mock responses + optional live via env flag | 3s timeout → manual |
| Push notifications | In-app toast + notification center only | FCM Phase 2 |
| Geocoding | Cached ward labels from seed | Real reverse geocode adapter ready |
| Field worker | Admin assigns to mock worker user | No separate native app |
| Realtime | Polling every 30s on track detail | WebSocket Phase 2 |

**Seed data:** 50 reports across 5 categories, 10 duplicate clusters, 3 abuse flags, 1 family hub demo.

---

## 11. Environment Variables

```bash
VITE_USE_MOCKS=true
VITE_MAPS_PROVIDER=mapbox
VITE_MAPBOX_TOKEN=
VITE_BACKEND_PROVIDER=mock          # mock | supabase | firebase
VITE_AI_PROVIDER=mock               # mock | grok
VITE_GROK_API_KEY=
VITE_MAX_IMAGE_MB=8
VITE_MAX_VIDEO_MB=25
VITE_MAX_VIDEO_SEC=30
```

---

## 12. Performance Targets (MVP)

- LCP < 2.5s on 4G (citizen home)
- Report wizard step transition < 100ms
- Map pan/zoom 60fps on mid-range Android browser
- Image compression client-side to < 2MB before upload
- Code-split admin bundle (citizens never download admin charts)

---

## 13. PWA Considerations (Phase 2)

- `manifest.webmanifest` + service worker for shell cache
- Camera still requires HTTPS; install prompt on repeat visits
- Offline: queue report drafts only (not MVP)

---

## 14. Related Documents

- [product-requirements.md](./product-requirements.md) — screens, entities, journeys
- [phased-plan.md](./phased-plan.md) — delivery timeline
- [trust-and-safety.md](./trust-and-safety.md) — domain rules
- [media-capture-strategy.md](./media-capture-strategy.md) — capture pipelines
- [design-direction.md](./design-direction.md) — UI tokens
- [metrics-framework.md](./metrics-framework.md) — success measures
