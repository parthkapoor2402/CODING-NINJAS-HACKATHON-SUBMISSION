import type { GeoLocation } from '@/types';

export type GeolocationError = 'permission_denied' | 'unavailable';

export interface GeolocationSuccess {
  ok: true;
  location: GeoLocation;
}

export interface GeolocationFailure {
  ok: false;
  error: GeolocationError;
}

export type GeolocationResult = GeolocationSuccess | GeolocationFailure;

export interface GeolocationAdapter {
  getCurrentPosition(): Promise<GeolocationResult>;
}

const defaultGeolocationAdapter: GeolocationAdapter = {
  getCurrentPosition() {
    return new Promise((resolve) => {
      if (typeof navigator === 'undefined' || !navigator.geolocation) {
        resolve({ ok: false, error: 'unavailable' });
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          resolve({
            ok: true,
            location: {
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
              accuracyM: pos.coords.accuracy,
            },
          });
        },
        (err) => {
          if (err.code === err.PERMISSION_DENIED) {
            resolve({ ok: false, error: 'permission_denied' });
          } else {
            resolve({ ok: false, error: 'unavailable' });
          }
        },
        { enableHighAccuracy: true, timeout: 8000 },
      );
    });
  },
};

let activeGeolocationAdapter: GeolocationAdapter = defaultGeolocationAdapter;

export function setGeolocationAdapter(adapter: GeolocationAdapter): void {
  activeGeolocationAdapter = adapter;
}

export function resetGeolocationAdapter(): void {
  activeGeolocationAdapter = defaultGeolocationAdapter;
}

export function getGeolocationAdapter(): GeolocationAdapter {
  return activeGeolocationAdapter;
}

export const DEFAULT_PIN: GeoLocation = {
  lat: 12.9716,
  lng: 77.5946,
  address: 'Manual pin — adjust as needed',
};
