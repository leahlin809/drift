import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MapCanvas } from '@/components/map/map-canvas';
import type { MapCoordinateContext } from '@/components/map/map-canvas.types';
import { useDemo, type DemoLocation } from '@/demo';
import {
  countryFallback,
  type GeoSearchResult,
  reverseGeography,
  searchGeography,
} from '@/services/map/geocoding';
import { useAppTheme } from '@/theme';

type SearchStatus = 'idle' | 'loading' | 'ready' | 'empty' | 'error';
type LookupStatus = 'idle' | 'loading' | 'ready' | 'partial';
type CandidateSource = 'map' | 'search' | null;

function locationTypeLabel(type: DemoLocation['type']) {
  if (type === 'country') return 'Country';
  if (type === 'region') return 'Region';
  if (type === 'city') return 'City';
  return 'Point';
}

function customPointId(coordinate: [number, number], name: string) {
  let hash = 2166136261;
  for (let index = 0; index < name.length; index += 1) {
    hash ^= name.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `point-${coordinate[0].toFixed(5)}-${coordinate[1].toFixed(5)}-${(hash >>> 0).toString(36)}`;
}

function sameLocation(left: DemoLocation, right: DemoLocation) {
  if (left.type !== right.type || left.countryCode !== right.countryCode) return false;
  if (left.type === 'country') return true;
  const leftNames = [left.name, left.localName].filter(Boolean).map((name) => name!.toLocaleLowerCase());
  const rightNames = [right.name, right.localName].filter(Boolean).map((name) => name!.toLocaleLowerCase());
  return leftNames.some((name) => rightNames.includes(name));
}

function canonicalizeHierarchy(incoming: DemoLocation[], existing: DemoLocation[]) {
  const canonicalByOriginalId = new Map<string, DemoLocation>();
  incoming.forEach((location) => {
    canonicalByOriginalId.set(location.id, existing.find((item) => sameLocation(item, location)) ?? location);
  });
  const idMap = new Map([...canonicalByOriginalId].map(([originalId, location]) => [originalId, location.id]));
  return incoming.map((location) => {
    const matched = canonicalByOriginalId.get(location.id) ?? location;
    if (matched !== location) return matched;
    return {
      ...location,
      ancestorIds: location.ancestorIds.map((id) => idMap.get(id) ?? id),
    };
  });
}

function localSearchResults(query: string, locations: DemoLocation[]): GeoSearchResult[] {
  const needle = query.trim().toLocaleLowerCase();
  if (!needle) return [];
  return locations
    .filter((location) => `${location.name} ${location.localName ?? ''}`.toLocaleLowerCase().includes(needle))
    .slice(0, 6)
    .map((location) => ({
      id: location.id,
      location,
      hierarchy: [location, ...location.ancestorIds
        .map((id) => locations.find((item) => item.id === id))
        .filter((item): item is DemoLocation => Boolean(item))],
      subtitle: `${location.type === 'country' ? 'Country' : location.type === 'region' ? 'Region' : location.type === 'city' ? 'City' : 'Point'} · ${location.parentLabel ?? location.localName ?? location.name}`,
    }));
}

function mergeResults(local: GeoSearchResult[], remote: GeoSearchResult[]) {
  const merged: GeoSearchResult[] = [];
  [...local, ...remote].forEach((result) => {
    if (!merged.some((item) => sameLocation(item.location, result.location))) merged.push(result);
  });
  return merged.slice(0, 6);
}

export default function LocationPickerScreen() {
  const theme = useAppTheme();
  const { draft, locations, addLocation, updateDraft } = useDemo();
  const [selected, setSelected] = useState(draft.locationIds);
  const [pendingLocations, setPendingLocations] = useState<DemoLocation[]>([]);
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GeoSearchResult[]>([]);
  const [searchStatus, setSearchStatus] = useState<SearchStatus>('idle');
  const [coordinate, setCoordinate] = useState<[number, number] | null>(null);
  const [pointName, setPointName] = useState('');
  const [candidateHierarchy, setCandidateHierarchy] = useState<DemoLocation[]>([]);
  const [candidateSource, setCandidateSource] = useState<CandidateSource>(null);
  const [defaultCandidateId, setDefaultCandidateId] = useState<string | null>(null);
  const [lookupStatus, setLookupStatus] = useState<LookupStatus>('idle');
  const [focusedLocation, setFocusedLocation] = useState<DemoLocation | null>(null);
  const reverseControllerRef = useRef<AbortController | null>(null);

  const availableLocations = useMemo(() => {
    const merged = [...locations];
    pendingLocations.forEach((location) => {
      if (!merged.some((item) => item.id === location.id)) merged.push(location);
    });
    return merged;
  }, [locations, pendingLocations]);

  const updateSearchQuery = (value: string) => {
    setQuery(value);
    const needle = value.trim();
    if (!needle) {
      setSearchResults([]);
      setSearchStatus('idle');
      return;
    }
    setSearchResults(localSearchResults(needle, availableLocations));
    setSearchStatus('loading');
  };

  const clearSearch = () => {
    setQuery('');
    setSearchResults([]);
    setSearchStatus('idle');
  };

  useEffect(() => {
    const needle = query.trim();
    if (!needle) return;

    const local = localSearchResults(needle, availableLocations);
    const controller = new AbortController();
    const timer = setTimeout(() => {
      searchGeography(needle, controller.signal)
        .then((remote) => {
          const merged = mergeResults(local, remote);
          setSearchResults(merged);
          setSearchStatus(merged.length ? 'ready' : 'empty');
        })
        .catch((error: unknown) => {
          if (error instanceof Error && error.name === 'AbortError') return;
          setSearchStatus(local.length ? 'ready' : 'error');
        });
    }, 260);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [availableLocations, query]);

  useEffect(() => () => reverseControllerRef.current?.abort(), []);

  const stageHierarchy = (incoming: DemoLocation[]) => {
    const canonical = canonicalizeHierarchy(incoming, availableLocations);
    setPendingLocations((current) => {
      const next = [...current];
      canonical.forEach((location) => {
        if (!locations.some((item) => item.id === location.id) && !next.some((item) => item.id === location.id)) next.push(location);
      });
      return next;
    });
    return canonical;
  };

  const selectExplicitLocation = (location: DemoLocation, hierarchy = candidateHierarchy) => {
    const canonical = stageHierarchy(hierarchy);
    const selectedLocation = canonical.find((item) => sameLocation(item, location)) ?? location;
    setSelected((current) => current.includes(selectedLocation.id) ? current : [...current, selectedLocation.id]);
    setCoordinate(null);
    setCandidateHierarchy([]);
    setCandidateSource(null);
    setDefaultCandidateId(null);
    setPointName('');
    setFocusedLocation(null);
    setLookupStatus('idle');
  };

  const selectPoint = (customName: string) => {
    if (!coordinate || !customName) return;
    const ancestors = candidateHierarchy.filter((location) => location.type !== 'point');
    const canonicalAncestors = stageHierarchy(ancestors);
    const country = canonicalAncestors.find((location) => location.type === 'country');
    const id = customPointId(coordinate, customName);
    const point: DemoLocation = {
      id,
      name: customName,
      localName: customName,
      type: 'point',
      longitude: coordinate[0],
      latitude: coordinate[1],
      countryCode: country?.countryCode ?? 'ZZ',
      ancestorIds: canonicalAncestors
        .filter((location) => location.type === 'city' || location.type === 'region' || location.type === 'country')
        .map((location) => location.id),
      parentLabel: canonicalAncestors
        .filter((location) => location.type === 'city' || location.type === 'country')
        .map((location) => location.localName ?? location.name)
        .join(', '),
    };
    setPendingLocations((current) => current.some((item) => item.id === point.id) ? current : [...current, point]);
    setSelected((current) => current.includes(point.id) ? current : [...current, point.id]);
    setCoordinate(null);
    setCandidateHierarchy([]);
    setCandidateSource(null);
    setDefaultCandidateId(null);
    setPointName('');
    setFocusedLocation(null);
    setLookupStatus('idle');
  };

  const showSearchCandidate = (result: GeoSearchResult) => {
    const canonical = canonicalizeHierarchy(result.hierarchy, availableLocations);
    const location = canonical.find((item) => sameLocation(item, result.location)) ?? result.location;
    setCandidateHierarchy(canonical);
    setCoordinate([location.longitude, location.latitude]);
    setFocusedLocation(location);
    setCandidateSource('search');
    setDefaultCandidateId(location.id);
    setPointName('');
    setLookupStatus('ready');
    clearSearch();
    Keyboard.dismiss();
  };

  const handleCoordinatePress = async (next: [number, number], context?: MapCoordinateContext) => {
    reverseControllerRef.current?.abort();
    const controller = new AbortController();
    reverseControllerRef.current = controller;
    const fallback = context?.countryCode ? [countryFallback(context.countryCode, next)] : [];
    setCoordinate(next);
    setFocusedLocation(null);
    setCandidateHierarchy(canonicalizeHierarchy(fallback, availableLocations));
    setCandidateSource('map');
    setDefaultCandidateId(null);
    setPointName('');
    setLookupStatus('loading');
    clearSearch();
    Keyboard.dismiss();

    try {
      const result = await reverseGeography(next, context?.countryCode, controller.signal);
      const canonical = canonicalizeHierarchy(result.hierarchy, availableLocations);
      setCandidateHierarchy(canonical);
      setPointName(result.suggestedPointName.trim() || `${next[1].toFixed(4)}, ${next[0].toFixed(4)}`);
      setLookupStatus('ready');
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') return;
      setPointName(`${next[1].toFixed(4)}, ${next[0].toFixed(4)}`);
      setLookupStatus('partial');
    }
  };

  const defaultCandidate = defaultCandidateId
    ? candidateHierarchy.find((location) => location.id === defaultCandidateId) ?? null
    : null;
  const customPointName = pointName.trim();
  const selectsSearchResult = candidateSource === 'search' && !customPointName && defaultCandidate;
  const primaryActionLabel = selectsSearchResult
    ? `选择 ${locationTypeLabel(defaultCandidate.type)}`
    : '创建 Point';

  const confirmCandidate = () => {
    if (selectsSearchResult) {
      selectExplicitLocation(defaultCandidate);
      return;
    }
    selectPoint(customPointName);
  };

  const candidateContext = candidateHierarchy
    .filter((location) => location.type !== 'point')
    .map((location) => location.localName ?? location.name)
    .join(' · ');

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.colors.separator }]}>
        <Pressable accessibilityRole="button" onPress={() => router.canGoBack() ? router.back() : router.replace('/add-entry')} style={styles.headerAction}>
          <Text style={[styles.actionText, { color: theme.colors.textSecondary }]}>取消</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: theme.colors.textPrimary }]}>选择位置</Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            pendingLocations.forEach(addLocation);
            updateDraft({ locationIds: selected });
            if (router.canGoBack()) router.back();
            else router.replace('/add-entry');
          }}
          style={styles.headerAction}
        >
          <Text style={[styles.actionText, { color: theme.colors.accent }]}>完成</Text>
        </Pressable>
      </View>

      <View style={styles.searchArea}>
        <View style={[styles.search, { backgroundColor: theme.colors.surface }]}>
          <Ionicons name="search-outline" size={19} color={theme.colors.textSecondary} />
          <TextInput
            accessibilityLabel="搜索位置"
            value={query}
            onChangeText={updateSearchQuery}
            onSubmitEditing={() => {
              const onlyResult = searchResults.length === 1 ? searchResults[0] : undefined;
              if (onlyResult) showSearchCandidate(onlyResult);
            }}
            placeholder="搜索国家、城市或地点"
            placeholderTextColor={theme.colors.textSecondary}
            returnKeyType="search"
            style={[styles.searchInput, { color: theme.colors.textPrimary }]}
          />
          {searchStatus === 'loading' ? <ActivityIndicator size="small" color={theme.colors.accent} /> : null}
          {query ? (
            <Pressable accessibilityRole="button" accessibilityLabel="清除搜索" onPress={clearSearch} style={styles.clearSearch}>
              <Ionicons name="close-circle" size={19} color={theme.colors.textSecondary} />
            </Pressable>
          ) : null}
        </View>

        {query.trim() ? (
          <View style={[styles.results, { backgroundColor: theme.colors.surface, borderColor: theme.colors.separator }]}>
            {searchResults.map((result) => (
              <Pressable
                accessibilityRole="button"
                key={result.id}
                onPress={() => showSearchCandidate(result)}
                style={({ pressed }) => [styles.resultRow, { borderBottomColor: theme.colors.separator, opacity: pressed ? 0.68 : 1 }]}
              >
                <View style={[styles.resultIcon, { backgroundColor: theme.colors.surfaceSecondary }]}>
                  <Ionicons name={result.location.type === 'country' ? 'earth-outline' : result.location.type === 'point' ? 'pin-outline' : 'location-outline'} size={17} color={theme.colors.accent} />
                </View>
                <View style={styles.resultCopy}>
                  <Text numberOfLines={1} style={[styles.resultTitle, { color: theme.colors.textPrimary }]}>{result.location.localName ?? result.location.name}</Text>
                  <Text numberOfLines={1} style={[styles.resultMeta, { color: theme.colors.textSecondary }]}>{result.subtitle}</Text>
                </View>
                <Ionicons name="arrow-forward" size={18} color={theme.colors.accent} />
              </Pressable>
            ))}
            {searchStatus === 'empty' ? <SearchMessage icon="search-outline" text="没有找到对应地点，换个名称试试。" /> : null}
            {searchStatus === 'error' ? <SearchMessage icon="cloud-offline-outline" text="地点搜索暂时不可用，仍可直接点击地图。" /> : null}
          </View>
        ) : null}
      </View>

      <View style={styles.mapArea}>
        <MapCanvas
          pickerMode
          locations={availableLocations}
          candidateCoordinate={coordinate}
          focusedLocation={focusedLocation}
          onCoordinatePress={handleCoordinatePress}
        />
        <View pointerEvents="none" style={[styles.modeHint, { backgroundColor: theme.colors.surface }]}>
          <Ionicons name="locate-outline" size={15} color={theme.colors.accent} />
          <Text style={[styles.modeText, { color: theme.colors.textPrimary }]}>点击地图选择空间</Text>
        </View>

        {coordinate ? (
          <View style={[styles.candidate, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.candidateHeading}>
              <View style={styles.candidateHeadingCopy}>
                <Text style={[styles.candidateLabel, { color: theme.colors.textPrimary }]}>你选择了这里</Text>
                <Text numberOfLines={1} style={[styles.candidateContext, { color: theme.colors.textSecondary }]}>
                  {lookupStatus === 'loading' ? '正在识别附近的城市与国家…' : candidateContext || '未识别到行政层级，仍可保存 Point'}
                </Text>
              </View>
              {lookupStatus === 'loading' ? <ActivityIndicator size="small" color={theme.colors.accent} /> : null}
              <Pressable accessibilityRole="button" accessibilityLabel="关闭候选位置" onPress={() => { setCoordinate(null); setCandidateHierarchy([]); setCandidateSource(null); setDefaultCandidateId(null); setPointName(''); setLookupStatus('idle'); }} style={styles.closeCandidate}>
                <Ionicons name="close" size={19} color={theme.colors.textSecondary} />
              </Pressable>
            </View>

            <Text style={[styles.pointFieldLabel, { color: theme.colors.textSecondary }]}>自定义 Point（可选）</Text>
            <View style={styles.pointEdit}>
              <TextInput
                accessibilityLabel="自定义 Point 名称"
                value={pointName}
                onChangeText={setPointName}
                placeholder={candidateSource === 'search' ? '输入名称后会创建 Point' : '给这个地点起个名字'}
                placeholderTextColor={theme.colors.textSecondary}
                style={[styles.pointInput, { color: theme.colors.textPrimary, backgroundColor: theme.colors.surfaceSecondary }]}
              />
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ disabled: !selectsSearchResult && !customPointName }}
                disabled={!selectsSearchResult && !customPointName}
                onPress={confirmCandidate}
                style={[styles.choosePoint, { backgroundColor: (!selectsSearchResult && !customPointName) ? theme.colors.disabled : theme.colors.accent }]}
              >
                <Text style={[styles.chooseText, { color: theme.colors.onAccent }]}>{primaryActionLabel}</Text>
              </Pressable>
            </View>
            {candidateSource === 'search' && defaultCandidate ? (
              <Text style={[styles.pointHint, { color: theme.colors.textSecondary }]}>留空将选择 {defaultCandidate.localName ?? defaultCandidate.name} · {locationTypeLabel(defaultCandidate.type)}；输入名称则创建 Point。</Text>
            ) : null}

            {candidateHierarchy.some((location) => location.type !== 'point') ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hierarchy}>
                {candidateHierarchy.filter((location) => location.type !== 'point').map((location) => (
                  <CandidateButton
                    key={location.id}
                    label={location.localName ?? location.name}
                    type={locationTypeLabel(location.type)}
                    onPress={() => selectExplicitLocation(location)}
                  />
                ))}
              </ScrollView>
            ) : null}
            {lookupStatus === 'partial' ? <Text style={[styles.partialHint, { color: theme.colors.textSecondary }]}>网络识别失败；Point 仍会保存你实际点击的坐标。</Text> : null}
          </View>
        ) : null}
      </View>

      <View style={[styles.selectedArea, { backgroundColor: theme.colors.background, borderTopColor: theme.colors.separator }]}>
        <Text style={[styles.selectedTitle, { color: theme.colors.textSecondary }]}>已选择 {selected.length}</Text>
        <FlatList
          horizontal
          data={selected}
          keyExtractor={(id) => id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.selectedList}
          renderItem={({ item: id }) => {
            const location = availableLocations.find((value) => value.id === id);
            return location ? (
              <View style={[styles.selectedChip, { backgroundColor: theme.colors.surface }]}>
                <View style={styles.selectedCopy}>
                  <Text numberOfLines={1} style={[styles.selectedName, { color: theme.colors.textPrimary }]}>{location.localName ?? location.name}</Text>
                  <Text style={[styles.selectedMeta, { color: theme.colors.textSecondary }]}>{locationTypeLabel(location.type)}</Text>
                </View>
                <Pressable accessibilityRole="button" accessibilityLabel={`移除 ${location.name}`} onPress={() => setSelected((current) => current.filter((value) => value !== id))} style={styles.remove}>
                  <Ionicons name="close" size={17} color={theme.colors.textSecondary} />
                </Pressable>
              </View>
            ) : null;
          }}
          ListEmptyComponent={<Text style={[styles.empty, { color: theme.colors.textSecondary }]}>可以添加多个显式位置。</Text>}
        />
      </View>
    </SafeAreaView>
  );
}

function SearchMessage({ icon, text }: { icon: keyof typeof Ionicons.glyphMap; text: string }) {
  const theme = useAppTheme();
  return (
    <View style={styles.searchMessage}>
      <Ionicons name={icon} size={18} color={theme.colors.textSecondary} />
      <Text style={[styles.searchMessageText, { color: theme.colors.textSecondary }]}>{text}</Text>
    </View>
  );
}

function CandidateButton({ label, type, onPress }: { label: string; type: string; onPress: () => void }) {
  const theme = useAppTheme();
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.candidateButton, { backgroundColor: theme.colors.surfaceSecondary, opacity: pressed ? 0.7 : 1 }]}>
      <Text numberOfLines={1} style={[styles.candidateName, { color: theme.colors.textPrimary }]}>{label}</Text>
      <Text style={[styles.candidateType, { color: theme.colors.textSecondary }]}>{type}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { minHeight: 60, paddingHorizontal: 8, flexDirection: 'row', alignItems: 'center', borderBottomWidth: StyleSheet.hairlineWidth },
  headerAction: { width: 72, minHeight: 48, alignItems: 'center', justifyContent: 'center' },
  actionText: { fontSize: 16, fontWeight: '600' },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 17, fontWeight: '700' },
  searchArea: { zIndex: 20, padding: 12 },
  search: { minHeight: 48, borderRadius: 15, paddingHorizontal: 13, flexDirection: 'row', alignItems: 'center', gap: 8 },
  searchInput: { flex: 1, minWidth: 0, fontSize: 16 },
  clearSearch: { width: 32, height: 40, alignItems: 'center', justifyContent: 'center' },
  results: { position: 'absolute', top: 66, left: 12, right: 12, maxHeight: 320, borderRadius: 15, borderWidth: StyleSheet.hairlineWidth, paddingHorizontal: 10, shadowColor: '#13241B', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.16, shadowRadius: 22, elevation: 16 },
  resultRow: { minHeight: 62, flexDirection: 'row', alignItems: 'center', gap: 10, borderBottomWidth: StyleSheet.hairlineWidth },
  resultIcon: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  resultCopy: { flex: 1, minWidth: 0 },
  resultTitle: { fontSize: 15, fontWeight: '600' },
  resultMeta: { fontSize: 11.5, marginTop: 3 },
  searchMessage: { minHeight: 62, flexDirection: 'row', alignItems: 'center', gap: 9, paddingHorizontal: 6 },
  searchMessageText: { flex: 1, fontSize: 13, lineHeight: 18 },
  mapArea: { flex: 1, minHeight: 300 },
  modeHint: { position: 'absolute', top: 10, alignSelf: 'center', minHeight: 34, paddingHorizontal: 12, borderRadius: 999, flexDirection: 'row', alignItems: 'center', gap: 6 },
  modeText: { fontSize: 12, fontWeight: '600' },
  candidate: { position: 'absolute', left: 12, right: 12, bottom: 12, borderRadius: 16, padding: 13, shadowColor: '#13241B', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.18, shadowRadius: 20 },
  candidateHeading: { minHeight: 38, flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  candidateHeadingCopy: { flex: 1, minWidth: 0 },
  candidateLabel: { fontSize: 13, fontWeight: '700' },
  candidateContext: { fontSize: 11.5, marginTop: 3 },
  closeCandidate: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  pointFieldLabel: { fontSize: 10.5, fontWeight: '700', marginBottom: 5 },
  pointEdit: { flexDirection: 'row', gap: 8 },
  pointInput: { flex: 1, minHeight: 42, borderRadius: 11, paddingHorizontal: 11, fontSize: 16 },
  choosePoint: { minHeight: 42, paddingHorizontal: 12, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  chooseText: { fontSize: 12, fontWeight: '700' },
  pointHint: { fontSize: 10.5, lineHeight: 15, marginTop: 6 },
  hierarchy: { gap: 7, paddingTop: 9 },
  candidateButton: { minWidth: 96, maxWidth: 150, minHeight: 50, paddingHorizontal: 11, borderRadius: 12, justifyContent: 'center' },
  candidateName: { fontSize: 13, fontWeight: '600' },
  candidateType: { fontSize: 10.5, marginTop: 2 },
  partialHint: { fontSize: 11, lineHeight: 16, marginTop: 8 },
  selectedArea: { height: 106, borderTopWidth: StyleSheet.hairlineWidth, paddingTop: 8 },
  selectedTitle: { fontSize: 11.5, fontWeight: '700', paddingHorizontal: 14, marginBottom: 6 },
  selectedList: { paddingHorizontal: 14, gap: 8 },
  selectedChip: { width: 166, height: 59, borderRadius: 14, paddingLeft: 11, flexDirection: 'row', alignItems: 'center' },
  selectedCopy: { flex: 1, minWidth: 0 },
  selectedName: { fontSize: 13, fontWeight: '600' },
  selectedMeta: { fontSize: 10.5, marginTop: 2 },
  remove: { width: 40, height: 50, alignItems: 'center', justifyContent: 'center' },
  empty: { fontSize: 13, paddingTop: 16 },
});
