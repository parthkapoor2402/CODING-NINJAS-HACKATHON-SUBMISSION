import type { MapsProvider } from './types';

/** Mapbox adapter stub — implement when VITE_MAPS_PROVIDER=mapbox */
export const mapboxMapsProvider: MapsProvider = {
  async reverseGeocode() {
    throw new Error('Mapbox adapter not implemented. Use VITE_MAPS_PROVIDER=mock for MVP.');
  },
  async geocode() {
    throw new Error('Mapbox adapter not implemented. Use VITE_MAPS_PROVIDER=mock for MVP.');
  },
  getDefaultCenter() {
    return { lat: 12.9716, lng: 77.5946 };
  },
  isAvailable() {
    return Boolean(import.meta.env.VITE_MAPBOX_TOKEN);
  },
};
