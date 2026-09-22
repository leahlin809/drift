import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TagChip } from '@/components/entry/tag-chip';
import { TypeIcon } from '@/components/entry/type-icon';
import { useDemo } from '@/demo';
import { ENTRY_TYPES, type EntryType } from '@/domain';
import { useAppTheme } from '@/theme';

const typeLabels: Record<EntryType, string> = {
  book: '书籍', movie: '电影', music: '音乐', person: '人物', history_event: '历史 / 事件', place_space: '地点 / 空间', article_podcast: '文章 / 播客', other: '其他',
};

const locationTypeLabels = {
  country: 'Country',
  region: 'Region',
  city: 'City',
  point: 'Point',
} as const;

export default function AddEntryScreen() {
  const theme = useAppTheme();
  const { draft, locations, updateDraft, resetDraft, saveDraft } = useDemo();
  const [expanded, setExpanded] = useState(false);
  const canSave = Boolean(draft.title.trim() && draft.type && draft.locationIds.length);
  const dirty = Boolean(draft.title || draft.type || draft.locationIds.length || draft.note || draft.tagsText);
  const cancel = () => {
    if (!dirty) { if (router.canGoBack()) router.back(); else router.replace('/'); return; }
    if (Platform.OS === 'web') {
      if (window.confirm('放弃这次编辑？')) { resetDraft(); if (router.canGoBack()) router.back(); else router.replace('/'); }
      return;
    }
    Alert.alert('放弃这次编辑？', '未保存的内容会丢失。', [{ text: '继续编辑', style: 'cancel' }, { text: '放弃', style: 'destructive', onPress: () => { resetDraft(); router.back(); } }]);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.colors.separator }]}>
        <Pressable accessibilityRole="button" onPress={cancel} style={styles.headerAction}><Text style={[styles.headerText, { color: theme.colors.textSecondary }]}>取消</Text></Pressable>
        <Text style={[styles.headerTitle, { color: theme.colors.textPrimary }]}>{draft.editingId ? '编辑 Entry' : '添加 Entry'}</Text>
        <Pressable accessibilityRole="button" accessibilityState={{ disabled: !canSave }} disabled={!canSave} onPress={() => { if (saveDraft()) { if (router.canGoBack()) router.back(); else router.replace('/'); } }} style={styles.headerAction}><Text style={[styles.headerText, { color: canSave ? theme.colors.accent : theme.colors.disabled }]}>保存</Text></Pressable>
      </View>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={styles.form}>
          <FieldLabel label="标题" required themeColor={theme.colors.textSecondary} />
          <TextInput autoFocus accessibilityLabel="标题" value={draft.title} onChangeText={(title) => updateDraft({ title })} placeholder="记下你想再次遇见的内容" placeholderTextColor={theme.colors.textSecondary} style={[styles.input, styles.titleInput, { color: theme.colors.textPrimary, backgroundColor: theme.colors.surface }]} />

          <FieldLabel label="类型" required themeColor={theme.colors.textSecondary} />
          <View style={styles.typeGrid}>{ENTRY_TYPES.map((type) => {
            const selected = draft.type === type;
            return <Pressable accessibilityRole="button" accessibilityState={{ selected }} key={type} onPress={() => updateDraft({ type })} style={[styles.typeOption, { backgroundColor: selected ? theme.colors.accent : theme.colors.surface }]}><TypeIcon type={type} size={18} color={selected ? theme.colors.onAccent : theme.colors.textSecondary} /><Text numberOfLines={1} style={[styles.typeLabel, { color: selected ? theme.colors.onAccent : theme.colors.textPrimary }]}>{typeLabels[type]}</Text></Pressable>;
          })}</View>

          <FieldLabel label="位置" required themeColor={theme.colors.textSecondary} />
          <View style={styles.locationWrap}>
            {draft.locationIds.map((id) => {
              const location = locations.find((item) => item.id === id);
              return location ? <TagChip key={id} label={`${location.localName ?? location.name} · ${locationTypeLabels[location.type]}`} topic onPress={() => updateDraft({ locationIds: draft.locationIds.filter((value) => value !== id) })} /> : null;
            })}
            <Pressable accessibilityRole="button" onPress={() => router.push('/location-picker')} style={[styles.addLocation, { borderColor: theme.colors.separator }]}><Ionicons name="add" size={18} color={theme.colors.accent} /><Text style={[styles.addLocationText, { color: theme.colors.accent }]}>添加位置</Text></Pressable>
          </View>

          <FieldLabel label="笔记" themeColor={theme.colors.textSecondary} />
          <TextInput accessibilityLabel="笔记" multiline value={draft.note} onChangeText={(note) => updateDraft({ note })} placeholder="为什么想把它放进地图？" placeholderTextColor={theme.colors.textSecondary} textAlignVertical="top" style={[styles.input, styles.noteInput, { color: theme.colors.textPrimary, backgroundColor: theme.colors.surface }]} />

          <FieldLabel label="标签" themeColor={theme.colors.textSecondary} />
          <TextInput accessibilityLabel="标签" value={draft.tagsText} onChangeText={(tagsText) => updateDraft({ tagsText })} placeholder="用逗号分隔，例如：建筑，博物馆" placeholderTextColor={theme.colors.textSecondary} style={[styles.input, { color: theme.colors.textPrimary, backgroundColor: theme.colors.surface }]} />

          <Pressable accessibilityRole="button" accessibilityState={{ expanded }} onPress={() => setExpanded((value) => !value)} style={[styles.moreHeader, { borderBottomColor: theme.colors.separator }]}><Text style={[styles.moreTitle, { color: theme.colors.textPrimary }]}>更多信息</Text><Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={19} color={theme.colors.textSecondary} /></Pressable>
          {expanded ? <View style={styles.moreFields}>
            <TextInput accessibilityLabel="创作者" value={draft.creator} onChangeText={(creator) => updateDraft({ creator })} placeholder="作者 / 导演 / 创作者" placeholderTextColor={theme.colors.textSecondary} style={[styles.input, { color: theme.colors.textPrimary, backgroundColor: theme.colors.surface }]} />
            <TextInput accessibilityLabel="年份" keyboardType="number-pad" value={draft.year} onChangeText={(year) => updateDraft({ year })} placeholder="年份" placeholderTextColor={theme.colors.textSecondary} style={[styles.input, { color: theme.colors.textPrimary, backgroundColor: theme.colors.surface }]} />
            <TextInput accessibilityLabel="来源" value={draft.source} onChangeText={(source) => updateDraft({ source })} placeholder="来源，例如：朋友推荐" placeholderTextColor={theme.colors.textSecondary} style={[styles.input, { color: theme.colors.textPrimary, backgroundColor: theme.colors.surface }]} />
            <TextInput accessibilityLabel="链接" autoCapitalize="none" keyboardType="url" value={draft.externalLink} onChangeText={(externalLink) => updateDraft({ externalLink })} placeholder="外部链接" placeholderTextColor={theme.colors.textSecondary} style={[styles.input, { color: theme.colors.textPrimary, backgroundColor: theme.colors.surface }]} />
          </View> : null}
          {!canSave ? <Text style={[styles.hint, { color: theme.colors.textSecondary }]}>填写标题、类型，并至少添加一个位置后即可保存。</Text> : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function FieldLabel({ label, required = false, themeColor }: { label: string; required?: boolean; themeColor: string }) {
  return <Text style={[styles.fieldLabel, { color: themeColor }]}>{label}{required ? '  · 必填' : ''}</Text>;
}

const styles = StyleSheet.create({
  container: { flex: 1 }, flex: { flex: 1 },
  header: { minHeight: 62, paddingHorizontal: 8, flexDirection: 'row', alignItems: 'center', borderBottomWidth: StyleSheet.hairlineWidth },
  headerAction: { width: 76, minHeight: 48, alignItems: 'center', justifyContent: 'center' },
  headerText: { fontSize: 16, fontWeight: '600' },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 17, fontWeight: '700' },
  form: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 48 },
  fieldLabel: { fontSize: 12, lineHeight: 18, fontWeight: '700', marginTop: 18, marginBottom: 8 },
  input: { minHeight: 48, borderRadius: 14, paddingHorizontal: 14, fontSize: 16 },
  titleInput: { fontSize: 18, fontWeight: '600' },
  noteInput: { minHeight: 112, paddingTop: 13, paddingBottom: 13 },
  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  typeOption: { width: '48%', minHeight: 43, paddingHorizontal: 11, borderRadius: 13, flexDirection: 'row', alignItems: 'center', gap: 8 },
  typeLabel: { flex: 1, fontSize: 13, fontWeight: '600' },
  locationWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  addLocation: { minHeight: 36, paddingHorizontal: 10, borderWidth: 1, borderRadius: 999, flexDirection: 'row', alignItems: 'center', gap: 4 },
  addLocationText: { fontSize: 13, fontWeight: '600' },
  moreHeader: { minHeight: 54, marginTop: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: StyleSheet.hairlineWidth },
  moreTitle: { fontSize: 16, fontWeight: '600' },
  moreFields: { gap: 10, paddingTop: 12 },
  hint: { fontSize: 12, lineHeight: 18, marginTop: 18 },
});
