import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import type { DemoFilter, MatchMode } from '@/demo';
import { useAppTheme } from '@/theme';

interface FilterSheetProps {
  visible: boolean;
  filters: DemoFilter[];
  matchMode: MatchMode;
  tags: string[];
  topics: string[];
  onClose: () => void;
  onApply: (filters: DemoFilter[], mode: MatchMode) => void;
}

export function FilterSheet({ visible, filters, matchMode, tags, topics, onClose, onApply }: FilterSheetProps) {
  if (!visible) return null;
  const stateKey = `${matchMode}:${filters.map((item) => `${item.kind}-${item.name}`).join('|')}`;
  return <FilterSheetContent key={stateKey} filters={filters} matchMode={matchMode} tags={tags} topics={topics} onClose={onClose} onApply={onApply} />;
}

function FilterSheetContent({ filters, matchMode, tags, topics, onClose, onApply }: Omit<FilterSheetProps, 'visible'>) {
  const theme = useAppTheme();
  const [draft, setDraft] = useState(filters);
  const [mode, setMode] = useState(matchMode);

  const toggle = (filter: DemoFilter) => {
    const exists = draft.some((item) => item.kind === filter.kind && item.name === filter.name);
    if (exists) setDraft((current) => current.filter((item) => item.kind !== filter.kind || item.name !== filter.name));
    else if (draft.length < 5) setDraft((current) => [...current, filter]);
  };

  return (
    <View style={styles.layer}>
      <Pressable accessibilityLabel="关闭筛选" onPress={onClose} style={[styles.scrim, { backgroundColor: theme.colors.overlay }]} />
      <View style={[styles.sheet, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.handle} />
        <View style={styles.header}>
          <Text style={[theme.typography.sectionTitle, { color: theme.colors.textPrimary }]}>筛选地图</Text>
          <Pressable accessibilityRole="button" accessibilityLabel="关闭" onPress={onClose} style={styles.iconButton}><Ionicons name="close" size={22} color={theme.colors.textPrimary} /></Pressable>
        </View>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          <Text style={[styles.label, { color: theme.colors.textSecondary }]}>标签</Text>
          <View style={styles.wrap}>{tags.map((name) => {
            const selected = draft.some((item) => item.kind === 'tag' && item.name === name);
            return <Pressable accessibilityRole="button" accessibilityState={{ selected }} key={name} onPress={() => toggle({ kind: 'tag', name })} style={[styles.option, { backgroundColor: selected ? theme.colors.accent : theme.colors.tagSurface }]}><Text style={[styles.optionText, { color: selected ? theme.colors.onAccent : theme.colors.tagText }]}>#{name}</Text></Pressable>;
          })}</View>
          <Text style={[styles.label, { color: theme.colors.textSecondary }]}>专题</Text>
          <View style={styles.wrap}>{topics.map((name) => {
            const selected = draft.some((item) => item.kind === 'topic' && item.name === name);
            return <Pressable accessibilityRole="button" accessibilityState={{ selected }} key={name} onPress={() => toggle({ kind: 'topic', name })} style={[styles.option, { backgroundColor: selected ? theme.colors.accent : theme.colors.topicSurface }]}><Text style={[styles.optionText, { color: selected ? theme.colors.onAccent : theme.colors.topicText }]}>{name}</Text></Pressable>;
          })}</View>
          <Text style={[styles.label, { color: theme.colors.textSecondary }]}>匹配方式</Text>
          <View style={[styles.segment, { backgroundColor: theme.colors.surfaceSecondary }]}>
            {(['any', 'all'] as const).map((value) => <Pressable accessibilityRole="button" accessibilityState={{ selected: mode === value }} key={value} onPress={() => setMode(value)} style={[styles.segmentItem, mode === value && { backgroundColor: theme.colors.surface }]}><Text style={[styles.segmentText, { color: mode === value ? theme.colors.textPrimary : theme.colors.textSecondary }]}>{value === 'any' ? '任一匹配' : '全部匹配'}</Text></Pressable>)}
          </View>
          <Text style={[styles.count, { color: theme.colors.textSecondary }]}>已选择 {draft.length} / 5</Text>
        </ScrollView>
        <View style={styles.actions}>
          <Pressable accessibilityRole="button" onPress={() => { setDraft([]); setMode('any'); }} style={styles.clear}><Text style={[styles.clearText, { color: theme.colors.textSecondary }]}>清除</Text></Pressable>
          <Pressable accessibilityRole="button" onPress={() => { onApply(draft, mode); onClose(); }} style={[styles.apply, { backgroundColor: theme.colors.accent }]}><Text style={[styles.applyText, { color: theme.colors.onAccent }]}>应用筛选</Text></Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  layer: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 30, justifyContent: 'flex-end' },
  scrim: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  sheet: { maxHeight: '76%', borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingBottom: 18, shadowColor: '#07110C', shadowOffset: { width: 0, height: -8 }, shadowOpacity: 0.16, shadowRadius: 24 },
  handle: { width: 38, height: 4, borderRadius: 2, backgroundColor: '#B7BDB9', alignSelf: 'center', marginTop: 9 },
  header: { minHeight: 56, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  iconButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  scroll: { paddingHorizontal: 20, paddingBottom: 8 },
  label: { fontSize: 12, lineHeight: 18, fontWeight: '700', marginTop: 14, marginBottom: 9 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  option: { minHeight: 34, paddingHorizontal: 12, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  optionText: { fontSize: 13, fontWeight: '600' },
  segment: { flexDirection: 'row', padding: 3, borderRadius: 12 },
  segmentItem: { flex: 1, minHeight: 38, alignItems: 'center', justifyContent: 'center', borderRadius: 9 },
  segmentText: { fontSize: 13, fontWeight: '600' },
  count: { fontSize: 12, marginTop: 12 },
  actions: { flexDirection: 'row', gap: 10, paddingHorizontal: 20, paddingTop: 10 },
  clear: { minHeight: 48, paddingHorizontal: 18, alignItems: 'center', justifyContent: 'center' },
  clearText: { fontWeight: '600' },
  apply: { flex: 1, minHeight: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  applyText: { fontSize: 15, fontWeight: '700' },
});
