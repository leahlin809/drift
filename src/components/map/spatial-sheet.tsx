import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import type { DemoEntry, DemoLocation } from '@/demo';
import { useAppTheme } from '@/theme';

import { EntryRow } from '../entry/entry-row';

export function SpatialSheet({ location, entries, locations, onClose, onEntryPress }: {
  location: DemoLocation;
  entries: DemoEntry[];
  locations: DemoLocation[];
  onClose: () => void;
  onEntryPress: (id: string) => void;
}) {
  const theme = useAppTheme();
  const [expanded, setExpanded] = useState(false);
  return (
    <View style={[styles.sheet, expanded ? styles.expanded : styles.medium, { backgroundColor: theme.colors.surface }]}>
      <Pressable accessibilityRole="button" accessibilityLabel={expanded ? '收起' : '展开'} onPress={() => setExpanded((value) => !value)} style={styles.handleButton}><View style={[styles.handle, { backgroundColor: theme.colors.disabled }]} /></Pressable>
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Text numberOfLines={1} style={[theme.typography.sectionTitle, { color: theme.colors.textPrimary }]}>{location.localName ?? location.name}</Text>
          <Text style={[theme.typography.metadata, { color: theme.colors.textSecondary }]}>{entries.length} 条内容</Text>
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel="关闭" onPress={onClose} style={styles.close}><Ionicons name="close" size={21} color={theme.colors.textPrimary} /></Pressable>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
        {entries.length ? entries.map((entry) => <EntryRow key={entry.id} entry={entry} locations={locations} onPress={() => onEntryPress(entry.id)} />) : <View style={styles.empty}><Text style={[theme.typography.body, { color: theme.colors.textSecondary }]}>当前筛选下没有内容。</Text></View>}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: { position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 15, borderTopLeftRadius: 28, borderTopRightRadius: 28, shadowColor: '#07110C', shadowOffset: { width: 0, height: -8 }, shadowOpacity: 0.15, shadowRadius: 26 },
  medium: { height: '45%' },
  expanded: { height: '77%' },
  handleButton: { height: 25, alignItems: 'center', justifyContent: 'center' },
  handle: { width: 38, height: 4, borderRadius: 2 },
  header: { minHeight: 54, paddingHorizontal: 20, paddingBottom: 8, flexDirection: 'row', alignItems: 'center' },
  headerCopy: { flex: 1 },
  close: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  list: { paddingHorizontal: 20, paddingBottom: 30 },
  empty: { paddingVertical: 32, alignItems: 'center' },
});
