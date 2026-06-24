# Final Polish Notes — Demo Hardening Pass

## Weak moments addressed

| Gap | Fix |
|-----|-----|
| Home felt static | Civic pulse strip, dynamic resolved count, working confirm on highlight card |
| Home CTA dead / wrong links | `detailHref` → issue detail; corroborate wired |
| Admin sent to citizen home on sign-in | AuthPage role-aware redirect |
| Session lost on reload | sessionStorage persistence + sync store bootstrap |
| Duplicate UX showed raw IDs | `reportDisplayName()` + human labels |
| Duplicate felt punitive | "Neighbors may already be on this" + support CTA to issue detail |
| Suspicious felt accusatory | "Protected review" framing + honest-reporter reassurance |
| Rewards took >10s to understand | `RewardsAtAGlance` 3-column explainer |
| Verify tab felt thin | Hero block + meaningful feedback copy |
| Success step generic | "You spoke up for your block" + verify CTA |
| `VITE_FORCE_GALLERY_ONLY` dead | Wired in `canUseLiveCapture()` |
| Nearby support testid broken | `support-existing-btn` on support action |
| Seed copy generic | Four judge scenarios with real addresses |

## Ten screens strengthened

1. **Home** — pulse, feed, impact strip, empty state
2. **HomeHero** — persona-driven CTAs (unchanged structure, fed by richer home context)
3. **EvidenceStep** — text-only notice testid, camera-denied gallery CTA
4. **ReviewStep** — intelligent duplicate + protective suspicious copy
5. **SuccessStep** — emotional payoff + next actions
6. **VerificationPage** — community verification hero
7. **NearbyIssuesPage** — support testid, page testid
8. **IssueDetailPage** — via SuspiciousIssueNotice + seed copy
9. **RewardsPage** — at-a-glance + page testid
10. **AuthPage** — admin routing fix

## Copy principles applied

- **Civic, not bureaucratic** — "crews," "neighbors," "ward," not "ticket"
- **Protective, not punitive** — "quality check," "guardrails," "honest reporters"
- **Action-oriented** — every empty state has a next step
- **Premium tone** — short sentences, no exclamation spam, no "complaint"

## Remaining intentional limits

- Map tiles are stylized placeholders (not live Mapbox)
- 6 seed reports (curated density for demo clarity)
- SVG media thumbnails in feed (real upload in report flow)
- Grok AI optional — mock path always works

## Files touched (engineering)

- `src/features/home/HomePage.tsx`
- `src/components/home/CivicPulseStrip.tsx`
- `src/lib/report-display.ts`
- `src/services/mock/seed/reports.ts`, `issueUpdates.ts`, `admin.ts`
- `src/features/reporting/steps/ReviewStep.tsx`, `SuccessStep.tsx`
- `src/features/verification/VerificationPage.tsx`
- `src/features/rewards/RewardsPage.tsx`
- `src/components/rewards/RewardsAtAGlance.tsx`
- `src/components/issues/SuspiciousIssueNotice.tsx`, `DuplicateSupportNudge.tsx`
- `src/lib/media-capture.ts`
- `src/features/onboarding/AuthPage.tsx` (prior session)
