import { create } from 'zustand';
import type { MapCoordinates } from '@/services/maps/types';

interface MapState {
  center: MapCoordinates;
  zoom: number;
  selectedReportId: string | null;
  setCenter: (center: MapCoordinates) => void;
  setZoom: (zoom: number) => void;
  selectReport: (id: string | null) => void;
}

export const useMapStore = create<MapState>((set) => ({
  center: { lat: 12.9716, lng: 77.5946 },
  zoom: 14,
  selectedReportId: null,
  setCenter: (center) => set({ center }),
  setZoom: (zoom) => set({ zoom }),
  selectReport: (selectedReportId) => set({ selectedReportId }),
}));
