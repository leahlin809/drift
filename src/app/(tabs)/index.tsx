import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AddEntryLink } from '@/components/common/add-entry-link';
import { TagChip } from '@/components/entry/tag-chip';
import { FilterSheet } from '@/components/map/filter-sheet';
import { MapCanvas } from '@/components/map/map-canvas';
import { SpatialSheet } from '@/components/map/spatial-sheet';
import { entryMatchesLocation, matchesFilters, useDemo } from '@/demo';
import { useLocalization } from '@/localization';
import { useAppTheme } from '@/theme';

export default function MapScreen() {
  const theme = useAppTheme();
  const { t } = useLocalization();
  const { entries, locations, mapFilters, matchMode, selectedLocationId, setSelectedLocationId, setMapFilters } = useDemo();
  const [filterOpen, setFilterOpen] = useState(false);
  const filteredEntries = useMemo(() => entries.filter((entry) => matchesFilters(entry, mapFilters, matchMode)), [entries, mapFilters, matchMode]);
  const selectedLocation = locations.find((location) => location.id === selectedLocationId) ?? null;
  const sheetEntries = selectedLocation ? filteredEntries.filter((entry) => entryMatchesLocation(entry, selectedLocation.id, locations)) : [];
  const tags = useMemo(() => [...new Set(entries.flatMap((entry) => entry.tags))], [entries]);
  const topics = useMemo(() => [...new Set(entries.flatMap((entry) => entry.topics))], [entries]);

  return (
    <View style={styles.container}>
      <MapCanvas
        entries={filteredEntries}
        locations={locations}
        selectedLocationId={selectedLocationId}
        onLocationPress={(location) => setSelectedLocationId(location.id)}
        onClearSelection={() => setSelectedLocationId(null)}
      />
      <SafeAreaView edges={['top']} style={styles.overlay} pointerEvents="box-none">
        <View style={[styles.toolbar, { backgroundColor: theme.colors.surface }]}>
          <View>
            <Text style={[theme.typography.sectionTitle, styles.brand, { color: theme.colors.textPrimary }]}>{t('map.title')}</Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>你的私人文化地图</Text>
          </View>
          <View style={styles.toolbarActions}>
            <Pressable accessibilityRole="button" accessibilityLabel="筛选地图" onPress={() => setFilterOpen(true)} style={({ pressed }) => [styles.roundButton, { backgroundColor: mapFilters.length ? theme.colors.accent : theme.colors.surfaceSecondary, opacity: pressed ? 0.72 : 1 }]}>
              <Ionicons name="options-outline" size={19} color={mapFilters.length ? theme.colors.onAccent : theme.colors.textPrimary} />
            </Pressable>
            <AddEntryLink compact />
          </View>
        </View>
        {mapFilters.length ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterChips}>
            {mapFilters.slice(0, 2).map((filter) => <TagChip key={`${filter.kind}-${filter.name}`} label={filter.name} topic={filter.kind === 'topic'} />)}
            {mapFilters.length > 2 ? <View style={[styles.moreChip, { backgroundColor: theme.colors.surface }]}><Text style={{ color: theme.colors.textSecondary }}>+{mapFilters.length - 2}</Text></View> : null}
            <Pressable accessibilityRole="button" accessibilityLabel="清除筛选" onPress={() => setMapFilters([])} style={[styles.clearFilter, { backgroundColor: theme.colors.surface }]}><Ionicons name="close" size={18} color={theme.colors.textPrimary} /></Pressable>
          </ScrollView>
        ) : null}
      </SafeAreaView>
      {selectedLocation ? <SpatialSheet location={selectedLocation} entries={sheetEntries} locations={locations} onClose={() => setSelectedLocationId(null)} onEntryPress={(id) => router.push(`/entry/${id}`)} /> : null}
      <FilterSheet visible={filterOpen} filters={mapFilters} matchMode={matchMode} tags={tags} topics={topics} onClose={() => setFilterOpen(false)} onApply={setMapFilters} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, paddingTop: 12, paddingHorizontal: 14 },
  toolbar: { minHeight: 64, paddingLeft: 17, paddingRight: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderRadius: 21, shadowColor: '#15231B', shadowOffset: { width: 0, height: 7 }, shadowOpacity: 0.14, shadowRadius: 18 },
  brand: { lineHeight: 24, fontWeight: '700' },
  subtitle: { fontSize: 10.5, lineHeight: 15, marginTop: 1 },
  toolbarActions: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  roundButton: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  filterChips: { gap: 7, paddingTop: 10, paddingHorizontal: 2 },
  moreChip: { minHeight: 28, minWidth: 38, paddingHorizontal: 9, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  clearFilter: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
});
