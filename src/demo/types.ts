import type { EntryType, LocationType } from '@/domain';

export interface DemoLocation {
  id: string;
  name: string;
  localName?: string;
  type: Exclude<LocationType, 'custom_area'>;
  latitude: number;
  longitude: number;
  countryCode: string;
  ancestorIds: string[];
  parentLabel?: string;
  bbox?: [number, number, number, number];
}

export interface DemoEntry {
  id: string;
  title: string;
  type: EntryType;
  creator?: string;
  year?: number;
  note?: string;
  source?: string;
  externalLink?: string;
  locationIds: string[];
  tags: string[];
  topics: string[];
  createdAt: string;
  updatedAt: string;
}

export type FilterKind = 'tag' | 'topic';

export interface DemoFilter {
  kind: FilterKind;
  name: string;
}

export type MatchMode = 'any' | 'all';

export interface AddEntryDraft {
  editingId: string | null;
  title: string;
  type: EntryType | null;
  locationIds: string[];
  note: string;
  tagsText: string;
  creator: string;
  year: string;
  source: string;
  externalLink: string;
}

export const EMPTY_DRAFT: AddEntryDraft = {
  editingId: null,
  title: '',
  type: null,
  locationIds: [],
  note: '',
  tagsText: '',
  creator: '',
  year: '',
  source: '',
  externalLink: '',
};
