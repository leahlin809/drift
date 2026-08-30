import type { ISODateTimeString } from './shared';

export const LOCATION_TYPES = [
  'country',
  'city',
  'region',
  'point',
  'custom_area',
] as const;

export type LocationType = (typeof LOCATION_TYPES)[number];

export interface PolygonGeometry {
  type: 'Polygon';
  coordinates: number[][][];
}

export interface MultiPolygonGeometry {
  type: 'MultiPolygon';
  coordinates: number[][][][];
}

interface BaseLocation {
  id: string;
  name: string;
  parent_location_id: string | null;
  created_at: ISODateTimeString;
}

export interface CountryLocation extends BaseLocation {
  type: 'country';
}

export interface CityLocation extends BaseLocation {
  type: 'city';
}

export interface RegionLocation extends BaseLocation {
  type: 'region';
}

export interface PointLocation extends BaseLocation {
  type: 'point';
  latitude: number;
  longitude: number;
  address: string | null;
  place_name: string | null;
}

export interface CustomAreaLocation extends BaseLocation {
  type: 'custom_area';
  geometry: PolygonGeometry | MultiPolygonGeometry;
  description: string | null;
}

export type Location =
  | CountryLocation
  | CityLocation
  | RegionLocation
  | PointLocation
  | CustomAreaLocation;
