# Trust & Safety — CivicResolve

> Trust is the product. Duplicates, fake reports, and abuse are core domain logic—not admin afterthoughts.

---

## 1. Trust System Architecture

### Score dimensions

| Score | Range | What it measures | Visible to |
|-------|-------|------------------|------------|
| **Trust score** | 0–100 | Overall reliability of a user account | Citizen (profile), Admin |
| **Contribution score** | 0–∞ (levelled) | Cumulative verified civic value | Citizen |
| **Verification score** | 0–100 | Quality of corroborations user gives/receives | Citizen, Admin |
| **Duplicate risk score** | 0–100 | Likelihood report duplicates another | Admin, internal UX hints |
| **Abuse / suspicious flags** | enum set | Active investigations, velocity, disputes | Admin only |

### Trust score composition (illustrative weights)

```
trustScore =
  40% × verificationHistory
+ 25% × reportAccuracy (verified / total submitted)
+ 15% × corroborationQuality
+ 10% × accountAgeAndCompleteness
+ 10% × penaltyAdjustments (flags, rejections, disputes lost)

Clamp 0–100; recalculate on: submit, verify, merge, reject, dispute resolve
```

### Contribution score rules
- **+50** unique report reaches `verified`
- **+20** accepted corroboration on another user’s report
- **+30** report you filed reaches `resolved` (reporter credit)
- **+10** resolution follow-up survey completed
- **−30** report rejected as fake/spam (after appeal window)
- **−10** duplicate submitted despite high-confidence match (user overrode)

### Verification score rules
- Corroborations marked helpful by system: +5
- Corroborations overturned by admin: −15
- Confirmed accurate verifier streak: multiplier cap 1.2×

---

## 2. Duplicate-Report Handling

### Detection signals (combined)

| Signal | Weight | MVP implementation |
|--------|--------|-------------------|
| Geo distance < 75m | High | Haversine |
| Same category | Medium | Exact match |
| Text similarity | Medium | Trigram / mock embedding |
| Image perceptual hash | High | pHash (Phase 2 live; MVP mock hash) |
| Time window < 14 days | Medium | Timestamp |
| Same reporter re-submit | High | User ID match |

### Duplicate risk tiers

| Tier | Score | UX behavior |
|------|-------|-------------|
| Low | 0–39 | Normal submit |
| Medium | 40–69 | Banner: “Similar report nearby” + link |
| High | 70–89 | Strong CTA to support existing; submit requires reason |
| Critical | 90+ | Default block submit; admin override only |

### Merge / support-existing UX (citizen)

1. **Pre-submit sheet** — Map pin + cards of top 3 matches with photo, distance, status, corroboration count.
2. **“This is the same issue”** — One tap → corroboration flow (optional photo/comment).
3. **“Mine is different”** — Requires selecting difference reason (location, severity, separate instance).
4. **Post-submit** — Admin may merge; reporters notified; points credited to corroborators on canonical report.

### Admin merge rules
- Canonical report = earliest verified OR highest corroboration count (admin toggle)
- Duplicate reporters receive partial contribution credit (+15) if acting in good faith
- Merged reports status → `merged`; hidden from public map
- Audit log entry mandatory

---

## 3. Fake-Report Handling Logic

### Risk indicators

| Indicator | Action |
|-----------|--------|
| Stock photo / web image detected (Phase 2) | Flag + manual review |
| GPS mismatch > 500m (EXIF vs pin) | Flag, request re-pin |
| Velocity > 5 reports / hour | Soft block + captcha |
| New account + high severity + no media | Hold `pending_verification` |
| NLP spam patterns | Auto-flag |
| Coordinated dispute ring | Abuse flag on cluster |
| Repeated rejections | Trust score decay + cooldown |

### Decision workflow

```
submitted
  → automated risk scan
      ├─ low → pending_verification (community)
      ├─ medium → admin pre-review queue
      └─ high → hold + request more evidence notification

rejected paths:
  - fake / spam
  - duplicate (merged)
  - not a civic issue
  - insufficient evidence

Appeal: 1 per report within 7 days; moderator decision final in MVP
```

### Citizen messaging (transparent, not punitive)
- “We need a clearer photo of the issue” (recoverable)
- “This matches an existing report—support it to help faster” (redirect)
- “This report couldn’t be verified” (with reason code + appeal link)

---

## 4. Community Verification

### Corroboration types
- **Confirm** — “I see this too” (+ optional note)
- **Add evidence** — Photo/video from slightly different angle
- **Dispute** — “This doesn’t look right” (requires reason, not anonymous)

### Thresholds
- **3 confirms** OR **1 confirm + 1 evidence** → auto `verified` (MVP rule)
- **2 disputes** from trusted users → admin review
- Dispute rate > 40% on report → pause rewards

### Anti-gaming
- Cannot corroborate own reports
- Corroboration geo must be within 200m (honor system + GPS check)
- Daily corroboration cap: 20 (youth: 5)

---

## 5. Gamification Architecture

### Badges (examples)

| Badge | Criteria |
|-------|----------|
| First Verified Report | 1 verified unique report |
| Neighborhood Guardian | 5 verified in home ward |
| Duplicate Defender | 10 support-existing actions |
| Streak Keeper | 7-day civic check-in streak |
| Resolution Witness | Followed report to resolved |
| Youth Civic Starter | 1 supervised verified report |

### Streaks
- **Check-in streak:** Open app + view local map OR verify 1 issue / day
- **Broken streak:** 1 grace day per 30 days
- Streaks do **not** award large points—cosmetic + small bonus only

### Levels
- Level = `floor(contributionScore / 200)`
- Unlock profile flair, not power over moderation

### Partner rewards
- Redeem only when `trustScore >= 60` and event verified
- Codes single-use; fraud monitoring on redemption velocity

### Community recognition
- Opt-in leaderboard by ward (weekly)
- Youth accounts excluded from public leaderboard unless parent enables
- Highlight “most corroborations” alongside “most reports” to balance incentives

### Supervised youth / family mode
- Parent account owns family hub
- Youth: propose draft → parent approve → submit
- Reward cap: 50% of standard points
- No partner redemption under 18
- Activity digest to parent weekly

---

## 6. Reward Logic (Verified Contribution Only)

### Rewardable events

| Event | Points | Conditions |
|-------|--------|------------|
| Unique verified report | 50 | Not merged as duplicate |
| Support existing (corroborate) | 25 | Accepted, not disputed |
| Report resolved (reporter) | 30 | Status resolved |
| Quality evidence bonus | 10 | Admin tag `high_quality` |
| Streak milestone | 5–15 | Cosmetic tiers |

### Non-rewardable
- Draft saves, unverified submits, rejected reports
- Self-corroboration attempts
- Duplicate override without justification
- Disputed corroboration later overturned (clawback)

### Clawback
- On rejection/merge fraud: `rewardEvents` reversed in ledger
- Badge revoked if criteria no longer met

---

## 7. Citizen Trust & Anti-Abuse Rules

1. **One person, one voice** — Device fingerprint hinting (Phase 2); MVP: account-based
2. **Progressive trust** — New accounts: daily report cap 3, corroboration cap 5
3. **Cooldown after rejection** — 24h before next high-severity submit
4. **No incentive without verification** — Points pending until `verified`
5. **Transparent scores** — Profile explains last 5 trust changes
6. **Report responsibly copy** — Shown before first submit and on camera screen
7. **Block list** — Admin can suspend; appeal via email (MVP manual)

---

## 8. Admin Moderation Rules

### Roles
| Role | Can |
|------|-----|
| Moderator | Review queue, merge, reject, flag users |
| Admin | All + config, user suspend, analytics export |
| Field worker | Update assigned reports, upload resolution media |

### SLA priorities (queue ranking)

```
priority =
  severityWeight
× corroborationBoost
× trustInversePenalty (low trust reporter → higher scrutiny, not higher priority)
× ageBoost (hours open)
```

High severity (water, safety) always top decile.

### Required actions
- Every reject: reason code + optional citizen message
- Every merge: canonical selection + notify
- Every suspend: second moderator confirm (Phase 2); MVP: audit log only

### Reason codes (reject)
- `FAKE_SPAM`, `DUPLICATE`, `NOT_CIVIC`, `INSUFFICIENT_MEDIA`, `WRONG_LOCATION`, `DUPLICATE_OVERRIDE_ABUSE`

---

## 9. AI in Trust (Non-Mandatory)

| Use | Role |
|-----|------|
| Categorization | Faster routing; mismatch increases scrutiny |
| Severity hint | Queue ranking, not auto-reject |
| Duplicate embedding | Suggest matches; human confirms |
| Spam NLP | Flag only |
| Summary | Admin efficiency |

If AI unavailable: rules-only path; no user-facing error.

---

## 10. Abuse Scenario Playbook (Demo)

| Scenario | Expected system behavior |
|----------|-------------------------|
| User floods 10 reports same hour | Velocity flag, soft block |
| Same photo two locations | pHash match + GPS mismatch flag |
| Coordinated fake confirms | Dispute threshold → admin |
| Youth attempts partner redeem | Blocked |
| User overrides duplicate 3 times | Trust penalty + admin flag |

---

## Related Documents

- [product-requirements.md](./product-requirements.md)
- [architecture.md](./architecture.md)
- [media-capture-strategy.md](./media-capture-strategy.md)
- [metrics-framework.md](./metrics-framework.md)
