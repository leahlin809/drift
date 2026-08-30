export const MAPBOX_STYLE_URL =
  'mapbox://styles/leahlinmap/cmtelajtw004t01sa2uhw35i8';

export const MAPBOX_PUBLIC_TOKEN =
  process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN?.trim() ?? '';

export const INITIAL_CAMERA = {
  centerCoordinate: [12, 24] as [number, number],
  zoomLevel: 1.4,
};

// Map label localization remains a deliberate future boundary: the current
// Studio style is not mutated at runtime during Foundation.
