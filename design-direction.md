# Design Direction — CivicResolve

> Sharp, PM-grade, Figma-level mobile product. Calm civic authority meets modern consumer clarity—not bureaucratic government beige.

*Synthesized from civic UX research (CivicLink, CivicEase, Civix UI, UAE Design System mobile guidelines) and contemporary mobile patterns—original system for CivicResolve.*

---

## 1. App Personality

| Trait | Expression |
|-------|------------|
| **Trustworthy** | Clear status language, official-but-warm tone, no dark patterns |
| **Action-oriented** | Verbs on CTAs: “Report issue”, “Confirm this”, “Track fix” |
| **Local** | Map-first, neighborhood names, ward context |
| **Responsible** | Duplicate nudges feel helpful, not scolding |
| **Human** | Micro-celebrations on verified impact, not slot-machine rewards |
| **Inclusive** | Plain language (grade 8 reading level), icons + labels always |

**Voice:** “We’ll help your neighborhood get this fixed.” Not: “Ticket #48291 submitted to municipal workflow.”

---

## 2. Color Strategy

### Primary palette

| Token | Hex | Usage |
|-------|-----|-------|
| `civic-blue-600` | `#1565C0` | Primary actions, links, active nav |
| `civic-blue-50` | `#E3F2FD` | Selected states, info backgrounds |
| `civic-teal-500` | `#00897B` | Success, verified, resolved |
| `civic-amber-500` | `#F9A825` | Pending, in-progress, streaks |
| `civic-coral-500` | `#E57373` | Dispute, rejected (soft, not alarm red) |
| `neutral-900` | `#1A1A2E` | Primary text |
| `neutral-500` | `#6B7280` | Secondary text |
| `neutral-100` | `#F3F4F6` | Page backgrounds |
| `surface-elevated` | `#FFFFFF` | Cards, sheets |

### Semantic colors
- **Verified:** teal + check icon
- **Pending:** amber + clock
- **Flagged:** coral outline (never solid red background on citizen screens)
- **Resolved:** teal gradient header on detail hero

### Accessibility
- All text pairs WCAG AA minimum (4.5:1 body, 3:1 large)
- Color never sole indicator—always icon + label
- `prefers-reduced-motion` disables celebratory animations

### Dark mode (Phase 2)
- Map-heavy screens stay dark-friendly; cards `neutral-800`

---

## 3. Visual Language

### Typography
- **Display / headings:** `DM Sans` or `Plus Jakarta Sans` — geometric, friendly
- **Body:** `Inter` — proven readability
- **Scale (mobile):** 12 / 14 / 16 / 20 / 24 / 32

### Iconography
- Lucide icons (shadcn default), 1.5px stroke
- Category icons: custom 24px set (pothole, water, light, waste, infra)

### Photography & media
- Report cards: 16:9 media hero, rounded-xl top
- Thumbnails: consistent 48px radius md
- Video: play affordance overlay, duration badge

### Density
- Mobile: comfortable (16px padding cards)
- Admin: compact data tables (12px cell padding)

---

## 4. Motion Language

| Context | Motion |
|---------|--------|
| Tab switch | 200ms fade + subtle slide |
| Report step advance | Horizontal slide LTR, progress bar sync |
| Map pin select | Scale 1.0→1.15 spring |
| Reward unlock | Confetti-lite (8 particles, 600ms), respect reduced-motion |
| Sheet open | Bottom spring, 300ms |
| Trust score change | Count-up 400ms on profile only |

**Rule:** Motion confirms action; never decorative on loading-critical paths.

---

## 5. Card System

### Issue card (feed)
```
┌─────────────────────────────┐
│ [16:9 media]                │
│ Category chip │ 0.3 km      │
│ Title (2 lines max)         │
│ Status pill │ corroborations│
│ [Confirm] [View]            │
└─────────────────────────────┘
```

### Variants
- `default` — white, shadow-sm
- `highlighted` — blue-50 border (near user)
- `duplicate-suggestion` — amber left border 4px
- `resolved` — teal top stripe

### Trust card (profile)
- Circular trust ring (0–100)
- Expandable “Why this score?” list

---

## 6. Map States

| State | Visual |
|-------|--------|
| Default | Clustered pins by category color |
| User locating | Pulsing blue dot |
| Selected pin | Bounce + bottom sheet peek |
| Report placing pin | Draggable crosshair, haptic-style pulse |
| Duplicate nearby | Amber halo on matching pins |
| Heatmap (Phase 2) | Teal→amber gradient overlay, 40% opacity |

**Category pin colors**
- Pothole: `#795548`
- Water: `#2196F3`
- Streetlight: `#FFC107`
- Waste: `#4CAF50`
- Infrastructure: `#9C27B0`

---

## 7. Reward States

| State | UI |
|-------|-----|
| Locked badge | Grayscale + lock icon |
| In progress | Progress ring (e.g. 2/3 verifications) |
| Unlocked | Full color + single celebration animation |
| Pending points | Dotted outline pill “+50 pending verification” |
| Clawed back | Muted with info tooltip |

**Partner reward card:** Logo, eligibility checklist (trust ✓, verified ✓), redeem CTA.

---

## 8. Empty States

| Screen | Illustration | Copy | CTA |
|--------|--------------|------|-----|
| Home (no issues) | Clean map neighborhood | “No open issues nearby—nice!” | Report if you see something |
| Track (none) | Clipboard | “You haven’t reported yet” | Report first issue |
| Verify queue | Shield | “All caught up nearby” | Browse map |
| Notifications | Bell | “No updates yet” | — |
| Search | — | “No matches” | Clear filters |

Illustrations: simple line + flat fill (not childish cartoon).

---

## 9. Trust States

| State | Citizen UI |
|-------|------------|
| `submitted` | Gray pill “Submitted” |
| `pending_verification` | Amber “Needs confirmation” + CTA share |
| `verified` | Teal “Verified by neighbors” |
| `in_progress` | Blue “Crew assigned” |
| `resolved` | Teal check “Fixed” + optional photo |
| `rejected` | Coral outline + reason + appeal |
| `merged` | Link to canonical report |
| `flagged` (user) | Neutral “Under review”—no public shame |

**Duplicate intercept:** Amber sheet, not error dialog.

---

## 10. Component Patterns (shadcn-aligned)

- **Bottom sheet** for report flow (not full page stack where possible)
- **Toast** for success; **inline banner** for trust warnings
- **Skeleton loaders** on feed cards (map loads first)
- **FAB** optional; prefer tab “Report” emphasis
- **Touch targets:** minimum 44×44px (UAE / WCAG mobile guidance)
- **Forms:** single column, labels above, helper text below

---

## 11. Admin Dashboard Aesthetic

- Light gray canvas `#F8FAFC`
- White sidebar, blue active item
- Data-dense tables with sticky headers
- Trust/risk columns use colored dots + numeric (colorblind-safe shapes)
- Charts: restrained palette, no 3D

---

## 12. Responsive Breakpoints

| Name | Width | Layout |
|------|-------|--------|
| `mobile` | <640px | Single column, bottom nav |
| `tablet` | 640–1024px | Optional split map/list |
| `desktop` | >1024px | Admin multi-column |

---

## 13. Design Tokens (Tailwind extension sketch)

```js
// tailwind.config — reference for implementation phase
colors: {
  civic: {
    blue: { 50: '#E3F2FD', 600: '#1565C0' },
    teal: { 500: '#00897B' },
    amber: { 500: '#F9A825' },
    coral: { 500: '#E57373' },
  }
}
borderRadius: { card: '12px', sheet: '16px' }
boxShadow: { card: '0 1px 3px rgba(0,0,0,0.08)' }
```

---

## 14. Figma Handoff Notes (for implementation)

- Component states: default, hover, pressed, disabled, loading, error
- Report wizard: 6 frames with shared progress indicator component
- Map pin component variants per category + count badge
- Trust ring component with score breakpoints (low/mid/high color—not red for low, use amber)

---

## Related Documents

- [product-requirements.md](./product-requirements.md)
- [media-capture-strategy.md](./media-capture-strategy.md)
- [architecture.md](./architecture.md)
