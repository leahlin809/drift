import Mapbox from '@rnmapbox/maps';
import { StyleSheet, Text, View } from 'react-native';

import { useLocalization } from '@/localization';
import { INITIAL_CAMERA, MAPBOX_PUBLIC_TOKEN, MAPBOX_STYLE_URL } from '@/services/map/config';
import { useAppTheme } from '@/theme';

import type { MapCanvasProps } from './map-canvas.types';

if (MAPBOX_PUBLIC_TOKEN) Mapbox.setAccessToken(MAPBOX_PUBLIC_TOKEN);

export function MapCanvas({ onCoordinatePress, candidateCoordinate }: MapCanvasProps) {
  const theme = useAppTheme();
  const { t } = useLocalization();

  if (!MAPBOX_PUBLIC_TOKEN) {
    return (
      <View style={[styles.fallback, { backgroundColor: theme.colors.surfaceSecondary }]}>
        <Text style={[theme.typography.sectionTitle, { color: theme.colors.textPrimary }]}>{t('map.configureToken')}</Text>
        <Text style={[theme.typography.metadata, { color: theme.colors.textSecondary }]}>{t('map.configureTokenHint')}</Text>
      </View>
    );
  }

  return (
    <Mapbox.MapView
      style={styles.map}
      styleURL={MAPBOX_STYLE_URL}
      onPress={(event) => {
        if (event.geometry.type === 'Point') {
          const [longitude, latitude] = event.geometry.coordinates;
          if (typeof longitude === 'number' && typeof latitude === 'number') onCoordinatePress?.([longitude, latitude]);
        }
      }}
    >
      <Mapbox.Camera defaultSettings={INITIAL_CAMERA} />
      {candidateCoordinate ? (
        <Mapbox.PointAnnotation id="candidate-point" coordinate={candidateCoordinate}>
          <View style={[styles.candidate, { backgroundColor: theme.colors.accent }]} />
        </Mapbox.PointAnnotation>
      ) : null}
    </Mapbox.MapView>
  );
}

const styles = StyleSheet.create({
  map: { flex: 1 },
  fallback: { flex: 1, justifyContent: 'center', paddingHorizontal: 32, gap: 12 },
  candidate: { width: 18, height: 18, borderRadius: 9, borderWidth: 3, borderColor: '#FFFFFF' },
});
