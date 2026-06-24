# Phase 1 Test Cases — Onboarding & First Session

## Scope

Splash → onboarding (persona, permissions, auth branch) → home with first-session education.

---

## Unit tests

### `onboardingStore` / persistence

| ID | Case | Expected |
|----|------|----------|
| U1 | Default state | `onboardingComplete: false`, `persona: null` |
| U2 | `setPersona('resident')` | Persona stored in memory |
| U3 | `acknowledgePermission('location')` | `permissions.location === true` |
| U4 | `completeOnboarding()` | `onboardingComplete === true` |
| U5 | `persist` + `hydrate` | State restored from localStorage |
| U6 | `resetOnboarding()` | Clears completion for tests |
| U7 | `setAuthPath('guest')` | `authPath === 'guest'` |

### `getSplashDestination`

| ID | Case | Expected |
|----|------|----------|
| U8 | Not onboarded | `/onboarding` |
| U9 | Onboarded, no session | `/auth` |
| U10 | Onboarded, citizen session | `/app/home` |
| U11 | Onboarded, admin session | `/admin/dashboard` |

### `canAccessCitizenApp`

| ID | Case | Expected |
|----|------|----------|
| U12 | Incomplete onboarding | `false` |
| U13 | Complete + guest session | `true` |
| U14 | Complete + signed-in session | `true` |
| U15 | Complete, no session | `false` |

---

## Component tests

### Splash (`SplashPage`)

| ID | Case | Expected |
|----|------|----------|
| C1 | Renders brand | Shows app name + tagline |
| C2 | Transitions after delay | Navigates to `/onboarding` when not complete |
| C3 | Returning user | Navigates to `/auth` when onboarded, no session |
| C4 | Returning with session | Navigates to `/app/home` when onboarded + session |

### Onboarding flow (`OnboardingPage`)

| ID | Case | Expected |
|----|------|----------|
| C5 | Step 1 persona | Renders motivation/persona options |
| C6 | Persona selection | Selecting enables Continue |
| C7 | Progress to permissions | Continue advances to location education |
| C8 | Location education | Renders location copy + acknowledge |
| C9 | Camera education | Renders camera copy |
| C10 | Notification education | Renders notification copy |
| C11 | Auth choice step | Guest + Sign in options visible |

### Persona step

| ID | Case | Expected |
|----|------|----------|
| C12 | All personas listed | commuter, resident, student, family |
| C13 | Store update | Clicking persona updates store |

### Permission education

| ID | Case | Expected |
|----|------|----------|
| C14 | Location screen | Title mentions location |
| C15 | Camera screen | Title mentions camera |
| C16 | Notification screen | Title mentions notification |

### Auth branch

| ID | Case | Expected |
|----|------|----------|
| C17 | Guest branch | `signInAsGuest` called, navigates home, completes onboarding |
| C18 | Sign-in branch | Navigates to `/auth` |

### Auth page (sign-in placeholder)

| ID | Case | Expected |
|----|------|----------|
| C19 | Renders demo sign-in | Sign-in buttons visible |
| C20 | Successful sign-in | Completes onboarding if pending, navigates away |

### Route guards

| ID | Case | Expected |
|----|------|----------|
| C21 | Incomplete → onboarding | `/app/home` redirects to `/onboarding` |
| C22 | Complete returning user | `/onboarding` redirects to `/app/home` if session exists |
| C23 | Complete no session | `/app/home` redirects to `/auth` |

### First-session education (`FirstSessionEducationCard`)

| ID | Case | Expected |
|----|------|----------|
| C24 | New user on home | Card visible with trust/verify/reward copy |
| C25 | After dismiss | Card hidden, `firstSessionEducationSeen` persisted |
| C26 | Returning user | Card not shown |

### Bottom navigation gate

| ID | Case | Expected |
|----|------|----------|
| C27 | Before onboarding | Bottom nav not rendered on onboarding |
| C28 | After guest completion | Bottom nav visible on home |
| C29 | Auth page | Bottom nav not rendered |

---

## E2E (Phase 1 smoke — optional follow-up)

| ID | Case |
|----|------|
| E1 | Full guest path: splash → onboarding → guest → home + education card |
| E2 | Sign-in path: onboarding → auth → citizen home |

---

## Test file map

| File | Covers |
|------|--------|
| `src/test/unit/onboardingStore.test.ts` | U1–U7 |
| `src/test/unit/splash-navigation.test.ts` | U8–U11, U12–U15 |
| `src/test/component/SplashPage.test.tsx` | C1–C4 |
| `src/test/component/OnboardingFlow.test.tsx` | C5–C18 |
| `src/test/component/AuthPage.test.tsx` | C19–C20 |
| `src/test/component/RouteGuards.test.tsx` | C21–C23 |
| `src/test/component/FirstSessionEducation.test.tsx` | C24–C26 |
| `src/test/component/BottomNavGate.test.tsx` | C27–C29 |
