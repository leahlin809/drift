import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AddEntryLink } from '@/components/common/add-entry-link';
import { EntryRow } from '@/components/entry/entry-row';
import { TypeIcon } from '@/components/entry/type-icon';
import { FilterSheet } from '@/components/map/filter-sheet';
import { matchesFilters, useDemo, type DemoFilter, type MatchMode } from '@/demo';
import { ENTRY_TYPES, type EntryType } from '@/domain';
import { useLocalization } from '@/localization';
import { useAppTheme } from '@/theme';

const typeLabels: Record<EntryType, string> = {
  book: '书籍', movie: '电影', music: '音乐', person: '人物', history_event: '历史', place_space: '地点', article_podcast: '文章', other: '其他',
};

export default function LibraryScreen() {
  const theme = useAppTheme();
  const { t } = useLocalization();
  const { entries, locations } = useDemo();
  const [query, setQuery] = useState('');
  const [type, setType] = useState<EntryType | null>(null);
  const [filters, setFilters] = useState<DemoFilter[]>([]);
  const [matchMode, setMatchMode] = useState<MatchMode>('any');
  const [filterOpen, setFilterOpen] = useState(false);
  const tags = useMemo(() => [...new Set(entries.flatMap((entry) => entry.tags))], [entries]);
  const topics = useMemo(() => [...new Set(entries.flatMap((entry) => entry.topics))], [entries]);
  const results = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    return entries.filter((entry) => {
      if (type && entry.type !== type) return false;
      if (!matchesFilters(entry, filters, matchMode)) return false;
      if (!needle) return true;
      const locationText = entry.locationIds.map((id) => locations.find((location) => location.id === id)?.name).join(' ');
      return [entry.title, entry.creator, entry.note, locationText, ...entry.tags, ...entry.topics].filter(Boolean).join(' ').toLocaleLowerCase().includes(needle);
    });
  }, [entries, filters, locations, matchMode, query, type]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <View><Text style={[theme.typography.screenTitle, { color: theme.colors.textPrimary }]}>{t('library.title')}</Text><Text style={[styles.count, { color: theme.colors.textSecondary }]}>{results.length} 条内容</Text></View>
        <AddEntryLink compact />
      </View>
      <View style={styles.searchRow}>
        <View style={[styles.search, { backgroundColor: theme.colors.surface }]}>
          <Ionicons name="search-outline" size={18} color={theme.colors.textSecondary} />
          <TextInput accessibilityLabel="搜索收藏" value={query} onChangeText={setQuery} placeholder="搜索标题、作者、标签或地点" placeholderTextColor={theme.colors.textSecondary} style={[styles.searchInput, { color: theme.colors.textPrimary }]} />
          {query ? <Pressable onPress={() => setQuery('')} style={styles.clearSearch}><Ionicons name="close-circle" size={18} color={theme.colors.textSecondary} /></Pressable> : null}
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel="筛选收藏" onPress={() => setFilterOpen(true)} style={[styles.filterButton, { backgroundColor: filters.length ? theme.colors.accent : theme.colors.surface }]}><Ionicons name="options-outline" size={20} color={filters.length ? theme.colors.onAccent : theme.colors.textPrimary} /></Pressable>
      </View>
      <View style={styles.typeFilters}>
        <Pressable onPress={() => setType(null)} style={[styles.typeChip, { backgroundColor: !type ? theme.colors.accent : theme.colors.surface }]}><Text style={[styles.typeText, { color: !type ? theme.colors.onAccent : theme.colors.textPrimary }]}>全部</Text></Pressable>
        {ENTRY_TYPES.map((value) => <Pressable key={value} onPress={() => setType(value)} style={[styles.typeChip, { backgroundColor: type === value ? theme.colors.accent : theme.colors.surface }]}><TypeIcon type={value} size={15} color={type === value ? theme.colors.onAccent : theme.colors.textSecondary} /><Text style={[styles.typeText, { color: type === value ? theme.colors.onAccent : theme.colors.textPrimary }]}>{typeLabels[value]}</Text></Pressable>)}
      </View>
      <FlatList
        data={results}
        keyExtractor={(entry) => entry.id}
        renderItem={({ item }) => <EntryRow entry={item} locations={locations} onPress={() => router.push(`/entry/${item.id}`)} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<View style={styles.empty}><Text style={[theme.typography.sectionTitle, { color: theme.colors.textPrimary }]}>没有符合条件的内容</Text><Text style={[theme.typography.body, styles.emptyBody, { color: theme.colors.textSecondary }]}>换一个关键词，或清除当前筛选。</Text></View>}
      />
      <FilterSheet visible={filterOpen} filters={filters} matchMode={matchMode} tags={tags} topics={topics} onClose={() => setFilterOpen(false)} onApply={(next, mode) => { setFilters(next); setMatchMode(mode); }} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { minHeight: 78, paddingHorizontal: 20, paddingTop: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  count: { fontSize: 12, marginTop: 1 },
  searchRow: { flexDirection: 'row', gap: 9, paddingHorizontal: 20, marginTop: 10 },
  search: { flex: 1, minHeight: 46, borderRadius: 15, paddingHorizontal: 13, flexDirection: 'row', alignItems: 'center', gap: 8 },
  searchInput: { flex: 1, minWidth: 0, fontSize: 15 },
  clearSearch: { width: 30, height: 40, alignItems: 'center', justifyContent: 'center' },
  filterButton: { width: 46, height: 46, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  typeFilters: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, paddingHorizontal: 20, paddingVertical: 13 },
  typeChip: { minHeight: 32, paddingHorizontal: 10, borderRadius: 999, flexDirection: 'row', alignItems: 'center', gap: 5 },
  typeText: { fontSize: 13, fontWeight: '600' },
  list: { paddingHorizontal: 20, paddingBottom: 40 },
  empty: { paddingTop: 90, alignItems: 'center' },
  emptyBody: { marginTop: 8, textAlign: 'center' },
});
