# UX Audit — Level 5 (CivicResolve Prototype)

> **Auditor lens:** Senior product manager + senior mobile product designer  
> **Scope:** Home · Report · Verify · Track · Rewards · Profile · Trust · Leaderboard · Badges · Community challenges  
> **Method:** Code-grounded review of implemented flows (`src/features/*`, `src/components/*`, `src/domain/*`) cross-referenced with live deployment behavior  
> **Status:** Audit only — no implementation

---

## Executive summary

CivicResolve **nails the civic-tech thesis in copy and architecture**: trust over volume, support-before-spam, verification before rewards, transparent status tracking, and responsible gamification framing. The visual system (blue/teal civic palette, elevated Report FAB, card-based mobile shell) reads as a serious product—not a generic hackathon shell.

The prototype's primary weakness is **experiential flatness**: users perform meaningful civic actions (report, verify, track) but receive **little sensory feedback** that the neighborhood is alive or that their contribution mattered. Gamification modules exist as a **read-mostly dashboard** on Rewards, disconnected from the action surfaces where behavior actually happens. Instructional copy is strong but **over-stacked**—the same trust ethics appear on home, verify, track, report success, and rewards, creating a lecture tone instead of a living community product.

**Net assessment:** Strong **Level 3–4 civic product** (credible flows, ethical framing, mobile layout). Not yet **Level 5** (emotionally resonant, loop-driven, neighborhood-alive). The gap is interaction design and feedback wiring—not visual polish alone.

---

## 1. Where the product meets the civic-tech brief well

| Brief pillar | Evidence in product | Strength |
|--------------|---------------------|----------|
| **Support before spam** | Duplicate detection on Location/Review steps; `DuplicateSupportNudge`; support-existing flow on Nearby | Core differentiator; ethically framed, not punitive |
| **Trust is visible** | `TrustScoreRing`, `StatusBadge`, corroboration counts, `TrustParticipationCard`, admin risk columns | Trust is UI chrome, not backend-only |
| **Verification before dispatch** | Dedicated Verify tab; `pending_verification` queue; corroboration wired to `mockReports.corroborate` | Real loop, not a mock button |
| **Transparent tracking** | Track page with filters, `IssueTimeline`, reopen resolved reports | Accountability loop with rare civic feature (reopen) |
| **Responsible gamification framing** | Rewards copy: verified-only, duplicate earns nothing, youth restrictions | Avoids "LEVEL UP" hype; judge-credible |
| **Mobile-first reporting** | 4-step wizard, bottom sheet evidence, gallery/camera fallbacks, thumb-zone Report FAB | Outdoor, one-handed intent is clear |
| **AI assistive, not blocking** | `useReportAIAssist`, resilient fallback, manual category/severity chips | Matches PRD non-blocking AI posture |
| **Persona-aware home** | `HomeHero` + `PERSONA_HOME` in onboarding config | Commuter/resident/student copy variants |
| **Youth/family mode** | `/app/family`, supervised copy, capped redemption in domain | Ethical guardrails present |
| **Admin accountability** | Queue, moderation, duplicate merge, analytics (separate shell) | Ops density appropriate for moderators |

**Verdict:** The product **honors the brief's values**. Evaluators who read screens will understand this is civic infrastructure software, not a complaint box with points.

---

## 2. Where the experience feels static, generic, passive, over-explanatory, or emotionally flat

### Static / passive surfaces

| Surface | Symptom | Root cause (code) |
|---------|---------|-------------------|
| **Home pulse strip** | Three metrics with no drill-down | `CivicPulseStrip` is display-only; taps don't route to Verify/Track |
| **Map toggle** | Map/Feed switch feels like a feature, behaves like a view swap | `MapPreviewCard` is decorative SVG grid—not pins tied to reports |
| **Nearby feed** | Cards 2–3 are browse-only; only card 1 can confirm | `showActions={i === 0}` in `HomePage.tsx` |
| **Leaderboard** | Frozen ranking list | `listLeaderboard()` returns static seed `contributionScore` |
| **Badges** | Locked grid never changes after user actions | Unlock logic exists; reward events never append on verify/report |
| **Community challenges** | Progress bars at 58%/72% forever | `SEED_CHALLENGES` hardcoded in `community-challenges.ts` |
| **Feed imagery** | Brown/yellow color blocks with serif category text | `IssueCard` placeholder media—not photographic evidence |
| **Ward context** | "Ward 12 · live neighborhood signal" | Hardcoded label; distances faked (`0.2 + i * 0.15` km) |

### Generic patterns

- **Issue cards** follow a single template regardless of urgency (school pothole vs market garbage look structurally identical).
- **Success screen** uses three identical info-card blocks before CTAs—reads like a design-system demo, not a moment of civic pride.
- **Rewards page** stacks every gamification widget in one scroll—feels like "drop in all components" rather than a curated progression screen.

### Over-explanatory copy (estimated ~35% of citizen surface area)

The trust ethics message appears in at least **seven places**:

1. Onboarding + `FirstSessionEducationCard`
2. Home insight strip
3. `TrustParticipationCard` (full + compact variants on Verify, Track, Nearby, Issue detail)
4. Report Review duplicate/suspicious warnings
5. Report Success three explainer cards
6. `RewardsPhilosophyCard` + `RewardsAtAGlance`
7. Verify page hero paragraph

**Example redundancy:** Verify page shows both a hero education block *and* `TrustParticipationCard variant="compact"` with overlapping "+5 verification pts" messaging.

### Emotionally flat moments (highest missed opportunity)

| Moment | Current feeling | Missing emotional beat |
|--------|-----------------|------------------------|
| **Submit report** | Informational success | Relief, pride, "your block heard you" |
| **Confirm issue** | Text banner: "Confirmation recorded…" | Micro-celebration, trust delta, neighbor count tick |
| **Report verified** | Status badge changes somewhere | Push/in-app "3 neighbors confirmed" |
| **Issue resolved** | Placeholder proof card | Before/after satisfaction, shareable win |
| **Badge unlock** | Never happens live | Delight, recognition, share |
| **Leaderboard** | Static list | Movement, proximity ("2 pts behind Asha") |

---

## 3. Gamification exists but does not create behavior loops

### Intended loops (from PRD)

```
Report → verify → status progress → reward unlock → return → streak/challenge
```

### Actual loops (implemented)

```
Report → submit → success copy (no reward event)
Verify → corroborate → applyTrustUpdate() silent (+3 trust in session only)
Track → read status (no contribution credit shown)
Rewards → read seed data (unchanged after civic actions)
Redeem → mock message (no balance change)
```

### Architecture vs experience gap

| Mechanic | Domain logic | UI feedback | Data pipeline |
|----------|--------------|-------------|---------------|
| Trust score | `trust-updates.ts`, `trust-score.ts` | Ring on profile only | `applyTrustUpdate()` on verify; `recomputeTrustScore()` **never called** |
| Reward points | `reward-eligibility.ts` | Rewards page | Static `seedRewards`; no append on actions |
| Badges | `badge-unlocks.ts` | Grid on Rewards | Computed from seed events only |
| Streak | `streaks.ts` | Shown on Rewards | Based on seed event dates |
| Ladder | `civic-ladder.ts` | `CivicChampionLadder` | Uses `contributionFromRewards` ≠ leaderboard `contributionScore` |
| Challenges | `community-challenges.ts` | Static progress bars | No join/contribute CTA |
| Milestones | `civic-milestones.ts` | Checklist on Rewards | 0/N frozen unless seed events match |

**Critical disconnect:** Three different "scores" coexist:

1. `user.trust.contributionScore` (seed, powers leaderboard)
2. `contributionFromRewards(events)` (powers ladder)
3. `sumRedeemablePoints(events)` (powers catalog)

Users cannot form a mental model of progression.

### Behavior loops that *partially* work

- **Verify inbox zero:** Card removal after confirm is satisfying.
- **Report wizard completion:** Step progress bar gives forward momentum.
- **Track reopen:** Empowers citizen accountability—strong loop, under-promoted.

---

## 4. Dashboard-like vs mobile-product-like

### Mobile-product patterns (keep)

- Bottom nav with elevated Report FAB (`BottomNav.tsx`)
- `max-w-lg` citizen shell, safe-area padding
- Bottom sheet evidence capture
- Single-column card feeds
- Profile as lightweight hub (ring + link rows)
- Chip filters on Track page

### Dashboard patterns (problematic on phone)

| Screen | Dashboard symptom | Mobile-product alternative |
|--------|-------------------|---------------------------|
| **Rewards** | ~10 stacked sections, duplicate point displays | Tabbed: Progress / Perks / Activity |
| **Home (map mode)** | Empty decorative map | Map as background with bottom sheet feed |
| **Track** | Per-card: timeline + explainer + proof + reopen | Collapsed summary → expand detail |
| **Issue detail** | Timeline + trust card + updates | Story-style vertical timeline, sticky action |
| **Rewards metrics** | "How rewards work" + philosophy + hero points | One summary header, details on tap |

### Discoverability gap

**Rewards is not in bottom nav.** Users must Profile → "Rewards & badges" to find the gamification hub—after performing actions that should surface rewards. This buries the return loop.

---

## 5. Ten highest-leverage UX improvements (summary)

Detailed rationale in [`top-10-upgrades.md`](./top-10-upgrades.md).

| # | Upgrade | Primary lever |
|---|---------|---------------|
| 1 | **Action feedback toasts** (+trust, +pts, neighbor count) after verify/report | Add progress feedback |
| 2 | **Wire reward events** to report/verify/support flows | Add richer gamification (ethical) |
| 3 | **Unify scoring model** (one contribution number, one label) | Redesign interaction pattern |
| 4 | **Rewards tab or home progress chip** in nav | Improve visual hierarchy |
| 5 | **Make pulse strip tappable** → filtered Verify/Track | Redesign interaction pattern |
| 6 | **Collapse Rewards page** into summary + drill-down | Reduce copy clutter |
| 7 | **Photographic seed media** on feed cards | Improve visual hierarchy |
| 8 | **Success screen: action-first** (trim 3 edu cards to 1 line) | Reduce copy clutter |
| 9 | **Live challenge participation** (join + contribute CTA) | Add richer gamification |
| 10 | **Neighborhood activity stream** on home (recent confirms, resolves) | Add progress feedback |

All ten preserve trust, transparency, and seriousness—they add **feedback and loops**, not hype.

---

## 6. Screen-by-screen classification

Legend: ✅ Keep as-is · 🔼 Improve hierarchy · 🔄 Redesign pattern · 📈 Add progress feedback · 🎮 Richer gamification · ✂️ Reduce copy

### Home

| Element | Verdict | Notes |
|---------|---------|-------|
| Persona hero CTA | ✅ | Action-oriented, persona variants work |
| Report FAB (nav) | ✅ | Best mobile pattern in app |
| Civic pulse strip | 🔄 + 📈 | Metrics should be tappable filters |
| Map/Feed toggle | 🔄 | Map must show real pins or remove toggle |
| First session education | ✂️ | Dismissible but redundant post-onboarding |
| Nearby preview (3 cards) | 🔼 + 🔄 | Only first card actionable—inconsistent |
| Weekly resolved banner | 📈 | Add tap → resolved issues feed |
| Insight strip copy | ✂️ | One line sufficient if pulse is interactive |

### Report

| Element | Verdict | Notes |
|---------|---------|-------|
| 4-step wizard + progress | ✅ | Clear mobile flow |
| Evidence bottom sheet | ✅ | Strong outdoor UX |
| AI assist panel | ✅ | Assistive, editable |
| Duplicate nudge on review | ✅ | Core civic differentiator |
| Location lat/lng inputs | 🔄 | Replace with draggable pin map |
| Map preview on location | 🔄 | Cosmetic—misleading |
| Success explainer cards (×3) | ✂️ + 📈 | Cut to one line; add trust/points delta |
| Success CTAs | ✅ | Track / Verify / Home is correct |

### Verify

| Element | Verdict | Notes |
|---------|---------|-------|
| Pending queue filter | ✅ | Real `pending_verification` data |
| Confirm → remove card | ✅ | Inbox-zero satisfaction |
| Hero education block | ✂️ | Redundant with `TrustParticipationCard` |
| Trust participation card | ✂️ | Keep compact only |
| Post-confirm feedback | 📈 + 🎮 | Show +3 trust, +5 pts animation |
| "Can't confirm" option | 🔄 | Missing—binary confirm only |
| Distance / pending time | 🔼 | Add context per card |

### Track

| Element | Verdict | Notes |
|---------|---------|-------|
| Filter chips | ✅ | Useful scan pattern |
| Reopen resolved | ✅ | Rare strong civic feature |
| Compact timeline | 🔼 | Only current step labeled—confusing |
| StateTransitionExplainer per card | ✂️ | Stacks with timeline—pick one |
| `needs_action` filter | 🔄 | Mislabeled (shows resolved only) |
| Resolution proof | 📈 | Placeholder-heavy—needs real images |
| Contribution credit per report | 🎮 + 📈 | Missing link to rewards |

### Rewards

| Element | Verdict | Notes |
|---------|---------|-------|
| Verified vs pending points | ✅ | Correct ethical framing |
| Philosophy + at-a-glance + hero | ✂️ | Triple explanation of same rules |
| Civic champion ladder | 🔼 | Good concept; wrong data source vs leaderboard |
| Leaderboard | 🔄 + 🎮 | Static—needs live rank movement |
| Badge grid | 🎮 + 📈 | Unlock celebration missing |
| Milestones checklist | 🎮 | Frozen at 0/N for new users |
| Partner catalog | ✅ | Gated correctly; copy honest |
| Community challenges | 🔄 | Static progress—needs join CTA |
| Page length | ✂️ + 🔄 | Dashboard scroll—needs tabs/sections |

### Profile

| Element | Verdict | Notes |
|---------|---------|-------|
| Trust ring + badge | ✅ | Clean mobile profile pattern |
| Trust breakdown rows | 🔼 | Add trend arrow or "since last week" |
| Rewards link card | 🔼 | Should be more prominent—or nav tab |
| Family/youth link | ✅ | Clear supervised entry |
| No progression summary | 📈 | Missing: rank, next badge, streak |

### Trust system (cross-cutting)

| Element | Verdict | Notes |
|---------|---------|-------|
| Trust ring thresholds | ✅ | 70+ Trusted / 40+ Building / Review |
| `applyTrustUpdate` on verify | ✅ | Wired but invisible |
| Duplicate/abuse penalties | 🔄 | Domain exists, never applied in UI |
| Trust history / "why changed" | 🔄 | Missing entirely |
| Catalog gating by trust | ✅ | 70/80 thresholds work |

### Leaderboard

| Element | Verdict | Notes |
|---------|---------|-------|
| Ranking list UI | 🔼 | Fine visually; wrong data |
| "(you)" marker | ✅ | Good |
| "pts" label | 🔄 | Conflicts with redeemable points |
| Ward/school scope filter | 🔄 | Missing segmentation |
| Rank change feedback | 📈 + 🎮 | None |

### Badges

| Element | Verdict | Notes |
|---------|---------|-------|
| Unlock rules in domain | ✅ | Sound criteria |
| Locked state UI | ✅ | Padlock + criteria visible |
| Badge icons from seed | 🔼 | `icon` field never rendered |
| Unlock moment | 📈 + 🎮 | No toast/modal/celebration |
| Badge → action link | 🔄 | "2 more corroborations to unlock" CTA missing |

### Community challenges

| Element | Verdict | Notes |
|---------|---------|-------|
| Optional framing copy | ✅ | Not forced—appropriate |
| Progress bars | 🔄 | Static decoration |
| Join/contribute CTA | 🔄 | Missing entirely |
| School vs ward scope | 🔼 | Youth page filters; citizen page shows all |
| Link to verify/report | 🔄 | No challenge-driven routing |

---

## 7. Emotional temperature map

```
High energy potential          Current temperature
─────────────────────          ───────────────────
Submit report                  ████░░░░░░  Warm copy, cold feedback
Neighbor confirms yours        ██░░░░░░░░  Flat text banner
Issue reaches verified         █░░░░░░░░░  Badge change only in data
Crew resolves issue            ██░░░░░░░░  Placeholder proof
Badge unlock                   ░░░░░░░░░░  Never fires live
Challenge progress             ░░░░░░░░░░  Static bars
Leaderboard climb              ░░░░░░░░░░  Static seed
```

---

## 8. What to preserve at all costs

When upgrading, **do not trade away**:

1. **Support-existing duplicate flow** — core anti-noise mechanic
2. **Verification-before-rewards ethics** — copy and gating logic
3. **Reopen resolved reports** — citizen accountability
4. **Report FAB prominence** — primary job-to-be-done
5. **Civic blue/teal visual identity** — trust signaling
6. **No-password demo auth** — judge/stakeholder access
7. **Suspicious-report protective framing** — not accusatory
8. **Youth mode restrictions** — responsible gamification

---

## 9. Recommended audit follow-up sequence

1. **Wire feedback layer** (toasts, deltas)—highest ROI, lowest visual risk  
2. **Connect reward event pipeline**—unlocks badges, milestones, leaderboard  
3. **Restructure Rewards page**—tabs, dedupe copy  
4. **Revitalize home feed**—real media, activity stream, consistent verify affordance  
5. **Challenge participation MVP**—join + increment on corroboration  

See [`product-gaps.md`](./product-gaps.md) for brief-to-build gap matrix and [`top-10-upgrades.md`](./top-10-upgrades.md) for prioritized implementation briefs.

---

*Audit date: June 2026 · Prototype: civicresolve-ten.vercel.app · No code changes in this pass.*
