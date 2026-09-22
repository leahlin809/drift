import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { DemoEntry, DemoLocation } from '@/demo';
import { useAppTheme } from '@/theme';

import { TagChip } from './tag-chip';
import { TypeIcon } from './type-icon';

export function EntryRow({ entry, locations, onPress }: { entry: DemoEntry; locations: DemoLocation[]; onPress: () => void }) {
  const theme = useAppTheme();
  const locationNames = entry.locationIds
    .map((id) => locations.find((location) => location.id === id)?.localName ?? locations.find((location) => location.id === id)?.name)
    .filter(Boolean);
  const metadata = [entry.creator, entry.year, ...locationNames].filter(Boolean).join(' · ');
  const visibleTags = entry.tags.slice(0, 2);
  const hiddenCount = Math.max(0, entry.tags.length - visibleTags.length);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={entry.title}
      onPress={onPress}
      style={({ pressed }) => [styles.row, { borderBottomColor: theme.colors.separator, backgroundColor: pressed ? theme.colors.surfaceSecondary : 'transparent' }]}
    >
      <View style={[styles.icon, { backgroundColor: theme.colors.iconSurface }]}>
        <TypeIcon type={entry.type} color={theme.colors.textPrimary} />
      </View>
      <View style={styles.content}>
        <Text numberOfLines={1} ellipsizeMode="tail" style={[theme.typography.body, styles.title, { color: theme.colors.textPrimary }]}>{entry.title}</Text>
        <Text numberOfLines={1} ellipsizeMode="tail" style={[theme.typography.metadata, styles.metadata, { color: theme.colors.textSecondary }]}>{metadata || '—'}</Text>
        <View style={styles.tags}>
          {visibleTags.map((tag) => <TagChip key={tag} label={tag} compact />)}
          {hiddenCount ? <Text style={[styles.more, { color: theme.colors.textSecondary }]}>+{hiddenCount}</Text> : null}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { minHeight: 103, flexDirection: 'row', gap: 12, paddingVertical: 14, borderBottomWidth: StyleSheet.hairlineWidth },
  icon: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  content: { flex: 1, minWidth: 0 },
  title: { fontWeight: '600' },
  metadata: { marginTop: 2 },
  tags: { minHeight: 25, flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 7, overflow: 'hidden' },
  more: { fontSize: 12, fontWeight: '700' },
});
