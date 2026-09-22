import type { DemoEntry, DemoLocation } from '@/demo';

export interface MapCoordinateContext {
  countryCode?: string;
}

export interface MapCanvasProps {
  entries?: DemoEntry[];
  locations?: DemoLocation[];
  selectedLocationId?: string | null;
  onLocationPress?: (location: DemoLocation) => void;
  onCoordinatePress?: (coordinate: [number, number], context?: MapCoordinateContext) => void;
  onClearSelection?: () => void;
  candidateCoordinate?: [number, number] | null;
  focusedLocation?: DemoLocation | null;
  pickerMode?: boolean;
}
