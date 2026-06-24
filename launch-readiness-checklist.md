# Launch Readiness Checklist — Judge Demo

Use before presenting to judges or recording a walkthrough.

## Environment

- [ ] `npm install` complete
- [ ] `.env` copied from `.env.example`; `VITE_USE_MOCKS=true`
- [ ] Choose demo mode: live camera **or** `VITE_FORCE_GALLERY_ONLY=true`
- [ ] `npm run dev` — app loads at `http://localhost:5173`
- [ ] Playwright browsers installed if running E2E locally

## Functional smoke (5 min)

- [ ] Citizen sign-in → Home shows **civic-pulse-strip** and nearby cards
- [ ] Report flow completes with image upload
- [ ] Verify tab confirms Park Lane streetlight
- [ ] Rewards page shows **rewards-at-a-glance**
- [ ] Admin sign-in → dashboard KPIs → queue → moderation
- [ ] Issue `report-003` shows **protected review** notice

## Test suite (optional pre-flight)

- [ ] `npm test` — 175 Vitest tests green
- [ ] `npm run test:e2e` — 24 Playwright tests green
- [ ] `npm run build` — production build succeeds

## Device prep

- [ ] Phone: grant camera/location when prompted (or deny once to show fallback)
- [ ] Laptop: have `demo-photo.jpg` ready for gallery upload
- [ ] Clear `sessionStorage` if switching demo accounts mid-session

## Narrative prep

- [ ] Read `judge-demo-script.md` once through
- [ ] Know duplicate demo coords (near school pothole) for Review step
- [ ] Know four seed scenarios by name (school, market, lane, apartments)

## Polish verification

- [ ] No raw report IDs shown to users in duplicate UI
- [ ] Copy sounds civic and premium (not "complaint box")
- [ ] Empty states render on Verify when queue cleared
- [ ] Success screen offers Track + Verify next steps

## Fallbacks if live demo fails

| Failure | Fallback |
|---------|----------|
| Camera denied | Gallery upload + permission-denied banner |
| AI unavailable | Amber fallback; manual category |
| Location denied | Manual pin adjust |
| Network slow | Seeded mock data still loads |
| Wrong account | `/auth` → demo buttons |

---

**Sign-off:** Demo ready when all Functional smoke items pass on target device.
