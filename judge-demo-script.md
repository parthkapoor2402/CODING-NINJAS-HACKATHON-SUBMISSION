# Judge Demo Script — CivicResolve

**Duration:** 8–12 minutes · **Device:** Phone preferred (live camera) or laptop (gallery mode)  
**Account:** `demo-citizen@local.dev` unless noted

---

## Opening (30 sec)

> "CivicResolve is a community-powered civic platform — not a complaint box. Residents **identify**, **report with evidence**, **validate** each other's signal, **track** accountability to resolution, and earn **responsible** recognition. AI assists; humans and neighbors decide."

Sign in: **Continue as citizen** → Home shows **Civic pulse** (open / need confirmation / resolved).

---

## Act 1 — Home & neighborhood signal (90 sec)

1. Point to **Civic pulse strip** — live counts from ward data.
2. Highlight **Around you** — pothole at St. Mary's School crossing (verified, 4 confirmations).
3. Tap **See all** → Nearby feed → sort **Most urgent** → Lakeview Apartments water leak (in progress, crew assigned).
4. Say: "The product steers people toward **supporting** existing reports, not filing duplicates."

**Optional:** Confirm Park Lane streetlight from home card if shown.

---

## Act 2 — Report in under 60 seconds (2 min)

Tap **Report** (hero CTA).

| Step | Show | Say |
|------|------|-----|
| Evidence | Take photo **or** upload `src/test/fixtures/demo-photo.jpg` | "Camera-native on phone; gallery fallback on desktop." |
| Details | AI category suggestion (mock or Grok) | "AI suggests — never blocks submit." |
| Location | Auto pin + manual adjust | "Geolocation with manual correction." |
| Review | Duplicate nudge if near school pothole coords | "Intelligent merge guidance, not punishment." |

Submit → **Success:** "You spoke up for your block" → **Track my report**.

---

## Act 3 — Community verification (90 sec)

**Verify** tab → Park Lane streetlight → **Confirm you see this**.

> "One confirmation per person. Corroboration raises crew confidence — that's community participation with guardrails."

---

## Act 4 — Duplicate & trust (60 sec)

**Nearby** → duplicate nudge on merged pothole cluster → **Support existing report**.

Open **issue detail** `report-003` → **Protected review** notice (quality check, not accusation).

---

## Act 5 — Rewards in 10 seconds (45 sec)

**Profile → Rewards** (or nav if exposed).

Point to **How rewards work** strip:
- Earn on **verified** impact
- Duplicates earn **nothing**
- Redeem with **trust** threshold

---

## Act 6 — Admin accountability (2 min)

Sign out → **Admin demo**.

| Screen | Demo |
|--------|------|
| Dashboard | KPIs, ward load |
| Queue | School pothole, Lakeview leak, Park Lane light |
| Moderation | Suspicious queue + duplicate merge |
| Analytics | Response time, category trends |

> "Transparency for ops — same signal citizens see, enriched for triage."

---

## Act 7 — Youth / family (optional, 45 sec)

**Youth demo** → **Family** → supervised rewards cap, no partner redemption.

---

## Closing (20 sec)

> "MVP-scoped, but production-minded: trust visible in UX, media-native reporting, AI with escape hatches, and gamification that rewards **verified** neighborhood impact."

---

## Demo mode cheat sheet

| Mode | Setup | Best for |
|------|--------|----------|
| **Live capture** | `VITE_FORCE_GALLERY_ONLY=false` on phone | Wow factor |
| **Seeded upload** | `VITE_FORCE_GALLERY_ONLY=true` + `demo-photo.jpg` | Predictable judging |

See `demo-media-strategy.md` for full media playbook.
