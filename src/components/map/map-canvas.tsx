import Mapbox from '@rnmapbox/maps';
import { StyleSheet, Text, View } from 'react-native';

import { useLocalization } from '@/localization';
import {
  INITIAL_CAMERA,
  MAPBOX_PUBLIC_TOKEN,
  MAPBOX_STYLE_URL,
} from '@/services/map/config';
import { useAppTheme } from '@/theme';

if (MAPBOX_PUBLIC_TOKEN) {
  Mapbox.setAccessToken(MAPBOX_PUBLIC_TOKEN);
}

export function MapCanvas() {
  const theme = useAppTheme();
  const { t } = useLocalization();

  if (!MAPBOX_PUBLIC_TOKEN) {
    return (
      <View style={[styles.fallback, { backgroundColor: theme.colors.surfaceSecondary }]}>
        <Text style={[theme.typography.sectionTitle, { color: theme.colors.textPrimary }]}>
          {t('map.configureToken')}
        </Text>
        <Text style={[theme.typography.metadata, { color: theme.colors.textSecondary }]}>
          {t('map.configureTokenHint')}
        </Text>
      </View>
    );
  }

  return (
    <Mapbox.MapView style={styles.map} styleURL={MAPBOX_STYLE_URL}>
      <Mapbox.Camera defaultSettings={INITIAL_CAMERA} />
    </Mapbox.MapView>
  );
}

const styles = StyleSheet.create({
  map: { flex: 1 },
  fallback: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 12,
  },
});
