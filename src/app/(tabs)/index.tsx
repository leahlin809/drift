import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AddEntryLink } from '@/components/common/add-entry-link';
import { MapCanvas } from '@/components/map/map-canvas';
import { useLocalization } from '@/localization';
import { useAppTheme } from '@/theme';

export default function MapScreen() {
  const theme = useAppTheme();
  const { t } = useLocalization();

  return (
    <View style={styles.container}>
      <MapCanvas />
      <SafeAreaView edges={['top']} style={styles.overlay} pointerEvents="box-none">
        <View style={[styles.toolbar, { backgroundColor: theme.colors.surface }]}>
          <Text style={[theme.typography.sectionTitle, { color: theme.colors.textPrimary }]}>
            {t('map.title')}
          </Text>
          <AddEntryLink />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
  },
  toolbar: {
    minHeight: 58,
    paddingLeft: 18,
    paddingRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 22,
  },
});
