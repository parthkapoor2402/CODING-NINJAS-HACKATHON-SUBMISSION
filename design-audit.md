# Design Audit — CivicResolve UI Foundation

> Why this interface reads as senior PM / Figma-grade civic product—not a generic hackathon submission.

---

## 1. Intentional civic brand, not SaaS purple

**Decision:** Blue (`#1565C0`) + teal (`#00897B`) gradient hero, warm neutrals, amber for pending states.

**Why it matters:** Hackathon UIs default to purple gradients and Inter-on-white. CivicResolve uses a palette aligned to trust (blue), resolution (teal), and caution (amber)—matching municipal clarity without beige bureaucracy.

**Avoided:** Purple `#6366F1` gradients, neon accents, dark-mode-for-the-sake-of-it.

---

## 2. Mobile-native information hierarchy

**Decision:** 
- Center-elevated **Report** FAB in bottom nav (thumb zone)
- Full-width gradient report CTA on home above the fold
- 44px minimum touch targets on all interactive elements
- `pb-safe-nav` and safe-area insets for notched devices

**Why it matters:** Citizens use this outdoors, one-handed. Report is the primary job—the UI privileges it twice (hero + nav) without hiding wayfinding.

**Avoided:** Desktop-first hamburger menus, tiny icon-only actions without labels, report buried in a menu.

---

## 3. Mature microcopy

**Samples:**
- "Report. Verify. See it fixed." (splash)
- "Verified impact only" (rewards subtitle)
- "Support existing reports before filing a duplicate" (onboarding)
- "Real impact, not points for noise" (home insight strip)

**Why it matters:** Copy sets tone. We avoid ticket numbers, government jargon, and gamified hype ("LEVEL UP!!!").

---

## 4. Component system with semantic purpose

| Component | Role |
|-----------|------|
| `IssueCard` | 16:9 media hero, category chip, status + corroboration |
| `MapPreviewCard` | Stylized map with grid, pins, user location—not a gray box |
| `StatCard` | Admin KPI with left accent border, trend line |
| `SegmentedControl` | Map/feed toggle without custom tab hack |
| `ReportShell` | Step progress bar for multi-step flows |
| `EmptyState` / `LoadingState` / `SuccessState` | Tactile, branded—not spinners on white |

Each component encodes product semantics, not just visual wrappers.

---

## 5. Trust visible in UI chrome

**Decision:** Trust ring on profile, verified/pending chips on rewards, duplicate-risk chips in admin queue, moderation risk highlighting.

**Why it matters:** Trust isn't a backend-only concept. Users and admins see reliability signals in context—core to the product thesis.

---

## 6. Restrained motion

**Decision:** `animate-slide-up`, `animate-scale-in`, `active:scale-[0.98]` on buttons, shimmer skeletons. `prefers-reduced-motion` respected in globals.

**Why it matters:** Motion confirms actions (sheet open, step advance) without distracting animations on every element.

---

## 7. Admin feels operational

**Decision:** 
- Data-dense queue table with priority + duplicate risk columns
- Stat cards with trends
- Hotspot map shell with ward breakdown
- Light gray ops canvas (`#F4F7FA`), white sidebar

**Why it matters:** Admin users need scanability and density. Citizen polish (rounded cards, generous padding) is dialed back for ops efficiency.

---

## 8. Responsible gamification framing

**Decision:** Rewards page leads with "verified impact" points, pending chips for unverified events, partner redemption gated with explanation, youth mode with parent approval copy.

**Why it matters:** Points farming is a known civic-app failure mode. UI language reinforces verification before celebration.

---

## 9. Accessibility baseline

- Icon + label on bottom nav
- `aria-label` on FAB and icon buttons
- WCAG-minded contrast on civic blue/teal pairs
- Semantic headings per screen via `AppHeader`

---

## 10. What’s still shell (honest scope)

These are **polished placeholders**—intentionally not fake feature depth:
- Report wizard steps (no real camera/AI)
- Live Mapbox map (stylized preview card)
- Analytics charts (empty state with Phase 2 note)
- Partner redemption (disabled CTA)

The foundation is production-shaped; feature logic arrives in subsequent prompts without redesign debt.

---

## Summary

| Hackathon-grade (avoided) | PM-grade (achieved) |
|---------------------------|---------------------|
| Generic color palette | Civic blue/teal system |
| Equal-weight nav items | Report CTA privileged |
| "Lorem ipsum" placeholders | Civic-positive microcopy |
| One card style | Issue, map, stat card variants |
| Spinner on white | Branded loading/empty/success |
| Admin = citizen UI stretched | Ops-dense admin shell |
| Trust hidden | Trust chips, rings, risk scores visible |

This UI is ready for feature implementation without a visual refactor.
