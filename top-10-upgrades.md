# Top 10 UX Upgrades — CivicResolve Level 5 Pass

> **Goal:** Make the product feel *alive* while preserving trust, transparency, and civic seriousness.  
> **Constraint:** No hype gamification, no point-farming aesthetics, no erosion of verification ethics.  
> **Status:** Prioritized recommendations only — no implementation in this document.

---

## How to read this document

Each upgrade includes:

- **Problem** — what users feel today  
- **Change** — what to build  
- **Classification** — audit category  
- **Impact** — High / Medium  
- **Effort** — S / M / L (engineering + design)  
- **Preserves** — what must not break  

---

## 1. Instant action feedback (trust + points delta)

**Classification:** Add progress feedback  
**Impact:** High · **Effort:** S

### Problem
Users confirm an issue or submit a report and receive **no sensory confirmation** that their trust score or contribution changed. `applyTrustUpdate()` runs silently in `authStore.ts`. The product feels inert despite doing the right thing under the hood.

### Change
- After verify, support-existing, and (optionally) submit: show a **brief toast or inline chip** — e.g. `+3 trust · +5 verification pts`
- Animate trust ring on profile when user navigates there (count-up 82 → 85)
- Use restrained motion: slide-up chip, 2s auto-dismiss, no confetti

### Preserves
Ethical framing; no celebration for unverified reports.

### Touch points
`VerificationPage.tsx`, `HomePage.tsx`, `NearbyIssuesPage.tsx`, `SuccessStep.tsx`, new `ActionFeedbackToast` component

---

## 2. Wire reward events to civic actions

**Classification:** Add richer gamification (ethical)  
**Impact:** High · **Effort:** M

### Problem
Badges, milestones, ladder, leaderboard, and activity feed all derive from `RewardEvent[]`—but **report, verify, and support flows never append events**. Gamification is a museum of seed data.

### Change
- On corroborate success → append `corroboration` event (pending until admin/community threshold, or immediate if rules allow)
- On support-existing → append `support_existing` event
- On report submit → append pending `report_submitted` event; flip to `verified_report` when status hits `verified`
- Refetch or optimistically update Rewards state after actions

### Preserves
Verified-only redeemability; pending vs verified distinction.

### Touch points
`mockReports.ts`, `mockBackend.ts`, `authStore` or shared `rewardsStore`, `RewardsPage.tsx` useEffect deps

---

## 3. Unify the scoring model (one number, one language)

**Classification:** Redesign interaction pattern  
**Impact:** High · **Effort:** M

### Problem
Leaderboard shows seed `contributionScore` (120 pts). Ladder uses `contributionFromRewards`. Profile shows both `trustScore` and `contributionScore`. Catalog uses `sumRedeemablePoints`. Users cannot understand progression.

### Change
- **Single display metric** for citizen UI: **"Verified contribution"** (integer)
- Derive from reward events + trust rules everywhere (leaderboard, ladder, profile summary)
- Reserve **"Trust score"** (0–100) for reliability gating only (catalog, moderation)
- Rename all ambiguous "pts" labels with tooltips: *"Verified contribution = confirmed civic impact"*

### Preserves
Trust score as reliability index separate from contribution volume.

### Touch points
`RewardsLeaderboard.tsx`, `ProfilePage.tsx`, `CivicChampionLadder.tsx`, `seed/users.ts` alignment

---

## 4. Surface progression in navigation (Rewards chip or tab)

**Classification:** Improve visual hierarchy  
**Impact:** High · **Effort:** S–M

### Problem
Rewards—the return loop destination—is buried under Profile. Users complete verify/report and have **no nav affordance** toward recognition.

### Change
**Option A (lighter):** Profile tab shows a small badge dot when milestone/badge unlocked; home header chip: `12 contribution · 3-day streak`  
**Option B (stronger):** Replace Profile with **You** tab combining profile + compact rewards summary; or add 5th nav item **Rewards** (icon: award)

Recommendation: **Option A first** to avoid nav crowding; elevate rewards link on Profile with preview stats.

### Preserves
Report FAB centrality; don't demote Report.

### Touch points
`BottomNav.tsx`, `ProfilePage.tsx`, `HomePage.tsx` header

---

## 5. Make Civic Pulse interactive

**Classification:** Redesign interaction pattern + Add progress feedback  
**Impact:** Medium–High · **Effort:** S

### Problem
`CivicPulseStrip` shows Open nearby / Need confirmation / Resolved this week as dead text. Home feels like a dashboard poster, not a control panel.

### Change
| Metric | Tap action |
|--------|------------|
| Open nearby | `/app/nearby` |
| Need confirmation | `/app/community` (verify queue) |
| Resolved this week | `/app/track?filter=resolved` or resolved feed modal |

Add subtle press state (`active:scale-[0.98]`, underline on label).

### Preserves
Anti-noise metrics; don't gamify resolved count obnoxiously.

### Touch points
`CivicPulseStrip.tsx`, `HomePage.tsx`, `TrackingPage.tsx` query param filter

---

## 6. Restructure Rewards page (tabs + dedupe copy)

**Classification:** Reduce copy clutter + Improve visual hierarchy  
**Impact:** High · **Effort:** M

### Problem
Rewards scrolls through ~10 sections with triple explanation of verification ethics (`RewardsAtAGlance` + `RewardsPhilosophyCard` + hero points card). Reads as judge demo, not daily product.

### Change
**Three tabs:**

| Tab | Contents |
|-----|----------|
| **Progress** | Verified contribution hero, ladder, milestones, streak |
| **Recognition** | Badges, leaderboard |
| **Perks** | Catalog, challenges, activity feed |

- Collapse philosophy to **one dismissible line** under hero
- Remove duplicate point displays (one hero number only)

### Preserves
All information remains accessible—just progressive disclosure.

### Touch points
`RewardsPage.tsx`, reward subcomponents, `SegmentedControl` reuse

---

## 7. Photographic evidence on feed cards

**Classification:** Improve visual hierarchy  
**Impact:** Medium · **Effort:** S–M

### Problem
Issue cards show brown/yellow color blocks with serif category text. Screenshots look like wireframes, not a reporting product built on **real evidence**.

### Change
- Add seed images to `seedMedia` for `report-001`–`004` (pothole, leak, streetlight, garbage)
- `IssueCard` renders `img` when `mediaUrl` exists; fallback to current color block
- Include one real user-submitted style image in demo assets folder

### Preserves
Fallback for text-only reports; don't require media to browse.

### Touch points
`IssueCard.tsx`, `services/mock/seed/media.ts`, `public/demo/` assets

---

## 8. Success screen: action-first, one-line ethics

**Classification:** Reduce copy clutter + Add progress feedback  
**Impact:** Medium · **Effort:** S

### Problem
`SuccessStep.tsx` shows headline + paragraph + **three explainer cards** before Track/Verify CTAs. Users who just reported want **what's next**, not another lecture.

### Change
- Keep headline: *"You spoke up for your block"*
- One subline with reference ID (copyable)
- **Single** inline trust note: `Pending verification — neighbors can confirm what you saw`
- CTAs immediately below (Track primary, Verify secondary)
- Move detailed ethics to collapsible "How verification works" accordion

### Preserves
Trust education available, not forced.

### Touch points
`SuccessStep.tsx`

---

## 9. Community challenges with join + contribute loop

**Classification:** Add richer gamification + Redesign interaction pattern  
**Impact:** Medium · **Effort:** M

### Problem
`SEED_CHALLENGES` show static 58%/72% progress. No join, no personal contribution, no link to verify/report. Challenges feel like admin posters.

### Change
- **Join challenge** CTA → stores opt-in on user session
- Progress increments when user corroborates (ward challenge) or verifies near school (school challenge)
- Show: `You contributed 2 toward this goal`
- Deep link: "Verify nearby" / "Support existing pothole reports" per challenge type
- Progress bar animates on return to Rewards

### Preserves
Optional framing; no lottery/prize language; recognition only.

### Touch points
`community-challenges.ts`, `CommunityChallengeShell.tsx`, corroborate hook, `youth-mode` school filter

---

## 10. Neighborhood activity stream on Home

**Classification:** Add progress feedback + Improve visual hierarchy  
**Impact:** Medium–High · **Effort:** M

### Problem
Home shows static cards. Nothing signals that **the neighborhood is moving**—confirmations, assignments, resolutions.

### Change
Add compact **"Happening nearby"** stream above feed (3–5 items):

```
• 4 neighbors confirmed school-crossing pothole — 2h ago
• Crew assigned to Lakeview leak — today
• Russell Market garbage marked resolved — yesterday
```

- Sourced from `mockIssueUpdates` / report status changes
- Tap → issue detail
- Subtle enter animation on new items (respect `prefers-reduced-motion`)

### Preserves
Curated official updates (not comment thread)—match issue detail tone.

### Touch points
`HomePage.tsx`, `mockIssueUpdates.ts`, new `NeighborhoodActivityStrip.tsx`

---

## Implementation sequence (recommended)

```
Week 1 — Feel alive (low risk)
  ├── #1 Action feedback toasts
  ├── #5 Tappable pulse strip
  ├── #8 Success screen trim
  └── #7 Seed photography

Week 2 — Close the loop
  ├── #2 Reward event pipeline
  ├── #3 Unified scoring
  └── #4 Progression in nav/profile

Week 3 — Depth
  ├── #6 Rewards tabs
  ├── #9 Challenge participation
  └── #10 Activity stream
```

---

## What we explicitly will NOT do

| Temptation | Why avoid |
|------------|-----------|
| Confetti / slot-machine unlocks | Undermines civic seriousness |
| Leaderboard without verification gate | Rewards noise, not impact |
| Points for opening the app | Engagement hacking |
| Removing duplicate/support flow | Core product ethics |
| Mandatory AI before submit | Blocks real-world reporting |
| Dark patterns on verify ("Confirm to earn!") | Pressures false corroboration |

---

## Success metrics (post-upgrade)

| Signal | How to measure |
|--------|----------------|
| Product feels alive | User testing: "Does the neighborhood feel active?" ↑ |
| Loop comprehension | Users can explain trust vs contribution in 1 sentence |
| Verify return rate | % who verify again within 7 days |
| Rewards discovery | % sessions visiting Rewards without Profile prompt |
| Copy fatigue | Reduced time-on-screen on success/verify (faster to CTA) |
| Demo credibility | Screenshots show real photos + live activity |

---

*Derived from [`ux-audit-level5.md`](./ux-audit-level5.md) and [`product-gaps.md`](./product-gaps.md). Ready for implementation when approved.*
