import type { ISODateTimeString } from './shared';

export const ENTRY_TYPES = [
  'book',
  'movie',
  'music',
  'person',
  'history_event',
  'place_space',
  'article_podcast',
  'other',
] as const;

export type EntryType = (typeof ENTRY_TYPES)[number];

export interface Entry {
  id: string;
  title: string;
  type: EntryType;
  note: string | null;
  source: string | null;
  creator: string | null;
  year: number | null;
  cover: string | null;
  external_link: string | null;
  created_at: ISODateTimeString;
  updated_at: ISODateTimeString;
}

export type CreateEntryInput = Pick<Entry, 'title' | 'type'> &
  Partial<
    Pick<
      Entry,
      'note' | 'source' | 'creator' | 'year' | 'cover' | 'external_link'
    >
  >;

export type UpdateEntryInput = Pick<Entry, 'id' | 'title' | 'type'> &
  Pick<
    Entry,
    'note' | 'source' | 'creator' | 'year' | 'cover' | 'external_link'
  >;
