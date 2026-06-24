export interface MapCoordinates {
  lat: number;
  lng: number;
}

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface MapMarker {
  id: string;
  position: MapCoordinates;
  category: string;
  label?: string;
}

export interface MapsProvider {
  reverseGeocode(lat: number, lng: number): Promise<string>;
  geocode(address: string): Promise<MapCoordinates | null>;
  getDefaultCenter(): MapCoordinates;
  isAvailable(): boolean;
}
