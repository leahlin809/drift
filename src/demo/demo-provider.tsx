import { createContext, type PropsWithChildren, useContext, useMemo, useState } from 'react';

import type { EntryType } from '@/domain';

import { DEMO_ENTRIES, DEMO_LOCATIONS } from './seed';
import { EMPTY_DRAFT, type AddEntryDraft, type DemoEntry, type DemoFilter, type DemoLocation, type MatchMode } from './types';

interface DemoContextValue {
  entries: DemoEntry[];
  locations: DemoLocation[];
  draft: AddEntryDraft;
  mapFilters: DemoFilter[];
  matchMode: MatchMode;
  selectedLocationId: string | null;
  updateDraft: (patch: Partial<AddEntryDraft>) => void;
  resetDraft: () => void;
  saveDraft: () => DemoEntry | null;
  addLocation: (location: DemoLocation) => void;
  setMapFilters: (filters: DemoFilter[], mode?: MatchMode) => void;
  setSelectedLocationId: (id: string | null) => void;
}

const DemoContext = createContext<DemoContextValue | null>(null);

export function matchesFilters(entry: DemoEntry, filters: DemoFilter[], mode: MatchMode) {
  if (!filters.length) return true;
  const checks = filters.map((filter) =>
    filter.kind === 'tag' ? entry.tags.includes(filter.name) : entry.topics.includes(filter.name),
  );
  return mode === 'all' ? checks.every(Boolean) : checks.some(Boolean);
}

export function entryMatchesLocation(entry: DemoEntry, locationId: string, locations: DemoLocation[]) {
  return entry.locationIds.some((explicitId) => {
    if (explicitId === locationId) return true;
    return locations.find((location) => location.id === explicitId)?.ancestorIds.includes(locationId) ?? false;
  });
}

export function DemoProvider({ children }: PropsWithChildren) {
  const [entries, setEntries] = useState(DEMO_ENTRIES);
  const [locations, setLocations] = useState(DEMO_LOCATIONS);
  const [draft, setDraft] = useState<AddEntryDraft>(EMPTY_DRAFT);
  const [mapFilters, setFilters] = useState<DemoFilter[]>([]);
  const [matchMode, setMatchMode] = useState<MatchMode>('any');
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);

  const value = useMemo<DemoContextValue>(() => ({
    entries,
    locations,
    draft,
    mapFilters,
    matchMode,
    selectedLocationId,
    updateDraft: (patch) => setDraft((current) => ({ ...current, ...patch })),
    resetDraft: () => setDraft(EMPTY_DRAFT),
    saveDraft: () => {
      if (!draft.title.trim() || !draft.type || !draft.locationIds.length) return null;
      const now = new Date().toISOString();
      const parsedYear = Number.parseInt(draft.year, 10);
      const existing = draft.editingId ? entries.find((item) => item.id === draft.editingId) : undefined;
      const entry: DemoEntry = {
        id: existing?.id ?? `demo-${Date.now()}`,
        title: draft.title.trim(),
        type: draft.type as EntryType,
        creator: draft.creator.trim() || undefined,
        year: Number.isFinite(parsedYear) ? parsedYear : undefined,
        note: draft.note.trim() || undefined,
        source: draft.source.trim() || undefined,
        externalLink: draft.externalLink.trim() || undefined,
        locationIds: draft.locationIds,
        tags: draft.tagsText.split(/[,，#]/).map((tag) => tag.trim()).filter(Boolean),
        topics: existing?.topics ?? [],
        createdAt: existing?.createdAt ?? now,
        updatedAt: now,
      };
      setEntries((current) => existing ? current.map((item) => item.id === existing.id ? entry : item) : [entry, ...current]);
      setDraft(EMPTY_DRAFT);
      return entry;
    },
    addLocation: (location) => setLocations((current) => current.some((item) => item.id === location.id) ? current : [...current, location]),
    setMapFilters: (filters, mode = 'any') => {
      setFilters(filters.slice(0, 5));
      setMatchMode(mode);
    },
    setSelectedLocationId,
  }), [draft, entries, locations, mapFilters, matchMode, selectedLocationId]);

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const value = useContext(DemoContext);
  if (!value) throw new Error('useDemo must be used inside DemoProvider');
  return value;
}
