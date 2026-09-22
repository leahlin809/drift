import mapboxgl, { type Expression, type GeoJSONSource, type MapboxGeoJSONFeature } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useMemo, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useLocalization } from '@/localization';
import { INITIAL_CAMERA, MAPBOX_PUBLIC_TOKEN, MAPBOX_STYLE_URL } from '@/services/map/config';
import { useAppTheme } from '@/theme';

import type { MapCanvasProps } from './map-canvas.types';

const COUNTRY_SOURCE_ID = 'drift-country-boundaries';
const FILL_ID = 'drift-interest-fill';
const OUTLINE_ID = 'drift-selection-outline';
const NODE_SOURCE_ID = 'drift-spatial-nodes';
const REGION_LAYER_ID = 'drift-region-nodes';
const CITY_LAYER_ID = 'drift-city-nodes';
const POINT_LAYER_ID = 'drift-point-nodes';
const SELECTED_NODE_ID = 'drift-selected-node';
const NODE_LAYER_IDS = [POINT_LAYER_ID, CITY_LAYER_ID, REGION_LAYER_ID];

function countryExpression(counts: Map<string, number>): Expression {
  const max = Math.max(1, ...counts.values());
  const expression: unknown[] = ['match', ['get', 'iso_3166_1']];
  if (!counts.size) expression.push('__none__', 'rgba(0,0,0,0)');
  counts.forEach((count, code) => {
    const ratio = count / max;
    expression.push(code, ratio > 0.7 ? '#78988B' : ratio > 0.35 ? '#9CB3AA' : '#C3D0CA');
  });
  expression.push('rgba(0,0,0,0)');
  return expression as Expression;
}

function zoomForType(type: 'country' | 'region' | 'city' | 'point') {
  if (type === 'country') return 3.35;
  if (type === 'region') return 5.2;
  if (type === 'city') return 7;
  return 11;
}

export function MapCanvas({
  entries = [],
  locations = [],
  selectedLocationId = null,
  onLocationPress,
  onCoordinatePress,
  onClearSelection,
  candidateCoordinate,
  focusedLocation,
  pickerMode = false,
}: MapCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const theme = useAppTheme();
  const { t } = useLocalization();

  const countryCounts = useMemo(() => {
    const counts = new Map<string, number>();
    entries.forEach((entry) => {
      const codes = new Set(entry.locationIds
        .map((id) => locations.find((location) => location.id === id)?.countryCode)
        .filter(Boolean));
      codes.forEach((code) => { if (code) counts.set(code, (counts.get(code) ?? 0) + 1); });
    });
    return counts;
  }, [entries, locations]);

  const nodeData = useMemo(() => {
    const counts = new Map<string, number>();
    entries.forEach((entry) => {
      const related = new Set<string>();
      entry.locationIds.forEach((id) => {
        related.add(id);
        locations.find((location) => location.id === id)?.ancestorIds.forEach((ancestorId) => related.add(ancestorId));
      });
      related.forEach((id) => counts.set(id, (counts.get(id) ?? 0) + 1));
    });
    return {
      type: 'FeatureCollection' as const,
      features: locations
        .filter((location) => location.type !== 'country' && (counts.get(location.id) ?? 0) > 0)
        .map((location) => ({
          type: 'Feature' as const,
          geometry: { type: 'Point' as const, coordinates: [location.longitude, location.latitude] },
          properties: {
            id: location.id,
            type: location.type,
            count: counts.get(location.id) ?? 0,
            label: location.localName ?? location.name,
          },
        })),
    };
  }, [entries, locations]);

  const latestRef = useRef({
    countryCounts,
    locations,
    nodeData,
    onClearSelection,
    onCoordinatePress,
    onLocationPress,
    pickerMode,
    selectedLocationId,
  });
  useEffect(() => {
    latestRef.current = {
      countryCounts,
      locations,
      nodeData,
      onClearSelection,
      onCoordinatePress,
      onLocationPress,
      pickerMode,
      selectedLocationId,
    };
  }, [countryCounts, locations, nodeData, onClearSelection, onCoordinatePress, onLocationPress, pickerMode, selectedLocationId]);

  useEffect(() => {
    if (!containerRef.current || !MAPBOX_PUBLIC_TOKEN || mapRef.current) return;
    mapboxgl.accessToken = MAPBOX_PUBLIC_TOKEN;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: MAPBOX_STYLE_URL,
      center: INITIAL_CAMERA.centerCoordinate,
      zoom: INITIAL_CAMERA.zoomLevel,
      attributionControl: false,
    });
    mapRef.current = map;
    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'bottom-right');

    map.on('load', () => {
      map.addSource(COUNTRY_SOURCE_ID, { type: 'vector', url: 'mapbox://mapbox.country-boundaries-v1' });
      map.addLayer({
        id: FILL_ID,
        type: 'fill',
        source: COUNTRY_SOURCE_ID,
        'source-layer': 'country_boundaries',
        paint: { 'fill-color': countryExpression(latestRef.current.countryCounts), 'fill-opacity': 0.4 },
      });
      map.addLayer({
        id: OUTLINE_ID,
        type: 'line',
        source: COUNTRY_SOURCE_ID,
        'source-layer': 'country_boundaries',
        filter: ['==', ['get', 'iso_3166_1'], ''],
        paint: {
          'line-color': '#7B978C',
          'line-width': ['interpolate', ['linear'], ['zoom'], 1, 0.75, 6, 1.2],
          'line-opacity': 0.74,
          'line-blur': 0.28,
        },
      });

      map.addSource(NODE_SOURCE_ID, { type: 'geojson', data: latestRef.current.nodeData });
      map.addLayer({
        id: REGION_LAYER_ID,
        type: 'circle',
        source: NODE_SOURCE_ID,
        minzoom: 3,
        maxzoom: 5.4,
        filter: ['==', ['get', 'type'], 'region'],
        paint: {
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 3, 5, 7, 8],
          'circle-color': '#F6F7F4',
          'circle-opacity': 0.9,
          'circle-stroke-color': '#78988B',
          'circle-stroke-width': 1.4,
        },
      });
      map.addLayer({
        id: CITY_LAYER_ID,
        type: 'circle',
        source: NODE_SOURCE_ID,
        minzoom: 4,
        maxzoom: 8,
        filter: ['==', ['get', 'type'], 'city'],
        paint: {
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 4, 4.5, 9, 7],
          'circle-color': '#6F9284',
          'circle-opacity': 0.94,
          'circle-stroke-color': '#FFFFFF',
          'circle-stroke-width': 2,
        },
      });
      map.addLayer({
        id: POINT_LAYER_ID,
        type: 'circle',
        source: NODE_SOURCE_ID,
        minzoom: 7.8,
        filter: ['==', ['get', 'type'], 'point'],
        paint: {
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 7.8, 4, 13, 6],
          'circle-color': '#315F51',
          'circle-opacity': 0.96,
          'circle-stroke-color': '#FFFFFF',
          'circle-stroke-width': 2,
        },
      });
      map.addLayer({
        id: SELECTED_NODE_ID,
        type: 'circle',
        source: NODE_SOURCE_ID,
        filter: ['==', ['get', 'id'], ''],
        paint: {
          'circle-radius': ['match', ['get', 'type'], 'region', 11, 'city', 10, 8],
          'circle-color': 'rgba(255,255,255,0.34)',
          'circle-stroke-color': '#587D70',
          'circle-stroke-width': 2,
        },
      });

      for (const layerId of [FILL_ID, ...NODE_LAYER_IDS]) {
        map.on('mouseenter', layerId, () => {
          map.getCanvas().style.cursor = latestRef.current.pickerMode ? 'crosshair' : 'pointer';
        });
        map.on('mouseleave', layerId, () => {
          map.getCanvas().style.cursor = latestRef.current.pickerMode ? 'crosshair' : '';
        });
      }
    });

    map.on('click', (event) => {
      const countryFeature = map.getLayer(FILL_ID)
        ? map.queryRenderedFeatures(event.point, { layers: [FILL_ID] })[0] as MapboxGeoJSONFeature | undefined
        : undefined;
      const countryCode = countryFeature?.properties?.iso_3166_1 as string | undefined;

      if (latestRef.current.pickerMode) {
        latestRef.current.onCoordinatePress?.([event.lngLat.lng, event.lngLat.lat], { countryCode });
        return;
      }

      const nodeFeature = map.getLayer(POINT_LAYER_ID)
        ? map.queryRenderedFeatures(event.point, { layers: NODE_LAYER_IDS })[0] as MapboxGeoJSONFeature | undefined
        : undefined;
      const nodeId = nodeFeature?.properties?.id as string | undefined;
      const nodeLocation = latestRef.current.locations.find((location) => location.id === nodeId);
      if (nodeLocation) {
        if (nodeLocation.id === latestRef.current.selectedLocationId) latestRef.current.onClearSelection?.();
        else latestRef.current.onLocationPress?.(nodeLocation);
        return;
      }

      const country = latestRef.current.locations.find((location) => location.type === 'country' && location.countryCode === countryCode);
      if (country) {
        if (country.id === latestRef.current.selectedLocationId) latestRef.current.onClearSelection?.();
        else latestRef.current.onLocationPress?.(country);
      } else {
        latestRef.current.onClearSelection?.();
      }
    });

    return () => {
      markerRef.current?.remove();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (map?.getLayer(FILL_ID)) map.setPaintProperty(FILL_ID, 'fill-color', countryExpression(countryCounts));
    const source = map?.getSource(NODE_SOURCE_ID) as GeoJSONSource | undefined;
    source?.setData(nodeData);
  }, [countryCounts, nodeData]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const selected = locations.find((location) => location.id === selectedLocationId);
    const applySelection = () => {
      if (map.getLayer(OUTLINE_ID)) {
        map.setFilter(OUTLINE_ID, selected?.type === 'country'
          ? ['==', ['get', 'iso_3166_1'], selected.countryCode]
          : ['==', ['get', 'iso_3166_1'], '']);
      }
      if (map.getLayer(SELECTED_NODE_ID)) {
        map.setFilter(SELECTED_NODE_ID, selected && selected.type !== 'country'
          ? ['==', ['get', 'id'], selected.id]
          : ['==', ['get', 'id'], '']);
      }
    };
    if (map.isStyleLoaded()) applySelection();
    else map.once('load', applySelection);
    if (selected) {
      map.easeTo({
        center: [selected.longitude, selected.latitude],
        zoom: zoomForType(selected.type),
        duration: 720,
        essential: true,
      });
    }
    return () => { map.off('load', applySelection); };
  }, [locations, selectedLocationId]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !focusedLocation) return;
    const move = () => {
      if (focusedLocation.bbox) {
        const [west, south, east, north] = focusedLocation.bbox;
        map.fitBounds([[west, south], [east, north]], {
          padding: 52,
          maxZoom: zoomForType(focusedLocation.type),
          duration: 760,
          essential: true,
        });
      } else {
        map.easeTo({
          center: [focusedLocation.longitude, focusedLocation.latitude],
          zoom: zoomForType(focusedLocation.type),
          duration: 760,
          essential: true,
        });
      }
    };
    if (map.isStyleLoaded()) move();
    else map.once('load', move);
    return () => { map.off('load', move); };
  }, [focusedLocation]);

  useEffect(() => {
    const map = mapRef.current;
    markerRef.current?.remove();
    markerRef.current = null;
    if (!map || !candidateCoordinate) return;
    const element = document.createElement('div');
    element.style.cssText = 'width:18px;height:18px;border-radius:50%;background:#356A5A;border:3px solid white;box-shadow:0 5px 14px rgba(20,40,32,.28)';
    markerRef.current = new mapboxgl.Marker({ element }).setLngLat(candidateCoordinate).addTo(map);
  }, [candidateCoordinate]);

  if (!MAPBOX_PUBLIC_TOKEN) {
    return (
      <View style={[styles.fallback, { backgroundColor: theme.colors.surfaceSecondary }]}>
        <Text style={[theme.typography.sectionTitle, { color: theme.colors.textPrimary }]}>{t('map.configureToken')}</Text>
        <Text style={[theme.typography.metadata, { color: theme.colors.textSecondary }]}>{t('map.configureTokenHint')}</Text>
      </View>
    );
  }

  return <div ref={containerRef} aria-label={pickerMode ? '选择位置地图' : '所见文化地图'} style={{ width: '100%', height: '100%' }} />;
}

const styles = StyleSheet.create({
  fallback: { flex: 1, justifyContent: 'center', paddingHorizontal: 32, gap: 12 },
});
