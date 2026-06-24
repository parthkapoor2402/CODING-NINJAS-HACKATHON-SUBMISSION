# Interaction Philosophy v2 — CivicResolve

> **Version:** 2.0 · Post-audit redefinition  
> **Problem statement:** The product is structurally correct but experientially static.  
> **North star:** A high-trust, mobile-first civic participation product that feels **alive**, **motivating**, **neighborhood-aware**, and **progression-rich**—without becoming childish or gimmicky.

---

## 1. Philosophy shift (v1 → v2)

| v1 (current prototype) | v2 (target) |
|--------------------------|-------------|
| Explains trust ethics repeatedly | **Demonstrates** trust through feedback and neighborhood motion |
| Gamification as a Rewards dashboard | Gamification as **consequence of civic action** surfaced in context |
| Home as information poster | Home as **neighborhood pulse** — living, tappable, directional |
| Success = compliance screen | Success = **civic pride moment** with clear next step |
| Static seed progression | **Earned** progression tied to verify/report/support events |
| Map as decorative toggle | Map as **spatial awareness** or honest simplification |
| Copy teaches; UI waits | UI **reacts**; copy supports only when needed |

**Core sentence:**  
*CivicResolve should feel like your block is breathing—not like you're filling out a form for city hall.*

---

## 2. Emotional design principles

### Principle 1 — Dignified agency
Users are **neighbors taking responsibility**, not customers filing tickets. Language and motion should confer dignity: *"You spoke up for your block"* not *"Submission received."* Agency is emotional fuel; bureaucracy is not.

### Principle 2 — Calm confidence, not alarm
Civic issues can be urgent, but the **interface stays calm**. Urgency lives in content (school crossing pothole, water leak), not in red flashing UI. Confidence signals: steady typography, measured color, predictable navigation.

### Principle 3 — Feedback is respect
Every meaningful action deserves **immediate acknowledgment**. Silence after verify or submit reads as indifference. Feedback is not gamification—it is respect for the user's time and intent.

### Principle 4 — Pride without performance
Celebrate **verified impact**, never volume. The emotional peak is: *"Your neighborhood trusted your report and crews responded"*—not *"LEVEL UP!"* Pride is quiet, earned, and proportionate.

### Principle 5 — Neighborhood as character
The product has a third actor: **the block**. It confirms, resolves, stalls, improves. UI should anthropomorphize the neighborhood gently—*"4 neighbors confirmed"*—without fake social network noise.

### Principle 6 — Show, then tell
First exposure may educate (onboarding). Every subsequent screen should **show state** (counts, motion, progress) and **minimize lecture**. If the user has seen trust rules once, never repeat three cards again.

### Principle 7 — Serious products can delight
Delight is not confetti. Delight is: a count ticking up, a badge unlocking with restraint, a resolved issue appearing in the activity stream, the trust ring filling smoothly. **Micro-moments of competence.**

---

## 3. Civic motivation loops

A motivation loop requires: **trigger → action → feedback → investment → return trigger.**

### Primary loop — Report → Verify → Resolve

```
See issue / hear about issue
    → Report (evidence + location)
    → Pending verification [calm wait state]
    → Neighbors confirm [neighborhood momentum]
    → Verified → crew action [urgent for ops, calm for citizen]
    → Resolved [rewarding closure]
    → Return: streak, challenge, nearby alert
```

**v2 requirement:** Each transition must have a **visible state change** somewhere in the app (home stream, track card, toast, profile delta).

### Secondary loop — Verify without reporting

```
Open app → See "needs confirmation" on home pulse
    → Confirm what you see [low-friction, high-trust]
    → Immediate feedback (+trust, +contribution)
    → See rank/badge/challenge progress shift
    → Return: verify again when pulse shows need
```

**v2 requirement:** Verify must feel like the **easiest high-impact action**—not a chore hidden on tab 4.

### Tertiary loop — Support existing (anti-noise)

```
Attempt report → Duplicate detected
    → Support existing [ethical redirect]
    → Corroboration credit [same feedback as verify]
    → Stronger existing report → faster crew routing
```

**v2 requirement:** Supporting must feel as **rewarding as reporting** when the issue is real.

### Return loop — Why open the app again?

| Return trigger | Surface | Tone |
|----------------|---------|------|
| Neighbor confirmed your report | Home stream + Track | Rewarding |
| Issue assigned / in progress | Track push/in-app | Informative |
| Issue resolved nearby | Home stream | Rewarding |
| Badge / milestone unlocked | Profile + toast | Rewarding |
| Challenge progress tick | Rewards tab | Motivating |
| Streak at risk (optional, gentle) | Profile chip | Calm nudge |

**Anti-pattern:** Opening app only to check a static dashboard with unchanged numbers.

---

## 4. Trust-first gamification

Gamification serves **signal quality**, not engagement metrics.

### The trust stack (two scores, one story)

| Metric | Meaning | User question it answers |
|--------|---------|--------------------------|
| **Trust score** (0–100) | Reliability / standing | *"Does the system believe I'm a good-faith participant?"* |
| **Verified contribution** (integer) | Confirmed civic impact | *"What have I actually helped accomplish?"* |

Never introduce a third competing number. Pending contribution is **labeled separately** and never redeemable.

### Rules of trust-first gamification

1. **Verify before celebrate** — No points animation until action is logged; pending states use muted styling.
2. **Duplicates earn nothing** — Support-existing earns corroboration credit; duplicate filing earns zero.
3. **Trust can decrease** — Abuse and duplicate gaming apply penalties (visible, explainable).
4. **Leaderboard is recognition, not lottery** — Rank reflects verified contribution, not login streaks.
5. **Youth caps are visible** — Family mode shows limits as protection, not punishment.
6. **No dark patterns on verify** — Never "Confirm to earn 50 pts!" adjacent to confirm button.

---

## 5. Neighborhood momentum

**Neighborhood momentum** is the felt sense that *things are moving on your block*—confirmations arriving, crews assigned, issues closing.

### Momentum signals (UI)

| Signal | Placement | Feeling |
|--------|-----------|---------|
| Activity stream | Home | Alive |
| Corroboration count increment | Issue card (animated) | Social proof |
| Pulse metrics changing | Home strip | Progress |
| "Resolved this week" | Home pulse → tap | Closure |
| Distance + time pending | Verify cards | Urgency (content-level) |
| Ward label from real context | Home header | Local |

### Momentum anti-patterns

- Static progress bars (58% forever)
- Fake distances and hardcoded ward names
- Feed cards that look identical regardless of severity
- Map toggle that doesn't show pins

### Momentum design pattern — "Happening nearby"

A curated, chronological strip—not a comment thread:

> *4 neighbors confirmed school-crossing pothole · 2h ago*  
> *Crew assigned to Lakeview leak · today*  
> *Russell Market cleanup resolved · yesterday*

Tap → issue detail. **Calm typography, real verbs, real time.**

---

## 6. Mission-based engagement

Missions are **optional, scoped, collective goals**—not daily quests.

### Mission types

| Type | Example | Scope | Reward |
|------|---------|-------|--------|
| **Block mission** | Confirm 3 issues on your street | Geo | Badge + recognition |
| **Ward mission** | Support existing pothole reports (no duplicates) | Ward | Challenge progress |
| **School mission** | Supervised sidewalk audit near campus | School + youth | Family-visible credit |
| **Personal milestone** | First verified impact | Individual | Badge unlock |

### Mission principles

- **Opt-in** — "Join" explicitly; never auto-enroll.
- **Collective + personal** — Show both *"You contributed 2"* and *"Block at 72%"*.
- **Deep link to action** — Mission card → Verify or Support, not passive reading.
- **Recognition only** — No prize lottery language; partner perks remain separate gated layer.
- **Expire gracefully** — Ended missions archive; don't shame incomplete.

### Mission vs challenge naming

Use **"Community challenge"** in UI for collective goals and **"Your milestones"** for personal progression. Avoid RPG vocabulary: quests, XP, grind.

---

## 7. Responsible recognition

Recognition is how the product says **thank you** without corrupting incentives.

### Recognition hierarchy

```
1. Status transparency     ("Your report is verified")
2. Neighborhood acknowledgment ("4 neighbors confirmed")
3. Contribution credit       (+verified contribution)
4. Trust reinforcement       (+trust when deserved)
5. Badge / milestone         (memorable achievement)
6. Leaderboard position      (social recognition)
7. Partner perk unlock       (optional, gated, real-world)
```

Lower layers must work before upper layers matter. Never lead with partner perks.

### Recognition tone

| Do | Don't |
|----|-------|
| "Verified impact" | "Points earned!!!" |
| "Neighbors confirmed what you saw" | "You're on fire!" |
| "Recognition with guardrails" | "Unlock epic rewards" |
| "Thank you for participating responsibly" | "STREAK SAVED" |

### Recognition timing

- **Immediate:** Action toast (contribution logged, pending verification)
- **Delayed:** Badge unlock when verification threshold met
- **Reflective:** Weekly neighborhood summary (future)—calm, informative

---

## 8. Delight without losing seriousness

### The delight palette

| Acceptable delight | Unacceptable gimmick |
|--------------------|----------------------|
| Trust ring count-up animation | Confetti explosion |
| Badge unlock modal (single, dismissible) | Slot machine reel |
| Activity stream item slide-in | Bouncing mascots |
| Progress bar fill on return | Fake notification badges |
| Haptic on confirm (native future) | Sound effects |
| Copy: "Your block heard you" | Copy: "AMAZING JOB!!!" |

### Delight formula

```
Delight = timely feedback + proportional motion + meaningful consequence
```

Not: `Delight = animation × points × color`

### Seriousness anchors (never remove)

- Verification ethics on first exposure
- Duplicate support routing
- Suspicious report protective framing
- Reopen without penalty
- Admin moderation visibility
- Plain language for consequences

---

## 9. Urgent vs calm — interaction temperature

### Temperature model

```
URGENT (content)          CALM (chrome)
─────────────────         ───────────────
School crossing pothole   White card background
Water flooding sidewalk   Steady blue CTA
Dark lane streetlight     Measured typography
Garbage near market       No alarm red fills

REWARDING (closure)       INFORMATIVE (waiting)
─────────────────         ────────────────────
Issue resolved            Pending verification
Badge unlocked            Under review
3 neighbors confirmed     Awaiting crew assignment
Challenge goal met        In progress (crew working)
```

### Screen temperature guide

| Screen / moment | Temperature | UI behavior |
|-----------------|-------------|-------------|
| **Home (default)** | Calm + alive | Soft motion in stream; no flashing |
| **Report wizard** | Calm + focused | Step progress; minimal distraction |
| **Duplicate warning** | Calm + firm | Amber panel; helpful not scolding |
| **Submit success** | Rewarding → calm | Brief pride beat, then clear CTAs |
| **Verify queue** | Calm + purposeful | Distance/time context; easy confirm |
| **Post-confirm** | Rewarding (micro) | Toast + count tick; 2s |
| **Track (open)** | Informative | Timeline clarity |
| **Track (resolved)** | Rewarding | Proof imagery; reopen calm |
| **Rewards** | Motivating + calm | Progress visible; no slot machine |
| **Profile trust** | Informative | Ring + trend; no anxiety |

### Urgency without hysteria

Use **content hierarchy** for urgency:
- Category + location in bold
- Severity as chip (Medium / High)—not pulsing red
- Distance and "pending 2 days" on verify cards
- School / safety keywords in description—not alarm UI

---

## 10. Rewarding vs informative — content classification

Every UI element should declare its job:

### Informative (default)

- Status badges
- Timelines
- Trust breakdown rows
- Pending vs verified labels
- Explainer accordions (collapsed by default after first visit)
- Admin-style metrics on pulse strip

**Design:** Muted foreground, smaller type, icons + labels, no animation.

### Rewarding (earned moments)

- Post-verify toast
- Contribution increment
- Badge unlock
- Milestone checkbox fill
- Resolved proof card with before/after
- Leaderboard rank up
- Challenge progress jump after user action

**Design:** Teal accent, slightly larger type, restrained motion, auto-dismiss or single modal.

### Rule: don't reward information

Showing a pending report is **informative**. A neighbor confirming it is **rewarding**. Mixing them dilutes both.

---

## 11. Mobile-first interaction standards (v2)

1. **Thumb-first** — Primary actions in bottom 40% of screen; Report FAB remains sacred.
2. **One primary CTA per viewport** — Scrolling should not reveal three competing gradients.
3. **Feedback within 100ms** — Optimistic UI on confirm; reconcile on API response.
4. **Progressive disclosure** — Summary → tap → detail; not all sections expanded.
5. **Context persistence** — Returning home shows what changed since last visit.
6. **Honest maps** — Show real pins or don't pretend; list-first is acceptable.
7. **Evidence-first cards** — Photo/video thumbnail before category color block.

---

## 12. Copy philosophy v2

| v1 pattern | v2 pattern |
|------------|------------|
| 3-card explainer on every screen | 1-line status + optional "Learn more" |
| "Community signal, not noise" repeated | Show noise reduced: duplicate routed count |
| Long verify thank-you paragraph | "Confirmed · +5 contribution · pending crew review" |
| Philosophy card before points | Points first; philosophy in accordion |

**Voice:** Neighbor who keeps you informed—not professor, not hype man.

---

## 13. Success criteria for v2

The redesign succeeds when:

1. A user verifies an issue and **sees something change** within 2 seconds.
2. Home feels **different** after 24 hours of seed activity—not identical cards.
3. Rewards page numbers **match** profile and leaderboard after actions.
4. A judge understands trust ethics in **one onboarding pass**—not on every screen.
5. Screenshots show **real evidence** and **neighborhood motion**.
6. No evaluator uses the word "generic" or "static."
7. No evaluator uses the word "childish" or "gamey."

---

## 14. Related documents

| Document | Role |
|----------|------|
| [`redesign-blueprint.md`](./redesign-blueprint.md) | Screen-by-screen prioritized redesign |
| [`gamification-principles-v2.md`](./gamification-principles-v2.md) | Trust-first mechanics deep dive |
| [`ux-audit-level5.md`](./ux-audit-level5.md) | Current-state audit |
| [`top-10-upgrades.md`](./top-10-upgrades.md) | Engineering-prioritized upgrades |
| [`design-direction.md`](./design-direction.md) | Visual system (still valid) |

---

*Interaction Philosophy v2 · CivicResolve · Audit-derived · No implementation in this pass.*
