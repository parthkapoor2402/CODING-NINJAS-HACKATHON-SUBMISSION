import type { Persona } from '@/types/onboarding';

export const ONBOARDING_STEPS = [
  'persona',
  'location',
  'camera',
  'notifications',
  'auth',
] as const;

export type OnboardingStepId = (typeof ONBOARDING_STEPS)[number];

/** Core value props shown during onboarding */
export const VALUE_PILLARS = [
  {
    id: 'report',
    title: 'Report local issues',
    description: 'Pin real problems with photo and location in under a minute.',
  },
  {
    id: 'improve',
    title: 'Improve your neighborhood',
    description: 'Track what gets fixed and see impact on the block you care about.',
  },
  {
    id: 'verify',
    title: 'Verify community reports',
    description: 'Confirm what you see — help good reports rise, duplicates fade.',
  },
  {
    id: 'recognition',
    title: 'Earn trusted recognition',
    description: 'Rewards follow verified contribution, not noise or point farming.',
  },
] as const;

export const PERSONAS = [
  {
    id: 'commuter' as const,
    label: 'Daily commuter',
    description: 'I notice issues on my route to work or school.',
    icon: 'route',
  },
  {
    id: 'resident' as const,
    label: 'Neighborhood resident',
    description: 'I care about what happens on my block.',
    icon: 'home',
  },
  {
    id: 'student' as const,
    label: 'Student contributor',
    description: 'I want to learn civic responsibility hands-on.',
    icon: 'book',
  },
  {
    id: 'family' as const,
    label: 'Family contributor',
    description: 'I report or supervise reports with my household.',
    icon: 'users',
  },
];

export const PERMISSION_EDUCATION = {
  location: {
    title: 'Location helps crews find the issue',
    body: 'We use your location to pin reports on the map. You can always adjust the pin before submitting.',
    button: 'Got it — location makes sense',
    hint: 'Only when you report — never in the background without reason.',
  },
  camera: {
    title: 'Camera evidence builds trust',
    body: 'Photos and short clips help neighbors verify real problems. Gallery upload works too if live capture is unavailable.',
    button: 'Got it — camera makes sense',
    hint: 'Photos from your gallery count — live camera is optional.',
  },
  notifications: {
    title: 'Stay updated on your reports',
    body: 'Notifications let you know when neighbors verify your report or when status changes — no spam, just progress.',
    button: 'Got it — notifications make sense',
    hint: 'You control alerts in settings anytime.',
  },
} as const;

export const GUEST_LIMITATIONS = [
  'Reports saved on this device only until you sign in',
  'Trust score and rewards stay local',
  'Partner perks and leaderboards require an account',
  'Up to 3 reports per day in guest mode',
] as const;

export interface PersonaHomeConfig {
  greeting: string;
  headline: string;
  subline: string;
  primaryCta: string;
  primaryRoute: 'report' | 'community';
  secondaryCta: string;
  secondaryRoute: 'report' | 'community' | 'nearby';
}

export const PERSONA_HOME: Record<Persona, PersonaHomeConfig> = {
  commuter: {
    greeting: 'Good to see you on the move',
    headline: 'Spot something on your route?',
    subline: 'A quick report with photo and pin helps crews respond before the next commute.',
    primaryCta: 'Report on my route',
    primaryRoute: 'report',
    secondaryCta: 'Support a nearby report',
    secondaryRoute: 'community',
  },
  resident: {
    greeting: 'Welcome, neighbor',
    headline: 'Make your block better',
    subline: 'Local issues get fixed faster when residents report and verify together.',
    primaryCta: 'Report on my block',
    primaryRoute: 'report',
    secondaryCta: 'Confirm an issue nearby',
    secondaryRoute: 'community',
  },
  student: {
    greeting: 'Ready to contribute',
    headline: 'Your first verified report matters',
    subline: 'Learn how civic action works — one real issue, one real follow-through.',
    primaryCta: 'Make my first report',
    primaryRoute: 'report',
    secondaryCta: 'Verify a neighbor’s report',
    secondaryRoute: 'community',
  },
  family: {
    greeting: 'Welcome, together',
    headline: 'Start with one shared issue',
    subline: 'Report responsibly as a household — supervised youth mode available in profile.',
    primaryCta: 'Report as a family',
    primaryRoute: 'report',
    secondaryCta: 'Browse issues to support',
    secondaryRoute: 'nearby',
  },
};

export const DEFAULT_PERSONA_HOME: PersonaHomeConfig = PERSONA_HOME.resident;
