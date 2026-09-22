import type { DemoLocation } from '@/demo';

import { MAPBOX_PUBLIC_TOKEN } from './config';

type MapboxFeatureType =
  | 'country'
  | 'region'
  | 'district'
  | 'place'
  | 'locality'
  | 'neighborhood'
  | 'street'
  | 'address';

interface MapboxContextItem {
  mapbox_id?: string;
  name?: string;
  name_preferred?: string;
  country_code?: string;
}

interface MapboxFeature {
  bbox?: [number, number, number, number];
  geometry?: { coordinates?: [number, number] };
  properties?: {
    mapbox_id?: string;
    feature_type?: MapboxFeatureType;
    name?: string;
    name_preferred?: string;
    country_code?: string;
    place_formatted?: string;
    full_address?: string;
    coordinates?: { longitude?: number; latitude?: number };
    bbox?: [number, number, number, number];
    context?: Partial<Record<MapboxFeatureType, MapboxContextItem>>;
  };
}

interface MapboxFeatureCollection {
  features?: MapboxFeature[];
}

export interface GeoSearchResult {
  id: string;
  location: DemoLocation;
  hierarchy: DemoLocation[];
  subtitle: string;
}

export interface ReverseGeocodeResult {
  hierarchy: DemoLocation[];
  suggestedPointName: string;
}

const TYPE_LABELS: Record<DemoLocation['type'], string> = {
  country: 'Country',
  region: 'Region',
  city: 'City',
  point: 'Point',
};

function demoType(type?: MapboxFeatureType): DemoLocation['type'] | null {
  if (type === 'country') return 'country';
  if (type === 'region') return 'region';
  if (type === 'place' || type === 'locality' || type === 'district') return 'city';
  if (type === 'neighborhood' || type === 'street' || type === 'address') return 'point';
  return null;
}

function displayName(item?: MapboxContextItem | MapboxFeature['properties']) {
  return item?.name_preferred?.trim() || item?.name?.trim() || '';
}

function countryName(countryCode: string) {
  try {
    return new Intl.DisplayNames(['zh-CN'], { type: 'region' }).of(countryCode) || countryCode;
  } catch {
    return countryCode;
  }
}

function countryId(countryCode: string) {
  const known: Record<string, string> = { FR: 'france', JP: 'japan', KR: 'south-korea' };
  return known[countryCode] ?? `country-${countryCode.toLocaleLowerCase()}`;
}

function coordinates(feature: MapboxFeature): [number, number] | null {
  const longitude = feature.properties?.coordinates?.longitude ?? feature.geometry?.coordinates?.[0];
  const latitude = feature.properties?.coordinates?.latitude ?? feature.geometry?.coordinates?.[1];
  return typeof longitude === 'number' && typeof latitude === 'number' ? [longitude, latitude] : null;
}

function stableId(item: MapboxContextItem | undefined, fallback: string) {
  return item?.mapbox_id ? `mapbox-${item.mapbox_id.replace(/[^a-zA-Z0-9_-]/g, '-')}` : fallback;
}

function buildHierarchy(feature: MapboxFeature, fallbackCoordinate?: [number, number]) {
  const properties = feature.properties;
  const context = properties?.context ?? {};
  const center = coordinates(feature) ?? fallbackCoordinate;
  if (!center) return [];

  const featureType = properties?.feature_type;
  const featureDemoType = demoType(featureType);
  const countryContext = context.country ?? (featureType === 'country' ? properties : undefined);
  const countryCode = (countryContext?.country_code ?? '').toLocaleUpperCase();
  const resolvedCountryCode = countryCode || 'ZZ';
  const countryLabel = (featureType === 'country' ? displayName(properties) : displayName(countryContext)) || countryName(resolvedCountryCode);
  const country: DemoLocation | null = countryCode ? {
    id: countryId(countryCode),
    name: countryLabel,
    localName: countryLabel,
    type: 'country',
    latitude: center[1],
    longitude: center[0],
    countryCode,
    ancestorIds: [],
    bbox: featureType === 'country' ? properties?.bbox ?? feature.bbox : undefined,
  } : null;

  const regionContext = context.region ?? (featureType === 'region' ? properties : undefined);
  const regionLabel = featureType === 'region' ? displayName(properties) : displayName(regionContext);
  const region: DemoLocation | null = regionLabel ? {
    id: stableId(regionContext, `region-${resolvedCountryCode}-${regionLabel}`),
    name: regionLabel,
    localName: regionLabel,
    type: 'region',
    latitude: center[1],
    longitude: center[0],
    countryCode: resolvedCountryCode,
    ancestorIds: country ? [country.id] : [],
    parentLabel: countryLabel,
    bbox: featureType === 'region' ? properties?.bbox ?? feature.bbox : undefined,
  } : null;

  const cityContext = context.place ?? context.locality ?? context.district
    ?? (featureType === 'place' || featureType === 'locality' || featureType === 'district' ? properties : undefined);
  const cityLabel = featureDemoType === 'city' ? displayName(properties) : displayName(cityContext);
  const city: DemoLocation | null = cityLabel ? {
    id: stableId(cityContext, `city-${resolvedCountryCode}-${cityLabel}`),
    name: cityLabel,
    localName: cityLabel,
    type: 'city',
    latitude: center[1],
    longitude: center[0],
    countryCode: resolvedCountryCode,
    ancestorIds: [region?.id, country?.id].filter((id): id is string => Boolean(id)),
    parentLabel: [regionLabel, countryLabel].filter(Boolean).join(', '),
    bbox: featureDemoType === 'city' ? properties?.bbox ?? feature.bbox : undefined,
  } : null;

  const primaryLabel = displayName(properties);
  const point: DemoLocation | null = featureDemoType === 'point' && primaryLabel ? {
    id: stableId(properties, `point-${center[0].toFixed(5)}-${center[1].toFixed(5)}`),
    name: primaryLabel,
    localName: primaryLabel,
    type: 'point',
    latitude: center[1],
    longitude: center[0],
    countryCode: resolvedCountryCode,
    ancestorIds: [city?.id, region?.id, country?.id].filter((id): id is string => Boolean(id)),
    parentLabel: properties?.place_formatted || [cityLabel, regionLabel, countryLabel].filter(Boolean).join(', '),
  } : null;

  return [point, city, region, country].filter((location): location is DemoLocation => Boolean(location));
}

function fallbackCountry(countryCode: string, coordinate: [number, number]): DemoLocation {
  const label = countryName(countryCode);
  return {
    id: countryId(countryCode),
    name: label,
    localName: label,
    type: 'country',
    latitude: coordinate[1],
    longitude: coordinate[0],
    countryCode,
    ancestorIds: [],
  };
}

async function request(url: URL, signal?: AbortSignal) {
  if (!MAPBOX_PUBLIC_TOKEN) throw new Error('Mapbox access token is missing.');
  url.searchParams.set('access_token', MAPBOX_PUBLIC_TOKEN);
  const response = await fetch(url.toString(), { signal });
  if (!response.ok) throw new Error(`Mapbox search failed with ${response.status}.`);
  return response.json() as Promise<MapboxFeatureCollection>;
}

export async function searchGeography(query: string, signal?: AbortSignal): Promise<GeoSearchResult[]> {
  const url = new URL('https://api.mapbox.com/search/geocode/v6/forward');
  url.searchParams.set('q', query);
  url.searchParams.set('language', 'zh,en');
  url.searchParams.set('limit', '6');
  url.searchParams.set('types', 'country,region,place,locality,district');
  const data = await request(url, signal);

  return (data.features ?? []).flatMap((feature) => {
    const hierarchy = buildHierarchy(feature);
    const locationType = demoType(feature.properties?.feature_type);
    const location = hierarchy.find((item) => item.type === locationType);
    if (!location) return [];
    return [{
      id: location.id,
      location,
      hierarchy,
      subtitle: `${TYPE_LABELS[location.type]} · ${location.parentLabel || location.localName || location.name}`,
    }];
  });
}

export async function reverseGeography(
  coordinate: [number, number],
  fallbackCountryCode?: string,
  signal?: AbortSignal,
): Promise<ReverseGeocodeResult> {
  const url = new URL('https://api.mapbox.com/search/geocode/v6/reverse');
  url.searchParams.set('longitude', String(coordinate[0]));
  url.searchParams.set('latitude', String(coordinate[1]));
  url.searchParams.set('language', 'zh,en');
  url.searchParams.set('types', 'country,region,place,locality,district,neighborhood,street,address');
  const data = await request(url, signal);
  const features = data.features ?? [];
  const mostSpecific = features[0];
  const hierarchy = mostSpecific ? buildHierarchy(mostSpecific, coordinate) : [];
  const withFallback = hierarchy.length
    ? hierarchy
    : fallbackCountryCode ? [fallbackCountry(fallbackCountryCode, coordinate)] : [];
  const pointFeature = features.find((feature) => demoType(feature.properties?.feature_type) === 'point');
  const broadestSpecific = withFallback.find((location) => location.type === 'city')
    ?? withFallback.find((location) => location.type === 'region')
    ?? withFallback.find((location) => location.type === 'country');
  return {
    hierarchy: withFallback,
    suggestedPointName: pointFeature?.properties?.full_address
      || displayName(pointFeature?.properties)
      || (broadestSpecific ? `${broadestSpecific.localName ?? broadestSpecific.name}附近` : '自定义地点'),
  };
}

export function countryFallback(countryCode: string, coordinate: [number, number]) {
  return fallbackCountry(countryCode, coordinate);
}
