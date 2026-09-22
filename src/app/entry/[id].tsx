import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import type { ReactNode } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TagChip } from '@/components/entry/tag-chip';
import { TypeIcon } from '@/components/entry/type-icon';
import { useDemo } from '@/demo';
import { useAppTheme } from '@/theme';

export default function EntryDetailScreen() {
  const theme = useAppTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { entries, locations, setMapFilters, setSelectedLocationId, updateDraft } = useDemo();
  const entry = entries.find((item) => item.id === id);
  if (!entry) return <SafeAreaView style={[styles.container, styles.center, { backgroundColor: theme.colors.background }]}><Text style={[theme.typography.body, { color: theme.colors.textSecondary }]}>这条内容不存在。</Text></SafeAreaView>;
  const explicitLocations = entry.locationIds.map((locationId) => locations.find((location) => location.id === locationId)).filter((location) => location !== undefined);
  const metadata = [entry.creator, entry.year].filter(Boolean).join(' · ');
  const navigateToMap = () => router.replace('/');

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.colors.separator }]}>
        <Pressable accessibilityRole="button" accessibilityLabel="返回" onPress={() => router.back()} style={styles.headerAction}><Ionicons name="chevron-back" size={23} color={theme.colors.textPrimary} /></Pressable>
        <View style={styles.headerSpace} />
        <Pressable accessibilityRole="button" onPress={() => {
          updateDraft({
            editingId: entry.id, title: entry.title, type: entry.type, locationIds: entry.locationIds,
            note: entry.note ?? '', tagsText: entry.tags.join('，'), creator: entry.creator ?? '', year: entry.year?.toString() ?? '',
            source: entry.source ?? '', externalLink: entry.externalLink ?? '',
          });
          router.push('/add-entry');
        }} style={styles.edit}><Text style={[styles.editText, { color: theme.colors.accent }]}>编辑</Text></Pressable>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={[styles.typeIcon, { backgroundColor: theme.colors.iconSurface }]}><TypeIcon type={entry.type} size={24} color={theme.colors.textPrimary} /></View>
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>{entry.title}</Text>
        {metadata ? <Text style={[styles.metadata, { color: theme.colors.textSecondary }]}>{metadata}</Text> : null}

        <Section title="位置">
          {explicitLocations.map((location) => <Pressable key={location.id} onPress={() => { setSelectedLocationId(location.id); setMapFilters([]); navigateToMap(); }} style={[styles.locationRow, { borderBottomColor: theme.colors.separator }]}><View style={[styles.locationIcon, { backgroundColor: theme.colors.iconSurface }]}><Ionicons name={location.type === 'point' ? 'pin-outline' : 'map-outline'} size={18} color={theme.colors.accent} /></View><View style={styles.locationCopy}><Text style={[styles.locationName, { color: theme.colors.textPrimary }]}>{location.localName ?? location.name}</Text><Text style={[styles.locationMeta, { color: theme.colors.textSecondary }]}>{location.type} · {location.parentLabel ?? location.name}</Text></View><Ionicons name="arrow-forward" size={17} color={theme.colors.textSecondary} /></Pressable>)}
        </Section>

        {entry.tags.length ? <Section title="标签"><View style={styles.chips}>{entry.tags.map((tag) => <TagChip key={tag} label={tag} onPress={() => { setSelectedLocationId(null); setMapFilters([{ kind: 'tag', name: tag }]); navigateToMap(); }} />)}</View></Section> : null}
        {entry.topics.length ? <Section title="专题"><View style={styles.chips}>{entry.topics.map((topic) => <TagChip key={topic} label={topic} topic onPress={() => { setSelectedLocationId(null); setMapFilters([{ kind: 'topic', name: topic }]); navigateToMap(); }} />)}</View></Section> : null}
        {entry.note ? <Section title="笔记"><Text style={[styles.note, { color: theme.colors.textPrimary }]}>{entry.note}</Text></Section> : null}
        {entry.source ? <Section title="来源"><Text style={[styles.body, { color: theme.colors.textPrimary }]}>{entry.source}</Text></Section> : null}
        {entry.externalLink ? <Section title="链接"><Pressable accessibilityRole="link" onPress={() => Linking.openURL(entry.externalLink!)} style={styles.link}><Text style={[styles.linkText, { color: theme.colors.accent }]}>打开原页面</Text><Ionicons name="open-outline" size={17} color={theme.colors.accent} /></Pressable></Section> : null}
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  const theme = useAppTheme();
  return <View style={styles.section}><Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>{title}</Text>{children}</View>;
}

const styles = StyleSheet.create({
  container: { flex: 1 }, center: { alignItems: 'center', justifyContent: 'center' },
  header: { minHeight: 59, paddingHorizontal: 6, flexDirection: 'row', alignItems: 'center', borderBottomWidth: StyleSheet.hairlineWidth },
  headerAction: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' }, headerSpace: { flex: 1 },
  edit: { minWidth: 64, minHeight: 48, alignItems: 'center', justifyContent: 'center' }, editText: { fontSize: 16, fontWeight: '600' },
  content: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 64 },
  typeIcon: { width: 48, height: 48, borderRadius: 15, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  title: { fontSize: 30, lineHeight: 38, fontWeight: '700', letterSpacing: -0.6 }, metadata: { fontSize: 16, lineHeight: 22, marginTop: 8 },
  section: { marginTop: 30 }, sectionTitle: { fontSize: 12, lineHeight: 18, fontWeight: '700', marginBottom: 9 },
  locationRow: { minHeight: 62, flexDirection: 'row', alignItems: 'center', borderBottomWidth: StyleSheet.hairlineWidth },
  locationIcon: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 11 },
  locationCopy: { flex: 1 }, locationName: { fontSize: 15, fontWeight: '600' }, locationMeta: { fontSize: 11.5, marginTop: 3, textTransform: 'capitalize' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 }, note: { fontSize: 17, lineHeight: 28 }, body: { fontSize: 16, lineHeight: 24 },
  link: { minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: 7 }, linkText: { fontSize: 16, fontWeight: '600' },
});
