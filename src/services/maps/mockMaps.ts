import type { MapsProvider } from './types';

const DEMO_CENTER = { lat: 12.9716, lng: 77.5946 };

export const mockMapsProvider: MapsProvider = {
  async reverseGeocode(lat, lng) {
    return `Demo address near ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  },

  async geocode(address) {
    if (!address.trim()) return null;
    return { lat: DEMO_CENTER.lat, lng: DEMO_CENTER.lng };
  },

  getDefaultCenter() {
    return DEMO_CENTER;
  },

  isAvailable() {
    return true;
  },
};
