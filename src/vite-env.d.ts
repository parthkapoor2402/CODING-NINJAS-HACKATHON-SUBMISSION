/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string;
  readonly VITE_USE_MOCKS: string;
  readonly VITE_BACKEND_PROVIDER: string;
  readonly VITE_AI_PROVIDER: string;
  readonly VITE_AI_GATEWAY_ENABLED?: string;
  readonly VITE_AGENT_API_BASE_URL?: string;
  /** @deprecated Server-only — use GROK_API_KEY on the API host */
  readonly VITE_GROK_API_KEY?: string;
  readonly VITE_GROK_API_URL?: string;
  readonly VITE_MAPS_PROVIDER: string;
  readonly VITE_MAPBOX_TOKEN?: string;
  readonly VITE_GOOGLE_MAPS_API_KEY?: string;
  readonly VITE_MAX_IMAGE_MB: string;
  readonly VITE_MAX_VIDEO_MB: string;
  readonly VITE_MAX_VIDEO_SEC: string;
  readonly VITE_FORCE_GALLERY_ONLY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
