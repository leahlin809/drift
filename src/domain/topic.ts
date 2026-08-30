import type { ISODateTimeString } from './shared';

export interface Topic {
  id: string;
  title: string;
  description: string | null;
  note: string | null;
  cover: string | null;
  created_at: ISODateTimeString;
  updated_at: ISODateTimeString;
}
