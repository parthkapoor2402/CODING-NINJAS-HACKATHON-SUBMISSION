export const APP_NAME = import.meta.env.VITE_APP_NAME ?? 'CivicResolve';

export const ROUTES = {
  splash: '/splash',
  home: '/app/home',
  report: '/app/report',
  track: '/app/track',
  community: '/app/community',
  nearby: '/app/nearby',
  rewards: '/app/rewards',
  profile: '/app/profile',
  family: '/app/family',
  issueDetail: (id: string) => `/app/issue/${id}` as const,
  onboarding: '/onboarding',
  auth: '/auth',
  admin: {
    root: '/admin',
    dashboard: '/admin/dashboard',
    queue: '/admin/queue',
    issueDetail: (id: string) => `/admin/queue/${id}` as const,
    hotspots: '/admin/hotspots',
    analytics: '/admin/analytics',
    moderation: '/admin/moderation',
  },
} as const;

export const MEDIA_LIMITS = {
  maxImageMb: Number(import.meta.env.VITE_MAX_IMAGE_MB ?? 8),
  maxVideoMb: Number(import.meta.env.VITE_MAX_VIDEO_MB ?? 25),
  maxVideoSec: Number(import.meta.env.VITE_MAX_VIDEO_SEC ?? 30),
} as const;

export const DEMO_ACCOUNTS = {
  citizen: 'demo-citizen@local.dev',
  admin: 'demo-admin@local.dev',
  youth: 'demo-youth@local.dev',
  parent: 'demo-parent@local.dev',
  worker: 'demo-worker@local.dev',
} as const;
